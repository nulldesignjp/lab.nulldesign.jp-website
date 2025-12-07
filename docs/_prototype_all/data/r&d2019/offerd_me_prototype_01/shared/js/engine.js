/*
	engine.js
*/

window.onload = function(){

	var style="color:white;background-color:#484848;padding: 3px 6px;";
	window.console.log("%ccreated by nulldesign.jp" , style);

	if( location.href.indexOf('https://') != -1 )
	{
		window.console.log = function(){/* NOP */};
		window.console.debug = function(){/* NOP */};
		window.console.info = function(){/* NOP */};
		window.console.warn = function(){/* NOP */};
		window.console.error = function(){/* NOP */};
		window.console.timeEnd = function(){/* NOP */};
		window.console.time = function(){/* NOP */};
	}

	//	Props
	var _world, _field, _clock, _mesh, _particle, _pointer;
	var _time;

	init();
	setup();
	addEvents();
	update();





	function init()
	{
		_time = 0;

		_world = new world('webglView');
		_clock = new THREE.Clock();


		_mesh = new THREE.Object3D();
		_world.add( _mesh );


		//	snow
			var _geometry = new THREE.Geometry();
			for( var i = 0; i < 1000; i++ )
			{
				var _rad = Math.random() * Math.PI * 2.0;
				var _r = ( 1.0 - Math.random() * Math.random() ) * 100.0 - 10.0;
				var _x = Math.cos( _rad ) * _r;
				var _y = Math.random() * 30;
				var _z = Math.sin( _rad ) * _r;

				_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
			}

			var _material = new THREE.PointsMaterial({
				map: new THREE.TextureLoader().load('shared/img/circle1.png'),
				transparent: true,
				//depthTest: false,
				alphaTest: false,
				size: 0.2
			});

			_particle = new THREE.Points( _geometry, _material );
			_world.add( _particle );


			//	dust
			var _geometry = new THREE.Geometry();
			for( var i = 0; i < 256; i++ )
			{
				var _rad = Math.random() * Math.PI * 2.0;
				var _r = ( 1.0 - Math.random() * Math.random() ) * 32.0;
				var _x = Math.cos( _rad ) * _r;
				var _y = Math.random() * 32 - 16;
				var _z = Math.sin( _rad ) * _r;

				_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
			}

			var _material = new THREE.PointsMaterial({
				map: new THREE.TextureLoader().load('shared/img/circle1.png'),
				transparent: true,
				opacity: 0.32,
				depthtest: false,
				alphatest: true,
				size: 2.0,
				//	color: 0x0066CC
				color: 0xFFFFFF,
				//blending: THREE.AdditiveBlending
			});

			var _particle2 = new THREE.Points( _geometry, _material );
			_world.add( _particle2 );


			var _color = 0x3366CC;
			var _geometry = new THREE.IcosahedronGeometry( 0.1, 0 );
			var _material = new THREE.MeshPhongMaterial({
				color: _color,
				flatShading: true
			});
			_pointer = new THREE.Mesh( _geometry, _material );
			_world.add( _pointer );

			_pointer.position.y = -3;

			_pointer.add( new THREE.PointLight( _color, 4.0, 8.0, 1.0 ) );






	}

	function setup()
	{
		loadFBX('field.fbx', _loadedField );
		loadFBX('human.fbx', _loadedHuman );
		loadFBX('tree.fbx', _loadedTree )
	}

	function loadFBX( e, _callBack )
	{
		// model
		var loader = new THREE.FBXLoader();
		loader.load( e, function ( object ) {
			_callBack( object );
		}, undefined,
		function( _err ){
			console.log( 'Load FBX Error.', _err )
		} );
	}

	function _loadedHuman( object )
	{
		//	set camera position and focus point.
		object.children[0].geometry.computeBoundingSphere();
		var _c = object.children[0].geometry.boundingSphere.center;



		object.traverse( function ( child ) {

			if ( child.isMesh ) {

				// child.castShadow = true;
				// child.receiveShadow = true;
				// child.material.wireframe = true;
				// child.material.wireframeLinewidth = 3;

				// child.material = new THREE.MeshBasicMaterial({
				// 	color: new THREE.Color( 0.6, 0.6, 0.6 ),
				// 	wireframe: true,
				// 	wireframeLinewidth: 3
				// });




				//	_field clone
				var _geometry = child.geometry.clone();
				_geometry.rotateX( - Math.PI * 0.5 );

				var _material = new THREE.MeshLambertMaterial({
					color: child.material.color
				});

				var __mesh = new THREE.Mesh( _geometry, _material );
				_mesh.add( __mesh );

				__mesh.position.x = child.position.x / child.scale.x;
				__mesh.position.y = child.position.y / child.scale.y;
				__mesh.position.z = child.position.z / child.scale.z;

				console.log( __mesh )
				
			}

		} );

		setFieldPosition();

	}

	function _loadedField( object )
	{
		//	set camera position and focus point.
		object.children[0].geometry.computeBoundingSphere();
		var _c = object.children[0].geometry.boundingSphere.center;

		object.traverse( function ( child ) {

			if ( child.isMesh ) {

				// child.castShadow = true;
				// child.receiveShadow = true;
				// child.material.wireframe = true;
				// child.material.wireframeLinewidth = 3;

				// child.material = new THREE.MeshBasicMaterial({
				// 	color: new THREE.Color( 0.6, 0.6, 0.6 ),
				// 	wireframe: true,
				// 	wireframeLinewidth: 3
				// });




				//	_field clone
				var _geometry = child.geometry.clone();
				_geometry.rotateX( - Math.PI * 0.5 );
				_geometry.scale( 5.0, 25.0, 5.0 );

				var _material = new THREE.MeshLambertMaterial({
					color: child.material.color
				});
				// for( var i in _material )
				// {
				// 	if( child.material[i] != undefined && child.material[i] != Function )
				// 	{
				// 		_material[i] = child.material.color;
				// 		console.log(i)
				// 	}
				// }


				_field = new THREE.Mesh( _geometry, _material );
				_world.add( _field );
			}

		} );

		setFieldPosition();
	}

	function _loadedTree( object )
	{
		//_world.add( object.children[0].clone() );

		object.children[0].scale.set(1,1,1);

		// var _treeMaster = object.children[0];
		for( var i = 0; i < 64; i++ )
		{
			var _s = Math.random() * 6.0 + 4.0;
			var _r = Math.random() * 0.6 + 0.025;
			var _mesh0 = object.children[0].clone();
			_mesh0.material.color = new THREE.Color(0.8,0.8,0.8);
			_mesh0.scale.set(_s,_s,_s);

			_mesh0.position.x = ( Math.random() - 0.5 ) * 64;
			_mesh0.position.z = ( Math.random() - 0.5 ) * 64;
			_mesh0.rotation.y = Math.random() * 3.1416;

			var ray = new THREE.Raycaster(
				new THREE.Vector3( _mesh0.position.x, 100, _mesh0.position.z ),
				new THREE.Vector3( 0, -1, 0 )
			);

		    var objs = ray.intersectObject( _field );

			if( objs.length )
			{
				var obj = objs[0];
				_mesh0.position.y = obj.point.y;
				_world.add( _mesh0 );
				//	console.log( _world.focus )
			}





		}

	}

	function update()
	{
		_update(0);
	}

	function _update( _stepTime ){

		window.requestAnimationFrame( _update );

		//	時間の更新
		var _delta = _clock.getDelta();
		_time += _delta;

		//	update particles
		var len = _particle.geometry.vertices.length;
		while( len )
		{
			len--;
			_particle.geometry.vertices[len].y-= 0.02;
			if( _particle.geometry.vertices[len].y < _mesh.position.y )
			{
				_particle.geometry.vertices[len].y += 100.0;
			}
		}

		_particle.geometry.verticesNeedUpdate = true;


		var __time = Math.sin(_time*0.6)*0.05;
		_world.camera.up.set(Math.sin(__time), Math.cos(__time), 0);
		_world.camera.updateProjectionMatrix ();

	}

	function setFieldPosition()
	{
		//	update position
		//	始点、向きベクトルを渡してレイを作成
		var ray = new THREE.Raycaster(
			new THREE.Vector3( 0, 100, 0 ),
			new THREE.Vector3( 0, -1, 0 )
		);

		// 交差判定
	    // 引数は取得対象となるMeshの配列を渡す。
	    //	以下はシーン内のすべてのオブジェクトを対象に。
	    //	ヒエラルキーを持った子要素も対象とする場合は第二引数にtrueを指定する
	    // var objs = ray.intersectObjects( _world.scene.children );
		// if (objs.length > 0) {
		// 	// 交差していたらobjsが1以上になるので、やりたいことをやる。
		// 	//objs[0].object.position.x = 10;

		// 	for( var i = 0; i < objs.length; i++ )
		// 	{
		// 		//console.log( objs[i].object.name, ray )
				
		// 			objs[i].distance
		// 			objs[i].point
				
		// 		if( objs[i].object.name == 'filed' )
		// 		{
		// 			_mesh.position.y = objs[i].point.y + 1.0;
		// 			_world.focus.y = _mesh.position.y;
		// 			_world.camera.y = _world.focus.y + 1.0;

		// 			//	console.log( _world.focus )
		// 		}
		// 	}

		// }


	    var objs = ray.intersectObject( _field );

		if( objs.length )
		{
			var obj = objs[0];
			_mesh.position.y = obj.point.y;
			_world.focus.y = _mesh.position.y + 1.0;
			_world.camera.position.y = _world.focus.y;

			//	console.log( _world.focus )

		}

		_world.camera.updateProjectionMatrix ();
	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(){});
		// window.addEventListener( 'click', function(){

		// 	clearTimeout( _changeCameraViewKey );
		// 	window.cancelAnimationFrame( _restartChangeCamerakey );
		// 	_changeCameraViewKey = setTimeout( changeCameraView, 20 * 1000 );
		// });
		// window.addEventListener( 'touchend', function(){
		// 	clearTimeout( _changeCameraViewKey );
		// 	window.cancelAnimationFrame( _restartChangeCamerakey );
		// 	_changeCameraViewKey = setTimeout( changeCameraView, 20 * 1000 );
		// });
		//window.addEventListener('dblclick',function() {}, false);

		// window.addEventListener('click',function() {
		// 	_count ++;

		// 	var _startTheta = _world.controls.getAzimuthalAngle();
		// 	var _endTheta = Math.PI * 0.5;
		// 	console.log('click', _startTheta);


		// }, false);


		window.addEventListener('click',function(e) {
			e.preventDefault();
		}, false);


		// window.addEventListener( 'mousewheel', function(e)
		// {
		// 	countUp();
		// 	e.preventDefault();
		// }, false );

	}

	
}
