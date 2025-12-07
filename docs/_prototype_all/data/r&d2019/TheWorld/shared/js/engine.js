/*
	offerdme_lp.js
*/

var offerdme = (function(){

	var style="color:white;background-color:#484848;padding: 3px 6px;";
	window.console.log("%ccreated by hrsk.dev" , style);



	//	utils
	if( location.href.indexOf('https://') != -1 || location.href.indexOf('http://') != -1 )
	{
		window.console.log = function(){/* NOP */};
		window.console.debug = function(){/* NOP */};
		window.console.info = function(){/* NOP */};
		window.console.warn = function(){/* NOP */};
		window.console.error = function(){/* NOP */};
		window.console.timeEnd = function(){/* NOP */};
		window.console.time = function(){/* NOP */};
	}

	//	Props
	var _dom;
	var _world, _field, _clock,_time;
	var _grid,_gridH,_n;

	function init()
	{
		//	WORLD TIME.
		_time = 0;

		//	THREE.JS
		_world = new world( _dom );
		_clock = new THREE.Clock();

		_world.camera.position.y = 10;

		// new THREE.TextureLoader().load('txt.png', function( _texture ){
		// 	var _geometry = new THREE.PlaneGeometry( 1,1,1,1 );
		// 	var _material = new THREE.MeshBasicMaterial({
		// 		map: _texture,
		// 		transparent: true,
		// 		side: THREE.DoubleSide
		// 	});
		// 	var _mesh = new THREE.Mesh( _geometry, _material );
		// 	_mesh.scale.set( _texture.image.width * 0.01, _texture.image.height * 0.01, 1.0 );
		// 	_world.add( _mesh );
		// })



		_n = new SimplexNoise();

		_grid = 255;
		_gridH = 8.0;

	//	odd no
		var _geometry = new THREE.PlaneGeometry( 200, 200, _grid, _grid );
		_geometry.rotateX( - Math.PI * 0.5 );
		var _material = new THREE.MeshBasicMaterial({
			wireframe: true,
			transparent: true,
			opacity: 0.2
		});
		var _mesh = new THREE.Mesh( _geometry, _material );
		//_world.add( _mesh );


		var _gridOne = _geometry.vertices[1].x - _geometry.vertices[0].x;
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _x = i % ( _grid + 1 );
			var _z = Math.floor( i / ( _grid + 1 ) );

			if( _x%2==0 && _z%2==0 )
			{
				var _i00 = _z * ( _grid + 1 ) + _x + 0;
				var _i01 = _z * ( _grid + 1 ) + _x + 1;
				var _i10 = ( _z + 1 ) * ( _grid + 1 ) + _x + 0;
				var _i11 = ( _z + 1 ) * ( _grid + 1 ) + _x + 1;


				{
					var __x = Math.floor( ( _x - _grid ) * .5 );
					_geometry.vertices[ _i00 ].x = __x * _gridOne;
					_geometry.vertices[ _i01 ].x = ( __x + 1.0 ) * _gridOne;
					_geometry.vertices[ _i10 ].x = __x * _gridOne;
					_geometry.vertices[ _i11 ].x = ( __x + 1.0 ) * _gridOne;

					var __z = Math.floor( ( _z - _grid ) * .5 );
					_geometry.vertices[ _i00 ].z = __z * _gridOne;
					_geometry.vertices[ _i01 ].z = __z * _gridOne;
					_geometry.vertices[ _i10 ].z = ( __z + 1 ) * _gridOne;
					_geometry.vertices[ _i11 ].z = ( __z + 1 ) * _gridOne;

					_geometry.vertices[ _i00 ].x += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i01 ].x += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i10 ].x += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i11 ].x += _gridOne * _grid * 0.25;

					_geometry.vertices[ _i00 ].z += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i01 ].z += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i10 ].z += _gridOne * _grid * 0.25;
					_geometry.vertices[ _i11 ].z += _gridOne * _grid * 0.25;
				}


				var _scale = 0.04;
				var _dx = _geometry.vertices[ _i00 ].x;
				var _dz = _geometry.vertices[ _i00 ].z;
				var _h = Math.floor( ( _n.noise( _dx * _scale, _dz * _scale ) * 0.5 + 0.5 ) * _gridH );

				_scale = 0.01
				_h += Math.floor( ( _n.noise( ( _dx + 100.1 ) * _scale, ( _dz - 1.02 ) * _scale ) * 0.5 + 0.5 - 0.5 ) * _gridH * 2.0 );

				_h *= _gridOne;

				//var _h = Math.floor( Math.random() * 3 ) * _gridOne;
				_geometry.vertices[ _i00 ].y = _h;
				_geometry.vertices[ _i01 ].y = _h;
				_geometry.vertices[ _i10 ].y = _h;
				_geometry.vertices[ _i11 ].y = _h;
			}
		}

		while( len )
		{
			len--;

			var _x = len % _grid ;
			var _z = Math.floor( len / _grid  );

			if( _x%2==1 && _z%2 ==1 )
			{
				if( _x != _grid && _z != _grid )
				{
					_geometry.faces.splice( len * 2, 2 );
				}
				
			}
		}

		_geometry.verticesNeedUpdate = true;

		var _material = new THREE.MeshPhongMaterial({
			color: new THREE.Color( 0.8, 0.8, 0.8 ),
			transparent: true,
			//opacity: 0.4,
			flatShading: true,
			// side: THREE.DoubleSide,
			shininess: 0
		});
		var _body = new THREE.Mesh( _geometry, _material );
		_world.add( _body );

		var _bGeometry = new THREE.BufferGeometry().fromGeometry( _geometry );
		console.log( _bGeometry );



		// //	faces reducve chec k
		_grid = 21;
		var _geometry = new THREE.PlaneGeometry( 10,10,_grid,_grid);

		var len = _geometry.vertices.length;

		while( len )
		{
			len--;

			var _x = len % _grid ;
			var _z = Math.floor( len / _grid  );

			if( _x%2==1 && _z%2 ==1 )
			{
				if( _x != _grid && _z != _grid )
				{
					_geometry.faces.splice( len * 2, 2 );
				}
				
			}
		}
		_geometry.verticesNeedUpdate = true;
		//	ok

		var _material = new THREE.MeshBasicMaterial();
		var _mesh = new THREE.Mesh( _geometry, _material );
		_world.add( _mesh );
		_mesh.position.y = 16;



		//	sea
		var _geometry = new THREE.BoxGeometry( 100, 10, 100, 10, 1, 10 );
		_geometry.translate( 0, -5, 0 );
		var _material = new THREE.MeshPhongMaterial({
			color: 0x186699,
			transparent: true,
			opacity: 0.6,
			shininess: 100
		});
		var _sea = new THREE.Mesh( _geometry, _material );
		_sea.position.y = - 0.1 * _gridOne + 3.0 * _gridOne;
		_world.add( _sea );

		//	sea
		var _geometry = new THREE.PlaneGeometry( 100, 100, 100, 1, 1 );
		_geometry.rotateX( - Math.PI * 0.5 );
		var _material = new THREE.MeshPhongMaterial({
			color: 0x808080,
			shininess: 0
		});
		var _bottom = new THREE.Mesh( _geometry, _material );
		_bottom.position.y = -10 + 3.0 * _gridOne;
		_world.add( _bottom );



		//	POSTPROCESSING
		// CreatePostProcessing();

	}

	function setup()
	{
	}

	function update()
	{
		_world.render( 0.0 );
		_update(0);
	}

	function _update( _stepTime ){

		window.requestAnimationFrame( _update );

		//	時間の更新
		var _delta = _clock.getDelta();
		_time += _delta;



		//	camera update
		var __time = Math.sin(_time*0.6)*0.05;
		_world.camera.up.set(Math.sin(__time), Math.cos(__time), 0);
		_world.camera.updateProjectionMatrix ();

	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(e){
			e.preventDefault();
		});

		window.addEventListener('click',function(e) {
			e.preventDefault();
		}, false);


		window.addEventListener('scroll', function(e){
			var _value = 
        		document.documentElement.scrollTop || // IE、Firefox、Opera
        		document.body.scrollTop;              // Chrome、Safari
				e.preventDefault();


		});


		// window.addEventListener( 'mousewheel', function(e)
		// {
		// 	countUp();
		// 	e.preventDefault();
		// }, false );

	}


	function CreatePhongShader()
	{
		var phongShader = THREE.ShaderLib.phong;
		var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		uniforms.time = {};
		uniforms.time.value = Math.PI * 0.5;

		var obj = {};
		obj.shader = phongShader;
		obj.uniforms = uniforms;

		return obj;
	}

	function CreatePostProcessing()
	{

		var MonoShader = {
			uniforms: {
				"time": { type:"t", value: 0.0 },
				"tDiffuse": { type:"t", value: null },
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join( "\n" ),

			fragmentShader: [
					"uniform float time;",
					"uniform sampler2D tDiffuse;",
					"varying vec2 vUv;",
					"const float redScale   = 0.298912;",
					"const float greenScale = 0.586611;",
					"const float blueScale  = 0.114478;",
					"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
				"void main() {",
					"vec4 smpColor = texture2D(tDiffuse, vUv);",
					"float grayColor = dot(smpColor.rgb, monochromeScale);",
					// "smpColor = vec4(vec3(grayColor), 1.0);",
					"gl_FragColor = smpColor;",
				"}"

			].join( "\n" )
		};

		var _shaderPass = new THREE.ShaderPass( MonoShader );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		_shaderPass.name = "Mono";
		_world.addPass( _shaderPass );

		//	resolution, strength, radius, threshold

		var _shaderPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.6, 0.84, 0.945 );
		_shaderPass.enabled = true;
		_shaderPass.renderToScreen = false;
		_shaderPass.name = "UnrealBloom";
		_world.addPass( _shaderPass );
	
	}

	/*
		class and method
	*/
	function _offerdme(e)
	{
		_dom = e;
	}

	_offerdme.prototype = {
		start:	function()
		{
			init();
			setup();
			addEvents();
			update();
		}
	};

	return _offerdme;

	
})();
