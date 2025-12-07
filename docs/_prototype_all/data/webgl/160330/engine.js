/*
	engine.js
*/
(function(){

	var NUM = 128;
	var NUM = 512;
	var PARTICLES = NUM * NUM;
	var BOUNDS = 500;
	var BOUNDS_HALF = BOUNDS/2;

	var _positionShader;
	var _velocityShader;
	var _positionUniforms;
	var _velocityUniforms;
	var _currentVelocity;
	var _currentPosition;
	var _mesh,_points;
	var flipflop = true;
	var rtPosition1, rtPosition2, rtVelocity1, rtVelocity2;
	var _clock = new THREE.Clock( true );
	_clock.start();

	//	基本設定
	var width  = window.innerWidth;
	var height = window.innerHeight;
	var _scene = new THREE.Scene();
	var _camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3200 );
	_camera.position.set( 0, 0, 1000 );
	var _focus = new THREE.Vector3(0,0,0);
	var _renderer = new THREE.WebGLRenderer();
	_renderer.setSize( width, height  );
	_renderer.setPixelRatio( window.devicePixelRatio );
	_renderer.setClearColor( 0x000000 );

	document.getElementById( 'webglView' ).appendChild(_renderer.domElement);

	var _controls = new THREE.OrbitControls( _camera, _renderer.domElement );
	_controls.autoRotate = true;
	_controls.autoRotateSpeed = - 1.0;
	_controls.enableDamping = true;
	_controls.dampingFactor = 0.15;
	_controls.enableZoom = false;
	_controls.enabled = true;
	_controls.target = _focus;
	// this.controls.minDistance = 480;
	// this.controls.maxDistance = 960;
	// this.controls.minPolarAngle = 0; // radians
	// this.controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians

	//
	var _bg = new THREE.BoxGeometry(100,100,100,1,1,1);
	var _ma = new THREE.MeshBasicMaterial({wireframe:true});
	var _box = new THREE.Mesh( _bg, _ma );
	_scene.add( _box )

	//	GPGPU SETTING
	var _scene2 = new THREE.Scene();
	var _camera2 = new THREE.Camera();
	_camera2.position.z = 1;


	//	RESIZE
	window.onresize = function()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		_renderer.setSize( width, height );
		if( _camera.aspect )
		{
			_camera.aspect = width / height;
		} else {
			_camera.left = - width * 0.5;
			_camera.right = width * 0.5;
			_camera.bottom = - height * 0.5;
			_camera.top = height * 0.5;
		}
		
		_camera.updateProjectionMatrix();
	}



	//	PARTICLES
	var _particleUniforms = {
		color: { type: "c", value: new THREE.Color( 0xff2200 ) },
		texturePosition: { type: "t", value: null },
		textureVelocity: { type: "t", value: null },
		time: { type: "f", value: 1.0 },
		delta: { type: "f", value: 0.0 },

		circle: {type:'t',value: new THREE.TextureLoader().load('circle1.png')}
	};


		// //	Texture
		// var _loader = new THREE.TextureLoader();
		// //	_loader.load(	_filePath, success, progress, error );
		// var _onSuccess = function(texture){	_nextStep( texture );	}
		// var _onProgress = function(e){}
		// var _onError = function(e){}
		// _loader.load('me2016.png', _onSuccess, _onProgress, _onError );

	var _position = new Float32Array( PARTICLES * 3 );
	var _reference = new Float32Array( PARTICLES * 2 );
	for( var i = 0; i < PARTICLES; i++ )
	{
		_position[ i * 3 + 0 ] = 0;
		_position[ i * 3 + 1 ] = 0;
		_position[ i * 3 + 2 ] = 0;

		_reference[ i * 2 + 0 ] = (i % NUM) / NUM;
		_reference[ i * 2 + 1 ] = Math.floor( i / NUM ) / NUM;
	}
	var _geometry = new THREE.BufferGeometry();
	_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
	_geometry.addAttribute( 'reference', new THREE.BufferAttribute( _reference, 2 ) );

	var _material = new THREE.ShaderMaterial({
		uniforms: _particleUniforms,
		vertexShader: document.getElementById('vertexPointsShader').textContent,
		fragmentShader: document.getElementById('fragmentPointsShader').textContent,
		transparent: true,
		depthTest: false,
		depthWrite: false,
		blending: THREE.AdditiveBlending
	});

	_points = new THREE.Points( _geometry, _material );
	_scene.add( _points );




	//	passThruShader
	var uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2( NUM, NUM ) },
		texture: { type: "t", value: null }
	};

	var passThruShader = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
	} );

	_mesh = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), passThruShader );
	_scene2.add( _mesh );





