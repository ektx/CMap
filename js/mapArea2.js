
function MapAreaChart(obj) {
	this.options = obj;
	this.cityArr = obj.city;
	this.message = obj.message;
	this.callback = obj.callback;

	this.areas = [];

	this.ele = document.querySelector(obj.el);
	this.ctx = this.ele.getContext('2d');
	this.ctxW = this.ele.width;
	this.ctxH = this.ele.height;

	this.currentX = -1;
	this.currentY = -1;

	this.inAreaCtx = -1;

}


// 绘制边界
MapAreaChart.prototype.drawCityArea = function() {
	
	this.drawCityArea( this.options.cityArea )

}

MapAreaChart.prototype.drawCity = function() {
	
	// 绘制边界
	this.drawCityArea( this.options.cityArea )

}

MapAreaChart.prototype = {

	setCtxState: function(styleOption) {

		let ctx = this.ctx;

		ctx.save();
		ctx.beginPath();
		// ctx.imageSmoothingEnabled = true;
		// 属性设置或返回线条末端线帽的样式。
		// 可用属性有:
		// butt     默认。向线条的每个末端添加平直的边缘。
		// round    向线条的每个末端添加圆形线帽。
		// square   向线条的每个末端添加正方形线帽。
		// ctx.lineCap 	= styleOption.lineCap || 'butt';
		// 线宽
		// ctx.lineWidth 	= styleOption.lineWidth || 1;
		// 投影颜色
		// ctx.shadowColor = styleOption.shadowColor || 'transparent' ;
		// 投影大小
		// ctx.shadowBlur  = styleOption.shadowBlur || 0;
		// 边框颜色
		// ctx.strokeStyle = styleOption.strokeStyle || '#f90';

		// ctx.fillStyle 	= styleOption.fillStyle || 'transparent';

		// 设置透明度
		// ctx.globalAlpha	= styleOption.alpha || 1;

		// ctx.globalCompositeOperation = styleOption.globalCompositeOperation || 'source-over';

		for ( let i in styleOption) {
			ctx[i] = styleOption[i]
		}

		return ctx;

	},

	drawLine: function(_options) {

		this.setCtxState( _options.style );

		var path = '';

		if (typeof _options.line == "string") {
			var _city = _options.city[_options.index];

			path = new Path2D(_options.line);

			if( this.ctx.isPointInPath(path, currentX, currentY) && _options.index > -1){
				index = _options.index;
				this.ctx.fillStyle = _options.hoveColor;
			}

			this.ctx.stroke(path);
			this.ctx.fill( path )

		} else {
	        for (let i = 0, l = _options.line.length; i < l; i+=2) {
				let x = _options.line[i];
                let y = _options.line[i+1];
	            if (i === 0) {
	                this.ctx.moveTo(x, y);
	            } else {
	                this.ctx.lineTo(x, y);
	            }
			}

			if( this.ctx.isPointInPath( this.currentX, this.currentY)){
                this.ctx.fillStyle = 'rgba(255, 0, 0, .5)';
            }

			this.ctx.stroke();
			this.ctx.fill();
		}

        this.ctx.closePath();
		this.ctx.restore();

	},

	drawPoint: function( obj ) {

		// console.log(typeof obj.point )

		if ( obj.pointArr.length == 0) {
			console.log('1')
			this.getRandomPoint( obj )
		}

		this.ctx = this.setCtxState(  );
	},

	animate: function() {
		let _self = this;

		let go = function() {

			_self.ctx.clearRect(0, 0, _self.ctxW, _self.ctxH);

			_self.areas.forEach(function(n) {
				_self.drawLine({
					line: n.data,
					style: n.style
				})

				_self.drawPoint( n )
			})

			requestAnimationFrame(go);
		}

		go()

	},

	// 计算属性
	computedData: function(data) {
		let width = height = xStart = yStart = xEnd = yEnd = 0;

		for (let i = 0, l = data.length; i < l; i+=2) {
			let x = data[i];
			let y = data[i+1];

			if (i === 0) {
				xStart = xEnd = x;
				yStart = yEnd = y;
				
			} else {
				xStart = x < xStart ? x : xStart;
				xEnd   = x > xEnd ? x : xEnd;

				yStart = y < yStart ? y : yStart;
				yEnd   = y > yEnd   ? y : yEnd;

			}
		}

		// 输出宽高
		width = xEnd - xStart;
		height = yEnd - yStart;

		return {
			width: width,
            height: height,
            xCenter: xStart + width / 2,
            yCenter: yStart + height / 2,
            x: [xStart, xEnd],
            y: [yStart, yEnd]
		}
	},

	getRandomPoint: function( _obj ) {
		let result = [];
		let _self = this;

		let getColor = function(colorArr) {
			return colorArr[parseInt(colorArr.length * Math.random())]
		}

		for (let i = 0; i < _obj.point.size; i ++) {

			let x = y = 0;

			do {
                x = _obj.x[0] + _obj.width * Math.random();
                y = _obj.y[0] + _obj.height * Math.random();
            } while (!_self.ctx.isPointInPath(x, y));

            result.push({
            	x: x,
                y: y,
                color: getColor( _obj.point.color )
            })
		}
        _obj.pointArr = result;
	},

	event: function() {

		let _self = this;

	    //地图鼠标移上去的事件
		this.ele.addEventListener("mousemove", function(event){
		    _self.currentX = event.offsetX;
		    _self.currentY = event.offsetY;

		    // console.log(_self.currentX, _self.currentY)

		    // 在地图区域内
		    // if (this.inAreaCtx) {
		    //     // 返回用户 数据索引 城市信息
		    //     if (options.callback && options.callback.mousemove) options.callback.mousemove(index, options.city.data[index]);
		    // } 
		    // // 在地图外
		    // else {
		    //     // 返回用户 -1
		    //     if (options.callback && options.callback.mousemove) options.callback.mousemove( -1 );
		    // }

		});

		// 地图上点击事件
		this.ele.addEventListener('click', function(e) {
		    // 在地图区域内
		    // if (this.inAreaCtx) {

		    //     if (options.callback && options.callback.click && index > -1) 
		    //         options.callback.click( index , options.city.data[index] );
		    // }
		})
	},

	setArea: function() {

		let _self = this;

		let Area = function(obj, computedData, cityInfo) {
			let hasX = 'x' in computedData;

			this.name = obj.name;
			this.data = obj.map;

			this.width = obj.w || computedData.width;
			this.height = obj.h || computedData.height;
			this.x = hasX ? computedData.x : [obj.x, obj.x + obj.w];
			this.y = hasX ? computedData.y : [obj.y, obj.y + obj.h];
			this.xCenter = hasX ? computedData.xCenter : obj.x + obj.w /2;
			this.yCenter = hasX ? computedData.yCenter : obj.y + obj.h /2;

			this.point = cityInfo.point;
			this.pointArr = [];
			this.style = cityInfo.style;
		};

		for (let i = 0, l = this.options.city.data.length; i < l; i++) {
			let _data = this.options.city.data[i];
			let _computedData = {};

			// 如果没有宽高
			if (!_data.w && !_data.h) {
				// 计算宽高
				_computedData = this.computedData( _data.map )
			}

			this.areas[i] = new Area( _data, _computedData, this.options.city )
		}
	},

	init: function() {

		this.setArea();

		this.animate();

		this.event();
	}
}