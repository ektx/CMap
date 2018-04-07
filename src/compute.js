
export function setBoundary () {
    let boundary = this.options.map.boundary

    Object.assign(boundary, this.getMapDataInfo(boundary.data))

    this.setColorsHashID(boundary)
    
    // 设置最小缩放
    this.options.map.center = {
        x: this.hitMainCanvas.width / 2,
        y: this.hitMainCanvas.height / 2,
    }
    
    this.mapScale = Math.min(
        this.hitMainCanvas.width / boundary.width, 
        this.hitMainCanvas.height / boundary.height
    )

    this.setToMapCenter()

    let clearData = this.autoSizeData( boundary.data )
    boundary.mapData = clearData.result
    boundary.map = clearData.origin
}

	/**
	 * @param {Boolean} updateHash 是否要更新数据
	 */
export function setBlocks (updateHash) {
    const blocks = this.options.map.blocks
    const areas = blocks.data

    const selfStyle = function (style) {
        for (let i in style) {
            this[i] = style[i]
        }
    }

    for (let i = 0, l = areas.length; i < l; i++) {
        let _data = areas[i]
        let clearData = {}
        
        if (!updateHash) {
            Object.assign(_data, this.getMapDataInfo(_data.map), {
                style: new selfStyle(blocks.style),
                index: i,
                over: false,
                hold: false,
                cityName: {
                    normal: new selfStyle(blocks.cityName.normal),
                    hover: new selfStyle(blocks.cityName.hover)
                }
            })
            
            this.setColorsHashID(_data)

            clearData = this.autoSizeData( _data.map )
        } else {
            clearData = this.autoSizeData(_data.map, _data.map)
        }

        _data.mapData = clearData.result
        _data.map = clearData.origin
    }
}


/**
 * 
 * @param {Boolean} notReSetFont 不需要重置字体
 */
export function setTextName (notReSetFont) {
    let map = this.options.map
    let blocks = map.blocks
    let boundary = map.boundary
    let cityName = blocks.cityName
    let move = cityName.move || {x:0, y:0}
    let toMapCenter = boundary.toMapCenter

    // 设置文字与宽度显示比
    this.textVsWidth = cityName ? cityName.txtVSWidth : this.textVsWidth

    blocks.data.forEach(val => {
        let _name = val.cityName
        _name.x = (val.centroid.x - boundary.x.start) * this.mapScale + toMapCenter.x + move.x
        _name.y = (val.centroid.y - boundary.y.start) * this.mapScale + toMapCenter.y + move.y

        if (this.DPI > 1 && !notReSetFont) {
            _name.normal.font = this.setDPIFontSize(_name.normal.font)

            if (_name.hasOwnProperty('hover') && _name.hover.hasOwnProperty('font')) {
                _name.hover.font = this.setDPIFontSize(_name.hover.font)
            }
        }
    })
}


export function getPoints () {
    let blocks = this.options.map.blocks
    let blockData = blocks.data
    let point = blocks.point
    let minR = Math.min.apply({}, point.r)
    let maxR = Math.max.apply({}, point.r)

    let getPoint = val => {
        let x = -1
        let y = -1
        while (true) {
            x = ~~this.getBetweenRandom(val.x.start, val.x.end)
            y = ~~this.getBetweenRandom(val.y.start, val.y.end)
            if (this.isInPolygon([x,y], val.map[0])) {
                return [x,y]
            }
        }
    }

    blockData.forEach(val => {
        if (point.size) {
            let size = point.size
            let pointSize = 1
            
            if (size.min !== size.max) {
                pointSize = ~~this.getBetweenRandom(size.min, size.max)
            }

            val.point = []

            for (let i = 0; i < pointSize; i++) {
                let { x } = val.centroid
                let { y } = val.centroid

                if (size.min !== size.max) [x,y] = getPoint(val)

                val.point.push({
                    r: this.getBetweenRandom(minR, maxR) * this.DPI,
                    color: point.color[~~this.getBetweenRandom(0, point.color.length)],
                    position: {x, y}
                })
            }
        }
    })
}

export function autoSizeData (arr, hasGeoJson) {
    let _boundary = this.options.map.boundary
    let _toMapCenter = _boundary.toMapCenter
    let getScaleData = arr => {
        let result = []
        for (let i = 0, l = arr.length; i < l; i++) {
            let x = arr[i][0]
            let y = arr[i][1]

            x = (x - _boundary.x.start) * this.mapScale + _toMapCenter.x
            y = (y - _boundary.y.start) * this.mapScale + _toMapCenter.y

            result[i] = [x, y]
        }
        return result
    }
    
    let loop = data => {
        let result = []
        let origin = []
        for (let i = 0, l = data.length; i < l; i++) {
            if (Array.isArray(data[i])) {
                if (hasGeoJson) {
                    origin[i] = hasGeoJson[i]
                } else {
                    origin[i] = this.getLikeGeoJson(data[i])
                }
                result[i] = getScaleData(origin[i])
            }
        }
        return { result, origin }
    }
    return loop( arr )
}

/**
 * 计算数组的最大值最小值
 * @param {Array} arr - 数组
 */
export function computedData (arr) {
    if (!Array.isArray(arr))
        return console.warn(`你需要传入数组!`)

    let width = 0
    let height = 0
    let xStart = 0
    let yStart = 0
    let xEnd = 0
    let yEnd = 0
    let xArr = []
    let yArr = []
    let data = []

    for (let i = 0, l = arr.length; i < l; i+=2) {
        xArr.push(arr[i])
        yArr.push(arr[i + 1])
    }

    xStart = Math.min.apply({}, xArr)
    xEnd = Math.max.apply({}, xArr)

    yStart = Math.min.apply({}, yArr)
    yEnd = Math.max.apply({}, yArr)

    width = xEnd - xStart
    height = yEnd - yStart

    return {
        width,
        height,
        x: {
            center: xStart + width/2,
            start: xStart, 
            end: xEnd
        },
        y: {
            center: yStart + height/2,
            start: yStart, 
            end: yEnd
        },
        centroid: this.getCentroid(arr)
    }
}

