/*
	engine.js
*/

window.onload = function()
{
	jQuery(function(){
		(function($){
			//	basic

			var ua = nd3d.getUA();

			if( ua.msie )
			{
				var _con = document.getElementById('container');
				_con.style.display = 'block';
				 return;
			}

			$( '#container' ).css({
				'display': 'block',
				'opacity': 0
			}).delay(1000).animate({
				'opacity': 1
			}, 1000 );



			$( 'html, body' ).css('overflow','hidden');
			$( '#container' ).css({
				'height': '100%'
			});

			var _world = new nd3d.world( $('#container') );
			_world.perspective = 1500;

			var _v = new Array();

			var _l = new Array();
			_l.push( new nd3d.Dom3D( $( '#siteName' ) ) );
			_l.push( new nd3d.Dom3D( $( '#siteDescription' ) ) );
			_l.push( new nd3d.Dom3D( $( '#myskill' ) ) );
			_l.push( new nd3d.Dom3D( $( '#myname' ) ) );
			_l.push( new nd3d.Dom3D( $( '#myplace' ) ) );
			_l.push( new nd3d.Dom3D( $( '#mybone' ) ) );
			_l.push( new nd3d.Dom3D( $( '#tw' ) ) );
			_l.push( new nd3d.Dom3D( $( '#nisshi' ) ) );
			_l.push( new nd3d.Dom3D( $( '#preview' ) ) );
			_l.push( new nd3d.Dom3D( $( '#snsblock' ) ) );

			var _renderList = new Array();

			var len = _l.length;
			for( var i = 0; i < len; i++ )
			{
				_v[i] = new Array();
				_v[i][0] = 0;
				_v[i][1] = 0;
				_v[i][2] = 0;
				var _tar = new nd3d.Dom3D( $('<div>') );
				_tar.append( _l[i] );
				_renderList.push( _tar );
			}

			var _posy = 0;
			var len = _renderList.length;
			for( var i = 0; i < len; i++ )
			{
				var _d = _renderList[i];
				var _p = _l[i];
				_world.append( _d );
				_p.x = $( _p.view ).width() * .5 - $( window ).width() * .35;
				_p.y = _posy - $( window ).height() * .25;
				_p.z = Math.random() * 200 - 100;
				_posy += $( _p.view ).height() + 16;

				_p.render();
				_d.render();
			}

			_p.x = 225;
			_p.y += 50;
			_p.z += 50;

			var _isDrag = false;
			var _px = 0;
			var _py = 0;
			var _tarX = 0;
			var _tarY = 0;
			var _tarZ = 0;
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
					_tarX += e.pageX - _px;
					_tarY += e.pageY - _py;
					_tarZ += Math.atan2( _tarY, _tarX ) * 180 / Math.PI
					_px = e.pageX;
					_py = e.pageY;
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
				if( _isDrag )
				{
					_tarX += e.originalEvent.touches[0].pageX - _px;
					_tarY += e.originalEvent.touches[0].pageY - _py;
					_tarZ += Math.atan2( _tarY, _tarX ) * 180 / Math.PI
					_px = e.originalEvent.touches[0].pageX;
					_py = e.originalEvent.touches[0].pageY;
				}
				e.preventDefault();
			});


			var _frameCount = 0;
			setInterval(function(){

				$( _renderList ).each( function(i,e){

					var __tarX = Math.sin( _tarY * .001 * Math.PI ) * 360 + Math.sin( _frameCount * .0015 * Math.PI ) * 12;
					var __tarY = Math.sin( _tarX * .001 * Math.PI ) * 360 + Math.sin( _frameCount * .0012 * Math.PI ) * 12;
					var __tarZ = Math.sin( _frameCount * .001 * Math.PI ) * 12;

					var _vec = _v[i];
					_vec[0] = ( _vec[0] + ( __tarX - e.rotationX ) / ( 70 + i*2 ) ) / 1.025000;
					_vec[1] = ( _vec[1] + ( __tarY - e.rotationY ) / ( 70 + i*2 ) ) / 1.025000;
					_vec[2] = ( _vec[2] + ( __tarZ - e.rotationZ ) / ( 70 + i*2 ) ) / 1.025000;

					e.rotationX += _vec[0];
					e.rotationY += _vec[1];
					e.rotationZ += _vec[2];
					e.render();
				});


				_tarX *= 0.96;
				_tarY *= 0.96;
				_tarZ *= 0.96;

				TWEEN.update();
				_frameCount++;

			}, jQuery.fx.interval );


			setInterval(function(){
				$( _renderList ).each(function(i,e){
					if( i == $( _renderList ).size() - 1 ) return;
					var __obj = e;
					var _from = {};
					_from.z = e.z;
					_from.rotationX = e.rotationX;
					_from.rotationY = e.rotationY;
					var _to = {};
					_to.z = Math.random() * 200 - 100;
					_to.rotationX = Math.floor( Math.random() * 4 ) * 90;
					_to.rotationY = Math.floor( Math.random() * 4 ) * 90;
					var tween = new TWEEN.Tween( _from )
					            .to( _to, 1000 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	// __obj.x = this.x;
					            	// __obj.y = this.y;
					            	//__obj.z = this.z;
					            	//__obj.rotationX = this.rotationX;
					            	//__obj.rotationY = this.rotationY;
					            	// __obj.rotationZ = this.rotationZ;
					                __obj.render();

					            } )
					            .start();
				});
			}, 10000);



		})(jQuery);
	});
}