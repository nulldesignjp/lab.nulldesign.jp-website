/*
	engine.js
*/

(function(){

	var stats = new Stats();
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	//document.body.appendChild( stats.dom );

	var scene,camera,focus,renderer,composer;
	var _particle,_mesh;

	var mouse = {x:0,y:0}

	var NUM = 256;

	init();
	setup();
	update();

	window.addEventListener( 'mousemove', function(e){
		mouse.x = e.pageX;
		mouse.y = e.pageY;
	});

	/*	-----------------------------------------------------------------------
		

	*/


	function init()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 1600, 3200 );

		focus = new THREE.Vector3();

		//	camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 16000 );
		camera = new THREE.PerspectiveCamera( 45, width / height, 0.1, 3200 );
		camera.position.set(0, 0, 100);
		camera.lookAt( focus );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setSize( width, height );
		document.getElementById('container').appendChild(renderer.domElement);


		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		composer = new THREE.EffectComposer( renderer );

		var renderPass = new THREE.RenderPass( scene, camera );
		renderPass.enabled = true;
		renderPass.renderToScreen = false;
		composer.addPass( renderPass );

		var _shaderPass = new THREE.ShaderPass( THREE.HorizontalTiltShiftShader );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		composer.addPass( _shaderPass );

		_shaderPass.uniforms.h.value = 1 / window.innerWidth * 8.0;
		_shaderPass.uniforms.r.value = 0.5;

		var _shaderPass = new THREE.ShaderPass( THREE.VerticalTiltShiftShader );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		composer.addPass( _shaderPass );

		_shaderPass.uniforms.v.value = 1 / window.innerHeight * 8.0;
		_shaderPass.uniforms.r.value = 0.5;

		var MonoShader = {
			uniforms: {
				"tDiffuse": { type:"t", value: null }
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join( "\n" ),

			fragmentShader: [
					"uniform sampler2D tDiffuse;",
					"varying vec2 vUv;",
					"const float redScale   = 0.298912;",
					"const float greenScale = 0.586611;",
					"const float blueScale  = 0.114478;",
					"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
				"void main() {",
					"vec4 smpColor = texture2D(tDiffuse, vUv);",
					"float grayColor = dot(smpColor.rgb, monochromeScale);",
					"smpColor = vec4(vec3(grayColor), 1.0);",
					"gl_FragColor = smpColor;",
				"}"

			].join( "\n" )

		};
		var _shaderPass = new THREE.ShaderPass( MonoShader );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		composer.addPass( _shaderPass );

		var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
		_copySahder.renderToScreen = true;
		composer.addPass( _copySahder );

		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );
		_controls.autoRotate = false;
		_controls.autoRotateSpeed = 0.025;
		_controls.enableDamping = true;
		_controls.dampingFactor = 0.15;
		_controls.enableZoom = false;
		_controls.enabled = true;
		_controls.target = focus;
		// _controls.minDistance = 480;
		// _controls.maxDistance = 960;
		// _controls.minPolarAngle = 0; // radians
		// _controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians

		var _ldr = new THREE.TextureLoader();
		_ldr.load('1024.png', function(_texture){

			var _width = _texture.image.width;
			var _height = _texture.image.height;
			var PARTICLES = _width * _height;
			var positions = new Float32Array( PARTICLES * 3 );
			var vectors = new Float32Array( PARTICLES * 3 );
			var uvs = new Float32Array( PARTICLES * 2 );
			var delay = new Float32Array( PARTICLES * 1 );
			var _geometry = new THREE.BufferGeometry();
			var len = PARTICLES;
			var _speed = 16.0;
			for( var i = 0; i < len; i++ )
			{
				positions[ i * 3 + 0 ] = i % _width - _width * 0.5;
				positions[ i * 3 + 1 ] = Math.floor( i / _width ) - _height * 0.5;
				positions[ i * 3 + 2 ] = 0;

				var _rad0 = Math.random() * Math.PI * 2.0 - Math.PI;
				var _rad1 = Math.random() * Math.PI * 2.0 - Math.PI;
				var _r = ( 1.0 - Math.random() * Math.random() ) * _speed;
				vectors[ i * 3 + 0 ] = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				vectors[ i * 3 + 1 ] = Math.sin( _rad0 ) * _r;
				vectors[ i * 3 + 2 ] = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

				uvs[ i * 2 + 0 ] = ( i % _width )/ ( _width - 1 );
				uvs[ i * 2 + 1 ] = Math.floor( i / _width ) / ( _width - 1 );

				delay[ i ] = ( ( i % _width ) + Math.floor( i / _width ) ) / len * 10000.0;

				positions[ i * 3 + 0 ] *= 0.05;
				positions[ i * 3 + 1 ] *= 0.05;
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			_geometry.addAttribute( 'velocity', new THREE.BufferAttribute( vectors, 3 ) );
			_geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
			_geometry.addAttribute( 'delay', new THREE.BufferAttribute( delay, 1 ) );

			var yMaterial = new THREE.ShaderMaterial({
				uniforms: {
					time: { value: 0.0 },
					size: { value: 1.0 },
					texture: { value: _texture },
					circle: { value: new THREE.TextureLoader().load('circle1.png')}
				},
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				transparent: true,
				depthTest: false,
				depthWrite: false,
				//blending: THREE.AdditiveBlending
			});

			_mesh = new THREE.Points( _geometry, yMaterial );
			//_mesh.matrixAutoUpdate = false;
			_mesh.updateMatrix();
			scene.add( _mesh );

			console.log( 'PARTICLES: ', PARTICLES );

		})

		window.onresize = resize;
	}
	function setup()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

	}
	function update()
	{
		stats.begin();
		_animationKey = window.requestAnimationFrame( update );
		_controls.update();

		if( _mesh ){
			_mesh.material.uniforms.time.value = Math.sin( mouse.x * 0.2 / window.innerWidth * Math.PI * 0.5 ) * 100;
		}

		if( window.TouchEvent )
		{
			_mesh.material.uniforms.time.value = Math.sin( new Date().getTime() * 0.0004 ) * 16 + 16;
		}


		camera.lookAt(focus);
		//renderer.render( scene, camera );
			composer.render( 0.1 );
		stats.end();
	}
	function play()
	{
		update();
	}
	function stop()
	{
		window.cancelAnimationFrame( _animationKey );
	}

	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
			renderer.setSize( width, height );
		renderer.setSize( width, height );
		if( camera.aspect )
		{
			camera.aspect = width / height;
		} else {
			camera.left = - width * 0.5;
			camera.right = width * 0.5;
			camera.bottom = - height * 0.5;
			camera.top = height * 0.5;
		}
		
		camera.updateProjectionMatrix();
	}
	function getWorldToScreen2D( _mesh )
	{
		var vector = new THREE.Vector3();
		var widthHalf = 0.5 * renderer.context.canvas.width;
		var heightHalf = 0.5 * renderer.context.canvas.height;
		_mesh.updateMatrixWorld();
		vector.setFromMatrixPosition(_mesh.matrixWorld);
		vector.project(this.camera);
		vector.x = ( vector.x * widthHalf ) + widthHalf;
		vector.y = - ( vector.y * heightHalf ) + heightHalf;
		return { 
		    x: vector.x,
		    y: vector.y
		};
	}
	function epx( camera )
	{
		var h = window.innerHeight;
		var distance = -( h / 2 ) / Math.tan( ( camera.fov * Math.PI / 180 ) / 2 );
		return distance;
	}


})();