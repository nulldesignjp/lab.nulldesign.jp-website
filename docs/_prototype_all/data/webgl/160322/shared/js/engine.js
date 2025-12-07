/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 100 );
		this.world.controls.autoRotate = false;

		var _t = this;
		var _amb  = new THREE.AmbientLight( 0x080808, 1.0 );
		var _pl = new THREE.PointLight( 0xCCCCCC, 1.0, 100 );

		this.world.add( _amb );
		this.world.add( _pl );


			var len = 1000;
			var _geometry = new THREE.BufferGeometry();
			var _position = new Float32Array( len * 3 );
			var _index = new Float32Array( len );

			for( var i = 0; i < len; i++ )
			{
				_position[ i * 3 + 0 ] = (Math.random()-.5)*100;
				_position[ i * 3 + 1 ] = (Math.random()-.5)*100;
				_position[ i * 3 + 2 ] = (Math.random()-.5)*100;

				_index[ i ] = i;
			}

			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
			_geometry.addAttribute( 'randomSeed', new THREE.BufferAttribute( _index, 1 ) );

			var _material = new THREE.PointsMaterial({
				size: 2,
				map: new THREE.TextureLoader().load('shared/img/circle1.png'),
				transparent: true,
				depthTest: false,
				depthWrite: false,
				blending: THREE.AdditiveBlending
			});

			_geometry.computeBoundingSphere();
			_geometry.setDrawRange( 0, len );

			_t.points = new THREE.Points( _geometry, _material );
			_t.world.add( _t.points );

			var _geometry = new THREE.BufferGeometry();
			_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
			_geometry.computeBoundingSphere();
			_geometry.setDrawRange( 0, 0 );
			var _material = new THREE.LineBasicMaterial({
				blending: THREE.AdditiveBlending,
				transparent: true,
				depthTest: false,
				opacity: 0.5
			});
			_t.line = new THREE.LineSegments( _geometry, _material );
			_t.world.add( _t.line );

		this.loop();


		window.addEventListener( 'mousemove', function(e){
			var _par = Math.floor( e.pageX / window.innerWidth * len );
			_t.points.geometry.setDrawRange( 0, _par );
			_t.line.geometry.setDrawRange( 0, _par );
		})

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			//_t.line.geometry.attributes.position.needsUpdate = true;
			//_t.points.geometry.attributes.position.needsUpdate = true;


		}
	}

	return Practice;
})();

var _pr = new Practice();

