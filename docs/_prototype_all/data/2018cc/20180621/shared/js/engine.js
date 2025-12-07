/*
	engine.js
*/

window.onload = function(){
	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	// _world.controls.enabled = false;
	// _world.controls.autoRotate = false;
	_world.camera.position.set( 0, 0, 500 );
	generateEffects();

	//	
	var _geometry = new THREE.IcosahedronGeometry( 10, 0 );
	// var _material = new THREE.MeshBasicMaterial();
	// var _material = new THREE.MeshLambertMaterial();
	var _material = new THREE.MeshPhongMaterial();
	// var _material = new THREE.MeshDepthMaterial();
	// var _material = new THREE.MeshNormalMaterial();
	// var _material = new THREE.MeshPhysicalMaterial();
	// var _material = new THREE.MeshStandardMaterial();
	// var _material = new THREE.MeshToonMaterial();
	// var _material = new THREE.ShadowMaterial();

	var _material = new THREE.ShaderMaterial({
		uniforms: {
			time: {value:0},
			resolution: {value: new THREE.Vector2( window.innerWidth, window.innerHeight )},

		'planeColor': {type: "c", value: new THREE.Color(1.0,1.0,1.0) },
		'lightPosition': {type: "v3", value: _world.directional.position },
		'lightColor': {type: "c", value: _world.directional.color },
		'ambientColor': {type: "c", value: _world.ambient.color },
		'fogColor': { type: "c", value: _world.scene.fog.color },
		'fogNear': { type: "f", value: _world.scene.fog.near },
		'fogFar': { type: "f", value: _world.scene.fog.far },
		},
		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		transparent: true,
		blending: THREE.AdditiveBlending
	});

	var _mesh = new THREE.Mesh( _geometry, _material );
	_world.add( _mesh );


	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
	}

	function generateEffects(){

		var _effect = new THREE.ShaderPass( THREE.BackBufferShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.backbuffer.value = _world.bufferTexture;
		//_world.addPass( _effect );


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

		// var _effect = new THREE.ShaderPass( THREE.LineNoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _world.addPass( _effect );

	}

}
