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
		var _geometry = new THREE.BoxGeometry( 100, 100, 100, 1, 1, 1 );
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
		_mesh = new THREE.Mesh( _geometry, _material );

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
