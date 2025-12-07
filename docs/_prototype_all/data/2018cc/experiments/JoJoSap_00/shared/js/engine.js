/*
	engine.js
*/

/*
	engine.js
*/

window.onload = function(){

	var _mesh;
	var _material;

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');

	_world.camera.position.y = 45;
	_world.focus.y = 45;

	var _uniforms = {
		'time': {value:0},
		'mouse': {value: new THREE.Vector2()  },
		'resolution': {value: new THREE.Vector2( window.innerWidth, window.innerHeight )  }
	};

	_material = new THREE.ShaderMaterial({
		uniforms: _uniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent: true,
		side: THREE.DoubleSide
	});

	var _wire = new THREE.MeshBasicMaterial({
		wireframe: true,
		transparent: true,
		opacity: 0.8
	});

	var _face = new THREE.MeshPhongMaterial({
		flatShading: true,
		transparent: true,
		opacity: 0.5
	});

	var loader = new THREE.OBJLoader();
	//loader.load( 'suzanne.obj', function ( object ) {
	loader.load( 'untitled.obj', function ( object ) {
		_mesh = new THREE.SceneUtils.createMultiMaterialObject( object.children[0].geometry, [ _material, _wire, _face ] );
		_world.add( _mesh );

		var _scale = 50;
		_mesh.scale.set( _scale, _scale, _scale );

		loop(0);

		console.log( _mesh );

	}, undefined, function(err){} );

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_material.uniforms.time.value = _stepTime * 0.001;
		_mesh.rotation.y += 0.0010;
	}

}





