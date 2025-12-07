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
		var _texture = new THREE.TextureLoader().load('message02.png', function(){
			var _width = _texture.image.width;
			var _height = _texture.image.height;
			var PARTICLES = _width * _height;
			var positions = new Float32Array( PARTICLES * 3 );
			var vectors = new Float32Array( PARTICLES * 3 );
			var uvs = new Float32Array( PARTICLES * 2 );
			var delay = new Float32Array( PARTICLES * 1 );
			var _geometry = new THREE.BufferGeometry();
			var len = PARTICLES;
			var _speed = 32.0;
			for( var i = 0; i < len; i++ )
			{
				positions[ i * 3 + 0 ] = i % _width - _width * 0.5;
				positions[ i * 3 + 1 ] = Math.floor( i / _width ) - _height * 0.5;
				positions[ i * 3 + 2 ] = 0;

				var _rad0 = Math.random() * Math.PI * 2.0 - Math.PI;
				var _rad1 = Math.random() * Math.PI * 2.0 - Math.PI;
				var _r = ( 1.0 - Math.random() * Math.random() ) * _speed;
				vectors[ i * 3 + 0 ] = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				vectors[ i * 3 + 1 ] = Math.sin( _rad0 ) * _r;
				vectors[ i * 3 + 2 ] = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

				uvs[ i * 2 + 0 ] = ( i % _width )/ ( _width - 1 );
				// uvs[ i * 2 + 1 ] = Math.floor( i / _width ) / ( _width - 1 );
				uvs[ i * 2 + 1 ] = Math.floor( i / _width ) / ( _height - 1 );

				delay[ i ] = ( ( i % _width ) + Math.floor( i / _width ) ) / len * 1000.0;
				delay[ i ] += Math.random() * 10.0;


				// positions[ i * 3 + 0 ] *= 0.05;
				// positions[ i * 3 + 1 ] *= 0.05;
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
			_geometry.addAttribute( 'velocity', new THREE.BufferAttribute( vectors, 3 ) );
			_geometry.addAttribute( 'uv', new THREE.BufferAttribute( uvs, 2 ) );
			_geometry.addAttribute( 'delay', new THREE.BufferAttribute( delay, 1 ) );

			var _shaderParam = hdytopShader( _texture, new THREE.TextureLoader().load('circle1.png') );

			var yMaterial = new THREE.ShaderMaterial({
				uniforms: _shaderParam.uniforms,
				vertexShader: _shaderParam.vertexShader,
				fragmentShader: _shaderParam.fragmentShader,
				transparent: true,
				depthTest: false,
				depthWrite: false,
				//blending: THREE.AdditiveBlending
			});

			_plane = new THREE.Points( _geometry, yMaterial );
			//_mesh.matrixAutoUpdate = false;
			_plane.updateMatrix();
			_scene.add( _plane );


			var _geometry = new THREE.PlaneGeometry(1,1,1,1);
			var _material = new THREE.MeshBasicMaterial({
				wireframe: true,
				opacity: 0.2,
				transparent: true
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			_scene.add( _mesh )
			_mesh.scale.x = _width;
			_mesh.scale.y = _height;

			//	console.log( 'PARTICLES: ', PARTICLES, _width, _height );
		});




	}


	function render()
	{
		_renderKey = window.requestAnimationFrame( render );

		_time += _clock.getDelta();

		if( _plane )
		{
			//_plane.material.uniforms.time.value = _time;
		}
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

		_plane.material.uniforms.time.value = Math.sin( _mouse.x * 0.2 / window.innerWidth * Math.PI * 0.5 ) * 100;
		_plane.material.uniformsNeedUpdate = true;
	}

	//	
	function hdytopShader( _texture, _circle )
	{
		var MonoShader = {
			uniforms: {
				"time": { value: 0 },
				"mouse": { value: _mouse },
				"resolution": { value: _resolution },
				"randomSeed": {	value: _randomSeed },
				"delay": { value: 0 },
				"size": { value: 1.0 },
				"texture": { value: _texture },
				"circle": { value: _circle }
			},
			vertexShader: [
				"uniform float time;",
				"uniform vec2 mouse;",
				"uniform vec2 resolution;",
				"uniform vec2 randomSeed;",

				"uniform float size;",
				"attribute vec3 velocity;",
				"attribute float delay;",
				"varying vec2 vUv;",
				"",
				"void main()",
				"{",
				"    float par = clamp(time - delay, 0.0, 100.0 );   //  clamp(x, a, b) = min(max(x, a), b);",
				"    par = ( sin( par / 100.0 * 3.1416  - 3.1416 * 0.5 ) + 1.0 ) * 0.5 * 100.0;",
				// "    par *= par;",
				"    vec3 pos = position + velocity * par;",
				"    vUv = uv;",
				"    vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
				"    gl_PointSize = size * (100.0 / length(mvPosition.xyz));",
				"gl_PointSize = max( gl_PointSize, 4.0 );",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
				"}"
			].join( "\n" ),
			fragmentShader: [
				"uniform sampler2D texture;",
				"uniform sampler2D circle;",
				"uniform float time;",
				"varying vec2 vUv;",
				"void main()",
				"{",
				"    vec4 color = texture2D( texture, vUv );",
				"    vec4 tex = texture2D( circle, gl_PointCoord.xy );",
				"    gl_FragColor = tex * color;",
				"}"
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