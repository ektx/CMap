# CMap

使用 canvas 绘制简单的地图功能



## 使用

```html
<!-- 1. 添加显示区域 -->
<div id="my-city"></div>

<!-- 2. 引入js -->
<!-- 现代浏览器使用以下 js -->
<script src="./js/cmap.js"></script>
<!-- 老版本浏览器使用以下 js -->
<script src="./js/cmap.es5.js"></script>

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

- el 地图存放Dom
- city 地图中的各区块配置信息 
    - data 所有区块信息,具体格式可以查看demo示例
        - name 下辖名称(非必填)
        - map  下辖路径
    - point 每个区块的点的效果设置     
        - size `number` 区块出现的点数总和
        - message 指定点上信息生成方式
            - all           每个点都会有信息交互
            - auto       随机给点添加信息交互
        - r  `array`  指定点的半径大小,例如:半径为2-4 [2, 4]
        - pop    `number`  点上扩展波纹个数,0为无
        - popSpeed `number` 波纹数度
        - color  `array`  点的颜色取值, 例如:color: ['#fff', 'rgba(0,0,0,)']
        - fun    `function`  每个点的回调函数,默认返回值有以下(index, points) 值, 
            - index   当前区域索引
            - points  区域中所有点
    - cityName      区块的名称显示效果            
        - normal    定义文字显示效果,配置按Canvas对文字的配置规则 
        - hover     定义文字鼠标放上时显示效果,配置按Canvas对文字的配置规则
        - align     `center | start | end | left | right`  文字对齐
        - move      对文字进行细节调整,支持 x,y的移动
    - style  所有区块的样式配置            
        - lineWidth   `number`      区块的分隔线粗细 
        - strokeStyle `color`       指定分隔线的颜色
        - fillStyle        `color`       区块的背景色
- cityArea      地图外边框绘制信息  
    - data      地图边界点集合            
    - style     样式,具体参考 canvas 的参数 
    - earthLine `boolean` 使用地理坐标,可以让地图上下反转,在地图上下不对时使用           
- message  迁徙信息配置      
    - direction `get(从中心到点)|send(从心到中心)`   开始反向
    - speed      `number`  速度                    
    - willback   `true| false`  是否返回
    - backColor `color` 返回时颜色 
    - light  迁徙光标
        - length  信息条的长度比
        - style 光标的样式,具体使用canvas的样式设置
            - lineWidth   `number` 信息条的宽
            - strokeStyle `color` 信息条的颜色
        - eneter 中心点
            - x `number` x 坐标
            - y `number` y 坐标
        - line  光标轨道,具体使用canvas的样式设置
            - lineWidth `number` 宽度
            - strokeStyle 颜色
- callback  回调函数功能,返回值有(index, data, event), index 是索引, data是当前区域的信息, event是事件信息      
    - click  `function` 点击事件
    - mousemover `function` 鼠标移动事件




### S.T.O

你可以使用 [S.T.O](https://github.com/ektx/STO) 来快速导出你要的 SVG 地图数据.