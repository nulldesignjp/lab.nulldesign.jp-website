/*
	engine.js
*/


window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _mesh;

	var _time = 0;

	Start();
	//	Update();


	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.z = 500;

		var _grid = new THREE.GridHelper( 500, 5 );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.4;
		_scene.add( _grid );



		var _vertices = [];
		var ___vertices = [];
		for( var i = 0; i < 24; i++ )
		{
			var _size = 500.0;
			var _v = new THREE.Vector3();
			_v.x = ( Math.random() - 0.5 ) * _size;
			_v.y = ( Math.random() - 0.5 ) * _size * 0.2;
			_v.z = ( Math.random() - 0.5 ) * _size;
			_vertices[i] = _v;
			___vertices[i] = _v;
		}



		var _vertices = SplineCurve3D( _vertices, 60 );
		for( var i = 0; i < _vertices.length; i++ )
		{
			_vertices[i] = new THREE.Vector3( _vertices[i].x, _vertices[i].y, _vertices[i].z )
		}

		var _geometry = new THREE.Geometry();
		_geometry.vertices = _vertices;
		//_geometry = new THREE.BufferGeometry().formGeometry( _geometry );

		var _material = new THREE.LineBasicMaterial({
			color: 0xCC0000,
			linewidth: 3,
			transparent: true,
			opacity: 0.5
		});
		var _line = new THREE.Line( _geometry, _material );

		_scene.add( _line );

		console.log( _line.geometry.vertices.length )



		
		//_geometry.vertices = _curve.getPoints( 2 );
		//var _geometry = new THREE.TubeGeometry( _curve, 2, 0.5, 5, false );




	}

	function Update()
	{
		_time += _clock.getDelta();
	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
