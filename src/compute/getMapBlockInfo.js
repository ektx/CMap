
/**
 * @name 获取区块信息
 * @param {Array} data 
 */
export default function getMapDataInfo (data) {
    let xArr = []
    let yArr = []
    let centroid = {}
    let coordinates = []
    
    for (let i = 0, l = data.length; i < l; i++) {
        let _data = computedData(data[i])
        xArr.push(_data.x.start, _data.x.end)
        yArr.push(_data.y.start, _data.y.end)
        centroid = _data.centroid
        coordinates.push( _data.coordinates )
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
        coordinates,
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


/**
 * @name 计算数组的最大值最小值
 * @param {Array} arr - 数组
 */
function computedData (arr) {
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
    let coordinates = []

    for (let i = 0, l = arr.length; i < l; i+=2) {
        xArr.push(arr[i])
        yArr.push(arr[i + 1])
        coordinates.push([arr[i], arr[i + 1]])
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
        centroid: getCentroid(arr),
        coordinates
    }
}

/**
 * @name 质点中心
 * @param {Array} arr - 数组
 */
function getCentroid ( arr ) {
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
