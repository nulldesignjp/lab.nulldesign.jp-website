/*
	engine.js
*/
window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _book;
	var _pages = [];
	var _time = 0;




	Start();
	//Update();

	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.z = 500;

		var _grid = new THREE.GridHelper( 3000, 30 );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.2;
		_scene.add( _grid );

				var r = "assets/img/cube/Bridge2/";
				var urls = [ r + "posx.jpg", r + "negx.jpg",
							 r + "posy.jpg", r + "negy.jpg",
							 r + "posz.jpg", r + "negz.jpg" ];

				textureCube = new THREE.CubeTextureLoader().load( urls );
				textureCube.format = THREE.RGBFormat;
				//textureCube.mapping = THREE.CubeReflectionMapping;
				//textureCube.encoding = THREE.sRGBEncoding;

				_scene.background = textureCube;



				//var textureLoader = new THREE.TextureLoader();
				// textureEquirec = textureLoader.load( "textures/2294472375_24a3b8ef46_o.jpg" );
				// textureEquirec.mapping = THREE.EquirectangularReflectionMapping;
				// textureEquirec.magFilter = THREE.LinearFilter;
				// textureEquirec.minFilter = THREE.LinearMipMapLinearFilter;
				// textureEquirec.encoding = THREE.sRGBEncoding;



		// model
		var loader = new THREE.FBXLoader();
		loader.load( 'suzanne.fbx', function ( object ) {

			// mixer = new THREE.AnimationMixer( object );
			// var action = mixer.clipAction( object.animations[ 0 ] );
			// action.play();

			for( var i in object.children )
			{
				var child = object.children[i];
				if( child.material.type == 'MeshPhongMaterial' )
				{
					child.material.envMap = textureCube;
					emissive = new THREE.Color(0,0,0);
					shininess = 100;
					specular = new THREE.Color(0,0,0);
				}
			}



			object.traverse( function ( child ) {

				if ( child.isMesh ) {

					child.castShadow = true;
					child.receiveShadow = true;

				}

			} );


			var _r = 200;
			var _s = 0.25;
			for( var i = 0; i < 16; i++ ){
				var _rad = i / 16 * Math.PI * 2.0;
				var _x = Math.cos( _rad ) * _r;
				var _z = Math.sin( _rad ) * _r;


				var _mesh = object.clone();
				_scene.add( _mesh );

				_mesh.scale.x = _mesh.scale.y = _mesh.scale.z = _s;

				_mesh.position.x = _x;
				_mesh.position.z = _z;

				_mesh.rotation.y = - _rad + Math.PI * 0.5
			}


			//_scene.add( object );
			//	object.scale.x = object.scale.y = object.scale.z = _s;



			var _geometry = new THREE.IcosahedronGeometry( 50, 4 );
			var _material = new THREE.MeshPhongMaterial({
					envMap: textureCube,
					emissive: new THREE.Color(0,0,0),
					shininess: 100,
					specular: new THREE.Color(0,0,0),
					//shading: THREE.FlatShading,
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			_scene.add( _mesh );

		} );


	}



	function Update()
	{
		var _delta = _clock.getDelta();
		_time += _delta;
	}



	//	random
	var _min = - 30.0;
	var _max = 30.0;
	var lastValue = 0.0;
	var interpolation = 0.4;
	function random(){
		return Math.random();
	}
	function randomRange( _min, _max ){
		return random() * ( _max - _min ) + _min;
	}
	function random21(){
		var val = randomRange( _min, _max );
		lastValue = lastValue * interpolation + val * (1.0 - interpolation);
		return lastValue;
	}



	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
