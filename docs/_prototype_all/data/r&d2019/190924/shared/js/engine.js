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
	var _world, _field, _clock;
	var _time;
	var _cardList;

	var _grid = 100;
	var _margin = 10;

	var _col = 16;
	var _row = 16;

	init();
	setup();
	addEvents();
	update();





	function init()
	{
		_time = 0;
		_cardList = [];

		_world = new world('webglView');
		_clock = new THREE.Clock();

		//	GRID
		_field = createGrid();
		_world.add( _field );
	}

	function setup()
	{
		for( var i = 0; i < _col; i++ )
		{
			_cardList[i] = [];
			for( var j = 0; j < _row; j++ )
			{
				var _geometry = new THREE.PlaneGeometry(_grid - _margin,_grid - _margin,1,1);
				_geometry.rotateX( - Math.PI * 0.5 );
				var _material = new THREE.MeshBasicMaterial({
					transparent: true,
					opacity: 0.4,
					wireframe: true
				});
				var _mesh = new THREE.Mesh( _geometry, _material );
				_world.add( _mesh );

				_mesh.position.x = i * _grid - ( _col * 0.5 ) * _grid;
				_mesh.position.z = j * _grid - ( _row * 0.5 ) * _grid;

				_cardList[i][j] = _mesh;
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



		//	move
		var len0 = _cardList.length;
		for( var i = 0; i < len0; i++ )
		{
			var len1 = _cardList[i].length;
			for( var j = 0; j < len1; j++ )
			{
				var _x = i * _grid - ( _col * 0.5 ) * _grid;
				var _z = j * _grid - ( _row * 0.5 ) * _grid;
				_cardList[i][j].position.x += ( _x - _cardList[i][j].position.x ) * 0.2;
				_cardList[i][j].position.z += ( _z - _cardList[i][j].position.z ) * 0.2;
			}
		}

		countUp();

	}


	function createGrid()
	{
		var _grid = new THREE.GridHelper( 6400, 64);
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

		// window.addEventListener('click',function() {
		// 	_count ++;

		// 	var _startTheta = _world.controls.getAzimuthalAngle();
		// 	var _endTheta = Math.PI * 0.5;
		// 	console.log('click', _startTheta);


		// }, false);


		window.addEventListener('click',function() {
			countUp();
			e.preventDefault();
		}, false);


		// window.addEventListener( 'mousewheel', function(e)
		// {
		// 	countUp();
		// 	e.preventDefault();
		// }, false );



		function easeInOutExpo(t,b,c,d)
		{
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
			return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
		}


	}

		function countUp()
		{
			var len = _cardList.length;

			if( Math.random() < 0.4 )
			{
				//	Yoko
				var len0 = _cardList[0].length;
				var _no = Math.floor( Math.random() * len0 );

				if( Math.random() < .5 )
				{
					var _mesh = _cardList[0].splice( _no, 1 );

					for( var i = 0; i < len-1; i++ )
					{
						var _mesh0 = _cardList[i+1].splice( _no, 1 );
						_cardList[i].splice( _no, 0, _mesh0[0] );
					}
					_mesh[0].position.x = 6400;
					_cardList[len-1].splice( _no, 0, _mesh[0] );
				} else {
					for( var i = 0; i < len - 1; i++ )
					{
						var _mesh0 = _cardList[i].splice( _no, 1 );
						_cardList[i+1].splice( _no+1, 0, _mesh0[0] );
					}
					var _mesh = _cardList[len-1].splice( _no+1, 1 );
					_mesh[0].position.x = -6400;
					_cardList[0].splice( _no, 0, _mesh[0] );
				}

			} else {
				//	Tate
				var _no = Math.floor( Math.random() * len );
				if( Math.random() < .5 )
				{
					var _mesh = _cardList[_no].shift();
					_mesh.position.z = 6400;
					_cardList[_no].push( _mesh );
				} else {
					var _mesh = _cardList[_no].pop();
					_mesh.position.z = -6400;
					_cardList[_no].unshift( _mesh );
				}
			}
		}
	
}
