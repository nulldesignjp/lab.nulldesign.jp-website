/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _box;


	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 0, 300 );
	generateEffects();

	/*
		ここからPRTICLE本体
	*/
	var _geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
	var _material = new THREE.ShaderMaterial({
		uniforms: {
			time: {	value: 0	},
			resolution: { value: new THREE.Vector2(	window.innerWidth, window.innerHeight )	}
		},
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent: true,
		// blending: THREE.AdditiveBlending,
		// fog: true,
		wireframe: true
	});
	_box = new THREE.Mesh( _geometry, _material );
	_world.add( _box );



	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_box.material.uniforms.time.value = _stepTime * 0.001;
	}

	function generateEffects(){
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
		// _world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.LineShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		// _world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.RGBNoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		//_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.BlurShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass( _effect );

	}
}





