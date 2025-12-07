/*
	engine.js
*/

(function(){

	//	prop
	var scene, camera, focus, renderer, time, image;
	var _composer;
	var _rgbShift, _film, _focus, _hueAndSaturetion, _BadTVShader,
	_glitch, _invert,_edgeShader,_vignette,_noise,
	_toyCam,_dotScreen,_edgeShader2,_sepia,_softFocus;
	var _resizeKey;

	//	start
	init();
	initComposer();
	//render();

	_rgbShift.enabled = false;
	_film.enabled = false;
	_focus.enabled = false;
	_hueAndSaturetion.enabled = false;
	_BadTVShader.enabled = false;
	_glitch.enabled = false;
	_invert.enabled = false;
	_edgeShader.enabled = false;
	_vignette.enabled = false;
	_noise.enabled = false;
	_toyCam.enabled = false;
	_dotScreen.enabled = false;
	_edgeShader2.enabled = false;
	_sepia.enabled = false;
	_softFocus.enabled = false;


	$(document).on('click', 'input', function(e){

		_rgbShift.enabled = false;
		_film.enabled = false;
		_focus.enabled = false;
		_hueAndSaturetion.enabled = false;
		_BadTVShader.enabled = false;
		_glitch.enabled = false;
		_invert.enabled = false;
		_edgeShader.enabled = false;
		_vignette.enabled = false;
		_noise.enabled = false;
		_toyCam.enabled = false;
		_dotScreen.enabled = false;
		_edgeShader2.enabled = false;
		_sepia.enabled = false;
		_softFocus.enabled = false;

		var _values = ["off","off","off","off","off","off","off","off","off","off","off","off","off","off","off","off"];
		//var _values = [];
		$('input').each(function(i,e){
			//_values.push($(this).val());

			if( $(this).prop('checked') )
			{
				//console.log(i)
				_values[i] = 'on';
			}
		});

		//console.log( _values )

		if( _values[0] == 'on' ){	_rgbShift.enabled = true;	}
		if( _values[1] == 'on'){	_film.enabled = true;	}
		if( _values[2] == 'on' ){	_focus.enabled = true;	}
		if( _values[3] == 'on' ){	_hueAndSaturetion.enabled = true;	}
		if( _values[4] == 'on' ){	_BadTVShader.enabled = true;	}
		if( _values[5] == 'on' ){	_glitch.enabled = true;	}
		if( _values[6] == 'on' ){	_invert.enabled = true;	}
		if( _values[7] == 'on' ){	_edgeShader.enabled = true;	}
		if( _values[8] == 'on' ){	_vignette.enabled = true;	}
		if( _values[9] == 'on' ){	_noise.enabled = true;	}
		if( _values[10] == 'on' ){	_toyCam.enabled = true;	}
		if( _values[11] == 'on' ){	_dotScreen.enabled = true;	}
		if( _values[12] == 'on' ){	_edgeShader2.enabled = true;	}
		if( _values[13] == 'on' ){	_sepia.enabled = true;	}
		if( _values[14] == 'on' ){	_softFocus.enabled = true;	}


		if( _values[0] == 'on' )
		{
			_rgbShift.uniforms[ 'amount' ].value = Math.random() * 0.1;
			_rgbShift.uniforms[ 'angle' ].value = Math.random() * Math.PI * 2;
		}
		if( _values[1] == 'on')
		{
			_film.uniforms[ 'sIntensity' ].value = Math.random();
			_film.uniforms[ 'nIntensity' ].value = Math.random();
			_film.uniforms[ 'sCount' ].value = Math.random() * 32;
			_film.uniforms[ 'grayscale' ].value = Math.floor( Math.random() * 2 );
		}
		if( _values[2] == 'on' )
		{
			_focus.uniforms[ 'waveFactor' ].value = Math.random() * 0.0125;	//	0.00125
			_focus.uniforms[ 'sampleDistance' ].value = Math.random();
		}
		if( _values[3] == 'on' )
		{
			_hueAndSaturetion.uniforms[ 'hue' ].value = Math.random()*2-1;
			_hueAndSaturetion.uniforms[ 'saturation' ].value = Math.random()*2-1;
		}
		if( _values[4] == 'on' )
		{
			_BadTVShader.uniforms[ 'time' ].value = Math.random();
			_BadTVShader.uniforms[ 'distortion' ].value = Math.random() * 3.0;
			_BadTVShader.uniforms[ 'distortion2' ].value = Math.random() * 5.0;
			_BadTVShader.uniforms[ 'speed' ].value = Math.random() * 0.2;
			_BadTVShader.uniforms[ 'rollSpeed' ].value = Math.random() * 0.1;
		}
		if( _values[5] == 'on' )
		{
			_glitch.uniforms[ 'amount' ].value = Math.random()*0.01;
			_glitch.uniforms[ 'angle' ].value = Math.random() * Math.PI * 2;
			_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'seed_y' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'distortion_x' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'distortion_y' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'col_s' ].value = Math.random();

			// //
			// _glitch.uniforms[ 'amount' ].value = _dataList[0] * 0.01;
			// _glitch.uniforms[ 'angle' ].value = _dataList[1];
			// _glitch.uniforms[ 'seed_x' ].value = _dataList[2]*2-1;	//	-1 - 1
			// _glitch.uniforms[ 'seed_y' ].value = - _glitch.uniforms[ 'seed_x' ].value;
			// _glitch.uniforms[ 'distortion_x' ].value = Math.random()*2-1;
			// _glitch.uniforms[ 'distortion_y' ].value = Math.random()*2-1;
			// //_glitch.uniforms[ 'distortion_x' ].value = 0;
			// //_glitch.uniforms[ 'distortion_y' ].value = 0;
			// _glitch.uniforms[ 'col_s' ].value = _dataList[3] * Math.random() * 2;
		}
		if( _values[6] == 'on' )
		{
			_invert.enabled = true;
		}
		if( _values[7] == 'on' )
		{
			var _pow = Math.floor( Math.random() * 10 );
			var _value = Math.pow( 2, _pow );
			_edgeShader.uniforms[ 'aspect' ].value = new THREE.Vector2(_value,_value);
		}
		if( _values[8] == 'on' )
		{
			_vignette.uniforms[ 'darkness' ].value = Math.random() * 4;
		}
		if( _values[9] == 'on' )
		{
			//_vignette.uniforms[ 'darkness' ].value = Math.random() * 4;
		}
		if( _values[10] == 'on' )
		{
			_toyCam.uniforms[ 'time' ].value = Math.random() * 4;
		}
		if( _values[11] == 'on' )
		{
			_dotScreen.uniforms[ 'angle' ].value = Math.PI * Math.random() * 2;
			_dotScreen.uniforms[ 'scale' ].value = Math.PI * Math.random() * 2;

			var _pow = Math.floor( Math.random() * 10 );
			_pow = Math.pow( 2, _pow );

			_dotScreen.uniforms[ 'tSize' ].value = new THREE.Vector2( _pow, _pow );
			_dotScreen.uniforms[ 'center' ].value = new THREE.Vector2( 0.5, 0.5 );
		}
		if( _values[12] == 'on' )
		{
			var _pow = Math.floor( Math.random() * 10 );
			var _value = Math.pow( 2, _pow );
			_edgeShader2.uniforms[ 'aspect' ].value = new THREE.Vector2(_value,_value);
		}
		if( _values[13] == 'on' )
		{
			_sepia.uniforms[ 'amount' ].value = Math.random() * 10.0;
		}
		if( _values[14] == 'on' )
		{
			_softFocus.uniforms[ 'waveFactor' ].value = Math.random() * 0.0125;	//	0.00125
			_softFocus.uniforms[ 'sampleDistance' ].value = Math.random();
			_softFocus.uniforms[ 'opacity' ].value = Math.random();
		}

		render();
	});



	//	method
	function init()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var _bgColor = 0x000000;

		time = 0;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( _bgColor, 400, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		//camera = new THREE.PerspectiveCamera( 60, _width / _height, 0.1, 1600);
		camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
		camera.position.set(0, 0, 100);
		camera.lookAt(focus);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(_bgColor, 1);
		renderer.setSize(_width, _height);
		renderer.autoClear = true;

		var geometry = new THREE.PlaneGeometry( 640,640, 10,10);
		var material = new THREE.MeshBasicMaterial({map:THREE.ImageUtils.loadTexture('image.png',null,render)});
		image = new	THREE.Mesh(geometry,material);
		scene.add( image );

		document.getElementById('container').appendChild(renderer.domElement);

		//	event
		window.addEventListener( 'resize', function(e)
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			if (camera.aspect) {
				camera.aspect = _width / _height;
			}
			else {
				camera.left = -_width * 0.5;
				camera.right = _width * 0.5;
				camera.top = _height * 0.5;
				camera.bottom = -_height * 0.5;
			}

			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );

			clearTimeout( _resizeKey );
			_resizeKey = setTimeout(function(){
				render();
			},400);

		}, false );
	}
	function initComposer()
	{
		_composer = new THREE.EffectComposer( renderer );
		_composer.addPass( new THREE.RenderPass( scene, camera ) );

		_rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
		_rgbShift.uniforms[ 'amount' ].value = 0.0015;
		//_rgbShift.renderToScreen = true;
		_composer.addPass( _rgbShift );

		_film = new THREE.ShaderPass( THREE.FilmShader );
		_film.uniforms[ 'sIntensity' ].value = Math.random();
		_film.uniforms[ 'nIntensity' ].value = Math.random();
		_film.uniforms[ 'sCount' ].value = 32;
		_film.uniforms[ 'grayscale' ].value = 0;
		//_film.renderToScreen = true;
		_composer.addPass( _film );

		// 	くそ重い
		_edgeShader = new THREE.ShaderPass( THREE.EdgeShader );
		_edgeShader.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		//_edgeShader.renderToScreen = true;
		_composer.addPass( _edgeShader );

		// 	くそ重い
		_edgeShader2 = new THREE.ShaderPass( THREE.EdgeShader2 );
		_edgeShader2.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		//_edgeShader2.renderToScreen = true;
		_composer.addPass( _edgeShader2 );

		_focus = new THREE.ShaderPass( THREE.FocusShader );
		_focus.uniforms[ 'screenWidth' ].value = window.innerWidth;
		_focus.uniforms[ 'screenHeight' ].value = window.innerHeight;
		_focus.uniforms[ 'waveFactor' ].value = 0.005;	//	0.00125
		//_focus.renderToScreen = true;
		_composer.addPass( _focus );

		_hueAndSaturetion = new THREE.ShaderPass( THREE.HueSaturationShader );
		_hueAndSaturetion.uniforms[ 'hue' ].value = 0.0;
		_hueAndSaturetion.uniforms[ 'saturation' ].value = 0.0;
		//_hueAndSaturetion.renderToScreen = true;
		_composer.addPass( _hueAndSaturetion );

		_vignette = new THREE.ShaderPass( THREE.VignetteShader );
		_vignette.uniforms[ 'darkness' ].value = 0.0;
		//_vignette.renderToScreen = true;
		_composer.addPass( _vignette );


		_BadTVShader = new THREE.ShaderPass( THREE.BadTVShader );
		_BadTVShader.uniforms[ 'time' ].value = 0.0;
		_BadTVShader.uniforms[ 'distortion' ].value = 3.0;
		_BadTVShader.uniforms[ 'distortion2' ].value = 5.0;
		_BadTVShader.uniforms[ 'speed' ].value = 0.2;
		_BadTVShader.uniforms[ 'rollSpeed' ].value = 0.1;

		//_BadTVShader.renderToScreen = true;
		_composer.addPass( _BadTVShader );

		_invert = new THREE.ShaderPass( THREE.InvertShader );
		//_invert.renderToScreen = true;
		_composer.addPass( _invert );


		_noise = new THREE.ShaderPass( THREE.NoiseShader );
		//_noise.renderToScreen = true;
		_composer.addPass( _noise );


		_toyCam = new THREE.ShaderPass( THREE.ToyCamShader );
		//_toyCam.renderToScreen = true;
		_composer.addPass( _toyCam );

		_dotScreen = new THREE.ShaderPass( THREE.DotScreenShader );
		_dotScreen.uniforms[ 'scale' ].value = Math.random();
		_composer.addPass( _dotScreen );

		_sepia = new THREE.ShaderPass( THREE.SepiaShader );
		_sepia.uniforms[ 'amount' ].value = Math.random();
		_composer.addPass( _sepia );

		_softFocus = new THREE.ShaderPass( THREE.SoftFocusShader );
		_softFocus.uniforms[ 'waveFactor' ].value = Math.random() * 0.0125;	//	0.00125
		_softFocus.uniforms[ 'sampleDistance' ].value = Math.random();
		_softFocus.uniforms[ 'opacity' ].value = Math.random();
		_composer.addPass( _softFocus );

		


		_glitch = new THREE.ShaderPass( THREE.DigitalGlitch );
		//_glitch.uniforms[ 'byp' ].value = 1;
		_glitch.uniforms[ 'amount' ].value = Math.random()*0.01;
		_glitch.uniforms[ 'angle' ].value = Math.random();
		_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;
		_glitch.uniforms[ 'seed_y' ].value = Math.random()*2-1;
		_glitch.uniforms[ 'distortion_x' ].value = Math.random()*10;
		_glitch.uniforms[ 'distortion_y' ].value = Math.random()*10;

		//_glitch.renderToScreen = true;
		_composer.addPass( _glitch );




		

		var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
		_copySahder.renderToScreen = true;
		_composer.addPass( _copySahder );
	}

	function btnClick()
	{
		render();
	}

	function render()
	{
		update();
		time = ( time + 1 ) | 0;

		camera.lookAt(focus);
		//renderer.render( scene, camera);
		_composer.render();
		//	window.requestAnimationFrame(render);
	}

	function update()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();