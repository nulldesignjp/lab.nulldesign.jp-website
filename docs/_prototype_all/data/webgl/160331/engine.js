/*
	engine.js
*/

(function(){

		//	基本設定
		var _world = new world('webglView');
		_world.camera.position.z = 500;
		_world.controls.autoRotate = true;
		_world.controls.minDistance = 1.0;
		_world.controls.maxDistance = 3200;

		var _clock = new THREE.Clock( true );
		_clock.start();


		var _simplexNoiseX = new SimplexNoise();
		var _simplexNoiseY = new SimplexNoise();
		var _simplexNoiseZ = new SimplexNoise();

		var _isLoaded = false;
		var _particle;
		var _count = 0;
		
		/*
			この辺りに今日は色々書きます。
		*/



		_world.add( new THREE.AxisHelper( 500 ) );

		//	Texture
		var _loader = new THREE.TextureLoader();
		//	_loader.load(	_filePath, success, progress, error );
		var _onSuccess = function(texture){	_nextStep( texture );	}
		var _onProgress = function(e){}
		var _onError = function(e){}
		_loader.load('circle1.png', _onSuccess, _onProgress, _onError );

		//	_nextStep
		function _nextStep( e )
		{
			var _geometry = new THREE.Geometry();

			for( var i = 0; i < 256*256; i++ )
			{
				var _x = ( Math.random()-.5)*100;
				var _y = ( Math.random()-.5)*100;
				var _z = ( Math.random()-.5)*100;
				_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
			}

			var _material = new THREE.PointsMaterial({
				map: e,
				transparent: true,
				depthTest: false,
				depthWrite: false,
				blending: THREE.AdditiveBlending,
				color: 0xCC3333
			});
			_particle = new THREE.Points( _geometry, _material );
			_world.add( _particle );

			_isLoaded = true;

			console.log( _clock );
		}





		//	LOOPでレンダリング
		(function loop(){
			window.requestAnimationFrame( loop );
			_clock.getDelta();

			if( !_isLoaded ){	return;	}


			//var _scale = _dataList[16] * 0.016 + 0.0001;
			//var _speed = _dataList[17] * 5.0 + 0.05;
			//var _grav = _dataList[18] * 0.02 + 0.98;


			var _scale = 0.01;
			var _speed = 10.0;
			var _grav = 0.98;
			_particle.material.size = 2.0;

			var len = _particle.geometry.vertices.length;

			var _theTime = _clock.elapsedTime * 100 * _scale;

			while( len )
			{
				len --;
				var _vertex = _particle.geometry.vertices[len];
				_vertex.x += _simplexNoiseX.noise( _vertex.y * _scale + _theTime, _vertex.z * _scale ) * _speed;
				_vertex.y += _simplexNoiseY.noise( _vertex.z * _scale + _theTime, _vertex.x * _scale ) * _speed;
				_vertex.z += _simplexNoiseZ.noise( _vertex.x * _scale + _theTime, _vertex.y * _scale ) * _speed;

				// _vertex.x *= _grav;
				// _vertex.y *= _grav;
				// _vertex.z *= _grav;

				//_vertex.x += 10;


				if( _vertex.x < - 800 )
				{
					_vertex.x = 800;
				} else if( _vertex.x > 800 )
				{
					//_vertex.x = -800;
					_vertex.x = rnd() * 10;
					_vertex.y = rnd() * 10;
					_vertex.z = rnd() * 10;
				}
				if( _vertex.y < -400 )
				{
					_vertex.y = 400;
				} else if( _vertex.y > 400 )
				{
					_vertex.y = - 400;
				}
				if( _vertex.z < -300 )
				{
					_vertex.z = 300;
				} else if( _vertex.z > 300 )
				{
					_vertex.z = - 300;
				}

			}

			var len = 1024;
			for( var i = 0; i < len; i++ )
			{
				var _vertex = _particle.geometry.vertices.pop();
				var _scale = Math.random();

				var phi = Math.acos( - 1 + ( 2 * i ) / len );
				var theta = Math.sqrt( len * Math.PI ) * phi;

				_vertex.x = 8 * Math.cos( theta ) * Math.sin( phi ) * _scale;
				_vertex.y = 8 * Math.sin( theta ) * Math.sin( phi ) * _scale;
				_vertex.z = 8 * Math.cos( phi ) * _scale;

				_particle.geometry.vertices.unshift( _vertex );
			}



			_particle.geometry.verticesNeedUpdate = true;


		})();
})();

	function rnd()
	{
		return Math.random()*2-1;
	}