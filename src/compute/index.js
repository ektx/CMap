import getMapDataInfo from './getMapBlockInfo.js'
import { setDPIFontSize } from '../style.js'
import {
    selfStyle,
    getBetweenRandom,
    isInPolygon,
    scaleCoordinates
} from './methods.js'

export function setBoundary (opt) {
    let boundary = this.options.map.boundary

    boundary = Object.assign({}, boundary, getMapDataInfo(boundary.data))

    // 镜像设置
    let { coordinates } = setMirror(opt, boundary, boundary.data)
    boundary.coordinates = coordinates

    this.setColorsHashID(opt, boundary, true)

    // 设置最小缩放
    opt.mapScale = Math.min(
        this.hitMainCanvas.width / boundary.width, 
        this.hitMainCanvas.height / boundary.height
    )

    opt.boundary = boundary
    opt.mapTranslateX = 0
    opt.mapTranslateY = 0

    return opt
}


export function setBlocks (opt) {
    const blocks = this.options.map.blocks
    const areas = blocks.data
    let _BC = blocks.color
    let colorIsArr = Array.isArray(_BC)
    let colorLen = colorIsArr ? _BC.length : 0

    for (let i = 0, l = areas.length; i < l; i++) {
        let _data = areas[i]
        let _style = blocks.style

        // 1.优先使用块内样式
        if (_data.style && _data.style.hasOwnProperty('block')) {
            _style = _data.style.block
        }
        // 随机色或自定颜色
        if (!_data.style && blocks.color) {

            if (colorIsArr) {
                _style.fillStyle = _BC[ i % colorLen ]
            } 
            else if (typeof _BC === 'boolean') {
                _style.fillStyle = this.getRandomColor()
            }
        }

        // 镜像设置
        Object.assign(_data.map, setMirror(opt, opt.boundary, _data.map))

        _data = Object.assign({}, _data, _data.map, {
            style: new selfStyle( _style ),
            index: i,
            over: false,
            hold: false
        })
        
        this.setColorsHashID(opt, _data)

        opt.blocks.push(_data)
    }

    return opt
}


/**
 * 设置文字
 * @description 对文字的大小按屏幕地 devicePixelRatio 缩放
 */
export function setTextName (map) {
    // 获取区块名称用户设置
    let cityName = this.options.map.blocks.cityName

    if (!cityName) return map

    // 判断是否已经处理过高清屏文字
    if (!cityName.fixed) {
        Object.keys(cityName).forEach(name => {
            Object.assign(
                cityName[name], 
                setDPIFontSize(cityName[name], this.DPI)
            )
        })
    }

    // 检查是否有默认的属性
    if (!cityName.hasOwnProperty('normal')) {
        return console.warn(`Don't find cityName has 'normal'`)
    }

    map.blocks.forEach(val => {
        val.nameStyle = {
            normal: new selfStyle(cityName.normal),
            hover: new selfStyle(cityName.hover ? cityName.hover : cityName.normal)
        }
    })

    cityName.fixed = true

    return map
}

/**
 * 设置区块内的点
 */
export function getPoints (map) {
    let blocks = this.options.map.blocks
    let point = blocks.point

    if (!point) return map

    map.hasPoint = true

    let minR = Math.min.apply({}, point.r)
    let maxR = Math.max.apply({}, point.r)

    let getPoint = val => {
        let x = -1
        let y = -1
        while (true) {
            x = ~~getBetweenRandom(val.x.start, val.x.end)
            y = ~~getBetweenRandom(val.y.start, val.y.end)
            if (isInPolygon([x,y], val.coordinates[0])) {
                return [x,y]
            }
        }
    }

    map.blocks.forEach((val, index) => {
        if (point.size) {
            let size = point.size
            let pointSize = 1
            let hasUserSet = false
            let _blockPointSize

            if (val.blocks && val.blocks.point && val.blocks.point.size) {
                _blockPointSize = val.blocks.point.size
                hasUserSet = true

                if (Array.isArray(_blockPointSize)) {
                    hasUserSet = 'array'
                    pointSize = _blockPointSize.length
                } else if (!isNaN(_blockPointSize)) {
                    pointSize = _blockPointSize
                }
            } else {
                if (size.min !== size.max) {
                    pointSize = ~~getBetweenRandom(size.min, size.max)
                }
            }

            val.point = []

            for (let i = 0; i < pointSize; i++) {
                let { x, y } = val.centroid
                let usrSet = {}

                if (point.fun) {
                    usrSet = point.fun( index, val, this.options.usrData )
                }

                if (size.min !== size.max) [x,y] = getPoint(val)

                let color = ''
                let r = 0

                if (hasUserSet && hasUserSet === 'array') {
                    color = 'color' in _blockPointSize[i] ?
                        _blockPointSize[i].color :
                        point.color[~~getBetweenRandom(0, point.color.length)]

                    r = 'r' in _blockPointSize[i] ?
                        _blockPointSize[i].r :
                        getBetweenRandom(minR, maxR)
                } else {
                    color = point.color[~~getBetweenRandom(0, point.color.length)]

                    r = getBetweenRandom(minR, maxR)
                }

                usrSet = Object.assign({}, {
                    r,
                    color,
                    position: {x, y}
                }, usrSet)

                usrSet.r *= this.DPI

                val.point.push(usrSet)
            }
        }
    })

    return map
}

