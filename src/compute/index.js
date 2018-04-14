import getMapDataInfo from './getMapBlockInfo.js'
import { setDPIFontSize } from '../style.js'
import {
    selfStyle,
    getBetweenRandom,
    isInPolygon,
    scaleCoordinates
} from './methods.js'

export function setBoundary () {
    let boundary = this.options.map.boundary
    let currentMap = this.history.map[this.history.index]

    Object.assign(boundary, getMapDataInfo(boundary.data))

    this.setColorsHashID(currentMap, boundary)

    // 设置最小缩放
    currentMap.mapScale = Math.min(
        this.hitMainCanvas.width / boundary.width, 
        this.hitMainCanvas.height / boundary.height
    )

    currentMap.boundary = boundary
    currentMap.mapTranslateX = 0
    currentMap.mapTranslateY = 0
}

/**
 * @param {Boolean} updateHash 是否要更新数据
 */
export function setBlocks (updateHash) {
    const blocks = this.options.map.blocks
    const areas = blocks.data

    this.blocks = []

    for (let i = 0, l = areas.length; i < l; i++) {
        let _data = areas[i]
        let clearData = {}
        
        Object.assign(_data, getMapDataInfo(_data.map), {
            style: new selfStyle(blocks.style),
            index: i,
            over: false,
            hold: false
        })
        
        this.setColorsHashID(_data)

        this.blocks.push(_data)
    }
}


/**
 * @name 设置文字
 * @description 对文字的大小按屏幕地 devicePixelRatio 缩放
 */
export function setTextName () {
    let cityName = this.options.map.blocks.cityName

    if (!cityName.fixed) {
        Object.keys(cityName).forEach(name => {
            Object.assign(
                cityName[name], 
                setDPIFontSize(cityName[name], this.DPI)
            )
        })
    }

    if (!cityName.hasOwnProperty('normal')) {
        return console.warn(`Don't find cityName has 'normal'`)
    }

    this.blocks.forEach(val => {
        val.nameStyle = {
            normal: new selfStyle(cityName.normal),
            hover: new selfStyle(cityName.hover ? cityName.hover : cityName.normal)
        }
    })

    cityName.fixed = true
}

/**
 * @name 设置区块内的点
 */
export function getPoints () {
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

    this.blocks.forEach(val => {
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
}

/**
 * @name 缩放地图
 * @param {Number} val 缩放地图
 */
export function setMapScale (val) {
    this.mapScale = val || this.mapScale

    this.scaleBoundary()
    this.scaleBlocks()
    this.scalePoints()
}

/**
 * @name 缩放边界
 */
export function scaleBoundary () {
    if (this.mapTranslateX === 0) {
        this.mapTranslateX =  0 - this.boundary.x.start * this.mapScale
        this.mapTranslateY = 0 - this.boundary.y.start * this.mapScale
    }
    
    this.boundary._coordinates = scaleCoordinates(this.boundary.coordinates, this.mapScale)
}

/**
 * @name 缩放块
 */
export function scaleBlocks () {
    let l = this.blocks.length
    for (let i = 0; i < l; i++) {
        let inner = this.blocks[i]
        inner._coordinates = scaleCoordinates(inner.coordinates, this.mapScale)
    }
}

/**
 * @name 缩放点
 */
export function scalePoints () {
    const map = this.options.map
    let blocks = this.blocks
    let l = blocks.length

    for (let i = 0; i < l; i++) {
        blocks[i]._point = []
        let pointL = blocks[i].point.length

        for (let p = 0; p < pointL; p++) {
            let point = blocks[i].point[p]

            blocks[i]._point.push( {
                x: point.position.x * this.mapScale,
                y: point.position.y * this.mapScale,
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
 * @param {Number} val 缩放大小
 */
export function scaleMap (val) {
    this.setMapScale(val)
    this.translateCtx(this.mapTranslateX, this.mapTranslateY)

    window.requestAnimationFrame(() => this.drawAllBoundary() )
}

export function getLikeGeoJson (arr) {
    let result = []

    for (let i = 0, l = arr.length; i < l; i+=2) {
        result.push([arr[i], arr[i+1]])
    }
    return result
}
