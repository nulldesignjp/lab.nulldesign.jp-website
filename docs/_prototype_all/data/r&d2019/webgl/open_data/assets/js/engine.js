/*
	engine.js
*/


window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _mesh,_mesh2;
	var _time = 0;

	var _jal = 'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:JAL&acl:consumerKey='
	var _ana = 'https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:ANA&acl:consumerKey='
	var consumerKey = '087a30246b2ff6af6f7199b7dc6c46d49e923067cc4b80969da7fffa886042cc'

	Start();
	//	Update();


	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.y = 100;
		_camera.position.z = 500;

		var _grid = new THREE.GridHelper( 500, 5 );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.4;
		_scene.add( _grid );


		$.ajax({
			url: _ana + consumerKey,
			type: 'GET',
			dataType: 'TEXT',
			success: function( _array )
			{
				//var _list = _array;
				var _list = JSON.parse(_array);
				console.log( _list[0], _list[1], _list[2] )
			}
		});

		//var _geometry = new THREE.BoxBufferGeometry(100,100,100);
		var _geometry = new THREE.IcosahedronGeometry(50,3);

		var phongShader = THREE.ShaderLib.phong;
		var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		uniforms.time = {};
		uniforms.time.value = Math.PI * 0.5;



		//	
		var _size = 300;
		var p = [];
		for( var i = 0; i < 16; i++ ){
			p[i] = new THREE.Vector3( ( Math.random() - 0.5 ) * _size, ( Math.random() - 0.5 ) * _size, ( Math.random() - 0.5 ) * _size );
		}
		var interpolate = 60;
		var _vec3Array = SplineCurve3D(p, interpolate)
		var _vec3 = [];
		for( var i = 0; i < _vec3Array.length; i++ ){
			_vec3[i] = new THREE.Vector3( _vec3Array[i].x, _vec3Array[i].y, _vec3Array[i].z );
		}
		uniforms.ppos = {};
		uniforms.ppos.value = _vec3;

		// uniforms.diffuse = {}
		// uniforms.diffuse.value = new THREE.Color( Math.random(), Math.random(), Math.random() );

		var _material = new THREE.ShaderMaterial({
			//defines: { USE_MAP: '' },
			defines: {
				num: uniforms.ppos.value.length
			},
			uniforms: uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: phongShader.fragmentShader,
			lights: true,
            fog: true,
			transparent: true,
			// side: THREE.DoubleSide,
			// shading: THREE.FlatShading
			// wireframe: true,
			// wireframeLinewidth: 3
		});

		_mesh = new THREE.Line( _geometry, _material )
		_scene.add( _mesh )




		var _geometry = new THREE.Geometry();
		_geometry.vertices = _vec3;
		var _material = new THREE.LineBasicMaterial();
		var _line = new THREE.Line( _geometry, _material );
		_scene.add( _line );




		var _texture = new THREE.TextureLoader().load('colormap.png');
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 4096; i++ ){
			_geometry.vertices[i] = new THREE.Vector3();
		}

		_geometry = new THREE.PlaneGeometry( 1, 1, 64, 64 );


		var _phongShader = THREE.ShaderLib.phong;
		var _uniforms = THREE.UniformsUtils.clone(_phongShader.uniforms);
		_uniforms.time = {};
		_uniforms.time.value = Math.PI * 0.5;

		_uniforms.map.value = _texture;

		var _material = new THREE.ShaderMaterial({
			//defines: { USE_MAP: '' },
			// defines: {
			// 	num: uniforms.ppos.value.length
			// },
			uniforms: _uniforms,
			vertexShader:   document.getElementById( 'vertexshader2' ).textContent,
			fragmentShader: _phongShader.fragmentShader,
			lights: true,
            fog: true,
			transparent: true,
			// side: THREE.DoubleSide,
			// shading: THREE.FlatShading
			wireframe: true,
			// wireframeLinewidth: 3
		});

		_mesh2 = new THREE.Mesh( _geometry, _material )
		_scene.add( _mesh2 );






	}

	function Update()
	{
		_time += _clock.getDelta();
		_mesh.material.uniforms.time.value = _time;
		_mesh2.material.uniforms.time.value = _time;
	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
