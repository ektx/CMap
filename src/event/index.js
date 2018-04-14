export function mouseEvt () {
    this.mouseEvtData = {
        mapX: this.mapTranslateX,
        mapY: this.mapTranslateY,
    }

    let oldArr = []
    let _blocks = this.blocks
    let _callback = this.options.callback
    let _selectedMode = this.options.map.blocks.selectedMode
    let _blocksStyle = this.options.map.blocks.style
    let mouseMove = {
        hold: false,
        x: 0,
        y: 0,
        status: false // 记录是否有移动
    }

    /**
     * @deprecated 判断是否在区块中
     * @param {number} x x轴移动    
     * @param {number} y y轴移动
     * @callback 回调函数
     */
    let checkInMap = (x, y, callback) => {
        const pixel = this.hitCtx.getImageData(x, y, 1, 1).data
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
        const shape = this.colorsHash[color] || {index: -1}

        if (shape) callback(shape)
    }

    // 绘制
    let draw = () => {
        this.translateCtx(this.mouseEvtData.mapX, this.mouseEvtData.mapY)
        this.drawAllBoundary()
    }

    // 判断是否在选择区块中
    let inHoldBlocks = index => {
        return this.holdBlocks.includes(this.mouseMoveIndex)
    }

    /**
     * @description 回调事件
     * @param {string} type 事件类型，如:['click','mousemove']
     * @param {object} data 当前对象
     * @param {event} evt 鼠标事件 
     */
    let callbackEvt = (type, data, evt) => {
        if (
            _callback && 
            _callback.hasOwnProperty(type)
        ) {
            _callback[type](evt, data)
        }
    }

    this.ele.addEventListener('mousemove', evt => {
        let x = evt.offsetX * this.DPI
        let y = evt.offsetY * this.DPI

        // 按住地图时
        if (evt.buttons && mouseMove.hold) {
            mouseMove.status = true

            this.mouseEvtData.mapX = x - mouseMove.x + this.mapTranslateX
            this.mouseEvtData.mapY = y - mouseMove.y + this.mapTranslateY

            draw()
        } else {
            checkInMap(x, y, shape => {
                // 恢复之前鼠标移入对象效果
                if (shape.index !== this.mouseMoveIndex) {
                    if (this.mouseMoveIndex > -1) {
                        _blocks[this.mouseMoveIndex].style.fillStyle = inHoldBlocks(this.mouseMoveIndex) ? _blocksStyle.holdColor : _blocksStyle.fillStyle
                        draw()
                    }

                    if (shape.index === -1) {
                        this.mouseMoveIndex = shape.index
                        return
                    }

                    if (_blocks[shape.index]) {
                        _blocks[shape.index].style.fillStyle = _blocksStyle.hoverColor
                        this.mouseMoveIndex = shape.index
                    }
                    
                    callbackEvt('mousemove', evt, shape)
                    draw()
                }
            })
        }

    })

    this.ele.addEventListener('mousedown', evt => {
        mouseMove.hold = true
        mouseMove.x = evt.offsetX * this.DPI
        mouseMove.y = evt.offsetY * this.DPI
    })


    this.ele.addEventListener('mouseup', evt => {
        mouseMove.hold = false
        
        if (mouseMove.status) {
            mouseMove.status = false

            // 记录已经移动过的位置
            this.mapTranslateX = this.mouseEvtData.mapX
            this.mapTranslateY = this.mouseEvtData.mapY

        } else {
            let x = evt.offsetX * this.DPI
            let y = evt.offsetY * this.DPI

            checkInMap(x, y, shape => {
                if (shape.index === -1) return

                // 存在时，我们移除
                if (inHoldBlocks(shape.index)) {
                    let _index = this.holdBlocks.indexOf(shape.index)
                    
                    this.holdBlocks.splice(_index, 1)
                } 
                // 如果不存在，我们添加到存放区
                else {
                    if (_selectedMode === 'multiple') {
                        this.holdBlocks.push(shape.index)
                    } else if (_selectedMode === 'single') {
                        if (this.holdBlocks.length) {
                            _blocks[this.holdBlocks[0]].style.fillStyle = _blocksStyle.fillStyle
                        }

                        this.holdBlocks = [shape.index]
                    }
                }

                // 处理存放区内的区块效果
                this.holdBlocks.forEach(val => {
                    _blocks[val].style.fillStyle = _blocksStyle.holdColor
                })

                draw()
                callbackEvt('click', evt, shape)
            })
        }
    })
}