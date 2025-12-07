/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP

		var width  = window.innerWidth;
		var height = window.innerHeight;
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x080808, 1600, 3200 );

		this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3200 );
		//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 0.1, 3200 );
		this.camera.position.set( 0, 0, 1000 );
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
		//this.renderer.setClearColor( 0x181818 );
		this.renderer.gammaInput = true;
		this.renderer.gammaOutput = true;


		this.ambient = new THREE.AmbientLight( 0x181818 );
		this.scene.add( this.ambient );

		this.pointLight = new THREE.PointLight( 0xFFFFFF, 3.0, 1600 );
		this.scene.add( this.pointLight );

		this.pointLight2 = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		this.scene.add( this.pointLight2 );

		this.pointLight3 = new THREE.PointLight( 0xFFFFFF, 2.0, 1600 );
		this.scene.add( this.pointLight3 );
		this.pointLight3.position.set( 400, 400, 400 )

		this.sunLight = new THREE.SpotLight( 0xffffff, 0.3, 0, Math.PI/2, 1 );
		this.sunLight.position.set( 1000, 2000, 1000 );

		this.scene.add( this.sunLight );


		document.getElementById( 'webglView' ).appendChild(this.renderer.domElement);

		this.camera.position.z = 500;

		this.cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );

		var path = "./";
		var format = '.jpg';
		var urls = [
				path + 'px' + format, path + 'nx' + format,
				path + 'py' + format, path + 'ny' + format,
				path + 'pz' + format, path + 'nz' + format
			];

		var reflectionCube = new THREE.CubeTextureLoader().load( urls );

		//var materialLambert = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, map: textureNoiseColor } );
		//var materialPhong = new THREE.MeshPhongMaterial( { shininess: 50, color: 0xffffff, specular: 0x999999, map: textureLava } );
		var materialPhongCube = new THREE.MeshPhongMaterial( { shininess: 20, color: 0xffffff, specular: 0xCCCCCC, envMap: this.cubeCamera.renderTarget } );
		var materialPhongCube = new THREE.MeshPhongMaterial( { shininess: 20, color: 0xffffff, specular: 0xFFFFFF, envMap: reflectionCube } );

		var _geometry = new THREE.BoxGeometry( 200, 200, 200, 1, 1, 1 );
		var _mesh = new THREE.Mesh( _geometry, materialPhongCube );
		this.scene.add( _mesh );
		_mesh.rotation.x = Math.PI * 0.25;
		_mesh.rotation.y = Math.PI * 0.25;

		this.list = [];
		for( var i = 0; i < 16; i++ )
		{
			var _geometry = new THREE.IcosahedronGeometry( Math.floor( Math.random() * 120 ) + 20 , 3 );
			var _mesh = new THREE.Mesh( _geometry, materialPhongCube );
			_mesh.position.set( (Math.random()-.5)*1000,(Math.random()-.5)*1000,(Math.random()-.5)*1000 );
			this.scene.add( _mesh );

			this.list[i] = {
				mesh: _mesh,
				vec: new THREE.Vector3(Math.random()-.5,Math.random()-.5,Math.random()-.5).normalize()
			};

		}

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

		this.loop();

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


	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var len = _t.list.length;
			while( len )
			{
				len --;
				var _obj = _t.list[len];
				var _mesh = _obj.mesh;
				var _vec = _obj.vec;

				var _speed =2.0
				_mesh.position.x += _vec.x * _speed;
				_mesh.position.y += _vec.y * _speed;
				_mesh.position.z += _vec.z * _speed;

				if( _mesh.position.x < -500 )
				{
					_mesh.position.x = -500;
					_vec.x *= -1;
				} else if( _mesh.position.x > 500 ){
					_mesh.position.x = 500;
					_vec.x *= -1;
				}

				if( _mesh.position.y < -500 )
				{
					_mesh.position.y = -500;
					_vec.y *= -1;
				} else if( _mesh.position.y > 500 ){
					_mesh.position.y = 500;
					_vec.y *= -1;
				}

				if( _mesh.position.z < -500 )
				{
					_mesh.position.z = -500;
					_vec.z *= -1;
				} else if( _mesh.position.z > 500 ){
					_mesh.position.z = 500;
					_vec.z *= -1;
				}

			}

			_t.cubeCamera.updateCubeMap( _t.renderer, _t.scene );
			_t.renderer.render( _t.scene, _t.camera );
			_t.controls.update();
		}
	}

	return Practice;
})();

var _pr = new Practice();

