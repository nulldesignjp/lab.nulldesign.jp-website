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
	var _grid,_gridH,_n,_field;

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

		_grid = 521;
		_gridH = 8.0;

	//	odd no

		var _geometry = new THREE.PlaneGeometry( 500, 500, _grid, _grid );
		_geometry.rotateX( - Math.PI * 0.5 );

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

				_geometry.vertices[ _i00 ].y = _h;
				_geometry.vertices[ _i01 ].y = _h;
				_geometry.vertices[ _i10 ].y = _h;
				_geometry.vertices[ _i11 ].y = _h;
			}
		}

		//	reduce
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



		//	bufferGeometryにするにあたっての調整
		var _count = 0;
		var _colorIndex = [];
		var len = _geometry.faces.length;
		for( var i = 0; i < len; i+=2 )
		{
			var _idx0 = _geometry.faces[i].a;
			var _idx1 = _geometry.faces[i].b;
			var _idx2 = _geometry.faces[i].c;

			var _idx3 = _geometry.faces[i+1].a;
			var _idx4 = _geometry.faces[i+1].b;
			var _idx5 = _geometry.faces[i+1].c;

			var _x = _idx0 % ( _grid + 1 );
			var _z = Math.floor( _idx0 / ( _grid + 1 ) );




			if( _x%2==1 )
			{
				var _idx = _geometry.faces[i+2].a;
				var _nextX = _idx % ( _grid + 1 );
				var _nextZ = Math.floor( _idx / ( _grid + 1 ) );
				
				var _idx = _geometry.faces[i-2].a;
				var _prevX = _idx % ( _grid + 1 );
				var _prevZ = Math.floor( _idx / ( _grid + 1 ) );

				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );
				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );
				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//

				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );
				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//
				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//
			}

			if( _z%2==1 )
			{
				var _idx = _geometry.faces[i].a - ( _grid + 1 );
				var _prevX = _idx % ( _grid + 1 );
				var _prevZ = Math.floor( _idx / ( _grid + 1 ) );

				var _idx = _geometry.faces[i].a + ( _grid + 1 );
				var _nextX = _idx % ( _grid + 1 );
				var _nextZ = Math.floor( _idx / ( _grid + 1 ) );

				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );
				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//
				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );

				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//
				_colorIndex.push( _nextX );//
				_colorIndex.push( _nextZ );//
				_colorIndex.push( _prevX );
				_colorIndex.push( _prevZ );
			}

			if( _z%2==0 && _x%2==0 )
			{
				_colorIndex.push( _x );
				_colorIndex.push( _z );
				_colorIndex.push( _x );
				_colorIndex.push( _z );
				_colorIndex.push( _x );
				_colorIndex.push( _z );
				_colorIndex.push( _x );
				_colorIndex.push( _z );
				_colorIndex.push( _x );
				_colorIndex.push( _z );
				_colorIndex.push( _x );
				_colorIndex.push( _z );
			}

 


			_count++;

		}

		//
		var _bGeometry = new THREE.BufferGeometry().fromGeometry( _geometry );
		//_bGeometry.addAttribute( 'colorIndex', new THREE.Float32BufferAttribute( _colorIndex, 2 ));
		// _bGeometry.addAttribute( 'colorIndex', new THREE.BufferAttribute( _colorIndex, 2 ) );
		_bGeometry.addAttribute( 'colorIndex', new THREE.Float32BufferAttribute( _colorIndex, 2 ) );

		console.log( _bGeometry )

		var _material = CreateFieldShader();
		_field = new THREE.Mesh( _bGeometry, _material );
		_world.add( _field );


		//	POSTPROCESSING
		CreatePostProcessing();

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

		_field.material.uniforms.time.value += _delta;

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

	function CreateFieldShader()
	{
		var ParticleShader = {
			uniforms: {
				"time": {	type: 'f', value: 0.0	},
				"lightPosition": { value: _world.directional.position },
				"lightColor": {	value: _world.directional.color },
				"ambientColor": { value: _world.ambient.color }

			},
			vertexShader: [
				"uniform float time;",
				"attribute vec2 colorIndex;",

				"varying vec2 vUv;",
				"varying vec3 vNormal;",
				"varying vec3 vPos;",

				    "float random(vec2 p){",
					"    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);",
					"}",
					"",
					"float noise2(vec2 st)",
					"{",
					"    vec2 p = floor(st);",
					"    return random(p);",
					"}",
					"",
					"float noise3(vec2 st)",
					"{",
					"    vec2 p = floor(st);",
					"    return random(p + vec2(time,0.0));",
					"}",
					"",
					"float valueNoise(vec2 st)",
					"{",
					"    vec2 p = floor(st);",
					"    vec2 f = fract(st);",
					"",
					"    float v00 = random( p + vec2( 0, 0 ) );",
					"    float v10 = random( p + vec2( 1, 0 ) );",
					"    float v01 = random( p + vec2( 0, 1 ) );",
					"    float v11 = random( p + vec2( 1, 1 ) );",
					"",
					"    vec2 u = f * f * (3.0 - 2.0 * f);",
					"",
					"    float v0010 = mix(v00, v10, u.x);",
					"    float v0111 = mix(v01, v11, u.x);",
					"    return mix(v0010, v0111, u.y);",
					"}",
					"",
					"vec2 random2(vec2 st){",
					"       vec2 _st = vec2( dot(st,vec2(127.1,311.7)),",
					"                      dot(st,vec2(269.5,183.3)));",
					"       return -1.0 + 2.0 * fract( sin(_st) * 43758.5453123 );",
					"   }",
					"",
					"float perlinNoise(vec2 st)",
					"{",
					"    vec2 p = floor(st);",
					"    vec2 f = fract(st);",
					"    vec2 u = f*f*(3.0-2.0*f);",
					"",
					"    vec2 v00 = random2( p + vec2(0,0) );",
					"    vec2 v10 = random2( p + vec2(1,0) );",
					"    vec2 v01 = random2( p + vec2(0,1) );",
					"    vec2 v11 = random2( p + vec2(1,1) );",
					"",
					"    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),",
					"                 mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ),",
					"                 u.y ) + 0.5;",
					"}",
					"",
					"float fBm (vec2 st)",
					"{",
					"    float f = 0.0;",
					"    vec2 q = st;",
					"",
					"    f += 0.5000 * perlinNoise( q ); q = q*2.01;",
					"    f += 0.2500 * perlinNoise( q ); q = q*2.02;",
					"    f += 0.1250 * perlinNoise( q ); q = q*2.03;",
					"    f += 0.0625 * perlinNoise( q ); q = q*2.01;",
					"",
					"    return f;",
					"}",


					"float distanceFunc(vec3 p){",
					"    return length(p) - 1.0;",
					"}",

					"vec3 getNormal(vec3 p){",
					"    float d = 0.0001;",
					"    return normalize(vec3(",
					"        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),",
					"        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),",
					"        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))",
					"    ));",
					"}",

				"void main() {",
					"vUv = uv;",

					"vec3 pos = position;",

					//"vec2 fVec = colorIndex * 0.01 + vec2( _x, _dist );",
					"vec2 fVec = colorIndex * 0.01;",
					"float _rad2 = perlinNoise( vec2( time * 0.01, 10.0 ) ) * 3.1416 * 12.0;",
					"float _sin = sin( _rad2 );",
					"float _cos = cos( _rad2 );",
					"float _vx = fVec.x * _cos - fVec.y * _sin;",
					"float _vy = fVec.x * _sin + fVec.y * _cos;",
					"fVec = vec2( _vx, _vy );",


					"float _rad = perlinNoise( vec2( time * 0.0001, 0.0 ) ) * 3.1416 * 2.0;",
					"float _dist = perlinNoise( vec2( 0.0, time * 0.0001 ) ) * 1000.0;",
					"fVec.x += cos( _rad ) * _dist;",
					"fVec.y += sin( _rad ) * _dist;",

					"pos.y = floor( fBm( fVec ) * 16.0 );",
					"vPos = pos;",

					"vec3 _normal = getNormal( abs(cameraPosition.xyz - pos) );",
					"vNormal = normalMatrix * _normal;",


					"gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
				"}"
			].join( "\n" ),

			fragmentShader: [

				"uniform float time;",
				"varying vec2 vUv;",
				"varying vec3 vNormal;",
				"varying vec3 vPos;",

				"uniform vec3 lightPosition;",
				"uniform vec3 lightColor;",
				"uniform vec3 ambientColor;",

				"vec3 hsb2rgb( in vec3 c ){",
				"    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),",
				"                    6.0)-3.0)-1.0,",
				"                    0.0,",
				"                    1.0 );",
				"    rgb = rgb*rgb*(3.0-2.0*rgb);",
				"    return c.z * mix(vec3(1.0), rgb, c.y);",
				"}",

				"void main() {",
					//"vec4 smpColor = texture2D( tDiffuse, vUv);",
					//"gl_FragColor = smpColor;",

					// gl_PointCoord

					//"gl_FragColor = vec4(0.6,0.6,0.6,1.0);",


					"vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );",
					"vec3 N = normalize( vNormal );",
					"vec3 L = normalize( viewLightPosition.xyz );",

					"float dotNL = dot( N, L );",

					//	"vec3 planeColor = hsb2rgb( vec3( vUv.y, 0.35, vPos.y / 16.0 * 2.0 ) );",
					"vec3 planeColor = hsb2rgb( vec3( 1.0 - vPos.y / 16.0, 0.5, 0.8 ) );",

					"planeColor = vec3( vPos.y / 16.0 * 1.25 );",
					"planeColor.r *= 0.75;",
					"planeColor.b *= 1.25;",
					"planeColor.g *= 1.05;",

					"vec3 diffuse = planeColor * lightColor * max( dotNL, 0.0 );",
					"vec3 ambient = planeColor * ambientColor;",



					"gl_FragColor = vec4( diffuse + ambient, 1.0 );",



 					//  FOG
				    // "#ifdef USE_FOG",
				    // "    #ifdef USE_LOGDEPTHBUF_EXT",
				    // "        float depth = gl_FragDepthEXT / gl_FragCoord.w;",
				    // "    #else",
				    // "        float depth = gl_FragCoord.z / gl_FragCoord.w;",
				    // "    #endif",
				    // "    float fogFactor = smoothstep( fogNear, fogFar, depth );",
				    // "    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );",
				    // "#endif",

				"}"

			].join( "\n" )
		};


		var _material = new THREE.ShaderMaterial({
			uniforms: ParticleShader.uniforms,
			vertexShader: ParticleShader.vertexShader,
			fragmentShader: ParticleShader.fragmentShader,
			//opacity: 0.8,
			transparent: true,
			//blending: THREE.AdditiveBlending
			//fog: true
			flatShading: true
		});

		return _material;
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
