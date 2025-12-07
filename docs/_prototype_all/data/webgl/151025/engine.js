/*
	engine.js
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = Date.now()%1000;
	var _mesh;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x181818, 1600, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 100;
	camera.position.z = 1000;

	var focus = new THREE.Vector3(0,0,0);
	focus.y = 50
	camera.lookAt( focus );

	var amb = new THREE.AmbientLight( 0x181818 );
	scene.add( amb );

	var _dl = new THREE.DirectionalLight( 0x333333, 1.0 );
	_dl.position.set( 100, 100, -100 );
	scene.add( _dl );

	var _pl = new THREE.PointLight( 0xFFFFFF, 2.0, 400 );
	scene.add( _pl );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x181818, 1 );
	renderer.setSize(_width, _height);

	document.getElementById('container').appendChild(renderer.domElement);

	//	GRID
	var _grid = new THREE.GridHelper( 500, 50 );
	scene.add( _grid );



	loadJson();

	function loadJson()
	{
		var _s = new THREEURLLoader();
		_s.load( './untitled.json', function(e){

			_mesh = e;

			//e.material.blending = THREE.AdditiveBlending;

			/*
				THREE.NoBlending
THREE.NormalBlending
THREE.AdditiveBlending
THREE.SubtractiveBlending
THREE.MultiplyBlending
THREE.CustomBlending
			*/

			//	faces
			console.log( e.geometry.faces.length );

			var n = 5;
			for( var i = 0; i < n; i ++ )
			{
				var _mesh = showcase( e );
				_mesh.position.set( (i-(Math.floor(n/2)))*100,0,0);
				scene.add( _mesh );
				_mesh.scale.set( 0.01,0.01,0.01 );
				_mesh.rotation.y = Math.PI * 5
				TweenMax.to( _mesh.scale, 0.5, {x:1.0,y:1.0,z:1.0,delay: i * 0.2 + 2.0} );
				TweenMax.to( _mesh.rotation, 0.5, {y:0.0,delay: i * 0.2 + 2.0} );



			}


		});
	}


	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		//_width = _width<1024?1024:_width;

		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	//	render
	(function render(){

		time ++;
		var _time = time * 0.3;
		var _r = 200;
		camera.position.x = Math.sin( _time * 0.01 ) * _r;
		camera.position.y = Math.sin( _time * 0.01 ) * 50 + 100;
		camera.position.z = Math.cos( _time * 0.01 ) * _r;

		var _r = 100 + Math.sin( _time * 0.0125 ) * 50;
		_pl.position.x = Math.sin( _time * 0.015 ) * _r;
		_pl.position.y = Math.sin( _time * 0.015 ) * 20 + 90;
		_pl.position.z = Math.cos( _time * 0.015 ) * _r;

		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();


	function showcase( e )
	{
		var _mesh = new THREE.Mesh( e.geometry, e.material );

		var geometry = new THREE.BoxGeometry( 50, 2, 50, 3, 1, 3 );
		var material = new THREE.MeshPhongMaterial({
			color:0xCCCCCC,
			shading:THREE.FlatShading,
			metal: true,
			ambient:0xFFFFFF,
			specular:0xFFFFFF,
			shininess:200
		});
		var _base = new THREE.Mesh( geometry, material );
		scene.add( _base );

		_base.add( _mesh );

		var _geometry = new THREE.BoxGeometry(50,100,50,1,1,1);
		var _material = new THREE.MeshLambertMaterial();
		var _box = new THREE.Mesh( _geometry, _material );
		for( var i = 0; i < _box.geometry.vertices.length; i++ )
		{
			_box.geometry.vertices[i].y += 50;
		}
		//	scene.add( _box );

		var _eh = new THREE.EdgesHelper( _box, 0x666666 );
		_base.add( _eh );


		var _scale = 5.0;
		_mesh.scale.set(_scale,_scale,_scale);

		//	前傾姿勢を調整
		_mesh.rotation.x = 0.2;
		_mesh.position.y = 5;
		_mesh.position.z = -15;


		return _base;


	}

})();

