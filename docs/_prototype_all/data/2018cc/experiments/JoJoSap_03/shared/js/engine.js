/*
	engine.js
*/

window.onload = function(){

	var _mesh,_points;
	var _material;

	var len = 10000;
	var _cone = new THREE.ConeBufferGeometry( 2, 3, 3 );
	_cone = new THREE.TetrahedronBufferGeometry( 3, 0 );
	var _array = new Uint16Array(12);
	for( var i=0;i<12;i++){_array[i] = i;}
		_cone.setIndex( new THREE.BufferAttribute( _array, 1 ) );

	var _geometry = new THREE.BufferGeometry();
	var _vertices = new Float32Array( len * _cone.attributes.position.count * _cone.attributes.position.itemSize );
	var _offset = new Float32Array( len * _cone.attributes.position.count * _cone.attributes.position.itemSize );
	var _normal = new Float32Array( len * _cone.attributes.normal.count * _cone.attributes.normal.itemSize );
	var _uv = new Float32Array( len * _cone.attributes.uv.count * _cone.attributes.uv.itemSize );
	var _index = new Uint16Array( len * _cone.index.array.length );

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');

	var _uniforms = {
		'time': {value:0},
		'mouse': {value: new THREE.Vector2()  },
		'resolution': {value: new THREE.Vector2( window.innerWidth, window.innerHeight )  },

		'planeColor': {type: "c", value: new THREE.Color(1.0,1.0,1.0) },
		'lightPosition': {type: "v3", value: _world.directional.position },
		'lightColor': {type: "c", value: _world.directional.color },
		'ambientColor': {type: "c", value: _world.ambient.color },
		'fogColor': { type: "c", value: _world.scene.fog.color },
		'fogNear': { type: "f", value: _world.scene.fog.near },
		'fogFar': { type: "f", value: _world.scene.fog.far },
	};

	_material = new THREE.ShaderMaterial({
		uniforms: _uniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent: true,
		//side: THREE.DoubleSide,
		//wireframe: true,
		//wireframeLinewidth: 1,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		fog: true
	});

	_points = _createparticle();
	_world.add( _points );
	//_points.scale.set( 50, 50, 50 );

	loop(0);

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_material.uniforms.time.value = _stepTime * 0.001;
		// _mesh.rotation.y += 0.0010;
		// _points.rotation.y += 0.0010;
	}

	function _createparticle(){

		var _idx = 0;
		var _idy = 0;
		var _idz = 0;
		var _idw = 0;
		var _ida = 0;
		for( var i = 0; i < len; i ++ ){
			var _x = ( Math.random() - 0.5 ) * 200;
			var _y = ( Math.random() - 0.5 ) * 200;
			var _z = ( Math.random() - 0.5 ) * 200;

			//	v
			var _pos = _cone.attributes.position.array;
			var _nor = _cone.attributes.normal.array;
			var _len = _pos.length;
			for( var j = 0; j < _len; j++ ){
				_vertices[ _idx++ ] = _pos[j];
				_normal[ _idy++ ] = _nor[j];
			}

			var _off = _cone.attributes.position.array;
			var _len = _off.length;
			for( var j = 0; j < _len; j++ ){
				_offset[ _idz++ ] = _x;
				_offset[ _idz++ ] = _y;
				_offset[ _idz++ ] = _z;
			}

			var _u = _cone.attributes.uv.array;
			var _len = _u.length;
			for( var j = 0; j < _len; j++ ){
				_uv[ _idw++ ] = _u[j];
			}

			var _len = _cone.index.array.length;
			for( var j = 0; j < _len; j++){
				_index[_ida++] = _cone.index.array[j] + _cone.attributes.position.count * i;
			}
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'normal', new THREE.BufferAttribute( _normal, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'offset', new THREE.BufferAttribute( _offset, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'uv', new THREE.BufferAttribute( _uv, _cone.attributes.uv.itemSize ) );
		//_geometry.setIndex( new THREE.BufferAttribute( _index, 1 ) );

		return new THREE.Mesh( _geometry, _material );
	}

}





