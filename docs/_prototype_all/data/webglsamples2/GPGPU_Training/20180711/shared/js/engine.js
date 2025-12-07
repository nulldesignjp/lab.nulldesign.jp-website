/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _vertices = [];
	var _lineDiv = 64;
	var _lineWidth = 32;
	var _geometry = new THREE.Geometry();



	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 0, 200 );

	_world.controls.autoRotate = false;
	_world.controls.autoRotateSpeed = 0.0625;
	_world.controls.enableZoom = false;

	// _world.controls.enabled = false;
	generateEffects();


	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial({
		color: 0xFFFFFF,
		side: THREE.DoubleSide,
		// transparent: true,
		// opacity: 0.6
	});
	var _mesh = new THREE.Mesh(geometry,material);
	_world.add( _mesh );

	var geo = new THREE.PlaneGeometry( window.innerWidth, window.innerHeight, 1, 1 );
	var mat = new THREE.MeshBasicMaterial({
		map: new THREE.TextureLoader().load('bg.png')
	});
	var _bg = new THREE.Mesh( geo, mat );
	_world.add( _bg )
	_bg.position.z = -100;


	init();

	window.addEventListener('keydown', function(e){
		init();
		e.preventDefault();
	})


	function init(){
		_geometry = new THREE.Geometry();
		for( var i = 0; i < 8; i++ ){
			var _pos = {x:0,y:0,z:0};
			_pos.x = ( Math.random() - 0.5 ) * window.innerWidth * 0.5;
			_pos.y = 0;
			_pos.z = ( Math.random() - 0.5 ) * window.innerHeight * 0.5;

			_geometry.vertices[i] = new THREE.Vector3( _pos.x, 0, _pos.z );

		}

		var _poslist = SplineCurve3D( _geometry.vertices, _lineDiv );


		for( var i = 0; i < _poslist.length; i++ ){
			_geometry.vertices[i] = new THREE.Vector3( _poslist[i].x, _poslist[i].y, _poslist[i].z );
		}
	}


	loop(0);

	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

		var _value = Math.sin( _stepTime * 0.0002 ) * 0.5 + 0.5;		
		var geometry = genLine( _geometry, _value );


		geometry.rotateX( - Math.PI * 0.5 );
		_mesh.geometry = geometry;

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

	function genLine( _poslist, _value )
	{
		var _geometry = _poslist;
		//_geometry.vertices = SplineCurve3D( _poslist.vertices, _lineDiv );

		var len = _geometry.vertices.length;
		len = ~~( len * _value );
		len = len<3?3:len;

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
		var _len = 16;
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
		//var _lastIndex = _geometry.vertices.length - 1;
		var _lastIndex = len-1;
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
