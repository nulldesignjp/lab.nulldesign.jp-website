/*
	engine.js
*/

var stationData = (function(){
	var _file = 'shared/data/stationlist.xml';

	var zoom = 5000;
	var hPar = 2.40;
	var offsetLat = 35.68251450;
	var offsetLng = 139.76614850;

	function stationData()
	{
		this.data = [];
		this.st = [];
	}

	stationData.prototype = 
	{
		load : function( _callback )
		{
			var _t = this;
			$.ajax({
				url: _file,
				type: 'GET',
				dataType: 'XML',
				success: function( _xml )
				{
					console.log( _xml );
					$( _xml ).find('stations line').each(function(){

						var _id = $( this ).attr('id');
						var _name = $( this ).attr('name');
						var _color = parseInt( '0x' + $( this ).attr('color'),16 );

						var _arr = [];

						$( this ).find('item').each(function(){
							var __id = $( this ).attr('id');
							var _x = parseFloat( $( this ).find('location longitude').text() );
							var _y = 0;
							var _z = parseFloat( $( this ).find('location latitude').text() );
							var _e = $( this ).find('english').text();

							_x = roundValue( _x );
							_y = roundValue( _y );
							_x = ( _x - offsetLng ) * zoom;
							_y = $( this ).find('depth').text() * hPar;
							_z = - ( _z - offsetLat ) * zoom;

							var vector = new THREE.Vector3( _x, _y, _z );

							//	line points
							_arr.push( vector );
							_t.st.push( vector );
						});

							function roundValue( e )
							{
								return Math.floor( e * 10000 ) * 0.0001;
							}

						var _geometry = new THREE.Geometry();
						var _material = new THREE.LineBasicMaterial({
							transparent: true,
							opacity: 0.2
						});

						var _l = SplineCurve3D( _arr, 256 );
						var len = _l.length;
						for( var k = 0; k < len; k++ )
						{
							_geometry.vertices[k] = new THREE.Vector3( _l[k].x, _l[k].y, _l[k].z)
						}

						var _line = new THREE.Line( _geometry, _material );

						_t.data.push( _line );
					});

					_callback();

				}
			})
		}
		
	};

	return stationData;
})();

var Practice = (function(){

	function Practice()
	{
		this.lines = [];

		this.particleNums = 30000;
		this.points;

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;
		this.world.controls.autoRotate = false;
		this.world.controls.minDistance = 10;
		this.world.controls.maxDistance = 3200 + 1600;

		var _t = this;
		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_light.position.set( 0, 0, 0 );
		this.world.add( _light );

		this.clock = new THREE.Clock( true );
		this.clock.start();

		this.count = 0;

		var _gh = new THREE.GridHelper( 3000, 20);
		_gh.material.transparent = true;
		_gh.material.opacity = 0.1;
		this.world.add( _gh );

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

				_vector[i] = Math.random();
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


			//
			var _st = new stationData();
			_st.load(function(){
				var _data = _st.data;
				for( var i = 0; i < _data.length; i++ )
				{
					var _line = _data[i];
					_t.world.add( _line );
					_t.lines.push( _line );
				}

				var _data = _st.st;
				var _geometry = new THREE.BufferGeometry();
				var _vertices = new Float32Array( _data.length * 3 );
				for( var i = 0; i < _data.length; i++ )
				{
					_vertices[ i * 3 + 0 ] = _data[i].x;
					_vertices[ i * 3 + 1 ] = _data[i].y;
					_vertices[ i * 3 + 2 ] = _data[i].z;
				}

				_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );

				var _material = new THREE.ShaderMaterial({
					uniforms: {
						time: { type: 'f', value: 0.0 },
						texture: {type: 't', value: texture },
						camera: {type:'v3',value: _t.world.camera.position}
					},
					vertexShader: document.getElementById('vertexshader2').textContent,
					fragmentShader: document.getElementById('fragmentshader2').textContent,
					blending: THREE.AdditiveBlending,
					transparent: true,
					depthTest: false
				});

				var _points = new THREE.Points( _geometry, _material );
				_t.world.add( _points );

				_t.loop();
			});

		});


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
				var _hoge = ( Math.floor(_plist[i]*_len) + this.count ) % _len;

				//var _hoge  = Math.floor( _line.geometry.vertices.length * Math.random() );
				var _point = _line.geometry.vertices[_hoge];
				_list[ i * 3 + 0 ] = _point.x;
				_list[ i * 3 + 1 ] = _point.y;
				_list[ i * 3 + 2 ] = _point.z;
			}

			this.points.geometry.attributes.position.needsUpdate = true;

			this.count ++;

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

