
/**
 * @returns {Object} - 返回一个生成的canvas元素
 */
export function createCanvas () {
    let canvas = document.createElement('canvas')
    let W = this.eleBCR.width
    let H = this.eleBCR.height
    
    this.ctxW = canvas.width = W * this.DPI
    this.ctxH = canvas.height = H * this.DPI

    canvas.style.position = 'absolute'
    canvas.style.width = W + 'px'
    canvas.style.height = H + 'px'

    return canvas
}

export function appendCanvasElement () {
    this.mainCanvas = this.createCanvas()
    this.hitMainCanvas = this.createCanvas()

    this.ctx = this.mainCanvas.getContext('2d')
    this.hitCtx = this.hitMainCanvas.getContext('2d')

    this.ele.appendChild( this.mainCanvas )
}

// 生成临时 canvas 保存当前画布信息
export function createTemCanvas (ctx = this.ctx) {
    let ctxW = this.mainCanvas.width
    let ctxH = this.mainCanvas.height
    let _canvas = this.createCanvas()
    let copyCtxImg = ctx.getImageData(0, 0, ctxW, ctxH)
    
    _canvas.getContext('2d').putImageData(copyCtxImg, 0, 0)
    return _canvas
}


/**
 * @description 画布清除
 * @param {Boolean} notHit 不要清除 hitCtx,默认 false 清除
 */
export function clearCanvasCtx (notHit) {
    this.ctx.clearRect(0, 0, this.ctxW, this.ctxH)
    
    if (!notHit) {
        this.hitCtx.clearRect(0, 0, this.ctxW, this.ctxH)
    }
}