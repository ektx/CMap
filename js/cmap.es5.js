/*
	cmap
	地图信息流向图
	-----------------------------------
	@version: 0.5.1
	@author: ektx
	@date: 2017-5-13

	------------------------------------
	API
	https://github.com/ektx/canvas-map
*/
function CMap (obj) {

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
	// y 起点
	this.yStart = 0;
	// x 起点
	this.xStart = 0;

	// 当前索引
	this.inAreaCtx = -1;
	// 默认缩放
	this.minScale = 1;
	// devicePixelRatio
	this.DPI = window.devicePixelRatio;
	// 是否缩放(可配置)
	this.canScale = true;
	// 存放所有的点的集合
	this.points = [];
	// 当前鼠标移入地区
	this.hoverCityIndex = -2;

	this.Mirror = {
		ele : {},
		canvas: {}
	}
}

CMap.prototype = {
	setCtxState: function(styleOption, ctx) {

		var isCtx = ctx ? 1: 0;
		ctx = ctx || this.ctx;

		ctx.save();
		ctx.beginPath();

		// canvas 属性请查阅 canvas 相关书籍
		for ( var i in styleOption) {
			if (this.DPI > 1) {

				switch (i) {
					case 'font':
						if (!styleOption._font) {

							styleOption._font = 1;

							var strArr = styleOption[i].match(/([\d\.]+)(px|em)/);
							var size = parseFloat(strArr[1]);
							var unit = strArr[2];

							styleOption.font = styleOption[i].replace(strArr[0], size* this.DPI + unit);
						}

				}
			}

			ctx[i] = styleOption[i]
		}

		if (isCtx)
			return ctx;

	},

	/*
		@getPoint 是否需要取点
	*/
	drawLine: function(_options, ctx, getPoint) {

		ctx = ctx || this.ctx;
		this.setCtxState( _options.style, ctx );
		
		if (!(this.options.city.point && this.options.city.point.size > 0) ) {
			getPoint = false;
		}

		// 没有数据不绘制
		if (_options.line.length === 0) return;

		var path;

		if (typeof _options.line === 'string') {
			var _city = _options.line[_options.index];

			path = new Path2D(_options.line);

			if( ctx.isPointInPath(path, this.currentX, this.currentY) ){
				ctx.fillStyle = _options.style.hoveColor;
				this.inAreaCtx = _options.index;
			} 

			// 取随机点
			if (getPoint && !this.points[_options.index] ) {
				this.points.push( this.getRandomPoint(ctx, _options.index) )
			}

			ctx.stroke( path );
			ctx.fill( path )

		} else {
			for (var i = 0, l = _options.line.length; i < l; i+=2) {
				var x = _options.line[i];
				var y = _options.line[i+1];
				if (i === 0) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}

			if( ctx.isPointInPath( this.currentX, this.currentY)){
				ctx.fillStyle = _options.style.hoveColor;
				this.inAreaCtx = _options.index;

			}

			// 取随机点
			if (getPoint && !this.points[_options.index] ) {
				this.points.push( this.getRandomPoint(ctx, _options.index) )
			}

			ctx.stroke();
			ctx.fill();
		}

		ctx.closePath();
		ctx.restore();

		return ctx

	},

	drawArc: function(style, options, ctx) {
		ctx = this.setCtxState( style, ctx );

		ctx.arc(options.x, options.y, options.r, options.s, options.e, options.d);

		ctx.fill();
		ctx.closePath();
		ctx.restore();

		return ctx;
	},


	getRandomPoint: function( ctx, index ) {
		var result = [];
		var _self  = this;
		var _obj   = _self.areas[index];
		var _point = _obj.point;
		// var _useCenterPoint = _obj.point.notUseCentroidPoint ? false : true;

		var getRandomVal = (colorArr) => (
			colorArr[parseInt(colorArr.length * Math.random())]
		)

		// 取多个点时,我们随机生成
		if (_obj.point.size > 1) {
			
			for (var i = 0, l = _point.size; i < l; i ++) {

				var x = 0;
				var y = 0;

				if ( /-|C/g.test( _obj.data.toString()) ) {
					do {
						x = parseFloat((_obj.x[0] + _obj.width * Math.random()).toFixed(2));
						y = parseFloat((_obj.y[0] + _obj.height * Math.random()).toFixed(2));
					} while (!ctx.isPointInPath(new Path2D(_obj.data), x, y));
				} else {
					do {
						x = parseFloat((_obj.x[0] + _obj.width * Math.random()).toFixed(2));
						y = parseFloat((_obj.y[0] + _obj.height * Math.random()).toFixed(2));
					} while (!ctx.isPointInPath(x, y));
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
		
		return result;
	},

	drawPoint: function() {
		
		var pointLength = this.points.length;
		var pointSet = this.options.city.point;

		if ( !pointLength ) return;

		for (var i = 0; i < pointLength; i++) {

			var _thisPoint = this.points[i];

			if ( pointSet.fun && typeof pointSet.fun === "function") {
				_thisPoint = pointSet.fun(i, _thisPoint) || _thisPoint;
			}


			for (var p = 0, pl = _thisPoint.length; p < pl; p++) {

				if (this.options.message) {
					this.cityMessageLineMirror( _thisPoint[p], this.Mirror.canvas.cityMsgLine )
				}

				this.cityPointMirror( _thisPoint[p], this.Mirror.canvas.points, pointSet )

			}

		}
	},



	drawPointPop: function( _point, ctx ) {

		var _self = this;
		var _totalR = _point.r * 5;
		var popR = [];
		var _size = _self.options.city.point.pop;

		_size++;

		var popAnimateFun = function( r, speed ) {
			r += speed;
			r = r >= _totalR ? 0  : r;

			if ( r < 0 ) return r;

			ctx = _self.setCtxState({
				strokeStyle: _point.color,
				globalAlpha: 1-(r / _totalR)
			}, ctx);

			ctx.arc(_point.x, _point.y, r, 0, 2*Math.PI, false);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();

			return r;
		}

		if (!_point.popAnimate) {
			
			var _popSpeed = _self.options.city.point.popSpeed || 200;

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
				RSpeed: _totalR / _popSpeed
			}
		} else {
			for (var i = 0, l = _point.popAnimate.r.length; i < l; i++) {
				_point.popAnimate.r[i] = popAnimateFun( _point.popAnimate.r[i], _point.popAnimate.RSpeed );
			}
		}

	},

	
	drawMessage: function( _point, ctx ) {

		if (!this.message) return;

		var style = this.message.line,
			_centerX = this.message.center.x, 
			_centerY = this.message.center.y;

		if (this.canScale) {
			if (!this.message.center._x) {
				this.message.center._x = _centerX * this.minScale + this.xStart;
				this.message.center._y = _centerY * this.minScale + this.yStart;
			}

			_centerX = this.message.center._x;
			_centerY = this.message.center._y;
		}

		// 1.绘制轨道
		ctx = this.drawLine({
			line: [_point.x, _point.y, _centerX, _centerY],
			style: style
		}, ctx);

		if (!_point.lineLength) {

			_point.lineLength = parseFloat(Math.sqrt(Math.pow(_point.x, 2) + Math.pow(_point.y, 2)).toFixed(2));
			_point.width = _centerX - _point.x;
			_point.height = _centerY - _point.y;
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
				_x = _centerX;
				_y = _centerY;
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
					_point.light.x = _centerX;
					_point.light.y = _centerY;
					_point.light.xs = 0 - _point.light.xs;
					_point.light.ys = 0 - _point.light.ys;
				} 
				else if (_point.light.x === _centerX) {
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
				xEnd = _centerX;
				yEnd = _centerY;
			}
		} 
		else if (_point.light.x === _centerX) {
			if (Math.abs(xEnd - _point.x) > Math.abs(_point.width)) {
				xEnd = _point.light.x;
				yEnd = _point.light.y;
			}
		}

		this.message.light.style.globalCompositeOperation = 'destination-over';
		this.message.light.style.strokeStyle = _point.light.color;

		_point.light.t++;

		ctx = this.drawLine({
			line: [
				xStart, 
				yStart, 
				xEnd, 
				yEnd, 
			],
			style: this.message.light.style
		}, ctx) 

	},

	drawCityName: function( _opt, index ) {
		// x 偏移
		var translateX = 0;
		// y 偏移
		var translateY = 0;

		if( this.inAreaCtx == index ){
			var _style = _opt.cityName.hover ? _opt.cityName.hover : _opt.cityName.normal;

			_style.globalCompositeOperation = 'source-over';

			this.setCtxState( _style );
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

	cityNameMirror: function () {

		if (this.inAreaCtx === this.hoverCityIndex) {
			return;
		}

		var ctx = this.createMirrorCanvas('cityName', this.ctxW, this.ctxH)

		ctx.clearRect(0, 0, this.ctxW, this.ctxH);

		// x 偏移
		var translateX = 0;
		// y 偏移
		var translateY = 0;

		var cityName = this.options.city.cityName;


		ctx.textAlign = cityName.align || 'center';

		if (cityName.move) {
			translateX = cityName.move.x ? cityName.move.x : 0;
			translateY = cityName.move.y ? cityName.move.y : 0;
		}

		for (var i = 0,l = this.areas.length; i < l; i++) {

			var _ = this.areas[i];

			if( this.inAreaCtx == i ){
				var _style = _.cityName.hover ? _.cityName.hover : _.cityName.normal;

				_style.globalCompositeOperation = 'source-over';

				ctx = this.setCtxState( _style, ctx );

				this.hoverCityIndex = i;	

			} else {
				_.cityName.normal.globalCompositeOperation = 'source-over';

				ctx = this.setCtxState( _.cityName.normal, ctx );
			}

			ctx.fillText(_.name, _.xCenter + translateX, _.yCenter + translateY);
			
			ctx.restore();	

		}

	},

	createMirrorCanvas: function(mirrorName, width, height) {
		
		var _M = this.Mirror;
		var ctx;
		if (!(mirrorName in _M.ele)) {
			_M.ele[mirrorName] = document.createElement('canvas');
			_M.ele[mirrorName].width = width;
			_M.ele[mirrorName].height = height;

			ctx = _M.canvas[mirrorName] = _M.ele[mirrorName].getContext('2d')

			document.body.appendChild( _M.ele[mirrorName] )
		} else {
			ctx = _M.ele[mirrorName].getContext('2d')
		}

		return ctx;

	},


	cityAreaMirror: function () {

		var ctx = this.createMirrorCanvas('cityArea', this.ctxW, this.ctxH)

		var style = this.cityArea.style;

		var drawArea = (style, data) => {

			for (var i = 0, l = data.length; i < l; i++) {
				ctx =  this.drawLine({
					line: data[i],
					style: style,
					_area: true
				}, ctx)
			}

			return ctx;
		}
		
		ctx = drawArea({
			fillStyle: 'transparent',
			lineWidth: style.lineWidth,
			strokeStyle: style.strokeStyle

		}, this.cityArea.data)

	},

	cityMirror: function() {

		var _self = this;

		var ctx = _self.createMirrorCanvas('city', _self.ctxW, _self.ctxH);
		
		ctx.clearRect(0, 0, _self.ctxW, _self.ctxH);

		for (var i = 0, l = _self.areas.length; i < l; i++) {
			var n = _self.areas[i];
			var __style = n.style;

			__style.globalCompositeOperation = 'destination-over';

			if (_self.minScale > 1 && /-|C/g.test(n.data.toString()) ) {
				if (! ('drawLine' in n.warn)) {

					var warnMeg = 'SVG Path 数据在缩放情况下不绘制';
					n.warn.drawLine = warnMeg;
					console.warn( warnMeg );
				}
			
			} else {

				for (var x = 0, y = n.data.length; x < y; x++) {

					ctx = _self.drawLine({
						line: n.data[x],
						style: __style,
						index: i
					}, ctx, true)

				}

			}

		}


	},

	cityMessageLineMirror: function( point, ctx ) {
		if (this.clear && this.clear.line) {

			ctx.clearRect(0, 0, this.ctxW, this.ctxH);
			this.clear.line = false;
		}

		this.drawMessage( point, ctx )
	},

	cityPointMirror: function(point, ctx, pointSet) {


		if (this.clear && this.clear.point) {
			// 如果不要绘制波纹,我们就不再绘制点的镜像
			if (!this.options.city.point.pop) return;

			ctx.clearRect(0, 0, this.ctxW, this.ctxH);
			this.clear.point = false;
		}

		if (pointSet.pop) 
			this.drawPointPop(point, ctx);

		this.drawArc({
			fillStyle: point.color
		}, {
			x: point.x,
			y: point.y,
			r: point.r,
			s: 0,
			e: 2 * Math.PI,
			d: false
		}, ctx)
	},


	animate: function() {
		var _self = this;
		
		// 绘制背景
		_self.cityAreaMirror();
		// 绘制区块下辖
		_self.cityMirror();

		_self.cityNameMirror();

		this.createMirrorCanvas('cityMsgLine', this.ctxW, this.ctxH);
		this.createMirrorCanvas('points', this.ctxW, this.ctxH);

		var go = function() {

			_self.ctx.clearRect(0, 0, _self.ctxW, _self.ctxH);

			// 重置地区索引
			_self.inAreaCtx = -1

			_self.drawPoint();

			// 下辖
			_self.ctx.drawImage(_self.Mirror.ele.city, 0,0)
			
			// 背景
			_self.ctx.drawImage(_self.Mirror.ele.cityArea, 0,0)

			if (_self.message)
				_self.ctx.drawImage(_self.Mirror.ele.cityMsgLine, 0,0)

			_self.ctx.drawImage(_self.Mirror.ele.points, 0,0)

			_self.ctx.drawImage(_self.Mirror.ele.cityName, 0,0)

			_self.clear = {
				line: true,
				point: true
			}
					
			requestAnimationFrame( go );
		}

		go()


	},

	claerMultiPolygon: function(data) {
		var result = [];

		if ( /MULTIPOLYGON/gi.test(data.toString()) ) {

			var arr = data.match(/\(\(.+?\)\)/g);

			for (var i = 0, l = arr.length; i < l; i++) {
				result.push( arr[i].match(/[\d\.]+/g) )
			}
		} else {
			result = data
		}

		return result

	},

	/* 
		计算属性
	*/
	computedData: function( dataArr ) {

		if (!dataArr) {
			console.warn("Don't find any Data")
			return
		}

		// 验证数据合法,防止浏览器崩溃
		if (typeof dataArr[0] !== 'object') {
			console.warn('数据格式不正确,请参考示例文件或github!\n\rhttps://github.com/ektx/Canvas-Map')
			return;
		}

		var width = 0,
			height = 0,
			xStart = 0,
			yStart = 0,
			xEnd = 0,
			yEnd = 0,
			xArr = [],
			yArr = [];
		var data = [];

		data = dataArr.join(',').split(',');

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

	    for ( var i = 0, l = arr.length; i < l; i+=2) {

	        var _x = parseFloat(arr[i]);
	        var _y = parseFloat(arr[i+1]);
	        var __x = parseFloat(arr[i+2]);
	        var __y = parseFloat(arr[i+3]);

	        if (i + 3 > arr.length) {
	        	__x = parseFloat(arr[0]);
	        	__y = parseFloat(arr[1]);
	        }

	        var twoSA = _x * __y - __x * _y;

	        twoTimesSignedArea += twoSA;
	        cxTimes6SignedArea += (_x + __x) * twoSA;
	        cyTimes6SignedArea += (_y + __y) * twoSA;
	    }
	    
	    var sixSignedArea = 3 * twoTimesSignedArea;

	    return [ ~~(cxTimes6SignedArea / sixSignedArea), ~~(cyTimes6SignedArea / sixSignedArea)]; 
	},

	event: function() {

		var _self = this;
		var mousemoveTime = 0;

		//地图鼠标移上去的事件
		this.ele.addEventListener("mousemove", function(event){
			_self.currentX = event.offsetX * window.devicePixelRatio;
			_self.currentY = event.offsetY * window.devicePixelRatio;

			// 减少绘制,提高性能
			if (new Date() - mousemoveTime > 30) {
				
				mousemoveTime = new Date();

				// 更新地图,绘制区块下辖
				_self.cityMirror();

				// 更新地图名称
				_self.cityNameMirror();
			}

			// 在地图区域内
			if (_self.inAreaCtx > -1) {
				// 返回用户 数据索引 城市信息
				if (_self.callback && _self.callback.mousemove) _self.callback.mousemove( _self.inAreaCtx, _self.areas[_self.inAreaCtx], event );
			} 
			// 在地图外
			else {
				// 返回用户 -1
				if (_self.callback && _self.callback.mousemove) {
					_self.callback.mousemove( -1, event );
				}
			}

		});

		// 地图上点击事件
		this.ele.addEventListener('click', function(e) {
			// 在地图区域内
			if (_self.inAreaCtx > -1) {

				if (_self.callback && _self.callback.click) 
					_self.callback.click( _self.inAreaCtx , _self.areas[_self.inAreaCtx], e );
			}
		})
	},

	// 自动调整地图大小
	autoSize: function() {

		var _self = this;
		var mapSizeInfo = '';
		var cityArealineW = _self.cityArea.style.lineWidth * 2;

		var dataClear = function( mapSizeInfo ) {

			var minX = mapSizeInfo.x[0];
			// y轴使用的是地球坐标还是平面坐标
			var minY = _self.cityArea.earthLine ? mapSizeInfo.y[1] : mapSizeInfo.y[0];
			// 地图宽度
			var mapW = mapSizeInfo.width * _self.minScale;
			// 地图高度
			var mapH = mapSizeInfo.height * _self.minScale;

			// 让地图居中 
			// y 起点 = (canvas宽度 - 地图的宽度)/2
			_self.yStart = (_self.ctxH - mapH)/2;
			// x 起点 = (canvas高度 - 地图的高度)/2
			_self.xStart = (_self.ctxW - mapW)/2;

			var setData = ( data ) => {
				for (var i = 0, l = data.length; i < l; i+=2) {
					if (typeof data[i] == 'object') {
						data[i] = setData( data[i] )
					} else {
						data[i] = ~~(_self.xStart + (data[i] - minX) * _self.minScale);
						// 地图居中显示
						if (_self.cityArea.earthLine)
							data[i+1] = ~~(_self.yStart + (minY - data[i+1]) * _self.minScale);
						else 
							data[i+1] = ~~(_self.yStart + (data[i+1] - minY) * _self.minScale);
							
					}
				}
				return data;
			}

			var doWithArr = (data) => {
				if ( /-|C/g.test( data.toString()) ) {
					console.warn('data 要是数组或SVG无法放大!');
					return data;
				}

				for (var i = 0, l = data.length; i < l; i++) {
					data[i] = setData( data[i] )
				}
			}

			// 对边界处理
			doWithArr( _self.options.cityArea.data )

			// 对下辖处理
			for (var c = 0, d = _self.options.city.data.length; c < d; c++) {
				_self.options.city.data[c].map = _self.claerMultiPolygon(_self.options.city.data[c].map)
				doWithArr( _self.options.city.data[c].map )
			}
		}

		// SVG 不进行数据的优化处理
		if (/-|C/g.test( this.options.cityArea.data.toString() ) ) return;

		_self.options.cityArea.data = _self.claerMultiPolygon(_self.options.cityArea.data)
		mapSizeInfo = _self.computedData( _self.options.cityArea.data )

		_self.minScale = Math.min((_self.ctxW - cityArealineW) / mapSizeInfo.width, (_self.ctxH - cityArealineW)/ mapSizeInfo.height);

		dataClear( mapSizeInfo )

	},

	setArea: function() {

		var _self = this;

		var Area = function(index, obj, computedData, cityInfo) {
			var hasX = 'x' in computedData;

			if (!obj.name) {
				obj.name = ''
				console.warn("没有名称的下辖索引为:", index +1);
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

		if (this.canScale) 
			this.autoSize();

		for (var i = 0, l = this.options.city.data.length; i < l; i++) {
			var _data = this.options.city.data[i];
			var _computedData = {};

			// 对 svg 的处理
			if ( /-|C/g.test(_data.map.toString()) ) {
				if (_data.map) {
					// 计算宽高
					_computedData = {
						centroidX: ~~(_data.x + (_data.w / 2)),
						centroidY: ~~(_data.y + (_data.h / 2))
					}
				}
			} 
			else {
				if (_data.map) {
					// 计算宽高
					_computedData = this.computedData( _data.map )
				} else {
					console.warn('This city or area not have data:' + _data.name);
					return;
				}
			}

			this.areas[i] = new Area(i, _data, _computedData, this.options.city )
		}
	},

	createCanvas: function() {

		var canvas = document.createElement('canvas');
		var boxW = parseFloat( this.ele.style.width || window.getComputedStyle(this.ele, null).width );
		var boxH = parseFloat( this.ele.style.height || window.getComputedStyle(this.ele, null).height );

		canvas.width = this.ctxW = boxW * this.DPI;
		canvas.height = this.ctxH = boxH * this.DPI;

		if (this.DPI > 1) {
			canvas.style.width = boxW + 'px';
			canvas.style.height = boxH + 'px'
		}

		this.ele.appendChild( canvas );
		this.ctx = canvas.getContext('2d');

		window.requestAnimationFrame = (function() {
			return window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				return window.setTimeout(callback, 1000/60);
			}
		})();
	},

	init: function() {

		this.createCanvas();

		this.setArea();

		this.animate();

		this.event();
	}

}

