/*
	libs2.js
*/

var cEdge = (function(){

	function cEdge( e )
	{
		this.world;
		this.sound;
		this.isLoaded;
		this.init();

		//
		this.icos;
		this.icos2;
		this.points;

		//
		//	16Hz,32Hz,64Hz,125Hz,250hz,500Hz,1k,2k,4k,8k,16k,32k,
		this.sp = [0,0,0,0,0,0,0,0,0,0,0,0];
	}

	cEdge.prototype = 
	{
		init : function()
		{
			this.world = new world('webglView');
			this.world.camera.position.z = 1000;
			this.world.controls.autoRotate = false;
			this.world.renderer.setClearColor( 0xFFFFFF );
			this.world.scene.fog.color = new THREE.Color( 255,255,255 );

			this.sound = new soundAnalyser();
			this.sound.setDragAndDrop( 'webglView' );
			this.sound.setInputFile( 'inputAudio' );

			this.isLoaded = false;


			//	BG
			var _uniforms = {
				resolution: {type:'v2', value: new THREE.Vector2()	}
			};
			_uniforms.resolution.value.x = window.innerWidth;
			_uniforms.resolution.value.y = window.innerHeight;

			window.addEventListener( 'resize',function(){
				_uniforms.resolution.value.x = window.innerWidth;
				_uniforms.resolution.value.y = window.innerHeight;
			})

			var _geometry = new THREE.PlaneBufferGeometry( 100,100 );
			var _material = new THREE.ShaderMaterial({
				uniforms: _uniforms,
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				transparent: true
			});
			this.bg = new THREE.Mesh( _geometry, _material );
			this.world.add( this.bg );
			this.bg.position.z = - 1000;

			this.cubes = [];
			// for( var i = 0; i < 11; i++ )
			// {
			// 	var _geometry = new THREE.BoxGeometry( 30,100,30 );
			// 	var _material = new THREE.MeshBasicMaterial({wireframe:true,color:0x00CC00});
			// 	var _cube = new THREE.Mesh( _geometry, _material );
			// 	_cube.position.set( (i-6)*50, 0, 0 )
			// 	this.world.add( _cube );
			// 	this.cubes[i] = _cube;
			// }

			this.cubes2 = [];
			// for( var i = 0; i < 11; i++ )
			// {
			// 	var _geometry = new THREE.BoxGeometry( 30,100,30 );
			// 	var _material = new THREE.MeshBasicMaterial({wireframe:true,color:0x0000CC});
			// 	var _cube = new THREE.Mesh( _geometry, _material );
			// 	_cube.position.set( (i-6)*50, 0, 0 )
			// 	this.world.add( _cube );
			// 	this.cubes2[i] = _cube;
			// }


			$( this.sound ).on( soundAnalyser.COMPLETE, _success );
			$( this.sound ).on( soundAnalyser.ERROR, _error );

			var _t = this;
			function _success()
			{
				console.log('LoadFileComplete!!!');

				$('#intro').addClass('hide');

				$('#title').text( _t.sound.file.name );
				$('#current').text( '0' );
				$('#total').text( Math.floor( _t.sound.audioBuffer.duration * 100 ) / 100 );
				$('#filter').text( 'LOWPASS' );
				$('#sampleRate').text( _t.sound.context.sampleRate + ' Hz');
				$('#decibels').text( 'Max. ' + _t.sound.analyser.maxDecibels + ' Min. ' + _t.sound.analyser.minDecibels );


				var _geometry = new THREE.IcosahedronGeometry( 60, 1 );
				var _material = new THREE.MeshBasicMaterial({wireframe:true,color:0x666666});
				_t.icos = new THREE.Mesh( _geometry, _material );
				_t.world.add( _t.icos );

				var _geometry = new THREE.IcosahedronGeometry( 300, 0 );
				var _material = new THREE.MeshBasicMaterial({wireframe:true,color:0xCCCCCC});
				_t.icos2 = new THREE.Mesh( _geometry, _material );
				_t.world.add( _t.icos2 );

				var _loader = new THREE.TextureLoader();
				_loader.load( 'img/circle0.png',function(texture){

					var _len = 3000;

					var _geometry = new THREE.BufferGeometry();
					var _vertices = new Float32Array( _len * 3 );
					var _accell = new Float32Array( _len * 3 );
					var _randomSize = new Float32Array( _len );
					for( var i = 0; i < _len; i++ )
					{
						var _rad0 = Math.random() * Math.PI * 2;
						var _rad1 = Math.random() * Math.PI * 2;
						var _r = ( 1.0 - Math.random() * Math.random() ) * 1000 + 300;
						var _x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * _r;
						var _y = Math.sin( _rad0 ) * _r;
						var _z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * _r;

						//	position
						_vertices[ i*3 + 0 ] = _x;
						_vertices[ i*3 + 1 ] = _y;
						_vertices[ i*3 + 2 ] = _z;

						//	accell
						var _a = Math.random() * 4.0 - 1.0;
						_accell[ i*3 + 0 ] = _x * _a;
						_accell[ i*3 + 1 ] = _y * _a;
						_accell[ i*3 + 2 ] = _z * _a;

						_randomSize[ i ] = Math.random() * 0.99 + 0.01;
					}

					_geometry.addAttribute( 'position', new THREE.BufferAttribute( _vertices, 3 ) );
					_geometry.addAttribute( 'accell', new THREE.BufferAttribute( _accell, 3 ) );
					_geometry.addAttribute( 'randomSize', new THREE.BufferAttribute( _randomSize, 1 ) );

					var _material = new THREE.PointsMaterial({color:0x000000,map:texture,transparent:true,opacity:0.5,depthTest:false});

					var _uniforms = {
						volume: {type:'f', value: 1.0	},
						resolution: {type:'v2', value: new THREE.Vector2()	},
						camera: {type:'v3', value: _t.world.camera.position },
						texture: {type:'t', value: texture }
					};
					_uniforms.resolution.value.x = window.innerWidth;
					_uniforms.resolution.value.y = window.innerHeight;
					var _material = new THREE.ShaderMaterial({
						uniforms: _uniforms,
						vertexShader: document.getElementById('pv01').textContent,
						fragmentShader: document.getElementById('pf01').textContent,
						transparent: true,
						depthTest: false
					});
					_t.points = new THREE.Points( _geometry, _material );
					_t.world.add( _t.points );
				});

				_t.loop();
				_t.isLoaded = true;
			}
			function _error()
			{
				console.log('LoadFileError!!!')
			}

		},
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			if( !this.isLoaded ){	return;	}

			if( this.sound.audioBuffer )
			{
				var _current = this.sound.context.currentTime % this.sound.audioBuffer.duration;
				$('#current').text( Math.floor( _current * 100 ) / 100 );
			}

			var _times = this.sound.getFloatFrequencyData();
			var len = _times.length;
			var _sum = 0;
			for( var i = 0; i < len; i++ )
			{
				_sum += _times[i];
			}
			_sum /= len;
			_sum = ( 255 + _sum ) / 255;
			_sum = _sum<=0?0.01:_sum;
			this.icos2.scale.set( _sum, _sum, _sum );


			// var _times = this.sound.getByteFrequencyData();
			// var len = _times.length;
			// var _sum = 0;
			// for( var i = 0; i < len * 0.5; i++ )
			// {
			// 	_sum += _times[i];
			// }
			// _sum /= len * 0.5;
			// _sum /= 255;
			// _sum = _sum<=0?0.01:_sum;
			// this.icos2.scale.set( _sum, _sum, _sum );

			var _sum = 0;
			for( var i = Math.floor( len * 0.5 ); i < len; i++ )
			{
				_sum += _times[i];
			}
			_sum /= len * 0.5;
			_sum /= 255;

			this.points.material.uniforms.volume.value = _sum;


			// Frequency resolution
			var fsDivN = this.sound.context.sampleRate / this.sound.analyser.fftSize;

			// This value is the number of samples during 500 Hz
			var n500Hz = Math.floor( 500 / fsDivN );
			var _span = [
				Math.floor( 16 / fsDivN ),
				Math.floor( 32 / fsDivN ),
				Math.floor( 64 / fsDivN ),
				Math.floor( 125 / fsDivN ),
				Math.floor( 250 / fsDivN ),
				Math.floor( 500 / fsDivN ),
				Math.floor( 1000 / fsDivN ),
				Math.floor( 2000 / fsDivN ),
				Math.floor( 4000 / fsDivN ),
				Math.floor( 8000 / fsDivN ),
				Math.floor( 16000 / fsDivN ),
				Math.floor( 32000 / fsDivN ),
				Math.floor( 64000 / fsDivN ),
			];
			var _min = 10;
			var _max = -10;	
			var _volumes = [0,0,0,0,0,0,0,0,0,0,0,0];
			var _index = 0;
			var _count = 0;

			this.sound.analyser.minDecibels = -50;  // Default -100 dB
       		this.sound.analyser.maxDecibels =    -10;  // Default  -30 dB

			// var range = this.sound.analyser.maxDecibels - this.sound.analyser.minDecibels;  // 70 dB
			// var _times = this.sound.getFloatFrequencyData();
			// var len = _times.length;
			// var _sum = 0;
			// for( var i = 0; i < len; i++ )
			// {
			// 	if( i > _span[ _index ] )
			// 	{
			// 		_volumes[ _index ] /= _count;

			// 		this.cubes[_index].scale.set( 1,_volumes[ _index ],1);
			// 		this.cubes[_index].position.y = - _volumes[ _index ] * 50;

			// 		_count = 0;
			// 		_index ++;
			// 	}
				
			// 	//var y = ( _times[i] - this.sound.analyser.maxDecibels) / range;  // 0 - 1
			// 	var y = -1 * ((_times[i] - this.sound.analyser.maxDecibels) / range) * 1.0;
			// 	_volumes[ _index ] += y;
			// 	_count ++;

			// 	_min = y<_min?y:_min;
			// 	_max = y>_max?y:_max;

			// }



			// var _volumes = [0,0,0,0,0,0,0,0,0,0,0,0];
			// var _index = 0;
			// var _count = 0;
			// var _times = this.sound.getByteFrequencyData();
			// var len = _times.length;
			// var _sum = 0;
			// for( var i = 0; i < len; i++ )
			// {
			// 	if( i <= _span[ _index ] )
			// 	{
			// 		_volumes[ _index ] += _times[i] / 255;
			// 	} else {
			// 		_volumes[ _index ] /= _count;

			// 		this.cubes2[_index].scale.set( 1,_volumes[ _index ],1);
			// 		this.cubes2[_index].position.y = _volumes[ _index ] * 50;

			// 		_count = 0;
			// 		_index ++;

			// 		_volumes[ _index ] += _times[i] / 255;
			// 	}
			// 	_count ++;
			// }

			this.icos.rotation.x += 0.01;
			this.icos.rotation.y += 0.01;
			this.icos.rotation.z += 0.01;

			this.icos2.rotation.x += 0.005;
			this.icos2.rotation.y -= 0.005;
			this.icos2.rotation.z -= 0.0015;

			this.points.rotation.x -= 0.001;
			this.points.rotation.y += 0.001;
			this.points.rotation.z += 0.001;


		}
	};

	return cEdge;

})();

new cEdge();

function createLine( segment, obj )
{
	var _geometry = new THREE.Geometry();
	for( var i = 0; i < segment; i++ )
	{
		var _x = i - segment * 0.5;
		_geometry.vertices[i] = new THREE.Vector3( _x, 0, 0 );
	}
	var _material = new THREE.LineBasicMaterial( obj );
	return new THREE.Line( _geometry, _material );
}