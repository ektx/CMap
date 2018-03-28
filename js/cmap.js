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

		this.ctx = null
		this.hitCtx = null
		this.mapScale = 1
		// 地图移动距离
		this.mapTranslateX = 0
		this.mapTranslateY = 0
		// 缩放事件
		this.scaleEvtStatus = false
		this.mouseMoveStatus = false
		// hash ID
		this.colorsHash = {}

		this.mouseDownEvt = false
	}

	/**
	 * 质点中心
	 * @param {Array} arr - 数组
	 */
	getCentroid( arr ) {
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

	createMapElement () {
		/**
		 * @returns {Object} - 返回一个生成的canvas元素
		 */
		let createCanvas = () => {
			let canvas = document.createElement('canvas')
			canvas.width = this.eleBCR.width * this.DPI
			canvas.height = this.eleBCR.height * this.DPI

			canvas.style.position = 'absolute'
			canvas.style.width = this.eleBCR.width + 'px'
			canvas.style.height = this.eleBCR.height + 'px'

			return canvas
		}

		this.mainCanvas = createCanvas()
		this.hitMainCanvas = createCanvas()

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
		
		for (let i = 0, l = data.length; i < l; i++) {
			let _data = this.computedData(data[i])
			xArr.push(_data.x.start, _data.x.end)
			yArr.push(_data.y.start, _data.y.end)
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
			}
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

		boundary.mapData = this.autoSizeData( boundary.data )
	}

	
	setBlocks (updateHash) {
		const blocks = this.options.map.blocks
		const areas = blocks.data

		for (let i = 0, l = areas.length; i < l; i++) {
			let _data = areas[i]

			if (!updateHash) {
				Object.assign(_data, this.getMapDataInfo(_data.map), {
					style: blocks.style,
					index: i,
					over: false,
					hold: false
				})

				this.setColorsHashID(_data)
			}

			_data.mapData = this.autoSizeData( _data.map )

		}
	}

	autoSizeData (arr) {
		let _boundary = this.options.map.boundary
		let _toMapCenter = _boundary.toMapCenter
		let getScaleData = (val, index) => {
			// y
			if (index % 2) {
				val = (val - _boundary.y.start) * this.mapScale + _toMapCenter.y
			} 
			// x
			else {
				val = (val - _boundary.x.start) * this.mapScale + _toMapCenter.x
			}
			return val
		}
		
		let loop = (data) => {
			let result = []
			for (let i = 0, l = data.length; i < l; i++) {
				if (Array.isArray(data[i])) {
					result[i] = []
					result[i] = loop(data[i])
				} else {
					result[i] = getScaleData(data[i], i)
				}
			}
			return result
		}
		return loop( arr )
	}

	drawBoundary (Obj) {

		for (let i = 0, l = Obj.mapData.length;i < l; i++) {
			this.drwaLine(
				this.ctx,
				Obj.mapData[i],
				Obj.style
			)

			this.drwaLine(
				this.hitCtx,
				Obj.mapData[i],
				Obj.hitStyle
			)
		}
	}

	drawBlockBoundary () {
		let blocks = this.options.map.blocks

		for (let i = 0,l = blocks.data.length; i < l; i++) {
			let _BD = blocks.data[i]

			this.drawBoundary( _BD )
		}
	}

	drawAllBoundary () {
		// 边界
		this.drawBoundary(this.options.map.boundary)
		// 区
		this.drawBlockBoundary()
	}

	/**
	 * 
	 * @param {Object} ctx - canvas 对象
	 * @param {Array} data - 绘制的线
	 * @param {Object} style - 绘制的样式
	 */
	drwaLine (ctx, data, style) {
		ctx = this.setCtxState(style, ctx)

		for (let i = 0, l = data.length; i < l; i+=2) {
			let x = data[i]
			let y = data[i + 1]
			if (i === 0) {
				ctx.moveTo(x, y)
			} else {
				ctx.lineTo(x, y)
			}
		}

		ctx.stroke()
		ctx.fill()
		ctx.closePath()
		ctx.restore()
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
		this.mapScale = val
		this.setToMapCenter()
		// 重新计算边界
		this.options.map.boundary.mapData = this.autoSizeData( this.options.map.boundary.data )
		this.setBlocks(true)
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
		this.clearCanvasCtx()

		window.requestAnimationFrame(() => this.drawAllBoundary() )
	}

	event () {
		let mapX = 0
		let mapY = 0
		let oldArr = []
		let mouseMove = {
			hold: false,
			x: 0,
			y: 0
		}

		this.ele.addEventListener('mousemove', evt => {
			let x = evt.offsetX * this.DPI
			let y = evt.offsetY * this.DPI
			
			// 按住地图时
			if (evt.buttons && mouseMove.hold) {
				mapX = x - mouseMove.x + this.mapTranslateX
				mapY = y - mouseMove.y + this.mapTranslateY

				this.clearCanvasCtx()
				this.ctx.translate(mapX, mapY)
				this.hitCtx.translate(mapX, mapY)
				this.drawAllBoundary()
				this.ctx.setTransform(1, 0, 0, 1, 0, 0)
				this.hitCtx.setTransform(1, 0, 0, 1, 0, 0)
			}

			const pixel = this.hitCtx.getImageData(x, y, 1, 1).data
			const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
			const shape = this.colorsHash[color]
			if (shape) {
				console.log(shape)
			}
		})

		this.ele.addEventListener('mousedown', evt => {
			this.mouseDownEvt = true
			mouseMove.hold = true
			mouseMove.x = evt.offsetX * this.DPI
			mouseMove.y = evt.offsetY * this.DPI
			
			if (this.scaleEvtStatus) {
				oldArr = [this.mapTranslateX, this.mapTranslateY]
				this.mapTranslateX = 0
				this.mapTranslateY = 0
			}
		})

		this.ele.addEventListener('mouseup', evt => {
			this.mouseDownEvt = false
			this.mapTranslateX = mapX //this.DPI
			this.mapTranslateY = mapY //this.DPI

			// 在缩放过的情况下
			if (this.scaleEvtStatus) {
				this.scaleEvtStatus = false
				this.mouseMoveStatus = oldArr // 坐标发生变化前值
			}
			
			this.scaleMap(this.mapScale)
			this.animate()
			// console.log('End', mapX, mapY, this.mapTranslateX)
		})
	}

	animate () {
		if (!this.mouseDownEvt) {
			this.clearCanvasCtx()
			this.drawAllBoundary() 
			window.requestAnimationFrame(() => {
				this.animate()
			})
		}
	}

	init () {
		this.getEleInfo()
		this.createMapElement()
		
		this.setBoundary()
		this.setBlocks()

		this.animate()

		this.event()
	}
}

