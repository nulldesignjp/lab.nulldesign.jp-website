/*
	midi_lpd8.js
*/

(function(){

	//	prop
	var midi, data;
	var scene, camera, focus, renderer;
	var _progList = [];
	var _padList = [];
	var _tsumamiList = [];


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
			//_value = _value<0?0:_value;
			_tsumamiList[_no].scale.y = _value<=0?0.01:_value;
			_tsumamiList[_no].position.y = 50 * 0.5 * _value;


			//	X
			if( _no == 0 )
			{
				camera.position.x = data[2] / 127 * 400 - 200;
			}
			//	Y
			if( _no == 1 )
			{
				camera.position.y = data[2] / 127 * 100 + 10;
			}
			//	z
			if( _no == 2 )
			{
				camera.position.z = data[2] / 127 * 200 + 50;
			}
			//	z
			if( _no == 3 )
			{
				camera.fov = data[2]/127 * 118 + 12;
				camera.updateProjectionMatrix();
			}
		}

		if( data[0] == 192 )
		{
			var len = 	_progList.length;
			while( len )
			{
				len --;
				_progList[len].material.color = new THREE.Color(1,1,1);
			}

			var _no = data[1];
			_progList[_no].material.color = new THREE.Color(1.0, 0.0, 0.0);
		}

		if( data[0] == 144 )
		{
			//	36,37,38,39,40,41,42,43
			var _no = data[1] - 36;
			_padList[_no].material.color = new THREE.Color(data[2]/127, 0.0, 0.0);	
		}

		if( data[0] == 128 )
		{
			//	36,37,38,39,40,41,42,43
			var _no = data[1] - 36;
			_padList[_no].material.color = new THREE.Color(1.0, 1.0, 1.0);
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
		scene.fog = new THREE.Fog( 0x000000, 800, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 28000);
		camera.position.set(100, 100, 160);
		camera.lookAt(focus);

		var amb = new THREE.AmbientLight( 0x181818 );
		scene.add(amb);

		var _pl01 = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		_pl01.position.set( 100, 600, 200 );
		scene.add( _pl01 );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0x000000, 1);
		renderer.setSize(_width, _height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = false;

		document.getElementById('container').appendChild(renderer.domElement);

		//	content
		for( var i = 0; i < 8; i++ )
		{
			var _geometry = new THREE.BoxGeometry( 15,3,5,1,1,1 );
			var _material = new THREE.MeshLambertMaterial({transparent:true});
			var _mesh = new THREE.Mesh(_geometry,_material);
			_mesh.position.set( - 80 + i * 20, 0, - 30 );
			scene.add(_mesh);
			_progList.push( _mesh );
		}

		for( var i = 0; i < 8; i++ )
		{
			var _geometry = new THREE.BoxGeometry( 10,3,10,1,1,1 );
			var _material = new THREE.MeshLambertMaterial({transparent:true});
			var _mesh = new THREE.Mesh(_geometry,_material);
			_mesh.position.set( (i%4)*20 - 80, 0, -Math.floor(i/4)*20+10 );
			scene.add(_mesh);
			_padList.push( _mesh );
		}

		for( var i = 0; i < 8; i++ )
		{
			var _geometry = new THREE.BoxGeometry( 10,50,10,1,1,1 );
			var _material = new THREE.MeshLambertMaterial();
			var _mesh = new THREE.Mesh(_geometry,_material);
			_mesh.position.set( (i%4)*20, 0, Math.floor(i/4)*20-10 );
			_mesh.scale.set(1,0.01,1)
			scene.add(_mesh);
			_tsumamiList.push( _mesh );

			_material = new THREE.MeshLambertMaterial({transparent:true,opacity:0.2});
			var _mesh = new THREE.Mesh(_geometry,_material);
			_mesh.position.set( (i%4)*20, 25, Math.floor(i/4)*20-10 );
			scene.add(_mesh);
		}



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
		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	}
})();