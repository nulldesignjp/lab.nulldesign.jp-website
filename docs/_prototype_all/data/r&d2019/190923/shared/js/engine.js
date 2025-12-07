/*
	engine.js
*/

window.onload = function(){

	var style="color:white;background-color:#484848;padding: 3px 6px;";
	window.console.log("%cSkyNet - v1.0.0" , style);
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
	var _world, _ground, _grid, _clock;
	var _time;
	var _rotateKey;
	var _mesh;
	var _count;

	var _tx,_tz,_distance;

	init();
	addEvents();
	update();





	function init()
	{
		_time = 0;
		_count = 0;

		_world = new world('webglView');
		_clock = new THREE.Clock();

		_world.camera.position.set(0,80,1000);

		_distance = _world.camera.position.length();
		var _rad = _count / 3 * Math.PI * 2.0;
		_tx = Math.cos( _rad ) * _distance;
		_tz = Math.sin( _rad ) * _distance;





		//	GRID
		_grid = createGrid();
		_world.add( _grid );

		//
		var _geometry = new THREE.IcosahedronGeometry( 100, 0 );
		var _material = new THREE.MeshBasicMaterial({
			wireframe: true,
			color: 0x666666
		});
		_mesh = new THREE.Mesh( _geometry, _material );

		_mesh.position.y = 100;
		_world.add( _mesh );

		var _geometry = new THREE.DelaunayGeometry(4800,4800,3200,[]);
		_geometry.rotateX( - Math.PI * 0.5 );
		var _scale0 = 0.00125;
		var _scale1 = 40;
		var _n = new SimplexNoise();
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			if( _geometry.vertices[i] )
			//	_geometry.vertices[i].z = ( Math.random() - .5 ) * 0.02;
			_geometry.vertices[i].y = _n.noise( _geometry.vertices[i].x * _scale0, _geometry.vertices[i].z * _scale0 ) * _scale1
		}
		_geometry.verticvesNeedUpdate = true;
		_geometry.normalsNeedUpdate = true;
		_geometry.computeVertexNormals(true);
		_geometry.computeFaceNormals();
		_geometry.computeBoundingBox();
		_geometry.computeBoundingSphere();




		var _material = new THREE.MeshPhongMaterial({
			//transparent: true,
			//opacity: 0.4,
			//wireframe: true
			flatShading: true,
			//specular: 0xFFFFFF,
			//shininess: 100
		});
		_ground = new THREE.Mesh( _geometry, _material );
		_world.add( _ground );


		//	object
		for( var i = 0; i < 3; i++ )
		{
			//	red object
			var _geometry = new THREE.IcosahedronGeometry( 10, 0 );
			var _material = new THREE.MeshPhongMaterial({
				flatShading: true,
				color: 0xCC0000
			});
			var _mesh0 = new THREE.Mesh( _geometry, _material );

			_mesh0.position.x = Math.cos( i / 3 * Math.PI * 2.0 ) * 160.0;
			_mesh0.position.z = Math.sin( i / 3 * Math.PI * 2.0 ) * 160.0;

			_mesh0.position.y = 100;
			_world.add( _mesh0 );


			//	info panel
			var _geometry = new THREE.PlaneGeometry( 320, 180, 1, 1 );
			var _material = new THREE.MeshPhongMaterial({
				flatShading: true,
				transparent: true,
				map: new THREE.TextureLoader().load('shared/img/txt.png'),
				//side: THREE.DoubleSide
			});
			var _mesh0 = new THREE.Mesh( _geometry, _material );

			_mesh0.rotation.y = - i / 3 * Math.PI * 2.0 + Math.PI * 0.5;

			_mesh0.position.x = Math.cos( i / 3 * Math.PI * 2.0 ) * 200.0;
			_mesh0.position.z = Math.sin( i / 3 * Math.PI * 2.0 ) * 200.0;

			_mesh0.position.y = 100;
			_world.add( _mesh0 );

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

		_mesh.rotation.x += _delta;
		_mesh.rotation.y += _delta;


			var _px = _world.camera.position.x;
			var _pz = _world.camera.position.z;


		//_world.camera.position.y = 100.0;

		_world.camera.position.x += ( _tx - _world.camera.position.x ) * 0.1;
		_world.camera.position.z += ( _tz - _world.camera.position.z ) * 0.1;



			_px = _world.camera.position.x - _px;
			_pz = _world.camera.position.z - _pz;
			var _d = Math.sqrt( _px * _px + _pz * _pz );

			_d = _d < 0.001?0.0 : _d;
			_world.composer.passes[1].uniforms.dist.value = _d;




	}


	function createGrid()
	{
		var _grid = new THREE.GridHelper(6400, 64);
		_grid.material.transparent = true;
		_grid.material.opacity = 0.2;
		return _grid;
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

		window.addEventListener('click',function(e) {


			if( e.pageX < window.innerWidth * 0.5 )
			{
				_count ++;
			} else {
				_count--;
			}

			// var _startTheta = _world.controls.getAzimuthalAngle();
			// var _endTheta = Math.PI * 0.5;
			// console.log('click', _startTheta);

			//_rotate(0,60,_startTheta,_endTheta);


			var _rad = _count / 3 * Math.PI * 2.0;
			_tx = Math.cos( _rad ) * _distance;
			_tz = Math.sin( _rad ) * _distance;


		}, false);

		function easeInOutExpo(t,b,c,d)
		{
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
			return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
		}


	}
	
}
