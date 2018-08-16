

export function getEleInfo () {
    this.ele = document.querySelector(this.options.el)
    this.eleBCR = this.ele.getBoundingClientRect()
}
    
export function init () {
    this.setHistory()
    this.getEleInfo()
    this.appendCanvasElement()

    this.setMapData()
    this.mouseEvt()
}

export function setMapData () {
    let opt = {
        // 默认地图缩放大小 1
		mapScale: 1,
		// 地图边界
		boundary: {},
		// 区块
        blocks: [],
        // 是否有点
        hasPoint: false,
        // 地图移动距离
		mapTranslateX: 0,
		mapTranslateY: 0,
		// hash ID
		colorsHash: {},
		// 当前鼠标移入区索引
		mouseMoveIndex: -1,
		// 选择区域
        holdBlocks: []
    }

    opt.usrData = this.options.usrData
    opt.mirror = this.options.map.mirror || {}

    opt = this.setBoundary(opt)
    opt = this.setBlocks(opt)
    opt = this.setTextName(opt)
    opt = this.getPoints(opt)

    this.history.map[this.history.index] = opt

    this.setMapScale()
}
