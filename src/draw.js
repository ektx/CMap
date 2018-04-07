
/**
 * @name 绘制所有区块
 */
function drawAllBoundary () {
    this.clearCanvasCtx()
    // 边界
    this.drawBoundary(this.options.map.boundary)
    // 区
    this.drawBlockBoundary()
    // 点
    this.drawBlockPoints()
    // 城市名
    this.drawText()
}

/**
 * @name 绘制内部区块
 * @param {Object} obj 绘制的区块信息
 */
function drawBoundary (obj) {
    for (let i = 0, l = obj.mapData.length;i < l; i++) {
        let ctx = this.drawLine(
            this.ctx,
            obj.mapData[i],
            obj.style
        )

        this.drawLine(
            this.hitCtx,
            obj.mapData[i],
            obj.hitStyle
        )
    }
}

// 绘制区块边界
function drawBlockBoundary () {
    let blocks = this.options.map.blocks

    for (let i = 0,l = blocks.data.length; i < l; i++) {
        let _BD = blocks.data[i]

        this.drawBoundary( _BD )
    }
}

/**
 * @name 绘制圆
 * @param {Object} ctx canvas 对象
 * @param {Object} option 设置
 * @param {Objetc} style 样式
 */
function drawArc (ctx, option, style) {
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

function drawText () {
    let ctx = this.ctx
    let Obj = this.options.map.blocks
    
    for (let i = 0, l = Obj.data.length;i < l; i++) {
        let city = Obj.data[i]
        let style = city.cityName.normal
        let width = city.width * this.mapScale
        let txtWidth = ctx.measureText(city.name).width
        
        if (this.mouseMoveIndex === i) {
            style = city.cityName.hover
        }
        
        if (txtWidth < width / this.textVsWidth || city.index === this.mouseMoveIndex) {
            let x = city.cityName.x
            let y = city.cityName.y

            ctx = this.setCtxState(style, this.ctx)
            ctx.textAlign = city.cityName.align || 'center'
            ctx.textBaseline = "middle"		
            ctx.fillText(city.name, x, y)		
            ctx.restore()
        }
    }
}

/**
 * @name 中心坐标 
 */
function drawCenterLine () {
    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    this.ctx.moveTo(0, this.mainCanvas.height/2)
    this.ctx.lineTo(this.mainCanvas.width, this.mainCanvas.height/2)
    this.ctx.stroke()

    this.ctx.beginPath()
    this.ctx.strokeStyle = 'red'
    this.ctx.moveTo(this.mainCanvas.width/2,0)
    this.ctx.lineTo(this.mainCanvas.width/2, this.mainCanvas.height)
    this.ctx.stroke()
}

/**
 * @name 绘制区块中随机点
 */
function drawBlockPoints () {
    const data = this.options.map.blocks.data
    for (let i = 0, l = data.length; i < l; i++) {
        data[i]._point.forEach(point => {
            if (data[i].width * this.mapScale > point.r * 5) {
                this.drawArc(
                    this.ctx,
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
function drawLine (ctx, data, style) {
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
    ctx.restore()

    return ctx
}

export {
    drawAllBoundary,
    drawBoundary,
    drawBlockBoundary,
    drawArc,
    drawText,
    drawCenterLine,
    drawBlockPoints,
    drawLine
}