/*
	engine.js
*/

window.onload = function(){

	var _tree;

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	generateEffects();

	loop(0);

	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
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
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.RGBNoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass( _effect );
	}
}
