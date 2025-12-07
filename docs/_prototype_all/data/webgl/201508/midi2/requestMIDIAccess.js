var _midi;

if( navigator.requestMIDIAccess ) 
{
	navigator.requestMIDIAccess({
		sysex: false
	}).then( _onMIDISuccess, _onMIDIFailure );
	return true;
} else
{
	console.log("このブラウザは WebMIDI API がサポートされていません");
	return false;
}

//	接続成功処理
function _onMIDISuccess( midiAccess )
{
	_midi = midiAccess;
	var inputs = _midi.inputs.values();
	for (var input = inputs.next(); input && !input.done; input = inputs.next() )
	{
		input.value.onmidimessage = _onMIDIMessage;
		listInputs(input);
	}
}

//	接続デバイスの情報取得
function listInputs( inputs )
{
	var input = inputs.value;
	console.log("Input port : [ type:'" + input.type + "' id: '" + input.id +
	"' manufacturer: '" + input.manufacturer + "' name: '" + input.name +
	"' version: '" + input.version + "']");
}

//	接続エラー処理
function _onMIDIFailure( error )
{
	console.log("WebMIDI API がサポートされていないか、デバイスが認識できない状態です" + error);
}

//	コントローラよりデータを受信	
function _onMIDIMessage( message )
{
	//	message
	var _id = message.target.id;
	var _manufacturer = message.target.manufacturer;
	var _name = message.target.name;
	var _type = message.target.type;
	var _version = message.target.version;

	// message.data [command/channel, note, velocity] data.
	var _data = message.data;
	var cmd = _data[0] >> 4;
	var channel = _data[0] & 0xf;
	var type = _data[0] & 0xf0;
	var note = _data[1];
	var velocity = _data[2];

	//	この部分をデータに反映
	console.log('MIDI data', _data);

}