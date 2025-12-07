/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		this.uniform = {
			time: { type: 'f', value: 0	},
			mouse: { type: 'v2', value: new THREE.Vector2()	},
			resolution: { type: 'v2', value: new THREE.Vector2()	},
		};

		this.uniform.mouse.value.x = 0;
		this.uniform.mouse.value.y = 0;
		this.uniform.resolution.value.x = window.innerWidth;
		this.uniform.resolution.value.y = window.innerHeight;

		var _material = new THREE.ShaderMaterial({
			uniforms: this.uniform,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			//side: THREE.DoubleSide
		});

		//var _material = new THREE.PointsMaterial();
		var _geometry = new THREE.BufferGeometry();
		var _vertexPositions = [];
		for( var i = 0; i < 10000; i++ )
		{
			var _x = rnd() * 300;
			var _y = rnd() * 300;
			var _z = rnd() * 300;
			_vertexPositions.push([_x,_y,_z]);
		}
		var _vertices = new Float32Array( _vertexPositions.length * 3 );
		for ( var i = 0; i < _vertexPositions.length; i++ )
		{
			_vertices[ i*3 + 0 ] = _vertexPositions[i][0];
			_vertices[ i*3 + 1 ] = _vertexPositions[i][1];
			_vertices[ i*3 + 2 ] = _vertexPositions[i][2];
		}
		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );

		var _ids = new Float32Array( _vertexPositions.length );
		for ( var i = 0; i < _vertexPositions.length; i++ )
		{
			_ids[ i ] = i / _vertexPositions.length;
		}
		_geometry.addAttribute( 'ids', new THREE.BufferAttribute( _ids, 1 ) );


		this.points = new THREE.Points( _geometry, _material );
		this.world.add( this.points );


		//this.world.add( new THREE.Mesh(new THREE.BoxGeometry(300,300,300,1,1,1),new THREE.MeshBasicMaterial({wireframe:true,transparent:true,opacity:0.6})))

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			_t.uniform.time.value ++;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

