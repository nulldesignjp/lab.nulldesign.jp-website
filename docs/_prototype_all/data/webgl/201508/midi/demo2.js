/*
	midi_lpd8.js
*/

(function(){

	//	prop
	var midi, data;
	var scene, camera, focus, renderer;
	var _plane;
	var time,timeSpeed;
	var _simplexNoiseX,_simplexNoiseY,_simplexNoiseZ;

	var _convexlist = [];
	var _camera,_focus;

	var _valueList = [0,1,0,0,0,0,0,0];

	var _particle;



	//	start
	initMidi();

	//	method
	function initMidi()
	{
		if( navigator.requestMIDIAccess ) 
		{

			createThreeJS();

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

		data = message.data; // this gives us our [command/channel, note, velocity] data.
		console.log('MIDI data', data); // MIDI data [144, 63, 73]

		//	TSUMAMI
		if( data[0] == 176 )
		{
			var _no = data[1] - 1;
			var _value = data[2] / 127;

			_valueList[_no] = _value;

		}

		if( data[0] == 192 )
		{
			_simplexNoiseX = new SimplexNoise();
			_simplexNoiseY = new SimplexNoise();
			_simplexNoiseZ = new SimplexNoise();
		}

		if( data[0] == 144 )
		{
			//	36,37,38,39,40,41,42,43
			var _no = data[1] - 36;
			var _value = data[2] / 127;
		}

		if( data[0] == 128 )
		{
			//	36,37,38,39,40,41,42,43
			var _no = data[1] - 36;
			var _value = data[2] / 127;
		}

	}
	function listInputs( inputs )
	{
		var input = inputs.value;
		console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
		"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
		"' version: '" + input.version + "']");
	}
	function createThreeJS()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		var _bg = 0x1b222c;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( _bg, 400, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		camera = new THREE.PerspectiveCamera( 45, _width / _height, 0.1, 1600);
		camera.position.set(0, 50, 400);
		camera.lookAt(focus);

		_camera = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
		_focus = new THREE.Vector3( focus.x, focus.y, focus.z );

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(_bg, 1);
		renderer.setSize(_width, _height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = true;
		renderer.shadowMapEnabled = true;

		document.getElementById('container').appendChild(renderer.domElement);

		//
		time = 0;
		timeSpeed = 1.0;


		var _geometry = new THREE.PlaneGeometry(5000,5000,50,50);
		var _material = new THREE.MeshPhongMaterial({
			shininess: 140,
			specular: 0xCCCCCC,
			metal: true

		});
		_plane = new  THREE.Mesh( _geometry, _material );
		_plane.rotation.x = - Math.PI * 0.5;
		_plane.receiveShadow = true;
		scene.add( _plane );

		// _plane.material.shininess = 60;
		// _plane.material.specular = 0x9999FF;
		// _plane.material.emissive = 0xFFFFFF;

		var _pl01 = new THREE.PointLight( 0xFFFFFF, 1.0, 600 );
		_pl01.position.set( 100, 400, 100 );
		scene.add( _pl01 );

		var _dl01 = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );
		_dl01.position.set( 0, 1, 0 );
		//scene.add( _dl01 );
		
		var _sl01 = new THREE.SpotLight( 0xFFFFFF, 0.2 );
		_sl01.position.set( 300, 400, -600 );
		_sl01.angle = Math.PI * 0.35;
		_sl01.castShadow = true;
		_sl01.shadowMapWidth = 1024;
		_sl01.shadowMapHeight = 1024;
		scene.add( _sl01 );

		for( var i = 0; i < 64; i = (i+1)|0 )
		{
			var _size = 6;
			var _vertices = [];
			for( var j = 0; j < 12; j = (j+1)|0 )
			{
				_vertices[j] = new THREE.Vector3(rnd()*_size,rnd()*_size,rnd()*_size)
			}
			var _geo = new THREE.ConvexGeometry( _vertices );
			var _mat = new THREE.MeshLambertMaterial({
				ambient: 0x990000,
				shading:THREE.FlatShading
			});
			var _mesh = new THREE.Mesh(_geo,_mat);
			_mesh.castShadow = true;
			scene.add( _mesh );
			_mesh.position.set( rnd()*400,Math.random()*200+20,rnd()*200);

			_convexlist.push(_mesh);
		}


		var _geo = new THREE.Geometry();
		for( var i = 0; i < 1000; i++) 
		{
			_geo.vertices.push(new THREE.Vector3(rnd()*200,Math.random()*100,rnd()*40));
		}
		var _mat = new THREE.PointCloudMaterial({
			transparent: true,
			//depthTest: false,
			//map: THREE.ImageUtils.loadTexture( './spark0.png' ),
			color:0xFFFFFF,
			blending:THREE.AdditiveBlending
		});

		_particle = new THREE.PointCloud( _geo, _mat);
		//scene.add( _particle);



		_simplexNoiseX = new SimplexNoise();
		_simplexNoiseY = new SimplexNoise();
		_simplexNoiseZ = new SimplexNoise();


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

		console.log(_particle.geometry)
	}

	function render()
	{
		time = (time+timeSpeed)|0;

		update()

		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	}

	function update()
	{
		_particle.geometry.vertices.push( new THREE.Vector3(rnd()*200,Math.random()*100,rnd()*40) );
		_particle.geometry.verticesNeedUpdate = true;

		var len = _convexlist.length;
		var _scale = _valueList[2] * 0.01;
		while( len )
		{
			len = (len-1)|0;
			var _mesh = _convexlist[len];
			var _vertex = _mesh.position;
			_vertex.x = _vertex.x-( (_valueList[1]+0.5) * 3);

			var _px = _simplexNoiseX.noise( _vertex.y * _scale, _vertex.z * _scale );
			var _py = _simplexNoiseX.noise( _vertex.x * _scale, _vertex.z * _scale );
			var _pz = _simplexNoiseX.noise( _vertex.x * _scale, _vertex.y * _scale );
			_vertex.x += _px * _valueList[3] * 5;
			_vertex.y += _py * _valueList[3] * 5 * 2;
			_vertex.z += _pz * _valueList[3] * 5 * 2;



			if( _mesh.position.x < -400 )
			{
				scene.remove( _mesh );
				_convexlist.splice(len,1);
				_mesh.geometry.dispose();
				_mesh.material.dispose();
			}

			//_mesh.rotation.x += 0.01;
			//_mesh.rotation.y += 0.01;
		}


		_focus.x = Math.sin( time * 0.01 ) * 16;
		_focus.y = Math.cos( time * 0.016 ) * 16 + 110;
		_focus.z = Math.cos( time * 0.001 ) * 16;

		focus.x += ( _focus.x - focus.x ) * 0.05;
		focus.y += ( _focus.y - focus.y ) * 0.05;
		focus.z += ( _focus.z - focus.z ) * 0.05;



		_camera.x = Math.sin( time * 0.01 ) * 90;
		_camera.y = Math.cos( time * 0.008 ) * 16 + 100;
		_camera.z = Math.cos( time * 0.001 ) * 16+400;

		camera.position.x += ( _camera.x - camera.position.x ) * 0.05;
		camera.position.y += ( _camera.y - camera.position.y ) * 0.05;
		camera.position.z += ( _camera.z - camera.position.z ) * 0.05;


		var _size = 6;
		var len = Math.floor( _valueList[0] * 2 );

		for( var i = 0; i < len; i++ )
		{
			var _vertices = [];
			for( var j = 0; j < 12; j = (j+1)|0 )
			{
				_vertices[j] = new THREE.Vector3(rnd()*_size,rnd()*_size,rnd()*_size)
			}
			var _geo = new THREE.ConvexGeometry( _vertices );
			var _mat = new THREE.MeshLambertMaterial({
				ambient: 0x990000,
				shading:THREE.FlatShading
			});
			var _mesh = new THREE.Mesh(_geo,_mat);
			_mesh.castShadow = true;
			scene.add( _mesh );
			_mesh.position.set( 400 + Math.random()*200,Math.random()*10+50,rnd()*10);

			_convexlist.push(_mesh);
		}



		// var _color = new THREE.Color(Math.random(),Math.random(),Math.random());
		// scene.fog.color = _color;
		// renderer.setClearColor(_color, 1);
	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();