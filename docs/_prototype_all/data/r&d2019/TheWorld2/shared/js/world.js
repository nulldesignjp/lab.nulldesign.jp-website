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

		//	this.render( 0.0 );
	}

	world.prototype = {
		init : function( e )
		{
			var _bgColor = 0x000000;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();

			//	Fog
			//	this.scene.fog = new THREE.Fog( _bgColor, 2, 12 );
			//	this.scene.fog = new THREE.FogExp2( _bgColor, 0.095);

			this.camera = new THREE.PerspectiveCamera(60, width / height, 0.01, 1200 );
			// this.cameraFlat = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 100 );
			this.camera.position.set( 0, 0, 10 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: true/*, preserveDrawingBuffer: true */});
			//this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _bgColor );

			//	多重レンダリング
			//	this.renderer.autoClearColor = false;
			//	this.renderer.autoClear = false;




			this.composer = new THREE.EffectComposer( this.renderer );

			var renderPass = new THREE.RenderPass( this.scene, this.camera );
			renderPass.enabled = true;
			renderPass.renderToScreen = false;
			this.composer.addPass( renderPass );

			var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
			_copySahder.renderToScreen = true;
			this.composer.addPass( _copySahder );


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
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = 0.25;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.15;
			this.controls.enableZoom = false;

			this.controls.enabled = true;
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

			// var _shaders = _t.composer.passes;
			// var len = _shaders.length;
			// for( var i = 1; i < len; i++ )
			// {
			// 	if( _shaders[i].uniforms.time != undefined )
			// 	{
			// 		_shaders[i].uniforms.time.value = _time / 1000.0;
			// 	}
			// }
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
				if( _shaders[i].uniforms != undefined && _shaders[i].uniforms.resolution != undefined )
				{
					_shaders[i].uniforms.resolution.value.x = width;
					_shaders[i].uniforms.resolution.value.y = height;
				} else if( _shaders[i].resolution != undefined )
				{
					_shaders[i].resolution.x = width;
					_shaders[i].resolution.y = height;
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

			var _dir0 = new THREE.Vector3().subVectors( this.focus, this.camera.position );
			var _dir1 = new THREE.Vector3().subVectors( _mesh.position, this.camera.position );
			var _d = _dir0.dot( _dir1 );
			if( _d <= 0 ){
				vector.x = -9999;
				vector.y = -9999;
			}

			return { 
			    x: vector.x,
			    y: vector.y
			};
		},
		hitTestFromRaycast	: function( _from, _dir, _target )
		{
			var ray = new THREE.Raycaster(
				_from,	//	from vec3
				_dir	//	to vec3	
			);

		    var objs = ray.intersectObject( _target );

			if( objs.length )
			{
				//	hit.
				var obj = objs[0];
				//	obj.point.y;
				//	console.log( obj )
				return obj[0];
			}
			return null;

		},
		add : function( e )
		{
			this.scene.add( e );
		},
		remove : function( e )
		{
			this.scene.remove( e );
		},
		addPass : function( e )
		{
			e.enabled = true;
			e.renderToScreen = false;

			var _shaders = this.composer.passes;
			var len = _shaders.length;
			_shaders.splice( len - 1, 0, e );
			return _shaders;
		},
		removePass : function( e )
		{
			var _shaders = this.composer.passes;
			var len = _shaders.length;
			while( len )
			{
				len--;
				if( _shaders == e )
				{
					_shaders.splice( len, 1 );
					return _shaders;
				}
			}
			return _shaders;
		},
	}
	return world;
})();