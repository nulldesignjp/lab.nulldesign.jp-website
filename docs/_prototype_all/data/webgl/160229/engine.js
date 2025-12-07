/*
	engine.js
	sample: http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-10
*/

var _edge = new cEdge();

(function(){

	var source,context,gain;

	// Trigger 'ended' event
	var trigger = function()
	{
		var event = document.createEvent('Event');
		event.initEvent('ended', true, true);

		if (source instanceof AudioBufferSourceNode)
		{
			source.dispatchEvent(event);
		}
	};

	var fileUploaderComplete = function( _file, _arrayBuffer )
	{
		trigger();

		window.AudioContext = window.AudioContext || window.webkitAudioContext;

		// for the instance of AudioBufferSourceNode
		source = null;

		// Create the instance of AudioContext
		context = new AudioContext();
		context.createGain = context.createGain || context.createGainNode;

		// Create the instance of GainNode
		gain = context.createGain();

		// The 2nd argument for decodeAudioData
		var _successCallback = function(audioBuffer)
		{
			// The 1st argument (audioBuffer) is the instance of AudioBuffer
			 
			// Get audio binary data for drawing wave
			var channelLs = new Float32Array(audioBuffer.length);
			var channelRs = new Float32Array(audioBuffer.length);
			 
			console.log('numberOfChannels : ' + audioBuffer.numberOfChannels);
			 
			// Stereo ?
			if (audioBuffer.numberOfChannels > 1)
			{
				// Stereo
				channelLs.set(audioBuffer.getChannelData(0));
				channelRs.set(audioBuffer.getChannelData(1));
			} else if (audioBuffer.numberOfChannels > 0)
			{
				// Monaural
				channelLs.set(audioBuffer.getChannelData(0));
			} else {
				window.alert('The number of channels is invalid.');
				return;
			}
			 
			// If there is previous AudioBufferSourceNode, program stops previous audio
			if ((source instanceof AudioBufferSourceNode) && (source.buffer instanceof AudioBuffer))
			{
				// Execute onended event handler
				trigger();
				source = null;
			}
			 
			// Create the instance of AudioBufferSourceNode
			source = context.createBufferSource();
			 
			// for legacy browsers
			source.start = source.start || source.noteOn;
			source.stop  = source.stop  || source.noteOff;
			 
			// Set the instance of AudioBuffer
			source.buffer = audioBuffer;
			 
			// Set parameters
			source.loop = true;
			source.loopStart = 0;
			source.loopEnd = _arrayBuffer.duration;
			source.playbackRate.value = 1.0;
			 
			// AudioBufferSourceNode (Input) -> GainNode (Volume) -> AudioDestinationNode (Output)
			source.connect(gain);
			gain.connect(context.destination);
			 
			// Start audio
			source.start(0);
			 
			// Set Callback
			source.onended = function(event)
			{
				// Remove event handler
				source.onended     = null;
				 
				// Stop audio
				source.stop(0);
				 
				console.log('STOP by "on' + event.type + '" event handler !!');
				 
				// Audio is not started !!
				// It is necessary to create the instance of AudioBufferSourceNode again
				 
				// Cannot replay
				// source.start(0);
			};


			_edge.setUpData( _file, _arrayBuffer, audioBuffer, source, context, gain );
		};

		// The 3rd argument for decodeAudioData
		var _errorCallback = function(error)
		{
			if (error instanceof Error)
			{
				window.alert(error.message);
			} else {
				window.alert('Error : "decodeAudioData" method.');
			}
		};
		 
		// Create the instance of AudioBuffer (Asynchronously)
		context.decodeAudioData(_arrayBuffer, _successCallback, _errorCallback);
	}

	/*
		File Uploader
	*/
	document.querySelector('[type="file"]').addEventListener('change', function(event){
		var uploader = this;

		// Get the instance of File (extends Blob)
		var file = event.target.files[0];

		if (!(file instanceof File))
		{
			window.alert('Please upload file.');
		} else if (file.type.indexOf('audio') === -1)
		{
			window.alert('Please upload audio file.');
		} else {
			// Create the instance of FileReader
			var reader = new FileReader();
			reader.onprogress = function(event)
			{
				if (event.lengthComputable && (event.total > 0))
				{
					var rate = Math.floor((event.loaded / event.total) * 100);
					console.log( rate + ' %' );
				}
			}

			reader.onerror = function()
			{
				window.alert('FileReader Error : Error code is ' + reader.error.code);
				uploader.value = '';
			}

			// Success read
			reader.onload = function()
			{
				var _arrayBuffer = reader.result;  // Get ArrayBuffer
				var _fileName = file.name;
				var _fileSize = file.size;	//	byte
				uploader.value = '';

				fileUploaderComplete( file, reader.result );
			}

			// Read the instance of File
			reader.readAsArrayBuffer( file );
		}
	}, false);

	/*
		Drag & Drop
	*/
	var _targetDom = 'webglView';
	document.getElementById( _targetDom ).addEventListener('dragenter', function(event)
	{
		event.preventDefault();
		document.getElementById( _targetDom ).classList.add('dragover');
	}, false);

	document.getElementById( _targetDom ).addEventListener('dragover', function(event)
	{
		event.preventDefault();
	}, false);

	document.getElementById( _targetDom ).addEventListener('dragleave', function(event)
	{
		event.preventDefault();
		document.getElementById( _targetDom ).classList.remove('dragover');
	}, false);

	document.getElementById( _targetDom ).addEventListener('drop', function(event)
	{
		event.preventDefault();
		document.getElementById( _targetDom ).classList.remove('dragover');

		// Get the instance of File (extends Blob)
		var file = /*('items' in event.dataTransfer) ? event.dataTransfer.items[0].getAsFile() : */event.dataTransfer.files[0];

		if (!(file instanceof Blob))
		{
		window.alert('Please upload file.');
		} else if (file.type.indexOf('audio') === -1)
		{
		window.alert('Please upload audio file.');
		} else {
		// Create the instance of FileReader
		var reader = new FileReader();

		reader.onprogress = function(event)
		{
			if (event.lengthComputable && (event.total > 0))
			{
				var rate = Math.floor((event.loaded / event.total) * 100);
				console.log( rate + ' %' );
			}
		};

		reader.onerror = function()
		{
			window.alert('FileReader Error : Error code is ' + reader.error.code);
		};

		// Success read
		reader.onload = function()
		{
			var _arrayBuffer = reader.result;  // Get ArrayBuffer
			var _fileName = file.name;
			var _fileSize = file.size;	//	byte

			fileUploaderComplete( file, reader.result );
		};

			// Read the instance of File
			reader.readAsArrayBuffer(file);
		}
	}, false);

})();