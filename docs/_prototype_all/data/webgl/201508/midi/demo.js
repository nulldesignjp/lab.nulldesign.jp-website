/*
	midi_lpd8.js
*/

(function(){

	//	prop
	var midi, data;
	var scene, camera, focus, renderer;
	var container;
	var particle;
	var cube;
	var _simplexNoiseX,_simplexNoiseY,_simplexNoiseZ;
	var time;
	var timeSpeed;

	var _scale = 0.1;
	var _size = 100;
	var _hsize = _size * 0.5;
	var _frection = 0.96;
	var _particleAccell = 0.001;
	var _speed = 0.12;
	var _random = 0;

	var _tr = Math.random();
	var _tg = Math.random();
	var _tb = Math.random();
	var _r = _tr;
	var _g = _tg;
	var _b = _tb;

	var _rotX = 0;
	var _rotY = 0;
	var _rotZ = 0;


	//	start
	initMidi();

	//	method
	function initMidi()
	{
		if( navigator.requestMIDIAccess ) 
		{
			//	
			createThreeJS();

			//	ok.
			navigator.requestMIDIAccess({
				sysex: false
			}).then( onMIDISuccess, onMIDIFailure );


		} else
		{
			alert("No MIDI support in your browser.");
			return;
		}
	}

	// midi functions
	function onMIDISuccess( midiAccess )
	{
		// when we get a succesful response, run this code
		midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
		var inputs = midi.inputs.values();
		// loop over all available inputs and listen for any MIDI input
		for (var input = inputs.next(); input && !input.done; input = inputs.next() )
		{
			// each time there is a midi message call the onMIDIMessage function
			input.value.onmidimessage = onMIDIMessage;
			listInputs(input);
		}
	}

	function onMIDIFailure( error )
	{
		// when we get a failed response, run this code
		console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
	}

	function onMIDIMessage( message )
	{
		var data = message.data;
		var cmd = data[0] >> 4;
		var channel = data[0] & 0xf;
		var type = data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
		var note = data[1];
		var velocity = data[2];

		console.log('cmd:' + cmd, 'channel:' + channel, 'type:' + type, 'note:' + note, 'velocity:' + velocity);
		$('#inputData').text('cmd:' + cmd + ' channel:' + channel + ' type:' + type + ' note:' + note + ' velocity:' + velocity);
		// with pressure and tilt off
		// note off: 128, cmd: 8 
		// note on: 144, cmd: 9
		// pressure / tilt on
		// pressure: 176, cmd 11: 
		// bend: 224, cmd: 14

// switch (type) {
// case 144: // noteOn message 
// noteOn(note, velocity);
// break;
// case 128: // noteOff message 
// noteOff(note, velocity);
// break;
// }

		data = message.data; // this gives us our [command/channel, note, velocity] data.
		console.log('MIDI data', data); // MIDI data [144, 63, 73]

		//	TSUMAMI
		if( data[0] == 176 )
		{
			var _no = data[1] - 1;
			var _value = data[2] / 127;

			if( _no == 0 )
			{
				_scale = _value * 3.0 + 0.001;
			}

			if( _no == 1 )
			{
				_size = _value * 200 + 50;
				_hsize = _size * 0.5;

				cube.scale.set(_size/100,_size/100,_size/100)
			}

			if( _no == 2 )
			{
				_frection = _value * 0.4 + 0.6;
			}

			if( _no == 3 )
			{
				_speed = _value * 0.3 + 0.01;
			}

			if( _no == 4 )
			{
				_random = _value * 0.1;
			}

			if( _no == 5 )
			{
				timeSpeed = _value * 3.0;
			}

			if( _no == 6 )
			{
				_rotX = _value * Math.PI * 2 - Math.PI;
			}

			if( _no == 7 )
			{
				_rotY = _value * Math.PI * 2 - Math.PI;
			}

		}


		if( data[0] == 144 )
		{
			var _no = data[1] - 36;
			var _value = data[2] / 127;

			if( _no == 0 )
			{
				_simplexNoiseX = new SimplexNoise();
				_simplexNoiseY = new SimplexNoise();
				_simplexNoiseZ = new SimplexNoise();
				return;
			}
			if( _no == 1 )
			{
				particle.material.size = Math.floor( Math.random() * 5 ) + 1;
				return;
			}

			_tr = Math.random();
			_tg = Math.random();
			_tb = Math.random();
		}

	}
	function listInputs( inputs )
	{
		var input = inputs.value;
		console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
		"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
		"' version: '" + input.version + "']");
	}

	//
	function createThreeJS()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 400, 800 );

		focus = new THREE.Vector3( 0, 0, 0 );

		camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 800);
		camera.position.set(0, 0, 300);
		camera.lookAt(focus);

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(0x000000, 1);
		renderer.setSize(_width, _height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = false;

		document.getElementById('container').appendChild(renderer.domElement);

		//
		time = 0;
		timeSpeed = 0.1;

		container = new THREE.Group();
		scene.add(container);

		//
		cube = _createBox();
		container.add(cube);

		//
		_simplexNoiseX = new SimplexNoise();
		_simplexNoiseY = new SimplexNoise();
		_simplexNoiseZ = new SimplexNoise();
		var geometry = new THREE.Geometry();
		geometry.vector = [];
		for( var i = 0; i < 30000; i++ )
		{
			geometry.vertices[i] = new THREE.Vector3(rnd()*100,rnd()*100,rnd()*100);
			geometry.vector[i] = new THREE.Vector3(0,0,0);
		}
		var material = new THREE.PointCloudMaterial({
			color: new THREE.Color(_r,_g,_b),
			size: 3,
			transparent: true,
			opacity: 0.9,
			blending: THREE.AdditiveBlending
		});
		particle = new THREE.PointCloud(geometry,material);
		container.add(particle);


		//	event
		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			camera.aspect = _width / _height;
			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );
		}, false );

		//	start
		render();

	}

	function render()
	{
		time = (time+timeSpeed)|0;

		container.rotation.x += ( _rotX - cube.rotation.x ) * 0.01;
		container.rotation.y += ( _rotY - cube.rotation.y ) * 0.01;
		container.rotation.z += ( _rotZ - cube.rotation.z ) * 0.01;

		_r += ( _tr - _r ) * 0.01;
		_g += ( _tg - _g ) * 0.01;
		_b += ( _tb - _b ) * 0.01;

		particle.material.color = new THREE.Color( _r,_g,_b );

		var len = particle.geometry.vertices.length;
		while( len )
		{
			len = (len-1)|0;
			var _pos = particle.geometry.vertices[len];
			var _vec = particle.geometry.vector[len];
			var _vx = _simplexNoiseX.noise((_pos.z + _hsize + time) / _size * _scale, (_pos.y + _hsize + time) / _size * _scale) * _speed;
			var _vy = _simplexNoiseY.noise((_pos.x + _hsize + time) / _size * _scale, (_pos.z + _hsize + time) / _size * _scale) * _speed;
			var _vz = _simplexNoiseZ.noise((_pos.y + _hsize + time) / _size * _scale, (_pos.x + _hsize + time) / _size * _scale) * _speed;
			_vec.x += _vx;
			_vec.y += _vy;
			_vec.z += _vz;

			_vec.x += rnd()*_random;
			_vec.y += rnd()*_random;
			_vec.z += rnd()*_random;

			_pos.x += _vec.x;
			_pos.y += _vec.y;
			_pos.z += _vec.z;

			//	frection
			_vec.x *= _frection;
			_vec.y *= _frection;
			_vec.z *= _frection;

			//	pseudo grav
			_pos.x += ( 0 - _pos.x ) * _particleAccell;
			_pos.y += ( 0 - _pos.y ) * _particleAccell;
			_pos.z += ( 0 - _pos.z ) * _particleAccell;

			//	
			_pos.x = _pos.x < -_hsize?_hsize:_pos.x > _hsize?-_hsize:_pos.x;
			_pos.y = _pos.y < -_hsize?_hsize:_pos.y > _hsize?-_hsize:_pos.y;
			_pos.z = _pos.z < -_hsize?_hsize:_pos.z > _hsize?-_hsize:_pos.z;
		}

		particle.geometry.verticesNeedUpdate = true;

		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	}

	function rnd()
	{
		return Math.random()*2-1;
	}

	function _createBox()
	{
		var _cube = new THREE.Group();
		var _material = new THREE.LineBasicMaterial({linewidth:1,color: 0xFFFFFF,transparent:true,opacity: 1.0});
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,_hsize,_hsize );
		_geometry.vertices[2] = new THREE.Vector3( -_hsize,_hsize,-_hsize );
		_geometry.vertices[3] = new THREE.Vector3( _hsize,_hsize,-_hsize );
		_geometry.vertices[4] = new THREE.Vector3( _hsize,_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,_hsize );
		_geometry.vertices[2] = new THREE.Vector3( -_hsize,-_hsize,-_hsize );
		_geometry.vertices[3] = new THREE.Vector3( _hsize,-_hsize,-_hsize );
		_geometry.vertices[4] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( -_hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( -_hsize,_hsize,-_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,-_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,-_hsize );
		_geometry.vertices[1] = new THREE.Vector3( _hsize,-_hsize,-_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );

		return _cube;
	}
})();