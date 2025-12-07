/*
	HDY top view webgl
*/

var HDYTOP = (function(){

	//	game time
	var _bgColor = 0xFFFFFF;
	var _resolution, _mouse, _time, _randomSeed;
	var _scene, _camera, _renderer, _clock, _plane;
	var _isRunning = true;
	var _renderKey;
	var _isInitComplete = false;
	var _param = {
		colors : {
			'Highlight': new THREE.Color( 0x003666 ),
			'Brights': new THREE.Color( 0x257ABE ),
			'Midtones': new THREE.Color( 0x153699 ),
			'Darktones': new THREE.Color( 0x00CBE8 ),
			'Shadows': new THREE.Color( 0x0A13A7 ),
		},
		speed: 10.0,
		scale: 1.250,
		kscale: 1.000,
		liquidX: 0.000,
		liquidY: 0.000
	};

	var _gui = new dat.GUI();
	var _colors = [];

	//	Highlight
	_colors[0] = new THREE.Color( 0x003666 );

	//	Brights
	_colors[1] = new THREE.Color( 0x257ABE );

	//	Midtones
	_colors[2] = new THREE.Color( 0x153699 );

	//	Darktones
	_colors[3] = new THREE.Color( 0x00CBE8 );

	//	Shadows
	_colors[4] = new THREE.Color( 0x0A13A7 );

	var _prop = {
		Highlight: [_colors[0].r * 255, _colors[0].g * 255, _colors[0].b * 255 ],
		Brights: [_colors[1].r * 255, _colors[1].g * 255, _colors[1].b * 255 ],
		Midtones: [_colors[2].r * 255, _colors[2].g * 255, _colors[2].b * 255 ],
		Darktones: [_colors[3].r * 255, _colors[3].g * 255, _colors[3].b * 255 ],
		Shadows: [_colors[4].r * 255, _colors[4].g * 255, _colors[4].b * 255 ],
		speed: 10.0,
		scale: 1.250,
		kscale: 1.000,
		liquidX: 0.000,
		liquidY: 0.000,
		random: function()
		{
			_randomSeed = new THREE.Vector2( Math.random() * 255.0, Math.random() * 255.0 );
			_plane.material.uniforms.randomSeed.value = _randomSeed;
			_plane.material.uniformsNeedUpdate = true;
		}
	}




	//	hide console	
	// window.console.log = function(){/* NOP */};
	// window.console.debug = function(){/* NOP */};
	// window.console.info = function(){/* NOP */};
	// window.console.warn = function(){/* NOP */};
	// window.console.error = function(){/* NOP */};
	// window.console.timeEnd = function(){/* NOP */};
	// window.console.time = function(){/* NOP */};



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
		_liquid = new THREE.Vector2();

		var _dom = document.getElementById( _webglDom );
		_resolution.x = _dom.clientWidth;
		_resolution.y = _dom.clientHeight;

		_scene = new THREE.Scene();		
		
		_camera = new THREE.OrthographicCamera( - _resolution.x * 0.5, _resolution.x * 0.5, _resolution.y * 0.5, - _resolution.y * 0.5, 0.1, 100 );
		// _camera = new THREE.PerspectiveCamera( 50, _resolution.x / _resolution.y, 0.1, 1600 );
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

		//	debug
		_gui.addColor(_prop,'Highlight').onChange(function(){
			_colors[4].r = _prop.Highlight[0] / 255;
			_colors[4].g = _prop.Highlight[1] / 255;
			_colors[4].b = _prop.Highlight[2] / 255;

			_plane.material.uniforms.color.value = _colors;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.addColor(_prop,'Brights').onChange(function(){
			_colors[3].r = _prop.Brights[0] / 255;
			_colors[3].g = _prop.Brights[1] / 255;
			_colors[3].b = _prop.Brights[2] / 255;

			_plane.material.uniforms.color.value = _colors;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.addColor(_prop,'Midtones').onChange(function(){
			_colors[2].r = _prop.Midtones[0] / 255;
			_colors[2].g = _prop.Midtones[1] / 255;
			_colors[2].b = _prop.Midtones[2] / 255;

			_plane.material.uniforms.color.value = _colors;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.addColor(_prop,'Darktones').onChange(function(){
			_colors[1].r = _prop.Darktones[0] / 255;
			_colors[1].g = _prop.Darktones[1] / 255;
			_colors[1].b = _prop.Darktones[2] / 255;

			_plane.material.uniforms.color.value = _colors;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.addColor(_prop,'Shadows').onChange(function(){
			_colors[0].r = _prop.Shadows[0] / 255;
			_colors[0].g = _prop.Shadows[1] / 255;
			_colors[0].b = _prop.Shadows[2] / 255;

			_plane.material.uniforms.color.value = _colors;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.add(_prop,'speed',-100., 100.0, 0.01 ).onChange(function(){
			_plane.material.uniforms.speed.value = _prop.speed;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.add(_prop,'scale', 0, 2.0, 0.001 ).onChange(function(){
			_plane.material.uniforms.fScale.value = _prop.scale;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.add(_prop,'kscale', 0, 2.0, 0.001 ).onChange(function(){
			_plane.material.uniforms.kScale.value = _prop.kscale;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.add(_prop,'liquidX', -1.0, 1.0, 0.0001 ).onChange(function(){
			_liquid.x = _prop.liquidX;
			_plane.material.uniforms.liquid.value.x = _prop.liquidX * 0.01;
			_plane.material.uniformsNeedUpdate = true;
		});

		_gui.add(_prop,'liquidY', -1.0, 1.0, 0.0001 ).onChange(function(){
			_liquid.y = _prop.liquidY;
			_plane.material.uniforms.liquid.value.y = _prop.liquidY * 0.01;
			_plane.material.uniformsNeedUpdate = true;
		});





		_gui.add( _prop, 'random')
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
				"randomSeed": {	value: _randomSeed },
				"color": { value: _colors },
				"speed": { value: 10.0 },
				"fScale": { value: 1.25 },
				"kScale": { value: 1.00 },
				"liquid": { value: _liquid }
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
				"uniform vec2 liquid;",
				"uniform vec3 color[5];",
				"uniform float speed;",
				"uniform float fScale;",
				"uniform float kScale;",
				"varying vec2 vUv;",

				"	vec3 rgb2hsv(vec3 c)",
				"{",
				"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
				"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
				    "    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
				    "",
				    "    float d = q.x - min(q.w, q.y);",
				"    float e = 1.0e-10;",
				    "    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
				    "}",
				    "",
				"	vec3 hsv2rgb(vec3 c)",
				"	{",
				"	    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
				"	    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
				"	    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
				"	}",

				"	const float Pi = 3.14159;",
				"	const int zoom = 40;",
				"	",
				"	void main(void)",
				"	{",
				"		",
				"		vec2 uv = vUv * 100.0;",
				"		vec2 p=(2.0*gl_FragCoord.xy-resolution.xy)/max(resolution.x,resolution.y) + randomSeed ;",
				"		p*=kScale;",
				"		float ct = speed;",
				"		",
				"		for(int i=1;i<zoom;i++) {",
				"			vec2 newp=p;",
				"			newp.x+=0.25/float(i)*cos(float(i)*p.y+time*cos(ct)*0.3/40.0+0.03*float(i))*fScale+10.0 + time * liquid.x;",
				"			newp.y+=0.5/float(i)*cos(float(i)*p.x+time*ct*0.3/50.0+0.03*float(i+10))*fScale+15.0 + time * liquid.y;",
				"			p=newp;",
				"		}",
				"	",
				"	vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));",

				"	vec3 hsv = rgb2hsv( col );",


				"	float _brightness = hsv.z;",
				"	float _index = _brightness * 4.0;",

				"	vec3 _color0 = color[0];",
				"	vec3 _color1 = color[0];",

				"	if( _brightness == 0.0 ){",
				"		_color0 = color[0];",
				"		_color1 = color[0];",
				"	} else if( _index <= 1.0 ){",
				"		_color0 = color[0];",
				"		_color1 = color[1];",
				"	} else if( _index <= 2.0 ){",
				"		_color0 = color[1];",
				"		_color1 = color[2];",
				"	} else if( _index <= 3.0 ){",
				"		_color0 = color[2];",
				"		_color1 = color[3];",
				"	} else if( _index < 4.0 ){",
				"		_color0 = color[3];",
				"		_color1 = color[4];",
				"	} else if( _index == 4.0 ){",
				"		_color0 = color[4];",
				"		_color1 = color[4];",
				"	}",

				"	float _mixValue = mod( _index, 1.0 );",
				"	vec3 _color = mix( _color0, _color1, _mixValue );",

				"	gl_FragColor=vec4(_color, 1.0);",
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