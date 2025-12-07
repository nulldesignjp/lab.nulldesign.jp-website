/*
	particle study
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	var resolution = {x:_width, y:_height};
	var mouse = {x:resolution.x*.5, y:resolution.y*.5};

	var uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		mouse: { type: "v2", value: new THREE.Vector2() }
	};
	uniforms.time.value = 0.0;
	uniforms.resolution.value.x = resolution.x;
	uniforms.resolution.value.y = resolution.y;
	uniforms.mouse.value.x = mouse.x;
	uniforms.mouse.value.y = mouse.y;

	var attributes = {
		size: {	type: 'f', value: [] },
		//pos:{ type: 'f', value: []	},
		customColor: { type: 'c', value: [] }
	};

	var composer;

	//	
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 1000, 1800 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 1800 );
	camera.position.set( 0, 0, 1000 );

	var focus = new THREE.Vector3();
	focus.set( 0, 0, 0 );
	camera.lookAt( focus );

	var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 500 );
	_light.position.set( 200, 200, 200 );
	scene.add( _light );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color, 1 );
	renderer.setSize( _width, _height );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	var world = new THREE.Group();
	scene.add( world );

	//
	document.getElementById('container').appendChild( renderer.domElement );

	//	
	postprocessing();
	addEvents();
	render();

	function render()
	{

		camera.lookAt( focus );
		renderer.render( scene, camera );

		world.rotation.x += 0.002;
		world.rotation.y += 0.002;

		// for( var i = 0; i < attributes.size.value.length; i++ ) {
		// 	attributes.size.value[ i ] = 14.0 + 6.0 * Math.sin( 0.1 * i + time/10 );
		// 	//attributes.customColor.value[i] = new THREE.Color( Math.random(),Math.random(),Math.random());
		// }
		// attributes.size.needsUpdate = true;
		// //attributes.customColor.needsUpdate = true;

		//	composer.render();

		requestAnimationFrame(render);

		uniforms.time.value += 0.05;
	}

	var _geometry = new THREE.Geometry();
	var _size = 200;
	for( var i = 0; i < 100000; i++ )
	{
		var _position = new THREE.Vector3( rnd()*_size,rnd()*_size,rnd()*_size );

		var _rad0 = Math.random() * Math.PI * 2.0;
		var _rad1 = Math.random() * Math.PI * 2.0;
		//var _pow = ( 1 - Math.random() * Math.random() ) * 32.0;

		var _pow = 400.0;
		var _baseX = Math.floor( Math.random() * 7-3 );
		var _baseY = Math.floor( Math.random() * 7-3 );
		var _baseZ = Math.floor( Math.random() * 7-3 );

		_position.y = Math.sin( _rad0 ) * _pow;
		var _r = Math.cos( _rad0 ) * _pow;
		_position.x = Math.cos( _rad1 ) * _r;
		_position.z = Math.sin( _rad1 ) * _r;

		_geometry.vertices[i] = _position;

		//	attr
		attributes.size.value[i] = 1.0;
		attributes.customColor.value[i] = new THREE.Color( Math.random(),Math.random(),Math.random());
	}



	//var _material = new THREE.MeshLambertMaterial({shading:THREE.FlatShading});

	uniforms.color = { type: "c", value: new THREE.Color(1.0,0.6,0.2) };
	uniforms.texture = { type: "t", value: THREE.ImageUtils.loadTexture( "spark1.png" ) };
	uniforms.scale = { type: "f", value: 1.0 }
	uniforms.size = { type: "f", value: 10.0 }

	var _material = new THREE.ShaderMaterial( {
		uniforms:       uniforms,
		attributes:     attributes,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		blending:       THREE.AdditiveBlending,
		depthTest:      false,
		transparent:    true
	});

	var _pc = new THREE.PointCloud( _geometry, _material );
	world.add( _pc );

	function rnd()
	{
		return Math.random()-.5;
	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			camera.aspect = _width / _height;
			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );
			resolution = {x:_width,y:_height};
			uniforms.resolution.value.x = _width;
			uniforms.resolution.value.y = _width;
		}, false );
		window.addEventListener( 'mousemove', function(e){
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			uniforms.mouse.value.x = mouse.x;
			uniforms.mouse.value.y = window.innerHeight - mouse.y;
			e.preventDefault();
		}, false );
		window.addEventListener( 'touchmove', function(e){
			mouse.x = e.touches[0].pageX;
			mouse.y = e.touches[0].pageY;
			uniforms.mouse.value.x = mouse.x;
			uniforms.mouse.value.y = window.innerHeight - mouse.y;
			e.preventDefault();
		}, false );
	}

	// postprocessing
	function postprocessing()
	{
		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		glitchPass = new THREE.GlitchPass( 2 );
		glitchPass.renderToScreen = true;
		composer.addPass( glitchPass );
	}

})();