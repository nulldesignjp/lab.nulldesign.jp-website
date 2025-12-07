/*
	HDY top view webgl
*/

var ndMainView = (function(){

	var _isInitComplete;

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
		
		_camera = new THREE.OrthographicCamera( - _resolution.x * 0.5, _resolution.x * 0.5, _resolution.y * 0.5, - _resolution.y * 0.5, 0.1, 100 );
			_camera.position.set( 0, 0, 10 );
			_camera.lookAt( new THREE.Vector3() );

		_renderer = new THREE.WebGLRenderer({ antialias: true });
			_renderer.setPixelRatio( window.devicePixelRatio );
			_renderer.setSize( _resolution.x, _resolution.y  );

		_dom.appendChild( _renderer.domElement);

	}


	function setup()
	{
		var _geometry = new THREE.PlaneGeometry( 1, 1, 1 ,1 );
		var _material = hdytopShader();
		_plane = new THREE.Mesh( _geometry, _material );
		_plane.scale.x = _resolution.x;
		_plane.scale.y = _resolution.y;
		_scene.add( _plane );
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

		_plane.scale.x = _resolution.x;
		_plane.scale.y = _resolution.y;


		_plane.material.uniforms.resolution.value = _resolution;
		_plane.material.uniformsNeedUpdate = true;



	}

	function mouseupdate( event )
	{
		_mouse.x = event.pageX;
		_mouse.y = event.pageY;
	}

	//	
	function hdytopShader()
	{
		var MonoShader = {
			uniforms: {
				"time": { value: 0 },
				"mouse": { value: _mouse },
				"resolution": { value: _resolution },
				"randomSeed": {	value: _randomSeed }
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
				"	vUv = uv;",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join( "\n" ),
			fragmentShader: [
				"uniform float time;",
				"uniform vec2 mouse;",
				"uniform vec2 resolution;",
				"uniform vec2 randomSeed;",
				"varying vec2 vUv;",

				"void main(){",
				"	gl_FragColor=vec4(vUv, sin(time)*.5+.5, 1.0);",
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
	function _HDYTOP( e, __param )
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