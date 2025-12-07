/*
	engine.js
*/



function backgroundImage()
{
	var _renderer,_camera,_scene,_plane,_clock;
	var _time, _mouse, _resolution, _scroll;

	//	execute
	start();
	update();

	//emthod
	function start()
	{
		//	three.js
		var _width  = window.innerWidth;
		var _height = window.innerHeight;
		_scene = new THREE.Scene();
		_camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 1000 );
		_camera.position.set( 0, 0, 1 );
		_renderer = new THREE.WebGLRenderer({ antialias: true });
		_renderer.setSize( _width, _height  );
		_renderer.setClearColor( 0xFFFFFF );

		//	time
		_clock = new THREE.Clock();

		//	uniforms
		_time = 0.0;
		_mouse = new THREE.Vector2(0,0);
		_resolution = new THREE.Vector2( _width, _height );
		_scroll = new THREE.Vector2();

		// mesh object
		var _geometry = new THREE.PlaneGeometry(1,1,1,1);
		var _material = new THREE.ShaderMaterial({
			uniforms: {
				time: { value: _time },
				mouse: { value: _mouse },
				resolution: {	value: _resolution },
				scroll: {	value: _scroll },
				randomSeed: { value: Math.random() * 10000 },
				tex: {	value: new THREE.TextureLoader().load('l0.png') }
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			//blending: THREE.AdditiveBlending
		});
		_plane = new THREE.Mesh( _geometry, _material );
		_plane.scale.x = _width;
		_plane.scale.y = _height;
		_scene.add( _plane );

		//	events
		document.body.appendChild(_renderer.domElement);
		window.onresize = resize;
		window.addEventListener( 'mousemove', function(e){
			_mouse.x = e.clientX;
			_mouse.y = e.clientY;

			_plane.material.uniforms.mouse.value = _mouse;

		});
		window.onscroll = onscroll;
	}

	function update()
	{
		_time += _clock.getDelta();
			_plane.material.uniforms.time.value = _time;
		_renderer.render( _scene, _camera );
		window.requestAnimationFrame( update );
	}

	function resize()
	{
		var _width  = window.innerWidth;
		var _height = window.innerHeight;
		_renderer.setSize( _width, _height );
		_camera.left = - _width * 0.5;
		_camera.right = _width * 0.5;
		_camera.bottom = - _height * 0.5;
		_camera.top = _height * 0.5;
		_camera.updateProjectionMatrix();

		_plane.scale.x = _width;
		_plane.scale.y = _height;

		_resolution.x = _width;
		_resolution.y = _height;

		_plane.material.uniforms.resolution.value = _resolution;
	}

	function onscroll(e)
	{
		_scroll.y =
			document.documentElement.scrollTop || // IE、Firefox、Opera
			document.body.scrollTop;              // Chrome、Safari
		_plane.material.uniforms.scroll.value = _scroll;
	}
}


window.onload = backgroundImage;

