/*
	cmap
	地图信息流向图
	-----------------------------------
	@version: 1.0.0
	@author: ektx
	@date: 2017-10-27

	------------------------------------
	API
	https://github.com/ektx/canvas-map
*/
class CMap {
	constructor (options) {
		this.options = options
		this.DPI = window.devicePixelRatio

		this.mainCanvas = null
		this.ctx = null
		this.hitCtx = null
		this.ctxW = 0
		this.ctxH = 0
		this.mapScale = 1
		// 文字与区块宽度比（文字最大可用大小）
		this.textVsWidth = 2
		// 地图移动距离
		this.mapTranslateX = 0
		this.mapTranslateY = 0
		// 缩放事件
		this.scaleEvtStatus = false
		this.mouseMoveStatus = false
		// hash ID
		this.colorsHash = {}
		// 暂停动画事件
		this.animatePause = true
		// 当前鼠标移入区索引
		this.mouseMoveIndex = -1
		// 选择区域
		this.holdBlocks = []
	}

	/**
	 * 质点中心
	 * @param {Array} arr - 数组
	 */
	getCentroid ( arr ) {
		let twoTimesSignedArea = 0
	    let cxTimes6SignedArea = 0
	    let cyTimes6SignedArea = 0

	    let length = arr.length

	    for ( let i = 0, l = arr.length; i < l; i+=2) {
	        let _x = parseFloat(arr[i])
	        let _y = parseFloat(arr[i+1])
	        let __x = parseFloat(arr[i+2])
	        let __y = parseFloat(arr[i+3])

	        if (i + 3 > arr.length) {
	        	__x = parseFloat(arr[0])
	        	__y = parseFloat(arr[1])
	        }

	        let twoSA = _x * __y - __x * _y

	        twoTimesSignedArea += twoSA
	        cxTimes6SignedArea += (_x + __x) * twoSA
	        cyTimes6SignedArea += (_y + __y) * twoSA
	    }
	    
	    let sixSignedArea = 3 * twoTimesSignedArea

	    return {
			x: ~~(cxTimes6SignedArea / sixSignedArea),
			y: ~~(cyTimes6SignedArea / sixSignedArea)
		}
	}

	/**
	 * 计算数组的最大值最小值
	 * @param {Array} arr - 数组
	 */
	computedData (arr) {
		if (!Array.isArray(arr))
			return console.warn(`你需要传入数组!`)

		let width = 0
		let height = 0
		let xStart = 0
		let yStart = 0
		let xEnd = 0
		let yEnd = 0
		let xArr = []
		let yArr = []
		let data = []

		for (let i = 0, l = arr.length; i < l; i+=2) {
			xArr.push(arr[i])
			yArr.push(arr[i + 1])
		}

		xStart = Math.min.apply({}, xArr)
		xEnd = Math.max.apply({}, xArr)

		yStart = Math.min.apply({}, yArr)
		yEnd = Math.max.apply({}, yArr)

		width = xEnd - xStart
		height = yEnd - yStart

		return {
			width,
			height,
			x: {
				center: xStart + width/2,
				start: xStart, 
				end: xEnd
			},
			y: {
				center: yStart + height/2,
				start: yStart, 
				end: yEnd
			},
			centroid: this.getCentroid(arr)
		}
	}

	/**
	 * @returns {Object} - 返回一个生成的canvas元素
	 */
	createCanvas () {
		let canvas = document.createElement('canvas')
		canvas.width = this.eleBCR.width * this.DPI
		canvas.height = this.eleBCR.height * this.DPI

		canvas.style.position = 'absolute'
		canvas.style.width = this.eleBCR.width + 'px'
		canvas.style.height = this.eleBCR.height + 'px'

		return canvas
	}

	createMapElement () {

		this.mainCanvas = this.createCanvas()
		this.hitMainCanvas = this.createCanvas()

		this.ctx = this.mainCanvas.getContext('2d')
		this.hitCtx = this.hitMainCanvas.getContext('2d')

		// this.ele.appendChild( this.hitMainCanvas )
		this.ele.appendChild( this.mainCanvas )
	}

	getEleInfo () {
		this.ele = document.querySelector(this.options.el)
		this.eleBCR = this.ele.getBoundingClientRect()
	}

