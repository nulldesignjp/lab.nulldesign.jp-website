/*
	offerdme_lp.js
*/

var offerdme = (function(){

	//	Props
	var _world, _time, _particle, _dom;
	


			init();
			setup();
			addEvents();
			update();
			_world.resize();

	function init()
	{
		//	WORLD TIME.
		_time = 0;

		//	NOISE
		_noise = new SimplexNoise();

		//	THREE.JS
		_world = new world( 'webglView' );
		_clock = new THREE.Clock();


		var _geometry = new THREE.Geometry();

		var _scale = 100.0;
		var _offset = {x:0,y:0};
		var _count = 0;

		var len = _lines.length;
		for( var i = 0; i < len; i++ )
		{
			var len2 = _lines[i].length;
			for( var j = 0; j < len2; j++ )
			{
				var _lineGommetry = new THREE.Geometry();
				var len3 = _lines[i][j].length;
				for( var k = 0; k < len3; k++ )
				{

					//	ave
					//	35.7853225973079, 139.70911858777367
					//	tokyo
					//	35.6813, 139.76704

					var _lat = _lines[i][j][k]['lat'] - 35.6813;
					var _lng = _lines[i][j][k]['lng'] - 139.76704;

					_lat *= _scale;
					_lng *= _scale;

					_geometry.vertices[_count] = new THREE.Vector3( _lng, 0, - _lat );
					_lineGommetry.vertices[k] = new THREE.Vector3( _lng, 0, - _lat )


					// _offset.x += _lat;
					// _offset.y += _lng;
					_count ++;
				}

				var _l = SplineCurve3D(_lineGommetry.vertices, 60);

				var _lineGommetry2 = new THREE.Geometry();
				var len3 = _l.length;
				for( var k = 0; k < len3; k++ )
				{
					_lineGommetry2.vertices[k] = new THREE.Vector3( _l[k].x, 0, _l[k].z)
				}



				var _lineMaterial = new THREE.LineBasicMaterial({
					transparent: true,
					opacity: 0.15
				});

				//	o-edo
				if( i == len-2)
				{
					_lineMaterial.color = new THREE.Color( 0.8, .2, .8 )
					_lineMaterial.opacity = 0.75
				}

				//	metro
				if( i == len-1)
				{
					_lineMaterial.color = new THREE.Color( 0.1, .6, .9 )
					_lineMaterial.opacity = 0.75
				}

				//	JR
				if( i == 0)
				{
					_lineMaterial.color = new THREE.Color( 0.1, .9, .3 )
					_lineMaterial.opacity = 0.25
				}

				var _line = new THREE.Line( _lineGommetry2, _lineMaterial );
				_world.add( _line );
			}
		}

		// _offset.x /= _count;
		// _offset.y /= _count;

		// console.log( _offset )


		var _material = new THREE.PointsMaterial({
			transparent: true,
			map: new THREE.TextureLoader().load('circle1.png'),
			size: 0.025,
			depthTest: false
		});
		_particle = new THREE.Points( _geometry, _material );
		_world.add(_particle)

		//	POSTPROCESSING
		CreatePostProcessing();

		//	coast line
		var _scale = 100;
		var _count = 0;
		var _geometry = new THREE.Geometry();
		var len = _coastLine.length;
		for( var i = 0; i < len; i++ )
		{
			var _lat = _coastLine[i][0][0] - 35.6813;
			var _lng = _coastLine[i][0][1] - 139.76704;

			_lat *= _scale;
			_lng *= _scale;

			_geometry.vertices[_count] = new THREE.Vector3( _lng, 0, - _lat );
			_count++;

			var len2 = _coastLine[i].length
			for( var j = 1; j < len2; j++ )
			{
				var _lat = _coastLine[i][j][0] - 35.6813;
				var _lng = _coastLine[i][j][1] - 139.76704;

				_lat *= _scale;
				_lng *= _scale;

				_geometry.vertices[_count] = new THREE.Vector3( _lng, 0, - _lat );
				_count++;
				_geometry.vertices[_count] = new THREE.Vector3( _lng, 0, - _lat );
				_count++;
			}


				var _lat = _coastLine[i][len2-1][0] - 35.6813;
				var _lng = _coastLine[i][len2-1][1] - 139.76704;

				_lat *= _scale;
				_lng *= _scale;
				_geometry.vertices[_count] = new THREE.Vector3( _lng, 0, - _lat );
				_count++;

		}
		var _material = new THREE.LineBasicMaterial();
		var _li = new THREE.LineSegments( _geometry, _material );
		_world.add( _li )


		//	dot matrix
		var _gridField = new THREE.GridHelper( 3000, 300 );
		_gridField.material.transparent = true;
		_gridField.material.opacity = 0.1;
		_world.add( _gridField );

		//	pseud field
		var _geometry = new THREE.PlaneGeometry( 3000, 3000, 30, 30 );
		_geometry.rotateX( - Math.PI * 0.5 );
		for( var i = 0; i < _geometry.vertices.length; i++ )
		{
			_geometry.vertices[i].y = ( Math.random() - 0.5 ) * 1.0 - 1.0;
		}
		var _material = new THREE.MeshPhongMaterial({
			color: 0x181818,
			flatShading: true,
			shininess: 0

		});
		var _mesh = new THREE.Mesh( _geometry, _material );
		_world.add( _mesh )

	}

	function setup()
	{
	}

	function update()
	{
		_world.render( 0.0 );
		_update(0);
	}

	function _update( _stepTime )
	{
		window.requestAnimationFrame( _update );

		//	時間の更新
		var _delta = _clock.getDelta();
		_time += _delta;


		// var __time = Math.sin(_time * 0.36) * 0.05;
		// _world.camera.up.set(Math.sin(__time), Math.cos(__time), 0);

		//	dolly zoom
		//var _dist = 100;

		// _world.camera.fov = Math.sin( _time * .2 ) * 60 + 90

		// var _dollyDist = 20;
		// var _distance = _dollyDist / ( 2 * Math.tan( 0.5 * _world.camera.fov / 180.0 * Math.PI ) );
		// var _dir = _world.camera.position.normalize();
		// _world.camera.position.x = _dir.x * _distance;
		// _world.camera.position.y = _dir.y * _distance;
		// _world.camera.position.z = _dir.z * _distance;


		_world.camera.updateProjectionMatrix ();


	}

	function addEvents()
	{
	}


	function CreatePostProcessing()
	{

		var MonoShader = {
			uniforms: {
				"time": { type:"t", value: 0.0 },
				"tDiffuse": { type:"t", value: null },
				"fRed": { type:"f", value: 1.0 },
				"fGreen": { type:"f", value: 1.0 },
				"fBlue": { type:"f", value: 1.0 },
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join( "\n" ),

			fragmentShader: [
					"uniform float time;",
					"uniform sampler2D tDiffuse;",
					"uniform float fRed;",
					"uniform float fGreen;",
					"uniform float fBlue;",
					"varying vec2 vUv;",
					"const float redScale   = 0.298912;",
					"const float greenScale = 0.586611;",
					"const float blueScale  = 0.114478;",
					"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
				"void main() {",
					"vec4 smpColor = texture2D(tDiffuse, vUv);",
					"float grayColor = dot(smpColor.rgb, monochromeScale);",
					"smpColor *= vec4( fRed, fGreen, fBlue, 1.0 );",
					"gl_FragColor = smpColor;",
				"}"

			].join( "\n" )
		};

		var _shaderPass = new THREE.ShaderPass( MonoShader );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		_shaderPass.name = "Mono";
		//_world.addPass( _shaderPass );

		//	resolution, strength, radius, threshold

		var _shaderPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 0.96, 0.05, 0.86 );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		_shaderPass.name = "UnrealBloom";
		_world.addPass( _shaderPass );
	}

	function getRandom( e )
	{
		return ( Math.random() - 0.5 ) * e;
	}

	function easeInOutExpo(t,b,c,d)
	{
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
		return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
	}

	function easeInOutSine(t,b,c,d)
	{
		return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
	}

	

	
})();
