export default function () {
    let mapX = 0
    let mapY = 0
    let oldArr = []
    let _blocks = this.options.map.blocks
    let _selectedMode = _blocks.selectedMode
    let mouseMove = {
        hold: false,
        x: 0,
        y: 0,
        status: false // 记录是否有移动
    }

    let checkInMap = (x, y, callback) => {
        const pixel = this.hitCtx.getImageData(x, y, 1, 1).data
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
        const shape = this.colorsHash[color] || {index: -1}

        if (shape) callback(shape)
    }

    let reSetCanvas = (x, y) => {
        mapX = x - mouseMove.x + this.mapTranslateX
        mapY = y - mouseMove.y + this.mapTranslateY

        this.clearCanvasCtx()
        this.ctx.translate(mapX, mapY)
        this.hitCtx.translate(mapX, mapY)
        this.drawAllBoundary()
        this.ctx.setTransform(1, 0, 0, 1, 0, 0)
        this.hitCtx.setTransform(1, 0, 0, 1, 0, 0)
    }

    let inHoldBlocks = index => {
        return this.holdBlocks.includes(this.mouseMoveIndex)
    }

    this.ele.addEventListener('mousemove', evt => {
        let x = evt.offsetX * this.DPI
        let y = evt.offsetY * this.DPI

        // 按住地图时
        if (evt.buttons && mouseMove.hold) {
            // 地图拖动
            mouseMove.status = true

            reSetCanvas(x, y)
        } else {
            const _callback = this.options.callback
            
            checkInMap(x, y, shape => {
                // 恢复之前鼠标移入对象效果
                if (shape.index !== this.mouseMoveIndex) {
                    if (this.mouseMoveIndex > -1) {
                        _blocks.data[this.mouseMoveIndex].style.fillStyle = inHoldBlocks(this.mouseMoveIndex) ? _blocks.style.holdColor : _blocks.style.fillStyle
                        window.requestAnimationFrame(() => this.drawAllBoundary() )
                    }

                    if (shape.index === -1) {
                        this.mouseMoveIndex = shape.index
                        return
                    }

                    _blocks.data[shape.index].style.fillStyle = _blocks.style.hoverColor
                    this.mouseMoveIndex = shape.index
                    
                    if (_callback && _callback.hasOwnProperty('mousemove')) {
                        _callback.mousemove(evt, shape)
                    }
                    window.requestAnimationFrame(() => this.drawAllBoundary() )
                } else {
                }
            })
        }

    })

    this.ele.addEventListener('mousedown', evt => {
        this.animatePause = true
        mouseMove.hold = true
        mouseMove.x = evt.offsetX * this.DPI
        mouseMove.y = evt.offsetY * this.DPI
        
        oldArr = [this.mapTranslateX, this.mapTranslateY]
        if (this.scaleEvtStatus) {
            this.mapTranslateX = 0
            this.mapTranslateY = 0
        }
    })

    this.ele.addEventListener('mouseup', evt => {
        mouseMove.hold = false
        
        if (mouseMove.status) {
            // this.animatePause = false
            mouseMove.status = false

            this.mapTranslateX = mapX
            this.mapTranslateY = mapY

            // 在缩放过的情况下
            if (this.scaleEvtStatus) {
                this.scaleEvtStatus = false
                this.mouseMoveStatus = oldArr // 坐标发生变化前值
            }
            
            this.scaleMap(this.mapScale)
            this.animate()
        } else {
            let x = evt.offsetX * this.DPI
            let y = evt.offsetY * this.DPI

            checkInMap(x, y, shape => {
                if (shape.index === -1) return

                if (inHoldBlocks(shape.index)) {
                    let _index = this.holdBlocks.indexOf(shape.index)
                    
                    this.holdBlocks.splice(_index, 1)
                } else {
                    if (_selectedMode === 'multiple') {
                        this.holdBlocks.push(shape.index)
                    } else if (_selectedMode === 'single') {
                        if (this.holdBlocks.length) {
                            _blocks.data[this.holdBlocks[0]].style.fillStyle = _blocks.style.fillStyle
                        }

                        this.holdBlocks = [shape.index]
                    }
                }

                this.holdBlocks.forEach(val => {
                    _blocks.data[val].style.fillStyle = _blocks.style.holdColor
                })
            })

            this.mouseMoveStatus = oldArr 
            this.scaleMap(this.mapScale)
        }
    })
}