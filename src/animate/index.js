import {
    stepAnimate,
    linearAni,
    quadAni,
    backAni,
    makeEaseInOutAni
} from './swing.js'

export function fadeIn (time = 1000) {
    this.translateCtx(this.mapTranslateX, this.mapTranslateY)
    this.drawAllBoundary()
    let _canvas = this.createTemCanvas()
    this.clearCanvasCtx(true)
    
    stepAnimate({
        duration: time,
        delta: makeEaseInOutAni(quadAni),
        callback: delta => {
            let progress = delta * .3
            let scaleDelta = progress + .7
            this.ctx.save()
            this.ctx.globalAlpha = delta
            this.ctx.translate(
                this.mainCanvas.width / 2 * (.3 - progress),
                this.mainCanvas.height / 2 * (.3 - progress)
            )
            this.ctx.scale(scaleDelta, scaleDelta)
            this.clearCanvasCtx(true)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        }
    })
}

export function fadeOut (time = 600) {
    let _canvas = this.createTemCanvas()

    stepAnimate({
        duration: time,
        delta: backAni,
        callback: delta => {
            this.ctx.save()
            let reDelta = (1 - delta) * .3 + .7 
            this.clearCanvasCtx()
            this.ctx.globalAlpha = 1 - delta
            this.ctx.translate(
                this.mainCanvas.width / 2 * .3 * delta,
                this.mainCanvas.height / 2 * .3 * delta
            )
            this.ctx.scale(reDelta, reDelta)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        }
    })
}

export function zoomOut (time = 600) {
    let _canvas = this.createTemCanvas()

    stepAnimate({
        duration: time,
        delta: backAni,
        callback: delta => {
            this.ctx.save()
            let reDelta = delta * .3 + 1 
            this.clearCanvasCtx()
            this.ctx.globalAlpha = 1 - delta
            this.ctx.translate(
                - this.ctxW / 2 * delta * .3,
                - this.ctxH / 2 * delta * .3
            )
            this.ctx.scale(reDelta, reDelta)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        }
    })
}