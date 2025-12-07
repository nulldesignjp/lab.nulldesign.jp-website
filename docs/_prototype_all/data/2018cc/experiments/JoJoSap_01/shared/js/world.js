/*
	world.js
	auth: TrekTrack @HAKUHODO i-studio, Inc.
	url: http://trektrack.jp/
*/

var world = (function(){

	function world( e )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.composer;
		this.ambient;
		this.controls;

		this.cameraMode;

		this.init( e );

		var _t = this;
		window.onresize = function(){
			_t.resize();
		};

		this.render();
	}

	world.prototype = {
		init : function( e )
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0x000000, 800, 1000 );

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000 );
			//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 1000 );
			this.camera.position.set( 100, 140, 100 );
			this.focus = new THREE.Vector3(0,0,0);

			this.cameraMode = false;

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( 0x000000 );

			this.composer = new THREE.EffectComposer( this.renderer );
			this.composer.setSize( width, height  );
			this.composer.addPass( new THREE.RenderPass( this.scene, this.camera ) );

			var _effect = new THREE.ShaderPass( THREE.BadTVShader );
			_effect.enabled = false;
			_effect.renderToScreen = false;
			_effect.uniforms.time.value = 0;
			_effect.uniforms.distortion.value = 3;
			_effect.uniforms.distortion2.value = 5;
			_effect.uniforms.speed.value = 0.01;
			_effect.uniforms.rollSpeed.value = 0.0;

			this.composer.addPass( _effect );



			var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
			_copySahder.renderToScreen = true;
			this.composer.addPass( _copySahder );

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( 0x333333 );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight(0xFFFFFF, 1.0);
			this.directional.position.set( 45, 35, 105 );
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
			//	_t.renderer.render( _t.scene, _t.camera );

			_t.composer.passes[1].uniforms.time.value += 1 / 60;

			_t.composer.render();
			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
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
		},
		setCameraMode : function( e ){
			this.cameraMode = e;
			this.controls.enabled = !e;
			if( e ){	this.camera.position.set( 0, 0, 100 );	}
			if( !e ){	this.camera.position.set( 0, 0, 100 );	}
		}
	}
	return world;
})();