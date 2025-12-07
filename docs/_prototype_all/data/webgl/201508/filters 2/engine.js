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

	//	http://learningthreejs.com/blog/2011/08/14/dat-gui-simple-ui-for-demos/
	//	http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
	var gui;

	/*

	var params = {
	    interation: 5000
	};
	gui.add(params, 'interation');
	gui.add(params, 'interation').onFinishChange(function(){
		    // refresh based on the new value of params.interation
	});
	gui.add(params, 'interation').name('Intertions');
	//gui.add(params, 'width').min(128).max(256).step(16);

	var FizzyText = function() {
		this.messate = 'message01';
		this.growthSpeed = 0;
		this.displayOutline = false;
		this.explode = function(){}
	};
	var text = new FizzyText();
	//gui.add(text, 'noiseStrength').step(5); // Increment amount
	gui.add(text, 'growthSpeed', -5, 5); // Min and max
	//gui.add(text, 'maxSize').min(0).step(0.25); // Mix and match

	gui.add(text, 'messate', 'message');
	gui.add(text, 'displayOutline', false);
	gui.add(text, 'explode');

	var FizzyText = function() {
		this.speed = 0;
		this.noiseStrength = 0;
	};
	var text = new FizzyText();
	var f1 = gui.addFolder('Flow Field');
	f1.add(text, 'speed');
	f1.add(text, 'noiseStrength');
	f1.open();
	*/


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

		if( _values[1] == 'on')
		{
		}
		if( _values[2] == 'on' )
		{
		}
		if( _values[3] == 'on' )
		{
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
		gui = new dat.GUI();

		_composer = new THREE.EffectComposer( renderer );
		_composer.addPass( new THREE.RenderPass( scene, camera ) );

		_rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
		_rgbShift.uniforms[ 'amount' ].value = 0.0015;
		//_rgbShift.renderToScreen = true;
		_composer.addPass( _rgbShift );

			var FizzyText = function()
			{
				this.enabled = false;
				this.amount = 0.001;
				this.angle = 0.1;
			};
			var text = new FizzyText();
			var f1 = gui.addFolder('RGBShiftShader');
			//gui.add(text, 'noiseStrength').step(5); // Increment amount
			f1.add(text, 'enabled', false).onFinishChange(function(){
				_rgbShift.enabled = this.object.enabled;
				render();
			});
			f1.add(text, 'amount', 0, 0.05).step(0.0001).onFinishChange(function(){
				_rgbShift.uniforms[ 'amount' ].value = this.object.amount;
				render();
			});
			f1.add(text, 'angle', 0, 3.14).step(0.01).onFinishChange(function(){
				_rgbShift.uniforms[ 'angle' ].value = this.object.angle;
				render();
			});



		_film = new THREE.ShaderPass( THREE.FilmShader );
		_film.uniforms[ 'sIntensity' ].value = Math.random();
		_film.uniforms[ 'nIntensity' ].value = Math.random();
		_film.uniforms[ 'sCount' ].value = 32;
		_film.uniforms[ 'grayscale' ].value = 0;
		//_film.renderToScreen = true;
		_composer.addPass( _film );

			var FizzyText = function()
			{
				this.enabled = false;
				this.sIntensity = 0.01;
				this.nIntensity = 0.01;
				this.sCount = 8;
				this.grayscale = 0;
			};
			var text = new FizzyText();
			var f1 = gui.addFolder('FilmShader');
			f1.add(text, 'enabled', false).onFinishChange(function(){
				_film.enabled = this.object.enabled;
				render();
			});
			f1.add(text, 'sIntensity', 0, 1.0).step(0.01).onFinishChange(function(){
				_film.uniforms[ 'sIntensity' ].value = this.object.sIntensity;
				render();
			});
			f1.add(text, 'nIntensity', 0, 1.0).step(0.01).onFinishChange(function(){
				_film.uniforms[ 'nIntensity' ].value = this.object.nIntensity;
				render();
			});
			f1.add(text, 'sCount', 0, 32).onFinishChange(function(){
				_film.uniforms[ 'sCount' ].value = this.object.sCount;
				render();
			});
			f1.add(text, 'grayscale', 0, 1.0).onFinishChange(function(){
				_film.uniforms[ 'grayscale' ].value = this.object.grayscale;
				render();
			});






		// 	くそ重い
		_edgeShader = new THREE.ShaderPass( THREE.EdgeShader );
		_edgeShader.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		//_edgeShader.renderToScreen = true;
		_composer.addPass( _edgeShader );

			var FizzyText = function()
			{
				this.enabled = false;
				this.aspect = 0;
			};
			var text = new FizzyText();
			var f1 = gui.addFolder('EdgeShader');
			f1.add(text, 'enabled', false).onFinishChange(function(){
				_edgeShader.enabled = this.object.enabled;
				render();
			});
			f1.add(text, 'aspect', 0, 10).step(1).onFinishChange(function(){
				var __value = Math.pow( 2, this.object.aspect );
				_edgeShader.uniforms[ 'aspect' ].value = new THREE.Vector2(__value,__value);
				render();
			});




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

			var FizzyText = function()
			{
				this.enabled = false;
				this.waveFactor = 0.005;
				this.sampleDistance = 0.1;
			};
			var text = new FizzyText();
			var f1 = gui.addFolder('FocusShader');
			f1.add(text, 'enabled', false).onFinishChange(function(){
				_focus.enabled = this.object.enabled;
				render();
			});
			f1.add(text, 'waveFactor', 0, 0.01).step(0.0001).onFinishChange(function(){
				_focus.uniforms[ 'waveFactor' ].value = this.object.waveFactor;
				render();
			});
			f1.add(text, 'sampleDistance', 0, 1.0).step(0.001).onFinishChange(function(){
				_focus.uniforms[ 'sampleDistance' ].value = this.object.sampleDistance;
				render();
			});




		_hueAndSaturetion = new THREE.ShaderPass( THREE.HueSaturationShader );
		_hueAndSaturetion.uniforms[ 'hue' ].value = 0.0;
		_hueAndSaturetion.uniforms[ 'saturation' ].value = 0.0;
		//_hueAndSaturetion.renderToScreen = true;
		_composer.addPass( _hueAndSaturetion );


			var FizzyText = function()
			{
				this.enabled = false;
				this.hue = 0.01;
				this.saturation = 0.01;
			};
			var text = new FizzyText();
			var f1 = gui.addFolder('HueSaturationShader');
			f1.add(text, 'enabled', false).onFinishChange(function(){
				_hueAndSaturetion.enabled = this.object.enabled;
				render();
			});
			f1.add(text, 'hue', -1, 1).step(0.01).onFinishChange(function(){
				_hueAndSaturetion.uniforms[ 'hue' ].value = this.object.hue;
				render();
			});
			f1.add(text, 'saturation', -1, 1).step(0.01).onFinishChange(function(){
				_hueAndSaturetion.uniforms[ 'saturation' ].value = this.object.saturation;
				render();
			});






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