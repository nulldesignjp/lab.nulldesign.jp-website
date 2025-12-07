/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _particles;

	//	GPU prop
	var WIDTH = 64;
	var PARTICLES = WIDTH * WIDTH;
	var gpuCompute;
	var velocityVariable,	velocityUniforms;
	var positionVariable,	positionUniforms;
	var particleUniforms;
	var effectController;
	


	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 0, 200 );

	_world.controls.autoRotate = false;
	_world.controls.autoRotateSpeed = 0.0625;
	_world.controls.enableZoom = false;

	// _world.controls.enabled = false;
	generateEffects();

	const _lineDiv = 6;
	const _lineWidth = 2;
	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color : 0xCC0000, side:THREE.DoubleSide } );
	var _s0 = new THREE.Mesh( geometry, material );
	_world.add( _s0 );
	_s0.position.z = -20;

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color : 0xCC00, side:THREE.DoubleSide } );
	var _s1 = new THREE.Mesh( geometry, material );
	_world.add( _s1 );

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color : 0x0000CC, side:THREE.DoubleSide } );
	var _s2 = new THREE.Mesh( geometry, material );
	_world.add( _s2 );
	_s2.position.z = 20;

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { color : 0xFFFFFF, side:THREE.DoubleSide } );
	var _s3 = new THREE.Mesh( geometry, material );
	_world.add( _s3 );
	_s3.position.z = 40;


		gen( _s0 );
		gen( _s1 );
		gen( _s2 );
		gen( _s3 );


	var _geometry = new THREE.PlaneBufferGeometry( 3200, 3200 );
	_geometry.rotateX( - Math.PI * 0.5 );

	var _texture = new THREE.TextureLoader().load('shared/img/clear02.png');
	_texture.wrapS = THREE.RepeatWrapping;
	_texture.wrapT = THREE.RepeatWrapping;
	_texture.repeat.set( 16, 16 );
	var _material = new THREE.MeshPhongMaterial({
		map: _texture
	});
	var _plane = new THREE.Mesh( _geometry, _material );
	_world.add( _plane );

	_plane.position.y = -100;

	loop(0);

	function gen( mesh ){
		let _l = [];
		for( var i = 0; i < 24; i++ ){
			var _rad = Math.PI * 0.25 * i;
			var _r = Math.random() * 10 + 30;
			var _x = Math.cos( _rad ) * _r;
			var _y = Math.sin( _rad ) * _r;

			var _v = new THREE.Vector2( _x, _y );
			_l[i] = [];
			_l[i][0] = _x;
			_l[i][1] = _y;
		}
		//_l.push( _l[0])


		var geometry = genLine( _l );
		geometry.rotateX( - Math.PI * 0.5 );
		mesh.geometry = geometry;
		//splineObject.rotation.z = Math.random() * 360;
	}




	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		// gen( _s0 );
		// gen( _s1 );
		// gen( _s2 );
	}

	function generateEffects(){
		var _effect = new THREE.ShaderPass( THREE.VignetteShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.intensity.value = 1.0;
		_effect.uniforms.distance.value = 4.0;
		_world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.NoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _effect.uniforms.time.value = 0;
		// _world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.MonoShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.RGBNoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _world.addPass( _effect );
	}

	function genLine( _poslist )
	{
		var _geometry = new THREE.Geometry();
		var len = _poslist.length;
		for( var i = 0; i < len; i++ ){
			var _pos = {x:0,y:0,z:0};
			_pos.x = _poslist[i][0];
			_pos.y = 0;
			_pos.z = _poslist[i][1];

			_geometry.vertices[i] = new THREE.Vector3( _pos.x, 0, _pos.z );

		}

		_geometry.vertices = SplineCurve3D( _geometry.vertices, _lineDiv );


		var len = _geometry.vertices.length;
		var _newGeometry = new THREE.Geometry();
		for( var i = 0; i < len - 1; i++ ){
			var _v0 = _geometry.vertices[ i + 0 ];
			var _v1 = _geometry.vertices[ i + 1 ];
			var _v = new THREE.Vector3().subVectors( _v1, _v0 );
			var _n = new THREE.Vector3( - _v.z, 0, _v.x ).normalize().multiplyScalar( _lineWidth * 0.5);

			_newGeometry.vertices[ i * 4 + 0 ] = new THREE.Vector3().addVectors( _v0, _n );
			_newGeometry.vertices[ i * 4 + 1 ] = new THREE.Vector3().subVectors( _v0, _n );
			_newGeometry.vertices[ i * 4 + 2 ] = new THREE.Vector3().addVectors( _v1, _n );
			_newGeometry.vertices[ i * 4 + 3 ] = new THREE.Vector3().subVectors( _v1, _n );

			_newGeometry.faces.push( new THREE.Face3( i * 4 + 2, i * 4 + 1, i * 4 + 0 ) );
			_newGeometry.faces.push( new THREE.Face3( i * 4 + 2, i * 4 + 3, i * 4 + 1 ) );
		}

		//	Line Joint	
		for( var i = 0; i < len - 2; i++ ){
			var _p0 = _newGeometry.vertices[ i * 4 + 0 ];
			var _p1 = _newGeometry.vertices[ i * 4 + 1 ];
			var _p2 = _newGeometry.vertices[ i * 4 + 2 ];
			var _p3 = _newGeometry.vertices[ i * 4 + 3 ];

			var _p4 = _newGeometry.vertices[ ( i + 1 ) * 4 + 0 ];
			var _p5 = _newGeometry.vertices[ ( i + 1 ) * 4 + 1 ];
			var _p6 = _newGeometry.vertices[ ( i + 1 ) * 4 + 2 ];
			var _p7 = _newGeometry.vertices[ ( i + 1 ) * 4 + 3 ];

			var _p00 = getCrossVector( _p0, _p2, _p4, _p6 );
			var _p01 = getCrossVector( _p1, _p3, _p5, _p7 );

			//	_p2
			_newGeometry.vertices[ i * 4 + 2 ].x = _p00[0].x;
			_newGeometry.vertices[ i * 4 + 2 ].z = _p00[0].z;
			//	_p4
			_newGeometry.vertices[ ( i + 1 ) * 4 + 0 ].x = _p00[1].x;
			_newGeometry.vertices[ ( i + 1 ) * 4 + 0 ].z = _p00[1].z;

			//	_p3
			_newGeometry.vertices[ i * 4 + 3 ].x = _p01[0].x;
			_newGeometry.vertices[ i * 4 + 3 ].z = _p01[0].z;
			//	_p5
			_newGeometry.vertices[ ( i + 1 ) * 4 + 1 ].x = _p01[1].x;
			_newGeometry.vertices[ ( i + 1 ) * 4 + 1 ].z = _p01[1].z;
		}

		//	Line Caps
		var _len = 8;
		var _p1 = _newGeometry.vertices[0];
		var _p2 = _newGeometry.vertices[1];
		var _p3 = new THREE.Vector3().subVectors( _p2, _p1 );
		var _p0 = new THREE.Vector3().addVectors( _p1, _p2 ).multiplyScalar( 0.5 );
		var _rad = Math.atan2( _p3.z, _p3.x );
		var _index00 = _newGeometry.vertices.length;
		var _index0 = _newGeometry.vertices.length;
		_newGeometry.vertices[ _index0 ] = new THREE.Vector3( _geometry.vertices[0].x, _geometry.vertices[0].y, _geometry.vertices[0].z );

		for( var i = 0; i < _len; i++ ){

			var _x = Math.cos( _rad ) * _lineWidth * 0.5;
			var _z = Math.sin( _rad ) * _lineWidth * 0.5;
			var _p00 = new THREE.Vector3( _x, 0, _z ).add( _p0 );

			_rad -= 1 / _len * Math.PI;
			var _x = Math.cos( _rad ) * _lineWidth * 0.5;
			var _z = Math.sin( _rad ) * _lineWidth * 0.5;
			var _p01 = new THREE.Vector3( _x, 0, _z ).add( _p0 );


			var _index1 = _newGeometry.vertices.length;
			_newGeometry.vertices[ _index1 ] = new THREE.Vector3( _p00.x, _p00.y, _p00.z );
			var _index2 = _newGeometry.vertices.length;
			_newGeometry.vertices[ _index2 ] = new THREE.Vector3( _p01.x, _p01.y, _p01.z );
			_newGeometry.faces.push( new THREE.Face3( _index0, _index1, _index2 ) );
		}

		var _p1 = _newGeometry.vertices[ _index00 - 2 ];
		var _p2 = _newGeometry.vertices[ _index00 - 1 ];
		var _p3 = new THREE.Vector3().subVectors( _p2, _p1 );
		var _p0 = new THREE.Vector3().addVectors( _p1, _p2 ).multiplyScalar( 0.5 );
		var _rad = Math.atan2( _p3.z, _p3.x );
		var _index0 = _newGeometry.vertices.length;
		var _lastIndex = _geometry.vertices.length - 1;
		_newGeometry.vertices[ _index0 ] = new THREE.Vector3( _geometry.vertices[_lastIndex].x, _geometry.vertices[_lastIndex].y, _geometry.vertices[_lastIndex].z );

		for( var i = 0; i < _len; i++ ){

			var _x = Math.cos( _rad ) * _lineWidth * 0.5;
			var _z = Math.sin( _rad ) * _lineWidth * 0.5;
			var _p00 = new THREE.Vector3( _x, 0, _z ).add( _p0 );

			_rad += 1 / _len * Math.PI;
			var _x = Math.cos( _rad ) * _lineWidth * 0.5;
			var _z = Math.sin( _rad ) * _lineWidth * 0.5;
			var _p01 = new THREE.Vector3( _x, 0, _z ).add( _p0 );

			var _index1 = _newGeometry.vertices.length;
			_newGeometry.vertices[ _index1 ] = new THREE.Vector3( _p00.x, _p00.y, _p00.z );
			var _index2 = _newGeometry.vertices.length;
			_newGeometry.vertices[ _index2 ] = new THREE.Vector3( _p01.x, _p01.y, _p01.z );
			_newGeometry.faces.push( new THREE.Face3( _index2, _index1, _index0 ) );
		}

		_geometry = _newGeometry;

		_geometry.computeBoundingBox();
		_geometry.computeFaceNormals();
		_geometry.computeVertexNormals();

		return _geometry;
	}

	function getCrossVector( A, B, C, D )
	{
		var result = [];
		result[0] = new THREE.Vector3();
		result[1] = new THREE.Vector3();
		result[2] = true;

		var AB = new THREE.Vector3().subVectors( B, A );
		var CD = new THREE.Vector3().subVectors( D, C );

		var n1 = new THREE.Vector3().subVectors( B, A ).normalize();
		var n2 = new THREE.Vector3().subVectors( D, C ).normalize();

		var work1 = n1.dot( n2 );
		var work2 = 1.0 - work1 * work1;

		//直線が平行な場合は計算できない 平行だとwork2が0になる
    	if( work2 == 0 ) {
    		result[2] = false;
    		return result;
    	}

    	var AC = new THREE.Vector3().subVectors( C, A );
    	var d1 = ( AC.dot( n1 ) - work1 * AC.dot( n2 ) ) / work2;
    	var d2 = ( work1 * AC.dot( n1 ) - AC.dot( n2 ) ) / work2;

		//AB上の最近点
		result[0].x = A.x + d1 * n1.x;
		result[0].y = A.y + d1 * n1.y;
		result[0].z = A.z + d1 * n1.z;
		//BC上の最近点
		result[1].x = C.x + d2 * n2.x;
		result[1].y = C.y + d2 * n2.y;
		result[1].z = C.z + d2 * n2.z;

		return result;
	}

}
