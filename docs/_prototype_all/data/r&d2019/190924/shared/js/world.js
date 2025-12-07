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

		this.init( e );

		var _t = this;
		window.addEventListener( 'resize', function(){	_t.resize();	})

		this.render( 0.0 );
	}

	world.prototype = {
		init : function( e )
		{
			var _bgColor = 0x090909;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( _bgColor, 800, 3200 );

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 3200 );

			//	this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 2000 );
			this.camera.position.set( -100, 500, 1000 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: false });
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
					"tDiffuse": { type:"t", value: null }
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
						"varying vec2 vUv;",
						"const float redScale   = 0.298912;",
						"const float greenScale = 0.586611;",
						"const float blueScale  = 0.114478;",
						"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
					"void main() {",
						"vec4 smpColor = texture2D(tDiffuse, vUv);",
						"float grayColor = dot(smpColor.rgb, monochromeScale);",
						"smpColor = vec4(vec3(grayColor), 1.0);",
						"gl_FragColor = smpColor;",
					"}"

				].join( "\n" )

			};
	
			var _shaderPass = new THREE.ShaderPass( MonoShader );
			_shaderPass.enabled = true;
			_shaderPass.renderToScreen = false;
			//this.composer.addPass( _shaderPass );
				
			var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
			_copySahder.renderToScreen = true;
			this.composer.addPass( _copySahder );


			//this.bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( 0x333333 );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
			this.directional.position.set( 45, 35, 105 );
			this.scene.add( this.directional );

			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = 0.5;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.15;
			this.controls.enableZoom = false;

			this.controls.enabled = true;
			this.controls.target = this.focus;

			this.controls.noKeys = false;

			this.controls.minDistance = 0.01;
			this.controls.maxDistance = 1600;

			this.controls.minPolarAngle = 0; // radians
			this.controls.maxPolarAngle = Math.PI * 0.45; // radians

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