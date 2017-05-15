/*
	mapArea
	地图信息流向图
	-----------------------------------
	@version: 0.3.0
	@author: ektx
	@date: 2017-5-13
*/
function MapAreaChart(obj) {
	this.options = obj;
	this.cityArr = obj.city;
	this.cityArea = obj.cityArea;
	this.message = obj.message;
	this.callback = obj.callback;

	// 数据整理后的地图区域信息
	this.areas = [];

	this.ele = document.querySelector( obj.el );
	this.ctx = '';
	this.ctxW = 0;
	this.ctxH = 0;

	// 鼠标移动位置
	this.currentX = -1;
	this.currentY = -1;

	// 当前索引
	this.inAreaCtx = -1;

}

MapAreaChart.prototype = {

	setCtxState: function(styleOption) {

		this.ctx.save();
		this.ctx.beginPath();
	
		// canvas 属性请查阅 canvas 相关书籍
		for ( var i in styleOption) {
			this.ctx[i] = styleOption[i]
		}

	},

	drawLine: function(_options) {

		this.setCtxState( _options.style );

		// 没有数据不绘制
		if (_options.line.length === 0) return;

		var path = '';

		if (typeof _options.line == "string") {
			var _city = _options.line[_options.index];

			path = new Path2D(_options.line);

			if( this.ctx.isPointInPath(path, this.currentX, this.currentY) ){
				this.ctx.fillStyle = _options.style.hoveColor;
				this.inAreaCtx = _options.index;
			} 

			this.ctx.stroke( path );
			this.ctx.fill( path )

		} else {
			for (var i = 0, l = _options.line.length; i < l; i+=2) {
				var x = _options.line[i];
				var y = _options.line[i+1];
				if (i === 0) {
					this.ctx.moveTo(x, y);
				} else {
					this.ctx.lineTo(x, y);
				}
			}

			if( this.ctx.isPointInPath( this.currentX, this.currentY)){
				this.ctx.fillStyle = _options.style.hoveColor;
				this.inAreaCtx = _options.index;
			}

			this.ctx.stroke();
			this.ctx.fill();
		}

		this.ctx.closePath();
		this.ctx.restore();

	},


	getRandomPoint: function( _obj ) {
		var result = [];
		var _self = this;
		var _useCenterPoint = _obj.point.notUseCentroidPoint ? false : true;

		var getRandomVal = function(colorArr) {
			return colorArr[parseInt(colorArr.length * Math.random())]
		}

		// 取多个点时,我们随机生成
		if (_obj.point.size > 1 || !_useCenterPoint) {
			
			for (var i = 0; i < _obj.point.size; i ++) {

				var x = y = 0;

				if (typeof _obj.data === 'string') {

					do {
						x = parseFloat((_obj.x[0] + _obj.width * Math.random()).toFixed(2));
						y = parseFloat((_obj.y[0] + _obj.height * Math.random()).toFixed(2));
					} while (!_self.ctx.isPointInPath(new Path2D(_obj.data), x, y));
				} else {
					do {
						x = parseFloat((_obj.x[0] + _obj.width * Math.random()).toFixed(2));
						y = parseFloat((_obj.y[0] + _obj.height * Math.random()).toFixed(2));
					} while (!_self.ctx.isPointInPath(x, y));
				}

				result.push({
					x: x,
					y: y,
					r: getRandomVal( _obj.point.r ),
					color: getRandomVal( _obj.point.color )
				})
			}
		} 
		// 只取一个点时,用中心点
		else {
			result.push({
				x: _obj.centroidX,
				y: _obj.centroidY,
				r: getRandomVal( _obj.point.r ),
				color: getRandomVal( _obj.point.color )
			})
		}
		_obj.pointArr = result;
	},

	drawPoint: function( obj ) {

		var pointLength = obj.pointArr.length;

		// 没有地图点数据不绘制
		if (obj.data.length === 0) {
			var _meg = '发现没有地图坐标点的城市:' + obj.name;
			
			if (!obj.warn.drawPoint) {
				obj.warn.drawPoint = _meg;
				console.warn( _meg )
			}

			return;	
		}

		if ( pointLength == 0) {
			this.getRandomPoint( obj );

			pointLength = obj.point.size;
		}

		for (var i = 0; i < pointLength; i++) {

			var _thisPoint = obj.pointArr[i];
			var _newColor = _newR = false;

			if (obj.point.fun && typeof obj.point.fun === "function") {
				var _r = obj.point.fun(_thisPoint, obj) || false;

				if (_r) {
					_thisPoint.r = _r.r;
					_thisPoint.color = _r.color;			
				}
			}

			this.setCtxState( {
				fillStyle: _thisPoint.color
			} );

			this.ctx.arc(_thisPoint.x, _thisPoint.y, _thisPoint.r, 0, 2*Math.PI, false);


			this.ctx.fill();
			this.ctx.closePath();
			this.ctx.restore();

			if (obj.point.pop) this.drawPointPop(_thisPoint, obj.point.pop);

			// 点上线
			this.drawMessage( _thisPoint );

		}
	},

	drawPointPop: function( _point, _size ) {

		var _self = this;
		var _totalR = _point.r * 5;
		var popR = [];

		_size++;

		var popAnimateFun = function( r, speed ) {
			r += speed;
			r = r >= _totalR ? 0  : r;

			if ( r < 0 ) return r;

			_self.setCtxState({
				strokeStyle: _point.color,
				globalAlpha: 1-(r / _totalR)
			});
			_self.ctx.arc(_point.x, _point.y, r, 0, 2*Math.PI, false);
			_self.ctx.stroke();
			_self.ctx.closePath();
			_self.ctx.restore();

			return r;
		}

		if (!_point.popAnimate) {
			// 取波纹数
			if (_size > 1) {
				var _step = (_totalR + _point.r) / _size;

				for (var i = 0; i < _size-1; i++) {
					popR.push(i * _step)
				}
			} else {
				popR.push(_point.r)
			}

			_point.popAnimate = {
				r : popR,
				RSpeed: _totalR / 200
			}
		} else {
			for (var i = 0, l = _point.popAnimate.r.length; i < l; i++) {
				_point.popAnimate.r[i] = popAnimateFun( _point.popAnimate.r[i], _point.popAnimate.RSpeed );
			}
		}

	},

	drawMessage: function( _point ) {

		if (!this.message) return;

		var style = this.message.line;

		style.globalCompositeOperation = 'destination-over';

		this.drawLine({
			line: [_point.x, _point.y, this.message.center.x, this.message.center.y],
			style: style
		});

		if (!_point.lineLength) {

			_point.lineLength = parseFloat(Math.sqrt(Math.pow(_point.x, 2) + Math.pow(_point.y, 2)).toFixed(2));
			_point.width = this.message.center.x - _point.x;
			_point.height = this.message.center.y - _point.y;
			_point.xScale = _point.width / _point.lineLength;
			_point.yScale = _point.height / _point.lineLength;
			
			var speedRandom = Math.random() + .02;
			var _x = _point.x;
			var _xspeed = _point.width / this.message.speed * speedRandom;
			var _y = _point.y;
			var _yspeed = _point.height / this.message.speed * speedRandom;
			var cosA =  _point.height / _point.lineLength;
			var sinA = _point.width / _point.lineLength;
			
			if (this.message.direction == 'get') {
				_x = this.message.center.x;
				_y = this.message.center.y;
				_xspeed = 0 - _xspeed;
				_yspeed = 0 - _yspeed;
			}

			_point.light = {
				x: _x, // 原点 x
				y: _y, // 原点 y
				xs: _xspeed,
				ys: _yspeed,
				cos: cosA,
				sin: sinA,
				color: this.message.light.style.strokeStyle,
				bcolor: this.message.backColor || this.message.light.style.strokeStyle,
				t: 0
			}
		}


		var xStart = _point.light.x + _point.light.xs * _point.light.t;
		var yStart = _point.light.y + _point.light.ys * _point.light.t;

		var xEnd = xStart + this.message.light.length * _point.light.sin;
		var yEnd = yStart + this.message.light.length * _point.light.cos;

		if ( Math.abs(xStart - _point.light.x) > Math.abs(_point.width)) {
			_point.light.t = 0;

			if ( this.message.willback ) {
				// 切换方向
				if (_point.light.x === _point.x) {
					_point.light.x = this.message.center.x;
					_point.light.y = this.message.center.y;
					_point.light.xs = 0 - _point.light.xs;
					_point.light.ys = 0 - _point.light.ys;
				} 
				else if (_point.light.x === this.message.center.x) {
					_point.light.x = _point.x;
					_point.light.y = _point.y;
					_point.light.xs = 0 - _point.light.xs;
					_point.light.ys = 0 - _point.light.ys;
				}

				// 切换颜色
				if (this.message.backColor) {
					var _color = _point.light.color;
					_point.light.color = _point.light.bcolor;
					_point.light.bcolor = _color;
				}

			}
		}

		// 流入效果
		if (_point.light.x === _point.x) {
			if (Math.abs(xEnd - _point.light.x) > Math.abs(_point.width)) {
				xEnd = this.message.center.x;
				yEnd = this.message.center.y;
			}
		} 
		else if (_point.light.x === this.message.center.x) {
			if (Math.abs(xEnd - _point.x) > Math.abs(_point.width)) {
				xEnd = _point.light.x;
				yEnd = _point.light.y;
			}
		}

		this.message.light.style.globalCompositeOperation = 'source-over';
		this.message.light.style.strokeStyle = _point.light.color;

		_point.light.t++;

		this.drawLine({
			line: [
				xStart, 
				yStart, 
				xEnd, 
				yEnd, 
			],
			style: this.message.light.style
		}) 

	},

	drawCityName: function( _opt, index ) {
		// x 偏移
		var translateX = 0;
		// y 偏移
		var translateY = 0;
		

		if( this.inAreaCtx == index ){
			_opt.cityName.hover.globalCompositeOperation = 'source-over';
			this.setCtxState( _opt.cityName.hover );
		} else {
			_opt.cityName.normal.globalCompositeOperation = 'source-over';
			this.setCtxState( _opt.cityName.normal );
		}

		this.ctx.textAlign = _opt.cityName.align || 'center';

		if (_opt.cityName.move) {
			translateX = _opt.cityName.move.x ? _opt.cityName.move.x : 0;
			translateY = _opt.cityName.move.y ? _opt.cityName.move.y : 0;
		}

		this.ctx.fillText(_opt.name, _opt.xCenter + translateX, _opt.yCenter + translateY);
		
		this.ctx.restore();

	},

	drawCityArea: function( _opt ) {

		var style = this.cityArea.style;
		// 重置
		this.inAreaCtx = -1

		style.fillStyle = 'transparent';
		style.globalCompositeOperation = 'source-over';

		for (var i = 0, l = this.cityArea.data.length; i < l; i++) {
			this.drawLine({
				line: this.cityArea.data[i],
				style: style,
				_area: true
			})
		}
	},

	animate: function() {
		var _self = this;

		var go = function() {

			_self.ctx.clearRect(0, 0, _self.ctxW, _self.ctxH);

			
			_self.drawCityArea();

			_self.areas.forEach(function(n, index) {

				var __style = n.style;
				__style.globalCompositeOperation = 'destination-over';
				_self.drawLine({
					line: n.data,
					style: __style,
					index: index
				})

				_self.drawPoint( n );

				_self.drawCityName( n, index )
			})

			requestAnimationFrame( go );
		}

		go()

	},

	// 计算属性
	computedData: function( data ) {

		if (!data) {
			console.warn("Don't find any Data")
			return
		}

		var width = height = xStart = yStart = xEnd = yEnd = 0;
		var xArr = [];
		var yArr = [];

		var centroid = this.getCentroid( data );

		for (var i = 0, l = data.length; i < l; i+=2) {
			var x = data[i];
			var y = data[i+1];

			if (i === 0) {
				xStart = xEnd = x;
				yStart = yEnd = y;
			}

			xArr.push(x);
			yArr.push(y);
		}

		xStart = Math.min.apply({}, xArr);
		xEnd = Math.max.apply({}, xArr);

		yStart = Math.min.apply({}, yArr);
		yEnd = Math.max.apply({}, yArr);

		// 输出宽高
		width = xEnd - xStart;
		height = yEnd - yStart;

		return {
			width: width,
			height: height,
			xCenter: xStart + width / 2,
			yCenter: yStart + height / 2,
			centroidX: centroid[0],
			centroidY: centroid[1],
			x: [xStart, xEnd],
			y: [yStart, yEnd]
		}
	},

	// 质点中心 代码参考网上
	getCentroid: function( arr ) {
		var twoTimesSignedArea = 0;
	    var cxTimes6SignedArea = 0;
	    var cyTimes6SignedArea = 0;

	    var length = arr.length

	    for ( var i = 0; i < arr.length; i+=2) {
	        var _x = arr[i];
	        var _y = arr[i+1];
	        var __x = arr[i+2];
	        var __y = arr[i+3];

	        if (i + 3 > arr.length) {
	        	__x = arr[0];
	        	__y = arr[1];
	        }

	        var twoSA = _x * __y - __x * _y;

	        twoTimesSignedArea += twoSA;
	        cxTimes6SignedArea += (_x + __x) * twoSA;
	        cyTimes6SignedArea += (_y + __y) * twoSA;
	    }
	    
	    var sixSignedArea = 3 * twoTimesSignedArea;

	    return [ cxTimes6SignedArea / sixSignedArea, cyTimes6SignedArea / sixSignedArea]; 
	},

	event: function() {

		var _self = this;

		//地图鼠标移上去的事件
		this.ele.addEventListener("mousemove", function(event){
			_self.currentX = event.offsetX;
			_self.currentY = event.offsetY;

			// 在地图区域内
			if (_self.inAreaCtx > -1) {
				// 返回用户 数据索引 城市信息
				if (_self.callback && _self.callback.mousemove) _self.callback.mousemove( _self.inAreaCtx, _self.areas[_self.inAreaCtx] );
			} 
			// 在地图外
			else {
				// 返回用户 -1
				if (_self.callback && _self.callback.mousemove) {
					_self.callback.mousemove( -1 );
				}
			}

		});

		// 地图上点击事件
		this.ele.addEventListener('click', function(e) {
			// 在地图区域内
			if (_self.inAreaCtx > -1) {

				if (_self.callback && _self.callback.click) 
					_self.callback.click( _self.inAreaCtx , _self.areas[_self.inAreaCtx] );
			}
		})
	},

	setArea: function() {

		var _self = this;

		var Area = function(obj, computedData, cityInfo) {
			var hasX = 'x' in computedData;

			if (!obj.name) {
				console.warn("Don't have name!\n" );
				return;
			}

			this.centroidX = computedData.centroidX;
			this.centroidY = computedData.centroidY;
			this.cityName = cityInfo.cityName;
			this.data = obj.map || [];

			this.height = obj.h || computedData.height;
			this.width = obj.w || computedData.width;
			this.name = obj.name;
			
			this.x = hasX ? computedData.x : [obj.x, obj.x + obj.w];
			this.y = hasX ? computedData.y : [obj.y, obj.y + obj.h];
			this.xCenter = hasX ? computedData.xCenter : obj.x + obj.w /2;
			this.yCenter = hasX ? computedData.yCenter : obj.y + obj.h /2;

			this.point = cityInfo.point;
			this.pointArr = [];
			this.style = cityInfo.style;
			this.warn = {};  // 保存错误信息
			this.origin = obj
		};

		for (var i = 0, l = this.options.city.data.length; i < l; i++) {
			var _data = this.options.city.data[i];
			var _computedData = {};

			// 如果没有宽高
			if (!_data.w && !_data.h) {
				if (_data.map) {
					// 计算宽高
					_computedData = this.computedData( _data.map )
				} else {
					console.warn('This city or area not have data:' + _data.name);
					return;
				}
			}

			this.areas[i] = new Area( _data, _computedData, this.options.city )
		}
	},

	createCanvas: function() {

		canvas = document.createElement('canvas');
		canvas.width = this.ctxW = parseFloat( this.ele.style.width || window.getComputedStyle(this.ele, null).width );
		canvas.height = this.ctxH = parseFloat( this.ele.style.height || window.getComputedStyle(this.ele, null).height );

		this.ele.appendChild( canvas );
		this.ctx = canvas.getContext('2d');

	},

	init: function() {

		this.createCanvas();

		this.setArea();

		this.animate();

		this.event();
	}
}