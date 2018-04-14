

export function getEleInfo () {
    this.ele = document.querySelector(this.options.el)
    this.eleBCR = this.ele.getBoundingClientRect()
}
    
export function init () {
    this.setHistory()
debugger
    this.getEleInfo()
    this.appendCanvasElement()

    this.setMapData()
    this.mouseEvt()
}

export function setMapData () {
    this.history.map.push({
        // 默认地图缩放大小 1
		mapScale: 1,
		// 地图边界
		boundary: {},
		// 区块
        blocks: [],
        // 地图移动距离
		mapTranslateX: 0,
		mapTranslateY: 0,
		// hash ID
		colorsHash: {},
		// 当前鼠标移入区索引
		mouseMoveIndex: -1,
		// 选择区域
		holdBlocks: []
    })

    this.setBoundary()
    this.setBlocks()
    this.setTextName()
    this.getPoints()

    this.setMapScale()
}
