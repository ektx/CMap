/*
    

*/

function mapAreaChart (options) {

    var ele = document.getElementById(options.id);
    var canvasW = ele.width;
    var canvasH = ele.height;
    var ctx = ele.getContext("2d");
    var index = -1;
    var inAreaCtx;
    var getPointTime = 0;

    var drawLine = function(_options) {

        ctx.save();
        ctx.beginPath();
         // ctx.imageSmoothingEnabled = true;
        // 属性设置或返回线条末端线帽的样式。
        // 可用属性有:
        // butt     默认。向线条的每个末端添加平直的边缘。
        // round    向线条的每个末端添加圆形线帽。
        // square   向线条的每个末端添加正方形线帽。
        ctx.lineCap = _options.lineCap || 'butt';
        // 线宽
        ctx.lineWidth = _options.width;
        // 投影颜色
        ctx.shadowColor = _options.shadowColor || 'transparent' ;
        // 投影大小
        ctx.shadowBlur  = _options.shadowBlur || 0;
        // 边框颜色
        ctx.strokeStyle = _options.strokeStyle || 'transparent';

        ctx.fillStyle = _options.fillStyle || 'transparent';

        // 设置透明度
        ctx.globalAlpha= _options.alpha || 1;

        ctx.globalCompositeOperation = _options.globalCompositeOperation || 'source-over';

        // 设置一组极点
        var xStart = xEnd = yStart = yEnd = 0;
        var width = height = 0;
        var path = '';

        if (typeof _options.line == "string") {

            path = new Path2D(_options.line);

            if (_options.city) {

                var _city = _options.city[_options.index];

                width = _city.w;
                height = _city.h;

                xStart = _city.x;
                yStart = _city.y;

                xEnd = _city.x + _city.w;
                yEnd = _city.y + _city.h;

                if( ctx.isPointInPath(path, currentX, currentY) && _options.index > -1){
                    index = _options.index;
                    ctx.fillStyle = _options.hoveColor;
                }
            }

            ctx.stroke(path);
            ctx.fill( path )

        } else {

            for (var i = 0, l = _options.line.length; i < l; i+=2) {
                var x = _options.line[i];
                var y = _options.line[i+1];

                if (i === 0) {
                    xStart = xEnd = x;
                    yStart = yEnd = y;
                    
                    ctx.moveTo(x, y);
                } else {
                    xStart = x < xStart ? x : xStart;
                    xEnd   = x > xEnd ? x : xEnd;

                    yStart = y < yStart ? y : yStart;
                    yEnd   = y > yEnd   ? y : yEnd;

                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();

            if( ctx.isPointInPath(currentX, currentY) && _options.index > -1){

                if (_options.index !== index) {
                    index = _options.index;
                }
                ctx.fillStyle = _options.hoveColor;

            } 

            ctx.fill();
            ctx.closePath();

            // 输出宽高
            width = xEnd - xStart;
            height = yEnd - yStart;
        }

        
        ctx.restore();

        return {
            width: width,
            height: height,
            xCenter: xStart + width/2,
            yCenter: yStart + height/2,
            xStart: xStart,
            yStart: yStart,
            xEnd: xEnd,
            yEnd: yEnd,
            path: path // path2D
        }
    }

    var drawCityName = function(x, y, name, maxW) {
        ctx.font = "12px Microsoft Yahei";
        ctx.fillStyle = "#fff";
        ctx.fillText(name, x, y, maxW)
    }

    var cityPointArr = [];
    var getRandomPoint = function(size, areaInfo, colorArr, path) {

        var getPointTime = 0;

        for (var i = 0; i < size; i++) {

            var x = y = 0;

            if (path) {
                do {
                    var x = areaInfo.xStart + areaInfo.width * Math.random();
                    var y = areaInfo.yStart + areaInfo.height * Math.random();
                    getPointTime++;
                } while ( !ctx.isPointInPath(path, x, y) && getPointTime < 10 + size )
                
            } else {
                do {
                    var x = areaInfo.xStart + areaInfo.width * Math.random();
                    var y = areaInfo.yStart + areaInfo.height * Math.random();
                    getPointTime++;
                } while (!ctx.isPointInPath(x, y) && getPointTime < 10 + size)
            }

            cityPointArr.push({
                x: x,
                y: y,
                color: colorArr[parseInt(colorArr.length * Math.random())]
            })
        }
    }
    /*
        arc options:
        @x [number] x位置
        @y [number] y位置
        @r [number] 半径
        @fill [string] 填充效果
    */
    var drawPoint = function(arc) {
        ctx.save();
        ctx.beginPath();
        // 填充效果 
        ctx.fillStyle = arc.fill;
        // 投影颜色
        ctx.shadowColor = arc.shadowColor || 'transparent' ;
        // 投影大小
        ctx.shadowBlur  = arc.shadowBlur || 0;

        ctx.arc(arc.x, arc.y, arc.r, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    }

    var drawCity = function(_options) {
        for (var i = 0, l = _options.city.length; i < l; i++) {
            _options.line = _options.city[i].map;
            _options.index = i;
            _options.type = _options.city[i].type || false;
            _options.globalCompositeOperation = 'destination-over';

            pointCenter = drawLine( _options )
            
            if (cityPointArr.length !== _options.city.length * _options.citySize) {

                options.city.data[i].position = pointCenter;

                getRandomPoint(_options.citySize, pointCenter, _options.cityColor, pointCenter.path)
            }

            drawCityName(
                pointCenter.xCenter, 
                pointCenter.yCenter, 
                _options.city[i].name, 
                pointCenter.width
            );

            if (_options.msg)
                reportRoad({
                    path: [
                        pointCenter.xCenter,
                        pointCenter.yCenter,
                        _options.msg.center.x,
                        _options.msg.center.y
                    ],
                    direction: _options.msg.direction,
                    speed: _options.msg.speed,
                    unique: _options.msg.unique
                })
        }

        if (cityPointArr.length > 0) {
            // console.log('我要画点啦~');
            for (var i = 0, l = cityPointArr.length; i < l; i++) {
                var x = cityPointArr[i].x;
                var y = cityPointArr[i].y;
                var r = 10;
                var c = cityPointArr[i].color;

                var fillStyle = ctx.createRadialGradient(x, y, r/5, x, y, r/3*2);
                fillStyle.addColorStop(0, c);
                fillStyle.addColorStop(1,"transparent");

                drawPoint({
                    x: x,
                    y: y,
                    r: r,
                    fill: fillStyle
                })
            }
        }
    }


    var txt=options.data;//定义地图乡镇街道名称
 
    //地图鼠标移上去的事件
    var currentX = currentY = -1;
    ele.addEventListener("mousemove", function(event){
        currentX=event.offsetX;
        currentY=event.offsetY;

        // 在地图区域内
        if (inAreaCtx) {
            // 返回用户 数据索引 城市信息
            if (options.callback && options.callback.mousemove) options.callback.mousemove(index, options.city.data[index]);
        } 
        // 在地图外
        else {
            // 返回用户 -1
            if (options.callback && options.callback.mousemove) options.callback.mousemove( -1 );
        }

    });

    ele.addEventListener('click', function(e) {
        // 在地图区域内
        if (inAreaCtx) {

            if (options.callback && options.callback.click && index > -1) 
                options.callback.click( index , options.city.data[index] );
        }
    })


    //设置上报事件关联路径动画
    var interval=1;
    var interval2=500;

    /*
        options:
        @direction 方向:
            @both 双向
            @start 开始
            @end 结束
    */
    var reportRoad = function(options){ 
        
        var roadlef = options.path[0];
        var roadtop = options.path[1];
        var endX = options.path[2];
        var endY = options.path[3];

        // 动画速度
        var speed = options.speed || 500;
        var sendMesLineW = 20;
        var averageX = (endX - roadlef) / speed;
        var averageY = (endY - roadtop) / speed;
        var averX=averageX/(Math.sqrt(averageX*averageX + averageY*averageY));  
        var averY=averageY/(Math.sqrt(averageX*averageX + averageY*averageY)); 


        // 绘制引导线
        drawLine({
            width: 1,
            strokeStyle: '#6bc0c6',
            lineCap : 'round',
            alpha: .3,
            line: [roadlef, roadtop, endX, endY]
        })
 
        if (options.direction == 'both' || options.direction == 'end') {
            interval++;
            if(interval < speed){
              
                var grd = ctx.createLinearGradient(
                    roadlef + averageX * interval - sendMesLineW *averX,
                    roadtop + averageY * interval - sendMesLineW *averY, 
                    roadlef + averageX * interval, 
                    roadtop + averageY * interval
                );
                grd.addColorStop(0, "transparent");
                grd.addColorStop(1, "#ffff00");

                var x0 = roadlef + averageX * interval - sendMesLineW *averX;
                var y0 = roadtop + averageY * interval - sendMesLineW *averY;
                var x1 = roadlef + averageX * interval;
                var y1 = roadtop + averageY * interval;

                drawLine({
                    width: 3,
                    strokeStyle: grd,
                    shadowBlur: 50,
                    shadowColor: '#fff',
                    lineCap : 'round',
                    alpha: 1,
                    line: [x0, y0, x1, y1]
                })
            }
            else {
                interval = 1;
            }
        }
        if (options.direction == 'both' || options.direction == 'start') {
            interval2--;
            if(interval2 > 1){
                
                var grd2 = ctx.createLinearGradient(roadlef + averageX * interval2 + 35*averX,roadtop + averageY * interval2 + 35*averY,roadlef + averageX * interval2,roadtop + averageY * interval2);
                grd2.addColorStop(0,"transparent");
                grd2.addColorStop(1,"#ffff00");
                x0 = roadlef + averageX * interval2 + 35*averX;
                y0 = roadtop + averageY * interval2 + 35*averY;
                x1 = roadlef + averageX * interval2;
                y1 = roadtop + averageY * interval2;

                drawLine({
                    width: 3,
                    strokeStyle: grd2,
                    shadowBlur: 50,
                    shadowColor: '#fff',
                    lineCap : 'round',
                    alpha: 1,
                    line: [x0, y0, x1, y1]
                })
            }
            else{
                interval2= speed;
            }
        }
    }

    //重绘
    var repaint=function(){
        var repaintInter=setInterval(function(){
            
            ctx.clearRect(0,0, canvasW, canvasH);

            // 地图边框
            drawLine({
                    width: options.cityArea.width,
                    strokeStyle: options.cityArea.stroke.color,
                    line: options.cityArea.data
                });
            
            // 在地图区域内
            if (ctx.isPointInPath(currentX, currentY)) {
                inAreaCtx = true;
            } else {
                inAreaCtx = false;
            }

            drawCity({
                city: options.city.data,
                citySize: options.city.size,
                cityColor: options.city.color,
                // 边界宽
                width: options.city.strokeW,
                // 边框色
                strokeStyle: options.city.strokeColor,
                fillStyle: options.city.fillStyle,
                // 鼠标放上效果
                hoveColor: options.city.hoveColor,

                msg: options.message
            } );

            // 绘制星星
            if (options.star)
                drawLine(options.star)
            
        }, 16);
    }
    //初始化方法
    var init=function(){
        repaint();
    }
    init();
}













