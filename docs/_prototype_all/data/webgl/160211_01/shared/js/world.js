/*
	world
	ver 1.0.7
*/

var world = (function(){

	function world( e, isComposer )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.ambient;
		this.controls;

		this.isComposer = isComposer==undefined?false:isComposer;
		this.composer;

		this.init( e );

		var _t = this;
		window.onresize = function(){
			_t.resize();
		};

		$('canvas').css({
			'zoom': 0.5
		});

		this.render();
	}

	world.prototype = {
		init : function( e )
		{
			var _t = this;
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0x080808, 1600, 3200 );

			this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3200 );
			//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, - height * 0.5, height * 0.5, 0.1, 1000 );
			this.camera.position.set( 0, 0, 100 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer();
			this.renderer.setSize( width * 2, height * 2  );
			this.renderer.setClearColor( 0x000000 );

			//	render
			this._render = function(){	_t.renderer.render( _t.scene, _t.camera );	};

			//	composer
			if( this.isComposer )
			{
				this.composer = new THREE.EffectComposer( _t.renderer );
				this.composer.addPass( new THREE.RenderPass( _t.scene, _t.camera ) );
				
				var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
				_copySahder.renderToScreen = true;
				this.composer.addPass( _copySahder );

				//	render
				_t._render = function(){	_t.composer.render( 0.1 );	};
			}

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( 0x000000 );
			this.scene.add( this.ambient );

			//	controls
			this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
			//this.controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
			this.controls.autoRotate = true;
			this.controls.autoRotateSpeed = 1.0;
			
			this.controls.enableDamping = true;
			this.controls.dampingFactor = 0.15;
			this.controls.enableZoom = false;

			this.controls.enabled = true;
			this.controls.target = this.focus;

			// this.controls.minDistance = 480;
			// this.controls.maxDistance = 960;

			// this.controls.minPolarAngle = 0; // radians
			// this.controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians

		},
		addPass : function( e )
		{
			if( this.isComposer )
			{
				var len = this.composer.passes.length;
				this.composer.passes.splice( len - 1, 0, e );
			} else {
				console.warn('no use THREE.EffectComposer!');
			}
			
		},
		_render : function()
		{
			//	override.
		},
		render : function()
		{
			var _t = this;
			_t.controls.update();
			_t.camera.lookAt( _t.focus );
			_t._render();

			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.renderer.setSize( width * 2, height * 2 );
			if( this.isComposer )
			{
				this.composer.setSize( width * 2, height * 2 );
			}
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
