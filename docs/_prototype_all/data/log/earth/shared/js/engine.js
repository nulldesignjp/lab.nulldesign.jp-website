/*
	engine.js
*/


document.write('<script type="text/javascript" src="shared/js/tween.min.js"></script>');
document.write('<script type="text/javascript" src="shared/js/three.min.js"></script>');
document.write('<script type="text/javascript" src="shared/js/dropSphere3d.js"></script>');

window.onload = function()
{
	var _canvas,_ctx;
	var _container;
	var _camera,_scene;
	var _particleLight,_pointLight,_renderer;
	var _sList = new Array();

	var _imgTexture,_geometry,_material,_plane;

	var _scaleMin = 0.5;
	var _scaleMax = 2.0;
	var _planeSize = 600;
	var _nums = 8;

	init();

	function init()
	{
		_canvas = document.createElement( 'CANVAS' );
		if( _canvas.getContext )
		{
			init2();
		} else {
			nocanvas();
		}
	}

	function init2()
	{
		_container = document.getElementById( 'container' );
		_camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2400 );
		_camera.position.set( 0, 400, 1600 );
		_scene = new THREE.Scene();

		var shininess = 5, specular = 0x333333, bumpScale = 8, shading = THREE.SmoothShading;

		//	cube	
		var _cubeMaterial = new THREE.MeshPhongMaterial( {
			color: 0x181818,
			ambient: 0x999999,
			specular: specular,
			shininess: shininess,
			shading: shading
		});
		var _cubeGeometry_smooth = new THREE.CubeGeometry( _planeSize, _planeSize, 50 );
		var _cubeGeometry_flat = new THREE.CubeGeometry( _planeSize, _planeSize, 50 );
		var _cubeGeometry = _cubeMaterial.shading == THREE.FlatShading ? _cubeGeometry_flat : _cubeGeometry_smooth;
		_plane = new THREE.Mesh( _cubeGeometry, _cubeMaterial );
		_plane.rotation.x = - 90 * ( Math.PI / 180 );
		_scene.add( _plane );

		_imgTexture = THREE.ImageUtils.loadTexture( "shared/img/earth_atmos_2048.jpg" );
		_imgTexture.wrapS = _imgTexture.wrapT = THREE.RepeatWrapping;
		_imgTexture.anisotropy = 16;

		var geometry_smooth = new THREE.SphereGeometry( 100, 32, 16 );
		var geometry_flat = new THREE.SphereGeometry( 100, 32, 16 );

		_material = new THREE.MeshPhongMaterial({
			map: _imgTexture,
			bumpMap: _imgTexture,
			bumpScale: bumpScale,
			color: 0xffffff,
			ambient: 0xCCCCCC,
			specular: specular,
			shininess: shininess,
			shading: shading
		});

		_geometry = _material.shading == THREE.FlatShading ? geometry_flat : geometry_smooth;

		for( var i = 0; i < _nums-2; i++ )
		{
			var sphere = new THREE.Mesh( _geometry, _material );
			sphere.position.x = Math.random() * 300 - 150;
			sphere.position.y = i * 250 + 1600;
			sphere.position.z = Math.random() * 300 - 150;
			sphere.rotation.x = Math.random() * 360;
			sphere.rotation.y = Math.random() * 360;
			sphere.rotation.z = Math.random() * 360;

			_scene.add( sphere );
			var _ds = new dropSphere3d( sphere );
			_ds.scale = Math.random() * ( _scaleMax - _scaleMin ) + _scaleMin;
			_sList.push( _ds );
		}

		_particleLight = new THREE.Mesh( new THREE.SphereGeometry( 4, 8, 8 ), new THREE.MeshBasicMaterial( { color: 0xffffff } ) );
		_particleLight.position.x = -600;
		_particleLight.position.y = -600;
		_particleLight.position.z = -600;
		_scene.add( _particleLight );

		// Lights
		//	環境光
		_scene.add( new THREE.AmbientLight( 0x444444 ) )

		var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
		directionalLight.position.set( 1, 1, 1 ).normalize();
		_scene.add( directionalLight );

		//	ポイント来と
		_pointLight = new THREE.PointLight( 0xffffff, 2, 800 );
		_scene.add( _pointLight );

		//	パーティクルライト
		_particleLight.material.color = _pointLight.color;
		_pointLight.position = _particleLight.position;

		//	render
		_renderer = new THREE.WebGLRenderer( { clearColor: 0xFFFFFF, clearAlpha: 1, antialias: true } );
		_renderer.setSize( window.innerWidth, window.innerHeight );
		_renderer.sortObjects = true;

		_container.appendChild( _renderer.domElement );

		_renderer.gammaInput = true;
		_renderer.gammaOutput = true;
		_renderer.physicallyBasedShading = true;

		_startContents();

		setInterval( _create, 1000 );
		window.addEventListener( 'resize', onWindowResize, false );
	}


	function onWindowResize()
	{
		_camera.aspect = window.innerWidth / window.innerHeight;
		_camera.updateProjectionMatrix();
		_renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function _create()
	{
		var sphere = new THREE.Mesh( _geometry, _material );
		sphere.position.x = Math.random() * 300 - 150;
		sphere.position.y = 1600;
		sphere.position.z = Math.random() * 300 - 150;
		sphere.rotation.x = Math.random() * 360;
		sphere.rotation.y = Math.random() * 360;
		sphere.rotation.z = Math.random() * 360;

		_scene.add( sphere );

		var _ds = new dropSphere3d( sphere );
		_ds.scale = Math.random() * ( _scaleMax - _scaleMin ) + _scaleMin;
		_sList.push( _ds );

		if( _sList.length > _nums )
		{
			var _sp = _sList[0];

			var _from = new Object();
			_from.scale = _sp.scale;
			var _to = new Object();
			_to.scale = 0;
			var tween = new TWEEN.Tween( _from )
					            .to( _to, 500 )
					            .easing( TWEEN.Easing.Quadratic.InOut )
					            .onUpdate( function () {
					            	_sp.scale = this.scale;
					            } )
					            .onComplete( function()
					            {
					            	var _sp = _sList.shift();
									_scene.remove( _sp.view );
									_sp.view = null;
									_sp = null;
					            })
					            .start();
		}
	}

	function nocanvas(){}

	function _startContents()
	{
		_intervalKey = setInterval( _loop, 1000 / 60 >> 0 );
	}

	function _loop()
	{
		var timer = Date.now() * 0.00025;

		_camera.position.x = Math.cos( timer ) * 1200;
		_camera.position.y = 1200;
		_camera.position.z = Math.sin( timer ) * 1200;
		//_camera.lookAt( { x:0, y:Math.sin( timer ) * 100 + 400, z:0 } );
		_camera.lookAt( { x:0, y:200, z:0 } );

		var len = _sList.length;


		for ( var i = 0; i < len; i ++ )
		{
			var _ds0 = _sList[i];
			_ds0.y -= dropSphere3d.grav;
			_ds0.update();
		}

		for ( var i = 0; i < len-1; i ++ )
		{
			var _ds0 = _sList[i];
			for( var j = i+1; j < len; j++ )
			{
				var _ds1 = _sList[j];
				var _dx = _ds1.view.position.x - _ds0.view.position.x;
				var _dy = _ds1.view.position.y - _ds0.view.position.y;
				var _dz = _ds1.view.position.z - _ds0.view.position.z;
				var _dist = Math.sqrt(_dx*_dx+_dy*_dy+_dz*_dz);

				var _rDist = 200 * ( _ds0.scale + _ds1.scale ) * .5;
				
				if( _rDist > _dist )
				{
					var diff = _rDist - _dist;
					var offsetX = ( diff * _dx / _dist ) * .5;
					var offsetY = ( diff * _dy / _dist ) * .5;
					var offsetZ = ( diff * _dz / _dist ) * .5;
					_ds0.x -= offsetX;
					_ds0.y -= offsetY;
					_ds0.z -= offsetZ;
					_ds1.x += offsetX;
					_ds1.y += offsetY;
					_ds1.z += offsetZ;
				}
			}
		}

		for ( var i = 0; i < len; i ++ )
		{
			var _ds0 = _sList[i];

			var _r = 100 * _ds0.scale;
			var _s = _planeSize * .5;

			_ds0.rotationX += _ds0.vx * Math.PI / 180 * .5;
			_ds0.rotationY += _ds0.vy * Math.PI / 180 * .5;
			//_ds0.rotationZ += _ds0.vz * Math.PI / 180 * .5;

			_ds0.view.position.x = min( _s - _r, max( _ds0.view.position.x, - _s + _r ) ); 
			_ds0.view.position.z = min( _s - _r, max( _ds0.view.position.z, - _s + _r ) ); 
			_ds0.view.position.y = _ds0.view.position.y < _r? _r : _ds0.view.position.y;
		}

		_renderer.render( _scene, _camera );

		TWEEN.update();
	}

	function max( a, b )
	{
		return a>=b?a:b;
	}

	function min( a, b )
	{
		return a<=b?a:b;
	}
}