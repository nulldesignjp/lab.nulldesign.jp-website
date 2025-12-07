/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;

		this.world.controls.autoRotate = false;

		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		_light.position.set( 300, 300, 300 );
		this.world.add( _light );

		var _light2 = new THREE.SpotLight( 0xFFFFFF );
		_light2.position.set( 800, 800, 800 );
		this.world.add( _light2 );

		var _light3 = new THREE.DirectionalLight( 0xFFFFFF );
		_light3.position.set( 1, 1, 1 );
		this.world.add( _light3 );

		var _t = this;
		var _loader = new THREE.TextureLoader();

		_loader.load( 'shared/img/IMG_5690.jpg', function( texture ){

			//	console.log(texture)

			var _width = texture.image.width * 0.5;
			var _height = texture.image.height * 0.5;

			var _geometry = new THREE.DelaunayGeometry( _width, _height, 100, [] );
			
			for( var i = 0; i < _geometry.vertices.length; i++ )
			{
				_geometry.vertices[i].z = ( Math.random()-.5)*20;
			}

			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

			var _material = new THREE.MeshPhongMaterial({
				//side: THREE.DoubleSide,
				shading: THREE.FlatShading,
				map: texture,
				shininess: 100,
				//metal:true
				//wireframe: true
			});

			for( var i = 0; i < _geometry.faces.length; i++ )
			{
				var _face = _geometry.faces[i];
				var _uvs = _geometry.faceVertexUvs[0][i];
				var _v0 = _geometry.vertices[_face.a];
				var _v1 = _geometry.vertices[_face.b];
				var _v2 = _geometry.vertices[_face.c];
				var _centerX = ( _v0.x + _v1.x + _v2.x ) / 3;
				var _centerY = ( _v0.y + _v1.y + _v2.y ) / 3;

				var _margin = 0.98;
				_margin = 1.0;
				var __v0 = new THREE.Vector3( ( _v0.x - _centerX ) * _margin, ( _v0.y - _centerY ) * _margin, _v0.z );
				var __v1 = new THREE.Vector3( ( _v1.x - _centerX ) * _margin, ( _v1.y - _centerY ) * _margin, _v1.z );
				var __v2 = new THREE.Vector3( ( _v2.x - _centerX ) * _margin, ( _v2.y - _centerY ) * _margin, _v2.z );

				var _arr = [];
				_arr.push( __v0 );
				_arr.push( __v1 );
				_arr.push( __v2 );

				var _l0 = __v0.length();
				var _l1 = __v1.length();
				var _l2 = __v2.length();
				var _depth = Math.max( _l0, _l1, _l2 );

				_arr.push( new THREE.Vector3( 0, 0, - ( _depth * Math.random() * 0.75 + _depth * 0.25 ) ) );

				var __geometry = new THREE.ConvexGeometry( _arr );
				for( var j = 0; j < __geometry.faces.length; j++ )
				{
					__geometry.faceVertexUvs[0][j] = _uvs;
				}

				var _mesh = new THREE.Mesh( __geometry, _material );
				_mesh.position.x = _centerX;
				_mesh.position.y = _centerY;
				_t.world.add( _mesh );

				_t.list.push( _mesh );

				_mesh.rotation.x = Math.random() * Math.PI * 2.0;
				_mesh.rotation.y = Math.random() * Math.PI * 2.0;
				_mesh.rotation.z  = Math.random() * Math.PI * 2.0;



			}


			var _count = 0;
			setInterval(function(){

				_count ++;
				_count %= 30;

				var len = _t.list.length;
				while( len )
				{
					len --;
					if( _count == 0 )
					{
						TweenMax.to(_t.list[len].rotation, 0.8 , {x:0,y:0,z:0 });
					} else {
						TweenMax.to(_t.list[len].rotation, 0.8 , {x: Math.random() * Math.PI * 2,y: Math.random() * Math.PI * 2,z: Math.random() * Math.PI * 2 });
					}
				}
			},1000);

			$('#webglView').addClass('fadeIn');

		},
		// Function called when download progresses
		function ( xhr ) {
			console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
		},
		// Function called when download errors
		function ( xhr ) {
			console.log( 'An error happened' );
		} )

		this.loop();


	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			// var len = _t.list.length;
			// while( len )
			// {
			// 	len --;
			// 	_t.list[len].rotation.x += 0.0001 * len;
			// 	_t.list[len].rotation.y += 0.0001 * len;
			// }
		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

