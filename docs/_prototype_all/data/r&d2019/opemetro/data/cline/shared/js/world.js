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
		this.ambient;
		this.controls;

		this.init( e );

		var _t = this;
		window.addEventListener( 'resize', function(){	_t.resize();	})

		this.render();
	}

	world.prototype = {
		init : function( e )
		{
			var _bgColor = 0x090909;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( _bgColor, 1000, 3000 );

			//	this.sceneBg = new THREE.Scene();

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.01, 3000 );
			//	this.cameraBg = new THREE.PerspectiveCamera(50, width / height, 0.1, 5000 );
			//	this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 2000 );
			this.camera.position.set( 0, 500, 0 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			//this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _bgColor );
				//this.renderer.autoClearColor = false;
			// this.renderer.autoClear = false;



			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( 0x333333 );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
			this.directional.position.set( 45, 35, 105 );
			this.scene.add( this.directional );

			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			this.controls.autoRotate = false;
			this.controls.autoRotateSpeed = 0.1;
			
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

			_t.renderer.render( _t.scene, _t.camera );
			//_t.composer.render();

			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.renderer.setSize( width, height );
			//this.composer.setSize( width, height );
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