/*
	engine.js
*/

(function(){
	var _col = 5;
	var _numDots = 300;
	var _size = 160;
	var _margin = 40;
	var _frameWeight = 1;
	var _data = [];
	var _world;
	var updateMethod;

	//	random21
	var _min = 0;
	var _max = 1.0;
	var lastValue = 0.5;
	var interpolation = 0.86;

	var _lastUpdate = new Date().getTime();

	var _resizeKey = null;

	//
	_data.push({	name: "Math.random()",	method: random00,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "2 times average",	method: random01,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "5 times average",	method: random02,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "2 times product",	method: random03,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "2 times same product",	method: random04,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Invert 2 times product",	method: random05,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Sqrt",	method: random10,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "5 times Sqrt",	method: random11,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Cbrt",	method: random12,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "easeInOutExpo",	method: random13,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Random14",	method: random14,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Random15",	method: random15,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Mersenne Twister",	method: random16,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Perlin Noise",	method: random20,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	_data.push({	name: "Interpolation",	method: random21,	object: null,	frame: null,	points: null,	dom: null, isHover: false	});
	

	$('#siteBody').addClass('open');

	init();
	initLayout();
	update();

	window.addEventListener( 'click', function(e){
		if( updateMethod == update01 )
		{
			initLayout();
			updateMethod = update0;
		} else {
			updateMethod = update01;
		}
	} );

	window.addEventListener( 'resize', function(e){

		if( _resizeKey　){
			clearTimeout( _resizeKey );
		}

		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _div = _data[i].dom;
			_div.css({
				'opacity': '0'
			});
			_div.removeClass('fadeIn');
		}
		_resizeKey = setTimeout( _resize, 500 );

	} );

	function _resize(){
		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _div = _data[i].dom;
			var _object = _data[i].object;
			var _vec2 = _world.getWorldToScreen2D( _object );
			_div.css({
				'opacity': '1',
				'left': _vec2.x - _size * 0.5 + 'px',
				'top': _vec2.y - _size * 0.5 + 'px'
			});
			_div.addClass('fadeIn');
		}

		_resizeKey　 = null;
	}

	function init(){

		updateMethod = update01;

		_world = new world('webglView');
		_world.controls.enabled = false;
		_world.render();

		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _object = new THREE.Object3D();
			var _frame = frame( _size, _frameWeight );
			var _geometry = new THREE.Geometry();
			var _material = new THREE.PointsMaterial({color: 0xFFFFFF, size: 2.0, sizeAttenuation: false});
			for( var j = 0; j < _numDots; j++ ){
				_geometry.vertices[j] = new THREE.Vector3();
			}

			var _points = new THREE.Points( _geometry, _material );
			_world.add( _object );
			_object.add( _frame );
			_object.add( _points );

			_data[i].object = _object;
			_data[i].frame = _frame;
			_data[i].points = _points;

			_object.position.set(
				( i % _col - ( _col - 1 ) * 0.5 ) * ( _size + _margin ),
				( Math.floor( i / _col ) - Math.floor( len / _col ) * 0.5 ) * ( _size + _margin ),
				0
				);

			_object.position.y *= - 1.0;

			var _vec2 = _world.getWorldToScreen2D( _object );
			var _div = $('<div>');
			_div.addClass('cell');
			_div.css({
				'left': _vec2.x - _size * 0.5 + 'px',
				'top': _vec2.y - _size * 0.5 + 'px',
				'width': _size + 'px',
				'height': _size + 'px'
			});
			var _a = $('<a>');
			_a.attr('href','javascript:void();');
			_a.text( _data[i].name );
			_div.append( _a );
			$('#webglView').append( _div );
			_data[i].dom = _div;
		}
	}

	function initLayout(){

		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _points = _data[i].points;
			var _geometry = _points.geometry;
			for( var j = 0; j < _numDots; j++ ){
				_geometry.vertices[j].x = ( j / _numDots - 0.5 ) * ( _size - _frameWeight * 2.0 );
				_geometry.vertices[j].y = ( _data[i].method() - 0.5 ) * ( _size - _frameWeight * 2.0 );
				_geometry.vertices[j].z = 0;
			}
		}
	}

	function update(){

		if( !_resizeKey )
		{
			updateMethod();
		}
		window.requestAnimationFrame( update );

		var _currentTime = new Date().getTime();
		var _duration = _currentTime - _lastUpdate;
		_lastUpdate = _currentTime;
		_duration = Math.floor( 1000 / _duration)
		$('p#FPS').text( 'FPS: ' + _duration );
	}

	function update0(){
		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _points = _data[i].points;
			var _geometry = _points.geometry;
			for( var j = 0; j < _numDots-1; j++ ){
				_geometry.vertices[j].y = _geometry.vertices[j+1].y;
			}
			_geometry.vertices[_numDots-1].x = ( _size - _frameWeight * 2.0 ) * 0.5;
			_geometry.vertices[_numDots-1].y = ( _data[i].method() - 0.5 ) * ( _size - _frameWeight * 2.0 );
			_geometry.vertices[_numDots-1].z = 0;
			_geometry.verticesNeedUpdate = true;
		}	
	}

	function update01(){
		var _div = _numDots;
		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _sList = [];
			for( var j = 0; j < _div; j++ ){
				_sList[j] = [];
			}

			var _min = Number.POSITIVE_INFINITY;
			var _max = Number.NEGATIVE_INFINITY;
			for( var j = 0; j < _numDots * 10; j++ ){
				var _value = _data[i].method();
				var _index = Math.floor( _value * ( _div - 1 ) );

				_sList[_index].push( _value );
				var _len = _sList[_index].length;
				_min = _min<_len?_min:_len;
				_max = _max>_len?_max:_len;
			}

			var _amp = ( 1.0 - _max / _numDots ) * 5.0;

			var _points = _data[i].points;
			var _geometry = _points.geometry;
			var _count = 0;
			for( var j = 0; j < _div; j++ ){
				var len0 = _sList[j].length;
				var _y = len0 / _numDots * _amp;
				_y = _y < 0?0:_y>1?1:_y;
				for( var k = 0; k < len0; k++ ){
					var _value = _sList[j][k];
					var _viewIndex = Math.floor( _count / 10 );
					_geometry.vertices[_viewIndex].x = ( _value - 0.5 ) * ( _size - _frameWeight * 2.0 );
					_geometry.vertices[_viewIndex].y = ( _y - 0.5 ) * ( _size - _frameWeight * 2.0 );
					_geometry.vertices[_viewIndex].z = 0;
					_count ++;
				}
			}

			_geometry.verticesNeedUpdate = true;
		}	

	}

	function frame( size, weight ){
		weight = weight? weight:1;
		var _p = size * 0.5;
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( - _p, _p, 0 );
		_geometry.vertices[1] = new THREE.Vector3( _p, _p, 0 );
		_geometry.vertices[2] = new THREE.Vector3( _p, _p, 0 );
		_geometry.vertices[3] = new THREE.Vector3( _p, - _p, 0 );
		_geometry.vertices[4] = new THREE.Vector3( _p, - _p, 0 );
		_geometry.vertices[5] = new THREE.Vector3( - _p, - _p, 0 );
		_geometry.vertices[6] = new THREE.Vector3( - _p, - _p, 0 );
		_geometry.vertices[7] = new THREE.Vector3( - _p, _p, 0 );
		var _material = new THREE.LineBasicMaterial({color: 0xFFFFFF, linewidth: weight});
		var _line = new THREE.LineSegments( _geometry, _material );
		return _line;
	}

	function sphere( l, radius ){
		var _geometry = new THREE.Geometry();
		var vector = new THREE.Vector3();
		var zero = new THREE.Vector3();
		for ( var i = 0; i < l; i ++ ) {

			var phi = Math.acos( -1 + ( 2 * i ) / l );
			var theta = Math.sqrt( l * Math.PI ) * phi;
			var _vertex = new THREE.Vector3();
			_vertex.x = radius * Math.cos( theta ) * Math.sin( phi );
			_vertex.y = radius * Math.sin( theta ) * Math.sin( phi );
			_vertex.z = radius * Math.cos( phi );
			_geometry.vertices[i] = _vertex;
		}
		return _geometry;
	}

	function random(){
		return Math.random();
	}
	function randomRange( _min, _max ){
		return random() * ( _max - _min ) + _min;
	}

	function random00(){
		return random();
	}
	function random01(){
		return ( random() + random() ) / 2.0;
	}
	function random02(){
		return ( random00() + random00() + random00() + random00() + random00() ) / 5.0;
	}
	function random03(){
		return random() * random();
	}
	function random04(){
		var val = random();
		return val * val;
	}
	function random05(){
		return 1.0 - random() * random();
	}
	function random10(){
		return Math.sqrt( random00() );
	}
	function random11(){
		return Math.sqrt( random00() * random00() * random00() * random00() * random00() );
	}
	function random12(){
		return Math.cbrt( random00() );
	}
	function random13(){
		var val = random00();
		val = easeInOutExpo( val, 0, 1, 1 );
		val = val<0?0:val>=1?1:val;
		return val;
	}
	function random14(){
		var val0 = Math.random();
		var val1 = Math.random();
		var val = Math.sqrt(-2.0 * Math.log(val0)) * Math.sin(2.0 * Math.PI * val1);
		val = (val + 3) / 6;
		val = val<0?0:val>=1?1:val;
		return val;
	}
	function random15(){
		var _rad = randomRange( - Math.PI, Math.PI );
		var val = Math.sin( _rad ) * 0.5 + 0.5;
		return val;
	}

	//	MersenneTwister
	function random16(){
		var _mersenneTwister = new MersenneTwister();
		return _mersenneTwister.random();
	}

	//	perlin noise require perlin.js
	function random20(){
		noise.seed( 0 );	//	_seed = Math.random();
		return noise.simplex2( Date.now() * 0.001, 0 ) * 0.5 + 0.5;
	}
	function random21(){
		var val = randomRange( _min, _max );
		lastValue = lastValue * interpolation + val * (1.0 - interpolation);
		return lastValue;
	}

	//	easing
	function easeInOutExpo(t,b,c,d)
	{
		if (t==0) return b;
		if (t==d) return b+c;
		if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
		return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
	}

	//	array
	function shuffle( _arr )
	{
		var len = _arr.length - 1;
		for(i = len; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var tmp = _arr[i];
			_arr[i] = _arr[j];
			_arr[j] = tmp;
		}
		return _arr;
	}


})();


