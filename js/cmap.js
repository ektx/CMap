/*
	cmap
	地图信息流向图
	-----------------------------------
	@version: 0.6.0
	@author: ektx
	@date: 2017-5-13

	------------------------------------
	API
	https://github.com/ektx/canvas-map
*/
class CMap {

	constructor(obj) {

		this.options = obj;
		this.cityArr = obj.city;
		this.cityArea = obj.cityArea;
		this.message = obj.message;
		this.callback = obj.callback;

		// 数据整理后的地图区域信息
		this.areas = [];

		this.ele = document.querySelector( obj.el );
		this.ctx = [];
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
		// 鼠标与地图关系
		this.onMap = 0;

		this.Mirror = {
			ele : {},
			canvas: {}
		}
	}


	setCtxState(styleOption, ctx) {

		let isCtx = ctx ? 1: 0;
		ctx = ctx || this.ctx;

		ctx.save();
		ctx.beginPath();

		// canvas 属性请查阅 canvas 相关书籍
		for ( let i in styleOption) {
			if (this.DPI > 1) {

				switch (i) {
					case 'font':
						if (!styleOption._font) {

							styleOption._font = 1;

							let strArr = styleOption[i].match(/([\d\.]+)(px|em)/);
							let size = parseFloat(strArr[1]);
							let unit = strArr[2];

							styleOption.font = styleOption[i].replace(strArr[0], size* this.DPI + unit);
						}

				}
			}

			ctx[i] = styleOption[i]
		}

		if (isCtx)
			return ctx;

	}

	/*	
		@ctx: 绘制的 Canvas 模板
		@getPoint: 是否需要取点
	*/
	drawLine(_options, ctx, getPoint) {

		ctx = this.setCtxState( _options.style, ctx );

		if (!(this.options.city.point && this.options.city.point.size > 0) ) {
			getPoint = false;
		}
		
		// 没有数据不绘制
		if (_options.line.length === 0) return;

		for (let i = 0, l = _options.line.length; i < l; i+=2) {
			let x = _options.line[i];
			let y = _options.line[i+1];
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

		ctx.closePath();
		ctx.restore();

		return ctx

	}

	drawArc (style, options, ctx) {
		ctx = this.setCtxState( style, ctx );

		ctx.arc(options.x, options.y, options.r, options.s, options.e, options.d);

		ctx.fill();
		ctx.closePath();
		ctx.restore();

		return ctx;
	}


	getRandomPoint( ctx, index ) {
		let result = [];
		let _self  = this;
		let _obj   = _self.areas[index];
		let _point = _obj.point;

		let getRandomVal = arr => arr[parseInt(arr.length * Math.random())];

		let setR = r => r * this.DPI;
		

		// 取多个点时,我们随机生成
		if (_obj.point.size > 1) {
			
			for (let i = 0, l = _point.size; i < l; i ++) {

				let x = 0;
				let y = 0;

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
					r: setR(getRandomVal( _obj.point.r )),
					color: getRandomVal( _obj.point.color )
				})
			}
		} 
		// 只取一个点时,用中心点
		else {
			result.push({
				x: _obj.centroidX,
				y: _obj.centroidY,
				r: setR( getRandomVal( _obj.point.r )),
				color: getRandomVal( _obj.point.color )
			})
		}
		
