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

		_time = 0.;


		//	even segements
		var _geometry = new THREE.PlaneGeometry( 1000, 1000, 1, 1 );
		var _material = new THREE.MeshStandardMaterial({
			color: 0xCCCCCC
		});

		var WIDTH = window.innerWidth;
		var HEIGHT = window.innerHeight;
		var _mesh = new THREE.Reflector( _geometry, {
					clipBias: 0.0003,
					textureWidth: WIDTH * window.devicePixelRatio,
					textureHeight: HEIGHT * window.devicePixelRatio,
					color: 0x889999,
					recursion: 1
				} );
		var _mesh = new THREE.Mesh( _geometry, _material );
		_mesh.receiveShadow = true; // これ!
		_scene.add( _mesh );

		_mesh.rotation.x = - Math.PI * .5;

		//	LIGHT
		_world.renderer.shadowMap.enabled = true;
		_world.renderer.shadowMap.soft = true;
		_world.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		_world.directional.castShadow = true; // これ!!
		_world.directional.shadow.darkness = 0.2;

		_world.directional.shadow.radius = 2;
		_world.directional.shadow.mapSize.width = 1024 * 4;  // default
		_world.directional.shadow.mapSize.height = 1024 * 4; // default
		_world.directional.shadow.camera.near = 0.5;       // default
		_world.directional.shadow.camera.far = 1000      // default

		var _area = 512;
		_world.directional.shadowCameraLeft = - _area;
		_world.directional.shadowCameraRight =  _area;
		_world.directional.shadowCameraTop =  _area;
		_world.directional.shadowCameraBottom = - _area;

		var helper = new THREE.CameraHelper( _world.directional.shadow.camera );
		_scene.add( helper );



		//	circle
		var _geometry = new THREE.CircleGeometry( 30, 16 );
		var _geometry = new THREE.CylinderGeometry( 16,16,1, 32 )
		var _material = new THREE.MeshStandardMaterial({
			color: 0xFFFFFF
		});

		var _mesh = new THREE.Mesh( _geometry, _material );
		_mesh.castShadow = true; // これ!
		//_mesh.receiveShadow = true; // これ!
		_mesh.position.y = 10;
		_scene.add( _mesh );



	}



	function Update()
	{
		var _delta = _clock.getDelta();
		_time += _delta;
	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