export function setMapScale (val) {
    let boundary = this.options.map.boundary
    this.mapScale = val
    this.setToMapCenter()
    // 重新计算边界
    boundary.mapData = this.autoSizeData(boundary.data, boundary.map).result
    this.setBlocks(true)
    this.setPoints()
    this.setTextName(true)
    this.scaleEvtStatus = true
}

/**
 * 质点中心
 * @param {Array} arr - 数组
 */
export function getCentroid ( arr ) {
    let twoTimesSignedArea = 0
    let cxTimes6SignedArea = 0
    let cyTimes6SignedArea = 0

    let length = arr.length

    for ( let i = 0, l = arr.length; i < l; i+=2) {
        let _x = parseFloat(arr[i])
        let _y = parseFloat(arr[i+1])
        let __x = parseFloat(arr[i+2])
        let __y = parseFloat(arr[i+3])

        if (i + 3 > arr.length) {
            __x = parseFloat(arr[0])
            __y = parseFloat(arr[1])
        }

        let twoSA = _x * __y - __x * _y

        twoTimesSignedArea += twoSA
        cxTimes6SignedArea += (_x + __x) * twoSA
        cyTimes6SignedArea += (_y + __y) * twoSA
    }
    
    let sixSignedArea = 3 * twoTimesSignedArea

    return {
        x: ~~(cxTimes6SignedArea / sixSignedArea),
        y: ~~(cyTimes6SignedArea / sixSignedArea)
    }
}

export function getMapDataInfo (data) {
    let xArr = []
    let yArr = []
    let centroid = {}
    
    for (let i = 0, l = data.length; i < l; i++) {
        let _data = this.computedData(data[i])
        xArr.push(_data.x.start, _data.x.end)
        yArr.push(_data.y.start, _data.y.end)
        centroid = _data.centroid
    }

    let xStart = Math.min.apply({}, xArr)
    let yStart = Math.min.apply({}, yArr)
    let xEnd = Math.max.apply({}, xArr)
    let yEnd = Math.max.apply({}, yArr)
    let width = xEnd - xStart
    let height = yEnd - yStart

    return {
        width,
        height,
        x: {
            start: xStart,
            end: xEnd,
            center: xStart + width / 2
        },
        y: {
            start: yStart,
            end: yEnd,
            center: yStart + height / 2
        },
        centroid
    }
}

// 返回2个数之间随机数
export function getBetweenRandom (min, max) {
    return min + max * Math.random()
}

export function getLikeGeoJson (arr) {
    let result = []

    for (let i = 0, l = arr.length; i < l; i+=2) {
        result.push([arr[i], arr[i+1]])
    }
    return result
}

// 点在多边形内算法，JS判断一个点是否在一个复杂多边形的内部
// https://blog.csdn.net/heyangyi_19940703/article/details/78606471
export function isInPolygon (checkPoint, polygonPoints) { 
    let counter = 0 
    let xinters 
    let p1
    let p2  
    let pointCount = polygonPoints.length  
    
    p1 = polygonPoints[0] 

    for (let i = 1; i <= pointCount; i++) {  
        p2 = polygonPoints[i % pointCount]
        if (  
            checkPoint[0] > Math.min(p1[0], p2[0]) &&  
            checkPoint[0] <= Math.max(p1[0], p2[0])  
        ) {  
            if (checkPoint[1] <= Math.max(p1[1], p2[1])) {  
                if (p1[0] != p2[0]) {  
                    xinters =  
                        (checkPoint[0] - p1[0]) *  
                            (p2[1] - p1[1]) /  
                            (p2[0] - p1[0]) +  
                        p1[1];  
                    if (p1[1] == p2[1] || checkPoint[1] <= xinters) {  
                        counter++  
                    }  
                }  
            }  
        }  
        p1 = p2
    }  
    if (counter % 2 == 0) {  
        return false 
    } else {  
        return true 
    }  
}


export function setPoints () {
    const map = this.options.map
    const boundary = map.boundary
    const toMapCenter = boundary.toMapCenter
    const X = boundary.x.start
    const Y = boundary.y.start
    let data = map.blocks.data

    for (let i = 0, l = data.length; i < l; i++) {
        data[i]._point = []
        data[i].point.forEach(point => {
            data[i]._point.push( {
                x: (point.position.x - X) * this.mapScale + toMapCenter.x,
                y: (point.position.y - Y) * this.mapScale + toMapCenter.y,
                r: point.r,
                color: point.color
            })
        })
    }
}

export function setToMapCenter () {
    let boundary = this.options.map.boundary

    boundary.toMapCenter = {
        x: this.mapTranslateX + (this.mainCanvas.width - boundary.width * this.mapScale) / 2,
        y: this.mapTranslateY + (this.mainCanvas.height - boundary.height * this.mapScale) / 2
    }
}


export function setColorsHashID (data) {
    while (true) {
        const colorKey = this.getRandomColor()

        if (!this.colorsHash[colorKey]) {
            this.colorsHash[colorKey] = data
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
    
    if (Array.isArray(this.mouseMoveStatus)) {
        this.mapTranslateX += this.mouseMoveStatus[0]
        this.mapTranslateY += this.mouseMoveStatus[1]
        this.mouseMoveStatus = false
    }

    this.setMapScale(val)

    window.requestAnimationFrame(() => this.drawAllBoundary() )
}