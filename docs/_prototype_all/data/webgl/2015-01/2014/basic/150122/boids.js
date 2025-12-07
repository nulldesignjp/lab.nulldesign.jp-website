var boids = (function( _list, _rect ){

	/*
		_list: Array three.mesh
		_rect:Object	{x:0,y:0,z:0,w:100,h:100,d:100}
	*/

	var _birdList = [];

	var _boids = function( _list, _rect )
	{
		var len = _list.length;
		for( var i = 0; i < len; i++ )
		{
			_birdList[i] = {};
			_birdList[i].mesh = _list[i];
			_birdList[i].vector = {};
			_birdList[i].vector.x = 0;
			_birdList[i].vector.y = 0;
			_birdList[i].vector.z = 0;
		}
	}
	_boids.rect = _rect;
	_boids.prototype = {
		update	:	function(){}
	}
	return _boids;

})();