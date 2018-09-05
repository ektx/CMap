export class History {

    constructor () {
        this.map = [],
        this.index = 0
    }

    go (val) {
        let history = this.constructor.history
        let mapSize = history.map.length
        
        if (isNaN(val)) {
            return console.warn(`val is not a Number`)
        }

        val = parseInt(val)
        if (!val) return

        // 重置新的地图状态
        let i = history.index
        let max = mapSize -1
        i += val
        
        if (val > 0) {
            i = i >  max ? i = max : i
        } else {
            i = i < 0 ? 0 : i
        }
        
        this.constructor.zoomOut()
        this.constructor.history.index = i

        setTimeout(() => {
            this.constructor.fadeIn()
        }, 1000)
    }

    back () {
        // 重置新的地图状态
        let i = this.constructor.history.index

        if (!i) return

        this.constructor.fadeOut()

        this.constructor.history.index = i -1 > 0 ? i -1 : 0

        setTimeout(() => {
            this.constructor.zoomIn()
        }, 1000)
    }

    forward () {
        let history = this.constructor.history
        let i = history.index
        // 重置新的地图状态
        i += 1

        if (i >= history.map.length) return

        this.constructor.history.index = i

        this.constructor.zoomOut()

        setTimeout(() => {
            this.constructor.fadeIn()
        }, 1000)
    }

    // key 用于区分渲染
    push ({boundary, blocks, key, usrData} = opt) {
        let _ = this.constructor
        let _H = _.history
        let setNewMap = () => {
            let optMap = _.options.map
    
            optMap.boundary.data = boundary
            optMap.blocks.data = blocks
            _.options.usrData = usrData || {}
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