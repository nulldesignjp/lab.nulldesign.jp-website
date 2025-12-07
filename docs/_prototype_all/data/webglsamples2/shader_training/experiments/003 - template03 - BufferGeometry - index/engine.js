/*
	engine.js
*/

window.onload = function()
{

	//	default
	var renderer,scene,camera,focus,light0,light1,_controls;
	var _mesh;

	init();
	setup();
	render();

	//	Events
	window.onresize = resize;

	window.addEventListener( 'mousemove', function(e){
		_mesh.material.uniforms.mouse.value.x = e.pageX;
		_mesh.material.uniforms.mouse.value.y = e.pageY;
	})

	function init()
	{
		var width = window.innerWidth;
		var height = window.innerHeight;

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000);
		renderer.setSize( width, height );
		document.getElementById('container').appendChild(renderer.domElement);

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 800, 3200 );

		focus = new THREE.Vector3(0,0,0);

		camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3200 );
		camera.position.set(0, 0, 1000);
		camera.lookAt(focus);

		light0 = new THREE.AmbientLight( 0x333333 );
		scene.add( light0 );

		light1 = new THREE.DirectionalLight( 0xFFFFFF, 1.0 );
		light1.position.set(1000,1000,1000);
		scene.add( light1 );

		//	_controls
		_controls = new THREE.OrbitControls( camera, renderer.domElement );

	}

	function setup()
	{
		var len = 4;
		var _geometry = new THREE.BufferGeometry();
		var _position = new Float32Array( len * 3 );
		var _color = new Float32Array( len * 3 );
		var _size = new Float32Array( len );
		var _index = new Uint16Array([
				0,1,2,
				2,3,0
		]);

		for( var i = 0; i < len; i++ )
		{
			_position[ i * 3 + 0 ] = ( Math.random() - .5 ) * 500;
			_position[ i * 3 + 1 ] = ( Math.random() - .5 ) * 500;
			_position[ i * 3 + 2 ] = ( Math.random() - .5 ) * 500;
			_color[ i * 3 + 0 ] = Math.random();
			_color[ i * 3 + 1 ] = Math.random();
			_color[ i * 3 + 2 ] = Math.random();
			_size[ i ] = Math.random() * 16 + 1;
		}

		//	紐付ける
		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
		_geometry.addAttribute( 'color', new THREE.BufferAttribute( _color, 3 ) );
		_geometry.addAttribute( 'size', new THREE.BufferAttribute( _size, 1 ) );
		_geometry.addAttribute( 'index', new THREE.BufferAttribute( _index, 1 ) );

		var _material = new THREE.ShaderMaterial({
			uniforms: {
				time: { type: 'f', value: 0 },
				mouse: { type: 'v2', value: new THREE.Vector2( 0, 0 ) },
				resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
			},
			defines: {},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			side: THREE.DoubleSide
		});

		var _mode = Math.random() * 3;

		if( _mode < 1 )
		{
			_mesh = new THREE.Mesh( _geometry, _material );
		} else if( _mode < 2 )
		{
			if( Math.random() < .5 )
			{
				_mesh = new THREE.Line( _geometry, _material );
			} else {
				_mesh = new THREE.LineSegments( _geometry, _material );
			}

		} else {
			_mesh = new THREE.Points( _geometry, _material );
		}



		console.log( _mesh );

		scene.add( _mesh );
	}

	function render()
	{
		_mesh.material.uniforms.time.value = new Date().getTime();

		window.requestAnimationFrame(render);

		_mesh.geometry.rotateX(0.01);
		_mesh.geometry.rotateY(0.01);
		_mesh.geometry.rotateZ(0.01);
		_mesh.geometry.verticesNeedUpdate = true;

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

		//	update
		_mesh.material.uniforms.resolution.value.x = width;
		_mesh.material.uniforms.resolution.value.y = height;

	}
}
