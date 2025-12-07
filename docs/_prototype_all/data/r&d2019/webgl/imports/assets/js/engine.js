/*
	engine.js
*/


window.onload = (function(){
	var _world, _camera, _scene, _clock;
	var _timeFrag = false;
	var _time = 0;

	Start();
	//	Update();


	console.log( 'Sample - Normal PhongMaterial: ',new THREE.MeshPhongMaterial() );


	function Start()
	{
		_clock	=	new THREE.Clock();
		_world	=	new world('webglView');
		_camera	=	_world.camera;
		_scene	=	_world.scene;
		_camera.position.z = 500;

		var _grid = new THREE.GridHelper( 300, 3 );
		_scene.add( _grid );

		var _geometry = new THREE.IcosahedronGeometry( 20, 0 );
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
		_scene.add( _mesh );

		_mesh.position.y = 100;



		loadFBX('untitled.fbx' );

		function loadFBX( e ){

			// model
			var loader = new THREE.FBXLoader();
			loader.load( e, function ( object ) {

				console.log('object: ', object );



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

				//object.position.y = 50.0
	  			_scene.add( object );



			}, undefined,
			function( _err ){
				console.log( 'Load FBX Error.')
			} );
		}
	}

	function Update()
	{

		if( _timeFrag )
		{
			_time += _clock.getDelta();
			//	TWEEN.update();
		}
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
