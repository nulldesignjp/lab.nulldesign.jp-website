/*
	world.js
*/

var world = (function(){

	function world( e )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.composer;
		//this.bufferTexture;
		this.ambient;
		this.controls;
		this.uniforms;

		this.init( e );

		var _t = this;
		window.addEventListener( 'resize', function(){	_t.resize();	})

		this.render( 0.0 );
	}

	world.prototype = {
		init : function( e )
		{
			var _bgColor = 0x000000;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			//	this.scene.fog = new THREE.Fog( _bgColor, 2, 12 );
			// this.scene.fog = new THREE.FogExp2( _bgColor, 0.095);

			// this.camera = new THREE.PerspectiveCamera(85, width / height, 0.01, 160 );

				this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 2000 );
			this.camera.position.set( 0, 0, 10 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _bgColor );
				//this.renderer.autoClearColor = false;
			// this.renderer.autoClear = false;




			this.composer = new THREE.EffectComposer( this.renderer );

			var renderPass = new THREE.RenderPass( this.scene, this.camera );
			renderPass.enabled = true;
			renderPass.renderToScreen = false;
			this.composer.addPass( renderPass );

			var MonoShader = {
				uniforms: {
					"tDiffuse": { type:"t", value: null },
					"resolution": { value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
					"mouse": { value: new THREE.Vector2( window.innerWidth * 0.5, window.innerHeight * 0.5 )},
					"time": { value: 0}
				},
				vertexShader: [
					"varying vec2 vUv;",
					"void main() {",
						"vUv = uv;",
						"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
					"}"
				].join( "\n" ),

				fragmentShader: [
						"uniform sampler2D tDiffuse;",
						"uniform vec2 resolution;",
						"uniform vec2 mouse;",
						"varying vec2 vUv;",
						"const float redScale   = 0.298912;",
						"const float greenScale = 0.586611;",
						"const float blueScale  = 0.114478;",
						"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
					"void main() {",
						"vec4 smpColor = texture2D(tDiffuse, vUv);",
						//"float grayColor = dot(smpColor.rgb, monochromeScale);",
						//"smpColor = vec4(vec3(grayColor), 1.0);",
						// "float luminance = ( 0.298912 * smpColor.r + 0.586611 * smpColor.g + 0.114478 * smpColor.b );",
						// "float brightness = max (smpColor.r, smpColor.g, smpColor.b);",
						"float _par = mouse.x / resolution.x;",
						"if(vUv.y > 0.5 ){",
						"	_par = 1.0 - _par;",
						"	_par = _par * 2.0 - 1.0;",
						"	if( _par < 0.0 )",
						"	{",
						"		smpColor.r = smpColor.r * ( 1.0 + _par ) + smpColor.r * 0.0;",
						"		smpColor.g = smpColor.g * ( 1.0 + _par ) + smpColor.g * 0.0;",
						"		smpColor.b = smpColor.b * ( 1.0 + _par ) + smpColor.b * 0.0;",
						"	} else {",
						"		smpColor.r = smpColor.r * ( 1.0 - _par ) + smpColor.r * _par;",
						"		smpColor.g = smpColor.g * ( 1.0 - _par ) + smpColor.g * _par;",
						"		smpColor.b = smpColor.b * ( 1.0 - _par ) + smpColor.b * _par;",
						"	}",
						"} else {",
						"	smpColor.r *= 1.0 - _par;",
						"	smpColor.g *= 1.0 - _par;",
						"	smpColor.b *= 1.0 - _par;",
						"}",

						/*
							https://hakuhin.jp/as/color.html#COLOR_01
							ここを移植すればいける気がする

							新しい赤色   = ( 元の赤色   * redMultiplier)   + redOffset;
							新しい緑色   = (元の緑色   * greenMultiplier) + greenOffset;
							新しい青色   = (元の青色   * blueMultiplier)  + blueOffset;
							新しい透過色 = (元の透過色 * alphaMultiplier) + alphaOffset;

							ra	Number	赤色の乗算成分 （倍率をパーセントで指定) デフォルトは 100
							ga	Number	緑色の乗算成分 （倍率をパーセントで指定) デフォルトは 100
							ba	Number	青色の乗算成分 （倍率をパーセントで指定) デフォルトは 100
							aa	Number	透過色の乗算成分 （倍率をパーセントで指定) デフォルトは 100
							rb	Number	赤色の加算成分 （-255 ～ 255 の値を指定) デフォルトは 0
							gb	Number	緑色の加算成分 （-255 ～ 255 の値を指定) デフォルトは 0
							bb	Number	青色の加算成分 （-255 ～ 255 の値を指定) デフォルトは 0
							ab	Number	透過色の加算成分 （-255 ～ 255 の値を指定) デフォルトは 0

						*/


						"gl_FragColor = smpColor;",
					"}"

				].join( "\n" )

			};
	
			var _shaderPass = new THREE.ShaderPass( MonoShader );
			_shaderPass.enabled = true;
			_shaderPass.renderToScreen = false;
			this.composer.addPass( _shaderPass );

			this.uniforms = _shaderPass.uniforms;
				
			var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
			_copySahder.renderToScreen = true;
			this.composer.addPass( _copySahder );

			var _t = this;
			window.addEventListener( 'mousemove', function(e){
				_t.uniforms.mouse.value.x = e.pageX;
				_t.uniforms.mouse.value.y = e.pageY;
			})


			//this.bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});
			// target = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
			// this.bufferTexture.texture.format = THREE.RGBFormat;
			// this.bufferTexture.texture.minFilter = THREE.NearestFilter;
			// this.bufferTexture.texture.magFilter = THREE.NearestFilter;
			// this.bufferTexture.texture.generateMipmaps = false;
			// this.bufferTexture.stencilBuffer = false;
			// this.bufferTexture.depthBuffer = true;
			// this.bufferTexture.depthTexture = new THREE.DepthTexture();
			// this.bufferTexture.depthTexture.type = THREE.UnsignedShortType;

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( 0x808080 );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
			this.directional.position.set( 45, 35, 105 );
			this.scene.add( this.directional );

			this.pointLight01 = new THREE.PointLight(0xFFFFFF, 1.0);
			this.pointLight01.position.set( 45, 35, 105 );
			// this.scene.add( this.pointLight01 );

			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = false;
			this.controls.autoRotateSpeed = - 0.125;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.15;
			this.controls.enableZoom = false;

			this.controls.enabled = false;
			this.controls.target = this.focus;

			this.controls.noKeys = false;

			this.controls.minDistance = 0.01;
			this.controls.maxDistance = 1600;

			// this.controls.minPolarAngle = 0; // radians
			// this.controls.maxPolarAngle = Math.PI * 0.45; // radians

		},
		render : function( _time )
		{
			var _t = this;
			window.requestAnimationFrame( function( e ){	_t.render( e );	} );

			_t.controls.update();
			_t.camera.lookAt( _t.focus );

			var _shaders = _t.composer.passes;
			var len = _shaders.length;
			for( var i = 1; i < len; i++ )
			{
				if( _shaders[i].uniforms.time != undefined )
				{
					_shaders[i].uniforms.time.value = _time / 1000.0;
				}
			}
			// render scene into target
			//_t.renderer.setRenderTarget( _t.bufferTexture );
			//_t.renderer.render( _t.scene, _t.camera );
			// render post FX
			// _t.renderer.setRenderTarget( null );
			//_t.renderer.render( _t.scene, _t.camera );

			//	normal
			// _t.renderer.setRenderTarget( _t.bufferTexture );
			// _t.renderer.render( _t.scene, _t.camera );
			// _t.renderer.setRenderTarget( null );

			//_t.renderer.render( _t.scene, _t.camera );
			_t.composer.render();
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;

			var _shaders = this.composer.passes;
			var len = _shaders.length;
			for( var i = 1; i < len; i++ )
			{
				if( _shaders[i].uniforms.resolution != undefined )
				{
					_shaders[i].uniforms.resolution.value.x = width;
					_shaders[i].uniforms.resolution.value.y = height;
					_shaders[i].uniformsNeedUpdate = true;
				}
			}

			this.renderer.setSize( width, height );
			this.composer.setSize( width, height );
			//this.bufferTexture.setSize( width, height );
			if( this.camera.aspect )
			{
				this.camera.aspect = width / height;
			} else {
				this.camera.left = - width * 0.5;
				this.camera.right = width * 0.5;
				this.camera.bottom = - height * 0.5;
				this.camera.top = height * 0.5;
			}
			this.camera.updateProjectionMatrix();
		},
		getWorldToScreen2D : function( _mesh )
		{
			var vector = new THREE.Vector3();
			var widthHalf = 0.5*this.renderer.context.canvas.width;
			var heightHalf = 0.5*this.renderer.context.canvas.height;
			_mesh.updateMatrixWorld();
			vector.setFromMatrixPosition(_mesh.matrixWorld);
			vector.project(this.camera);
			vector.x = ( vector.x * widthHalf ) + widthHalf;
			vector.y = - ( vector.y * heightHalf ) + heightHalf;
			return { 
			    x: vector.x,
			    y: vector.y
			};
		},
		add : function( e )
		{
			this.scene.add( e );
		},
		remove : function( e )
		{
			this.scene.remove( e );
		}
	}
	return world;
})();