

export function getEleInfo () {
    this.ele = document.querySelector(this.options.el)
    this.eleBCR = this.ele.getBoundingClientRect()
}
    
export function init () {
    this.getEleInfo()
    this.appendCanvasElement()
    
    this.setBoundary()
    this.setBlocks()
    this.setTextName()
    this.getPoints()

    this.setMapScale()

    // this.translateCtx(this.mapTranslateX, this.mapTranslateY)
    // this.drawAllBoundary()
    
    this.event()
}
