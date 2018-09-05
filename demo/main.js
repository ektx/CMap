let options = {
    el: '#city-information-network',
    usrData: {
        mapName: 'china',
        id: 1,
        points: {
            '安徽': {
                r: 10,
                color: '#f90'
            }
        }
    },
    map: {
        // 边界
        boundary: {
            // 边界数据
            // data: china.areaData,
            // 样式
            style: {
                lineWidth: 8,
                strokeStyle: '#538df7',
                fillStyle: 'transparent'
            }
        },
        // 块
        blocks: {
            // 块数据
            // data: china.citysArr,
            // 是否可以选择 [multiple|single|false(默认)]
            selectedMode: 'single',
            point: {
                // 个数
                size: {
                    min: 1,
                    max: 5
                }, 
                // 大小，半径
                r: [2, 3],
                // 是否要有波纹（todo）
                pop: true,
                // 点的颜色
                color: ['#fff', '#4fff5f'],
                // 处理函数
                fun: function(index, block, usrData) {
                    // console.log(index, block, usrData)
                    // 对单个点进行控制
                    if (block.name === '安徽') {
                        return usrData.points['安徽']
                    }
                },
                // 是否要有迁徙效果, all 都有, auto 随机
                // * 设置了此，则默认会有点 (todo)
                migration: 'all', 
            },
            // 区块名字效果设置
            cityName: {
                normal: {
                    fillStyle: '#fff',
                    font: "1em 'Microsoft Yahei'"
                },
                hover: {
                    fillStyle: '#4fff5f',
                    font: "1.5em 'Microsoft Yahei'"
                },
                // 定位
                move: {
                    x: 10,
                    y: 10
                },
                // 文字与宽度比例
                txtVSWidth: 3
            },
            style: {
                lineWidth: 3,
                strokeStyle: '#243e6a',
                fillStyle: 'rgba(0, 0, 0, .4)',
                hoverColor: '#FF5722',
                holdColor: 'rgba(83, 141, 247, .4)'
            },

            // 自定义颜色
            // color: [
            //     '#8BC34A',
            //     '#FFC107',
            //     '#3F51B5',
            //     '#2196F3'
            // ],
            // 随机颜色
            color: true,
        },
        
        // 镜像
        // mirror: {
        //     // 水平镜像
        //     horizontal: true,
        //     // 垂直镜像
        //     vertical: false
        // }
    },
    // 迁徙设置（todo）
    // migration: {
    //     direction: 'get', // 流向 [send|get]
    //     willback: {
    //         status: true,     // 是否返回
    //         backColor: '#f90' // 返回时颜色
    //     },
    //     // 中心
    //     center: {
    //         x: 370,
    //         y: 170
    //     },
    //     // 轨道
    //     track: {
    //         lineWidth: 1,
    //         strokeStyle: 'rgba(83, 141, 247, .4)'
    //     },
    //     // 移动点
    //     point: {
    //         speed: 200, // 速度
    //         length: 15, // 信息条的长度比
    //         style: {
    //             lineWidth: 2, // 信息条的宽
    //             strokeStyle: '#408cff' // 信息条的颜色
    //         }
    //     }
    // },
    callback: {
        click: function(evt, data) {
            // console.log( index, data )

            myMap.history.push({
                key: data.index,
                // 新边界
                boundary: huaian.areaData, 
                // 新区块
                blocks: huaian.citysArr,
                // 新的地图专有信息
                usrData: {
                    mapName: Math.random().toString(16).slice(2),
                    id: + new Date
                }
            })
        },
        // 鼠标移动事件
        mousemove: function(evt, data){
            // console.log(evt, data)
        }
    }
}

options.map.boundary.data = china.areaData
options.map.blocks.data = china.citysArr
window.myMap = new CMap(options)

myMap.init()
myMap.fadeIn()


let rng = document.querySelector('input[type=range]')
rng.addEventListener('mousedown', ()=> {
    rng.addEventListener('mousemove', rngEvt)
}, false)
rng.addEventListener('mouseup', () => {
    rng.removeEventListener('mousemove', rngEvt)
}, false)

function rngEvt () {
    myMap.scaleMap(rng.value)
}

// 取生成的值
rng.value = myMap.history.map[0].mapScale

let go = document.getElementById('go')
let forward = document.getElementById('forward')
let back = document.getElementById('back')

back.addEventListener('click', ()=> {
    myMap.history.back()
}, false)
forward.addEventListener('click', () => {
    myMap.history.forward()
})
go.addEventListener('keyup', evt => {
    if (evt.keyCode == 13|| evt.which == 13) {
        myMap.history.go( evt.target.value )
    }
})
