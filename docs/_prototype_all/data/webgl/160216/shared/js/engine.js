/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView', true);
		this.world.camera.position.z = 1000;
		this.world.controls.autoRotate = false;

		var _dl = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_dl.position.set(0,0,0);
		this.world.add( _dl );

		var _t = this;
		//	strength, kernelSize, sigma, resolution
		//	合成次の係数,固定値,ぼかしの強さ、解像度
		//	new THREE.BloomPass(4.0, 25, 2.0, 512)
		var _effect = new THREE.BloomPass(4.0, 16.0, 4.0, 512);
		this.world.addPass( _effect );
		console.log( _effect )


		var _material = new THREE.ShaderMaterial( {
			uniforms: {
				time: {type:'f',value:0}
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			//wireframe: true
   		});

		for( var i = 0; i < 256; i++ )
		{
			var _arr = [];
			for( var j = 0; j < 16; j++ )
			{
				var _x = (Math.random()-.5)*100;
				var _y = (Math.random()-.5)*100;
				var _z = (Math.random()-.5)*100;
				_arr.push( new THREE.Vector3( _x, _y, _z ) );
			}
			var _geometry = new THREE.ConvexGeometry( _arr );
			var _material = new THREE.MeshPhongMaterial({
				shading: THREE.FlatShading,
				color: 0x6699CC,
				//wireframe:true
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			var _r = 1.0 - Math.random() * Math.random();
			_r *= 1600;
			var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			var _y = Math.sin( _rad0 ) * _r;
			var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
			_mesh.position.x = _x;
			_mesh.position.y = _y;
			_mesh.position.z = _z;

			this.world.add( _mesh );

		}

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

