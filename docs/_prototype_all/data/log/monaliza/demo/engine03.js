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

			var _cubeList = new Array();

			var _world = new nd3d.world( $( '#container' ) );
			var _camera = new nd3d.Camera3D( _world );
			_camera.perspective = 3000;
			_camera.rotationX = Math.random();
			_camera.rotationY = Math.random();
			_camera.rotationZ = Math.random();

			_rvx = 10;
			_rvz = 16;


			var _positionList = [
				[0,0,15,0,0,0],
				[15,0,0,0,90,0],
				[0,0,-15,0,180,0],
				[-15,0,0,0,-90,0],
				[0,15,0,90,0,0],
				[0,-15,0,-90,0,0]
			];
			var _positionListMini = [
				[0,0,5,0,0,0],
				[5,0,0,0,90,0],
				[0,0,-5,0,180,0],
				[-5,0,0,0,-90,0],
				[0,5,0,90,0,0],
				[0,-5,0,-90,0,0]
			];
			for( var i = 0; i < 60; i++ )
			{
				var _cubeElement = $('<div>')
				var _cube = new nd3d.Dom3D( _cubeElement );
				var _list = i%5==0? _positionList:_positionListMini;
				var _class = i%5==0?'post03':'post03mini'
				var _class2 = i%5==0?'no':'noMini'
				for( var j = 0; j < 6; j++ )
				{
					var _planeElement = $('<div>');
					
					_planeElement.addClass(_class);

					var _plane = new nd3d.Dom3D( _planeElement );
					_plane.x = _list[j][0];
					_plane.y = _list[j][1];
					_plane.z = _list[j][2];
					_plane.rotationX = _list[j][3];
					_plane.rotationY = _list[j][4];
					_plane.rotationZ = _list[j][5];
					_cube.append( _plane );
					_plane.render();
				}

				var _no = $('<p>');
				_no.addClass(_class2);
				_no.text( i );

				_noPlane = new nd3d.Dom3D( _no );
				_cube.append( _noPlane );
				_noPlane.y = 16;
				_noPlane.rotationX = 90;
				_noPlane.rotationZ = - 90;
				_noPlane.render();

				var _rad = i/60 * 360 *  Math.PI / 180
				_cube.x = cos( _rad ) * 300;
				_cube.z = sin( _rad ) * 300;
				_cube.rotationY = - i/60*360

				_cubeList.push( _cube );
				_world.append( _cube );
				_cube.render();

			}
			//
			var _lineS = new nd3d.Dom3D( $('<div>').addClass( 'lineS' ) );
			_lineS.rotationX = 90;
			_lineS.y = 5;
			_world.append( _lineS );
			_lineS.render();
			var _lineM = new nd3d.Dom3D( $('<div>').addClass( 'lineM' ) );
			_lineM.rotationX = 90;
			_world.append( _lineM );
			_lineM.render();
			var _lineH = new nd3d.Dom3D( $('<div>').addClass( 'lineH' ) );
			_lineH.rotationX = 90;
			_lineH.y = -5;
			_world.append( _lineH );
			_lineH.render();

			_world.render();


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

				_world.rotationX += _rvx;
				_world.rotationY += _rvy;
				_world.rotationZ += _rvz;
				_world.render();

				_rvx *= .96;
				_rvy *= .96;
				_rvz *= .96;

				_frameCount++;

				var _date = new Date();
				_lineH.rotationZ = _date.getHours() * 30;
				_lineH.render();
				_lineM.rotationZ = - _date.getMinutes() * 6 + 180;
				_lineM.render();
				_lineS.rotationZ = - _date.getSeconds() * 6 + 180;
				_lineS.render();

			}, 1000/_fps>>0);

			function floor( e )
			{
				return Math.floor( e );
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

		})(jQuery);
	});
}