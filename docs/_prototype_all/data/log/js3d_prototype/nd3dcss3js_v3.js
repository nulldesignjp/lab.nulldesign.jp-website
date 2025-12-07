/*
	nd3dcss3js.js
	http://nulldesignjp/
	https://github.com/nulldesignjp/
*/

var nd3d = (function(){
	var nd3dcss3js = function(){}
	nd3dcss3js.version = '3.1.1';
	nd3dcss3js.auther = 'nulldesign.jp';
	nd3dcss3js.git = 'https://github.com/nulldesignjp/nd3dcss3js';
	nd3dcss3js.uri = 'http://nulldesign.jp/nd3dcss3js/';
	nd3dcss3js.info = 'nd3dcss3js prototype ver ' + nd3dcss3js.version + '\n' + 'URL: ' + nd3dcss3js.git + '\n' + 'by ' + nd3dcss3js.auther;

	nd3dcss3js.browserString = '';
	nd3dcss3js.perspective = 3000;

	nd3dcss3js.PI = Math.PI;
	nd3dcss3js.PI2 = nd3dcss3js.PI + nd3dcss3js.PI;
	nd3dcss3js.PI05 = nd3dcss3js.PI * .5;
	nd3dcss3js.PI25 = nd3dcss3js * .25;

	nd3dcss3js.getUA = function()
	{
		var ua =
		{
			'msie'	:	false,
			'msie6'	:	false,
			'msie7'	:	false,
			'msie8'	:	false,
			'msie9'	:	false,
			'msie10'	:	false,
			'iphone'	:	false,
			'ipad'	:	false,
			'ipod'	:	false,
			'safari'	:	false,
			'firefox'	:	false,
			'chrome'	:	false,
			'opera'	:	false,
			'android'	:	false,
			'androidTablet'	:	false,
			'blackberry'	:	false,
			'windowsMobile'	:	false
		};
		var _ua = navigator.userAgent.toLowerCase();
		_ua = _ua.replace(/ /g, "");
		for( var i in ua )
		{
			if( _ua.indexOf( i ) != -1 )
			{
				ua[i] = true;
			}
		}

		//	another ua....
		if( ua.android )
		{
			//	android
			ua.android = ( ( _ua.indexOf( 'android' ) != -1 && _ua.indexOf( 'mobile' ) != -1 ) && _ua.indexOf( 'sc-01c' ) == -1 )?	true:false;

			//	androidTablet:SC-01C
			ua.androidTablet = ( _ua.indexOf( 'android' ) != -1 && ( _ua.indexOf( 'mobile' ) == -1 || _ua.indexOf( 'sc-01c' ) != -1 ) )?	true:false;
		}

		//	windows mobile
		ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;
		return ua;
	}

	nd3dcss3js.Dom3DCore = (function(){
		var Dom3DCore = function()
		{
			this.position = new Object();
			this.position.x = 0;
			this.position.y = 0;
			this.position.z = 0;

			this.rotation = new Object();
			this.rotation.x = 0;
			this.rotation.y = 0;
			this.rotation.z = 0;

			this.scale3d = new Array();
			this.scale3d = [1,1,1];

			this.translate = new Array();
			this.translate = [ '50%', '50%', '0' ];

			this.matrix3d = new Array();
			this.matrix3d = [
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1
			];
		}

		Dom3DCore.prototype =
		{
			render :	function( e )
			{
				this._matrix();
			},
			_matrix	:	function()
			{
				this.matrix3d = nd3dcss3js.coreEngine.update( this.position, this.rotation, this.scale3d  );

				//	firefox bug???
				//	Error: Permission denied to access property 'toString'
				var _translate = this.translate.join(",");
				var _matrix3d = this.matrix3d.join(",");
				$(this.view).css( nd3dcss3js.browserString + 'transform', 'translate3d('+_translate+') matrix3d(' + _matrix3d + ')' );
				//$(this.view).css( nd3dcss3js.browserString + 'transform', 'translate3d('+this.translate.toString()+') matrix3d(' + this.matrix3d.toString() + ')' );
			},
			lookAt	:	function( _obj )
			{
				var _dx = this.poxition.x = _obj.x;
				var _dx = this.poxition.y = _obj.y;
				var _dx = this.poxition.z = _obj.z;

				this.rotationX = Math.atan2( _dy, _dz );
				this.rotationY = Math.PI * .5 - Math.atan2( _dz, _dx );

				if( _dz > 0 )
				{
					this.rotationY *= -1
				}
			},
			set x( e )
			{
				this.position.x = e;
			}, 
			get x()
			{
				return this.position.x;
			},
			set y( e )
			{
				this.position.y = e;
			}, 
			get y()
			{
				return this.position.y;
			},
			set z( e )
			{
				this.position.z = e;
			},
			get z()
			{
				return this.position.z;
			},
			set rotationX( e )
			{
				this.rotation.x = e;
			},
			get rotationX()
			{
				return this.rotation.x;
			},
			set rotationY( e )
			{
				this.rotation.y = e;
			},
			get rotationY()
			{
				return this.rotation.y;
			},
			set rotationZ( e )
			{
				this.rotation.z = e;
			},
			get rotationZ()
			{
				return this.rotation.z;
			},
			set scale( e )
			{
				this.scale3d = [ e,e,e ];
			},
			get scale()
			{
				return this.scale3d[0];
			}

		};

		return Dom3DCore;
	})();

	nd3dcss3js.world = (function(){
		var world = function( _stage )
		{
			this.translate = [ '50%', '50%', '0' ];

			this.world = $('<div>');
			this.field = $('<div>');
			$( _stage ).append( this.world );
			$( this.world ).append( this.field );

			this.view = this.field;
			this.camera = {
				x:0,
				y:0,
				z:0,
				rotationX:0,
				rotationY:0,
				rotationZ:0,
				zoom: 1
			};

			nd3dcss3js.Dom3DCore.apply( this, arguments );

			if( console && console.log ) console.log( nd3dcss3js.info );

			var _ua = nd3dcss3js.getUA();
			if( _ua.safari )
			{
				nd3dcss3js.browserString = '-webkit-';
			} else if( _ua.firefox )
			{
				nd3dcss3js.browserString = '-moz-';
			} else if( _ua.opera )
			{
				nd3dcss3js.browserString = '-o-';
			} else if( _ua.msie )
			{
				nd3dcss3js.browserString = '-ms-';
			} else if( _ua.android )
			{
				nd3dcss3js.browserString = '-webkit-';
			} 

			this.world.css({
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': '100%',
				'height': '100%',
				'overflow': 'hidden',
				'perspective': nd3dcss3js.perspective+'px'
			});
			this.world.css( nd3dcss3js.browserString + 'perspective', nd3dcss3js.perspective+'px' );

			this.field.css({
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'width': '100%',
				'height': '100%',
				'transform': 'translate3d( 50%,50%,0)',
				'transform-origin': 'left top',
				'transform-style': 'preserve-3d',
				'user-select': 'none'
			});
			
			this.field.css( nd3dcss3js.browserString + 'transform', 'translate3d( 50%,50%,0)' );
			this.field.css( nd3dcss3js.browserString + 'transform-origin', 'left top' );
			this.field.css( nd3dcss3js.browserString + 'transform-style', 'preserve-3d' );
			this.field.css( nd3dcss3js.browserString + 'user-select', 'none' );
		}

		world.prototype = new nd3dcss3js.Dom3DCore();

		world.prototype.append = function( e )
		{
			$( this.view ).append( e.view );
		}

		world.prototype._matrix = function( e )
		{
			var _pos = new Object();
			_pos.x = this.position.x - this.camera.x;
			_pos.y = this.position.y - this.camera.y;
			_pos.z = this.position.z - this.camera.z;

			var _rot = new Object();
			_rot.x = this.rotation.x - this.camera.rotationX;
			_rot.y = this.rotation.y - this.camera.rotationY;
			_rot.z = this.rotation.z - this.camera.rotationZ;

			var _scale = new Array();
			_scale[0] = this.scale3d[0] * this.camera.zoom;
			_scale[1] = this.scale3d[1] * this.camera.zoom;
			_scale[2] = this.scale3d[2] * this.camera.zoom;
			this.matrix3d = nd3dcss3js.coreEngine.update( _pos, _rot, _scale  );

			//	firefox bug???
			//	Error: Permission denied to access property 'toString'
			var _translate = this.translate.join(",");
			var _matrix3d = this.matrix3d.join(",");
			$(this.view).css( nd3dcss3js.browserString + 'transform', 'translate3d('+_translate+') matrix3d(' + _matrix3d + ')' );
			//$(this.view).css( nd3dcss3js.browserString + 'transform', 'translate3d('+this.translate.toString()+') matrix3d(' + this.matrix3d.toString() + ')' );
		}

		world.prototype.append = function( e )
		{
			$( this.view ).append( e.view );
		}

		world.prototype.lookAt = function(_obj){}

		return world;
	})();

	nd3dcss3js.Camera3D = (function(){
		var Camera3D = function( e )
		{
			nd3dcss3js.Dom3DCore.apply( this, arguments );
			this.world = e.world;
			e.camera = this;

			this.__defineSetter__("perspective", function(e){
					nd3dcss3js.perspective = e<0?-e:e;
					this.world.css('perspective', nd3dcss3js.perspective+'px');
			});
			this.__defineGetter__("perspective", function(){
					return nd3dcss3js.perspective;
			});

			this.__defineSetter__("zoom", function(e){
					this.scale = e;
			});
			this.__defineGetter__("zoom", function(){
					return this.scale;
			});
		}

		//	override
		Camera3D.prototype = new nd3dcss3js.Dom3DCore();
		Camera3D.prototype.append = function(e){}
		Camera3D.prototype.remove = function(e){}
		Camera3D.prototype.render = function(){}
		Camera3D.prototype._matrix = function(){}

		return Camera3D;
	})();

	nd3dcss3js.Dom3D = (function(){
		var Dom3D = function( _view )
		{
			nd3dcss3js.Dom3DCore.apply( this, arguments );

			this.view = _view;
			this.translate = [ '-50%', '-50%', '0' ];

			$( this.view ).css({
				'position': 'absolute',
				'left': 0,
				'top': 0,
				'margin': 0,
				'transform-style': 'preserve-3d',
			});

			$( this.view ).css( nd3dcss3js.browserString + 'transform-style', 'preserve-3d' );
		}

		Dom3D.prototype = new nd3dcss3js.Dom3DCore();

		Dom3D.prototype.append = function( e )
		{
			if( e.view )
			{
				$(this.view).append( e.view );
			} else {
				$(this.view).append( e );
			}
		}
		return Dom3D;
	})();

	nd3dcss3js.coreEngine = (function(){
		var coreEngine = function(){}
		coreEngine.update = function( _pos ,_rot, _scale )
		{

			var _l = [
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1
			];

			var _posX = _pos.x;
			var _posY = _pos.y;
			var _posZ = _pos.z;
			var _rx = _rot.z;
			var _ry = _rot.y;
			var _rz = _rot.x;

			var sx = sin( rad( _rx ) );
			var cx = cos( rad( _rx ) );
			var sy = sin( rad( _ry ) );
			var cy = cos( rad( _ry ) );
			var sz = sin( rad( _rz ) );
			var cz = cos( rad( _rz ) );
				
			//	chrome    
			sx = sx==1.2246063538223773e-16?0:sx;
			sy = sy==1.2246063538223773e-16?0:sy;
			sz = sz==1.2246063538223773e-16?0:sz;
			cx = cx==6.123031769111886e-17?0:cx;
			cy = cy==6.123031769111886e-17?0:cy;
			cz = cz==6.123031769111886e-17?0:cz;

			//	safari, firefox
			sx = sx==1.2246467991473532e-16?0:sx;
			sy = sy==1.2246467991473532e-16?0:sy;
			sz = sz==1.2246467991473532e-16?0:sz;
			cx = cx==6.123233995736766e-17?0:cx;
			cy = cy==6.123233995736766e-17?0:cy;
			cz = cz==6.123233995736766e-17?0:cz;


			_l[0] = cx*cy;
			_l[1] = cx*sy*sz-sx*cz;
			_l[2] = cx*sy*cz+sx*sz;
			_l[3] = 0
			_l[4] = sx*cy;
			_l[5] = sx*sy*sz+cx*cz;
			_l[6] = sx*sy*cz-cx*sz;
			_l[7] = 0;
			_l[8] = - sy
			_l[9] = cy*sz;
			_l[10] = cy*cz;
			_l[11] = 0;

			// scale
			_l[0] *= _scale[0];
			_l[5] *= _scale[1];
			_l[10] *= _scale[2];

			//	translateX
			_l[12] = _posX;
			//	translateY
			_l[13] = _posY;
			//	translateZ
			_l[14] = - _posZ;

			return _l;
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
			return Math.sin( a );
		}

		function cos( a )
		{
			return Math.cos( a );
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

		return coreEngine;
	})();

	return nd3dcss3js;
})();