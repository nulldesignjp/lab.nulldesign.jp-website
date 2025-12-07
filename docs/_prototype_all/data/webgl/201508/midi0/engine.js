/*
	engine.js
*/

(function(){

	var _canvas = document.getElementById('canvas');
	_canvas.width = 640;
	_canvas.height = 50;
	var midi = new midiControl( _midiMessage );
	if( midi )
	{
		/*
		console.log( 'log', midi );
		console.debug('debug', midi);
		console.error('error', midi);
		console.info('info', midi);
		console.warn('warn', midi);
		console.count('count');
		console.count('count');
		console.count('count');

		console.trace(	new Date() );

		console.time('hoge');
		console.timeEnd('hoge');

		console.table(midi);
		console.dir(document.getElementById('container'));
		console.dirxml(document.getElementById('container'));
		*/

		//	$('#container').css('opacity',1);
	}
	
	//	callbackALL
	function _midiMessage(e)
	{
		//console.log(e);

		$('#cmdValue').text( e.cmd );
		$('#channelValue').text( e.channel );
		$('#typeValue').text( e.type );
		$('#noteValue').text( e.note );
		$('#velocityValue').text( e.velocity );


		var _canvas = document.getElementById('canvas');
		_canvas.width = 640;
		_canvas.height = 50;
		var _ctx = _canvas.getContext('2d');

		_ctx.beginPath();
		_ctx.clearRect( 0, 0, _canvas.width,_canvas.height);
		_ctx.rect( 0, 0, e.velocity/127 * _canvas.width, _canvas.height );
		_ctx.fill();

	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();