	getMapDataInfo (data) {
		let xArr = []
		let yArr = []
		let centroid = {}
		
		for (let i = 0, l = data.length; i < l; i++) {
			let _data = this.computedData(data[i])
			xArr.push(_data.x.start, _data.x.end)
			yArr.push(_data.y.start, _data.y.end)
			centroid = _data.centroid
		}

		let xStart = Math.min.apply({}, xArr)
		let yStart = Math.min.apply({}, yArr)
		let xEnd = Math.max.apply({}, xArr)
		let yEnd = Math.max.apply({}, yArr)
		let width = xEnd - xStart
		let height = yEnd - yStart

		return {
			width,
			height,
			x: {
				start: xStart,
				end: xEnd,
				center: xStart + width / 2
			},
			y: {
				start: yStart,
				end: yEnd,
				center: yStart + height / 2
			},
			centroid
		}
	}

	// 返回2个数之间随机数
	getBetweenRandom (min, max) {
		return min + max * Math.random()
	}

	getLikeGeoJson (arr) {
		let result = []

		for (let i = 0, l = arr.length; i < l; i+=2) {
			result.push([arr[i], arr[i+1]])
		}
		return result
	}

	// 点在多边形内算法，JS判断一个点是否在一个复杂多边形的内部
	// https://blog.csdn.net/heyangyi_19940703/article/details/78606471
	isInPolygon (checkPoint, polygonPoints) { 
		let counter = 0 
		let xinters 
		let p1
		let p2  
		let pointCount = polygonPoints.length  
		
		p1 = polygonPoints[0] 

		for (let i = 1; i <= pointCount; i++) {  
			p2 = polygonPoints[i % pointCount]
			if (  
				checkPoint[0] > Math.min(p1[0], p2[0]) &&  
				checkPoint[0] <= Math.max(p1[0], p2[0])  
			) {  
				if (checkPoint[1] <= Math.max(p1[1], p2[1])) {  
					if (p1[0] != p2[0]) {  
						xinters =  
							(checkPoint[0] - p1[0]) *  
								(p2[1] - p1[1]) /  
								(p2[0] - p1[0]) +  
							p1[1];  
						if (p1[1] == p2[1] || checkPoint[1] <= xinters) {  
							counter++  
						}  
					}  
				}  
			}  
			p1 = p2
		}  
		if (counter % 2 == 0) {  
			return false 
		} else {  
			return true 
		}  
	}

	setBoundary () {
		let boundary = this.options.map.boundary

		Object.assign(boundary, this.getMapDataInfo(boundary.data))

		this.setColorsHashID(boundary)
		
		// 设置最小缩放
		this.options.map.center = {
			x: this.hitMainCanvas.width / 2,
			y: this.hitMainCanvas.height / 2,
		}
		
		this.mapScale = Math.min(
			this.hitMainCanvas.width / boundary.width, 
			this.hitMainCanvas.height / boundary.height
		)

		this.setToMapCenter()

		let clearData = this.autoSizeData( boundary.data )
		boundary.mapData = clearData.result
		boundary.map = clearData.origin
	}

	/**
	 * @param {Boolean} updateHash 是否要更新数据
	 */
	setBlocks (updateHash) {
		const blocks = this.options.map.blocks
		const areas = blocks.data

		const selfStyle = function (style) {
			for (let i in style) {
				this[i] = style[i]
			}
		}

		for (let i = 0, l = areas.length; i < l; i++) {
			let _data = areas[i]
			let clearData = {}
			
			if (!updateHash) {
				Object.assign(_data, this.getMapDataInfo(_data.map), {
					style: new selfStyle(blocks.style),
					index: i,
					over: false,
					hold: false,
					cityName: {
						normal: new selfStyle(blocks.cityName.normal),
						hover: new selfStyle(blocks.cityName.hover)
					}
				})
				
				this.setColorsHashID(_data)

				clearData = this.autoSizeData( _data.map )
			} else {
				clearData = this.autoSizeData(_data.map, _data.map)
			}

			_data.mapData = clearData.result
			_data.map = clearData.origin
		}
	}

	setDPIFontSize (font) {
		let fontArr = font.match(/([\d\.]+)(px|em)/)
		let szie = parseFloat(fontArr[1])
		let unit = fontArr[2]
		font = font.replace(fontArr[0], szie * this.DPI + unit)
		return font
	}

