/*
	world.js
	auth: nulldesign.jp
	url: http://nulldesign.jp/
*/

var world = (function(){

	var _backgroundColor	=	0x454545;
	var _ambientLight		=	0x454545;
	var _directionalLight	=	0xFFFFFF;
	var _pastTime = 0;

	function world( e )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.composer;
		this.ambient;
		this.directional;
		this.controls;
		this.bufferTexture;

		this.init( e );

		var _t = this;
		window.onresize = function(){
			_t.resize();
		};

		_pastTime = new Date().getTime() * 0.001;

		this.render();
	}

	world.prototype = {
		init : function( e )
		{

			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color( _backgroundColor );
			this.scene.fog = new THREE.Fog( _backgroundColor, 500, 1000 );

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
			//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 1000 );
			this.camera.position.set( 100, 140, 100 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: 1 });
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _backgroundColor );
			this.renderer.shadowMap.enabled = true;
			this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;	//	THREE.BasicShadowMap, THREE.PCFShadowMap, THREE.PCFSoftShadowMap

			this.composer = new THREE.EffectComposer( this.renderer );
			this.composer.setSize( width, height  );
			this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

			this.bufferTexture = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter});

			var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
			_copySahder.renderToScreen = true;
			this.composer.addPass( _copySahder );

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( _ambientLight );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight( _directionalLight, 1.0);
			this.directional.position.set( 45, 65, 105 ).normalize().addScalar( 800 );
			this.directional.castShadow = true;
			this.directional.shadow.mapSize.width = 1024;
			this.directional.shadow.mapSize.height = 1024;
			this.directional.shadow.camera.near = 0.5;
			this.directional.shadow.camera.far = 1600;
			this.directional.shadow.camera.top = 500;
			this.directional.shadow.camera.bottom = -500;
			this.directional.shadow.camera.left = -500;
			this.directional.shadow.camera.right = 500;

			this.scene.add( this.directional );

			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = 0.0625;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.15;
			this.controls.enableZoom = false;

			this.controls.enabled = true;
			this.controls.target = this.focus;

			// this.controls.minDistance = 240;
			// this.controls.maxDistance = 480;

			// this.controls.minPolarAngle = 0; // radians
			// this.controls.maxPolarAngle = Math.PI * 0.45; // radians

		},
		render : function()
		{
			var _t = this;
			_t.controls.update();
			_t.camera.lookAt( _t.focus );

			//	update duration
			var _currentTime = new Date().getTime() * 0.001;
			var _delta = _currentTime - _pastTime;
			_pastTime = _currentTime;

			var len = _t.composer.passes.length;
			for( var i = 1; i < len-1; i++ )
			{
				if( _t.composer.passes[i].uniforms && _t.composer.passes[i].uniforms.time )
				{
					_t.composer.passes[i].uniforms.time.value += _delta;
				}
			}


			_t.renderer.render( _t.scene, _t.camera, _t.bufferTexture );
			_t.composer.render();
			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;

			var len = this.composer.passes.length;
			for( var i = 1; i < len-1; i++ )
			{
				if( this.composer.passes[i].uniforms && this.composer.passes[i].uniforms.resolution )
				{
					this.composer.passes[i].uniforms.resolution.value.x = width;
					this.composer.passes[i].uniforms.resolution.value.y = height;
				}
			}

			this.renderer.setSize( width, height );
			this.composer.setSize( width, height  );
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

			//	update view
			this.controls.update();
			this.camera.lookAt( this.focus );
			this.composer.render();
		},
		getWorldToScreen2D : function( _mesh )
		{
			var vector = new THREE.Vector3();
			var widthHalf = 0.5 * this.renderer.context.canvas.width;
			var heightHalf = 0.5 * this.renderer.context.canvas.height;
			_mesh.updateMatrixWorld();
			vector.setFromMatrixPosition(_mesh.matrixWorld);
			vector.project(this.camera);
			vector.x = ( vector.x * widthHalf ) + widthHalf;
			vector.y = - ( vector.y * heightHalf ) + heightHalf;
			//	前後判定
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
		addPass : function( e ){
			var len = this.composer.passes.length;
			this.composer.passes.splice( len - 1, 0, e );
		},
		removePass : function( e ){
			var len = this.composer.passes.length;
			e = e < 1?1 : e>len-2? len-2:e;
			this.composer.passes.splice( e, 1 );
		}
	}
	return world;
})();