		return result;
	}

	drawPoint() {

		let pointLength = this.points.length;
		let pointSet = this.options.city.point;
		let ctx = this.ctx[this.ctx.length -1]

		if ( !pointLength ) return;

		for (let i = 0; i < pointLength; i++) {

			let _thisPoint = this.points[i];

			if ( pointSet.fun && typeof pointSet.fun === "function") {
				_thisPoint = pointSet.fun(i, _thisPoint) || _thisPoint;
			}


			for (let p = 0, pl = _thisPoint.length; p < pl; p++) {

				if (this.options.message) {
					this.cityMessageLineMirror( _thisPoint[p], ctx )
				}

				this.cityPoint( _thisPoint[p], ctx, pointSet )

			}

		}
	}



	drawPointPop( _point, ctx ) {

		let _self = this;
		let _totalR = _point.r * 5;
		let popR = [];
		let _size = _self.options.city.point.pop;

		_size++;

		let popAnimateFun = function( r, speed ) {
			r += speed;
			r = r >= _totalR ? 0  : r;

			if ( r < 0 ) return r;

			ctx = _self.setCtxState({
				strokeStyle: _point.color,
				lineWidth: _self.DPI,
				globalAlpha: 1-(r / _totalR)
			}, ctx);

			ctx.arc(_point.x, _point.y, r, 0, 2*Math.PI, false);
			ctx.stroke();
			ctx.closePath();
			ctx.restore();

			return r;
		}

		if (!_point.popAnimate) {
			
			let _popSpeed = _self.options.city.point.popSpeed || 200;

			// 取波纹数
			if (_size > 1) {
				let _step = (_totalR + _point.r) / _size;

				for (let i = 0; i < _size-1; i++) {
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
			for (let i = 0, l = _point.popAnimate.r.length; i < l; i++) {
				_point.popAnimate.r[i] = popAnimateFun( _point.popAnimate.r[i], _point.popAnimate.RSpeed );
			}
		}

	}

	
	drawMessage( _point, ctx ) {

		if (!this.message) return;

		let style = this.message.line,
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
			
			let speedRandom = Math.random() + .02;
			let _x = _point.x;
			let _xspeed = _point.width / this.message.speed * speedRandom;
			let _y = _point.y;
			let _yspeed = _point.height / this.message.speed * speedRandom;
			let cosA =  _point.height / _point.lineLength;
			let sinA = _point.width / _point.lineLength;
			
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


		let xStart = _point.light.x + _point.light.xs * _point.light.t;
		let yStart = _point.light.y + _point.light.ys * _point.light.t;

		let xEnd = xStart + this.message.light.length * _point.light.sin;
		let yEnd = yStart + this.message.light.length * _point.light.cos;

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
					let _color = _point.light.color;
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

	}


	cityName () {

		if (!this.options.city.cityName) return;

		let ctx = this.ctx[0];

		// x 偏移
		let translateX = 0;
		// y 偏移
		let translateY = 0;

		let cityName = this.options.city.cityName;

		ctx.textAlign = cityName.align || 'center';

		if (cityName.move) {
			translateX = cityName.move.x ? cityName.move.x : 0;
			translateY = cityName.move.y ? cityName.move.y : 0;
		}

		for (let i = 0,l = this.areas.length; i < l; i++) {

			let _ = this.areas[i];

			if( this.inAreaCtx == i ){
				let _style = _.cityName.hover ? _.cityName.hover : _.cityName.normal;

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

	}

	createMirrorCanvas (mirrorName, width, height) {
		
		let _M = this.Mirror;
		let ctx;
		if (!(mirrorName in _M.ele)) {
			_M.ele[mirrorName] = document.createElement('canvas');
			_M.ele[mirrorName].width = width;
			_M.ele[mirrorName].height = height;

			ctx = _M.canvas[mirrorName] = _M.ele[mirrorName].getContext('2d')
		} else {
			ctx = _M.ele[mirrorName].getContext('2d')
		}

		return ctx;

	}


	cityAreaMirror () {

		let ctx = this.createMirrorCanvas('cityArea', this.ctxW, this.ctxH)

		let style = this.cityArea.style;

		ctx = this.setCtxState(style, ctx)

		let drawArea = (style, data) => {

			for (let i = 0, l = data.length; i < l; i++) {

				let line = data[i];

				for (let i = 0, l = line.length; i < l; i+=2) {
					let x = line[i];
					let y = line[i+1];
					if (i === 0) {
						ctx.moveTo(x, y);
					} else {
						ctx.lineTo(x, y);
					}
				}

			}

			ctx.stroke()

		}
		
		drawArea({
			fillStyle: 'transparent',
			lineWidth: style.lineWidth,
			strokeStyle: style.strokeStyle

		}, this.cityArea.data)

	}


	/*
		绘制下辖
	*/
	city() {

		let ctx = this.ctx[0];
		
		for (let i = 0, l = this.areas.length; i < l; i++) {
			
			let n = this.areas[i];
			let __style = n.style;
			
			__style.globalCompositeOperation = 'destination-over';

			// SVG
			if (this.minScale > 1 && /-|C/g.test(n.data.toString()) ) {
				if (! ('drawLine' in n.warn)) {

					let warnMeg = 'SVG Path 数据在缩放情况下不绘制';
					n.warn.drawLine = warnMeg;
					console.warn( warnMeg );
				}
			
			} 
			// point
			else {

				for (let x = 0, y = n.data.length; x < y; x++) {

					ctx = this.drawLine({
						line: n.data[x],
						style: __style,
						index: i
					}, ctx, true)

				}

			}

		}


	}

	cityMessageLineMirror( point, ctx ) {
		if (this.clear && this.clear.line) {

			ctx.clearRect(0, 0, this.ctxW, this.ctxH);
			this.clear.line = false;
		}

		this.drawMessage( point, ctx )
	}

	cityPoint(point, ctx, pointSet) {

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
	}


	lazyAnimate() {

		// 绘制区块下辖
		this.city();

		// 背景
		this.ctx[0].drawImage(this.Mirror.ele.cityArea, 0, 0)
		
		this.cityName();

		if (this.Mirror.canvas.cityArea.isPointInPath( this.currentX, this.currentY )) {
			this.onMap = 1;
		} else {
			this.inAreaCtx = -1;
			this.onMap = 0;
		}

		if (this.ctx.length === 1) {
			this.drawPoint()
		}
		
	}


	animate() {

		let _self = this;
		
		// 绘制背景
		this.cityAreaMirror();

		this.lazyAnimate()

		// 定义 requestAnimationFrame
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

		let go = () => {

			// 清除第二个动画层
			this.ctx[1].clearRect(0, 0, this.ctxW, this.ctxH);

			this.drawPoint();
			
			requestAnimationFrame( go );
		}

		if (this.ctx.length > 1) {
			go()
		}

	}

	claerMultiPolygon(data) {
		let result = [];

		if ( /MULTIPOLYGON/gi.test(data.toString()) ) {

			let arr = data.match(/\(\(.+?\)\)/g);

			for (let i = 0, l = arr.length; i < l; i++) {
				result.push( arr[i].match(/[\d\.]+/g) )
			}
		} else {
			result = data
		}

		return result

	}

	/* 
		计算属性
	*/
	computedData( dataArr ) {

		if (!dataArr) {
			console.warn("Don't find any Data")
			return
		}

		// 验证数据合法,防止浏览器崩溃
		if (typeof dataArr[0] !== 'object') {
			console.warn('数据格式不正确,请参考示例文件或github!\n\rhttps://github.com/ektx/Canvas-Map')
			return;
		}

		let width = 0,
			height = 0,
			xStart = 0,
			yStart = 0,
			xEnd = 0,
			yEnd = 0,
			xArr = [],
			yArr = [];
		let data = [];

		data = dataArr.join(',').split(',');

		let centroid = this.getCentroid( data );

		for (let i = 0, l = data.length; i < l; i+=2) {
			let x = data[i];
			let y = data[i+1];

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
	}

	// 质点中心 代码参考网上
	getCentroid( arr ) {
		let twoTimesSignedArea = 0;
	    let cxTimes6SignedArea = 0;
	    let cyTimes6SignedArea = 0;

	    let length = arr.length

	    for ( let i = 0, l = arr.length; i < l; i+=2) {

	        let _x = parseFloat(arr[i]);
	        let _y = parseFloat(arr[i+1]);
	        let __x = parseFloat(arr[i+2]);
	        let __y = parseFloat(arr[i+3]);

	        if (i + 3 > arr.length) {
	        	__x = parseFloat(arr[0]);
	        	__y = parseFloat(arr[1]);
	        }

	        let twoSA = _x * __y - __x * _y;

	        twoTimesSignedArea += twoSA;
	        cxTimes6SignedArea += (_x + __x) * twoSA;
	        cyTimes6SignedArea += (_y + __y) * twoSA;
	    }
	    
	    let sixSignedArea = 3 * twoTimesSignedArea;

	    return [ ~~(cxTimes6SignedArea / sixSignedArea), ~~(cyTimes6SignedArea / sixSignedArea)]; 
	}

	event() {

		let _self = this;
		let mousemoveTime = 0;

		//地图鼠标移上去的事件
		this.ele.addEventListener("mousemove", function(event){
			_self.currentX = event.offsetX * window.devicePixelRatio;
			_self.currentY = event.offsetY * window.devicePixelRatio;

			// 减少绘制,提高性能
			if (new Date() - mousemoveTime > 32) {

				_self.ctx[0].clearRect(0, 0, _self.ctxW, _self.ctxH);
				
				mousemoveTime = new Date();

				_self.lazyAnimate()
			}

			// 在地图区域内
			if (_self.onMap > -1) {
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
	}

	// 自动调整地图大小
	autoSize() {

		let _self = this;
		let mapSizeInfo = {};
		let cityArealineW = this.cityArea.style.lineWidth * 2;

		let dataClear = mapSizeInfo => {

			let minX = mapSizeInfo.x[0];
			// y轴使用的是地球坐标还是平面坐标
			let minY = this.cityArea.earthLine ? mapSizeInfo.y[1] : mapSizeInfo.y[0];
			// 地图宽度
			let mapW = mapSizeInfo.width * this.minScale;
			// 地图高度
			let mapH = mapSizeInfo.height * this.minScale;

			// 让地图居中 
			// y 起点 = (canvas宽度 - 地图的宽度)/2
			this.yStart = (this.ctxH - mapH)/2;
			// x 起点 = (canvas高度 - 地图的高度)/2
			this.xStart = (this.ctxW - mapW)/2;

			let setData = data => {
				for (let i = 0, l = data.length; i < l; i+=2) {
					if (typeof data[i] == 'object') {
						data[i] = setData( data[i] )
					} else {
						
						// 地图居中显示 x
						data[i] = ~~(_self.xStart + (data[i] - minX) * _self.minScale);
						
						// 地图居中显示 y
						data[i+1] = ~~(_self.yStart + (_self.cityArea.earthLine ? minY - data[i+1] : data[i+1] - minY) * _self.minScale) 
							
					}
				}
				return data;
			}

			let doWithArr = data => {

				for (let i = 0, l = data.length; i < l; i++) {
					data[i] = setData( data[i] )
				}
			}

			// 对边界处理
			doWithArr( this.options.cityArea.data )

			// 对下辖处理
			for (let c = 0, d = this.options.city.data.length; c < d; c++) {
				this.options.city.data[c].map = this.claerMultiPolygon(this.options.city.data[c].map)
				doWithArr( this.options.city.data[c].map )
			}
		}

		
		this.cityArea.type = 'multiPoint';

		// 对数据进行清 MultiPolygon
		this.options.cityArea.data = this.claerMultiPolygon(this.options.cityArea.data)

		mapSizeInfo = this.computedData( this.options.cityArea.data )
		this.minScale = Math.min((this.ctxW - cityArealineW) / mapSizeInfo.width, (this.ctxH - cityArealineW)/ mapSizeInfo.height);

		dataClear( mapSizeInfo )

	}

	setArea() {

		let _self = this;

		let Area = function(index, obj, computedData, cityInfo) {
			let hasX = 'x' in computedData;

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

		if (this.canScale) this.autoSize();

		for (let i = 0, l = this.options.city.data.length; i < l; i++) {
			let _data = this.options.city.data[i];
			let _computedData = {};
				
			_data.type = 'multiPoint';

			if (_data.map) {
				// 计算宽高
				_computedData = this.computedData( _data.map )
			} else {
				console.warn('This city or area not have data:' + _data.name);
				return;
			}

			this.areas[i] = new Area(i, _data, _computedData, this.options.city )
		}

		// 针对屏幕进行设置
		if (this.message) {
			this.message.line.lineWidth *= this.DPI;
			this.message.light.length *= this.DPI;
			this.message.light.style.lineWidth *= this.DPI;
		}
	}

	createCanvas () {
		
		let create = () => {
			let canvasBox = document.createElement('div');
			canvasBox.style.width = '100%';
			canvasBox.style.height = '100%';
			canvasBox.style.position = 'relative';

			let canvas = document.createElement('canvas');
			let boxW = parseFloat( this.ele.style.width || window.getComputedStyle(this.ele, null).width );
			let boxH = parseFloat( this.ele.style.height || window.getComputedStyle(this.ele, null).height );

			canvas.width = this.ctxW = boxW * this.DPI;
			canvas.height = this.ctxH = boxH * this.DPI;
			canvas.style.position = 'absolute';

			if (this.DPI > 1) {
				canvas.style.width = boxW + 'px';
				canvas.style.height = boxH + 'px'
			}

			this.ele.appendChild( canvas );
			this.ctx.push( canvas.getContext('2d') );
		}

		// 添加一个 canvas
		create()

		// 如果有点 再添加一个
		if (this.options.city.point && this.options.city.point.size && ( this.options.city.point.pop || this.options.message)) {
			create()
		}

	}

	init() {

		this.createCanvas();

		this.setArea();

		this.animate();

		this.event();
	}

}

