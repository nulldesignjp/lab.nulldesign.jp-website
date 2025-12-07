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

		this.pow = 1;

		var _dl = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_dl.position.set(0,0,100);
		this.world.add( _dl );

		var _t = this;

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

		_effect.uniforms.aperture.value = 0.025;
		_effect.uniforms.maxblur.value = 32.0;
		_effect.uniforms.focus.value = 1.0;

		// $(window).on('mousemove',function(e){
		// 	_effect.uniforms.focus.value = e.originalEvent.pageY / window.innerHeight;
		// 	//console.log( _effect.uniforms.focus.value )
		// })


		var _material = new THREE.ShaderMaterial( {
			uniforms: {
				time: {type:'f',value:0}
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			//wireframe: true
   		});

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 1000; i++ )
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


		var _p = [];
		for( var i = 0; i < 16; i++ )
		{
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			var _r = 1.0 - Math.random() * Math.random();
			_r *= 2000;
			var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			var _y = Math.sin( _rad0 ) * _r;
			var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
			_p[i] = new THREE.Vector3(_x,_y,_z);
		}

		var _geometry = new THREE.Geometry();
		var _l = SplineCurve3D( _p, 256 );
		var len = _l.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i] = new THREE.Vector3( _l[i].x, _l[i].y, _l[i].z );
		}

		var _material = new THREE.LineBasicMaterial({
			color: 0xFFFFFF
		});
		this.line = new THREE.Line( _geometry, _material );
		this.world.add( this.line );

		var _geometry = new THREE.IcosahedronGeometry(15,1);
		var _material = new THREE.MeshBasicMaterial({wireframe:true});
		this.ball = new THREE.Mesh( _geometry, _material );
		this.world.add( this.ball );


		var _gh = new THREE.GridHelper( 2000, 100 );
		this.world.add( _gh );


		this.world.controls.enabled = false;

		this.count = 0;

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			//
			var len = this.line.geometry.vertices.length;
			this.count += this.pow;


			if( this.count <= 0 || this.count >= len )
			{
				this.pow *= -1;
			}
			this.world.focus.copy( this.line.geometry.vertices[this.count] );

			this.ball.position.copy( this.line.geometry.vertices[this.count] );

			var _distance = this.world.camera.far;
			_distance *= 0.125;

			var _x = this.world.camera.position.x;
			var _y = this.world.camera.position.y;
			var _z = this.world.camera.position.z;
			var _dx = this.world.focus.x - _x;
			var _dy = this.world.focus.y - _y;
			var _dz = this.world.focus.z - _z;

			var _dist = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
			var _rDist = _dist - _distance;
			var _targetX = this.world.camera.position.x + _dx / _distance * _rDist;
			var _targetY = this.world.camera.position.y + _dy / _distance * _rDist;
			var _targetZ = this.world.camera.position.z + _dz / _distance * _rDist;

			this.world.camera.position.x += ( _targetX - this.world.camera.position.x ) * 0.5;
			this.world.camera.position.y += ( _targetY - this.world.camera.position.y ) * 0.5;
			this.world.camera.position.z += ( _targetZ - this.world.camera.position.z ) * 0.5;

		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();

var _pr = new Practice();

