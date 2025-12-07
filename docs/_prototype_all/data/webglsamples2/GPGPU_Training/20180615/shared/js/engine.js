/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _particles;

	//	GPU prop
	var WIDTH = 512;
	var PARTICLES = WIDTH * WIDTH;
	var gpuCompute;
	var velocityVariable,	velocityUniforms;
	var positionVariable,	positionUniforms;
	var particleUniforms;
	var effectController;


	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	generateEffects();


	/*
		ここからGPGPUの用意
	*/	
	gpuCompute = new GPUComputationRenderer( WIDTH, WIDTH, _world.renderer );

	//	演算領域の確保
	var dtPosition = gpuCompute.createTexture();
	var dtVelocity = gpuCompute.createTexture();

	initDataField( dtPosition, dtVelocity );

	//	shaderプログラムのアタッチ
	velocityVariable = gpuCompute.addVariable( 'textureVelocity', document.getElementById('computeShaderVelocity'). textContent, dtVelocity );
	positionVariable = gpuCompute.addVariable( 'texturePosition', document.getElementById('computeShaderPosition'). textContent, dtPosition );

	//	おまじない
	gpuCompute.setVariableDependencies( velocityVariable, [ positionVariable, velocityVariable ] );
	gpuCompute.setVariableDependencies( positionVariable, [ positionVariable, velocityVariable ] );

	positionUniforms = positionVariable.material.uniforms;
	velocityUniforms = velocityVariable.material.uniforms;

	positionUniforms.time = {	value: 001};
	velocityUniforms.time = {	value: 001};

	var error = gpuCompute.init();
	if( error !== null )
	{
		console.error( error );
	}





	/*
		ここからPRTICLE本体
	*/
	var _geometry = new THREE.BufferGeometry();
	var _position = new Float32Array( PARTICLES * 3 );
	var p = 0;
	for( var i = 0; i < PARTICLES; i++ ){
		_position[ p++ ] = 0;
		_position[ p++ ] = 0;
		_position[ p++ ] = 0;
	}

	var _uvs = new Float32Array( PARTICLES * 2 );
	p = 0;
	for( var j = 0; j < WIDTH; j++ )
	{
		for( i = 0; i < WIDTH; i++ )
		{
			_uvs[ p++ ] = i / ( WIDTH - 1 );
			_uvs[ p++ ] = j / ( WIDTH - 1 );
		}
	}

	_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
	_geometry.addAttribute( 'uv', new THREE.BufferAttribute( _uvs, 2 ) );

	particleUniforms = {
		time: { value: 0 },
		texturePosition: {	value: null	},
		textureVelocity: {	value: null	},
		cameraConstant: {	value: getCameraConstant( _world.camera )	},

		'planeColor': {type: "c", value: new THREE.Color(1.0,1.0,1.0) },
		'lightPosition': {type: "v3", value: _world.directional.position },
		'lightColor': {type: "c", value: _world.directional.color },
		'ambientColor': {type: "c", value: _world.ambient.color },
		'fogColor': { type: "c", value: _world.scene.fog.color },
		'fogNear': { type: "f", value: _world.scene.fog.near },
		'fogFar': { type: "f", value: _world.scene.fog.far },
	}

	var _material = new THREE.ShaderMaterial({
		uniforms: particleUniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		transparent: true,
		// blending: THREE.AdditiveBlending,
		fog: true
	});
	_material.extensions.drawBuffer = true;
	_particles = new THREE.Points( _geometry, _material );
	_particles.matrixAutoUpdate = false;
	_particles.updateMatrix();
	_world.add( _particles );



	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

		gpuCompute.compute();
		particleUniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
		particleUniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;

		_particles.material.uniforms.time.value = _stepTime * 0.001;
		velocityUniforms.time.value = _stepTime * 0.001;
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

		var _effect = new THREE.ShaderPass( THREE.LineShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_world.addPass( _effect );

	}

	function initDataField( texturePosition, textureVelocity ){
		//	データを一度取り出す
		var posArray = texturePosition.image.data;
		var velArray = textureVelocity.image.data;

		//	パーティクルの初期位置と、初期速度をランダムに設定
		for( var k = 0, kl = posArray.length; k < kl; k += 4 ){
			var x, y, z;
			x = THREE.Math.randFloatSpread( 50 );
			y = THREE.Math.randFloatSpread( 50 );
			z = THREE.Math.randFloatSpread( 50 );

			//	position
			posArray[ k + 0 ] = x;
			posArray[ k + 1 ] = y;
			posArray[ k + 2 ] = z;
			posArray[ k + 3 ] = 0;

			//	velocity
			velArray[ k + 0 ] = THREE.Math.randFloatSpread( 4 );
			velArray[ k + 1 ] = THREE.Math.randFloatSpread( 4 );
			velArray[ k + 2 ] = THREE.Math.randFloatSpread( 4 );
			velArray[ k + 3 ] = 0;
		}
	}

	function getCameraConstant( camera ){
		return window.innerHeight / ( Math.tan( THREE.Math.DEG2RAD * 0.5 * camera.fov ) / camera.zoom )
	}

}





