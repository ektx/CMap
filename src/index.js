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

import event from './event/index.js'
import {getEleInfo, init} from './init.js'
import {fadeIn, fadeOut} from './animate/index.js'
import {
	appendCanvasElement, 
	createCanvas, 
	createTemCanvas,
	clearCanvasCtx
} from './canvas.js'
import {
	setBoundary,
	setBlocks,
	setTextName,
	getPoints,
	autoSizeData,
	computedData,
	setMapScale,
	getCentroid,
	getMapDataInfo,
	isInPolygon,
	getBetweenRandom,
	getLikeGeoJson,
	setPoints,
	setToMapCenter,
	setColorsHashID,
	getRandomColor,
	hasSameHashColor,
	scaleMap
} from './compute.js'
import {
    drawAllBoundary,
    drawBoundary,
    drawBlockBoundary,
    drawArc,
    drawText,
    drawCenterLine,
	drawBlockPoints,
	drawLine
} from './draw.js'
import {
	setDPIFontSize,
	setCtxState
} from './style.js'

const myCmap = {
	event,

	getEleInfo,
	init,

	fadeIn,
	fadeOut,

	createCanvas,
	createTemCanvas,
	appendCanvasElement,
	clearCanvasCtx,

	setBoundary,
	setBlocks,
	setTextName,
	getPoints,
	autoSizeData,
	computedData,
	setMapScale,
	getCentroid,
	getMapDataInfo,
	isInPolygon,
	getBetweenRandom,
	getLikeGeoJson,
	setPoints,
	setToMapCenter,
	setColorsHashID,
	getRandomColor,
	hasSameHashColor,
	scaleMap,

    drawAllBoundary,
    drawBoundary,
    drawBlockBoundary,
    drawArc,
    drawText,
    drawCenterLine,
	drawBlockPoints,
	drawLine,

	setDPIFontSize,
	setCtxState
}

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

	animate () {
		if (!this.animatePause) {
			this.drawAllBoundary() 
			window.requestAnimationFrame(() => {
				this.animate()
			})
		}
	}


}

Object.keys(myCmap).forEach(name => {
	Object.defineProperty(CMap.prototype, name, {
		value: myCmap[name]
	})
})

export default CMap