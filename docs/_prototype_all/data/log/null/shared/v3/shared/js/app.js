/*
	app.js
*/

var ua;
var scens;
var camera;
var light;
var lightSub;
var plane;
var renderer;
var container;
var _rad = - 0.01;
var _sin = Math.sin( _rad );
var _cos = Math.cos( _rad );
var _margin = 5;

var _count = 0;
var objectList;
var _num = 12;
var _numw = 16;
var _numh = 12;
var _grav = 1;
var _timeDur = 1000;

var isWebGlEnabeld = false;



//	preload
var __preloadImage = new Image();
__preloadImage.src = 'shared/img/land_ocean.jpg';



$(function()
{
	var _uaOriginal = navigator.userAgent.toLowerCase();
	if(
		_uaOriginal.indexOf('iphone') != -1 || 
		_uaOriginal.indexOf('android') != -1 || 
		_uaOriginal.indexOf('ipod') != -1 || 
		_uaOriginal.indexOf('ipad') != -1 || 
		_uaOriginal.indexOf('blackberry') != -1
	)
	{
		_num = Math.floor( _num * .5 );
		_numw = Math.floor( _numw * .5 );
		_numh = Math.floor( _numh * .5 )
		_timeDur = 2000;
	} else if( _uaOriginal.indexOf('firefox') != -1 || _uaOriginal.indexOf('chrome') != -1 || _uaOriginal.indexOf('opera') != -1 )
	{
		isWebGlEnabeld = Detector.webgl;
	} else if( _uaOriginal.indexOf('safari') != -1 )
	{
		isWebGlEnabeld = Detector.webgl;
	} else {
		//	<p style="padding: 0 32px;">CANVASに対応したブラウザが必要なコンテンツです。</p>
	}
	
	var _canvas = document.createElement( 'CANVAS' );
	if( !_canvas || !_canvas.getContext )
	{
		var _p = document.createElement( 'p' );
		_p.classname = 'noCanvas';
		$( _p ).text('CANVASに対応したブラウザが必要なコンテンツです。');
		$( '#documentBody').append( _p );
		return;
	}
	
	$( 'html' ).css({
		'width'	: '100%',
		'height'	: '100%'
	});
	$( 'body' ).css({
		'overflow': 'hidden',
		'width'	: '100%',
		'height'	: '100%'
	});
	$( '#container' ).css({
		'width'	: '100%',
		'height'	: '100%'
	});
	
	$( '#documentBody' ).css({
		'position'	: 'absolute',
		'width'	: '100%',
		'height'	: '100%',
		'z-index'	: '0'
	});
	
	$( '#info' ).css({
		'position'	: 'absolute',
		'top'	: '100px',
		'left'	: '32px',
		'padding'	:	'0',
		'z-index'	: '8'
		
	});
	
	$( '#frameHead' ).css({
		'position'	: 'absolute',
		'width'	: '100%',
		'top'	: '0',
		'left'	: '0',
		'z-index'	: '10',
		'background-color'	:	'rgba( 255,255,255,0)'
	});
	
	$( '#frameFoot' ).css({
		'position'	: 'absolute',
		'width'	: '100%',
		'z-index'	: '5',
		'bottom'	:	'0',
		'background-color'	:	'rgba( 255,255,255,0)'
	});
	
	$( '#documentBody' ).text('');
	
	//
	container = document.getElementById('documentBody');
	scene = new THREE.Scene();
	
	camera = new THREE.PerspectiveCamera( 45, container.clientWidth / container.clientHeight, 1, 10000 );
	camera.position.set( 0, 500, 1000 );
	scene.add( camera );
	
	light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );
	
	/*
	lightSub = new THREE.DirectionalLight( 0xCCCCCC, 1 );
	lightSub.position.set( -1000, -1000, -1000 ).normalize();
	scene.add( lightSub );
	*/
	
	plane = new THREE.Mesh( new THREE.PlaneGeometry( 400, 400 ), new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
	plane.rotation.x = - 90 * ( Math.PI / 180 );
	scene.add( plane );
		
	//
	if( isWebGlEnabeld )
	{
		renderer = new THREE.WebGLRenderer( { antialias: true, clearColor: 0xffffff } );
	} else {
		renderer = new THREE.CanvasRenderer();
	}
	renderer.setSize( container.clientWidth, container.clientHeight );
	container.appendChild( renderer.domElement );
	
	
	objectList = [];
	
	
	for( var i = 0; i < _num; i++ )
	{
		var _r = Math.random() * 100 + 30;
		var _geometry = new THREE.SphereGeometry( _r, _numw, _numh );
		var _material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, shading: THREE.FlatShading, overdraw: true } );
		
		if( isWebGlEnabeld )
		{
			_material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'shared/img/land_ocean.jpg' ) } );
		}
		
		var _sphere = new THREE.Mesh( _geometry, _material );
		_sphere.position.x = Math.random() * 100 - 50;
		_sphere.position.y = 150 + i * 220;
		_sphere.position.z = Math.random() * 100 - 50;
		_sphere.rotation.x = Math.random() * 360;
		_sphere.rotation.y = Math.random() * 360;
		_sphere.rotation.z = Math.random() * 360;
		scene.add( _sphere );
		objectList[i] = [ _sphere, _r, _sphere.position.x, _sphere.position.y, _sphere.position.z, 0, 0, 0, 0, 0, 0 ];
	}
	
	
	//	$( document ).bind( 'mousedown', _onmousedown )
	$( window ).bind( 'resize', _onresize );
	animate();
	
	var _startID = setTimeout("delayStart()", 3000);
	
	function animate()
	{
		requestAnimationFrame( animate );
		render();
	}
	
	function render()
	{
		_count++;
		
		_update();
		_adjust();
		_adjust2()
		
		//	camera
		var _x = camera.position.x;
		var _z = camera.position.z;
		camera.position.x = _x * _cos - _z * _sin;
		camera.position.z = _x * _sin + _z * _cos;
		camera.position.y = Math.sin( _count * .01 ) * 100 + 700;
		camera.lookAt( {x:0, y:200, z:0 } );
		
		renderer.render( scene, camera );
	}
	
	//	345	vector
	function _update()
	{
		var len = objectList.length;
		while( len )
		{
			len--;
			var _bl = objectList[len];
			var _b = _bl[0];
			
			//	accell
			_bl[5] += 0;
			_bl[6] -= _grav;
			_bl[7] += 0;
			_bl[5] *= .96;
			_bl[6] *= .96;
			_bl[7] *= .96;
			
			_b.position.x += _bl[5];
			_b.position.y += _bl[6];
			_b.position.z += _bl[7];
			
			_bl[2] = _b.position.x;
			_bl[3] = _b.position.y;
			_bl[4] = _b.position.z;
		}
	}
	
	function _adjust()
	{
		var len = objectList.length;
		var _b;
		var _b0;
		var _bl;
		var _b0l;
		var _r;
		var _r0;
					
		for( var i = 0; i < len - 1; i++ )
		{
			_bl = objectList[i];
			_b = _bl[0]
			_r = _bl[1]
			for( var j = i + 1; j < len; j++ )
			{
				_b0l = objectList[j];
				_b0 = _b0l[0]
				_r0 = _b0l[1]
				var _dx = _b0.position.x - _b.position.x;
				var _dy = _b0.position.y - _b.position.y;
				var _dz = _b0.position.z - _b.position.z;
				var _dr = _r + _r0;
				var _d = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
				
				_dr += _margin;
				
				if( _d < _dr )
				{
					var _posx = ( 1 - _d / _dr ) * ( _dr - _d ) * _dx / _d * .8;
					var _powy = ( 1 - _d / _dr ) * ( _dr - _d ) * _dy / _d * .8;
					var _posz = ( 1 - _d / _dr ) * ( _dr - _d ) * _dz / _d * .8;
					
					_bl[5] -= _posx;
					_bl[6] -= _powy;
					_b0l[5] += _posx;
					_b0l[6] += _powy;
					
					_bl[7] -= _posz;
					_b0l[7] += _posz;
					
					//	rotation
					_bl[8] -= _posx * Math.PI * .001;
					_bl[10] -= _posz * Math.PI * .001;
					_b0l[8] += _posx * Math.PI * .001;
					_b0l[10] += _posz * Math.PI * .001;
					_bl[8] *= .9;
					_bl[10] *= .9;
					_b0l[8] *= .9;
					_b0l[10] *= .9;
				}
			}
		}
	}
	
	function _adjust2()
	{
		var _hw = 400 * .5;
		var _bl;
		var _b;
		var _r;

		var len = objectList.length
		for( var i = 0; i < len; i++ )
		{
			//	ˆÊ’u
			_bl = objectList[i];
			_b = _bl[0]
			_r = _bl[1]
			
			if( _b.position.y < _r + _margin )
			{
				_b.position.y = _r + _margin;
				_bl[3] = _r + 10;
				_bl[6] *= ( _bl[6] < 0 )? -1 : 1;
				_bl[6] *= .6;
			}
			
			if( _b.position.x < - _hw + _r )
			{
				_b.position.x = - _hw + _r;
				_bl[2] = - _hw + _r;
				_bl[5] *= ( _bl[5] < 0 )? -1 : 1;
				_bl[5] *= .6;
			} else if( _b.position.x > _hw - _r )
			{
				_b.position.x = _hw - _r;
				_bl[2] = _hw - _r;
				_bl[5] *= ( _bl[5] > 0 )? -1 : 1;
				_bl[5] *= .6;
			}
			
			if( _b.position.z < - _hw + _r )
			{
				_b.position.z = - _hw + _r;
				_bl[4] = - _hw + _r
				_bl[7] *= ( _bl[7] < 0 )? -1 : 1;
				_bl[7] *= .6;
			} else if( _b.position.z > _hw - _r )
			{
				_b.position.z = _hw - _r;
				_bl[4] = - _hw - _r
				_bl[7] *= ( _bl[7] > 0 )? -1 : 1;
				_bl[7] *= .6;
			}
				
			_b.rotation.x -= _bl[8];
			_b.rotation.z -= _bl[10];
		}
	}
	

	function _onresize( e )
	{
		camera.aspect = container.clientWidth / container.clientHeight;
		camera.updateProjectionMatrix();
		renderer.setSize( container.clientWidth, container.clientHeight );
	}
	
	function _onmousedown( e )
	{
		var _bl = objectList[0];
		var _b = _bl[0];
		var _r = _bl[1];
		var _obj = {
			x: 1,
			y: 1,
			z: 1,
			r: _r
		};
		
		//	https://github.com/sole/tween.js
		new TWEEN.Tween(_obj).to({x: 0,y:0,z:0,r:0},800).onUpdate(
		function()
		{
			_b.scale.x = _obj.x;
			_b.scale.y = _obj.y;
			_b.scale.z = _obj.z;
			_bl[1] = _obj.r
		}
		).easing(TWEEN.Easing.Cubic.EaseOut).onComplete(
		function()
		{
			_onmousedownAndCreate();
		}
		).start();
	}
	
});
	
	function delayStart()
	{
		TWEEN.start();
		setInterval( 'yugopTimer()', _timeDur );
	}
	
	function yugopTimer()
	{
		var _bl = objectList[0];
		var _b = _bl[0];
		var _r = _bl[1];
		var _obj = {
			x: 1,
			y: 1,
			z: 1,
			r: _r
		};
		
		//	https://github.com/sole/tween.js
		new TWEEN.Tween(_obj).to({x: 0,y:0,z:0,r:0},800).onUpdate(
		function()
		{
			_b.scale.x = _obj.x;
			_b.scale.y = _obj.y;
			_b.scale.z = _obj.z;
			_bl[1] = _obj.r
		}
		).easing(TWEEN.Easing.Cubic.EaseOut).onComplete(
		function()
		{
			_onmousedownAndCreate();
		}
		).start();
	}
	
	function _onmousedownAndCreate()
	{
		var _bl = objectList.shift();
		scene.remove( _bl );
		_bl = null;
		
		var _r = Math.random() * 100 + 30;
		var _geometry = new THREE.SphereGeometry( _r, _numw, _numh );
		var _material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF, shading: THREE.FlatShading, overdraw: true } );
		
		if( isWebGlEnabeld )
		{
			_material = new THREE.MeshBasicMaterial( { map: THREE.ImageUtils.loadTexture( 'shared/img/land_ocean.jpg' ) } );
		}
		
		var _sphere = new THREE.Mesh( _geometry, _material );
		_sphere.position.x = Math.random() * 100 - 50;
		_sphere.position.y = 1000;
		_sphere.position.z = Math.random() * 100 - 50;
		_sphere.rotation.x = Math.random() * 360;
		_sphere.rotation.y = Math.random() * 360;
		_sphere.rotation.z = Math.random() * 360;
		scene.add( _sphere );
		objectList.push( [ _sphere, _r, _sphere.position.x, _sphere.position.y, _sphere.position.z, 0, 0, 0, 0, 0, 0 ] );
	}

jQuery.extend(jQuery.easing,
{
  easeInQuart: function (x, t, b, c, d) {
    return c*(t/=d)*t*t*t + b;
  },
});
 