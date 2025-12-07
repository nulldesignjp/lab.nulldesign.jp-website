/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView', true);
		this.world.camera.position.z = 1600;
		this.world.controls.autoRotate = false;

		var _dl = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_dl.position.set(0,0,100);
		this.world.add( _dl );

		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load( 'shared/img/IMG_0612.jpg', function(texture){
			var _geometry = new THREE.PlaneGeometry( 640, 854, 1, 1 );
			var _material = new THREE.MeshBasicMaterial({
				map: texture
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			_t.world.add( _mesh );
		});

		var _effect = new THREE.BokehPass( _t.world.scene, _t.world.camera, {
			focus: 		1.0,
			aperture:	0.025,	//	0.025 = 1.0 / 40;
			maxblur:	1.0,
			width: window.innerWidth,
			height: window.innerHeight
		} );
		this.world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.BokehShader );
		this.world.addPass( _effect );

		_effect.uniforms.aperture.value = 0.02;


		var _material = new THREE.ShaderMaterial( {
			uniforms: {
				time: {type:'f',value:0}
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			//wireframe: true
   		});

		for( var i = 0; i < 128; i++ )
		{
			var _arr = [];
			for( var j = 0; j < 16; j++ )
			{
				var _x = (Math.random()-.5)*60;
				var _y = (Math.random()-.5)*60;
				var _z = (Math.random()-.5)*60;
				_arr.push( new THREE.Vector3( _x, _y, _z ) );
			}
			var _geometry = new THREE.ConvexGeometry( _arr );
			var _material = new THREE.MeshPhongMaterial({
				shading: THREE.FlatShading
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			var _r = 1.0 - Math.random() * Math.random();
			_r *= 1000;
			_mesh.position.x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			_mesh.position.y = Math.sin( _rad0 ) * _r;
			_mesh.position.z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

			this.world.add( _mesh );

		}

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 3000; i++ )
		{
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			var _r = 1.0 - Math.random() * Math.random();
			_r *= 2000;
			var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			var _y = Math.sin( _rad0 ) * _r;
			var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
			_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
		}
		var _material = new THREE.PointsMaterial({
			size: 16
		});
		var _points = new THREE.Points( _geometry, _material );
		this.world.add( _points );

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();

var _pr = new Practice();

