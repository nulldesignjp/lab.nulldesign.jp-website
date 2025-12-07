/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.controls.autoRotate = false;
		this.world.camera.position.z = 500;

		this.radius = 300;
		this.radius0 = 64;
		this.outerCircle;
		this.circles = [];

		var _geometry = new THREE.CircleGeometry(this.radius,72);
		var _material = new THREE.MeshBasicMaterial({color: 0x000000 });
		this.outerCircle = new THREE.Mesh( _geometry, _material );
		this.world.add( this.outerCircle );


		for( var i = 0; i < 32; i++ )
		{
			var _radius0 = Math.floor( Math.random() * this.radius0 ) + 3;
			var _geometry = new THREE.CircleGeometry(_radius0,72);
			var _material = new THREE.MeshBasicMaterial({color: 0xFFFFFF });
			var _circle = new THREE.Mesh( _geometry, _material );

			var _rad = Math.random() * Math.PI * 2;
			var _r = Math.random() * this.radius;
			_circle.position.x = Math.cos( _rad ) * _r;
			_circle.position.y = Math.sin( _rad ) * _r;
			_circle.position.z = 20;
			this.world.add( _circle );

			var _obj = {};
			_obj.mesh = _circle;
			_obj.pos = new THREE.Vector3().copy( _circle.position );
			_obj.ppos = new THREE.Vector3().copy( _circle.position );
			_obj.vector = new THREE.Vector3();
			_obj.radius = _radius0;

			this.circles.push( _obj );
		}

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var _l = _t.circles;
			var len = _l.length;
			for( var i = 0; i < len; i++ )
			{
				var _c = _l[i];

				//	to center
				// var _dx = _c.pos.x;
				// var _dy = _c.pos.y;
				// var _dz = _c.pos.z;
				// var _d = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
				// _d = _d<_c.radius?_c.radius:_d;
				// var _pow = _c.radius / _d;
				// var _x = _dx / _d * _pow;
				// var _y = _dy / _d * _pow;
				// var _z = _dz / _d * _pow;
				// _c.pos.x -= _x;
				// _c.pos.y -= _y;
				// _c.pos.z -= _z;

				//	grav
				_c.pos.y -= 1.0;

				var tempX = _c.pos.x;
				var tempY = _c.pos.y;
				//var tempZ = _c.pos.z;

				_c.vector.x = _c.pos.x - _c.ppos.x;
				_c.vector.y = _c.pos.y - _c.ppos.y;
				//_c.vector.z = _c.pos.z - _c.ppos.z;

				_c.pos.x += _c.vector.x;
				_c.pos.y += _c.vector.y;
				//_c.pos.z += _c.vector.z;
				_c.ppos.x = tempX;
				_c.ppos.y = tempY;
				//_c.ppos.z = tempZ;

				_c.mesh.position.x = _c.pos.x;
				_c.mesh.position.y = _c.pos.y;
				//_c.mesh.position.z = _c.pos.z;
			}

			for( var i = 0; i < len-1; i++ )
			{
				var _c0 = _l[i];
				for( var j = i + 1; j < len; j++ )
				{
					var _c1 = _l[j];
					var _dx = _c1.pos.x - _c0.pos.x;
					var _dy = _c1.pos.y - _c0.pos.y;
					//var _dz = _c1.pos.z - _c0.pos.z;
					var _rDist = _c0.radius * _c0.mesh.scale.x + _c1.radius * _c1.mesh.scale.x;
					//var _dist = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
					var _dist = Math.sqrt( _dx * _dx + _dy * _dy );
			            
					if( _rDist > _dist )
					{
			            var diff = _rDist - _dist;
			            var offsetX = ( diff * _dx / _dist ) * .5;
			            var offsetY = ( diff * _dy / _dist ) * .5;
			            //var offsetZ = ( diff * _dz / _dist ) * .5;
			            _c0.pos.x -= offsetX;
			            _c0.pos.y -= offsetY;
			            //_c0.pos.z -= offsetZ;
			            _c1.pos.x += offsetX;
			            _c1.pos.y += offsetY;
			            //_c1.pos.z += offsetZ;
					} else {
			            var offsetX = _dx / _dist * .01 / _dist;
			            var offsetY = _dy / _dist * .01 / _dist;
			            //var offsetZ = _dz / _dist * .01 / _dist;
			            _c0.pos.x += offsetX;
			            _c0.pos.y += offsetY;
			            //_c0.pos.z += offsetZ;
			            _c1.pos.x -= offsetX;
			            _c1.pos.y -= offsetY;
			            //_c1.pos.z -= offsetZ;
					}
				}
			}

			//
			for( var i = 0; i < len; i++ )
			{
				var _c0 = _l[i];

				var _d = _c0.pos.length();
				var _r = _t.radius - _c0.radius;
				if( _d > _r )
				{
					_c0.pos.normalize();
					_c0.pos.multiplyScalar ( _r );
					//_c0.ppos.copy( _c0.pos );
				}
			}
		}
	}



	return Practice;
})();

var _pr = new Practice();

