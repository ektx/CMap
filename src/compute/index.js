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

    Object.assign(boundary, getMapDataInfo(boundary.data))

    this.setColorsHashID(opt, boundary)

    // 设置最小缩放
    opt.mapScale = Math.min(
        this.hitMainCanvas.width / boundary.width, 
        this.hitMainCanvas.height / boundary.height
    )

    opt.boundary = Object.assign({}, boundary)
    opt.mapTranslateX = 0
    opt.mapTranslateY = 0

    return opt
}


export function setBlocks (opt) {
    const blocks = this.options.map.blocks
    const areas = blocks.data

    for (let i = 0, l = areas.length; i < l; i++) {
        let _data = areas[i]
        let clearData = {}
        
        Object.assign(_data, getMapDataInfo(_data.map), {
            style: new selfStyle(blocks.style),
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

    map.blocks.forEach(val => {
        if (point.size) {
            let size = point.size
            let pointSize = 1
            
            if (size.min !== size.max) {
                pointSize = ~~getBetweenRandom(size.min, size.max)
            }

            val.point = []

            for (let i = 0; i < pointSize; i++) {
                let { x } = val.centroid
                let { y } = val.centroid

                if (size.min !== size.max) [x,y] = getPoint(val)

                val.point.push({
                    r: getBetweenRandom(minR, maxR) * this.DPI,
                    color: point.color[~~getBetweenRandom(0, point.color.length)],
                    position: {x, y}
                })
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
 */
export function scaleBlocks (map) {
    for (let i = 0, l = map.blocks.length; i < l; i++) {
        let inner = map.blocks[i]
        inner._coordinates = scaleCoordinates(inner.coordinates, map.mapScale)
    }
}

/**
 * 缩放点
 */
export function scalePoints (map) {
    let blocks = map.blocks

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
 */
export function setColorsHashID (map, data) {
    let hash = map.colorsHash

    while (true) {
        const colorKey = this.getRandomColor()

        if (!hash[colorKey]) {
            hash[colorKey] = data
            data.hitStyle = {
                fillStyle: colorKey
            }
            return
        }
    }
}


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
