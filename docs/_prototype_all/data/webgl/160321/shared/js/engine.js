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

		this.world.renderer.gammaInput = true;
		this.world.renderer.gammaOutput = true;

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
			var len = 1000;
			var _geometry = new THREE.BufferGeometry();
			var _position = new Float32Array( len * 3 * 3 );
			var _vector = new Float32Array( len * 3 * 3 );
			var _index = new Float32Array( len * 3 );
			var _normals = new Float32Array( len * 3 * 3 );
			var _colors = new Float32Array( len * 3 * 3 );

			var pA = new THREE.Vector3();
			var pB = new THREE.Vector3();
			var pC = new THREE.Vector3();

			var cb = new THREE.Vector3();
			var ab = new THREE.Vector3();

			for( var i = 0; i < len * 3 * 3; i++ )
			{
				var _rad0 = Math.random() * Math.PI * 2.0;
				var _rad1 = Math.random() * Math.PI * 2.0;
				var _r = 500 * Math.random();
				var _x = - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				var _y = Math.sin( _rad0 ) * _r;
				var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

				var _distScale = _r / 500;

				var _rad0 = Math.random() * Math.PI * 2.0;
				var _rad1 = Math.random() * Math.PI * 2.0;
				var _r0 = Math.random() * 100 * _distScale + 16;
				_position[ i * 3 * 3 + 0 ] = _x - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 1 ] = _y + Math.sin( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 2 ] = _z + Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r0;
				var _rad0 = Math.random() * Math.PI * 2.0;
				var _rad1 = Math.random() * Math.PI * 2.0;
				var _r0 = Math.random() * 100 * _distScale + 16;
				_position[ i * 3 * 3 + 3 ] = _x - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 4 ] = _y + Math.sin( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 5 ] = _z + Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r0;
				var _rad0 = Math.random() * Math.PI * 2.0;
				var _rad1 = Math.random() * Math.PI * 2.0;
				var _r0 = Math.random() * 100 * _distScale + 16;
				_position[ i * 3 * 3 + 6 ] = _x - Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 7 ] = _y + Math.sin( _rad0 ) * _r0;
				_position[ i * 3 * 3 + 8 ] = _z + Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r0;

				// _index[ i * 3 * 3 * 3 + j ] = i / ( len * 3 );

				var ax = _position[ i * 3 * 3 + 0 ];
				var ay = _position[ i * 3 * 3 + 1 ];
				var az = _position[ i * 3 * 3 + 2 ];

				var bx = _position[ i * 3 * 3 + 3 ];
				var by = _position[ i * 3 * 3 + 4 ];
				var bz = _position[ i * 3 * 3 + 5 ];

				var cx = _position[ i * 3 * 3 + 6 ];
				var cy = _position[ i * 3 * 3 + 7 ];
				var cz = _position[ i * 3 * 3 + 8 ];

				//	point to face
				pA.set( ax, ay, az );
				pB.set( bx, by, bz );
				pC.set( cx, cy, cz );

				cb.subVectors( pC, pB );
				ab.subVectors( pA, pB );
				cb.cross( ab );

				cb.normalize();

				var nx = cb.x;
				var ny = cb.y;
				var nz = cb.z;

				_normals[ i * 3 * 3 + 0 ] = nx;
				_normals[ i * 3 * 3 + 1 ] = ny;
				_normals[ i * 3 * 3 + 2 ] = nz;

				_normals[ i * 3 * 3 + 3 ] = nx;
				_normals[ i * 3 * 3 + 4 ] = ny;
				_normals[ i * 3 * 3 + 5 ] = nz;

				_normals[ i * 3 * 3 + 6 ] = nx;
				_normals[ i * 3 * 3 + 7 ] = ny;
				_normals[ i * 3 * 3 + 8 ] = nz;

				_colors[ i * 3 * 3 + 0 ] = Math.random();
				_colors[ i * 3 * 3 + 1 ] = Math.random();
				_colors[ i * 3 * 3 + 2 ] = Math.random();

				_colors[ i * 3 * 3 + 3 ] = Math.random();
				_colors[ i * 3 * 3 + 4 ] = Math.random();
				_colors[ i * 3 * 3 + 5 ] = Math.random();

				_colors[ i * 3 * 3 + 6 ] = Math.random();
				_colors[ i * 3 * 3 + 7 ] = Math.random();
				_colors[ i * 3 * 3 + 8 ] = Math.random();
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
			// _geometry.addAttribute( 'randomSeed', new THREE.BufferAttribute( _index, 1 ) );
			_geometry.addAttribute( 'color', new THREE.BufferAttribute( _colors, 3 ) );
			_geometry.addAttribute( 'normal', new THREE.BufferAttribute( _normals, 3 ) );

			var _material = new THREE.ShaderMaterial({
				uniforms: this.uniforms,
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				transparent: true,
				depthTest: false,
				depthWrite: false
			});

			// var _material = new THREE.MeshPhongMaterial( {
			// 		color: 0xFFFFFF, ambient: 0xCCCCCC, specular: 0xffffff, shininess: 250,
			// 		side: THREE.DoubleSide, vertexColors: THREE.VertexColors
			// 	} );

			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );

			var _material = new THREE.ShaderMaterial({
				uniforms: _t.uniforms,
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				transparent: true,
				depthTest: false,
				depthWrite: false,
				//opacity: 0.1,
				blending: THREE.AdditiveBlending,
				side: THREE.DoubleSide,
				//vertexColor: THREE.VertexColors,
				color: 0xFFFFFF
			});

			_t.line = new THREE.Mesh( _geometry, _material );
			_t.world.add( _t.line );
		}

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			_t.uniforms.time.value += 0.1;
			//_t.line.geometry.attributes.position.needsUpdate = true;
			//_t.points.geometry.attributes.position.needsUpdate = true;


		}
	}

	return Practice;
})();

var _pr = new Practice();

