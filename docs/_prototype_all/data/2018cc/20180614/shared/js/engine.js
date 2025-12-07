/*
	engine.js
*/

window.onload = function(){

	var _mesh,_points;
	var _material;
	var _cone = new THREE.TetrahedronBufferGeometry( 30, 0 );

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.x = 0;
	_world.camera.position.y = 100;
	_world.camera.position.z = 500;

		var _effect = new THREE.ShaderPass( THREE.VignetteShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.intensity.value = 1.0;
		_effect.uniforms.distance.value = 4.0;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.NoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.LineShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		// _world.addPass( _effect );



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

	var _geometry = new THREE.IcosahedronGeometry( 50, 0 );
	_material = new THREE.MeshPhongMaterial({
		flatShading: true
	});

	_mesh = new THREE.Mesh( _geometry, _material );
	_world.add( _mesh );
	_mesh.position.y = 60;
	_mesh.castShadow = true;
	//_mesh.receiveShadow = true;


	var _geometry = new THREE.BoxGeometry( 5, 100, 5, 1, 1, 1 );
	var _material = new THREE.MeshPhongMaterial({flatShading:true,color: 0xFFFFFF});
	for( var i = 0; i < 20; i++ )
	{
		for( var j = 0; j < 20; j++ )
		{
			var _mesh = new THREE.Mesh( _geometry, _material );
			_mesh.position.x = ( i - 10 ) * 200;
			_mesh.position.z = ( j - 10 ) * 200;
			_mesh.rotation.y = Math.random() * 180;
			_mesh.castShadow = true;

			var _scale = Math.random() * 2.0 + 0.5;
			_mesh.scale.y = _scale;
			_mesh.position.y = 100 * _scale * 0.5;

			var _rad = Math.random() * Math.PI * 2.0;
			_mesh.position.x += Math.cos( _rad ) * 20.0;
			_mesh.position.z += Math.sin( _rad ) * 20.0;


			_world.add( _mesh )
		}
	}
	var _geometry = new THREE.PlaneGeometry( 3200, 3200, 32, 32 );
	var _material = new THREE.MeshLambertMaterial();
	var _material = new THREE.MeshPhongMaterial({flatShading: true, color: 0xFFFFFF});
	//var _material = new THREE.MeshBasicMaterial({color: 0xCCCCCC});
	_geometry.rotateX( - Math.PI * 0.5 );

	for( var i = 0;i < _geometry.vertices.length; i++ )
	{
		_geometry.vertices[i].y += ( Math.random() ) * 20;
	}
	var _plate = new THREE.Mesh( _geometry, _material );
	_world.add( _plate );

	//_plate.castShadow = true;
	_plate.receiveShadow = true;

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		//_material.uniforms.time.value = _stepTime * 0.001;
	}

}