/**
 * 缩放地图
 * @param {number} val 缩放地图
 */
export function setMapScale (val) {
    let history = this.history
    let currentMap = history.map[history.index]
    let defVal = currentMap.mapScale

    history.map[history.index].mapScale = val || defVal

    this.scaleBoundary(currentMap)
    this.scaleBlocks(currentMap)
    this.scalePoints(currentMap)
}

/**
 * 缩放边界
 */
export function scaleBoundary (map) {
    if (map.mapTranslateX === 0) {
        map.mapTranslateX =  0 - map.boundary.x.start * map.mapScale
        map.mapTranslateY = 0 - map.boundary.y.start * map.mapScale
    }
    
    map.boundary._coordinates = scaleCoordinates(map.boundary.coordinates, map.mapScale)
}

/**
 * 缩放块
 * @param {object} map 当前地图
 */
export function scaleBlocks (map) {
    for (let i = 0, l = map.blocks.length; i < l; i++) {
        let inner = map.blocks[i]
        inner._coordinates = scaleCoordinates(inner.coordinates, map.mapScale)
    }
}

/**
 * 缩放点的位置
 * @param {object} map 当前地图
 */
export function scalePoints (map) {
    let blocks = map.blocks

    if (!map.hasPoint) return

    for (let i = 0, l = blocks.length; i < l; i++) {
        blocks[i]._point = []
        let pointL = blocks[i].point.length

        for (let p = 0; p < pointL; p++) {
            let point = blocks[i].point[p]

            blocks[i]._point.push( {
                x: point.position.x * map.mapScale,
                y: point.position.y * map.mapScale,
                r: point.r,
                color: point.color
            })
        }
    }
}


/**
 * 备案区块信息
 * @param {object} map 当前地图
 * @param {object} data 区块信息
 * @param {boolean} transparentBg 背景透明化
 */
export function setColorsHashID (map, data, transparentBg = false) {
    let hash = map.colorsHash

    while (true) {
        const colorKey = this.getRandomColor()

        if (!hash[colorKey]) {
            hash[colorKey] = data
            data.hitStyle = new selfStyle({
                fillStyle: transparentBg ? 'rgba(0,0,0,0)' :  colorKey
            })
            return
        }
    }
}

/**
 * 随机生成 RGB 颜色
 */
export function getRandomColor () {
    const r = Math.round(Math.random() * 255)
    const g = Math.round(Math.random() * 255)
    const b = Math.round(Math.random() * 255)
    return `rgb(${r},${g},${b})`
}

export function hasSameHashColor (color, shape) {
    return shape.color === color
}


/**
 * 缩放地图
 * @param {number} val 缩放大小
 */
export function scaleMap (val) {
    let currentMap = this.history.map[this.history.index]

    this.setMapScale(val)
    this.translateCtx(currentMap, currentMap.mapTranslateX, currentMap.mapTranslateY)

    window.requestAnimationFrame(() => this.drawAllBoundary() )
}

export function getLikeGeoJson (arr) {
    let result = []

    for (let i = 0, l = arr.length; i < l; i+=2) {
        result.push([arr[i], arr[i+1]])
    }
    return result
}


function setMirror (opt, boundary, arr) {
    if (opt.mirror) {
        let mirrorOpt = {}
        
        if (opt.mirror.horizontal) mirrorOpt.x = boundary.x.end + boundary.x.start
        if (opt.mirror.vertical) mirrorOpt.y = boundary.y.end + boundary.y.start

        arr = getMapDataInfo(arr, mirrorOpt)
    }

    return arr
}