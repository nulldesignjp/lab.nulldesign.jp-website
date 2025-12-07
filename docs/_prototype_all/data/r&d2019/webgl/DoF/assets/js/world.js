/*
	world.js
	ver 1.0.8
*/

var world = (function(){

	function world( e )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.target;
		this.ambient;
		this.controls;
		this.cameraMode;

		this.postScene;
		this.postCamera;

		this.init( e );



		var _t = this;
		window.addEventListener( 'resize', function(e){	_t.resize();	});

		this.render();

	}

	world.prototype = {
		init : function( e )
		{
			var _bgColor = 0x181818;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			//this.scene.fog = new THREE.Fog( _bgColor, 5, 1000 );

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
			//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 1000 );
			this.camera.position.set( 0, 0, 1 );
			this.focus = new THREE.Vector3(0,0,0);

			this.cameraMode = false;

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _bgColor );

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.target = new THREE.WebGLRenderTarget( window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio );
			this.target.texture.format = THREE.RGBFormat;
			this.target.texture.minFilter = THREE.NearestFilter;
			this.target.texture.magFilter = THREE.NearestFilter;
			this.target.texture.generateMipmaps = false;
			this.target.stencilBuffer = false;
			this.target.depthBuffer = true;
			this.target.depthTexture = new THREE.DepthTexture();
			this.target.depthTexture.type = THREE.UnsignedShortType;





			// Setup post processing stage
			this.postCamera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
			var postMaterial = new THREE.ShaderMaterial( {
				vertexShader: document.querySelector( '#post-vert' ).textContent.trim(),
				fragmentShader: document.querySelector( '#post-frag' ).textContent.trim(),
				uniforms: {
					cameraNear: { value: this.camera.near },
					cameraFar: { value: this.camera.far },
					tDiffuse: { value: this.target.texture },
					tDepth: { value: this.target.depthTexture }
				}
			} );
			var postPlane = new THREE.PlaneBufferGeometry( 2, 2 );
			var postQuad = new THREE.Mesh( postPlane, postMaterial );
			this.postScene = new THREE.Scene();
			this.postScene.add( postQuad );
	



			this.ambient = new THREE.AmbientLight( 0x454545 );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
			this.directional.position.set( 45, 35, 105 );
			this.scene.add( this.directional );

			//	controls
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			//this.controls = new NullDesignCamera( this.camera, this.renderer.domElement );
			//this.controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
			this.controls.autoRotate = false;
			this.controls.autoRotateSpeed = 0.025;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.5;
			this.controls.enableZoom = false;

			this.controls.enabled = true;
			this.controls.target = this.focus;

			this.controls.minDistance = 5;
			this.controls.maxDistance = 1000;

			// this.controls.minPolarAngle = 0; // radians
			//this.controls.maxPolarAngle = Math.PI * 0.48; // radians
		},
		render : function()
		{
			var _t = this;
			_t.controls.focus = _t.focus;
			//_t.controls.target = _t.focus;
			//_t.controls.center = _t.focus;
			_t.controls.update();


			// render scene into target
			_t.renderer.setRenderTarget( _t.target );
			_t.renderer.render( _t.scene, _t.camera );
			// render post FX
			_t.renderer.setRenderTarget( null );
			_t.renderer.render( _t.postScene, _t.postCamera );


			//_t.renderer.render( _t.scene, _t.camera );

			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.renderer.setSize( width, height );
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
		add : function( e )
		{
			this.scene.add( e );
		},
		remove : function( e )
		{
			this.scene.remove( e );
		},
		setCameraMode : function( e ){
			this.cameraMode = e;
			this.controls.enabled = !e;

			//	offset position.
			if( e ){	this.camera.position.set( 0, 100, 0 );	}
			if( !e ){	this.camera.position.set( 0, 0, 1 );	}
		},
		easeInOutSine : function (t,b,c,d)
		{
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
	}
	
	return world;

})();
