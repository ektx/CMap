# CMap v2.4.0

使用 canvas 绘制简单的地图功能

![Camp](http://wx3.sinaimg.cn/large/9444af88gy1frt7dzrcnvg20m30hp4qq.gif)

- 支持缩放功能
- 支持地图下钻功能
- 支持地图历史记录功能
- 添加区块颜色功能
- 支持地图镜像功能

## 使用

```html
<!-- 1. 添加显示区域 -->
<div id="my-city"></div>

<!-- 2. 使用 -->
<script type="module">
import CMap from '../src/index.js'

let options = {
    el: '#my-city',
    map: {
        boundary: {
            style: {
                lineWidth: 8,
                strokeStyle: '#538df7',
                fillStyle: 'transparent'
            }
        },
        blocks: {
            point: {
                size: {
                    min: 1,
                    max: 5
                }, 
                r: [2, 3],
                color: ['#fff', '#4fff5f'],
            },
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
                hoverColor: 'rgba(83, 141, 247, .2)',
                holdColor: 'rgba(83, 141, 247, .4)'
            }
        }
    },
    callback: {
        click: function(evt, data) {
            myMap.history.push({
                key: data.index,
                boundary: huaian.areaData, 
                blocks: huaian.citysArr
            })
        },
        mousemove: function(evt, data){
            console.log(evt, data)
        }
    }
}

options.map.boundary.data = china.areaData
options.map.blocks.data = china.citysArr
let myMap = new CMap(options)

myMap.init()
myMap.fadeIn()
</script>
```



## Options 配置手册

- **el** `[string]` 地图存放Dom
- **usrData** `[object]` 自定义当前地图数据
- **map** `[object]` 地图信息配置
    - **boundary** `[object]` 地图主边界
        - **data** `[array]` 地图点位信息
        - **style** `[canvas style]` 样式效果
    - **blocks** `[object]` 区块信息
        - **data** `[array]` 区块地图信息
        - **selectedMode** `[false(默认) | single(单选) multiple(多选)]` 地区选择模式
        - **point** `[object]` 每个区块的点的效果设置 
            - **size** `[object]` 区块出现的点数总和
                - **min** `[number]` 点最少个数
                - **max** `[number]` 点最多个数
            - **r** [ **min**(`[number]` 最小半径), **max**(`[number]` 最大半径) ]
            - **color** `[array]` 点的颜色取值
            - **fun** `[function]` 对单个点进行处理，接受3个值:
                - **index** `[number]` 当前索引
                - **block** `[block]` 当前区块
                - **usrData** `[object]` 当前地图自定义数据
                可以通过 `return` 返回一个如下对象对点的设置
                - **color** `[color]` 自定义点的颜色
                - **r** `[number]` 半径大小
                - **position** `[object]` 自定义点的位置
                    - **x** `[number]` x轴位置
                    - **y** `[number]` y轴位置
        - **cityName** `[object]` 区块名字效果设置
            - **normal** `[canvas style]` 正常显现效果
            - **hover** `[canvas style]` 鼠标移入效果
            - **move** `[object]` 偏移
                - **x** `[number]` x轴偏移
                - **y** `[number]` y轴偏移
            - **txtVSWidth** `[number]` 文字与宽度比例,宽度在大于此倍数的情况下显示文字
        - **style** `[object]` 区块样式设置
            - **lineWidth** `[number]` 区块边框宽度
            - **strokeStyle** `[color]` 区块边框颜色
            - **fillStyle** `[color]` 区块背景颜色
            - **hoverColor** `[color]` 鼠标移入区块背景颜色
            - **holdColor** `[color]` 选中背景颜色
        - **color** `[array|boolean]` 设置区块颜色，优化级为*区块内* > *color* > *style*
            - `[array]` 数组时，区块按数组颜色内容循环生成
            - `[boolean]` 布尔值时，当为 `true` 时，随机出现颜色
    - **mirror** `[object]` `NEW` 镜像配置
        - **horizontal** `[boolean]` 水平镜像控制
        - **vertical** `[boolean]` 垂直镜像控制
- **callback** `[function]`  回调函数功能
    - **click**  `[function]` 点击事件,返回内容 (evt, data)=>{...}
    - **mousemover** `[function]` 鼠标移动事件,返回内容 (evt, data)=>{...}




## API

cmap api 接口

```javascript
let myMap = new CMap(options)
```

- myMap.**init(options)** 

  初始化地图

- myMap.**fadeIn(time, coe)** 

   `[animate]` 在指定时间内，从指定系数大小放大进入

- myMap.**fadeOut(time, coe)**  

  `[animate]` 在指定时间内，从当前大小到指定缩放系数放大淡出

- myMap.**zoomIn(time, coe)** 

  `[animate]` 在指定时间内，从指定放大系数到原始大小缩小进入

- myMap.**zoomOut(time, coe)**  

  `[animate]` 在指定时间内，从当前大小到指定系数放大消失

- myMap.**history** 地图历史记录

  - data `[array]` 地图信息组数
  - index `[number]` 地图指针
  - forward `[function]` 前进到下一个地图
  - back `[function]` 返回到上一个地图
  - go `[number]` 前进或后退number个地图


```javascript
// 前进到下一个地图
myMap.history.forward()

// 返回到上一个地图
myMap.history.back()

// 前进3个地图
myMap.history.go(3)
```

## 区块数据设置

### 区块内样式设置 style.block

| 属性        | 类型   | 说明         | 默认值 |
| ----------- | ------ | ------------ | ------ |
| lineWidth   | number | 区块边框     | -      |
| strokeStyle | color  | 边框颜色     | -      |
| fillStyle   | color  | 填充色       | -      |
| hoverColor  | color  | 鼠标移入颜色 | -      |
| holdColor   | color  | 选中时颜色   | -      |

如果没有设置，默认使用配置内容，如果没有配置，则无。

```js
citysArr: [
    {
        "name": "新疆",
        ...
        "style": {
            "block": {
                "lineWidth": 10,
                "strokeStyle": "#fff",
                "fillStyle": "#8BC34A",
                "hoverColor": "#4CAF50",
                "holdColor": "#009688"
            }
        },
        "map": ...
    },
    ...
]
```

### 区块内点自定义


在使用数组时，数组长度则为点的个数，可以支持2个参数，color 和 r 的使用。具体可以查看 **data/china.js**

```js
citysArr: [
    {
        "name": "新疆",
        ...
        "blocks": {
            "point": {
                "size": 10
            }
        },
        "map": ...
    },
    ...
]
```

### 地图镜像设置

| 属性 | 类型         | 说明           | 默认值 |
| ---- | ------------ | -------------- | ------ |
| horizontal | boolean | 水平镜像 | -      |
| vertical | boolean | 垂直镜像 | -      |

```js
// 镜像设置要放在 map 中
{
    ...
    map: {
        mirror: {
            // 水平翻转
            horizontal: true,
            // 垂直翻转
            vertical: true
        }
    }
}
```

## S.T.O

你可以使用 [S.T.O](https://github.com/ektx/STO) 来快速导出你要的 SVG 地图数据.