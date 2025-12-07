/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP

		this.world = new world('webglView');
		this.world.camera.position.set( 0, 0, 100 );


		var _loader = new THREE.TextureLoader();
		var _texture = _loader.load( 'shared/img/perlin-512.png');
		var _sprite = _loader.load( 'shared/img/circle1.png');
		var _uniforms = {
			time: { type:'f', value: 0 },
			texture: { type:'t', value: _texture },
			sprite: { type:'t', value: _sprite }
		}

		var len = 100000;
		var _geometry = new THREE.BufferGeometry();
		var _position = new Float32Array( len * 3 );
		var _vector = new Float32Array( len * 3 );
		for( var i = 0; i < len; i++ )
		{
			_position[ i * 3 + 0 ] = 0;
			_position[ i * 3 + 1 ] = 0;
			_position[ i * 3 + 2 ] = 0;
			_vector[ i * 3 + 0 ] = Math.random();
			_vector[ i * 3 + 1 ] = Math.random();
			_vector[ i * 3 + 2 ] = Math.random();
		}

		_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ).setDynamic( true ) );
		_geometry.addAttribute( 'vectors', new THREE.BufferAttribute( _vector, 3 ).setDynamic( true ) );

		var _material = new THREE.ShaderMaterial({
			uniforms: _uniforms,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			depthTest: false,
			blending: THREE.AdditiveBlending
		});

		this.points = new THREE.Points( _geometry, _material );
		this.world.add( this.points );
		this.loop();

		console.log( this.points )
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			// var _array = _t.points.geometry.attributes.position.array;
			// var len = _array.length;
			// while( len )
			// {
			// 	len --;
			// 	_array[len] = ( Math.random()-.5)*1;
			// }
			// _t.points.geometry.attributes.position.needsUpdate = true;

			_t.points.material.uniforms.time.value += 0.001;



		}
	}

	return Practice;
})();

var _pr = new Practice();

