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

			var _img = new Image();
			_img.src = 'monaliza.jpg';

			var _monaliza = new nd3d.Dom3D( _img );
			_world.append( _monaliza );

			_world.render();
			_monaliza.render();


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

					_rvx -= _vy * .01;
					_rvy += _vx * .01;
					_rvz -= Math.atan2( _rvy, _rvx ) * .0005;
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

				_rvx += _vy * .003;
				_rvy -= _vx * .003;
				_rvz -= Math.atan2( _rvy, _rvx ) * .003;
				e.preventDefault();
			});

			document.addEventListener( 'gesturechange', function(e)
			{
				e.preventDefault();
				_world.scale = e.scale;
				_world.scale = min( 5, max( _world.scale, 0.2 ))
			});
			$(document).bind( 'gestureend', function(e){
			});
			$(document).bind( 'mousewheel', function(e,delta){
				e.preventDefault();

				if( e.originalEvent.wheelDelta > 0 )
				{
					_world.scale += 0.05;
				} else {
					_world.scale -= 0.05;
				}
				_world.scale = min( 5, max( _world.scale, 0.2 ))
			});
			

			var _frameCount = 0;
			setInterval( function(){
				_monaliza.rotationX -= _rvx;
				_monaliza.rotationY -= _rvy;
				_monaliza.rotationZ += _rvz;
				_monaliza.render();

				_rvx *= .96;
				_rvy *= .96;
				_rvz *= .96;

				_frameCount++;
			}, 1000/_fps>>0);

		})(jQuery);
	});
}