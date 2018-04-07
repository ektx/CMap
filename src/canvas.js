
/**
 * @returns {Object} - 返回一个生成的canvas元素
 */
function createCanvas () {
    let canvas = document.createElement('canvas')
    canvas.width = this.eleBCR.width * this.DPI
    canvas.height = this.eleBCR.height * this.DPI

    canvas.style.position = 'absolute'
    canvas.style.width = this.eleBCR.width + 'px'
    canvas.style.height = this.eleBCR.height + 'px'

    return canvas
}

function appendCanvasElement () {

    this.mainCanvas = this.createCanvas()
    this.hitMainCanvas = this.createCanvas()

    this.ctx = this.mainCanvas.getContext('2d')
    this.hitCtx = this.hitMainCanvas.getContext('2d')

    // this.ele.appendChild( this.hitMainCanvas )
    this.ele.appendChild( this.mainCanvas )
}

// 生成临时 canvas 保存当前画布信息
function createTemCanvas () {
    let ctxW = this.mainCanvas.width
    let ctxH = this.mainCanvas.height
    let _canvas = this.createCanvas()
    let copyCtxImg = this.ctx.getImageData(0, 0, ctxW, ctxH)
    
    _canvas.getContext('2d').putImageData(copyCtxImg, 0, 0)
    return _canvas
}


/**
 * @description 画布清除
 * @param {Boolean} notHit 不要清除 hitCtx,默认 false 清除
 */
function clearCanvasCtx (notHit) {
    this.ctx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    
    if (!notHit) {
        this.hitCtx.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height)
    }
}


export {
    createCanvas,
    createTemCanvas,
    clearCanvasCtx,
    appendCanvasElement
}