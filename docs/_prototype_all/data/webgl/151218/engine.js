/*
	engine.js
*/

(function(){
	var _world;
	var _uniforms = {
		time: { type: "f", value: 0.0 },
		fineness: { type: "f", value: 16.0 },
		speed: { type: "f", value: 0.10 },
		mode : { type : "i", value : 0 }
	};

	_uniforms.mode.value = Math.floor( Math.random() * 5 );

	_world = new world();
	_world.renderer.setClearColor( 0x000000 );

	document.getElementById('webgl').appendChild(_world.renderer.domElement);

	var _vl = {};

	$.ajax({
		url: 'iblogo.json',
		type: 'GET',
		dataType: 'JSON',
		success: _success,
		error: _error
	});

	function _success( _json )
	{
		_vl = _json;

		loadShaders({
			vertexShader: 'effect.vert',
			fragmentShader: 'effect.frag'
		},
		_next );

		function _next( _shader )
		{
			var _geometry = new THREE.Geometry();
			var _scale = 30;

			var _data = [];
			for( var i in _vl )
			{
				var _id = _vl[i].id;
				_data[_id] = _vl[i];
			}

			var len = _data.length;
			for( var i = 0; i < len; i++ )
			{
				var _x = _data[i].x - 4.0;
				var _y = _data[i].y - 5.0;
				var _v3 = new THREE.Vector3(
					_x * _scale - ( _y * _scale * 0.5 ),
					- _y * _scale * 0.5 * Math.sqrt(3),
					0
				);
				_geometry.vertices[i] = _v3;
			}
			
			var len = _data.length;
			for( var i = 0; i < len; i++ )
			{
				if( _data[i].node.length == 3 )
				{
					_geometry.faces.push( new THREE.Face3(	_data[i].id, _data[i].node[0], _data[i].node[2]	) );
					_geometry.faces.push( new THREE.Face3(	_data[i].id, _data[i].node[2], _data[i].node[1]	) );
				} else if( _data[i].node.length == 2 )
				{
					_geometry.faces.push( new THREE.Face3(	_data[i].id, _data[i].node[1], _data[i].node[0]	) );
				}
				
			}

			//var _shader = new shader00();
			var _material = new THREE.ShaderMaterial( {
				uniforms:       _uniforms,
				//attributes:     {},
				//defines: {},
				vertexShader:   _shader.vertexShader,
				fragmentShader: _shader.fragmentShader,
				//blending:       THREE.AdditiveBlending,
				depthTest:      false,
				transparent:    true,
				side: THREE.DoubleSide
			});

			var _mesh = new THREE.Mesh( _geometry, _material );
			_world.scene.add( _mesh );

			start();
		}
	}

	function _error( _e )
	{
		alert( 'HAHAHA! Load JSON Error!' )
	}


	function rnd()
	{
		return Math.random()*2-1;
	}


	function start()
	{
		_loop();
	}

	function _loop()
	{
		_uniforms.time.value +=10.0;
		_world.render();
		window.requestAnimationFrame( _loop );
	}

	window.onresize = function()
	{
		_world.resize();
	};

	function loadShaders( __shader, _callBack )
	{
		var _shader = {};
		_shader.vertexShader = '';
		_shader.fragmentShader = '';

		$.ajax({
			url: __shader.vertexShader,
			type: 'GET',
			dataType: 'text',
			success: function( _v )
			{
				_shader.vertexShader= _v;
				$.ajax({
					url: __shader.fragmentShader,
					type: 'GET',
					dataType: 'text',
					success: function( _f )
					{
						_shader.fragmentShader = _f;
						_callBack( _shader );
					}
				});
			}
		});
	}

})();