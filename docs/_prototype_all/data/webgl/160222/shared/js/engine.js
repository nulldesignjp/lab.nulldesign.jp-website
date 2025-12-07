/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.circles = [];

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;

		this.world.controls.autoRotate = false;

		var _amb = new THREE.AmbientLight( 0x181818 );
		this.world.add( _amb );

		var _light = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
		_light.position.set( 1,1,1 );
		this.world.add( _light );

		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 600 );
		_light.position.set( 300, 300, 300 );
		this.world.add( _light );

		var _radius = 20;
		for( var i = 0; i < 256; i++ )
		{
			_radius = Math.floor( Math.random()*64 )+2;
			// var _geometry = new THREE.CircleGeometry( _radius, 18 );
			// var _material = new THREE.MeshBasicMaterial({
			// 	wireframe: false
			// });
			var _geometry = new THREE.IcosahedronGeometry( _radius, 1 );
			var _material = new THREE.MeshPhongMaterial({
				shading: THREE.FlatShading
			});
			var _circle = new THREE.Mesh( _geometry, _material );
			_circle.position.x = (Math.random()-.5) * window.innerWidth;
			_circle.position.y = (Math.random()-.5) * window.innerHeight;
			_circle.position.z = (Math.random()-.5) * window.innerHeight;

			this.world.add( _circle );

			var _obj = {};
			_obj.mesh = _circle;
			_obj.pos = new THREE.Vector3().copy( _circle.position );
			_obj.ppos = new THREE.Vector3().copy( _circle.position );
			_obj.vector = new THREE.Vector3();
			_obj.radius = _radius;

			this.circles.push( _obj );
		}

		var _t = this;
		$( window ).on('click touchend',function(){
			var len = _t.circles.length;
			while( len )
			{
				len --;
				var _obj = _t.circles[len];
				_obj.ppos.x += (Math.random()-.5)*12;
				_obj.ppos.y += (Math.random()-.5)*12;
				_obj.ppos.z += (Math.random()-.5)*12;

				//_obj.mesh.material.wireframe = !_obj.mesh.material.wireframe;
			}
		});
		$( window ).on('touchmove',function(e){
			e.preventDefault();
		});

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var _cx = window.innerWidth * 0.5;
			var _cy = window.innerHeight * 0.5;

			var _l = _t.circles;
			var len = _l.length;
			for( var i = 0; i < len; i++ )
			{
				var _c = _l[i];

				var _dx = _c.pos.x;
				var _dy = _c.pos.y;
				var _dz = _c.pos.z;
				var _d = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
				_d = _d<_c.radius?_c.radius:_d;
				var _pow = _c.radius / _d;
				var _x = _dx / _d * _pow;
				var _y = _dy / _d * _pow;
				var _z = _dz / _d * _pow;
				_c.pos.x -= _x;
				_c.pos.y -= _y;
				_c.pos.z -= _z;


				var tempX = _c.pos.x;
				var tempY = _c.pos.y;
				var tempZ = _c.pos.z;

				_c.vector.x = _c.pos.x - _c.ppos.x;
				_c.vector.y = _c.pos.y - _c.ppos.y;
				_c.vector.z = _c.pos.z - _c.ppos.z;

				_c.pos.x += _c.vector.x;
				_c.pos.y += _c.vector.y;
				_c.pos.z += _c.vector.z;
				_c.ppos.x = tempX;
				_c.ppos.y = tempY;
				_c.ppos.z = tempZ;

				_c.mesh.position.x = _c.pos.x;
				_c.mesh.position.y = _c.pos.y;
				_c.mesh.position.z = _c.pos.z;

				_c.mesh.rotation.x += _c.vector.x / 100;
				_c.mesh.rotation.y += _c.vector.y / 100;
				//_c.mesh.rotation.z += _c.vector.z / 100;
			}

			for( var i = 0; i < len-1; i++ )
			{
				var _c0 = _l[i];
				for( var j = i + 1; j < len; j++ )
				{
					var _c1 = _l[j];
					var _dx = _c1.pos.x - _c0.pos.x;
					var _dy = _c1.pos.y - _c0.pos.y;
					var _dz = _c1.pos.z - _c0.pos.z;
					var _rDist = _c0.radius * _c0.mesh.scale.x + _c1.radius * _c1.mesh.scale.x;
					var _dist = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
			            
					if( _rDist > _dist )
					{
			            var diff = _rDist - _dist;
			            var offsetX = ( diff * _dx / _dist ) * .5;
			            var offsetY = ( diff * _dy / _dist ) * .5;
			            var offsetZ = ( diff * _dz / _dist ) * .5;
			            _c0.pos.x -= offsetX;
			            _c0.pos.y -= offsetY;
			            _c0.pos.z -= offsetZ;
			            _c1.pos.x += offsetX;
			            _c1.pos.y += offsetY;
			            _c1.pos.z += offsetZ;
					} else {
			            var offsetX = _dx / _dist * .01 / _dist;
			            var offsetY = _dy / _dist * .01 / _dist;
			            var offsetZ = _dz / _dist * .01 / _dist;
			            _c0.pos.x += offsetX;
			            _c0.pos.y += offsetY;
			            _c0.pos.z += offsetZ;
			            _c1.pos.x -= offsetX;
			            _c1.pos.y -= offsetY;
			            _c1.pos.z -= offsetZ;
					}
					
				}
			}


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

