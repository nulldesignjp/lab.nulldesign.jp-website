/*
	engine.js
*/

window.onload = function(){

	var _mesh,_points,_FBXgeometry;
	var _material;
	var mixers = [];
	var clock = new THREE.Clock();

	var len = 5000;
	var _cone = new THREE.BoxBufferGeometry( 2, 2, 2 );
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

	var _rnd = new Float32Array( len * _cone.index.array.length );

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.controls.autoRotate = false;
	_world.camera.position.set( 50, 1, 50 );
	_world.focus.y = 1;

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
		//opacity: 0.3,
		//side: THREE.DoubleSide,
		//wireframe: true,
		//wireframeLinewidth: 1,
		blending: THREE.AdditiveBlending,
		depthTest: false,
		fog: true
	});

	start();

	//suzanne
	function start(){
		_points = _createparticle();
		_world.add( _points );
		loop(0);
		console.log('static.');
	}

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_material.uniforms.time.value = _stepTime * 0.001;

		// if( _mesh )
		// {
		// 	_mesh.rotation.y += 0.001;
		// 	_points.rotation.y += 0.001;
		// }
	}

	function _createparticle(){
		var _idx = 0;
		var _idy = 0;
		var _idz = 0;
		var _idw = 0;
		var _ida = 0;
		var _idb = 0;
		for( var i = 0; i < len; i ++ ){
			var _pos = getRandomPoint();
			var _x = _pos.x;
			var _y = _pos.y;
			var _z = _pos.z;

			//	v
			var _pos = _cone.attributes.position.array;
			var _nor = _cone.attributes.normal.array;
			var _len = _pos.length;	//	36
			for( var j = 0; j < _len; j++ ){
				_vertices[ _idx++ ] = _pos[j];
				_normal[ _idy++ ] = _nor[j];
			}

			//	new
			var _off = _cone.attributes.position.array;
			var _len = _off.length / 3;	//36
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

			var _len = _cone.index.array.length / 12;
			for( var j = 0; j < _len; j++){
				var _value = Math.random();
				_rnd[_idb*12+0] = _value;
				_rnd[_idb*12+1] = _value;
				_rnd[_idb*12+2] = _value;
				_rnd[_idb*12+3] = _value;
				_rnd[_idb*12+4] = _value;
				_rnd[_idb*12+5] = _value;
				_rnd[_idb*12+6] = _value;
				_rnd[_idb*12+7] = _value;
				_rnd[_idb*12+8] = _value;
				_rnd[_idb*12+9] = _value;
				_rnd[_idb*12+10] = _value;
				_rnd[_idb*12+11] = _value;
				_idb++
			}
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'normal', new THREE.BufferAttribute( _normal, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'offset', new THREE.BufferAttribute( _offset, _cone.attributes.position.itemSize ) );
		_geometry.addAttribute( 'uv', new THREE.BufferAttribute( _uv, _cone.attributes.uv.itemSize ) );
		//_geometry.setIndex( new THREE.BufferAttribute( _index, 1 ) );

		_geometry.addAttribute( 'life', new THREE.BufferAttribute( _rnd, 1 ) );

		return new THREE.Mesh( _geometry, _material );
	}

	function getRandomPoint(){
		var _x = ( Math.random() - 0.5 ) * 200;
		var _y = ( Math.random() - 0.5 ) * 200;
		var _z = ( Math.random() - 0.5 ) * 200;

		var _p00 = new THREE.Vector3( _x, _y, _z );

		if( _FBXgeometry )
		{
			var _scale = _mesh.scale.x;
			var _faces = _FBXgeometry.faces;
			var _index = Math.floor( Math.random() * _faces.length );
			var _a = _faces[ _index ].a;
			var _b = _faces[ _index ].b;
			var _c = _faces[ _index ].c;
			var _v0 = _FBXgeometry.vertices[ _a ];
			var _v1 = _FBXgeometry.vertices[ _b ];
			var _v2 = _FBXgeometry.vertices[ _c ];
			var _r0 = Math.random();
			var _r1 = Math.random();

			var _va = new THREE.Vector3().subVectors( _v1, _v0 );
			var _vb = new THREE.Vector3().subVectors( _v2, _v1 );

			var _p0 = new THREE.Vector3().addVectors( _va, new THREE.Vector3().addScaledVector( _vb, _r0 ) );
			_p00 = new THREE.Vector3().addVectors( _v0, new THREE.Vector3().addScaledVector( _p0, _r1 ) );


			_p00 = _p00.addScaledVector( _p00, _scale );

			_p00 = new THREE.Vector3( _p00.x, _p00.z, - _p00.y );
		}

		return _p00;
	}

}





