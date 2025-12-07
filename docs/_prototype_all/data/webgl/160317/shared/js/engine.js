/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP

		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 1000 );
		this.world.controls.autoRotate = false;



		//	http://lab.nulldesign.jp/webgl/2015-01/150930/
		var _texture = new THREE.TextureLoader().load( '6760135001_14c59a1490_o.jpg');

		for( var i = 0; i < 1000; i++ )
		{
			var _geometry = new THREE.PlaneGeometry( 100,100,1,1)
			var _material = new THREE.MeshBasicMaterial({map: _texture});
			var _mesh  = new THREE.Mesh( _geometry, _material );

			var _startX = Math.floor( Math.random() * 9 ) / 10;
			var _startY = Math.floor( Math.random() * 9 ) / 10;
			var _grid = 0.1;
			//_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(0,1), new THREE.Vector2(0,0), new THREE.Vector2(1,1)	];
			//_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(0,0), new THREE.Vector2(1,0), new THREE.Vector2(1,1)	];
			_geometry.faceVertexUvs[0][0] = [	new THREE.Vector2(_startX,_startY), new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];
			_geometry.faceVertexUvs[0][1] = [	new THREE.Vector2(_startX,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY-_grid), new THREE.Vector2(_startX+_grid,_startY)	];
			


			var _grid = 150;
			var _x = ( ( i%10 ) - 5 ) * _grid;
			var _y = ( Math.floor( i/10 ) % 10 - 5 ) * _grid;
			var _z = ( Math.floor( i/100 ) - 5 ) * _grid;
			_z =
			_mesh.position.set( _x,_y,_z);

			this.world.add( _mesh )

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

