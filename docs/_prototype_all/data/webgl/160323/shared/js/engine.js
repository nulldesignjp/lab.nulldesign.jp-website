/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 1000 );
		this.world.controls.autoRotate = false;
		//this.world.controls.enabled = false;
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

			// var len = 3000;
			// var _position = new Float32Array( len * 3 );
			// var _geometry = new THREE.BufferGeometry();
			// for( var i = 0; i < len; i++ )
			// {
			// 	var _rad0 = Math.random() * Math.PI * 2;
			// 	var _rad1 = Math.random() * Math.PI * 2;
			// 	var _r = window.innerWidth;
			// 	var _x = - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			// 	var _y = Math.sin( _rad0 ) * _r;
			// 	var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
			// 	_position[ i * 3 + 0 ] = _x;
			// 	_position[ i * 3 + 1 ] = _y;
			// 	_position[ i * 3 + 2 ] = 0;
			// }
			// _geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );

			// var _material = new THREE.PointsMaterial({
			// 	color: 0xFFFFFF,
			// 	map: texture,
			// 	size: 15,
			// 	transparent: true,
			// 	depthTest: false,
			// 	depthWrite: false
			// });
			// _t.points = new THREE.Points( _geometry, _material );
			// _t.world.add( _t.points );


			var _tList = [];
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			var _size = _width>_height?_width:_height;
			var _r = _size * 2;
			for( var i = 0; i < 6; i++ )
			{
				var _rad0 = i * Math.PI * 2.0 / 6;
				var _rad1 = ( i + 1 ) * Math.PI * 2.0 / 6;
				var _x0 = Math.cos( _rad0 ) * _r;
				var _y0 = Math.sin( _rad0 ) * _r;
				var _x1 = Math.cos( _rad1 ) * _r;
				var _y1 = Math.sin( _rad1 ) * _r;

				var _offsetX = 1;
				var _offsetY = 1;
				var _triangle = createTriangleData(
					new THREE.Vector2( 0 + _offsetX, 0 + _offsetY ),
					new THREE.Vector2( _x0 + _offsetX, _y0 + _offsetY ),
					new THREE.Vector2( _x1 + _offsetX, _y1 + _offsetY ),
					0
				);

				_tList.push( _triangle );
			}

			var _static = [];

			while( _tList.length )
			{
				var len = _tList.length;
				while( len )
				{
					len --;
					var _tr = _tList.pop();

					if( _tr.numCount < 3 || _tr.numCount < 6 && Math.random() < .5 )
					{
						var _a = _tr.pos.a;
						var _b = _tr.pos.b;
						var _c = _tr.pos.c;
						var _ab = new THREE.Vector2().addVectors( _a, _b ).multiplyScalar( 0.5 );
						var _bc = new THREE.Vector2().addVectors( _b, _c ).multiplyScalar( 0.5 );
						var _ca = new THREE.Vector2().addVectors( _c, _a ).multiplyScalar( 0.5 );   

						var _count = ++ _tr.numCount;

						var _triangle = createTriangleData( _a,	_ca, _ab, _count );
						_tList.unshift( _triangle );
						var _triangle = createTriangleData( _ab, _bc, _b, _count );
						_tList.unshift( _triangle );
						var _triangle = createTriangleData( _ca, _c, _bc, _count );
						_tList.unshift( _triangle );
						var _triangle = createTriangleData( _ab, _ca, _bc, _count );
						_tList.unshift( _triangle );
					} else {
						_static.push( _tr );
					}
				}
			}

			var len = _static.length;
			while( len )
			{
				len --;
				var _tr = _static.pop();

				var _position = new Float32Array( 9 );
				var _color = new Float32Array( 9 );
				var _geometry = new THREE.BufferGeometry();
				_position[0] = _tr.pos.a.x;
				_position[1] = _tr.pos.a.y;
				_position[2] = 0;
				_position[3] = _tr.pos.b.x;
				_position[4] = _tr.pos.b.y;
				_position[5] = 0;
				_position[6] = _tr.pos.c.x;
				_position[7] = _tr.pos.c.y;
				_position[8] = 0;

				_color[0] = Math.random() * 0.5 + 0.5;
				_color[1] = Math.random() * 0.5 + 0.5;
				_color[2] = Math.random() * 0.5 + 0.5;
				_color[3] = Math.random() * 0.5 + 0.5;
				_color[4] = Math.random() * 0.5 + 0.5;
				_color[5] = Math.random() * 0.5 + 0.5;
				_color[6] = Math.random() * 0.5 + 0.5;
				_color[7] = Math.random() * 0.5 + 0.5;
				_color[8] = Math.random() * 0.5 + 0.5;

				_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
				_geometry.addAttribute( 'color', new THREE.BufferAttribute( _color, 3 ) );

				var _material = new THREE.ShaderMaterial({
					vertexShader: document.getElementById('vertexshader').textContent,
					fragmentShader: document.getElementById('fragmentshader').textContent,
					side: THREE.DoubleSide,
					blending: THREE.AdditiveBlending,
					transparent: true,
					opacity: 0.8,
					depthWrite: false
				});

				var _mesh = new THREE.Mesh( _geometry, _material );
				_t.world.add( _mesh );

				//_mesh.rotation.z = Math.PI * 0.05 * ( Math.random()-.5);

				var _rad = (Math.random()-.5) * Math.PI * 2;
				var _cx = ( _tr.pos.a.x + _tr.pos.b.x + _tr.pos.c.x ) / 3;
				var _cy = ( _tr.pos.a.y + _tr.pos.b.y + _tr.pos.c.y ) / 3;
				var _x0 = Math.cos( _rad ) * ( _tr.pos.a.x - _cx ) - Math.sin( _rad ) * ( _tr.pos.a.y - _cy ) + _cx;
				var _y0 = Math.sin( _rad ) * ( _tr.pos.a.x - _cx ) + Math.sin( _rad ) * ( _tr.pos.a.y - _cy ) + _cy;
				var _x1 = Math.cos( _rad ) * ( _tr.pos.b.x - _cx ) - Math.sin( _rad ) * ( _tr.pos.b.y - _cy ) + _cx;
				var _y1 = Math.sin( _rad ) * ( _tr.pos.b.x - _cx ) + Math.sin( _rad ) * ( _tr.pos.b.y - _cy ) + _cy;
				var _x2 = Math.cos( _rad ) * ( _tr.pos.c.x - _cx ) - Math.sin( _rad ) * ( _tr.pos.c.y - _cy ) + _cx;
				var _y2 = Math.sin( _rad ) * ( _tr.pos.c.x - _cx ) + Math.sin( _rad ) * ( _tr.pos.c.y - _cy ) + _cy;

				TweenMax.to(_mesh.geometry.attributes.position.array, 10.8, {
					0: _x0,
					1: _y0,
					3: _x1,
					4: _y1,
					6: _x2,
					7: _y2,
					delay: len * 0.0001 + 3.0,
					onUpdate: function(e){
						e.target.needsUpdate = true;
					},
					onUpdateParams: [ "{self}" ]
				})

				TweenMax.to(_mesh.rotation, 30.8, {
					z: Math.PI * 0.15 * ( Math.random()-.5),
					delay: len * 0.0001 + 3.0
				})
			}


		}
			function createTriangleData(a,b,c,n)
			{
				var _obj = {};
				_obj.pos = {};
				_obj.pos.a = a;
				_obj.pos.b = b;
				_obj.pos.c = c;
				_obj.numCount = n;
				return _obj;
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

