export class History {

    constructor () {
        this.map = [],
        this.index = 0
    }

    go (val) {
        console.log(`go ${val}`)
        
        if (isNaN(val)) {
            return console.warn(`val 不是数字`)
        }

        this.constructor.zoomOut()
        
        // 重置新的地图状态
        let i = this.constructor.history.index
        let max = this.constructor.history.map.length -1
        i += val

        if (val > 0) {
            i = i >  max ? i = max : i
        } else {
            i = i < 0 ? 0 : i
        }

        this.constructor.history.index = i

        setTimeout(() => {
            this.constructor.fadeIn()
        }, 1000)
    }

    back () {
        this.constructor.zoomOut()

        // 重置新的地图状态
        let i = this.constructor.history.index

        this.constructor.history.index = i -1 > 0 ? i -1 : 0

        setTimeout(() => {
            this.constructor.fadeIn()
        }, 1000)
    }

    forward () {
        this.constructor.zoomOut()

        // 重置新的地图状态
        this.constructor.history.index += 1

        setTimeout(() => {
            this.constructor.fadeIn()
        }, 1000)
    }

    // key 用于区分渲染
    push ({boundary, blocks, key} = opt) {
        let _ = this.constructor
        let _H = _.history
        let setNewMap = () => {
            let optMap = _.options.map
    
            optMap.boundary.data = boundary
            optMap.blocks.data = blocks
            // 重置地图数据
            _.setMapData()
    
            _H.map[_H.index].parentID = key
        }
        
        _.zoomOut()
        _H.index += 1
        
        let oldMap = _H.map[_H.index]
        
        if (oldMap) {
            if (oldMap.parentID !== key) {
                _H.map.length = _H.index
                setNewMap()
            }
        } else {
            setNewMap()
        }

        setTimeout(() => {
            _.fadeIn()
        }, 1000)
    }
}

export function setHistory () {
    this.history = new this.History()
    this.history.__proto__.constructor = this
}