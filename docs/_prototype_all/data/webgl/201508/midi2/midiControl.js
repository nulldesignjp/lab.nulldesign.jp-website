/*
	midiControl.js
*/

var midiControl = (function(){

	function midiControl( e )
	{
		console.log('%cmidiControl', 'color: #003366;font: bold 16px sans-serif;', midiControl.version);

		var _t = this;
		_t.midi;
		_t._data;
		_t._dataList;
		_t.nobList = [
			13,14,15,16,17,18,19,20,	//	176 or 184
			29,30,31,32,33,34,35,36,
			49,50,51,52,53,54,55,56,

			77,78,79,80,81,82,83,84,

			41,42,43,44,57,58,59,60,	//	144/128 or 152/136
			73,74,75,76,89,90,91,92
		];
		_t.callback = e;
		_t.init();
	}

	midiControl.prototype.init = function()
	{
		var _t = this;
		_t._data = {cmd:{}};
		_t._dataList = {};

		var len = _t.nobList.length;
		while( len )
		{
			len --;
			_t._dataList[ _t.nobList[len] ] = 0;
		}
		
		if( navigator.requestMIDIAccess ) 
		{
			navigator.requestMIDIAccess({
				sysex: false
			}).then( _onMIDISuccess, _onMIDIFailure );
			return true;
		} else
		{
			alert("No MIDI support in your browser.");
			return false;
		}


		function _onMIDISuccess( midiAccess )
		{
			// when we get a succesful response, run this code
			_t.midi = midiAccess; // this is our raw MIDI data, inputs, outputs, and sysex status
			var inputs = _t.midi.inputs.values();
			// loop over all available inputs and listen for any MIDI input
			for (var input = inputs.next(); input && !input.done; input = inputs.next() )
			{
				// each time there is a midi message call the onMIDIMessage function
				input.value.onmidimessage = _onMIDIMessage;
				_t.listInputs(input);
			}
		}

		function _onMIDIFailure( error )
		{
			// when we get a failed response, run this code
			console.log("No access to MIDI devices or your browser doesn't support WebMIDI API. Please use WebMIDIAPIShim " + error);
		}

		function _onMIDIMessage( message )
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

			//console.log('MIDI data', _data); // MIDI data [144, 63, 73]

			_t.setValue({cmd:cmd,channel:channel,type:type,note:note,velocity:velocity});
			_t._dataList[note] = velocity;
			_t.callback({cmd:cmd,channel:channel,type:type,note:note,velocity:velocity});

		}

	}
	midiControl.prototype.listInputs = function( inputs )
	{
		var input = inputs.value;
		console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
		"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
		"' version: '" + input.version + "']");
	}

	midiControl.prototype.setValue = function(e)
	{
		var _t = this;

		//	cmd:8 channel:0 type:128 note:41 velocity:0
		var cmd = e.cmd;
		var channel = e.channel;
		var type = e.type;
		var note = e.note;
		var velocity = e.velocity;

		if( !_t._data.cmd[cmd] )
		{
			_t._data.cmd[cmd] = {}
			_t._data.cmd[cmd].channel = {}
		}

		if( !_t._data.cmd[cmd].channel[channel] )
		{
			_t._data.cmd[cmd].channel[channel] = {};
			_t._data.cmd[cmd].channel[channel].type = {};
		}

		if( !_t._data.cmd[cmd].channel[channel].type[type] )
		{
			_t._data.cmd[cmd].channel[channel].type[type] = {};
			_t._data.cmd[cmd].channel[channel].type[type].note = {}
		}

		_t._data.cmd[cmd].channel[channel].type[type].note[note] = velocity;
		//console.log(_t._data, getValue(e) );
	}

	midiControl.prototype.getValue = function(e)
	{
		//console.log(_t._data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note])
		return this._data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note]?this._data.cmd[e.cmd].channel[e.channel].type[e.type].note[e.note]:0;
	}

	midiControl.prototype.data = function(e)
	{
		if( e == undefined )
		{
			return this._data;
		}
		return this._dataList[e];
	}

	midiControl.version = '1.0.0';

	return midiControl;
})();