	/**
	 * 
	 * @param {Boolean} notReSetFont 不需要重置字体
	 */
	setTextName (notReSetFont) {
		let map = this.options.map
		let blocks = map.blocks
		let boundary = map.boundary
		let cityName = blocks.cityName
		let move = cityName.move || {x:0, y:0}
		let toMapCenter = boundary.toMapCenter

		// 设置文字与宽度显示比
		this.textVsWidth = cityName ? cityName.txtVSWidth : this.textVsWidth

		blocks.data.forEach(val => {
			let _name = val.cityName
			_name.x = (val.centroid.x - boundary.x.start) * this.mapScale + toMapCenter.x + move.x
			_name.y = (val.centroid.y - boundary.y.start) * this.mapScale + toMapCenter.y + move.y

			if (this.DPI > 1 && !notReSetFont) {
				_name.normal.font = this.setDPIFontSize(_name.normal.font)

				if (_name.hasOwnProperty('hover') && _name.hover.hasOwnProperty('font')) {
					_name.hover.font = this.setDPIFontSize(_name.hover.font)
				}
			}
		})
	}

	getPoints () {
		let blocks = this.options.map.blocks
		let blockData = blocks.data
		let point = blocks.point
		let minR = Math.min.apply({}, point.r)
		let maxR = Math.max.apply({}, point.r)

		let getPoint = val => {
			let x = -1
			let y = -1
			while (true) {
				x = ~~this.getBetweenRandom(val.x.start, val.x.end)
				y = ~~this.getBetweenRandom(val.y.start, val.y.end)
				if (this.isInPolygon([x,y], val.map[0])) {
					return [x,y]
				}
			}
		}

		blockData.forEach(val => {
			if (point.size) {
				let size = point.size
				let pointSize = 1
				
				if (size.min !== size.max) {
					pointSize = ~~this.getBetweenRandom(size.min, size.max)
				}

				val.point = []

				for (let i = 0; i < pointSize; i++) {
					let { x } = val.centroid
					let { y } = val.centroid

					if (size.min !== size.max) [x,y] = getPoint(val)

					val.point.push({
						r: this.getBetweenRandom(minR, maxR) * this.DPI,
						color: point.color[~~this.getBetweenRandom(0, point.color.length)],
						position: {x, y}
					})
				}
			}
		})
	}

	autoSizeData (arr, hasGeoJson) {
		let _boundary = this.options.map.boundary
		let _toMapCenter = _boundary.toMapCenter
		let getScaleData = arr => {
			let result = []
			for (let i = 0, l = arr.length; i < l; i++) {
				let x = arr[i][0]
				let y = arr[i][1]

				x = (x - _boundary.x.start) * this.mapScale + _toMapCenter.x
				y = (y - _boundary.y.start) * this.mapScale + _toMapCenter.y

				result[i] = [x, y]
			}
			return result
		}
		
		let loop = data => {
			let result = []
			let origin = []
			for (let i = 0, l = data.length; i < l; i++) {
				if (Array.isArray(data[i])) {
					if (hasGeoJson) {
						origin[i] = hasGeoJson[i]
					} else {
						origin[i] = this.getLikeGeoJson(data[i])
					}
					result[i] = getScaleData(origin[i])
				}
			}
			return { result, origin }
		}
		return loop( arr )
	}

	/**
	 * 
	 * @param {Object} obj 绘制的区块信息
	 */
	drawBoundary (obj) {
		for (let i = 0, l = obj.mapData.length;i < l; i++) {
			let ctx = this.drawLine(
				this.ctx,
				obj.mapData[i],
				obj.style
			)

			this.drawLine(
				this.hitCtx,
				obj.mapData[i],
				obj.hitStyle
			)
		}
	}

	// 绘制区块边界
	drawBlockBoundary () {
		let blocks = this.options.map.blocks

		for (let i = 0,l = blocks.data.length; i < l; i++) {
			let _BD = blocks.data[i]

			this.drawBoundary( _BD )
		}
	}

	drawAllBoundary () {
		this.clearCanvasCtx()
		// 边界
		this.drawBoundary(this.options.map.boundary)
		// 区
		this.drawBlockBoundary()
		// 点
		this.drawBlockPoints()
		// 城市名
		this.drawText()
	}

