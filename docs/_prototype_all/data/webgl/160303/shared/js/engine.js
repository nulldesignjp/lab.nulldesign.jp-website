/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.renderer.setClearColor( 0xFFFFFF );
		//this.world.scene.fog.color = new THREE.Color( 255,255,255 );

		this.world.camera.position.z = 1000;
		this.world.controls.minDistance = 100;
		this.world.controls.maxDistance = 1600;

		this.world.controls.autoRotate = false;

		//	BG
		var _uniforms = {
			resolution: {type:'v2', value: new THREE.Vector2()	}
		};
		_uniforms.resolution.value.x = window.innerWidth;
		_uniforms.resolution.value.y = window.innerHeight;

		window.addEventListener( 'resize',function(){
			_uniforms.resolution.value.x = window.innerWidth;
			_uniforms.resolution.value.y = window.innerHeight;
		})

		var _geometry = new THREE.PlaneGeometry( 100,100 );
		var _material = new THREE.ShaderMaterial({
			uniforms: _uniforms,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true
		});
		this.bg = new THREE.Mesh( _geometry, _material );
		this.world.add( this.bg );
		this.bg.position.z = 0;


		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load( 'shared/img/circle0.png',function(texture){

			var _len = 1000;

			var _geometry = new THREE.BufferGeometry();
			var _vertices = new Float32Array( _len * 3 );
			var _randomSize = new Float32Array( _len );
			for( var i = 0; i < _len; i++ )
			{
				var _rad0 = Math.random() * Math.PI * 2;
				var _rad1 = Math.random() * Math.PI * 2;
				var _r = ( 1.0 - Math.random() * Math.random() ) * 1600 + 400;
				var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				var _y = Math.sin( _rad0 ) * _r;
				var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

				//	position
				_vertices[ i*3 + 0 ] = _x;
				_vertices[ i*3 + 1 ] = _y;
				_vertices[ i*3 + 2 ] = _z;

				_randomSize[ i ] = Math.random() * 0.99 + 0.01;
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );
			_geometry.addAttribute( 'randomSize', new THREE.BufferAttribute( _randomSize, 1 ) );

			var _material = new THREE.PointsMaterial({color:0x000000,map:texture,transparent:true,opacity:0.5,depthTest:false});

			var _uniforms = {
				volume: {type:'f', value: 1.0	},
				resolution: {type:'v2', value: new THREE.Vector2()	},
				camera: {type:'v3', value: _t.world.camera.position },
				texture: {type:'t', value: texture }
			};
			_uniforms.resolution.value.x = window.innerWidth;
			_uniforms.resolution.value.y = window.innerHeight;
			var _material = new THREE.ShaderMaterial({
				uniforms: _uniforms,
				vertexShader: document.getElementById('pv01').textContent,
				fragmentShader: document.getElementById('pf01').textContent,
				transparent: true,
				depthTest: false,
				//	blending: THREE.AdditiveBlending
			});
			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );
		});

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			this.points.rotation.x += 0.01;
			this.points.rotation.y += 0.01;

			//	console.log( this.clock.getDelta() )
			//	console.log( this.clock.oldTime, this.clock.startTime, this.clock.startTime - this.clock.oldTime );

		}
	}

	return Practice;
})();



var _pr = new Practice();

