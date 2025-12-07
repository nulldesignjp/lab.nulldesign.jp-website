/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP

		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 1000 );
		//this.world.controls.autoRotate = false;



		//	http://lab.nulldesign.jp/webgl/2015-01/150930/
		new THREE.TextureLoader().load('txt01.png', function( _texture ){	_createPlane( _texture, 0 )	});
		new THREE.TextureLoader().load('txt02.png', function( _texture ){	_createPlane( _texture, 400 )	});
		new THREE.TextureLoader().load('txt03.png', function( _texture ){	_createPlane( _texture, 800 )	});

		var _t = this;
		function _createPlane( _texture, _start )
		{
			var _end = _start + 400;
			_end = _end > 1000?1000:_end;
			for( var i = _start; i < _end; i++ )
			{
				var _geometry = new THREE.PlaneGeometry(100,100,1,1)
				var _material = new THREE.MeshBasicMaterial({map: _texture,transparent:true});
				var _mesh  = new THREE.Mesh( _geometry, _material );

				var _startX = Math.floor( Math.random() * 19 ) / 20;
				var _startY = Math.floor( Math.random() * 19 ) / 20;
				var _grid = 0.05;
				//_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(0,1), new THREE.Vector2(0,0), new THREE.Vector2(1,1)	];
				//_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1)	];
				_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(_startX,_startY), new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];
				_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];

				var _grid = 150;
				var _x = ( ( i%10 ) - 5 ) * _grid;
				var _y = ( Math.floor( i/10 ) % 10 - 5 ) * _grid;
				var _z = ( Math.floor( i/100 ) - 5 ) * _grid;
				_mesh.position.set( _x,_y,_z);
				_t.world.add( _mesh );
			}
		}


		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );



		}
	}

	return Practice;
})();

var _pr = new Practice();