	/**
	 * 
	 * @param {Object} ctx - canvas 对象
	 * @param {Array} data - 绘制的线
	 * @param {Object} style - 绘制的样式
	 */
	drawLine (ctx, data, style) {
		ctx = this.setCtxState(style, ctx)

		for (let i = 0, l = data.length; i < l; i++) {
			let x = data[i][0]
			let y = data[i][1]
			if (i === 0) {
				ctx.moveTo(x, y)
			} else {
				ctx.lineTo(x, y)
			}
		}
		ctx.lineJoin = 'round'

		ctx.stroke()
		ctx.fill()
		ctx.closePath()
		ctx.restore()

		return ctx
	}

	/**
	 * @description 绘制圆
	 * @param {Object} ctx canvas 对象
	 * @param {Object} option 设置
	 * @param {Objetc} style 样式
	 */
	drawArc (ctx, option, style) {
		ctx = this.setCtxState(style, ctx)
		ctx.arc(
			option.x, // x
			option.y, // y
			option.r, // R 半径
			option.s, // 开始角度
			option.e, // 结束角度
			option.d  // 顺时针(false)
		)
		ctx.fill()
		ctx.closePath()
		ctx.restore()
	}

	drawText () {
		let ctx = this.ctx
		let Obj = this.options.map.blocks
		
		for (let i = 0, l = Obj.data.length;i < l; i++) {
			let city = Obj.data[i]
			let style = city.cityName.normal
			let width = city.width * this.mapScale
			let txtWidth = ctx.measureText(city.name).width
			
			if (this.mouseMoveIndex === i) {
				style = city.cityName.hover
			}
			
			if (txtWidth < width / this.textVsWidth || city.index === this.mouseMoveIndex) {
				let x = city.cityName.x
				let y = city.cityName.y

				ctx = this.setCtxState(style, this.ctx)
				ctx.textAlign = city.cityName.align || 'center'
				ctx.textBaseline = "middle"		
				ctx.fillText(city.name, x, y)		
				ctx.restore()
			}
		}
	}

	// 中心坐标
	drawCenterLine () {
		this.ctx.beginPath()
		this.ctx.strokeStyle = 'red'
		this.ctx.moveTo(0, this.mainCanvas.height/2)
		this.ctx.lineTo(this.mainCanvas.width, this.mainCanvas.height/2)
		this.ctx.stroke()

		this.ctx.beginPath()
		this.ctx.strokeStyle = 'red'
		this.ctx.moveTo(this.mainCanvas.width/2,0)
		this.ctx.lineTo(this.mainCanvas.width/2, this.mainCanvas.height)
		this.ctx.stroke()
	}

	drawBlockPoints () {
		const data = this.options.map.blocks.data
		for (let i = 0, l = data.length; i < l; i++) {
			data[i]._point.forEach(point => {
				if (data[i].width * this.mapScale > point.r * 5) {
					this.drawArc(
						this.ctx,
						{
							x: point.x,
							y: point.y,
							r: point.r,
							s: 0,
							e: Math.PI * 2,
							d: false
						},
						{
							fillStyle: point.color
						}
					)
				}
			})
		}
	}

	clearCanvasCtx () {
		this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
		this.hitCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
	}

	setCtxState (styleOption, ctx) {
		ctx.save()
		ctx.beginPath()

		for (let i in styleOption) {
			ctx[i] = styleOption[i]
		}	
		return ctx
	}

	setMapScale (val) {
		let boundary = this.options.map.boundary
		this.mapScale = val
		this.setToMapCenter()
		// 重新计算边界
		boundary.mapData = this.autoSizeData(boundary.data, boundary.map).result
		this.setBlocks(true)
		this.setPoints()
		this.setTextName(true)
		this.scaleEvtStatus = true
	}

	setToMapCenter () {
		let boundary = this.options.map.boundary

		boundary.toMapCenter = {
			x: this.mapTranslateX + (this.mainCanvas.width - boundary.width * this.mapScale) / 2,
			y: this.mapTranslateY + (this.mainCanvas.height - boundary.height * this.mapScale) / 2
		}
	}

	setColorsHashID (data) {
		while (true) {
			const colorKey = this.getRandomColor()

			if (!this.colorsHash[colorKey]) {
				this.colorsHash[colorKey] = data
				data.hitStyle = {
					fillStyle: colorKey
				}
				return
			}
		}
	}

