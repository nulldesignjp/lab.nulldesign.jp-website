/*
	engine.js
*/

window.onload = function()
{
	jQuery(function(){
		(function($){
			var _fps = 60;

			//	position
			var _rvx = 0;
			var _rvy = 0;
			var _rvz = 0;

			//	mouse
			var _isDrag = false;
			var _px = 0;
			var _py = 0;

			var _world = new nd3d.world( $( '#container' ) );
			var _camera = new nd3d.Camera3D( _world );
			_camera.perspective = 1000;

			var _divMonaliza = $('<div>');

			var _monaliza = new nd3d.Dom3D( _divMonaliza );

			var _posList = [
				[0,0,-15,0,0,0],
				[133.5,0,0,0,90,0],
				[0,0,15,0,180,0],
				[-133.5,0,0,0,-90,0],
				[0,200,0,90,0,0],
				[0,-200,0,-90,0,0]
			];
			var _classList = [
				'plane',
				'side',
				'back',
				'side',
				'top',
				'top'
			];

			for( var i = 0; i < 6; i++ )
			{
				var _div = $( '<div>' ).addClass( _classList[i] );
				var _p = new nd3d.Dom3D( _div );
				_p.x = _posList[i][0];
				_p.y = _posList[i][1];
				_p.z = _posList[i][2];
				_p.rotationX = _posList[i][3];
				_p.rotationY = _posList[i][4];
				_p.rotationZ = _posList[i][5];

				_monaliza.append( _p );
				_p.render();

			}

			var ua = nd3d.getUA();
			if( ua.iphone )
			{
				_camera.zoom = 0.5;
			}


			_world.append( _monaliza );
			_world.render();
			_monaliza.render();

			//	intro
			_divMonaliza.css({
				'zoom': 0,
				'opacity': 0
			}).delay( 500 ).animate({
				'zoom': 1,
				'opacity': 1
			}, 800 );
			_rvx = Math.random() * 10 - 5;
			_rvy = Math.random() * 10 - 5;
			_rvz = Math.random() * 10 - 5;


			$(window).bind('mousedown',function(e){
				_isDrag = true;
				_px = e.pageX;
				_py = e.pageY;
			});
			$(window).bind('mouseup',function(){
				_isDrag = false;
			});
			$(window).bind('mousemove',function(e){
				if( _isDrag )
				{
					var _w = $(window).width();
					var _h = $(window).height();

					var _x = e.pageX;
					var _y = e.pageY;

					var _vx = _x - _px;
					var _vy = _y - _py;

					_px = _x;
					_py = _y;

					_rvx += _vy * .01;
					_rvy -= _vx * .01;
					_rvz -= Math.atan2( _rvy, _rvx ) * .05;
				}
			});

			$(window).bind('touchstart',function(e){
				_isDrag = true;
				_px = e.originalEvent.touches[0].pageX;
				_py = e.originalEvent.touches[0].pageY;
			});
			$(window).bind('touchend',function(){
				_isDrag = false;
			});
			$(window).bind('touchmove',function(e){
				var _w = $(window).width();
				var _h = $(window).height();

				var _x = e.originalEvent.touches[0].pageX;
				var _y = e.originalEvent.touches[0].pageY;

				var _vx = _x - _px;
				var _vy = _y - _py;

				_px = _x;
				_py = _y;

				_rvx += _vy * .05;
				_rvy -= _vx * .05;
				_rvz -= Math.atan2( _rvy, _rvx ) * .05;
				e.preventDefault();
			});

			document.addEventListener( 'gesturechange', function(e)
			{
				e.preventDefault();
				_camera.zoom = e.scale;
				_camera.zoom = min( 5, max( _camera.zoom, 0.2 ))
			});
			$(document).bind( 'gestureend', function(e){
			});
			$(document).bind( 'mousewheel', function(e,delta){
				e.preventDefault();

				if( e.originalEvent.wheelDelta > 0 )
				{
					_camera.zoom += 0.05;
				} else {
					_camera.zoom -= 0.05;
				}
				_camera.zoom = min( 5, max( _camera.zoom, 0.2 ))
			});
			

			var _frameCount = 0;
			setInterval( function(){
				_monaliza.rotationX -= _rvx;
				_monaliza.rotationY -= _rvy;
				_monaliza.rotationZ += _rvz;
				_monaliza.render();
				_world.render();

				_rvx *= .96;
				_rvy *= .96;
				_rvz *= .96;

				_monaliza.rotationX += ( 0 - _monaliza.rotationX ) * .01;
				_monaliza.rotationY += ( 0 - _monaliza.rotationY ) * .01;
				_monaliza.rotationZ += ( 0 - _monaliza.rotationZ ) * .01;


				var _result = '';
				_result += 'zoom : ' + tekitou( _camera.zoom ) + '<br>';
				_result += 'perspective : ' + tekitou( nd3d.perspective ) + '<br>';
				_result += 'position x : ' + tekitou( _monaliza.x ) + '<br>';
				_result += 'position y : ' + tekitou( _monaliza.y ) + '<br>';
				_result += 'position z : ' + tekitou( _monaliza.z ) + '<br>';
				_result += 'rotation x : ' + tekitou( _monaliza.rotationX ) + '<br>';
				_result += 'rotation y : ' + tekitou( _monaliza.rotationY ) + '<br>';
				_result += 'rotation z : ' + tekitou( _monaliza.rotationZ ) + '<br>';

				$( '#result' ).html( _result );

				_frameCount++;
			}, 1000/_fps>>0);


			function tekitou( e )
			{
				return Math.floor( e * 1000 ) / 1000;
			}

			function max( a, b )
			{
				return( a < b )? b : a;
			}

			function min( a, b )
			{
				return ( a < b )? a : b;
			}

			function sin( a )
			{
				return Math.round( Math.sin( a ) * 100000 ) * .00001;
			}

			function cos( a )
			{
				return Math.round( Math.cos( a ) * 100000 ) * .00001;
			}

			function abs( e )
			{
				return ( e < 0 )? - e : e;
			}

			function sqrt( e )
			{
				return Math.sqrt( e );
			}

			function rad( e )
			{
				return e * nd3dcss3js.PI / 180;
			}

		})(jQuery);
	});
}