var boids = (function( _list, _rect ){

	/*
		_list: Array three.mesh
		_rect:Object	{x:0,y:0,z:0,w:100,h:100,d:100}
	*/

	var _birdList = [];

	var _boids = function( _list, _rect )
	{
		var len = _list.length;
		for( var i = 0; i < len; i++ )
		{
			_birdList[i] = {};
			_birdList[i].mesh = _list[i];
			_birdList[i].mesh.position.x = Math.random() * _rect.w + _rect.x;
			_birdList[i].mesh.position.y = Math.random() * _rect.h + _rect.y;
			_birdList[i].mesh.position.z = Math.random() * _rect.d + _rect.z;
			_birdList[i].vector = {};
			_birdList[i].vector.x = 0;
			_birdList[i].vector.y = 0;
			_birdList[i].vector.z = 0;
		}
		_boids.rect = _rect;
	}
	_boids.rect;
	_boids.maxSpeed = 6;
	_boids.dist = 100;
	_boids.prototype = {
		update	:	function()
		{
			/*
分離（Separation）
鳥オブジェクトが他の鳥オブジェクトとぶつからないように距離をとる。
整列（Alignment）
鳥オブジェクトが他の鳥オブジェクトと概ね同じ方向に飛ぶように速度と方向を合わせる。
結合（Cohesion）
鳥オブジェクトが他の鳥オブジェクトが集まっている群れの中心方向へ向かうように方向を変える。
			*/
			this.role01();
			this.role02();
			this.role03();

			var len = _birdList.length;
			for( var i = 0; i < len; i++ )
			{
				var _b0 = _birdList[i];
				var _speed = Math.sqrt( _b0.vector.x * _b0.vector.x + _b0.vector.y * _b0.vector.y + _b0.vector.z * _b0.vector.z )
				if( _speed > _boids.maxSpeed )
				{
					_b0.vector.x *= _boids.maxSpeed / _speed;
					_b0.vector.y *= _boids.maxSpeed / _speed;
					_b0.vector.z *= _boids.maxSpeed / _speed;
				}

				_b0.mesh.position.x += _b0.vector.x;
				_b0.mesh.position.y += _b0.vector.y;
				_b0.mesh.position.z += _b0.vector.z;

				/*
				if( _b0.mesh.position.x < _boids.rect.x && _b0.vector.x < 0 ){	_b0.vector.x *= -1;	}
				if( _b0.mesh.position.x > _boids.rect.x + _boids.rect.w && _b0.vector.x > 0 ){	_b0.vector.x *= -1;	}
				if( _b0.mesh.position.y < _boids.rect.y && _b0.vector.y < 0 ){	_b0.vector.y *= -1;	}
				if( _b0.mesh.position.y > _boids.rect.y + _boids.rect.h && _b0.vector.y > 0 ){	_b0.vector.y *= -1;	}
				if( _b0.mesh.position.z < _boids.rect.z && _b0.vector.z < 0 ){	_b0.vector.z *= -1;	}
				if( _b0.mesh.position.z > _boids.rect.z + _boids.rect.d && _b0.vector.z > 0 ){	_b0.vector.z *= -1;	}
				*/

				var _accell = 0.2;
				if( _b0.mesh.position.x < _boids.rect.x && _b0.vector.x < 0 ){	_b0.vector.x += _accell;	}
				if( _b0.mesh.position.x > _boids.rect.x + _boids.rect.w && _b0.vector.x > 0 ){	_b0.vector.x -= _accell;	}
				if( _b0.mesh.position.y < _boids.rect.y && _b0.vector.y < 0 ){	_b0.vector.y += _accell;	}
				if( _b0.mesh.position.y > _boids.rect.y + _boids.rect.h && _b0.vector.y > 0 ){	_b0.vector.y -= _accell;	}
				if( _b0.mesh.position.z < _boids.rect.z && _b0.vector.z < 0 ){	_b0.vector.z += _accell;	}
				if( _b0.mesh.position.z > _boids.rect.z + _boids.rect.d && _b0.vector.z > 0 ){	_b0.vector.z -= _accell;	}

				_b0.mesh.rotation.x = Math.atan2( _b0.vector.y, _b0.vector.z ) + THREE.Math.degToRad(90);
				_b0.mesh.rotation.y = Math.atan2( _b0.vector.x, _b0.vector.z ) + THREE.Math.degToRad(90);
				_b0.mesh.rotation.z = THREE.Math.degToRad(-45);

			}

			//console.log( _birdList[0].vector.x )

		},
		role01	:	function()
		{
			var _accellScale = 0.001;
			var len = _birdList.length;
			for( var i = 0; i < len - 1; i++ )
			{
				var _b0 = _birdList[i];
				for( var j = i + 1; j < len; j++ )
				{
					var _b1 = _birdList[j];

					if( _b0 != _b1 )
					{
						var _dx = _b0.mesh.position.x - _b1.mesh.position.x;
						var _dy = _b0.mesh.position.y - _b1.mesh.position.y;
						var _dz = _b0.mesh.position.z - _b1.mesh.position.z;

						var _dist = Math.sqrt( _dx * _dx + _dy * _dy + _dz * _dz );
						if( _dist < _boids.dist )
						{
							_b0.vector.x += _dx / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
							_b0.vector.y += _dy / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
							_b0.vector.z += _dz / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
							_b1.vector.x -= _dx / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
							_b1.vector.y -= _dy / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
							_b1.vector.z -= _dz / _dist * ( _boids.dist - _dist ) * 0.5 * _accellScale;
						}
					}
				}
			}
		},
		role02	:	function()
		{
			var _vec = {x:0,y:0,z:0};
			var len = _birdList.length;
			for( var i = 0; i < len; i++ )
			{
				var _b0 = _birdList[i];
				_vec.x += _b0.vector.x;
				_vec.y += _b0.vector.y;
				_vec.z += _b0.vector.z;
			}

			_vec.x /= len;
			_vec.y /= len;
			_vec.z /= len;

			var _speedScale = 0.02;
			for( var i = 0; i < len; i++ )
			{
				var _b0 = _birdList[i];
				_b0.vector.x += _vec.x * _speedScale;
				_b0.vector.y += _vec.y * _speedScale;
				_b0.vector.z += _vec.z * _speedScale;
			}
		},
		role03	:	function()
		{
			var _pos = {x:0,y:0,z:0};
			var len = _birdList.length;
			for( var i = 0; i < len; i++ )
			{
				var _b0 = _birdList[i];
				_pos.x += _b0.mesh.position.x;
				_pos.y += _b0.mesh.position.y;
				_pos.z += _b0.mesh.position.z;
			}

			_pos.x /= len;
			_pos.y /= len;
			_pos.z /= len;

			var _posScale = 0.0001;
			for( var i = 0; i < len; i++ )
			{
				var _b0 = _birdList[i];
				_b0.vector.x += ( _pos.x - _b0.mesh.position.x ) * _posScale;
				_b0.vector.y += ( _pos.y - _b0.mesh.position.y ) * _posScale;
				_b0.vector.z += ( _pos.z - _b0.mesh.position.z ) * _posScale;
			}
		}
	}
	return _boids;

})();