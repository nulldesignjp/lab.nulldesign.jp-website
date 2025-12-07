/*
	engine.js
*/

window.onload = function(){

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	// _world.controls.enabled = false;
	// _world.controls.autoRotate = false;
	_world.camera.position.set( 0, 0, 100 );
	generateEffects();

	loop(0);

	$('#webglView').css({
		'display':'none'
	})
	$('#siteHead').css({
		'display':'none'
	})

	//	これだ
	html2canvas($("#contenteMain")[0], {
			backgroundColor: null,
			width: $('#contenteMain').width(),
			height: $('#contenteMain').height()
		}).then(canvas => {
	    //document.body.appendChild(canvas)
	    $('#contenteMain').append( canvas );

	    $(canvas).css({
	    	'margin': ($('#contenteMain').height() + 20) + 'px 0 0 0'
	    });
	});




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

		// var _effect = new THREE.ShaderPass( THREE.NoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _effect.uniforms.time.value = 0;
		// _world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.LineNoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _world.addPass( _effect );
	}

}
