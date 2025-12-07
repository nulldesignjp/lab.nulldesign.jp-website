/*
	engine.js
*/
window.onload = (function(){

	var _entries = 50000;

	var _world,_camera,_scene;
	var _mouse, _fcusIndex;
	var  _particles;

	var raycaster = new THREE.Raycaster();
	var toggle = 0;
	var _count = 0;
	var clock = new THREE.Clock();

	_world = new world('webglView');
	_camera = _world.camera;
	_scene = _world.scene;

	_mouse = {x:0,y:0};

	var _masterGeometry = new THREE.Geometry();
	var _material = new THREE.PointsMaterial({
		map: new THREE.TextureLoader().load('assets/img/spark1.png'),
		color: 0xe55e1b,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent : true,
		opacity: 0.75,
		size: 0.05
	});
	_particles = new THREE.Points( _masterGeometry, _material );
	_world.add( _particles );
	//	13232f

	// var _g = new THREE.GridHelper( 100, 50 );
	// _world.add( _g );

	var _scale = .1;
	var _noise = new SimplexNoise();
	var _geometry = new THREE.Geometry();
	for( var i = 0; i < _entries; i++ ){
		_geometry.vertices[i] = new THREE.Vector3();
		_geometry.vertices[i].x = ( Math.random() - 0.5 ) * 25;
		_geometry.vertices[i].z = ( Math.random() - 0.5 ) * 25;
		_geometry.vertices[i].y = _noise.noise( _geometry.vertices[i].x * _scale, _geometry.vertices[i].z * _scale ) * 0.75;
	}
	var _material = new THREE.PointsMaterial({
		map: new THREE.TextureLoader().load('assets/img/spark1.png'),
		color: 0x18d1db,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		transparent : true,
		size: 0.100,
		opacity: 0.75
	});
	var _points = new THREE.Points( _geometry, _material );
	_world.add( _points );

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseClick, false );

	function Start()
	{

	}
	function Update()
	{
		var _time = new Date().getTime() * 0.000025;
		var _geometry = _points.geometry;
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i].y = _noise.noise( _geometry.vertices[i].x * _scale + _time, _geometry.vertices[i].z * _scale ) * 0.5
			 + _noise.noise( _geometry.vertices[i].x * _scale * 2.0, _geometry.vertices[i].z * _scale * 2.0 + _time * 3.0 ) * 0.125;

		}
		_geometry.verticesNeedUpdate = true;

		var __scale = 2.0;
		var _geometry = _particles.geometry;
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i].x += _noise.noise( _geometry.vertices[i].y * __scale + _time * 10.0, _geometry.vertices[i].z * __scale ) * 0.0125;
			_geometry.vertices[i].y += _noise.noise( _geometry.vertices[i].z * __scale + _time * 10.0, _geometry.vertices[i].x * __scale ) * 0.0125;
			_geometry.vertices[i].z += _noise.noise( _geometry.vertices[i].x * __scale + _time * 10.0, _geometry.vertices[i].y * __scale ) * 0.0125;
			_geometry.vertices[i].y += 0.005;
		}
		_geometry.verticesNeedUpdate = true;
	}




	//	LOOP	
	(function _loop(){

		window.requestAnimationFrame(_loop);

		Update();

	})();

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			hitTest();
	}

	function onDocumentMouseClick( event ) {
		event.preventDefault();
		_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		//hitTest();
	}

	function hitTest()
	{
		raycaster.params.Points.threshold = 0.025;

		raycaster.setFromCamera( _mouse, _camera );
		var intersections = raycaster.intersectObjects( [_points], true );
		intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

		if ( toggle > 0.02 && intersection !== null)
		{
			console.log( intersection );
			_fcusIndex = intersection.index;
			toggle = 0;

			generateParticles( intersection.point );


		}
		toggle += clock.getDelta();

	}

	function generateParticles( _p ){
		var _scale = 0.0125;
		var _geometry = new THREE.Geometry();
		var len = _masterGeometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i] = _masterGeometry.vertices[i];
		}
		for( var i = 0; i < 100; i++ ){
			var _v = new THREE.Vector3();
			var _rad = Math.random() * Math.PI * 2.0;
			var _radius = Math.random() * 16.0;
			_v.x = Math.cos( _rad ) * _radius * _scale;
			_v.y = ( Math.random() - 0.5 ) * 1.0 * _scale;
			_v.z = Math.sin( _rad ) * _radius * _scale;
			_v.x += _p.x;
			_v.y += _p.y;
			_v.z += _p.z;
			_geometry.vertices.push( _v );
		}
		_masterGeometry = _geometry;

		_particles.geometry = _geometry;


	}

})();
