
/**
 * @description 动画
 * @param {Object} opts
 * @param {Number} delay 每帧时间 
 * @param {Number} duration 动画运行时间
 * @param {Function} delta 对进度操作
 * @callback callback 每一帧操作
 * @callback doneback 每一帧操作
 */
export function stepAnimate (opts) {
    let start = new Date

    let id = setInterval(() => {
        let timePassed = new Date - start
        let progress = timePassed / opts.duration

        if (progress > 1) progress = 1

        let delta = opts.delta(progress)
        opts.callback(delta)

        if (progress == 1) {
            clearInterval(id)
            if (opts.doneback) opts.doneback()
        }
    }, opts.delay || 1000/60)
}

/**
 * @deprecated 直线运动
 * @param {Number} progress 进度
 */
export function linearAni (progress) {
    return progress
}

export function quadAni (progress) {
    return Math.pow(progress, 5)
}

export function backAni (progress) {
    let x = 2
    return Math.pow(progress, 2) * ((x+1) * progress - x)
}

export function makeEaseInOutAni (delta) {
    return function(progress) {
        return 1 - delta(1 - progress)
    }
}