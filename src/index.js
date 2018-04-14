/**
 * CMAP
 * @description Canvas 地图
 * @version 2.0.0
 * @author ekxt <https://ektx.github.io/>
 * @see https://github.com/ektx/canvas-map
 * @date 2017-10-27
 */

import * as event from './event/index.js'
import * as init from './init.js'
import * as animate from './animate/index.js'
import * as canvas from './canvas.js'
import * as compute from './compute/index.js'
import * as draw from './draw.js'
import * as style from './style.js'
import * as history from './history.js'

const myCmap = {
	...event,
	...init,
	...animate,
	...canvas,
	...compute,
    ...draw,
	...style,
	...history
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
		// hash ID
		this.colorsHash = {}
		// 当前鼠标移入区索引
		this.mouseMoveIndex = -1
		// 选择区域
		this.holdBlocks = []
	}
}

Object.keys(myCmap).forEach(name => {
	Object.defineProperty(CMap.prototype, name, {
		value: myCmap[name]
	})
})

export default CMap