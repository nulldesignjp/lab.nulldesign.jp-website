/*
	engine.js
*/
window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _time;
	var _book;
	var _pages = [];


	Start();
	//Update();

	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.y = 100;
		_camera.position.z = 200;

		_time = 0;


		//	even segements
		var _geometry = new THREE.PlaneGeometry( 3000, 3000, 1, 1 );
		var _material = new THREE.MeshBasicMaterial()

		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		var _mesh = new THREE.Reflector( _geometry, {
					clipBias: 0.0003,
					textureWidth: WIDTH * window.devicePixelRatio,
					textureHeight: HEIGHT * window.devicePixelRatio,
					color: 0x889999,
					recursion: 1
				} );
		_scene.add( _mesh );

		_mesh.rotation.x = - Math.PI * .5;



		// var _geometry = new THREE.PlaneGeometry( 3000, 3000, 1, 1 );
		// var _material = new THREE.MeshPhongMaterial()
		// var _mesh = new THREE.Mesh( _geometry, _material );
		// _scene.add( _mesh )
		// _mesh.position.y = 150;
		// _mesh.rotation.x = Math.PI * .5;


		var _geometry = new THREE.IcosahedronGeometry( 20, 0 );
		var _material = new THREE.MeshPhongMaterial({
			shading: THREE.FlatShading
		})


		_book = new THREE.Mesh( _geometry, _material );
		_scene.add( _book );

		_book.position.y = 100;
		_book.position.z = 50;

		var _pl = new THREE.PointLight( 0xFFFFFF, 1.0 );
		_book.add( _pl )


		var _geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
		var _material = new THREE.MeshPhongMaterial({
			map: new THREE.TextureLoader().load('jobs.jpg'),
			side: THREE.DoubleSide
		})

		var _mesh = new THREE.Mesh( _geometry, _material );
		_mesh.position.y = 50;
		_mesh.position.z = - 200;
		_mesh.rotation.y = Math.random() * Math.PI;
		_scene.add( _mesh );



	}



	function Update()
	{
		_book.rotation.x += 0.03;
		_book.rotation.y += 0.022;

		var _delta = _clock.getDelta();
		_time += _delta;
		_book.position.y = Math.sin( _time * 0.452 ) * 30 + 50;

		_book.position.x = Math.cos( _time ) * 50;
		_book.position.z = Math.sin( _time ) * 50;


	}




	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
