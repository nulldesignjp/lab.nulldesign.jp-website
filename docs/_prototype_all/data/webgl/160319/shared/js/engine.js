/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		var _t = this;
		var width  = window.innerWidth;
		var height = window.innerHeight;
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x080808, 1600, 3200 );

		this.camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 3200 );
		this.camera.position.set( 0, 0, 100 );

		this.focus = new THREE.Vector3(0,0,0);

		this.renderer = new THREE.WebGLRenderer({
			precision: "highp",
			alpha: true,
			premultipliedAlpha: true,
			antialias: true,	//	Default is false
			stencil: true,
			preserveDrawingBuffer: false,
			depth: true,
			logarithmicDepthBuffer: false
		});
		this.renderer.setSize( width, height  );
		this.renderer.setClearColor( 0x080808 );

		this.renderTarget = new THREE.WebGLRenderTarget(width, height, {
			magFilter: THREE.NearestFilter,
			minFilter: THREE.NearestFilter,
			wrapS: THREE.ClampToEdgeWrapping,
			wrapT: THREE.ClampToEdgeWrapping
		});

		this.subScene = new THREE.Scene();
		this.subCamera = new THREE.PerspectiveCamera(60, this.renderTarget.width / this.renderTarget.height, 0.1, 5000);
		this.subCamera.position.copy( this.camera.position );
		this.subLight = new THREE.DirectionalLight(0xffffff);
		this.subLight.position = new THREE.Vector3(0.0, 0.0, 10.0);
		this.subScene.add(this.subLight);

		this.cubes = [];

		for( var i = 0; i < 300; i++ )
		{
			var _color = new THREE.Color( Math.random(), Math.random(), Math.random() );
			this.subMesh = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({
				color: _color
			}));

			this.subScene.add(this.subMesh);

			this.subMesh.position.set( (Math.random()-.5)*1000,(Math.random()-.5)*1000,(Math.random()-.5)*1000)
			this.subMesh.rotation.set( (Math.random()-.5)*Math.PI*2.0,(Math.random()-.5)*Math.PI*2.0,(Math.random()-.5)*Math.PI*2.0);

			this.cubes[i] = this.subMesh;

			var _c = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30), new THREE.MeshBasicMaterial({
				color: _color,
				wireframe: true
			}));

			_c.position.copy( this.subMesh.position );
			_c.rotation.copy( this.subMesh.rotation );

			this.scene.add( _c );
		}

		//	BALL
		var _geometry = new THREE.IcosahedronGeometry( 20, 3 );
		var _material = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.FlatShading, map: this.renderTarget});
		this.mesh = new THREE.Mesh( _geometry, _material );
		this.scene.add( this.mesh );

		var _amb = new THREE.AmbientLight( 0x181818 );
		this.scene.add( _amb );
		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 800 );
		_light.position.set( 100,100,100);
		this.scene.add( _light )
		this.subScene.add(this.subMesh);

		//	skybox
		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load( 'Cosmos08.jpg', function( texture ){
			var _geometry = new THREE.IcosahedronGeometry( 1000, 0 );
			var _material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide, map: texture });
			var _sky = new THREE.Mesh( _geometry, _material );
			_t.subScene.add( _sky );
		} );

		document.getElementById( 'webglView' ).appendChild(this.renderer.domElement);

		var _t = this;
		window.onresize = function(){
			var width  = window.innerWidth;
			var height = window.innerHeight;
			_t.renderer.setSize( width, height );
			if( _t.isComposer )
			{
				_t.composer.setSize( width, height );
			}
			if( _t.camera.aspect )
			{
				_t.camera.aspect = width / height;
			} else {
				_t.camera.left = - width * 0.5;
				_t.camera.right = width * 0.5;
				_t.camera.bottom = - height * 0.5;
				_t.camera.top = height * 0.5;
			}
			
			_t.camera.updateProjectionMatrix();
		};

		//	controls
		this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		//this.controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		this.controls.autoRotate = false;
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

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			_t.controls.update();

			_t.camera.lookAt( _t.focus );
			_t.renderer.render( _t.subScene, _t.subCamera, _t.renderTarget );
			_t.renderer.render( _t.scene, _t.camera );

			var len = _t.cubes.length;
			while( len )
			{
				len --;
				var _cube = _t.cubes[len];
				_cube.rotation.x -= 0.01;
				_cube.rotation.y -= 0.01;
				_cube.rotation.z -= 0.01;
			}

		}
	}

	return Practice;
})();

var _pr = new Practice();

