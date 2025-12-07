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
			var _mesh = circle( 5 );
			_scene.add( _mesh );

			_mesh.position.x = ( Math.random() - 0.5 ) * 150;
			_mesh.position.z = ( Math.random() - 0.5 ) * 150;
			_pages[i] = _mesh;

		}





		loadText( $("#vewField p").text(),
			function(_mesh){
				_scene.add( _mesh );
				//_mesh.position.x = ( Math.random() - 0.5 ) * 150;
				_mesh.position.y = 1;
				//_mesh.position.z = ( Math.random() - 0.5 ) * 150;
			});
	}

	function loadText( t, _callback )
	{
		$("#vewField p").text( t + t);


		//	これだ
		html2canvas($("#vewField")[0], {
				backgroundColor: null,
				width: $('#vewField').width(),
				height: $('#vewField').height(),
				scale: window.devicePixelRatio * 4
			}).then(canvas => {

			    var _texture = new THREE.Texture( canvas );
			    _texture.needsUpdate = true;

			    var _geometry = new THREE.PlaneGeometry( 100, 100, 1, 1 );
			    _geometry.rotateX( - Math.PI * 0.5 );
			    //	var _material = new THREE.MeshPhongMaterial({
			    var _material = new THREE.MeshBasicMaterial({
			    	map: _texture,
			    	transparent: true,
			    	side: THREE.DoubleSide
			    });
			    var _mesh = new THREE.Mesh( _geometry, _material );
			    //_mesh.scale.x = _mesh.scale.y = _mesh.scale.z = 0.5;

			    _callback( _mesh );
		});
	}



	function Update()
	{

	}

	function circle( _r )
	{
		var _offset = Math.random() * Math.PI * 2.0;
		var _segments = 3;
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < _segments; i++ ){
			var _rad = i / _segments * Math.PI * 2.0 + _offset;
			var _x = Math.cos( _rad ) * _r;
			var _z = Math.sin( _rad ) * _r;
			_geometry.vertices[i] = new THREE.Vector3( _x, 0.0, _z );
		}
		_geometry.vertices[_segments] = _geometry.vertices[0];


		var _material = new THREE.LineBasicMaterial({
			color: 0xFFFFFF
		});
		var _mesh = new THREE.Line( _geometry, _material );
		return _mesh;
	}


	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
