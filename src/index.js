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
import * as init from './init.js'
import * as animate from './animate/index.js'
import * as canvas from './canvas.js'
import * as compute from './compute/index.js'
import * as draw from './draw.js'
import * as style from './style.js'

const myCmap = {
	event,
	...init,
	...animate,
	...canvas,
	...compute,
    ...draw,
	...style
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
		// 默认地图缩放大小 1
		this.mapScale = 1
		// 地图边界
		this.boundary = {}
		// 区块
		this.blocks = []
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