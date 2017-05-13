# Canvas Map

使用 canvas 绘制简单的地图功能



## 配置手册

### 主体结构

| 参数       | 说明          | 示例                  |
| -------- | ----------- | ------------------- |
| el       | 地图存放Dom     | `el: '#my-map-box'` |
| city     | 地图中的各区块配置信息 |                     |
| cityArea | 地图外边框绘制信息   |                     |

### City 的配置说明

| 参数       | 说明                    | 示例   |
| -------- | --------------------- | ---- |
| data     | 所有区块信息,具体格式可以查看demo示例 |      |
| Point    | data中每个区块的点的效果设置      |      |
| cityName | 区块的名称显示效果             |      |
| style    | 所有区块的样式配置             |      |

#### City Point 配置说明

| 参数      | 类型            | 说明                                       | 示例                                       |
| ------- | ------------- | ---------------------------------------- | ---------------------------------------- |
| size    | 数字            | 指点区块出现的点数总和                              | size: 5                                  |
| message | all \| auto   | 指定点上信息生成方式                               |                                          |
|         | all           | 每个点都会有信息交互                               | message: 'all'                           |
|         | auto          | 随机给点添加信息交互                               | message: 'auto'                          |
| r       | 数组            | 指定点的半径大小                                 | r: [2, 4]                                |
| pop     | true \| false | 点上是否有扩展波纹                                | pop: false                               |
| color   | 数组            | 点的颜色取值                                   | color: ['#fff', 'rgba(0,0,0,)']          |
| fun     | 函数            | 每个点的回调函数,默认返回, pointInfo 当前点的信息, areaInfo 此点所在区块的信息 | fun: function(pointInfo, areaInfo) { console.log(ponitInfo, areaInfo); } |
|         |               |                                          |                                          |

#### City Name 配置说明

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

