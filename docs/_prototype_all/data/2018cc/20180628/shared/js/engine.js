/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _domList = [];
	
	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 50, 500 );

	_world.controls.autoRotate = false;
	_world.controls.autoRotateSpeed = 0.0625;
	_world.controls.enableZoom = false;
	_world.controls.enabled = true;

	_world.directional.castShadow = true;
	_world.directional.shadow.mapSize.width = 1024;
	_world.directional.shadow.mapSize.height = 1024;
	_world.directional.shadow.camera.near = 0.5;
	_world.directional.shadow.camera.far = 1600;
	_world.directional.shadow.camera.top = 800;
	_world.directional.shadow.camera.bottom = -800;
	_world.directional.shadow.camera.left = -800;
	_world.directional.shadow.camera.right = 800;

	//	Only MeshStandardMaterial and MeshPhysicalMaterial are supported.
	// var width = 1000;
	// var height = 5;
	// var intensity = 1;
	// var rectLight = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
	// rectLight.position.set( 0, 50, 100 );
	// rectLight.lookAt( 0, 0, 0 );
	// rectLight.castShadow = true;
	// _world.add( rectLight )

	// var _rectLightHelper = new THREE.RectAreaLightHelper( rectLight );
	// _world.add( _rectLightHelper );

		generateEffects();

		var _p = new THREE.PointLight( 0x336699, 1.0 );
		_world.add( _p );
		_p.position.x = 0;
		_p.position.y = 30;
		_p.position.z = 100;
		//_p.castShadow = true;
		var _pointLightHelper = new THREE.PointLightHelper( _p, 10 );
		_world.add( _pointLightHelper );


		var _uniforms = {
			time: {value:0},
			planeColor: {value: new THREE.Color(1.0,1.0,1.0) },
			lightPosition: {value: _world.directional.position },
			lightColor: {value: _world.directional.color },
			ambientColor: {value: _world.ambient.color },
			fogColor: {value: _world.scene.fog.color },
			fogNear: {value: _world.scene.fog.near },
			fogFar: {value: _world.scene.fog.far },
		}



	var _geometry = new THREE.BoxGeometry( 3200, 3200, 100, 1, 1, 1 );
	_geometry.rotateX( - Math.PI * 0.5 );
	var _material = new THREE.MeshLambertMaterial({color: 0x999999});
	var _floor = new THREE.Mesh( _geometry, _material );
	_world.add( _floor );
	_floor.position.y = -50;
	_floor.receiveShadow = true;




	var _geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 );
	var _material = new THREE.MeshBasicMaterial();
	var _p0 = new THREE.Mesh( _geometry, _material );
	_p0.castShadow = true;
	_p0.receiveShadow = true;
	_world.add( _p0 );
	_p0.position.x = -210;
	_p0.position.y = 30;
	genDom( _p0, 'MeshBasicMaterial');

	var _geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 );
	var _material = new THREE.MeshLambertMaterial();
	var _p1 = new THREE.Mesh( _geometry, _material );
	_p1.castShadow = true;
	_p1.receiveShadow = true;
	_world.add( _p1 );
	_p1.position.x = -140;
	_p1.position.y = 30;
	genDom( _p1, 'MeshLambertMaterial');

	var _geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 );
	var _material = new THREE.MeshPhongMaterial();
	var _p2 = new THREE.Mesh( _geometry, _material );
	_p2.castShadow = true;
	_p2.receiveShadow = true;
	_world.add( _p2 );
	_p2.position.x = - 70;
	_p2.position.y = 30;
	genDom( _p2, 'MeshPhongMaterial');

	var _geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 );
	var _material = new THREE.MeshStandardMaterial();
	var _p3 = new THREE.Mesh( _geometry, _material );
	_p3.castShadow = true;
	_p3.receiveShadow = true;
	_world.add( _p3 );
	_p3.position.x = - 0;
	_p3.position.y = 30;
	genDom( _p3, 'MeshStandardMaterial');

	var _geometry = new THREE.BoxGeometry( 50, 50, 50, 1, 1, 1 );
	var _material = new THREE.MeshPhysicalMaterial();
	var _p4 = new THREE.Mesh( _geometry, _material );
	_p4.castShadow = true;
	_p4.receiveShadow = true;
	_world.add( _p4 );
	_p4.position.x = 70;
	_p4.position.y = 30;
	genDom( _p4, 'MeshPhysicalMaterial');

	var _geometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
	var _material = new THREE.ShaderMaterial({
		uniforms: _uniforms,
		vertexShader:   document.getElementById( 'lambertVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'lambertFragmentShader' ).textContent,
		transparent: true,
		//wireframe: true,
		fog: true,
	});
	var _p5 = new THREE.Mesh( _geometry, _material );
	_p5.castShadow = true;
	_p5.receiveShadow = true;
	_world.add( _p5 );
	_p5.position.x = 140;
	_p5.position.y = 30;
	genDom( _p5, 'ShaderMaterial:Lambert');

	var _geometry = new THREE.BoxBufferGeometry( 50, 50, 50 );
	var _material = new THREE.ShaderMaterial({
		uniforms: _uniforms,
		vertexShader:   document.getElementById( 'phongVertexShader' ).textContent,
		fragmentShader: document.getElementById( 'phongFragmentShader' ).textContent,
		transparent: true,
		//wireframe: true,
		fog: true,
	});
	var _p6 = new THREE.Mesh( _geometry, _material );
	_p6.castShadow = true;
	_p6.receiveShadow = true;
	_world.add( _p6 );
	_p6.position.x = 210;
	_p6.position.y = 30;
	genDom( _p6, 'ShaderMaterial:Phong');







	// particleUniforms = {
	// 	time: { value: 0 },
	// 	texturePosition: {	value: null	},
	// 	textureVelocity: {	value: null	},
	// 	backbuffer: { value: null	},

	// 	'planeColor': {type: "c", value: new THREE.Color(0.1,0.6,0.9) },
	// 	'lightPosition': {type: "v3", value: _world.directional.position },
	// 	'lightColor': {type: "c", value: _world.directional.color },
	// 	'ambientColor': {type: "c", value: _world.ambient.color },
	// 	'fogColor': { type: "c", value: _world.scene.fog.color },
	// 	'fogNear': { type: "f", value: _world.scene.fog.near },
	// 	'fogFar': { type: "f", value: _world.scene.fog.far },
	// }

	// var _geometry = generateGeometry();
	// var _material = new THREE.ShaderMaterial({
	// 	uniforms: particleUniforms,
	// 	vertexShader:   document.getElementById( 'boxVertexShader' ).textContent,
	// 	fragmentShader: document.getElementById( 'boxFragmentShader' ).textContent,
	// 	transparent: true,
	// 	//wireframe: true,
	// 	fog: true,
	// 	//blending: THREE.AdditiveBlending,
	// });
	// var _particles = new THREE.Mesh( _geometry, _material );
	// _world.add( _particles );

	//	shadow
	// _particles.castShadow = true;
	// _particles.receiveShadow = true;
	// _world.renderer.shadowMapEnabled = true;
	// _world.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	loop(0);



	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

		_p.position.x = Math.sin( _stepTime * 0.001 ) * 500;

		var len = _domList.length;
		for( var i = 0; i < len; i++ ){
			var _mesh = _domList[i].mesh;
			var _dom = _domList[i].dom;
			var _pos = _world.getWorldToScreen2D( _mesh );

			_pos.x /= window.devicePixelRatio;
			_pos.y /= window.devicePixelRatio;
			_dom.css('left', _pos.x + 'px');
			_dom.css('top', _pos.y + 'px');
		}

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

		var _effect = new THREE.ShaderPass( THREE.RGBNoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass( _effect );

		//_world.addPass(new THREE.BloomPass(8.0, 25, 4.0, 1024))
	}

	function genDom( _mesh, _label ){

		var _dom = $('<div>').css({
			'position': 'fixed',
			'left':'0',
			'top':'0',
			'margin':'-10px 0 0 -100px',
			'z-index':'1000',
			'width': '200px',
			'height': '20px',
			'border': '1px solid #CCC',
			'background': 'rgba(0,0,0,0.6)',
			'font-size': '14px',
			'font-family':'Arial',
			'text-align':'center',
			'font-weight':'bold',
			'opacity':'0,8'
		}).text( _label );
		var _obj = {
			mesh: _mesh,
			dom: _dom
		};
		$('body').append(_dom)
		_domList.push( _obj );
	}
}