/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.pointNum = 16;
		this.lineNum = 16;
		this.division = 256;
		this.lines = [];

		this.particleNums = 100000;
		this.points;

		//	PROP
		this.world = new world('webglView');
		this.world.renderer.shadowMap.enabled = true;
		this.world.renderer.shadowMapSoft = false;

		this.world.camera.position.z = 1000;
		this.world.controls.minDistance = 10;
		this.world.controls.maxDistance = 3200 + 1600;

		this.world.controls.autoRotate = false;

		console.log(this.world.renderer)


		var _t = this;
		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_light.position.set( 0, 0, 800 );
		this.world.add( _light );

		var _light = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
		_light.castShadow = true;
		_light.position.set( 1,1,1 );
		this.world.add( _light );
		_light.shadow.camera.near = -10;
		_light.shadow.camera.far = 10;

		var spotLight = new THREE.SpotLight( 0xffffff );
		spotLight.position.set( 1000, 1000, 1000 );

		spotLight.castShadow = true;

		spotLight.shadowMapWidth = 1024;
		spotLight.shadowMapHeight = 1024;

		spotLight.shadowCameraNear = 500;
		spotLight.shadowCameraFar = 4000;
		spotLight.shadowCameraFov = 30;

		this.world.scene.add( spotLight );

		this.clock = new THREE.Clock( true );
		this.clock.start();

		this.count = 0;

		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load('shared/img/spark1.png',function(texture){
			var _geometry = new THREE.BufferGeometry();
			var _vertices = new Float32Array( _t.particleNums * 3 );
			var _vector = new Float32Array( _t.particleNums );
			var _scale = new Float32Array( _t.particleNums );
			for( var i = 0; i < _t.particleNums; i++ )
			{
				_vertices[ i * 3 + 0 ] = 0;
				_vertices[ i * 3 + 1 ] = 0;
				_vertices[ i * 3 + 2 ] = 0;

				_vector[i] = Math.random();
				_scale[i] = Math.random() * Math.random();
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );
			_geometry.addAttribute( 'vector', new THREE.BufferAttribute( _vector, 1 ) );
			_geometry.addAttribute( 'customScale', new THREE.BufferAttribute( _scale, 1 ) );

			var _material = new THREE.ShaderMaterial({
				uniforms: {
					time: { type: 'f', value: 0.0 },
					texture: {type: 't', value: texture },
					camera: {type:'v3',value: _t.world.camera.position}
				},
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				blending: THREE.AdditiveBlending,
				transparent: true,
				depthTest: false
			});

			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );

			_t.points.visible = false;

			_t.loop();
		});


		var _geometry = new THREE.PlaneGeometry(3000,1000,100,100);
		var _material = new THREE.MeshPhongMaterial();
		this.plane= new THREE.Mesh( _geometry, _material );
		this.plane.receiveShadow = true;
		this.world.add( this.plane );

		console.log( this.plane)

		this.boxs = [];


		for( var i = 0; i < 16; i++ )
		{
			var _geometry = new THREE.BoxGeometry(50, 50, 50, 1, 1, 1);
			var _material = new THREE.MeshPhongMaterial();
			this.box= new THREE.Mesh( _geometry, _material );
			this.world.add( this.box );
			this.box.castShadow = true;
			//this.box.receiveShadow = true;
			this.box.position.set( Math.random() * 800 - 400, Math.random() * 800 - 400, 50 );
			this.boxs.push( this.box );
		}

		//this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var _list = this.points.geometry.attributes.position.array;
			var _plist = this.points.geometry.attributes.vector.array;
			var len = _list.length / 3;
			var len0 = this.lines.length;
			for( var i = 0; i < len; i++ )
			{
				_list[ i * 3 + 0 ] = i%3000 - 1500;
				_list[ i * 3 + 1 ] = _plist[i] * 1000-500;
				_list[ i * 3 + 2 ] = 20;
			}

			this.points.geometry.attributes.position.needsUpdate = true;

			this.count ++;

			var len = this.boxs.length;
			for( var i = 0; i < len; i++ )
			{
				var _rad = ( i + this.count * 0.01 ) / len * Math.PI * 2;
				this.boxs[i].position.z = Math.sin( _rad ) * 50;
			}

			//	console.log( this.points.geometry.attributes)
			//	this.points.geometry.attributes.vector.needsUpdate = true;

			//	console.log( this.clock.getDelta() )
			//	console.log( this.clock.oldTime, this.clock.startTime, this.clock.startTime - this.clock.oldTime );

		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