	setPoints () {
		const map = this.options.map
		const boundary = map.boundary
		const toMapCenter = boundary.toMapCenter
		const X = boundary.x.start
		const Y = boundary.y.start
		let data = map.blocks.data

		for (let i = 0, l = data.length; i < l; i++) {
			data[i]._point = []
			data[i].point.forEach(point => {
				data[i]._point.push( {
					x: (point.position.x - X) * this.mapScale + toMapCenter.x,
					y: (point.position.y - Y) * this.mapScale + toMapCenter.y,
					r: point.r,
					color: point.color
				})
			})
		}
	}

	getRandomColor () {
		const r = Math.round(Math.random() * 255)
		const g = Math.round(Math.random() * 255)
		const b = Math.round(Math.random() * 255)
		return `rgb(${r},${g},${b})`
	}

	hasSameHashColor (color, shape) {
		return shape.color === color
	}

	/**
	 * 缩放地图
	 * @param {Number} val 缩放大小
	 */
	scaleMap (val) {
		
		if (Array.isArray(this.mouseMoveStatus)) {
			this.mapTranslateX += this.mouseMoveStatus[0]
			this.mapTranslateY += this.mouseMoveStatus[1]
			this.mouseMoveStatus = false
		}

		this.setMapScale(val)

		window.requestAnimationFrame(() => this.drawAllBoundary() )
	}

	event () {
		let mapX = 0
		let mapY = 0
		let oldArr = []
		let _blocks = this.options.map.blocks
		let _selectedMode = _blocks.selectedMode
		let mouseMove = {
			hold: false,
			x: 0,
			y: 0,
			status: false // 记录是否有移动
		}

		let checkInMap = (x, y, callback) => {
			const pixel = this.hitCtx.getImageData(x, y, 1, 1).data
			const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
			const shape = this.colorsHash[color] || {index: -1}

			if (shape) callback(shape)
		}

		let reSetCanvas = (x, y) => {
			mapX = x - mouseMove.x + this.mapTranslateX
			mapY = y - mouseMove.y + this.mapTranslateY

			this.clearCanvasCtx()
			this.ctx.translate(mapX, mapY)
			this.hitCtx.translate(mapX, mapY)
			this.drawAllBoundary()
			this.ctx.setTransform(1, 0, 0, 1, 0, 0)
			this.hitCtx.setTransform(1, 0, 0, 1, 0, 0)
		}

		let inHoldBlocks = index => {
			return this.holdBlocks.includes(this.mouseMoveIndex)
		}

		this.ele.addEventListener('mousemove', evt => {
			let x = evt.offsetX * this.DPI
			let y = evt.offsetY * this.DPI
			
			// 按住地图时
			if (evt.buttons && mouseMove.hold) {
				// 地图拖动
				mouseMove.status = true

				reSetCanvas(x, y)
			} else {
				const _callback = this.options.callback
				
				checkInMap(x, y, shape => {
					// 恢复之前鼠标移入对象效果
					if (shape.index !== this.mouseMoveIndex) {
						if (this.mouseMoveIndex > -1) {
							_blocks.data[this.mouseMoveIndex].style.fillStyle = inHoldBlocks(this.mouseMoveIndex) ? _blocks.style.holdColor : _blocks.style.fillStyle
							window.requestAnimationFrame(() => this.drawAllBoundary() )
						}

						if (shape.index === -1) {
							this.mouseMoveIndex = shape.index
							return
						}

						_blocks.data[shape.index].style.fillStyle = _blocks.style.hoverColor
						this.mouseMoveIndex = shape.index
						
						if (_callback && _callback.hasOwnProperty('mousemove')) {
							_callback.mousemove(evt, shape)
						}
						window.requestAnimationFrame(() => this.drawAllBoundary() )
					} else {
					}
				})
			}

		})

		this.ele.addEventListener('mousedown', evt => {
			this.animatePause = true
			mouseMove.hold = true
			mouseMove.x = evt.offsetX * this.DPI
			mouseMove.y = evt.offsetY * this.DPI
			
			oldArr = [this.mapTranslateX, this.mapTranslateY]
			if (this.scaleEvtStatus) {
				this.mapTranslateX = 0
				this.mapTranslateY = 0
			}
		})

		this.ele.addEventListener('mouseup', evt => {
			mouseMove.hold = false
			
			if (mouseMove.status) {
				// this.animatePause = false
				mouseMove.status = false

				this.mapTranslateX = mapX
				this.mapTranslateY = mapY

				// 在缩放过的情况下
				if (this.scaleEvtStatus) {
					this.scaleEvtStatus = false
					this.mouseMoveStatus = oldArr // 坐标发生变化前值
				}
				
				this.scaleMap(this.mapScale)
				this.animate()
			} else {
				let x = evt.offsetX * this.DPI
				let y = evt.offsetY * this.DPI

				checkInMap(x, y, shape => {
					if (shape.index === -1) return

					if (inHoldBlocks(shape.index)) {
						let _index = this.holdBlocks.indexOf(shape.index)
						
						this.holdBlocks.splice(_index, 1)
					} else {
						if (_selectedMode === 'multiple') {
							this.holdBlocks.push(shape.index)
						} else if (_selectedMode === 'single') {
							if (this.holdBlocks.length) {
								_blocks.data[this.holdBlocks[0]].style.fillStyle = _blocks.style.fillStyle
							}

							this.holdBlocks = [shape.index]
						}
					}

					this.holdBlocks.forEach(val => {
						_blocks.data[val].style.fillStyle = _blocks.style.holdColor
					})
				})

				this.mouseMoveStatus = oldArr 
				this.scaleMap(this.mapScale)
			}
		})
	}

