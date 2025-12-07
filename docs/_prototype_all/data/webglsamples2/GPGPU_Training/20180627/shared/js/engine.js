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

	_world.controls.enabled = true;
	generateEffects();

	particleUniforms = {
		time: { value: 0 },
		texturePosition: {	value: null	},
		textureVelocity: {	value: null	},
		backbuffer: { value: null	},

		'planeColor': {type: "c", value: new THREE.Color(1.0,1.0,1.0) },
		'lightPosition': {type: "v3", value: _world.directional.position },
		'lightColor': {type: "c", value: _world.directional.color },
		'ambientColor': {type: "c", value: _world.ambient.color },
		'fogColor': { type: "c", value: _world.scene.fog.color },
		'fogNear': { type: "f", value: _world.scene.fog.near },
		'fogFar': { type: "f", value: _world.scene.fog.far },
	}

	var _geometry = generateGeometry();
	var _material = new THREE.ShaderMaterial({
		uniforms: particleUniforms,
		vertexShader:   document.getElementById( 'boxVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'boxFragmentShader' ).textContent,
		transparent: true,
		//wireframe: true,
		fog: true
	});
	var _particles = new THREE.Mesh( _geometry, _material );
	_world.add( _particles );

	//	shadow
	// _particles.castShadow = true;
	// _particles.receiveShadow = true;
	// _world.renderer.shadowMapEnabled = true;
	// _world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
	// _world.directional.castShadow = true;
	// _world.directional.shadow.mapSize.width = 1024;
	// _world.directional.shadow.mapSize.height = 1024;
	// _world.directional.shadow.camera.near = 0.5;
	// _world.directional.shadow.camera.far = 1600;
	// _world.directional.shadow.camera.top = 500;
	// _world.directional.shadow.camera.bottom = -500;
	// _world.directional.shadow.camera.left = -500;
	// _world.directional.shadow.camera.right = 500;
			

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

	positionUniforms.time = {	value: 0.0	};
	velocityUniforms.time = {	value: 0.0	};

	velocityVariable.material.defines.randomX = Math.random() * 100.0;
	velocityVariable.material.defines.randomY = Math.random() * 100.0;
	velocityVariable.material.defines.randomZ = Math.random() * 100.0;

	var error = gpuCompute.init();
	if( error !== null )
	{
		console.error( error );
	}

	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

		gpuCompute.compute();
		velocityUniforms.time.value = _stepTime * 0.001;

		_particles.material.uniforms.texturePosition.value = gpuCompute.getCurrentRenderTarget( positionVariable ).texture;
		_particles.material.uniforms.textureVelocity.value = gpuCompute.getCurrentRenderTarget( velocityVariable ).texture;
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
		//_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		//_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.RGBNoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		//_world.addPass( _effect );
	}

	function initDataField( texturePosition, textureVelocity ){
		//	データを一度取り出す
		var posArray = texturePosition.image.data;
		var velArray = textureVelocity.image.data;

		//	パーティクルの初期位置と、初期速度をランダムに設定
		for( var k = 0, kl = posArray.length; k < kl; k += 4 ){
			var rad = Math.random() * Math.PI * 2.0;
			var rad2 = Math.random() * Math.PI * 2.0;
			var r = Math.random() * 50;
			var x = Math.cos(rad) * Math.cos(rad2) * r;
			var y = Math.cos(rad) * Math.sin(rad2) * r;
			var z = Math.sin(rad) * r;

			// var x = THREE.Math.randFloatSpread( 50 );
			// var y = THREE.Math.randFloatSpread( 50 );
			// var z = THREE.Math.randFloatSpread( 50 );

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

	function generateGeometry(){
		var _box = new THREE.BoxBufferGeometry( 1, 6, 1 );
		//	var _box = new THREE.ConeBufferGeometry( 3, 6, 3 );
		_box.rotateZ( - Math.PI * 0.5 );

		var _geometry	= new THREE.BufferGeometry();
		var _position	= new Float32Array( PARTICLES * _box.attributes.position.count * _box.attributes.position.itemSize );
		var _normal		= new Float32Array( PARTICLES * _box.attributes.normal.count * _box.attributes.normal.itemSize );
		var _uvs		= new Float32Array( PARTICLES * _box.attributes.uv.count * _box.attributes.uv.itemSize );
		var _index		= new Uint16Array( PARTICLES * _box.index.count * _box.index.itemSize );

		var _idx = 0;
		var _idy = 0;
		var _idz = 0;
		var _idw = 0;
		var _ida = 0;

		//	position and normal
		for( var i = 0; i < PARTICLES; i++ )
		{
			//	position
			for( var j = 0; j < _box.attributes.position.count * _box.attributes.position.itemSize; j++ )
			{
				_position[ _idx++ ] = _box.attributes.position.array[j];
				_normal[ _idz++ ] = _box.attributes.normal.array[j];
			}
		}

		//	index
		for( var i = 0; i < PARTICLES; i++ )
		{
			for( var j = 0; j < _box.index.count * _box.index.itemSize; j++ )
			{
				_index[ _ida++ ] = _box.index.array[j] + _box.attributes.position.count * i;
			}
		}

		var _idw = 0;
		for( var j = 0; j < WIDTH; j++ )
		{
			for( i = 0; i < WIDTH; i++ )
			{
				for( var k = 0; k < _box.attributes.position.count; k++ ){
					_uvs[ _idw++ ] = i / ( WIDTH - 1 );
					_uvs[ _idw++ ] = j / ( WIDTH - 1 );
				}
			}
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, _box.attributes.position.itemSize ) );
		_geometry.addAttribute( 'normal', new THREE.BufferAttribute( _normal, _box.attributes.normal.itemSize ) );
		_geometry.addAttribute( 'uv', new THREE.BufferAttribute( _uvs, _box.attributes.uv.itemSize ) );
		_geometry.setIndex( new THREE.BufferAttribute( _index, 1 ) );

		return _geometry;
	}
}
