export class History {

    constructor () {
        this.map = [],
        this.index = 0
    }

    go (val) {
        console.log(`go ${val}`)
    }

    back () {
        console.log(`back`)
        let map = this.data[this.data.length -1]
        let __p = this._that.__proto__

        this._that.zoomOut()


        // 重置新的地图状态
        this._that = map
        this._that.__proto__ = __p

        setTimeout(() => {
            this._that.fadeIn()
        }, 1000)
    }

    forward () {
        console.log('forward')
    }

    push ({that, boundary, blocks} = opt) {
        let _boundary = Object.assign({}, that.boundary)
        that.history.data.push(Object.assign({}, that))
        that.history.data[that.history.data.length - 1].boundary = Object.assign({}, _boundary)
        // that.history.data.push( copyObj(that) )
        debugger
    
        that.zoomOut()
        
        that.options.map.boundary.data = boundary
        that.options.map.blocks.data = blocks
        // 重置地图数据
        that.setMapData()
        // 重置新的地图状态
        that.mouseEvtData.mapX = that.mapTranslateX
        that.mouseEvtData.mapY = that.mapTranslateY
    
        setTimeout(() => {
            that.fadeIn()
        }, 1000)
    }

    replace (index, data) {
        console.log(index, data)
    }
}

export function setHistory () {
    this.history = new this.History()
}

// function copyObj (obj) {
//     debugger
//     console.log(obj)
//     let result = {}

//     for (let key in obj) {
//         if (typeof obj[key] == 'object') {
//             result[key] = copyObj(obj[key])
//         } else {
//             result[key] = obj[key]
//         }
//     }

//     return result
// }