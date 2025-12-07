/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.pointNum = 16;
		this.lineNum = 16;
		this.division = 256;
		this.lines = [];

		this.particleNums = 100000;
		this.points;

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;
		this.world.controls.minDistance = 10;
		this.world.controls.maxDistance = 3200 + 1600;

		var _t = this;
		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_light.position.set( 0, 0, 0 );
		this.world.add( _light );

		this.clock = new THREE.Clock( true );
		this.clock.start();

		this.count = 0;

		var _t = this;
		var _loader = new THREE.TextureLoader();
		_loader.load('shared/img/spark1.png',function(texture){
			var _geometry = new THREE.BufferGeometry();
			var _vertices = new Float32Array( _t.particleNums * 3 );
			var _vector = new Float32Array( _t.particleNums );
			var _scale = new Float32Array( _t.particleNums );
			for( var i = 0; i < _t.particleNums; i++ )
			{
				_vertices[ i * 3 + 0 ] = 0;
				_vertices[ i * 3 + 1 ] = 0;
				_vertices[ i * 3 + 2 ] = 0;

				_vector[i] = Math.floor( _t.pointNum * _t.division * Math.random() );
				_scale[i] = Math.random() * Math.random();
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );
			_geometry.addAttribute( 'vector', new THREE.BufferAttribute( _vector, 1 ) );
			_geometry.addAttribute( 'customScale', new THREE.BufferAttribute( _scale, 1 ) );

			var _material = new THREE.ShaderMaterial({
				uniforms: {
					time: { type: 'f', value: 0.0 },
					texture: {type: 't', value: texture },
					camera: {type:'v3',value: _t.world.camera.position}
				},
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				blending: THREE.AdditiveBlending,
				transparent: true,
				depthTest: false
			});

			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );


			_t.loop();
		});


		
		// this.pointNum = 16;
		// this.lineNum = 16;
		// this.division = 256;
		// this.lines = [];
		for( var i = 0; i < this.lineNum; i++ )
		{
			var _arr = [];
			for( var j = 0; j < this.pointNum; j++ )
			{
				var _rad0 = Math.random() * Math.PI * 2;
				var _rad1 = Math.random() * Math.PI * 2;
				var _r = 1.0 - Math.random() * Math.random();
				_r *= 1600;
				var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
				var _y = Math.sin( _rad0 ) * _r;
				var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;
				_arr[j] = new THREE.Vector3(_x,_y,_z);
			}

			var _geometry = new THREE.Geometry();
			var _material = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 0.2
			});

			var _l = SplineCurve3D( _arr, this.division );
			var len = _l.length;
			for( var k = 0; k < len; k++ )
			{
				_geometry.vertices[k] = new THREE.Vector3( _l[k].x, _l[k].y, _l[k].z)
			}

			var _line = new THREE.Line( _geometry, _material );
			this.world.add( _line );
			this.lines.push( _line );

		}



		//this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var _list = this.points.geometry.attributes.position.array;
			var _plist = this.points.geometry.attributes.vector.array;
			var len = _list.length / 3;
			var len0 = this.lines.length;
			for( var i = 0; i < len; i++ )
			{
				var _lineNo = i % len0;
				var _line = this.lines[_lineNo];
				var _len = _line.geometry.vertices.length;
				var _hoge = ( _plist[i] + this.count ) % _len;

				//var _hoge  = Math.floor( _line.geometry.vertices.length * Math.random() );
				var _point = _line.geometry.vertices[_hoge];
				_list[ i * 3 + 0 ] = _point.x;
				_list[ i * 3 + 1 ] = _point.y;
				_list[ i * 3 + 2 ] = _point.z;
			}

			this.points.geometry.attributes.position.needsUpdate = true;

			this.count ++;

			var _date = new Date().toString()
			$('#timeView').text( _date.substr( 15, 9 ) );

			//	console.log( this.points.geometry.attributes)
			//	this.points.geometry.attributes.vector.needsUpdate = true;

			//	console.log( this.clock.getDelta() )
			//	console.log( this.clock.oldTime, this.clock.startTime, this.clock.startTime - this.clock.oldTime );

		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

