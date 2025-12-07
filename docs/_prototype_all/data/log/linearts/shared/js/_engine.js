/*
	engine.js
	//	http://www.color-sample.com/colors/913/
*/

var ND = ND | {};
window.onload = function()
{
	var _ua = getUA();
	var _fps = 60;
	var _intervalKey;
	var _radius = 10;
	var _scale = 10;
	var _mx,_my;
	var _vList = [];
	var _pList = [];
	var _nums = 96;
	var _newc,_newcc;
	var _isClick = false;

	_nums = _ua.iphone||_ua.android? 48:_nums;


	(function($){

		//	非対応環境
		if( _ua.msie6 || _ua.msie7 || _ua.msie8 )
		{
			$( '#main' ).load('shared/xml/unusage.html');
			return false;
		}
		_newc = document.createElement( 'canvas');
		_newcc = _newc.getContext('2d');

		_canvas = document.createElement( 'canvas' );
		_ctx = _canvas.getContext('2d');
		$('#main').append( _canvas );

		_layout();

		_mx = 0;
		_my = 0;

		for( var i = 0; i < _nums; i++ )
		{
			_pList[i] = [];
			_pList[i][0] = {
				x:0,
				y:0
			};
			_pList[i][1] = {
				x:0,
				y:0
			};
			_pList[i][2] = {
				x:0,
				y:0
			};

			//	#a41919
			_pList[i][3] = 35 + Math.random() * 60 - 30;
			_pList[i][4] = 1.075000 + Math.random() * 0.12 - 0.06;
			_pList[i][5] = Math.floor( Math.random() * 102 ) + 102;
			_pList[i][6] = Math.floor( Math.random() * Math.random() * 102 ) + 0;
			_pList[i][7] = 0;

			_pList[i][8] = {
				x:0,
				y:0
			};
			_pList[i][9] = {
				x:0,
				y:0
			};
			_pList[i][10] = {
				x:0,
				y:0
			};
			_vList[i] = {vx:0,vy:0};
		}

		


		$(window).bind( 'resize', _resize );
		$(document).bind( 'mousemove', _mousemove );
		$(document).bind( 'touchmove', _mousemove );
		$(document).bind( 'touchstart', function(e){
			var _w = $(window).width();
			var _h = $(window).height();

			_newcc.clearRect( 0, 0, _w, _h );
			_ctx.clearRect( 0, 0, _w, _h );
			_isClick = true;

			_mx = e.originalEvent.touches[0].pageX;
			_my = e.originalEvent.touches[0].pageY;

			var len = _pList.length;
			for( var i = 0; i < len; i++ )
			{
				var _p = _pList[i];
				_p[0].x = _mx;
				_p[0].y = _my;
				_p[1].x = _mx;
				_p[1].y = _my;
				_p[2].x = _mx;
				_p[2].y = _my;
				_p[8].x = _mx;
				_p[8].y = _my;
				_p[9].x = _mx;
				_p[9].y = _my;
				_p[10].x = _mx;
				_p[10].y = _my;
			}
		});
		$(document).bind( 'mousedown', function(e){
			var _w = $(window).width();
			var _h = $(window).height();

			_newcc.clearRect( 0, 0, _w, _h );
			_ctx.clearRect( 0, 0, _w, _h );
			_isClick = true;

			_mx = e.pageX;
			_my = e.pageY;
			var len = _pList.length;
			for( var i = 0; i < len; i++ )
			{
				var _p = _pList[i];
				_p[0].x = _mx;
				_p[0].y = _my;
				_p[1].x = _mx;
				_p[1].y = _my;
				_p[2].x = _mx;
				_p[2].y = _my;
				_p[8].x = _mx;
				_p[8].y = _my;
				_p[9].x = _mx;
				_p[9].y = _my;
				_p[10].x = _mx;
				_p[10].y = _my;
			}
		});
		$(document).bind( 'mouseup', function(){
			_isClick = false;
		});
		$(document).bind( 'touchend', function(){
			_isClick = false;
		});
		start();

		function start()
		{
			_intervalKey = setTimeout( function(){	_loop();	start();	}, 1000 / _fps >> 0 );
		}

		function stop()
		{
			clearTimeout( _intervalKey );
		}

		function _loop()		
		{	
			var _w = $(window).width();
			var _h = $(window).height();

			_newcc.clearRect( 0, 0, _w, _h );
			//_newcc.globalAlpha = 0.975;
			_newcc.drawImage( _canvas, 0, 0 );
			_ctx.clearRect( 0, 0, _w, _h );
			_ctx.drawImage( _newc, 0, 0 );

			var len = _pList.length;

			for( var i = 0; i < len; i++ )
			{
				var _p = _pList[i];
				_vList[i].vx = ( _vList[i].vx + ( _mx - _p[1].x ) / _p[3] ) / _p[4];
				_vList[i].vy = ( _vList[i].vy + ( _my - _p[1].y ) / _p[3] ) / _p[4];

				var _p0x = _p[8].x;
				var _p0y = _p[8].y;
				var _p1x = _p[9].x;
				var _p1y = _p[9].y;
				var _p2x = _p[10].x;
				var _p2y = _p[10].y;

				_p[8].x = _p[0].x;
				_p[8].y = _p[0].y;
				_p[9].x = _p[1].x;
				_p[9].y = _p[1].y;
				_p[10].x = _p[2].x;
				_p[10].y = _p[2].y;

				_p[1].x += _vList[i].vx;
				_p[1].y += _vList[i].vy;

				var _rad = Math.atan2( _vList[i].vx, _vList[i].vy );
				var _radius = Math.sqrt( _vList[i].vx*_vList[i].vx + _vList[i].vy*_vList[i].vy);
				_radius = (_radius>1.5)?1.5:_radius;

				var __radius = _radius * Math.cos( _rad );


				var _sin0 = Math.sin( _rad + Math.PI * .5 ) * __radius;
				var _cos0 = Math.cos( _rad + Math.PI * .5 ) * __radius;
				var _sin1 = Math.sin( _rad - Math.PI * .5 ) * __radius;
				var _cos1 = Math.cos( _rad - Math.PI * .5 ) * __radius;

				_p[0].x = _p[1].x + _cos0;
				_p[0].y = _p[1].y + _sin0;
				_p[2].x = _p[1].x + _cos1;
				_p[2].y = _p[1].y + _sin1;

				_ctx.beginPath();
				//_ctx.clearRect( 0, 0, _w, _h );

				var _r = _p[5];
				var _g = _p[6]
				var _b = _p[7];
				var _a = Math.cos( _rad ) * .4 + 0.6;

				var _sx0 = ( _p0x + _p[8].x ) * .5;
				var _sy0 = ( _p0y + _p[8].y ) * .5;
				var _sx1 = ( _p2x + _p[10].x ) * .5;
				var _sy1 = ( _p2y + _p[10].y ) * .5;

				var _ex0 = ( _p[0].x + _p[8].x ) * .5;
				var _ey0 = ( _p[0].y + _p[8].y ) * .5;
				var _ex1 = ( _p[2].x + _p[10].x ) * .5;
				var _ey1 = ( _p[2].y + _p[10].y ) * .5;

				_ctx.fillStyle = 'rgba('+_r+','+_g+','+_b+','+_a+')';
				_ctx.moveTo( _sx0, _sy0 );
				_ctx.lineTo( _sx1, _sy1 );
				_ctx.quadraticCurveTo(_p[10].x, _p[10].y, _ex1, _ey1)
				_ctx.lineTo( _ex0, _ey0 );
				_ctx.quadraticCurveTo(_p[8].x, _p[8].y, _sx0, _sy0);
				_ctx.fill();
			}
		}

		function _resize( e )
		{
			_layout();
		}
		function _layout()
		{
			var _w = $(window).width();
			var _h = $(window).height();
			_newcc.clearRect( 0, 0, _w, _h );
			_ctx.clearRect( 0, 0, _w, _h );
			_canvas.width = $( window ).width();
			_canvas.height = $( window ).height();
			_newc.width = _canvas.width;
			_newc.height = _canvas.height;
		}

		function _mousemove( e )
		{
			var _type = e.type;
			if( _isClick )
			{
				if( _type == 'mousemove' )
				{
					_mx = e.pageX;
					_my = e.pageY;
				} else {
					_mx = e.originalEvent.touches[0].pageX;
					_my = e.originalEvent.touches[0].pageY;
				}
			}
			e.preventDefault();
		}

	})(jQuery);
}
