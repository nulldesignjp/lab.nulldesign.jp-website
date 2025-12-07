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


	var _geometry = new THREE.PlaneGeometry( 200, 200, 1, 1 );
	//var _material = new THREE.MeshBasicMaterial({	map: new THREE.TextureLoader().load('txt02.png'), transparent: true });
	var _material = new THREE.ShaderMaterial({
		uniforms: {
			time: {value:0},
			resolution: {value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
			texture: {value: new THREE.TextureLoader().load('txt01.png')}
		},
		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		transparent: true,
		blending: THREE.AdditiveBlending
	});

	var _panel = new THREE.Mesh( _geometry, _material );
	_world.add( _panel );
	_panel.position.x = -160;
	_panel.position.y = 40;
	_panel.position.z = 200;



	var _geometry = new THREE.PlaneGeometry( 640, 640, 5, 5 );
	//var _material = new THREE.MeshBasicMaterial({	map: new THREE.TextureLoader().load('txt02.png'), transparent: true });
	var _material = new THREE.ShaderMaterial({
		uniforms: {
			time: {value:0},
			resolution: {value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
			texture: {value: new THREE.TextureLoader().load('asuka1.jpg')}
		},
		vertexShader:   document.getElementById( 'imgVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'imgFragmentShader' ).textContent,
		transparent: true,
		blending: THREE.AdditiveBlending
	});

	var _img = new THREE.Mesh( _geometry, _material );
	_world.add( _img );
	_img.position.z = -100;



	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_panel.material.uniforms.time.value = _stepTime * 0.001;
		_img.material.uniforms.time.value = _stepTime * 0.001;
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
