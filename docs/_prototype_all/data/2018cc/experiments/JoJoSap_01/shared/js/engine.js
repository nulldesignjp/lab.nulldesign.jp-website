/*
	engine.js
*/

/*
	engine.js
*/

window.onload = function(){

	var _mesh,_points;
	var _material;


		var _geometry;
		var _position;
		var _normals;
		var _colors;
		var _index;
		var v = 0;


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
		_mesh = new THREE.SceneUtils.createMultiMaterialObject( object.children[0].geometry, [ _wire, _face ] );
		_world.add( _mesh );

		var _scale = 50;
		_mesh.scale.set( _scale, _scale, _scale );

		_points = _createparticle();
		_world.add( _points );
		var _scale = 50;
		_points.scale.set( _scale, _scale, _scale );

		loop(0);

		console.log( _mesh );

	}, undefined, function(err){} );

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_material.uniforms.time.value = _stepTime * 0.001;
		_mesh.rotation.y += 0.0010;
		_points.rotation.y += 0.0010;
	}

	function _createparticle(){
		var _vertices = _mesh.children[0].geometry.attributes.position.array;
		var len = _mesh.children[0].geometry.attributes.position.count;

		console.log( len );

		_geometry = new THREE.BufferGeometry();
		_position = new Float32Array( len * 4 );
		_normals = new Float32Array( len );
		_colors = new Float32Array( len * 4 );
		_index = new Uint32Array( len * 4 );

		for( var i = 0; i < len; i += 3 ){
			var _x = _vertices[ i ];
			var _y = _vertices[ i + 1 ];
			var _z = _vertices[ i + 2 ];


			var _r = 0.05;
			var _rad0 = Math.random() * Math.PI * 2.0;
			var _rad1 = Math.random() * Math.PI * 2.0;

			var x = Math.cos(_rad0) * Math.cos(_rad1) * _r;
			var y = Math.cos(_rad0) * Math.sin(_rad1) * _r;
			var z = Math.sin(_rad0) * _r;

			_vertices[ i ] += x;
			_vertices[ i + 1 ] += y;
			_vertices[ i + 2 ] += z;


			_colors[ i ] = Math.random();
			_colors[ i + 1 ] = Math.random();
			_colors[ i + 2 ] = Math.random();

			var _r = 0.01;
			for( var j = 0; j < 4; j++ ){
				var _rad0 = Math.random() * Math.PI * 2.0;
				var _rad1 = Math.random() * Math.PI * 2.0;

				var x = Math.cos(_rad0) * Math.cos(_rad1) * _r;
				var y = Math.cos(_rad0) * Math.sin(_rad1) * _r;
				var z = Math.sin(_rad0) * _r;

				verts_push(
					x + _x,
					y + _y,
					z + _z
				);
			}
		}
		for( var i = 0; i < _position.length / 3; i ++ ){;
			_index[i] = i;
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
		_geometry.addAttribute( 'color', new THREE.BufferAttribute( _colors, 3 ) );
		_geometry.setIndex( new THREE.BufferAttribute( _index, 1 ) );
		//_geometry.addAttribute( 'normal', new THREE.BufferAttribute( _normals, 3 ) );

		var _material = new THREE.PointsMaterial({
			size: 0.1
		});
		return new THREE.Points( _geometry, _material );
	}

		function verts_push() {
			for (var i=0; i < arguments.length; i++) {
				_position[v++] = arguments[i];
			}
		}


}





