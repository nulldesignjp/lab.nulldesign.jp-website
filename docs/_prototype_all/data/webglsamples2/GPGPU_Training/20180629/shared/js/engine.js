/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _eList = [];
	
	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 50, 500 );

	generateEffects();

	// var _p = new THREE.PointLight( 0x336699, 1.0 );
	// _world.add( _p );
	// _p.position.x = 0;
	// _p.position.y = 30;
	// _p.position.z = 100;
	// _p.castShadow = true;
	// var _pointLightHelper = new THREE.PointLightHelper( _p, 10 );
	// _world.add( _pointLightHelper );

	var _geometry = new THREE.BoxGeometry( 3200, 3200, 100, 1, 1, 1 );
	_geometry.rotateX( - Math.PI * 0.5 );
	var _material = new THREE.MeshLambertMaterial({color: 0xCCCCCC});
	var _floor = new THREE.Mesh( _geometry, _material );
	_world.add( _floor );
	_floor.position.y = -50;


	//	shild
	var _uniforms = {
		time: {value:0},
		planeColor: {value: new THREE.Color(1.0,1.0,1.0) },
		lightPosition: {value: _world.directional.position },
		lightColor: {value: _world.directional.color },
		ambientColor: {value: _world.ambient.color },
		fogColor: {value: _world.scene.fog.color },
		fogNear: {value: _world.scene.fog.near },
		fogFar: {value: _world.scene.fog.far },

		//	colorEffect
		effectColor: { value: new THREE.Color() },
		effectTime: {value: 0},
		effectEnabled: {value: false},
		effectPosition: {value:new THREE.Vector3()	}
	}

	var _geometry = new THREE.IcosahedronBufferGeometry( 100, 2 );
	var _material = new THREE.ShaderMaterial({
		uniforms: _uniforms,
		vertexShader:   document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
		transparent: true,
		//wireframe: true,
		fog: true,
	});
	var _barrier = new THREE.Mesh( _geometry, _material );
	_barrier.castShadow = true;
	_barrier.receiveShadow = true;
	_world.add( _barrier );
	_barrier.position.y = 30;

	loop(0);



	window.addEventListener( 'keydown', function(e){

		var _color = new THREE.Color( Math.random(), Math.random(), Math.random() )

		var _geometry = new THREE.IcosahedronGeometry( 3, 1 );
		var _material = new THREE.MeshPhongMaterial({
			color: _color
		});
		var _effect = new THREE.Mesh( _geometry, _material );
		_world.add( _effect );

		_effect.position.x = Math.random() * 300 - 150;
		_effect.position.y = Math.random() * 200;
		_effect.position.z = Math.random() * 300 - 150;

		var _obj = {
			mesh: _effect,
			color: _color
		};

		_eList.push( _obj );
	})



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

		var len = _eList.length;
		while( len )
		{
			len --;
			var _obj = _eList[len];
			var _velocity = _obj.mesh.position.clone();
			_velocity = _velocity.normalize();
			_obj.mesh.position.x -= _velocity.x;
			_obj.mesh.position.y -= _velocity.y;
			_obj.mesh.position.z -= _velocity.z;

			if( _obj.mesh.position.length() < 100.0 )
			{
				_eList.splice( len, 1 );
				impact( _obj );
			}
		}


		if( _uniforms.effectEnabled.value )
		{
			_uniforms.effectTime.value += 1.0 / 60.0;

			if( _uniforms.effectTime.value > 6.0 )
			{
				_uniforms.effectTime.value = 6.0;
				_uniforms.effectEnabled.value = false;
				console.log('static');
			}
		}
	}

	function impact( _obj )
	{

		_uniforms.effectPosition.value = _obj.mesh.position.clone().normalize().multiplyScalar(100.0);

		_uniforms.effectPosition.value.x -= _barrier.position.x;
		_uniforms.effectPosition.value.y -= _barrier.position.y;
		_uniforms.effectPosition.value.z -= _barrier.position.z;

		_world.remove( _obj.mesh );

		_uniforms.effectColor.value = _obj.color;
		_uniforms.effectTime.value = 0.0;
		_uniforms.effectEnabled.value = true;
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

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass( _effect );

	}
}