import {
    stepAnimate,
    linearAni,
    quadAni,
    backAni,
    makeEaseInOutAni
} from './swing.js'

/**
 * 缓入 从小到1进入
 * @param {number} time 动画时长
 * @param {number} coe 系数
 */
export function fadeIn (time = 1000, coe = .3) {
    let currentMap = this.history.map[this.history.index]
    this.translateCtx(currentMap, currentMap.mapTranslateX, currentMap.mapTranslateY)
    this.drawAllBoundary()
    let _canvas = this.createTemCanvas()
    this.clearCanvasCtx(true)
    this.inAnimate = true
    
    stepAnimate({
        duration: time,
        delta: makeEaseInOutAni(quadAni),
        callback: delta => {
            let progress = delta * coe
            let scaleDelta = progress + (1 - coe)
            this.ctx.save()
            this.ctx.globalAlpha = delta
            this.ctx.translate(
                this.mainCanvas.width / 2 * (coe - progress),
                this.mainCanvas.height / 2 * (coe - progress)
            )
            this.ctx.scale(scaleDelta, scaleDelta)
            this.clearCanvasCtx(true)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        },
        doneback: () => {
            this.inAnimate = false
        }
    })

}

/**
 * 缓出 从1到系数缩小淡出
 * @param {number} time 动画时长
 * @param {number} coe 缩放系数
 */
export function fadeOut (time = 600, coe = .3) {
    let _canvas = this.createTemCanvas()
    let _coe = 1 - coe
    this.inAnimate = true

    stepAnimate({
        duration: time,
        delta: backAni,
        callback: delta => {
            this.ctx.save()
            let reDelta = (1 - delta) * coe + _coe 
            this.clearCanvasCtx()
            this.ctx.globalAlpha = 1 - delta
            this.ctx.translate(
                this.mainCanvas.width / 2 * coe * delta,
                this.mainCanvas.height / 2 * coe * delta
            )
            this.ctx.scale(reDelta, reDelta)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        },
        doneback: () => {
            this.inAnimate = false
        }
    })
}

/**
 * 放大缓出
 * @param {number} time 动画时长
 * @param {number} coe 缩放系数
 */
export function zoomOut (time = 600, coe = .3) {
    let _canvas = this.createTemCanvas()
    this.inAnimate = true

    stepAnimate({
        duration: time,
        delta: backAni,
        callback: delta => {
            this.ctx.save()
            let reDelta = delta * coe + 1 
            this.clearCanvasCtx()
            this.ctx.globalAlpha = 1 - delta
            this.ctx.translate(
                - this.ctxW / 2 * delta * coe,
                - this.ctxH / 2 * delta * coe
            )
            this.ctx.scale(reDelta, reDelta)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        },
        doneback: () => {
            this.inAnimate = false
        }
    })
}

/**
 * 缩小缓入
 * @param {number} time 动画时长
 * @param {number} coe 缩放系数
 */
export function zoomIn (time = 1000, coe = .3) {
    let currentMap = this.history.map[this.history.index]
    this.translateCtx(currentMap, currentMap.mapTranslateX, currentMap.mapTranslateY)
    this.drawAllBoundary()
    let _canvas = this.createTemCanvas()
    this.clearCanvasCtx(true)
    this.inAnimate = true

    stepAnimate({
        duration: time,
        delta: makeEaseInOutAni(quadAni),
        callback: delta => {
            this.ctx.save()
            let reDelta = .3 - delta * coe + 1 
            this.ctx.globalAlpha = delta
            this.ctx.translate(
                -this.ctxW / 2 * coe * (1 - delta),
                -this.ctxH / 2 * coe * (1 - delta)
            )
            this.ctx.scale(reDelta, reDelta)
            this.clearCanvasCtx(true)
            this.ctx.drawImage(_canvas, 0, 0)
            this.ctx.restore()
        },
        doneback: () => {
            this.inAnimate = false
        }
    })
}
