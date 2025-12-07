/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;


		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		_light.position.set( 300, 300, 300 );
		this.world.add( _light );

		var _light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 600 );
		_light2.position.set( -300, -300, -300 );
		this.world.add( _light2 );

		var _light3 = new THREE.SpotLight( 0xFFFFFF );
		_light3.position.set( 800, 800, 800 );
		this.world.add( _light3 );

		var _arr = [];
		for( var i = 0; i < 160; i++ )
		{
			var _r = 1.0 - ( Math.random() * Math.random() )
			_r *= 300;
			var _rad0 = Math.random() * Math.PI * 2.0;
			var _rad1 = Math.random() * Math.PI * 2.0;

			var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
			var _y = Math.sin( _rad0 ) * _r;
			var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r; 

			_arr.push( new THREE.Vector3( _x, _y, _z ) );
		}

		var _geometry = new THREE.ConvexGeometry( _arr );
		var _material = new THREE.MeshPhongMaterial({
			color: 0xFFFFFF,
			shading: THREE.FlatShading,
			//metal: true,
			//specular: 0xCC0000,
			//emissive: 0x0000CC,
			shininess: 10,
			//wireframe: true
		});
		this.mesh = new THREE.Mesh( _geometry, _material );
		this.world.add( this.mesh );

		this.mesh.position.z = -360;


		this.plane;
		var _t = this;
		var _loader = new THREE.TextureLoader();

		_loader.load( 'shared/img/IMG_5690.jpg', function( texture ){

			console.log(texture)

			var _width = texture.image.width;
			var _height = texture.image.height;

			var _geometry = new THREE.DelaunayGeometry( _width, _height, 100, [] );
			
			for( var i = 0; i < _geometry.vertices.length; i++ )
			{
				_geometry.vertices[i].z = ( Math.random()-.5)*20;
			}

			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

			var _material = new THREE.MeshPhongMaterial({
				side: THREE.DoubleSide,
				shading: THREE.FlatShading,
				map: texture,
				shininess: 10
			});
			_t.plane = new THREE.Mesh( _geometry, _material );
			_t.world.add( _t.plane )
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
		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

