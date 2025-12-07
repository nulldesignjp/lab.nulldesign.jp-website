/*
	engine.js

	http://www.html5canvastutorials.com/tutorials/html5-canvas-bezier-curves/
	http://ruiueyama.tumblr.com/post/11197882224
*/

window.onload = function()
{
	(function( $ )
	{
		var _nums = 6;
		var _preloader;
		var _canvas,_ctx;
		var _plist = [];
		var _point = {x:0,y:0};

		var _bezierPoint = 0;
		var _bezierCount = 0;
		var _bezierDivision = 100;



		init();

		function init()
		{
			init2();
		}
		function init2()
		{
			var _w = $(window).width();
			var _h = $(window).height();

			_canvas = document.createElement('canvas');
			_ctx = _canvas.getContext('2d');
			$( _canvas ).css({
				'position':'absolute',
				'top':'0',
				'left':'0',
				'opacity':0
			}).delay( 500 ).animate({
				'opacity':1
			},1000);

			$( '#container' ).prepend(_canvas);
			_canvas.width = _w;
			_canvas.height = _h;


			for( var i = 0; i < _nums; i++ )
			{
				var _x = Math.floor( Math.random() * _w );
				var _y = Math.floor( Math.random() * _h );
				var _rad = Math.random() * Math.PI * 2;
				var _r = 100 + Math.random() * 200;
				var __x = Math.cos( _rad ) * _r;
				var __y = Math.sin( _rad ) * _r;

				var _p = {};
				_p.x1 = _x;
				_p.y1 = _y;
				_p.x0 = _x - __x;
				_p.y0 = _y - __y;
				_p.x2 = _x + __x;
				_p.y2 = _y + __y;

				_p.r = _r;
				_p.rad = _rad;
				_p.speed = 1;
				_p.dir = Math.random() * Math.PI * 2

				_plist.push( _p );
			}

			_point.x = _plist[0].x1;
			_point.y = _plist[0].y1;

			_execute();

		}

		function _execute()
		{
			setInterval(function(){
				var _w = $(window).width();
				var _h = $(window).height();
				var len = _plist.length;

				for( var i = 0; i < len; i++ )
				{
					_p = _plist[i];
					_p.rad += 0.01;
					//_p.dir += 0.01;
					var _vx = Math.cos( _p.dir ) * _p.speed;
					var _vy = Math.sin( _p.dir ) * _p.speed;
					_p.x1 += _vx;
					_p.y1 += _vy;

					var __x = Math.cos( _p.rad ) * _p.r;
					var __y = Math.sin( _p.rad ) * _p.r;
					_p.x0 = _p.x1 - __x;
					_p.y0 = _p.y1 - __y;
					_p.x2 = _p.x1 + __x;
					_p.y2 = _p.y1 + __y;

					if( _p.x1 < 0 )
					{
						_p.x1 = 0;
						_p.dir += Math.PI;
					} else if( _p.x1 > _w )
					{
						_p.x1 = _w;
						_p.dir += Math.PI;
					}
					if( _p.y1 < 0 )
					{
						_p.y1 = 0;
						_p.dir += Math.PI;
					} else if( _p.y1 > _h )
					{
						_p.y1 = _h;
						_p.dir += Math.PI;
					}

				}


					// var _c = document.createElement( 'canvas' );
					// var _cx = _c.getContext('2d');
					// _c.width = _canvas.width;
					// _c.height = _canvas.height;

					// _ctx.globalAlpha = 0.86;
					// _cx.drawImage( _canvas, 0, 0, _c.width, _c.height );

					// _ctx.clearRect( 0, 0, _c.width, _c.height );
					// _ctx.beginPath();
					// _ctx.strokeStyle = 'rgba(255,255,255,1)';
					// _ctx.drawImage( _c, 0, 0, _c.width, _c.height );




				_ctx.clearRect( 0, 0, _w, _h );
				_ctx.beginPath();
				_ctx.strokeStyle = '#FFF';
				_ctx.lineWidth = 3;
				_ctx.moveTo( _plist[0].x1, _plist[0].y1 );

				for( var i = 0; i < len-1; i++ )
				{
					_ctx.bezierCurveTo( _plist[i].x2, _plist[i].y2, _plist[i+1].x0, _plist[i+1].y0, _plist[i+1].x1, _plist[i+1].y1 );
				}

				_ctx.bezierCurveTo( _plist[len-1].x2, _plist[len-1].y2, _plist[0].x0, _plist[0].y0, _plist[0].x1, _plist[0].y1 );
				_ctx.stroke();


				_bezierCount++;
				var _par = _bezierCount / _bezierDivision;

				//_bezierPoint;

				var _p0,_p1,_p2,_p3,_m0,_m1,_m2,_b0,_b1;
				if( _bezierPoint == len-1 )
				{
					_p0 = { x:_plist[len-1].x1, y:_plist[len-1].y1 };
					_p1 = { x:_plist[len-1].x2, y:_plist[len-1].y2 };
					_p2 = { x:_plist[0].x0, y:_plist[0].y0 };
					_p3 = { x:_plist[0].x1, y:_plist[0].y1 };
				} else {
					_p0 = { x:_plist[_bezierPoint].x1, y:_plist[_bezierPoint].y1 };
					_p1 = { x:_plist[_bezierPoint].x2, y:_plist[_bezierPoint].y2 };
					_p2 = { x:_plist[_bezierPoint+1].x0, y:_plist[_bezierPoint+1].y0 };
					_p3 = { x:_plist[_bezierPoint+1].x1, y:_plist[_bezierPoint+1].y1 };
				}

				_m0 = {
					x: _p0.x + ( _p1.x - _p0.x ) * _par,
					y: _p0.y + ( _p1.y - _p0.y ) * _par,
				}
				_m1 = {
					x: _p1.x + ( _p2.x - _p1.x ) * _par,
					y: _p1.y + ( _p2.y - _p1.y ) * _par,
				}
				_m2 = {
					x: _p2.x + ( _p3.x - _p2.x ) * _par,
					y: _p2.y + ( _p3.y - _p2.y ) * _par,
				}

				_b0 = {
					x: _m0.x + ( _m1.x - _m0.x ) * _par,
					y: _m0.y + ( _m1.y - _m0.y ) * _par
				}
				_b1 = {
					x: _m1.x + ( _m2.x - _m1.x ) * _par,
					y: _m1.y + ( _m2.y - _m1.y ) * _par
				}
				_p00 = {
					x: _b0.x + ( _b1.x - _b0.x ) * _par,
					y: _b0.y + ( _b1.y - _b0.y ) * _par
				};

				_point.x = _p00.x;
				_point.y = _p00.y;




				_ctx.beginPath();
				_ctx.fillStyle = '#CC0000';
				_ctx.moveTo( _point.x, _point.y );
				_ctx.arc( _point.x, _point.y, 8, 0, Math.PI * 2 );
				_ctx.fill();


				if( _bezierCount >= _bezierDivision )
				{
					_bezierCount = 0;
					_bezierPoint ++;

					if( _bezierPoint >= len )
					{
						_bezierPoint = 0;
					}
				}

			},1000/60>>0);
		}

	})( jQuery );
}