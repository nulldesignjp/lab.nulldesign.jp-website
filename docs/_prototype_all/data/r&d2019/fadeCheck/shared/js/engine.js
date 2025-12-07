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
	var _world, _field, _clock, _mesh;
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

	}

	function setup()
	{
		var _geometry = new THREE.PlaneGeometry( 1920, 1080, 1, 1 );
		var _material = new THREE.MeshBasicMaterial({
			map: new THREE.TextureLoader().load('IMG_0344.png')
		});
		_mesh = new THREE.Mesh( _geometry, _material );
		_mesh.scale.set( 0.5,0.5,0.5 );
		_world.add( _mesh );
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
