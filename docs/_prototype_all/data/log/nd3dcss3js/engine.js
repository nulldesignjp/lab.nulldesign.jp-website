/*
	engine.js
*/

window.onload = function()
{
	jQuery(function(){
		(function($){

			var _cnums = 100;

			var _cList = new Array();

			var _world = $( '#world' );
			var __field = $( '#field' );
			matrix3d.initField( _world, __field );

			var _field = new matrix3d( $( '#field' ), true );
			_field.scale = .5;


			for( var i = 0; i < _cnums; i++ )
			{
				var _c = '<div class="card3d"><p class="no">A'+i+'</p><p class="name">nulldesign '+i+'</p><p class="birth">2012.11.17</p><p class="code">///// Alert /////</p></div>'
				$('#field').append( _c );
			}
			$( 'div.card3d' ).each(function(i,e){

				var _m = new matrix3d( e );
				_m.x = i%20 * 160 - 1600;
				_m.y = Math.floor( i / 20 ) * 200 - 400;
				_m.render();
				_cList.push( _m );
			});

			$('#flat').click(function(){
				$( _cList ).each(function(i,e){

					var _m = _cList[i];
					var _from = new Object();
					_from.x = _m.x;
					_from.y = _m.y;
					_from.z = _m.z;
					_from.rotationX = _m.rotationX;
					_from.rotationY = _m.rotationY;
					_from.rotationZ = _m.rotationZ;

					var _to = new Object();
					_to.x = i%20 * 160 - 1600;
					_to.y = Math.floor( i / 20 ) * 200 - 400;
					_to.z = 0;
					_to.rotationX = 0;
					_to.rotationY = 0;
					_to.rotationZ = 0;

					var __obj = _m;

					var tween = new TWEEN.Tween( _from )
					            .to( _to, 1000 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	__obj.x = this.x;
					            	__obj.y = this.y;
					            	__obj.z = this.z;
					            	__obj.rotationX = this.rotationX;
					            	__obj.rotationY = this.rotationY;
					            	__obj.rotationZ = this.rotationZ;
					                __obj.render();

					            } )
					            .start();

				});
			});

			$('#circle').click(function(){

				var len = _cList.length;
				var _R = 160 * len / 3;
				var _r = _R / ( Math.PI * 2 );

				$( _cList ).each(function(i,e){
					var _rad = i / len * Math.PI * 2;
					var _m = _cList[i];

					var _from = new Object();
					_from.x = _m.x;
					_from.y = _m.y;
					_from.z = _m.z;
					_from.rotationX = _m.rotationX;
					_from.rotationY = _m.rotationY;
					_from.rotationZ = _m.rotationZ;

					var _to = new Object();
					_to.x = Math.cos( _rad ) * _r;
					_to.y = 0;
					_to.z = Math.sin( _rad ) * _r;
					_to.rotationX = 0;
					_to.rotationY = _rad + Math.PI * .5;
					_to.rotationZ = 0;

					var __obj = _m;

					var tween = new TWEEN.Tween( _from )
					            .to( _to, 1000 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	__obj.x = this.x;
					            	__obj.y = this.y;
					            	__obj.z = this.z;
					            	__obj.rotationX = this.rotationX;
					            	__obj.rotationY = this.rotationY;
					            	__obj.rotationZ = this.rotationZ;
					                __obj.render();

					            } )
					            .start();
				});
			});

			$('#grid').click(function(){
				$( _cList ).each(function(i,e){

					var _m = _cList[i];
					var _from = new Object();
					_from.x = _m.x;
					_from.y = _m.y;
					_from.z = _m.z;
					_from.rotationX = _m.rotationX;
					_from.rotationY = _m.rotationY;
					_from.rotationZ = _m.rotationZ;

					var _to = new Object();
					_to.x = i%5 * 320 - 640;
					_to.y = Math.floor( i / 5 ) % 5 * 400 - 800;
					_to.z = Math.floor( i / 25 ) * 1000 - 2000;
					_to.rotationX = 0;
					_to.rotationY = 0;
					_to.rotationZ = 0;

					var __obj = _m;

					var tween = new TWEEN.Tween( _from )
					            .to( _to, 1000 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	__obj.x = this.x;
					            	__obj.y = this.y;
					            	__obj.z = this.z;
					            	__obj.rotationX = this.rotationX;
					            	__obj.rotationY = this.rotationY;
					            	__obj.rotationZ = this.rotationZ;
					                __obj.render();

					            } )
					            .start();
				});
			});

			$('#sphere').click(function(){
				var len = _cList.length;

				$( _cList ).each(function(i,e){

					var _m = _cList[i];
					var phi = Math.acos( -1 + ( 2 * i ) / len );
					var theta = Math.sqrt( len * Math.PI ) * phi;
					var _r = 800;

					var _from = new Object();
					_from.x = _m.x;
					_from.y = _m.y;
					_from.z = _m.z;
					_from.rotationX = _m.rotationX;
					_from.rotationY = _m.rotationY;
					_from.rotationZ = _m.rotationZ;

					var _to = new Object();
					_to.x = _r * Math.cos( theta ) * Math.sin( phi );
					_to.y = _r * Math.sin( theta ) * Math.sin( phi );
					_to.z = _r * Math.cos( phi );
					_to.rotationX = 0;
					//_to.rotationX = Math.atan2( _to.z, _to.y );
					//_to.rotationY = Math.atan2( _to.z, _to.x ) - Math.PI * .5;
					_to.rotationZ = 0;


					var __obj = _m;

					var tween = new TWEEN.Tween( _from )
					            .to( _to, 1000 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	__obj.x = this.x;
					            	__obj.y = this.y;
					            	__obj.z = this.z;

					            	__obj.lookAt( 0, 0, 0 );
					            	__obj.rotationZ = this.rotationZ;
					                __obj.render();

					            } )
					            .start();
				});
			});

			var _idDrag = false;
			var _rvx = 0;
			var _rvy = 0;
			var _rvz = 0;
			var _px = 0;
			var _py = 0;
			var _zoom = 1;
			document.addEventListener( 'touchmove', function(e){	e.preventDefault();	} );
			$(document).bind( 'mousemove', function(e){
				if( _idDrag )
				{
					var _w = $(window).width();
					var _h = $(window).height();

					var _x = e.pageX;
					var _y = e.pageY;

					var _vx = _x - _px;
					var _vy = _y - _py;

					_px = _x;
					_py = _y;

					_rvx += _vy * .0005;
					_rvy -= _vx * .0005;
					_rvz -= Math.atan2( _rvy, _rvx ) * .0005;
				}
			});
			$(document).bind( 'touchstart', function(e){
				_px = e.originalEvent.touches[0].pageX;
				_py = e.originalEvent.touches[0].pageY;
			});
			$(document).bind( 'mousedown', function(e){
				_idDrag = true;
				_px = e.pageX;
				_py = e.pageY;
			});
			$(document).bind( 'mouseup', function(e){
				_idDrag = false;
			});
			$(document).bind( 'touchmove', function(e){
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
				//_world.render();
			});
			$(document).bind( 'gesturestart', function(e){
			});

			document.addEventListener( 'gesturechange', function(e)
			{
				e.preventDefault();
				_field.scale = e.scale;
				_field.scale = min( 5, max( _field.scale, 0.2 ))
			});
			$(document).bind( 'gestureend', function(e){
			});
			$(document).bind( 'mousewheel', function(e,delta){
				e.preventDefault();

				if( e.originalEvent.wheelDelta > 0 )
				{
					_field.scale += 0.05;
				} else {
					_field.scale -= 0.05;
				}
				_field.scale = min( 5, max( _field.scale, 0.2 ))

			});



			function max( a, b )
			{
				return( a < b )? b : a;
			}

			function min( a, b )
			{
				return ( a < b )? a : b;
			}

			setInterval( function(){
				_field.rotationX += _rvx;
				_field.rotationY += _rvy;
				_field.rotationZ += _rvz;
				_field.render();

				_rvx *= .86;
				_rvy *= .86;
				_rvz *= .86;
				TWEEN.update();

			}, 33 );

		})(jQuery);
	});
}