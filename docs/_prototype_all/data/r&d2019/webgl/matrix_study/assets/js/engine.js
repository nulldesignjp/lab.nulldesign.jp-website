/*
	engine.js
*/


window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _mesh;

	var _mouse = {x:0,y:0}
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

		var _grid = new THREE.GridHelper( 500, 5 );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.4;
		_scene.add( _grid );




		var _geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );

		var phongShader = THREE.ShaderLib.phong;
		var uniforms = THREE.UniformsUtils.clone(phongShader.uniforms);
		uniforms.time = {};
		uniforms.time.value = Math.PI * 0.5;

		// uniforms.diffuse = {}
		// uniforms.diffuse.value = new THREE.Color( Math.random(), Math.random(), Math.random() )

		var _material = new THREE.ShaderMaterial({
			//defines: { USE_MAP: '' },
			uniforms: uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: phongShader.fragmentShader,
			lights: true,
            fog: true,
			transparent: true,
			// side: THREE.DoubleSide,
			// shading: THREE.FlatShading
			wireframe: true
		});

		_mesh = new THREE.Mesh( _geometry, _material );
		_scene.add( _mesh );

		uniforms.gPosition = {};
		uniforms.gPosition.value = _mesh.position;



		var _geometry = new THREE.BoxBufferGeometry( 60, 60, 60 );
		var __material =new THREE.MeshPhongMaterial({
			//transparent: true,
			//opacity: 0.25
		});

		var _body = new THREE.Mesh( _geometry, __material );
		_mesh.add( _body );





		//loadFBX('suzanne.fbx' );
		loadFBX('untitled.fbx' );

		function loadFBX( e ){

			// model
			var loader = new THREE.FBXLoader();
			loader.load( e, function ( object ) {



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
							//wireframeLinewidth: 3
							transparent: true,
							opacity: 0.4
						});
					}

				} );



				var _size = 2.0;

				var geom = object.children[0].geometry.clone();
				geom.scale( _size, _size, _size );
				//geom.rotateX( - Math.PI * 0.5 );
				//geom.translate(0,0,10);

				geom = new THREE.Geometry().fromBufferGeometry( geom );



				_material.vertexColors = THREE.VertexColors;
				
				console.log(geom)
				var matel = new THREE.MeshPhongMaterial();
				var mesh = new THREE.Mesh( geom, _material);
	  			mesh.updateMatrix();

	  			mesh.rotation.x = - Math.PI * 0.5
	  			mesh.scale.x = mesh.scale.y = mesh.scale.z = 30.0

	  			//_pages[0].geometry.merge( mesh.geometry, mesh.matrix );


	  			//_scene.add( object )
	  			_scene.add( mesh )

	  			mesh.position.z = -100
	  			mesh.rotation.y = - Math.PI * 0.25
	  			mesh.rotation.x -= Math.PI * 0.25


	  			var _o = new THREE.Object3D();
	  			_scene.add( _o );

	  			_o.add( mesh )
	  			_o.add( _mesh )

	  			_o.rotation.z = - Math.PI * 0.5

	  			setInterval(function(){
	  				mesh.rotation.x -= Math.PI * 0.25 * 0.01

	  			},1000/60)




			}, undefined,
			function( _err ){
				console.log( 'Load FBX Error.')
			} );
		}

	}

	function Update()
	{
		_time += _clock.getDelta();
		//_mesh.rotation.y += 0.1;
		//_mesh.position.x = Math.sin( _time ) * 100;
		_mesh.position.x = Math.sin( _time ) * 100;
		_mesh.position.x = 100;

		_mesh.material.uniforms.time.value = _time;
	}

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();

})();
