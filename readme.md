# CMap v2

使用 canvas 绘制简单的地图功能



## 使用

```html
<!-- 1. 添加显示区域 -->
<div id="my-city"></div>

<!-- 2. 引入js -->
<!-- 现代浏览器使用以下 js -->
<script src="./js/cmap.js"></script>

<!-- 3. 使用 -->
<script>
    let option = {
        el: '#my-city',
        city: {
            data: [ ... ] // 下辖地区
        },
        cityArea: {
            data: [ ... ] // 边界
        },
        callback: {
            click: (index, data) => {
                // 点击事件
            },
            mousemove: (index, data) => {
                // 鼠标移动事件
            }
        }
    };

    let myMap = new CMap(option);
    myMap.init();
</script>
```



## 配置手册

- **el** [string] 地图存放Dom
- **map** [object] 地图信息配置
    - **boundary** [object] 地图主边界
        - **data** [array] 地图点位信息
        - **style** [canvas style] 样式效果
    - **blocks** [object] 区块信息
        - **data** [array] 区块地图信息
        - **selectedMode** [false(默认) | single(单选) multiple(多选)] 地区选择模式
        - **point** [object] 每个区块的点的效果设置 
            - **size** [object] 区块出现的点数总和
                - **min** [number] 点最少个数
                - **max** [number] 点最多个数
            - **r** [ **min**([number] 最小半径), **max**([number] 最大半径) ]
            - **color** [array] 点的颜色取值
        - **cityName** [object] 区块名字效果设置
            - **normal** [canvas style] 正常显现效果
            - **hover** [canvas style] 鼠标移入效果
            - **move** [object] 偏移
                - **x** [number] x轴偏移
                - **y** [number] y轴偏移
            - **txtVSWidth** [number] 文字与宽度比例,宽度在大于此倍数的情况下显示文字
        - **style** [object] 区块样式设置
            - **lineWidth** [number] 区块边框宽度
            - **strokeStyle** [color] 区块边框颜色
            - **fillStyle** [color] 区块背景颜色
            - **hoverColor** [color] 鼠标移入区块背景颜色
            - **holdColor** [color] 选中背景颜色
- **callback** [function]  回调函数功能
    - **click**  [function] 点击事件,返回内容 (evt, data)=>{...}
    - **mousemover** [function] 鼠标移动事件,返回内容 (evt, data)=>{...}




### S.T.O

你可以使用 [S.T.O](https://github.com/ektx/STO) 来快速导出你要的 SVG 地图数据.