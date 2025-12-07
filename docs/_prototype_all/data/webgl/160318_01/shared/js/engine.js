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



		var _texture01,_texture02,_texture03;
		//	http://lab.nulldesign.jp/webgl/2015-01/150930/
		new THREE.TextureLoader().load('txt01.png', function( _texture ){
			_texture01 = _texture;
			new THREE.TextureLoader().load('txt02.png', function( _texture ){
				_texture02 = _texture;
				new THREE.TextureLoader().load('txt03.png', function( _texture ){
					_texture03 = _texture;

					//	一度キャッシュに入れないとカクツク
					var _geometry = new THREE.PlaneGeometry(1,1,1,1)
					var _material = new THREE.MeshBasicMaterial({map: _texture01,transparent:true});
					var _mesh01 = new THREE.Mesh( _geometry, _material );
					_t.world.add( _mesh01 );

					var _geometry = new THREE.PlaneGeometry(1,1,1,1)
					var _material = new THREE.MeshBasicMaterial({map: _texture02,transparent:true});
					var _mesh02 = new THREE.Mesh( _geometry, _material );
					_t.world.add( _mesh02 );

					var _geometry = new THREE.PlaneGeometry(1,1,1,1)
					var _material = new THREE.MeshBasicMaterial({map: _texture03,transparent:true});
					var _mesh03 = new THREE.Mesh( _geometry, _material );
					_t.world.add( _mesh03 );

					_t.world.render();

					_t.world.remove( _mesh01 );
					_t.world.remove( _mesh02 );
					_t.world.remove( _mesh03 );

					//	ここから本番
					setTimeout( function(){
						_createPlane( _texture01, 0, 400 );
						_createPlane( _texture02, 400, 800 );
						_createPlane( _texture03, 800, 1000 );
					},100 );
				});
			});
		});

		var _t = this;
		function _createPlane( _texture, _start, _end )
		{
			if( _start >= _end ){	return;	}
			var i = _start;
			var _geometry = new THREE.PlaneGeometry(100,100,1,1)
			var _material = new THREE.MeshBasicMaterial({map: _texture,transparent:true,side:THREE.DoubleSide});
			var _mesh  = new THREE.Mesh( _geometry, _material );

			var _grid = 0.05;
			var _startX = Math.floor( Math.random() * 19 ) / 20 + _grid;
			var _startY = Math.floor( Math.random() * 19 ) / 20 + _grid;
			//_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(0,1), new THREE.Vector2(0,0), new THREE.Vector2(1,1)	];
			//_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1)	];
			_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(_startX,_startY), new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];
			_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];

			var _grid = 125;
			var _x = ( ( i%10 ) - 5 ) * _grid;
			var _y = ( Math.floor( i/10 ) % 10 - 5 ) * _grid;
			var _z = ( Math.floor( i/100 ) - 5 ) * _grid;
			_mesh.position.set( _x,_y,_z);
			_t.world.add( _mesh );
			_start ++;

			setTimeout(function(){	_createPlane( _texture, _start, _end )	},16)
			
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

