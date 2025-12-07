/*
	HDY top view webgl
*/

var waveMessage = (function(){
	function main(){}
	main.prototype = {}
	return main;
})();

var waveImage = (function(){
	function main(){}
	main.prototype = {}
	return main;
})();

var HDYTOP = (function(){

	//	game time
	var _bgColor = 0x000000;
	var _resolution, _mouse, _time, _randomSeed;
	var _scene, _camera, _renderer, _clock, _plane;
	var _isRunning = true;
	var _renderKey;
	var _isInitComplete = false;
	var _planes = [];

	function start()
	{
		init();
		setup();
		render();

		//	いらなければとる
		window.addEventListener( 'mousemove', mouseupdate );
	}

	function init()
	{
		_clock = new THREE.Clock();
		_time = 0;

		_mouse = new THREE.Vector2();
		_resolution = new THREE.Vector2();
		_randomSeed = new THREE.Vector2( Math.random() * 255.0, Math.random() * 255.0 );


		var _dom = document.getElementById( _webglDom );
		_resolution.x = _dom.clientWidth;
		_resolution.y = _dom.clientHeight;

		_scene = new THREE.Scene();		
		
		// _camera = new THREE.PerspectiveCamera(50, _dom.clientWidth / _dom.clientHeight, 0.1, 1000 );
		_camera = new THREE.OrthographicCamera( - _resolution.x * 0.5, _resolution.x * 0.5, _resolution.y * 0.5, - _resolution.y * 0.5, 0.1, 100 );
			_camera.position.set( 0, 0, 100 );
			_camera.lookAt( new THREE.Vector3() );

		_renderer = new THREE.WebGLRenderer({ antialias: true });
			_renderer.setPixelRatio( window.devicePixelRatio );
			_renderer.setSize( _resolution.x, _resolution.y  );

		_dom.appendChild( _renderer.domElement);

	}


	function setup()
	{
		var _tx = new THREE.TextureLoader().load('message01.png', function(){
			_plane.scale.x = _tx.image.width;
			_plane.scale.y = _tx.image.height;
		});

			var _geometry = new THREE.PlaneGeometry(1,1,36*2,7*2);
			var _material = hdytopShader( _tx );

			_plane = new THREE.Mesh( _geometry, _material );
			_scene.add( _plane );

			_planes.push( _plane );
	}


	function render()
	{
		_renderKey = window.requestAnimationFrame( render );

		_time += _clock.getDelta();
		_plane.material.uniforms.time.value = _time;
		_renderer.render( _scene, _camera );
	}

	function resize( _width, _height )
	{
		_resolution.x = _width;
		_resolution.y = _height;

		_renderer.setSize( _resolution.x, _resolution.y );
		if( _camera.aspect )
		{
			_camera.aspect = _resolution.x / _resolution.y;
		} else {
			_camera.left = - _resolution.x * 0.5;
			_camera.right = _resolution.x * 0.5;
			_camera.bottom = - _resolution.y * 0.5;
			_camera.top = _resolution.y * 0.5;
		}
		_camera.updateProjectionMatrix();

		_plane.material.uniforms.resolution.value = _resolution;
		_plane.material.uniformsNeedUpdate = true;

	}

	function mouseupdate( event )
	{
		_mouse.x = event.pageX;
		_mouse.y = event.pageY;

		_plane.material.uniforms.mouse.value = _mouse;
		_plane.material.uniformsNeedUpdate = true;
	}

	//	
	function hdytopShader( _texture )
	{

		var MonoShader = {
			uniforms: {
				"time": { value: 0 },
				"mouse": { value: _mouse },
				"resolution": { value: _resolution },
				"randomSeed": {	value: _randomSeed },
				"tDiffuse": { value: _texture }
			},
			vertexShader: [
				"uniform float time;",
				"uniform vec2 mouse;",
				"uniform vec2 resolution;",
				"uniform vec2 randomSeed;",
				"varying vec2 vUv;",
				"varying float vPar;",

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

				"void main() {",
				"	vUv = uv;",

				"vec3 pos = position;",
				"float _scale = 2.0;",
				"vPar = mouse.x / resolution.x * 2.0 - 1.0;",
				"pos.x += ( fBm( vUv.xy * .109 + time * 0.036 + randomSeed ) - 0.5 ) * vPar * _scale;",
				"pos.y += ( fBm( vUv.yx * .408 + time * 0.029 - randomSeed ) - 0.5 ) * vPar * _scale * 2.;",

				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
				"}"
			].join( "\n" ),
			fragmentShader: [
				"uniform float time;",
				"uniform vec2 mouse;",
				"uniform vec2 resolution;",
				"uniform vec2 randomSeed;",
				"uniform sampler2D tDiffuse;",
				"varying vec2 vUv;",
				"varying float vPar;",

				"void main(void)",
				"{",
				"	gl_FragColor=texture2D( tDiffuse, vUv );",
				"	gl_FragColor.a *= 1.0 - vPar * vPar;",
				"}",

			].join( "\n" )
		};

		var _material = new THREE.ShaderMaterial({
			uniforms: MonoShader.uniforms,
			vertexShader: MonoShader.vertexShader,
			fragmentShader: MonoShader.fragmentShader,
			transparent: true
		});

		return _material;
	}

	//	easing
	function easeOutCubic(t,b,c,d)
	{
		return c*((t=t/d-1)*t*t + 1) + b;
	}

	function easeInOutQuad(t,b,c,d)
	{
		if ((t/=d/2) < 1) return c/2*t*t + b;
		return -c/2 * ((--t)*(t-2) - 1) + b;
	}



	/*
		class
	*/
	function _HDYTOP( e )
	{
		_webglDom = e;
	}

	_HDYTOP.prototype = {
		start : function()
		{
			if( !_isInitComplete )
			{
				_isInitComplete = true;
				start();
			}
		},
		renderStart : function()
		{
			if( !_isRunning )
			{
				_isRunning = true;
				_clock.start();
				render();
			}
		},
		renderStop : function()
		{
			_isRunning = false;
			_clock.stop();
			window.cancelAnimationFrame( _renderKey );
		},
		isRunning : function()
		{
			return _isRunning;
		},
		resize : function( _width, _height )
		{
			resize( _width, _height );
		}
	}



	return _HDYTOP;
})();