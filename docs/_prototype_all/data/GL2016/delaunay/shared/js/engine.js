/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 600;

		this.world.controls.autoRotate = false;

		var _light0 = new THREE.AmbientLight( 0x080808 );
		this.world.add( _light0 );

		var _light1 = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		_light1.position.set( 300, 300, 300 );
		this.world.add( _light1 );

		var _light2 = new THREE.SpotLight( 0xFFFFFF );
		_light2.position.set( 800, 800, 800 );
		this.world.add( _light2 );

		var _light3 = new THREE.DirectionalLight( 0xFFFFFF );
		_light3.position.set( 1, 1, 1 );
		this.world.add( _light3 );

		var _images = [
			'../texture/001.jpg',
			'../texture/002.jpg',
			'../texture/003.jpg',
			'../texture/004.jpg',
			'../texture/005.jpg',
			'../texture/006.jpg',
			'../texture/007.jpg',
			'../texture/008.jpg',
			'../texture/009.jpg',
			'../texture/010.jpg',
			'../texture/011.jpg'
		];

		var _t = this;
		createDplane();

		this.loop();

		function createDplane()
		{
			var _list = [];
			var _intervalKey;

			var _loader = new THREE.TextureLoader();
			var _img = _images[ Math.floor( Math.random() * _images.length ) ];

			_loader.load( _img, function( texture ){

				//	console.log(texture)

				var _width = texture.image.width * 0.5;
				var _height = texture.image.height * 0.5;

				var _geometry = new THREE.DelaunayGeometry( _width, _height, 100, [] );
				
				// for( var i = 0; i < _geometry.vertices.length; i++ )
				// {
				// 	_geometry.vertices[i].z = ( Math.random()-.5)*20;
				// }

				_geometry.computeFaceNormals();
				_geometry.computeVertexNormals();

				var _material = new THREE.MeshPhongMaterial({
					shading: THREE.FlatShading,
					map: texture,
					shininess: 100
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

					// _mesh.rotation.x = Math.random() * Math.PI * 2.0;
					// _mesh.rotation.y = Math.random() * Math.PI * 2.0;
					// _mesh.rotation.z  = Math.random() * Math.PI * 2.0;

					_mesh.scale.set( 0.01, 0.01, 0.01 )
					TweenMax.to(_mesh.scale, 0.8 , {x:1,y:1,z:1});
					TweenMax.to(_mesh.rotation, 0.8 , {x:Math.random() * Math.PI * 2.0,y:Math.random() * Math.PI * 2.0,z:Math.random() * Math.PI * 2.0});
				}

				var _count = 0;
				_intervalKey = setInterval(function(){

					_count ++;
					_count %= 7;

					var len = _t.list.length;
					while( len )
					{
						len --;
						if( _count == 0 )
						{
							TweenMax.to(_t.list[len].rotation, 0.8 , {x:0,y:0,z:0});
							
						} else {
							TweenMax.to(_t.list[len].rotation, 0.8 , {x: Math.random() * Math.PI * 2,y: Math.random() * Math.PI * 2,z: Math.random() * Math.PI * 2 });
						}
					}

					if( _count == 0 )
					{
						clearInterval( _intervalKey );

						setTimeout(function(){

							var len = _t.list.length;
							while( len )
							{
								len --;
								(function(len){
									TweenMax.to(_t.list[len].scale, 0.8 , {x:0.01,y:0.01,z:0.01, onComplete: function(){
										_t.list[len].visible = false;
									}});
								})(len);
								
							}
							setTimeout( function(){
								var len = _t.list.length;
								while( len )
								{
									len --;
									_t.list[len].parent.remove( _t.list[len] );
								}
								_t.list= [];
								createDplane();

							},1000);
						}, 1000 + 1000);
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
			} );
		}

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

