

function getEleInfo () {
    this.ele = document.querySelector(this.options.el)
    this.eleBCR = this.ele.getBoundingClientRect()
}
    
function init () {
    this.getEleInfo()
    this.appendCanvasElement()
    
    this.setBoundary()
    this.setBlocks()
    this.setTextName()
    this.getPoints()

    this.setPoints()

    // this.drawAllBoundary()

    this.event()
}

export {
    getEleInfo,
    init
}