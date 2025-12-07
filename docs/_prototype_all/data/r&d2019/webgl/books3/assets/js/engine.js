/*
	engine.js
*/


window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _book;
	var _pages = [];
	var _pageCount = 0;

	var _mouse = {x:0,y:0}
	var _timeFrag = false
	var _time = 0;

	Start();
	//	Update();


	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.z = 500;

		var _grid = new THREE.GridHelper( 5000, 50 );
		_scene.add( _grid );

		//	本体
		var _book = new THREE.Object3D();
		_scene.add( _book );

		_book.rotation.x = - Math.PI * 0.5

		var _page = new THREE.Object3D();
		_pages[0] = _page;
		_book.add( _page );

		for( var i = 0; i < 32; i++ ){
			var _geometry = new THREE.IcosahedronGeometry( Math.random() * 8.0 + 4.0, 1 );


			var phongShader = CreatePhongShader();
			//phongShader.uniforms.map.value = new THREE.TextureLoader().load('jobs.jpg');

			phongShader.uniforms.diffuse = {}
			phongShader.uniforms.diffuse.value = new THREE.Color( Math.random(), Math.random(), Math.random() )

			var _material = new THREE.ShaderMaterial({
				//defines: { USE_MAP: '' },
				uniforms: phongShader.uniforms,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: phongShader.shader.fragmentShader,
				lights: true,
	            fog: true,
				transparent: true,
				side: THREE.DoubleSide,
				shading: THREE.FlatShading
			});

			var _mesh = new THREE.Mesh( _geometry, _material );
			_page.add( _mesh );

			_mesh.position.x = ( Math.random() - 0.5 ) * 200;
			_mesh.position.y = ( Math.random() - 0.5 ) * 200;
			_mesh.position.z = Math.random() * 100 + 20;

			phongShader.uniforms.gPosition = {};
			phongShader.uniforms.gPosition.value = _mesh.position;



				_mesh.rotation.z = Math.floor( Math.random() * 4.0 ) * Math.PI * 0.5;
		}



		//	even segements
		var _geometry = new THREE.PlaneGeometry( 300, 300, 10, 10 );

		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i].z = Math.random() * 5.0;
		}
		
		var phongShader = CreatePhongShader();
		phongShader.uniforms.map.value = new THREE.TextureLoader().load('jobs.jpg');

		var _material = new THREE.ShaderMaterial({
			defines: { USE_MAP: '' },
			uniforms: phongShader.uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: phongShader.shader.fragmentShader,
			lights: true,
            fog: true,
			transparent: true,
			side: THREE.DoubleSide
		});

		var _mesh = new THREE.Mesh( _geometry, _material );
		_page.add( _mesh );


		var loader = new THREE.OBJLoader();

		// load a resource
		loader.load(
			// resource URL
			'untitled.obj',
			// called when resource is loaded
			function ( object ) {


				var _geometry = object.children[0].geometry;
				//_geometry.translate(0,3,0);
				_geometry.rotateX( Math.PI * 0.5 );

				var len = _geometry.attributes.position.array.length;
				for( var i = 2; i < len; i+=3 )
				{
					if( _geometry.attributes.position.array[i] < 0.0 )
					{
						_geometry.attributes.position.array[i] = 0.0;
					}
				}

				for( var i = 0; i < 16; i++ )
				{
					var phongShader = CreatePhongShader();
					phongShader.uniforms.time.value = Math.PI;

					phongShader.uniforms.diffuse = {}
					phongShader.uniforms.diffuse.value = new THREE.Color( Math.random(), Math.random(), Math.random() )


					_material = new THREE.ShaderMaterial({
						uniforms: phongShader.uniforms,
						vertexShader:   document.getElementById( 'vertexshader' ).textContent,
						fragmentShader: phongShader.shader.fragmentShader,
						lights: true,
						fog: true,
						//shading: THREE.FlatShading
						side: THREE.DoubleSide
					});


					var __geometry = _geometry.clone();
					__geometry.rotateZ( i * Math.PI * 0.5 );


					var _mesh = new THREE.Mesh( __geometry, _material );
					_mesh.scale.x = _mesh.scale.y = _mesh.scale.z = 5;

					var _page = new THREE.Object3D();
					_pages.push( _page );

					_book.add( _page );
					_page.add( _mesh );


					_page.visible = false;

				}

				_timeFrag = true;

			},
			// called when loading is in progresses
			function ( xhr ) {

				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

			},
			// called when loading has errors
			function ( error ) {

				console.log( 'An error happened' );

			}
		)






		//loadFBX('suzanne.fbx' );
		loadFBX('untitled3.fbx' );

		function loadFBX( e ){

			// model
			var loader = new THREE.FBXLoader();
			loader.load( e, function ( object ) {



				object.traverse( function ( child ) {

					if ( child.isMesh ) {

						child.castShadow = true;
						child.receiveShadow = true;
						// child.material.wireframe = true;
						// child.material.wireframeLinewidth = 3;

						//	same material
						// child.material = new THREE.MeshPhongMaterial({
						// 	//color: new THREE.Color( 0.6, 0.6, 0.6 ),
						// 	//wireframe: true,
						// 	//wireframeLinewidth: 3
						// 	//transparent: true,
						// 	//opacity: 0.4,
							
						// 	vertexColors: THREE.VertexColors
						// });

						console.log( child.material )
					}

				} );

				object.position.y = 50.0


	  			_scene.add( object );



			}, undefined,
			function( _err ){
				console.log( 'Load FBX Error.')
			} );
		}






		window.addEventListener( 'click', function(e){

			if( e.pageX < window.innerWidth * 0.5 )
			{
				nextPrev(1000);
				_pageCount--
			} else {
				nextPage(1000);
				_pageCount++
			}
		})
	}

	function Update()
	{

		if( _timeFrag )
		{
			_time += _clock.getDelta();
			TWEEN.update();

		}
	}

	function nextPage( _duration )
	{
		console.log('next');

		var _current = _pages[ _pageCount ];
		var _next = _pages[ _pageCount + 1 ];

		_current.visible = true;
		_next.visible = true;

		var _ctarget = {
			from: 1.570796,
			to: 0.0,
			value: 1.570796
		}
		var _ntarget = {
			from: 3.141592,
			to: 1.570796,
			value: 3.141592
		}

		var _duration = _duration||500;

		var tween0 = new TWEEN.Tween(_ctarget)
			.to({ value: _ctarget.to }, _duration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function() {
				var _children = _current.children;
				for( var i in _children )
				{
					var _mesh = _children[i];
					_mesh.material.uniforms.time.value = _ctarget.value;
				}
			})
			.onComplete(function(){
				_current.visible = false;
			})
		.start();

		var tween1 = new TWEEN.Tween(_ntarget)
			.to({ value: _ntarget.to }, _duration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function() {
				var _children = _next.children;
				for( var i in _children )
				{
					var _mesh = _children[i];
					_mesh.material.uniforms.time.value = _ntarget.value;
				}
			})
		.start();

	}
	function nextPrev( _duration )
	{
		console.log('prev');

		var _current = _pages[ _pageCount ];
		var _prev = _pages[ _pageCount - 1 ];

		_current.visible = true;
		_prev.visible = true;


		var _ctarget = {
			from: 1.570796,
			to: 3.141592,
			value: 1.570796
		}
		var _ptarget = {
			from: 0.0,
			to: 1.570796,
			value: 0.0
		}

		var _duration = _duration||500;

		var tween0 = new TWEEN.Tween(_ctarget)
			.to({ value: _ctarget.to }, _duration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function() {
				var _children = _current.children;
				for( var i in _children )
				{
					var _mesh = _children[i];
					_mesh.material.uniforms.time.value = _ctarget.value;
				}
			})
		.start();

		var tween1 = new TWEEN.Tween(_ptarget)
			.to({ value: _ptarget.to }, _duration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(function() {
				var _children = _prev.children;
				for( var i in _children )
				{
					var _mesh = _children[i];
					_mesh.material.uniforms.time.value = _ptarget.value;
				}
			})
			.onComplete(function(){
				_current.visible = false;
			})
		.start();

	}

	function CreatePhongShader()
	{
		var phongShader = THREE.ShaderLib.phong;
		var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		uniforms.time = {};
		uniforms.time.value = Math.PI * 0.5;

		//	custom
		//	uniforms.map.value = new THREE.TextureLoader().load('hoge.jpg');
		//	uniforms.diffuse = {}
		//	uniforms.diffuse.value = new THREE.Color( Math.random(), Math.random(), Math.random() )


		var obj = {};
		obj.shader = phongShader;
		obj.uniforms = uniforms;

		return obj;


	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
