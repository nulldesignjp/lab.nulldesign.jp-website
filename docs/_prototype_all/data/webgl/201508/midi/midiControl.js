/*
	midiControl.js
*/

(function(){

	var midi,data,dataList;
	var nobList = [
		13,14,15,16,17,18,19,20,	//	176 or 184
		29,30,31,32,33,34,35,36,
		49,50,51,52,53,54,55,56,

		77,78,79,80,81,82,83,84,

		41,42,43,44,57,58,59,60,	//	144/128 or 152/136
		73,74,75,76,89,90,91,92

	];

	//	start
	initMidi();

	//	method
	function initMidi()
	{
		data = {cmd:{}};
		dataList = {};
		var len = nobList.length;
		while( len )
		{
			len --;
			dataList[ nobList[len] ] = 0;
		}
		
		if( navigator.requestMIDIAccess ) 
		{
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
		//	detail
		var _id = message.target.id;
		var _manufacturer = message.target.manufacturer;
		var _name = message.target.name;
		var _type = message.target.type;
		var _version = message.target.version;

		// this gives us our [command/channel, note, velocity] data.
		var _data = message.data;
		var cmd = _data[0] >> 4;
		var channel = _data[0] & 0xf;
		var type = _data[0] & 0xf0; // channel agnostic message type. Thanks, Phil Burk.
		var note = _data[1];
		var velocity = _data[2];

		//$('#inputData').text('cmd:' + cmd + ' channel:' + channel + ' type:' + type + ' note:' + note + ' velocity:' + velocity);
		console.log('MIDI data', _data); // MIDI data [144, 63, 73]

		setValue({cmd:cmd,channel:channel,type:type,note:note,velocity:velocity});
		dataList[note] = velocity/127;

	}
	function listInputs( inputs )
	{
		var input = inputs.value;
		console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
		"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
		"' version: '" + input.version + "']");
		$('#inputData').text("Input port : [ type:'" + input.type + "' id: '" + input.id +
		"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
		"' version: '" + input.version + "']");
	}

	function setValue(e)
	{
		//	cmd:8 channel:0 type:128 note:41 velocity:0
		var cmd = e.cmd;
		var channel = e.channel;
		var type = e.type;
		var note = e.note;
		var velocity = e.velocity;

		if( !data.cmd[cmd] )
		{
			data.cmd[cmd] = {}
			data.cmd[cmd].channel = {}
		}

		if( !data.cmd[cmd].channel[channel] )
		{
			data.cmd[cmd].channel[channel] = {};
			data.cmd[cmd].channel[channel].type = {};
		}

		if( !data.cmd[cmd].channel[channel].type[type] )
		{
			data.cmd[cmd].channel[channel].type[type] = {};
			data.cmd[cmd].channel[channel].type[type].note = {}
		}

		data.cmd[cmd].channel[channel].type[type].note[note] = velocity;
		//console.log(data, getValue(e) );
	}

	function getValue(e)
	{
		//console.log(data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note])
		return data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note]?data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note]:0;
	}
})();