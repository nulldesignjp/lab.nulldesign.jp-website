/*
	engine.js
*/

var images = 'image.png';
var saveImage = function(){};

(function(){

	//	prop
	var scene, camera, focus, renderer, time, image;
	var _composer;
	var _resizeKey;
	var gui,_gui;
	//	start
	init();
	initComposer();
	//render();

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

		window.addEventListener( 'touchmove', function(e){
			e.preventDefault();
		})
	}
	function initComposer()
	{
		_composer = new THREE.EffectComposer( renderer );
		_composer.addPass( new THREE.RenderPass( scene, camera ) );

		var _sList = [
			{
				shader: THREE.RGBShiftShader,
				label: 'RGBShift',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					angle: {
						init: 0,
						min: -3.1415,
						max: 3.1415,
						step: 0.01
					}
				}
			},
			{
				shader: THREE.FilmShader,
				label: 'フィルム',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					grayscale: {
						init: 0,
						min: 0,
						max: 1,
						step: 1
					},
					sCount: {
						init: 0,
						min: 0,
						max: 100,
						step: 1
					}
				}
			},
			// {
			// 	shader: THREE.FocusShader,
			// 	label: 'フォーカス',
			// 	enabled: false,
			// 	isOpen: false,
			// 	renderToScreen: false
			// },
			{
				shader: THREE.HueSaturationShader,
				label: '色相・彩度',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					hue: {
						init: 0,
						min: -1,
						max: 1,
						step: 0.01
					},
					saturation: {
						init: 0,
						min: -1,
						max: 1,
						step: 0.01
					}
				}
			},
			{
				shader: THREE.VignetteShader,
				label: 'ビンテージ',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					darkness: {
						init: 0,
						min: 0,
						max: 10,
						step: 0.1
					}
				}
			},
			{
				shader: THREE.BadTVShader,
				label: '壊れたテレビ',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					time: {
						init: 0,
						min: 0,
						max: 1000,
						step: 1
					},
					distortion: {
						init: 0.1,
						min: 0.1,
						max: 10,
						step: 0.1
					},
					distortion2: {
						init: 0,
						min: 0,
						max: 10,
						step: 0.1
					},
					speed: {
						init: 0,
						min: 0,
						max: 10,
						step: 0.1
					},
					rollSpeed: {
						init: 0,
						min: 0,
						max: 1,
						step: 0.01
					}
				}
			},
			{
				shader: THREE.InvertShader,
				label: '反転',
				enabled: false,
				isOpen: false,
				renderToScreen: false
			},
			{
				shader: THREE.NoiseShader,
				label: 'ノイズ',
				enabled: false,
				isOpen: false,
				renderToScreen: false
			},
			// {
			// 	shader: THREE.ToyCamShader,
			// 	label: 'トイカメラ（故障',
			// 	enabled: false,
			// 	isOpen: false,
			// 	renderToScreen: false
			// },
			// {
			// 	shader: THREE.DotScreenShader,
			// 	label: 'ドット',
			// 	enabled: false,
			// 	isOpen: false,
			// 	renderToScreen: false
			// },
			{
				shader: THREE.SepiaShader,
				label: 'セピア',
				enabled: false,
				isOpen: false,
				renderToScreen: false
			},
			// {
			// 	shader: THREE.SoftFocusShader,
			// 	label: 'ソフトフォーカス',
			// 	enabled: false,
			// 	isOpen: false,
			// 	renderToScreen: false
			// },
			{
				shader: THREE.DigitalGlitch,
				label: 'グリッチ',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					amount: {
						init: 0,
						min: 0,
						max: 0.1,
						step: 0.001
					},
					angle: {
						init: 0,
						min: -3.1415,
						max: 3.1415,
						step: 0.01
					}
				}
			},
			{
				shader: THREE.D3Shader,
				label: '3次元',
				enabled: false,
				isOpen: false,
				renderToScreen: false,
				prop: {
					left: {
						init: 0,
						min: -2,
						max: 2,
						step: 0.01
					},
					top: {
						init: 0,
						min: -2,
						max: 2,
						step: 0.01
					}
				}
			}
		];

		gui = new dat.GUI();
		//gui.close();

		gui.add( window, 'images',[ 'image.png', 'image2.png', 'image3.png', 'image4.png', 'image5.png' ] ).name('画像選択').onFinishChange(function( newValue ){
			image.material.map = THREE.ImageUtils.loadTexture(images,null,function(){
				image.material.map.needsUpdate = true;
				render();
			});
		});
		var len = _sList.length;
		for( var i = 0; i < len; i++ )
		{
			var _effectData = _sList[i];
			var _effect = new THREE.ShaderPass( _effectData.shader );

			_effect.enabled = _effectData.enabled;
			_effect.renderToScreen = _effectData.renderToScreen;

			var f1 = gui.addFolder( _effectData.label );
			f1.add( _effect, 'enabled', _effect.enabled ).onChange(function(newValue){render()});
	
			for( var j in _effect.uniforms )
			{
				if( j == 'screenWidth' )
				{
					_effect.uniforms[ j ].value = window.innerWidth;
				} else if( j == 'screenHeight' )
				{
					_effect.uniforms[ j ].value = window.innerHeight;
				} else if( j != 'tDiffuse' && j != 'tDisp' )
				{
					var _init = 0.001;
					var _min = 0;
					var _max = 1;
					var _step = 0.001;
					if( _effectData.prop )
					{
						if( _effectData.prop[j] )
						{
							_init	=	_effectData.prop[j].init	?_effectData.prop[j].init:_init;
							_min	=	_effectData.prop[j].min		?_effectData.prop[j].min:_min;
							_max	=	_effectData.prop[j].max		?_effectData.prop[j].max:_max;
							_step	=	_effectData.prop[j].step	?_effectData.prop[j].step:_step;
						}
					} 
					_effect.uniforms[ j ].value = _init;
					f1.add( _effect.uniforms[j], 'value', _min, _max).step( _step ).name(j).listen().onChange(function(newValue){render()});
					_effect.uniforms[ j ].value = 0;
				}
				
			}

			_composer.addPass( _effect );
		}


		//	
		var Vals = function(){	this.aspect = 0;	}

		var _effect0 = new THREE.ShaderPass( THREE.EdgeShader );
		_effect0.enabled = false;
		_effect0.renderToScreen = false;
		var f1 = gui.addFolder( 'エッジ検出1' );
		f1.add( _effect0, 'enabled', false ).onChange(function(newValue){render()});
		_effect0.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		_composer.addPass( _effect0 );

		var _hoge = new Vals();
		f1.add( _hoge, 'aspect', 0, 10 ).step(1).onChange(function(newValue){
			_effect0.uniforms[ 'aspect' ].value = new THREE.Vector2(Math.pow( 2, newValue ),Math.pow( 2, newValue ));
			render();
		});


		var _effect1 = new THREE.ShaderPass( THREE.EdgeShader2 );
		_effect1.enabled = false;
		_effect1.renderToScreen = false;
		var f1 = gui.addFolder( 'エッジ検出2' );
		f1.add( _effect1, 'enabled', false ).onChange(function(newValue){render()});
		_effect1.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		_composer.addPass( _effect1 );

		//var Vals = function(){	this.aspect = 0;	}
		var _hoge = new Vals();
		f1.add( _hoge, 'aspect', 0, 10 ).step(1).onChange(function(newValue){
			_effect1.uniforms[ 'aspect' ].value = new THREE.Vector2(Math.pow( 2, newValue ),Math.pow( 2, newValue ));
			render();
		});




		/*
			save image
		*/
		gui.add( window, 'saveImage' ).name('画像を保存').onFinishChange(function(newValue){
			render();
			var _canvas = document.getElementsByTagName('canvas')[0];
			var _url = _canvas.toDataURL('image/png');
			window.open(_url,null);
		});



		

		var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
		_copySahder.renderToScreen = true;
		_composer.addPass( _copySahder );



		//_gui = new dat.GUI();



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