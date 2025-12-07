/*
	nd3dcss3js.js
	https://github.com/nulldesignjp/
*/

var matrix3d = (function(){

	function matrix3d( _view, _isField )
	{
		this.view = _view;

		$( this.view ).css({
			'position': 'absolute',
			'left': 0,
			'top': 0
		});

		this.matrix3d = new Array();
		this.matrix3d = [
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1
		];

		this.scale3d = new Array();
		this.scale3d = [1,1,1];

		this.rotation = new Object();
		this.rotation.x = 0;
		this.rotation.y = 0;
		this.rotation.z = 0;

		this.translate = new Array();
		this.translate = [ '-50%', '-50%', '0' ];

		if( _isField ) this.translate = ['50%','50%','0'];

		this.position = new Object();
		this.position.x = 0;
		this.position.y = 0;
		this.position.z = 0;
	}

	//	class
	matrix3d.version = '1.0.4';
	matrix3d.auther = 'nulldesign.jp';
	matrix3d.uri = 'http://nulldesign.jp/nd3dcss3js/';
	matrix3d.browserString = '';
	matrix3d.perspective = 1000;


	matrix3d.initField = function( _world, _field )
	{

		console.log( 'nd3dcss3js prototype ver ' + matrix3d.version + '\n' + 'URL: ' + matrix3d.uri );

		var _ua = getUA();
		if( _ua.safari )
		{
			matrix3d.browserString = '-webkit-';
		} else if( _ua.firefox )
		{
			matrix3d.browserString = '-moz-';
		} else if( _ua.opera )
		{
			matrix3d.browserString = '-o-';
		} else if( _ua.msie )
		{
			matrix3d.browserString = '-ms-';
		} else if( _ua.android )
		{
			matrix3d.browserString = '-webkit-';
		} 

		$('body').css({
			'overflow': 'hidden'
		});
		_world.css({
			'position': 'absolute',
			'left': 0,
			'top': 0,
			'width': '100%',
			'height': '100%',
			'overflow': 'hidden',
			'perspective': matrix3d.perspective+'px'
		});
		_world.css( matrix3d.browserString + 'perspective', matrix3d.perspective+'px' );

		_field.css({
			'position': 'absolute',
			'left': 0,
			'top': 0,
			'width': '100%',
			'height': '100%',
			'transform': 'translate3d( 50%,50%,0)',
			'transform-origin': 'left top',
			'transform-style': 'preserve-3d',
			'user-select': 'none',
		});
		
		_field.css( matrix3d.browserString + 'transform', 'translate3d( 50%,50%,0)' );
		_field.css( matrix3d.browserString + 'transform-origin', 'left top' );
		_field.css( matrix3d.browserString + 'transform-style', 'preserve-3d' );
		_field.css( matrix3d.browserString + 'user-select', 'none' );


	}
	matrix3d.prototype = {
		_matrix : function()
		{
			var _l = [
				1,0,0,0,
				0,1,0,0,
				0,0,1,0,
				0,0,0,1
			];
			
			//	中si-ta,w
			//	http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/tech07.html
			//	http://www6.ocn.ne.jp/~simuphys/daen1-1.html
			//	http://www.mech.tohoku-gakuin.ac.jp/rde/contents/course/robotics/coordtrans.html
			//	http://www.cg.info.hiroshima-cu.ac.jp/~miyazaki/knowledge/tech07.html	
			var sx = sin( this.rotation.z );
			var cx = cos( this.rotation.z );
			var sy = sin( this.rotation.y );
			var cy = cos( this.rotation.y );
			var sz = sin( this.rotation.x );
			var cz = cos( this.rotation.x );

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

			//	translateX
			_l[12] = this.position.x;
			//	translateY
			_l[13] = this.position.y;
			//	translateZ
			_l[14] = this.position.z;


			this.matrix3d = _l;

			var _prop = matrix3d.browserString + 'transform';
			$(this.view).css( _prop, 'translate3d('+this.translate.toString()+') matrix3d(' + this.matrix3d.toString() + ') scale3d('+this.scale3d.toString()+')' );
		},
		render	: function()
		{
			this._matrix();
		},
		lookAt	:	function( _x, _y, _z )
		{
			var _dx = this.position.x - _x;
			var _dy = this.position.y - _y;
			var _dz = this.position.z - _z;

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


	/*	-------------------------------------------------------------
		user agene
	-------------------------------------------------------------	*/
	function getUA()
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

			alert
		}

		//	windows mobile
		ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;
		return ua;
	}

	return matrix3d;

})();

