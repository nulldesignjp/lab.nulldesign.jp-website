/*
	engine.js
*/

(function(){
	var scene,camera,focus,renderer,composer,lights;
	var _particle;

	init();
	setup();
	update();

	$( window ).on( 'keydown', function(e){
		var _keyCode = e.keyCode;
		console.log( e.keyCode );
	});

	$( window ).on( 'mousemove', function(e){
		composer.passes[1].uniforms.mouse.value.x = e.pageX;
		composer.passes[1].uniforms.mouse.value.y = window.innerHeight - e.pageY;
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
		camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 3200 );
		camera.position.set(0, 0, 1000);
		camera.lookAt( focus );

		renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
		renderer.setClearColor(0x000000);
		renderer.setSize( width, height );
		document.getElementById('container').appendChild(renderer.domElement);

		lights = [];
		lights[0] = new THREE.AmbientLight( 0x000000 );
		scene.add( lights[0] );
		lights[1] = new THREE.DirectionalLight( 0x999999, 1 );
		lights[1].position.set( 100, 100, 100 );
		scene.add( lights[1] );
		lights[2] = new THREE.PointLight( 0xCCCCCC, 1, 1000 );
		lights[2].position.set( 500, 500, 500 );
		scene.add( lights[2] );



		//	
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );
		
		//	最初の一つ目はこれを使わないといけないみたい
		var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
		_copySahder.renderToScreen = true;
		composer.addPass( _copySahder );




		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );

		window.onresize = resize;
	}
	function setup()
	{
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 1000; i++ )
		{
			var _x = ( Math.random() - .5 ) * 3000;
			var _y = ( Math.random() - .5 ) * 3000;
			var _z = ( Math.random() - .5 ) * 3000;
			var _v = new THREE.Vector3( _x, _y, _z );
			_geometry.vertices[i] = _v;
		}
		var _material = new THREE.PointsMaterial({
			size: 21,
			map: new THREE.TextureLoader().load('shared/img/circle0.png'),
			transparent: true,
			//depthTest: false,
			//depthWrite: false,
			blending: THREE.AdditiveBlending
		});
		var _mesh = new THREE.Points( _geometry, _material );
		scene.add( _mesh );

		_particle = _mesh;

		var _ldr = new THREE.TextureLoader();
		_ldr.load( 'shared/img/hisoka2.png', function(texture){
			var _w = texture.image.width;
			var _scale = 0.5;
			var _h = texture.image.height;
			var _geometry = new THREE.PlaneGeometry( _w * _scale, _h * _scale, 1, 1 );
			var _material = new THREE.MeshBasicMaterial({
				map: texture
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			scene.add( _mesh );

			_mesh.position.set( 0, 0, -100 );

		},function(xhr){},function(xhr){});


		//	MousePointGravsShader	
		//	手書きパターン
		var MousePointGravsShader =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
				"rand": {type: "f", value: Math.random() * 100 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"void main() {",
					"pos = position;",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"uniform float rand;",
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"float rands(vec2 co){",
					"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
				"}",
				"void main() {",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2(floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0,0) );",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2( mod( floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0, 1.0 ),0) );",
					"float def = rands( vec2( time, time * rand ) );",
					"float valY = floor( pos.y / def );",
					"vec2 offset = vec2( mod( rands( vec2( valY, time * 0.001 ) ), 1.0 ), 0. );",
					"vec4 img = texture2D( tDiffuse, mod( vUv + offset * 0.2, 1.0 ) );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

		var _effect = new THREE.ShaderPass( MousePointGravsShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		addPass( _effect );



				


		console.log( composer );
		console.log( composer.passes );

		return;

	}
	function update()
	{
		_animationKey = window.requestAnimationFrame( update );

		_particle.rotation.x += 0.01;
		_particle.rotation.y += 0.01;
		_particle.rotation.z += 0.01;
		composer.passes[1].uniforms.time.value += 1 / 60;

		_controls.update();
		//renderer.clear();
		camera.lookAt(focus);
		//renderer.render( scene, camera );
		composer.render();
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
		composer.setSize( width, height );
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

	function addPass( e )
	{
		var len = composer.passes.length;
		composer.passes.splice( len - 1, 0, e );
	}

})();