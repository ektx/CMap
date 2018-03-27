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

		this.ele.appendChild( this.hitMainCanvas )
		this.ele.appendChild( this.mainCanvas )
	}

	getEleInfo () {
		this.ele = document.querySelector(this.options.el)
		this.eleBCR = this.ele.getBoundingClientRect()
	}

	setBoundary () {
		let boundary = this.options.map.boundary
		let xArr = []
		let yArr = []

		for (let i = 0,l = boundary.data.length; i < l; i++) {
			let _data = this.computedData(boundary.data[i])
			xArr.push(_data.x.start, _data.x.end)
			yArr.push(_data.y.start, _data.y.end)
		}

		let xStart = Math.min.apply({}, xArr)
		let yStart = Math.min.apply({}, yArr)
		let xEnd = Math.max.apply({}, xArr)
		let yEnd = Math.max.apply({}, yArr)
		let width = xEnd - xStart
		let height = yEnd - yStart

		Object.assign(boundary, {
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
		})

		// 设置最小缩放
		this.options.map.center = {
			x: this.hitMainCanvas.width / 2,
			y: this.hitMainCanvas.height / 2,
		}
		
		this.mapScale = Math.min(
			this.hitMainCanvas.width / boundary.width, 
			this.hitMainCanvas.height / boundary.height
		)
		
		console.log(this.options)
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

	drawBoundary () {
		this.options.map.boundary.mapData = this.autoSizeData( this.options.map.boundary.data )

		let boundary = this.options.map.boundary

		for (let i = 0, l = boundary.mapData.length;i < l; i++) {
			this.drwaLine(
				boundary.mapData[i],
				boundary.style
			)
		}
	}

	setCtxState (styleOption, ctx) {
		ctx.save()
		ctx.beginPath()

		for (let i in styleOption) {
			ctx[i] = styleOption[i]
		}
		
		return ctx
	}

	drwaLine (data, style) {
		let ctx = this.setCtxState(style, this.ctx)

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

	clearCanvasCtx () {
		this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
		this.hitCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
	}

	setMapScale (val) {
		this.mapScale = val
		this.setToMapCenter()
	}

	setToMapCenter () {
		let boundary = this.options.map.boundary
		console.log(this.mapTranslateX)
		boundary.toMapCenter = {
			x: this.mapTranslateX + (this.mainCanvas.width - boundary.width * this.mapScale) / 2,
			y: this.mapTranslateY + (this.mainCanvas.height - boundary.height * this.mapScale) / 2
		}
		console.log(boundary.toMapCenter)
	}

	/**
	 * 缩放地图
	 * @param {Number} val 缩放大小
	 */
	scaleMap (val) {
		this.setMapScale(val)
		this.clearCanvasCtx()

		this.drawBoundary()
	}

	event () {
		let mapX = 0
		let mapY = 0
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

				console.log(mapX)
				this.clearCanvasCtx()
				this.ctx.translate(mapX, mapY)
				this.drawBoundary()
				this.ctx.setTransform(1, 0, 0, 1, 0, 0)
			}
		})

		this.ele.addEventListener('mousedown', evt => {
			this.mouseDown = true
			mouseMove.hold = true
			mouseMove.x = evt.offsetX * this.DPI
			mouseMove.y = evt.offsetY * this.DPI
		})

		this.ele.addEventListener('mouseup', evt => {
			this.mouseDown = false
			this.mapTranslateX = mapX
			this.mapTranslateY = mapY
			console.log('End', mapX, mapY)
		})
	}

	init () {
		this.getEleInfo()
		this.createMapElement()
		
		this.setBoundary()
		this.setToMapCenter()

		this.drawBoundary()

		this.event()
	}
}

