/*
	engine.js
*/

			$( 'body' ).css('opacity', '0');

window.onload = function()
{
	jQuery(function(){
		(function($){
			//	basic
			var _world = new nd3d.world( $('#container') );
			var _camera = new nd3d.Camera3D( _world );
			_camera.perspective = 3000;

			//_camera.zoom = 0.5;

			var _plane = new nd3d.Dom3D( $('#movie') );
			var _cList = new Array();

			_world.append( _plane );
			_plane.render();

			var __div = $('<div>');
			var _movie = new nd3d.Dom3D( __div );
			_world.append( _movie );
			_movie.append( _plane );

			_plane.z = -16;
			_plane.render();

			_movie.render();

			var __front = new Image();
			__front.src = 'frame01.png';
			var _front = new nd3d.Dom3D( __front );
			_front.z = -15;
			_front.render();
			_movie.append( _front );
			var __back = new Image();
			__back.src = 'frame01.png';
			var _back = new nd3d.Dom3D( __back );
			_back.z = 15;
			_back.render();
			_movie.append( _back );

			var __top0 = new Image();
			__top0.src = 'frame02.png';
			var _top0 = new nd3d.Dom3D( __top0 );
			_top0.y = 210;
			_top0.rotationX = 90;
			_top0.render();
			_movie.append( _top0 );

			var __top1 = new Image();
			__top1.src = 'frame02.png';
			var _top1 = new nd3d.Dom3D( __top1 );
			_top1.y = -210;
			_top1.rotationX = 90;
			_top1.render();
			_movie.append( _top1 );

			var __side0 = new Image();
			__side0.src = 'frame03.png';
			var _side0 = new nd3d.Dom3D( __side0 );
			_side0.x = -350;
			_side0.rotationY = 90;
			_side0.render();
			_movie.append( _side0 );

			var __side1 = new Image();
			__side1.src = 'frame03.png';
			var _side1 = new nd3d.Dom3D( __side1 );
			_side1.x = 350;
			_side1.rotationY = 90;
			_side1.render();
			_movie.append( _side1 );

			var _title = new nd3d.Dom3D( $('#pageTitle') );
			_world.append( _title );
			_title.x = - 350 + $( _title.view ).width() * .5;
			_title.y = - 210 + $( _title.view ).height() * .5;
			_title.z = - 50;
			_title.render();

			var _h1 = new nd3d.Dom3D( $( '#img01' ) )
			_world.append( _h1 );
			_h1.x = 350;
			_h1.y = 110;
			_h1.z = -200;
			_h1.render();
			var _h2 = new nd3d.Dom3D( $( '#img02' ) )
			_world.append( _h2 );
			_h2.x = 400;
			_h2.y = 200;
			_h2.z = - 300;
			_h2.render();
			var _h3 = new nd3d.Dom3D( $( '#img03' ) )
			_world.append( _h3 );
			_h3.x = - 350;
			_h3.y = - 210;
			_h3.z = 200;
			_h3.render();

			$( 'body' ).css('opacity', '1');
			_camera.zoom = 0;
			var _from = [];
			_from.zoom = 0;
			var _to = new Object();
			_to.zoom = 1;
			var tween = new TWEEN.Tween( _from )
					            .to( _to, 500 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	_camera.zoom = this.zoom;
					                _world.render();

					            } )
					            .start();

			//	render
			//jQuery.fx.interval = nd3d.getUA().iphone?50:13;

			var _frameCount = 0;
			setInterval(function(){
				_world.rotationX = Math.sin( _frameCount * .0010 * Math.PI ) * 16;
				_world.rotationY = Math.sin( _frameCount * .0015 * Math.PI ) * 45;
				_world.rotationZ = Math.sin( _frameCount * .0012 * Math.PI ) * 16;
				_world.render();

				// _movie.rotationX = - Math.sin( _frameCount * .0012 * Math.PI ) * 24;
				// _movie.rotationY = Math.sin( _frameCount * .0015 * Math.PI ) * 15;
				// _movie.render();

				_frameCount++;
				TWEEN.update();

			}, jQuery.fx.interval );

		})(jQuery);
	});
}