/*
	engine.js
*/

window.onload = function(){

	var _world,_plane;
	
	$('#siteBody').addClass('open');

	init();
	start();

	function init(){
		_world = new world('webglView');
		_plane = createPlane();
		_world.add( _plane );
		_world.controls.autoRotate = true;
		_world.controls.enabled = true;


		var _scale = 300.0;


		//
		var _geometry = new THREE.BoxBufferGeometry( _scale, _scale, _scale );
		var _material = new THREE.MeshBasicMaterial({
			wireframe: true,
			transparent: true,
			opacity: 0.05
		});
		var _box = new THREE.Mesh( _geometry, _material );
		_world.add( _box )


		var _points = [
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 ),
			new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 )
		];

		var _p = SplineCurve3D( _points, 60 );
		var _vertices = [];
		for( var i = 0; i < _p.length; i++ )
		{
			_vertices[i] = new THREE.Vector3( _p[i].x * _scale, _p[i].y * _scale, _p[i].z * _scale );
		}

		console.log( _points.length, _p.length, _p );


		var _geometry = new THREE.Geometry();
		_geometry.vertices = _vertices;

		var _material = new THREE.LineBasicMaterial({
			color: new THREE.Color( 1.0, 1.0, 1.0 ),
			linewidth: 3
		});
		var _line = new THREE.Line( _geometry, _material );
		_world.add( _line );

		//	height = -10000 + ((R * 256 * 256 + G * 256 + B) * 0.1)	

		//	R * 256 * 256 + G * 256 + B
		//	min: 0, max: 16843008, 8keta

		//	A * 256 * 256 * 256 + R * 256 * 256 + G * 256 + B
		//	min: 0, max: 4311810304,	10keta
		//	half: 2155905152


		//	value:	0.2198813239 750903


		//	10 to 256
		//	_value.toString(256);	


		var _t1 = 256;
		var _t2 = 256 * 256;
		var _t3 = 256 * 256 * 256;

		//	-1.0 to 1.0 to RGB
		var _num0 = Math.floor( Math.random() * 4311810304 );
		console.log( _num0 );
		var _a = Math.floor( _num0 / _t3 );
		var _r = Math.floor( ( _num0 - _a * _t3 ) / _t2 );
		var _g = Math.floor( ( _num0  - _a * _t3 - _r * _t2 ) / _t1 );
		var _b = ( _num0 - _a * _t3- _r * _t2 - _g * _t1 ) % _t1;
		console.log( 'r: ', _r, 'g: ', _g, 'b: ', _b, 'a: ', _a  );

		//	Int 桁取得
		var m = parseInt( _num0 ).toString(10).length;
		console.log( _num0, m + "桁" );

		//	RGB化
		var _canvas = document.createElement('canvas');
		_canvas.width = _canvas.height = 64;
		var _ctx = _canvas.getContext('2d');
		//	var _imageData = _ctx.createImageData( _canvas.width, _canvas.height);
		var _imageData = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);

		var _count = 0;
		var _r,_g,_b,_a;
		for (var i = 0; i < _p.length; i++) {

			var _valueX = Math.floor( ( _p[i].x * 0.5 + 0.5 ) * Math.pow( 10, 9 ) );
			var _valueY = Math.floor( ( _p[i].y * 0.5 + 0.5 ) * Math.pow( 10, 9 ) );
			var _valueZ = Math.floor( ( _p[i].z * 0.5 + 0.5 ) * Math.pow( 10, 9 ) );

			_a = Math.floor( _valueX / _t3);
			_r = Math.floor( ( _valueX - _a * _t3 ) / _t2 );
			_g = Math.floor( ( _valueX  - _a * _t3 - _r * _t2 ) / _t1 );
			_b = ( _valueX - _a * _t3- _r * _t2 - _g * _t1 ) % _t1;
			_imageData.data[ _count * 4 + 0 ] = _r;
			_imageData.data[ _count * 4 + 1 ] = _g;
			_imageData.data[ _count * 4 + 2 ] = _b;
			_imageData.data[ _count * 4 + 3 ] = _a;
			_count++;

			_a = Math.floor( _valueY / _t3);
			_r = Math.floor( ( _valueY - _a * _t3 ) / _t2 );
			_g = Math.floor( ( _valueY  - _a * _t3 - _r * _t2 ) / _t1 );
			_b = ( _valueY - _a * _t3- _r * _t2 - _g * _t1 ) % _t1;
			_imageData.data[ _count * 4 + 0 ] = _r;
			_imageData.data[ _count * 4 + 1 ] = _g;
			_imageData.data[ _count * 4 + 2 ] = _b;
			_imageData.data[ _count * 4 + 3 ] = _a;
			_count++;


			_a = Math.floor( _valueZ / _t3);
			_r = Math.floor( ( _valueZ - _a * _t3 ) / _t2 );
			_g = Math.floor( ( _valueZ  - _a * _t3 - _r * _t2 ) / _t1 );
			_b = ( _valueZ - _a * _t3- _r * _t2 - _g * _t1 ) % _t1;
			_imageData.data[ _count * 4 + 0 ] = _r;
			_imageData.data[ _count * 4 + 1 ] = _g;
			_imageData.data[ _count * 4 + 2 ] = _b;
			_imageData.data[ _count * 4 + 3 ] = _a;
			_count++;


		}

		_ctx.putImageData( _imageData, 0, 0);

		$( _canvas ).css({
			'position': 'fixed',
			'left': '16px',
			'top': '96px',
			'z-index': '1000',
			'background': '#080808'
		})
		$( 'body' ).append( _canvas );


		//	逆の手順
		//var _imageData = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
		var _vertices = [];
		var _index, _x, _y, _r, _g, _b;
		for( var i = 0; i < _p.length; i++ ){
			
			_index = i * 3 + 0;
			_x = _index % 64;
			_y = Math.floor( _index / 64 );
			_imageData = _ctx.getImageData(_x, _y, 1, 1);
			_r = _imageData[0];
			_g = _imageData[1];
			_b = _imageData[2];
			_a = _imageData[3];
			_a = _a * _t3;
			_r = _r * _t2;
			_g = _g * _t1;
			_b = _b * 1.0;
			var _valueX = _a + _r + _g + _b;
			

			_index = i * 3 + 1;
			_x = _index % 64;
			_y = Math.floor( _index / 64 );
			_imageData = _ctx.getImageData(_x, _y, 1, 1);
			_r = _imageData[0];
			_g = _imageData[1];
			_b = _imageData[2];
			_a = _imageData[3];
			_a = _a * _t3;
			_r = _r * _t2;
			_g = _g * _t1;
			_b = _b * 1.0;
			var _valueY = _a + _r + _g + _b;

			
			_index = i * 3 + 2;
			_x = _index % 64;
			_y = Math.floor( _index / 64 );
			_imageData = _ctx.getImageData(_x, _y, 1, 1);
			_r = _imageData[0];
			_g = _imageData[1];
			_b = _imageData[2];
			_a = _imageData[3];
			_a = _a * _t3;
			_r = _r * _t2;
			_g = _g * _t1;
			_b = _b * 1.0;
			var _valueZ = _a + _r + _g + _b;

			_vertices[i] = new THREE.Vector3( _valueX, _valueY, _valueZ );

		}

		for( var i = 0; i < _p.length; i++ )
		{
			_vertices[i] = new THREE.Vector3( _p[i].x * _scale, _p[i].y * _scale, _p[i].z * _scale );
		}


		var _geometry = new THREE.Geometry();
		_geometry.vertices = _vertices;

		var _material = new THREE.LineBasicMaterial({
			color: new THREE.Color( 1.0, 0.0, 0.0 ),
			linewidth: 3
		});
		var _line = new THREE.Line( _geometry, _material );
		_world.add( _line );
		_line.position.y = 20;





		window.addEventListener( 'resize', function(){
			_plane.scale.x = window.innerWidth;
			_plane.scale.y = window.innerHeight;

			_plane.material.uniforms.resolution.value.x = window.innerWidth;
			_plane.material.uniforms.resolution.value.y = window.innerHeight;

		})

	}

	function start(){
		loop( 0 );
	}

	function loop( _stepTime ){

		window.requestAnimationFrame( loop );
	}


	function createPlane(){
			var _uniforms = {
				'time': {value:0},
				'mouse': {value: new THREE.Vector2()	},
				'resolution': {value: new THREE.Vector2( window.innerWidth, window.innerHeight )	},
				"image01": { value: undefined	}
			};

			var _material = new THREE.ShaderMaterial({
				uniforms: _uniforms,
				vertexShader:   document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
				transparent: true
			});

			var _geometry = new THREE.PlaneGeometry(1,1,1,1);

			return new THREE.Mesh(_geometry,_material);
	}
}
