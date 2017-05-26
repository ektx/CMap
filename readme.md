# Canvas Map

使用 canvas 绘制简单的地图功能



## 使用

```html
<div id="my-city"></div>
```



## 配置手册

### 主体结构

```javascript
let myMap = new MamAreaChart({
  el: '#my-city';
  city: { /* city 的配置说明 */ },
  cityArea: {/* 城市主边框的配置说明 */},
  callback: {/* 回调函数 */}
})
```

| 参数       | 说明          | 示例   |
| -------- | ----------- | ---- |
| el       | 地图存放Dom     |      |
| city     | 地图中的各区块配置信息 |      |
| cityArea | 地图外边框绘制信息   |      |
| message  | 迁徙信息配置      |      |
| callback | 回调函数功能      |      |

### City 的配置说明

| 参数       | 说明                    | 示例   |
| -------- | --------------------- | ---- |
| data     | 所有区块信息,具体格式可以查看demo示例 |      |
| Point    | data中每个区块的点的效果设置      |      |
| cityName | 区块的名称显示效果             |      |
| style    | 所有区块的样式配置             |      |

#### City Point 配置说明

| 参数      | 类型          | 说明                                       | 示例                              |
| ------- | ----------- | ---------------------------------------- | ------------------------------- |
| size    | 数字          | 指点区块出现的点数总和                              | size: 5                         |
| message | all \| auto | 指定点上信息生成方式                               |                                 |
|         | all         | 每个点都会有信息交互                               | message: 'all'                  |
|         | auto        | 随机给点添加信息交互                               | message: 'auto'                 |
| r       | 数组          | 指定点的半径大小                                 | r: [2, 4]                       |
| pop     | number      | 点上扩展波纹个数,0为无                             | pop: 0                          |
| color   | 数组          | 点的颜色取值                                   | color: ['#fff', 'rgba(0,0,0,)'] |
| fun     | 函数          | 每个点的回调函数,默认返回, pointInfo 当前点的信息, areaInfo 此点所在区块的信息 |                                 |
|         |             |                                          |                                 |

#### CityName 配置说明

| 参数     | 类型                                     | 说明                              |
| ------ | -------------------------------------- | ------------------------------- |
| normal | 对象                                     | 定义文字显示效果,配置按Canvas对文字的配置规则      |
| hover  | 对象                                     | 定义文字鼠标放上时显示效果,配置按Canvas对文字的配置规则 |
| align  | [center \| start \| end\| left\|right] | 文字对齐                            |
| move   | 对象                                     | 对文字进行细节调整,支持 x,y的移动             |
|        |                                        |                                 |

```javascript
// 综合示例
cityName: {
    normal: {
        fillStyle: '#fff',
        font: "10px Microsoft Yahei"
    },
    hover: {
        fillStyle: '#4fff5f',
        font: "15px Microsoft Yahei"
    },
    align: 'start', // 居中方式
    move: {
        // 向上移动 10 px
        y: -10
        // 向右移动 10 px
        x: 10
    }
}
```

#### City Style 配置说明

| 参数          | 类型   | 说明       |
| ----------- | ---- | -------- |
| lineWidth   | 数字   | 区块的分隔线粗细 |
| strokeStyle | 颜色   | 指定分隔线的颜色 |
| fillStyle   | 颜色   | 区块的背景色   |

```javascript
style: {
    lineWidth: 1,
    strokeStyle: '#243e6a',
    fillStyle: 'rgba(0, 0, 0, .4)',
    hoveColor: '#243e6a'
}
```

### cityArea 地图边界设置

```javascript
cityArea: {
    // areaData 地图边界点集合 svg [], point为[[]]
    data: areaData,
    style: {
        lineWidth: 3,
        strokeStyle: '#538df7'
    }
}
```

| 参数    | 说明                 |
| ----- | ------------------ |
| data  | 地图边界点集合            |
| style | 样式,具体参考 canvas 的参数 |
| earthLine | 使用地理坐标           |

## Message 迁徙信息配置

```javascript
message: {
    direction: 'send', // 流向 [send|get]
    speed: 200, // 速度
    light: {
        length: 15, // 信息条的长度比
        style: {
            lineWidth: 2, // 信息条的宽
            strokeStyle: '#408cff' // 信息条的颜色
        }
    },
    center: {
        x: 300,
        y: 280
    },
    line: {
        lineWidth: 1,
        strokeStyle: 'rgba(83, 141, 247, .4)'
    }
}
```

| 参数        | 类型                            | 说明                    |
| --------- | ----------------------------- | --------------------- |
| direction | ['get'(从中心到点)\|'send'(从心到中心)] | 开始反向                  |
| speed     | number                        | 速度                    |
| willback  | [true\| false]                | 是否返回                  |
| backColor | color                         | 返回时颜色                 |
| light     |                               | 迁徙光标                  |
|           | length                        | 光标长度                  |
|           | style                         | 光标的样式,具体使用canvas的样式设置 |
| eneter    |                               | 中心点                   |
|           | x,y                           | 地图点                   |
| line      |                               | 光标轨道,具体使用canvas的样式设置  |
|           | lineWidth                     | 宽度                    |
|           | strokeStyle                   | 颜色                    |

### callback 回调函数功能

| 参数         | 类型       | 说明     |
| ---------- | -------- | ------ |
| click      | function | 点击事件   |
| mousemover | function | 鼠标移动事件 |
|            |          |        |

```javascript
callback: {
    // index 当前区块索引 data 当前区块的信息 event 事件信息
    click: function(index, data, event) {
        console.log( index, data )
    },
    mousemove: function(index, data, event){
        // console.log(index, data)
    }
}
```