//
	_positionShader = new THREE.ShaderMaterial( {
		uniforms: {
			time: { type: "f", value: 1.0 },
			delta: { type: "f", value: 0.0 },
			resolution: { type: "v2", value: new THREE.Vector2( NUM, NUM ) },
			texturePosition: { type: "t", value: null },
			textureVelocity: { type: "t", value: null },
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderPosition' ).textContent
	} );

	_velocityShader = new THREE.ShaderMaterial( {

		uniforms: {
			time: { type: "f", value: 1.0 },
			delta: { type: "f", value: 0.0 },
			resolution: { type: "v2", value: new THREE.Vector2( NUM, NUM ) },
			texturePosition: { type: "t", value: null },
			textureVelocity: { type: "t", value: null },
			testing: { type: "f", value: 1.0 },
			seperationDistance: { type: "f", value: 1.0 },
			alignmentDistance: { type: "f", value: 1.0 },
			cohesionDistance: { type: "f", value: 1.0 },
			freedomFactor: { type: "f", value: 1.0 },
			predator: { type: "v3", value: new THREE.Vector3() },

			force: {type:'t', value: new THREE.TextureLoader().load('perlin-512.png')}
		},
		defines: {
			WIDTH: NUM.toFixed( 2 )
		},
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShaderVelocity' ).textContent
	} );

	//
	_velocityShader.uniforms.seperationDistance.value = 10;
	_velocityShader.uniforms.alignmentDistance.value = 20;

	_velocityUniforms = _velocityShader.uniforms;



	//	

	//	Position vec4, Velocity vec3
	var dtPosition = generatePositionTexture();
	var dtVelocity = generateVelocityTexture();

	rtPosition1 = getRenderTarget( THREE.RGBAFormat );
	rtPosition2 = rtPosition1.clone();
	rtVelocity1 = getRenderTarget( THREE.RGBFormat );
	rtVelocity2 = rtVelocity1.clone();

	//	初回だけ書き込む
	//	renderTexture( input, output )
	renderTexture( dtPosition, rtPosition1 );
	renderTexture( rtPosition1, rtPosition2 );

	renderTexture( dtVelocity, rtVelocity1 );
	renderTexture( rtVelocity1, rtVelocity2 );

	_velocityUniforms.testing.value = 10;

	animate();

	var isView = false;
	window.addEventListener( 'click', function(){
		isView = !isView;
		// /_mesh.material = _velocityShader;
		//_mesh.material = _positionShader;
	})
	function animate()
	{

		var delta = _clock.getDelta();
		var _duration = _clock.elapsedTime;

		_particleUniforms.time.value = _duration;
		_particleUniforms.delta.value = delta;

		if ( flipflop ) {
			//	renderPosition/renderVelocity( position, velocity, output, delta )
			renderVelocity( rtPosition1, rtVelocity1, rtVelocity2, delta );
			renderPosition( rtPosition1, rtVelocity2, rtPosition2, delta );

		} else {

			renderVelocity( rtPosition2, rtVelocity2, rtVelocity1, delta );
			renderPosition( rtPosition2, rtVelocity1, rtPosition1, delta );

		}

		flipflop = ! flipflop;

		//	render
		_controls.update();
		_camera.lookAt( _focus );
		_renderer.render( _scene, _camera );

		if( isView ){
			_mesh.material = _velocityShader;
			_renderer.render( _scene2, _camera2 );
		}
		//

		//
		window.requestAnimationFrame( animate );
	}

	function getRenderTarget( type ) {

		var renderTarget = new THREE.WebGLRenderTarget( NUM, NUM, {
			wrapS: THREE.RepeatWrapping,
			wrapT: THREE.RepeatWrapping,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter,
			format: type,
			type: THREE.FloatType,
			stencilBuffer: false
		} );

		return renderTarget;

	}

	function generatePositionTexture() {

		var a = new Float32Array( PARTICLES * 4 );

		for ( var k = 0, kl = a.length; k < kl; k += 4 ) {

			var _rad0 = Math.random() * Math.PI * 2.0;
			var _rad1 = Math.random() * Math.PI * 2.0;

			var x = - Math.cos( _rad1 ) * Math.cos( _rad0 ) * BOUNDS_HALF;
			var y = Math.sin( _rad0 ) * BOUNDS_HALF;
			var z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * BOUNDS_HALF;

			a[ k + 0 ] = x;
			a[ k + 1 ] = y;
			a[ k + 2 ] = z;
			a[ k + 3 ] = 1;

		}

		var texture = new THREE.DataTexture( a, NUM, NUM, THREE.RGBAFormat, THREE.FloatType );
		texture.needsUpdate = true;

		return texture;

	}

	function generateVelocityTexture() {

		var a = new Float32Array( PARTICLES * 3 );
		var scale = 1.0;

		for ( var k = 0, kl = a.length; k < kl; k += 3 ) {

			var x = Math.random() - 0.5;
			var y = Math.random() - 0.5;
			var z = Math.random() - 0.5;

			a[ k + 0 ] = x * scale;
			a[ k + 1 ] = y * scale;
			a[ k + 2 ] = z * scale;
		}

		var texture = new THREE.DataTexture( a, NUM, NUM, THREE.RGBFormat, THREE.FloatType );
		texture.needsUpdate = true;

		return texture;
	}

	function renderTexture( input, output )
	{
		_mesh.material = passThruShader;
		uniforms.texture.value = input;
		_renderer.render( _scene2, _camera2, output );
	};

	function renderPosition( position, velocity, output, delta ) {

		_mesh.material = _positionShader;
		_positionShader.uniforms.texturePosition.value = position;
		_positionShader.uniforms.textureVelocity.value = velocity;
		_positionShader.uniforms.time.value = performance.now() / 1000;
		_positionShader.uniforms.delta.value = delta;
		_renderer.render( _scene2, _camera2, output );
		_currentPosition = output;

	};

	function renderVelocity( position, velocity, output, delta ) {

		_mesh.material = _velocityShader;
		_velocityShader.uniforms.texturePosition.value = position;
		_velocityShader.uniforms.textureVelocity.value = velocity;
		_velocityShader.uniforms.time.value = performance.now() / 1000;
		_velocityShader.uniforms.delta.value = delta;
		_renderer.render( _scene2, _camera2, output );
		_currentVelocity = output;

	};


})();
