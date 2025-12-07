/*
	engine.js
*/
window.onload = (function(){

	var _world = new world('webglView');
	var _sky = new Sky( _world.directional.position );
	_world.add( _sky.mesh );

	//	水平面基準平面
	var _grid = new THREE.GridHelper( 1000, 20 );
	_grid.material.color = new THREE.Color(255,255,255);
	_grid.material.transparent = true;
	_grid.material.opacity = 0.15;
	_world.add( _grid );

	//	ループ処理	
	var _count = 0;
	(function _loop(){

		window.requestAnimationFrame(_loop);

	})();


})();

function easeInOutSine(t,b,c,d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}