	animate () {
		if (!this.animatePause) {
			this.drawAllBoundary() 
			window.requestAnimationFrame(() => {
				this.animate()
			})
		}
	}

	/**
	 * 
	 * @param {Object} opts
	 * @param {Number} delay 每帧时间 
	 * @param {Number} duration 动画运行时间
	 * @param {Function} delta 对进度操作
	 * @param {Function} callback 每一帧操作
	 */
	stepAnimate (opts) {
		let start = new Date

		let id = setInterval(() => {
			let timePassed = new Date - start
			let progress = timePassed / opts.duration

			if (progress > 1) progress = 1

			let delta = opts.delta(progress)
			opts.callback(delta)

			if (progress == 1) clearInterval(id)
		}, opts.delay || 1000/60)
	}

	linearAni (progress) {
		return progress
	}

	quadAni (progress) {
		return Math.pow(progress, 5)
	}

	backAni (progress) {
		let x = 2
		return Math.pow(progress, 2) * ((x+1) * progress - x)
	}

	makeEaseInOutAni (delta) {
		return function(progress) {
			return 1 - delta(1 - progress)
		}
	}

	fadeIn (time = 1000) {
		this.drawAllBoundary()
		let _canvas = this.createTemCanvas()
		this.clearCanvasCtx()
		

		this.stepAnimate({
			duration: time,
			delta: this.makeEaseInOutAni(this.quadAni),
			callback: delta => {
				let progress = delta * .3
				let scaleDelta = progress + .7
				this.ctx.save()
				this.ctx.globalAlpha = delta
				this.ctx.translate(
					this.mainCanvas.width / 2 * (.3 - progress),
					this.mainCanvas.height / 2 * (.3 - progress)
				)
				this.ctx.scale(scaleDelta, scaleDelta)
				this.clearCanvasCtx()
				this.ctx.drawImage(_canvas, 0, 0)
				this.ctx.restore()
			}
		})
	}

	fadeOut (time = 600) {
		let _canvas = this.createTemCanvas()

		this.stepAnimate({
			duration: time,
			delta: this.backAni,
			callback: delta => {
				this.ctx.save()
				let reDelta = (1 - delta) * .3 + .7 
				this.clearCanvasCtx()
				this.ctx.globalAlpha = 1 - delta
				this.ctx.translate(
					this.mainCanvas.width / 2 * .3 * delta,
					this.mainCanvas.height / 2 * .3 * delta
				)
				this.ctx.scale(reDelta, reDelta)
				this.ctx.drawImage(_canvas, 0, 0)
				this.ctx.restore()
			}
		})
	}

	createTemCanvas () {
		let ctxW = this.mainCanvas.width
		let ctxH = this.mainCanvas.height
		let _canvas = this.createCanvas()
		let copyCtxImg = this.ctx.getImageData(0, 0, ctxW, ctxH)
		
		_canvas.getContext('2d').putImageData(copyCtxImg, 0, 0)
		return _canvas
	}

	init () {
		this.getEleInfo()
		this.createMapElement()
		
		this.setBoundary()
		this.setBlocks()
		this.setTextName()
		this.getPoints()

		this.setPoints()

		// this.drawAllBoundary()

		this.event()
	}
}

export default CMap