/*
	particle study
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	var time = 0;
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

	world.rotation.x = Math.PI;

	function render()
	{
		camera.lookAt( focus );
		renderer.render( scene, camera );
		time ++;

		//world.rotation.x += 0.002;
		world.rotation.y += 0.002;

		// for( var i = 0; i < attributes.size.value.length; i++ ) {
		// 	attributes.size.value[ i ] = 14.0 + 6.0 * Math.sin( 0.1 * i + time/10 );
		// 	//attributes.customColor.value[i] = new THREE.Color( Math.random(),Math.random(),Math.random());
		// }
		// attributes.size.needsUpdate = true;
		// //attributes.customColor.needsUpdate = true;


		//composer.render();

		requestAnimationFrame(render);

		uniforms.time.value += 0.05;
	}


	var _img = new Image();
	_img.onload = _onload;
	_img.src = 'tumblr_luwg1nPQhu1qlq59vo1_500.jpg';

	function _onload()
	{
		var _canvas = document.createElement('canvas');
		_canvas.width = Math.floor( this.width * 0.5 );
		_canvas.height = Math.floor( this.height * 0.5 );
		var _ctx = _canvas.getContext('2d');

		_ctx.drawImage( this, 0, 0, this.width, this.height, 0, 0, _canvas.width, _canvas.height );
		var imgd = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
		var _pix = imgd.data;

		var _geometry = new THREE.Geometry();
		var _len = _pix.length;
		for( var i = 0; i < _len; i+= 4 )
		{
		    var _r = _pix[i + 0 ];
		    var _g = _pix[i + 1 ];
		    var _b = _pix[i + 2 ];
		    var _a = _pix[i + 3 ];

		    _r /= 255;
		    _g /= 255;
		    _b /= 255;

			var _position = new THREE.Vector3( 0, 0, (Math.max(_r,_g,_b)-Math.min(_r,_g,_b)) * 160.0 - 80.0 );

			_position.x = i/4 % _canvas.width - Math.floor( _canvas.width * 0.5 );
			_position.y = Math.floor( i/4 / _canvas.width ) - Math.floor( _canvas.height * 0.5 );
			_geometry.vertices[i/4] = _position;

			//	attr
			attributes.size.value[i/4] = 1.0;
			attributes.customColor.value[i/4] = new THREE.Color( _r, _g, _b );
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
	}

	

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

		var effect = new THREE.ShaderPass( THREE.DotScreenShader );
		effect.uniforms[ 'scale' ].value = 4;
		composer.addPass( effect );

		var effect = new THREE.ShaderPass( THREE.RGBShiftShader );
		effect.uniforms[ 'amount' ].value = 0.0015;
		effect.renderToScreen = true;
		composer.addPass( effect );

		var effect = new THREE.ShaderPass( THREE.HorizontalBlurShader );
		//effect.uniforms[ 'amount' ].value = 0.0015;
		//effect.renderToScreen = true;
		composer.addPass( effect );


	}

})();