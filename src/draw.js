
/**
 * @name 绘制所有区块
 */
export function drawAllBoundary () {
    this.clearCanvasCtx()
    // 边界
    this.drawMainBoundary()
    // 区
    this.drawBlockBoundary()
    // 点
    this.drawBlockPoints()
    // 城市名
    this.drawText()
    
    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.hitCtx.setTransform(1, 0, 0, 1, 0, 0)
}

/**
 * @name 绘制内部区块
 * @param {Object} obj 绘制的区块信息
 */
export function drawBoundary (obj, ctxs, style) {
    let l = obj._coordinates.length

    for (let i = 0; i < l; i++) {
        let ctx = this.drawLine(
            this.ctx,
            obj._coordinates[i],
            obj.style
        )

        this.drawLine(
            this.hitCtx,
            obj._coordinates[i],
            obj.hitStyle
        )
    }
}

/**
 * @name 绘制主要边界
 */
export function drawMainBoundary () {
    this.drawBoundary(this.boundary)
}

/**
 * @name 绘制区块边界
 */
export function drawBlockBoundary () {
    let l = this.blocks.length

    for (let i = 0; i < l; i++) {
        this.drawBoundary( this.blocks[i] )
    }
}

/**
 * @name 绘制圆
 * @param {Object} ctx canvas 对象
 * @param {Object} option 设置
 * @param {Objetc} style 样式
 */
export function drawArc (ctx, option, style) {
    ctx = this.setCtxState(style, ctx)
    ctx.arc(
        option.x, // x
        option.y, // y
        option.r, // R 半径
        option.s, // 开始角度
        option.e, // 结束角度
        option.d  // 顺时针(false)
    )
    ctx.fill()
    ctx.closePath()
    ctx.restore()
}

/**
 * @name 绘制名字
 */
export function drawText (ctx = this.ctx) {
    
    let cityName = this.options.map.blocks.cityName
    if (!cityName) return

    let Obj = this.blocks
    let l = this.blocks.length
    let move = cityName.move || {x: 0, y: 0}

    for (let i = 0;i < l; i++) {
        let city = Obj[i]
        let style = city.nameStyle.normal
        let width = city.width * this.mapScale
        let txtWidth = ctx.measureText(city.name).width
        
        if (this.mouseMoveIndex === i) {
            style = city.nameStyle.hover
        }
        
        if (txtWidth < width / this.textVsWidth || city.index === this.mouseMoveIndex) {
            let x = city.centroid.x * this.mapScale + move.x
            let y = city.centroid.y * this.mapScale + move.y

            ctx = this.setCtxState(style, ctx)
            ctx.textAlign = cityName.align || 'center'
            ctx.textBaseline = "middle"		
            ctx.fillText(city.name, x, y)		
            ctx.restore()
        }
    }
}

/**
 * @name 中心坐标 
 */
export function drawCenterLine () {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    this.ctx.moveTo(0, this.ctxH/2)
    this.ctx.lineTo(this.ctxW, this.ctxH/2)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    this.ctx.moveTo(this.ctxW/2,0)
    this.ctx.lineTo(this.ctxW/2, this.ctxH)
    this.ctx.stroke()
}

/**
 * @name 绘制区块中随机点
 */
export function drawBlockPoints (ctx = this.ctx) {
    const data = this.blocks
    let l = this.blocks.length
    for (let i = 0; i < l; i++) {
        let _W = data[i].width * this.mapScale
        data[i]._point.forEach(point => {
            // 当宽度大于5倍点半径时，点才显示
            if (_W > point.r * 5) {
                this.drawArc(
                    ctx,
                    {
                        x: point.x,
                        y: point.y,
                        r: point.r,
                        s: 0,
                        e: Math.PI * 2,
                        d: false
                    },
                    {
                        fillStyle: point.color
                    }
                )
            }
        })
    }
}


/**
 * @name 绘制线
 * @param {Object} ctx - canvas 对象
 * @param {Array} data - 绘制的线
 * @param {Object} style - 绘制的样式
 */
export function drawLine (ctx, data, style) {
    ctx = this.setCtxState(style, ctx)

    for (let i = 0, l = data.length; i < l; i++) {
        let x = data[i][0]
        let y = data[i][1]
        if (i === 0) {
            ctx.moveTo(x, y)
        } else {
            ctx.lineTo(x, y)
        }
    }
    
    ctx.lineJoin = 'round'
    ctx.stroke()
    ctx.fill()
    ctx.closePath()

    return ctx
}

/**
 * 
 * @param {Number} x x轴偏移量
 * @param {Number} y y轴偏移量
 */
export function translateCtx (x = 0, y = 0) {
    let boundary = this.boundary
    let X = (this.ctxW - boundary.width * this.mapScale)/ 2 + x
    let Y = (this.ctxH - boundary.height * this.mapScale)/ 2 + y

    this.clearCanvasCtx()
    this.ctx.translate(X, Y)
    this.hitCtx.translate(X, Y)
}
