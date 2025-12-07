/*
	engine.js
*/

(function(){

	var _mesh;
	var _viewScale = 100.0;

	//
	var _world = new world('container');

	//	GRID
	var _geometry = new THREE.BoxGeometry( 6400, 6400, 1, 1 );
	_geometry.rotateX( - Math.PI * 0.5 );
	var _texture = new THREE.TextureLoader().load('clear02.png');
	_texture.repeat.set( 16, 16 );
	_texture.wrapS = THREE.RepeatWrapping;
	_texture.wrapT = THREE.RepeatWrapping;
	var _material = new THREE.MeshBasicMaterial({
		map: _texture
	});
	var _floor = new THREE.Mesh( _geometry, _material );
	_world.add( _floor );



	var loader = new THREE.JSONLoader();
	loader.load(
		'untitled.json',
		function( geometry, materials ){
			//	success
			_mesh = new THREE.Mesh( geometry, materials[0] );
			_mesh.material.flatShading = true;

			_mesh.geometry.computeBoundingBox();
			_mesh.geometry.computeBoundingSphere();
			// console.log( _mesh.geometry.boundingSphere.center )
			// console.log( _mesh.geometry.boundingSphere.radius )
			var _scale = _viewScale / _mesh.geometry.boundingSphere.radius;
			_mesh.scale.set( _scale, _scale, _scale );

			var _center = _mesh.geometry.boundingSphere.center;
			_mesh.position.x = - _center.x * _scale;
			_mesh.position.y = - _center.y * _scale + _viewScale;
			_mesh.position.z = - _center.z * _scale;

			_world.add( _mesh );

			_world.focus.y = _mesh.position.y;
		},
		function( e ){
			//	progress
		},
		function( e ){
			//	err
		}
	);
	
	loop(0)
	//	render
	function loop( _stepTime ){
		window.requestAnimationFrame(loop);

	}

})();

