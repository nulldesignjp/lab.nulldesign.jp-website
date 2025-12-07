/*
	engine.js
*/
window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _time;
	var _book;
	var _pages = [];
	var _tweenList = [];

	Start();
	Update();

	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.x = 0;
		_camera.position.y = 100;
		_camera.position.z = 200;

		_time = 0;

		var _grid = new THREE.GridHelper( 1000, 100);
		_scene.add( _grid );

		_grid.material.transparent = true;
		_grid.material.opacity = 0.4;


		for( var i = 0; i < 8; i++ )
		{
			var _geometry = new THREE.BoxGeometry( 10,10,10,1,1,1)
			var _material = new THREE.MeshPhongMaterial();

				var materials = [
					new THREE.MeshPhongMaterial({color: 0xE9546B}), // right
					new THREE.MeshPhongMaterial({color: 0xE9546B}), // left
					new THREE.MeshPhongMaterial({color: 0x00A95F}), // front
					new THREE.MeshPhongMaterial({color: 0x00A95F}), // back
					new THREE.MeshPhongMaterial({color: 0x187FC4}), // top
					new THREE.MeshPhongMaterial({color: 0x187FC4}), // bottom
				];
				_material = materials;

			var _mesh = new THREE.Mesh( _geometry, _material );
			_scene.add( _mesh );

			var _x = Math.floor( ( Math.random() - 0.5 ) * 10 ) * 10;
			var _z = Math.floor( ( Math.random() - 0.5 ) * 10 ) * 10;

			_mesh.position.x = _x;
			_mesh.position.y = 0;
			_mesh.position.z = _z;

			_mesh.position.x += 5;
			_mesh.position.y += 5;
			_mesh.position.z += 5;

			_mesh.rotation.x = Math.floor( Math.random() * 4.0 ) / 4.0 * Math.PI * 2.0;
			_mesh.rotation.z = Math.floor( Math.random() * 4.0 ) / 4.0 * Math.PI * 2.0;


			var _obj = {
				isTween: false,
				func: null,
				count: 0,
				max: 60,
				axis: {x:0,y:0,z:0},
				rot: {start:{x:0,y:0,z:0},end:{x:0,y:0,z:0}},
				pos: {start:{x:0,y:0,z:0},end:{x:0,y:0,z:0}},
				mesh: _mesh
			}
			_pages[i] = _obj;

		}


	}



	function Update()
	{
		var len = _pages.length;
		for( var i = 0; i < len; i++ )
		{
			var _obj = _pages[i];
			var _mesh = _obj.mesh;

			if( !_obj.isTween )
			{

			} else {
				if( _obj.count >= _obj.max )
				{
					_obj.isTween = false;
				} else {

				}
			}


			//	rotation
			var origin_pos = _mesh.position.clone();
			var origin_quaternion = _mesh.quaternion;

			// tween.on('update')内に以下を追記
			var axis = new THREE.Vector3(0, 0, 1); // 回転軸
			var rad90 = Math.PI / 2; // ラジアン90°
			var rad = rad90 * 0.01;
			var new_q = origin_quaternion.clone()
			var target = new THREE.Quaternion();

			target.setFromAxisAngle(axis, rad);
			new_q.multiply(target);

			_mesh.quaternion.copy(new_q);


		}
	}




	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
