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


		//	even segements
		var _geometry = new THREE.PlaneGeometry( 300, 300, 10, 10 );

			var len = _geometry.vertices.length;
			for( var i = 0; i < len; i++ )
			{
				_geometry.vertices[i].z = Math.random() * 5.0;
			}

			var geom = new THREE.IcosahedronGeometry( 20, 1 );
			geom.translate(0,0,100);
			var matel = new THREE.MeshBasicMaterial();
			var mesh = new THREE.Mesh( geom, matel);
  			mesh.updateMatrix();

  			_geometry.merge( mesh.geometry, mesh.matrix);


		var phongShader = THREE.ShaderLib.phong;
		var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		uniforms.time = {};
		uniforms.time.value = Math.PI * 0.5;
		uniforms.map.value = new THREE.TextureLoader().load('jobs.jpg');

		var _material = new THREE.ShaderMaterial({
			defines: { USE_MAP: '' },
			uniforms: uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: phongShader.fragmentShader,
			lights: true,
            fog: true,
			transparent: true,
			side: THREE.DoubleSide
		});

		var _mesh = new THREE.Mesh( _geometry, _material );
		_scene.add( _mesh );
		_pages[0] = _mesh;



	loadFBX('ape1_lowpoly.FBX', function(){} );

	function loadFBX( e, _callBack ){

		// model
		var loader = new THREE.FBXLoader();
		loader.load( e, function ( object ) {



			//	console.log(object)
			//	console.log(object.children[0])

			//	set camera position and focus point.
			object.children[0].geometry.computeBoundingSphere();
			var _c = object.children[0].geometry.boundingSphere.center;

			object.traverse( function ( child ) {

				if ( child.isMesh ) {

					// child.castShadow = true;
					// child.receiveShadow = true;
					child.material.wireframe = true;
					child.material.wireframeLinewidth = 3;

					child.material = new THREE.MeshBasicMaterial({
						color: new THREE.Color( 0.6, 0.6, 0.6 ),
						wireframe: true,
						wireframeLinewidth: 3
					});
				}

			} );



			var _size = 2.0;

			var geom = object.children[0].geometry.clone();
			geom.scale( _size, _size, _size );
			//geom.rotateX( - Math.PI * 0.5 );
			geom.translate(0,0,10);


			geom = new THREE.Geometry().fromBufferGeometry( geom );
			
			console.log(geom)
			var matel = new THREE.MeshPhongMaterial();
			var mesh = new THREE.Mesh( geom, matel);
  			mesh.updateMatrix();

  			_pages[0].geometry.merge( mesh.geometry, mesh.matrix );


  			//_pages[0].add( object )

			_callBack();

		}, undefined,
		function( _err ){
			console.log( 'Load FBX Error.')
		} );
	}


		//	ather mesh
		// var _geometry = new THREE.IcosahedronGeometry( 20, 0 );
		// _geometry.translate(0,0,50);
		
		// var phongShader = THREE.ShaderLib.phong;
		// var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		// uniforms.time = {};
		// uniforms.time.value = 0.0;
		// _material = new THREE.ShaderMaterial({
		// 	uniforms: uniforms,
		// 	//vertexShader: phongShader.vertexShader,
		// 	vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		// 	fragmentShader: phongShader.fragmentShader,
		// 	lights: true,
  //           fog: true,
		// 	//shading: THREE.FlatShading
		// });
		// _pages[1] = new THREE.Mesh( _geometry, _material );
		// _scene.add( _pages[1] )


		var loader = new THREE.OBJLoader();

		// load a resource
		loader.load(
			// resource URL
			'untitled.obj',
			// called when resource is loaded
			function ( object ) {

				//_scene.add( object );


				var _geometry = object.children[0].geometry;
				//_geometry.translate(0,3,0);
				_geometry.rotateX( Math.PI * 0.5 );

				var len = _geometry.attributes.position.array.length;
				for( var i = 2; i < len; i+=3 )
				{
					if( _geometry.attributes.position.array[i] < 0.0 )
					{
						//console.log( _geometry.attributes.position.array[i] )
						_geometry.attributes.position.array[i] = 0.0;
					}
				}

//_geometry  = _pages[0].geometry;


				for( var i = 0; i < 16; i++ )
				{
					var phongShader = THREE.ShaderLib.phong;
					var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
					uniforms.time = {};
					uniforms.time.value = 0.0;
					uniforms.time.value = Math.PI;

					_material = new THREE.ShaderMaterial({
						uniforms: uniforms,
						//vertexShader: phongShader.vertexShader,
						vertexShader:   document.getElementById( 'vertexshader' ).textContent,
						fragmentShader: phongShader.fragmentShader,
						lights: true,
						fog: true,
						//shading: THREE.FlatShading
						side: THREE.DoubleSide,
						color: 0x669999
					});

					var _mesh = new THREE.Mesh( _geometry, _material );
					_mesh.scale.x = _mesh.scale.y = _mesh.scale.z = 5;
					_scene.add( _mesh );
					_pages.push( _mesh );


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



		// window.addEventListener( 'mousemove', function(e){
		// 	_mouse.x = e.pageX / window.innerWidth * Math.PI;
		// 	_mouse.y = e.pageY / window.innerHeight * Math.PI;
		// })
		// window.addEventListener( 'touchmove', function(e){
		// 	var touch = event.targetTouches[0];
		// 	_mouse.x = touch.pageX / window.innerWidth * Math.PI;
		// 	_mouse.y = touch.pageY / window.innerHeight * Math.PI;
		// 	e.preventDefault();
		// })

		window.addEventListener( 'click', function(e){

			if( e.pageX < window.innerWidth * 0.5 )
			{
				nextPrev();
				_pageCount--
			} else {
				nextPage();
				_pageCount++
			}
		})
	}

	function Update()
	{

		if( _timeFrag )
		{
			_time += _clock.getDelta();
			// _pages[0].material.uniforms.time.value += 1/60;
			//_pages[0].material.uniforms.time.value = _mouse.x;

			//TWEEN.update(_time);
			TWEEN.update();


		}
	}

	function nextPage()
	{
		console.log('next');

		var _current = _pages[ _pageCount ];
		var _next = _pages[ _pageCount + 1 ];

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

		var _duration = 400;

		var tween0 = new TWEEN.Tween(_ctarget)
			.to({ value: _ctarget.to }, _duration)
			//.easing(TWEEN.Easing.Quadratic.Out)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				_current.material.uniforms.time.value = _ctarget.value;
			})
		.start();

		var tween1 = new TWEEN.Tween(_ntarget)
			.to({ value: _ntarget.to }, _duration)
			//.easing(TWEEN.Easing.Quadratic.Out)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				_next.material.uniforms.time.value = _ntarget.value;
			})
		.start();

	}
	function nextPrev()
	{
		console.log('prev');

		var _current = _pages[ _pageCount ];
		var _prev = _pages[ _pageCount - 1 ];


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

		var _duration = 400;

		var tween0 = new TWEEN.Tween(_ctarget)
			.to({ value: _ctarget.to }, _duration)
			//.easing(TWEEN.Easing.Quadratic.Out)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				_current.material.uniforms.time.value = _ctarget.value;
			})
		.start();

		var tween1 = new TWEEN.Tween(_ptarget)
			.to({ value: _ptarget.to }, _duration)
			//.easing(TWEEN.Easing.Quadratic.Out)
			.easing(TWEEN.Easing.Linear.None)
			.onUpdate(function() {
				_prev.material.uniforms.time.value = _ptarget.value;
			})
		.start();

	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
