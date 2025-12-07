/*
	scene01.js
	http://qiita.com/hideyukisaito/items/54c346126a6fc063a0de
*/

var _fft = 1.0;

function gotMessageToJS( _message )
{
	_fft = _message;
}

window.onload = function()
{

	//	default
	var renderer,scene,camera,focus,light0,light1,_controls;
	var _particle0, _particle1;

	init();
	setup();
	loop();

	window.onresize = resize;

	function init()
	{

		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
		renderer.setClearColor(0x060009);
		renderer.setSize( width, height );
		//renderer.autoClear = false;
		document.getElementById('container').appendChild(renderer.domElement);

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( renderer.getClearColor(), 800, 1600 );


		focus = new THREE.Vector3(0,0,0);

		camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1600 );
		camera.position.set(0, 0, 1000);
		camera.lookAt(focus);

		light0 = new THREE.AmbientLight( 0x333333 );
		scene.add( light0 );

		light1 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
		light1.position.set(1000,1000,1000);
		scene.add( light1 );

		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );
		_controls.autoRotate = true;
		_controls.autoRotateSpeed = 1.0;
		_controls.enableDamping = true;
		_controls.dampingFactor = 0.15;
		_controls.enableZoom = false;
		_controls.enabled = true;
		_controls.target = focus;
		// _controls.minDistance = 480;
		// _controls.maxDistance = 960;
		// _controls.minPolarAngle = 0; // radians
		// _controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians
	}

	function setup()
	{
		var len = 30000;
		var _geometry = new THREE.BufferGeometry();
		var _position = new Float32Array( len * 3 );
		var _size = new Float32Array( len );
		for( var i = 0; i < len; i++ )
		{
			_position[ i * 3 + 0 ] = ( Math.random() - .5 ) * 2000;
			_position[ i * 3 + 1 ] = ( Math.random() - .5 ) * 2000;
			_position[ i * 3 + 2 ] = ( Math.random() - .5 ) * 2000;

			_size[ i ] = 5.0;
		}
		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
		_geometry.addAttribute( 'size', new THREE.BufferAttribute( _size, 1 ) );

		camera.fov = 135;
		camera.far = 1200;
		camera.near = 800;
		camera.updateProjectionMatrix();

		var _material = new THREE.ShaderMaterial({
			uniforms: {
				time: { type: 'f', value: 0.0 },
				mouse: { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
				resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				texture: { type: 't', value: new THREE.TextureLoader().load('img/circle1.png')	},
				camera: { type: 'v3', value: camera.position },
				near: { type: 'f', value: 900 },
				far: { type: 'f', value: 1000 }
			},
			defines: {},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});
		_particle0 = new THREE.Points( _geometry, _material );
		scene.add( _particle0 );

	}

	function loop()
	{
		_particle0.material.uniforms.time.value += 0.005;

		// _particle0.rotation.x += 0.000125;
		// _particle0.rotation.y += 0.000125;
		// _particle0.rotation.z += 0.000125;

		_particle0.geometry.rotateX( 0.001 );
		_particle0.geometry.rotateY( 0.001 );
		_particle0.geometry.rotateZ( 0.001 );

		_controls.update();

		window.requestAnimationFrame(loop);

		camera.lookAt(focus);
		renderer.render( scene, camera );
	}

	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
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
}
