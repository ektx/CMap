
export function selfStyle (style) {
    for (let i in style) {
        this[i] = style[i]
    }
}

/**
 * @name 取2个数字之前的随机数据
 * @param {Number} min 最小值
 * @param {Number} max 最大值
 */
export function getBetweenRandom (min, max) {
    return min + max * Math.random()
}

/**
 * @description 点在多边形内算法，JS判断一个点是否在一个复杂多边形的内部,
 * https://blog.csdn.net/heyangyi_19940703/article/details/78606471
 */
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

/**
 * @name 缩放坐标
 * @param {Array} arr 数据
 * @param {Number} scale 缩放大小 
 */
export function scaleCoordinates (arr, scale) {
    let result = []
    for (let i = 0, l = arr.length; i < l; i++) {
        result[i] = []
        let inner = arr[i]
        for (let n = 0, m = inner.length; n < m; n++) {
            result[i].push([
                inner[n][0] * scale,
                inner[n][1] * scale
            ])
        }
    }
    return result
}