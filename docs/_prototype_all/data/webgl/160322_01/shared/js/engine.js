/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 1000 );
		this.world.controls.autoRotateSpeed = 0.05;
		//this.world.controls.autoRotate = false;

		this.world.camera.setLens( 35 );
		this.world.camera.updateProjectionMatrix();

		this.world.renderer.gammaInput = true;
		this.world.renderer.gammaOutput = true;

		this.sphere;

		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load('shared/img/circle1.png', function(texture){
			create( texture );
		});

		this.uniforms = {
			time: {type:'f',value:0},
			texture: {type:'t',value:new THREE.TextureLoader().load('shared/img/circle1.png')}
		};

		function create( texture )
		{
			_t.uniforms.texture.value = texture;

			var _geometry = new THREE.IcosahedronGeometry( 100, 0 );
			var _material = new THREE.MeshBasicMaterial({
				color: 0xCCCCCC,
				wireframe: true
			});
			_t.sphere = new THREE.Mesh( _geometry, _material );
			_t.world.add( _t.sphere );

			var _geometry = new THREE.IcosahedronGeometry( 96, 0 );
			var _material = new THREE.MeshNormalMaterial({
				color: 0x333333,
				//wireframe: true
				transparent: true,
				opacity: 0.2,
				shading: THREE.FlatShading
			});
			_t.sphere = new THREE.Mesh( _geometry, _material );
			_t.world.add( _t.sphere );




			var len = 100000;
			var __position = [];
			var __position2 = [];
			for( var i = 0; i < len; i++ )
			{
				var _rad0 = Math.random() * Math.PI * 2;
				var _rad1 = Math.random() * Math.PI * 2;
				var _r = Math.random() * 300 + 100 + i * 5;
				var _x = - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				var _y = Math.sin( _rad0 ) * _r;
				var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
				__position.push( _x );
				__position.push( _y );
				__position.push( _z );
				__position2.push( _x );
				__position2.push( _y );
				__position2.push( _z );
				var len2 = Math.floor( Math.random() * 4 ) + 2;
				for( var j = 0; j < len2; j++ )
				{
					var _rad0 = Math.random() * Math.PI * 2;
					var _rad1 = Math.random() * Math.PI * 2;
					var _r = Math.random() * 200 + 10;
					_x += - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
					_y += Math.sin( _rad0 ) * _r;
					_z += Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

					__position.push( _x );
					__position.push( _y );
					__position.push( _z );
					__position2.push( _x );
					__position2.push( _y );
					__position2.push( _z );

					if( j != len2-1 )
					{
						__position.push( _x );
						__position.push( _y );
						__position.push( _z );
					}
				}
			}

			var len = __position.length;
			var _geometry = new THREE.BufferGeometry();
			var _position = new Float32Array( len );
			for( var i = 0; i < len; i++ )
			{
				_position[i] = __position[i];
			}
			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );

			var _material = new THREE.MeshBasicMaterial({
				color: 0xFFFFFF,
				transparent: true,
				opacity: 0.15
			});
			_t.line = new THREE.LineSegments( _geometry, _material );
			_t.world.add( _t.line );

			var len = __position2.length;
			var _geometry = new THREE.BufferGeometry();
			var _position = new Float32Array( len );
			for( var i = 0; i < len; i++ )
			{
				_position[i] = __position2[i];
			}
			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );

			var _material = new THREE.PointsMaterial({
				color: 0xFFFFFF,
				map: texture,
				size: 15,
				transparent: true,
				depthTest: false,
				depthWrite: false
			});
			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );



		}

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
			// _t.uniforms.time.value += 0.1;

			// var _color = _t.uniforms.baseColor.value;
			// var _colorElement = _color.getHSL();
			// _colorElement.h += 0.00025;

			// _t.uniforms.baseColor.value.setHSL( _colorElement.h, _colorElement.s, _colorElement.l );
		}
	}

	return Practice;
})();

var _pr = new Practice();

