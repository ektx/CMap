export function mouseEvt () {
    let historyIndex = -1
    let currentMap = null
    let _blocks = null
    let _opt = this.options
    let _callback = _opt.callback
    let { 
        selectedMode: _selectedMode, 
        style: _BStyle
    } = _opt.map.blocks
    let mouseMove = {
        hold: false,
        x: 0,
        y: 0,
        status: false // 记录是否有移动
    }

    /**
     * 判断是否在区块中
     * @param {number} x x轴移动    
     * @param {number} y y轴移动
     * @callback 回调函数
     */
    let checkInMap = (x, y, callback) => {
        if (!currentMap) return {index: -1}
        
        const pixel = this.hitCtx.getImageData(x, y, 1, 1).data
        const color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`
        const shape = currentMap.colorsHash[color] || {index: -1}

        if (shape) callback(shape)
    }

    // 绘制
    let draw = () => {
        this.translateCtx(
            currentMap,
            this.mouseEvtData.mapX, 
            this.mouseEvtData.mapY
        )
        this.drawAllBoundary()
    }

    // 判断是否在选择区块中
    let inHoldBlocks = () => currentMap.holdBlocks.includes(currentMap.mouseMoveIndex)

    /**
     * @description 回调事件
     * @param {string} type 事件类型，如:['click','mousemove']
     * @param {object} data 当前对象
     * @param {event} evt 鼠标事件 
     */
    let callbackEvt = (type, evt, data) => {
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

        if (this.inAnimate) return

        // 更新内容
        if (historyIndex !== this.history.index) {
            historyIndex = this.history.index
            currentMap = this.history.map[historyIndex]
            _blocks = currentMap.blocks

            this.mouseEvtData = {
                mapX: currentMap.mapTranslateX,
                mapY: currentMap.mapTranslateY,
            }
        }

        // 按住地图时
        if (evt.buttons && mouseMove.hold) {
            let _x = x - mouseMove.x + currentMap.mapTranslateX
            let _y = y - mouseMove.y + currentMap.mapTranslateY
            
            if (this.mouseEvtData.mapX - _x || this.mouseEvtData.mapY - _y) {
                this.mouseEvtData.mapX = _x
                this.mouseEvtData.mapY = _y
                
                mouseMove.status = true
                draw()
            }
        } else {
            checkInMap(x, y, shape => {
                let moveIndex = currentMap.mouseMoveIndex

                // 恢复之前鼠标移入对象效果
                if (shape.index !== moveIndex) {
                    if (moveIndex > -1) {
                        _blocks[moveIndex].over = false
                        draw()
                    }

                    currentMap.mouseMoveIndex = shape.index
                    
                    if (shape.index > -1) {
                        shape.over = true
                        callbackEvt('mousemove', evt, shape)
                        draw()
                    }
                } else {
                    callbackEvt('mousemove', evt, shape)
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
            currentMap.mapTranslateX = this.mouseEvtData.mapX
            currentMap.mapTranslateY = this.mouseEvtData.mapY

        } else {
            let x = evt.offsetX * this.DPI
            let y = evt.offsetY * this.DPI

            checkInMap(x, y, shape => {
                if (shape.index === -1) return

                // 存在时，我们移除
                if (inHoldBlocks(shape.index)) {
                    let _index = currentMap.holdBlocks.indexOf(shape.index)
                    
                    currentMap.holdBlocks.splice(_index, 1)
                } 
                // 如果不存在，我们添加到存放区
                else {
                    if (_selectedMode === 'multiple') {
                        currentMap.holdBlocks.push(shape.index)
                    } 
                    else if (_selectedMode === 'single') {
                        if (currentMap.holdBlocks.length) {
                            _blocks[currentMap.holdBlocks[0]].style.fillStyle = _BStyle.fillStyle
                        }

                        currentMap.holdBlocks = [shape.index]
                    }
                }

                // 处理存放区内的区块效果
                currentMap.holdBlocks.forEach(val => {
                    _blocks[val].style.fillStyle = _BStyle.holdColor
                })

                draw()
                callbackEvt('click', evt, shape)
            })
        }
    })
}