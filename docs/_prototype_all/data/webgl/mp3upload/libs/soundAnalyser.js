/*
	soundAnalyser.js
*/

var soundAnalyser = (function(){

	function soundAnalyser()
	{
		this.file;
		this.arrayBuffer;
		this.audioBuffer;
		this.source;
		this.context;
		this.gain;
		this.analyser;
		this.oscillator;
		this.filter;
		this.channels;

		this.isSetDragAndDrop;
		this.isSetInputFile;

		this.init();

	}

	soundAnalyser.COMPLETE = 'soundAnalyserComplete';
	soundAnalyser.ERROR = 'soundAnalyserError';

	soundAnalyser.prototype = 
	{
		init : function()
		{
			this.isSetDragAndDrop = false;
			this.isSetInputFile = false;
		},
		setDragAndDrop : function( e )
		{
			var _t = this;
			document.getElementById( e ).addEventListener('dragenter', function(event)
			{
				event.preventDefault();
				document.getElementById( e ).classList.add('dragover');
			}, false);

			document.getElementById( e ).addEventListener('dragover', function(event)
			{
				event.preventDefault();
			}, false);

			document.getElementById( e ).addEventListener('dragleave', function(event)
			{
				event.preventDefault();
				document.getElementById( e ).classList.remove('dragover');
			}, false);

			document.getElementById( e ).addEventListener('drop', function(event)
			{
				event.preventDefault();
				document.getElementById( e ).classList.remove('dragover');

				if( _t.isSetInputFile ){	return;	}

				// Get the instance of File (extends Blob)
				var file = event.dataTransfer.files[0];
				_t.file = file;

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

						_t.fileUploaderComplete( file, reader.result );
					};

					// Read the instance of File
					reader.readAsArrayBuffer(file);
				}
			}, false);

			this.isSetInputFile = true;
		},
		setInputFile : function( e )
		{
			var _t = this;
			document.getElementById( e ).addEventListener('change', function(event){
			//document.querySelector('[type="file"]').addEventListener('change', function(event){
				var uploader = this;

				// Get the instance of File (extends Blob)
				var file = event.target.files[0];
				_t.file = file;

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

						_t.fileUploaderComplete( file, reader.result );
					}

					// Read the instance of File
					reader.readAsArrayBuffer( file );
				}

			}, false);
		},
		trigger : function()
		{
			var event = document.createEvent('Event');
			event.initEvent('ended', true, true);

			if ( this.source instanceof AudioBufferSourceNode)
			{
				this.source.dispatchEvent(event);
			}
		},
		fileUploaderComplete : function( file, arrayBuffer )
		{
			var _t = this;
			this.arrayBuffer = arrayBuffer;

			this.trigger();

			window.AudioContext = window.AudioContext || window.webkitAudioContext;

			// for the instance of AudioBufferSourceNode
			this.source = null;

			// Create the instance of AudioContext
			this.context = new AudioContext();
			this.context.createGain = this.context.createGain || this.context.createGainNode;

			// Create the instance of GainNode
			this.gain = this.context.createGain();

			// The 2nd argument for decodeAudioData
			var _successCallback = function( audioBuffer )
			{
				if( !( audioBuffer instanceof AudioBuffer ) ){	return;	}

				// The 1st argument (audioBuffer) is the instance of AudioBuffer
				_t.audioBuffer = audioBuffer;
				 
				// Get audio binary data for drawing wave
				_t.channels = {};
				_t.channels.left = new Float32Array(audioBuffer.length);
				_t.channels.right = new Float32Array(audioBuffer.length);
				 
				console.log('numberOfChannels : ' + audioBuffer.numberOfChannels);
				 
				// Stereo ?
				if (audioBuffer.numberOfChannels > 1)
				{
					// Stereo
					_t.channels.left.set(audioBuffer.getChannelData(0));
					_t.channels.right.set(audioBuffer.getChannelData(1));
				} else if (audioBuffer.numberOfChannels > 0)
				{
					// Monaural
					_t.channels.left.set(audioBuffer.getChannelData(0));
				} else {
					window.alert('The number of channels is invalid.');
					return;
				}
				 
				// If there is previous AudioBufferSourceNode, program stops previous audio
				if ((_t.source instanceof AudioBufferSourceNode) && (_t.source.buffer instanceof AudioBuffer))
				{
					// Execute onended event handler
					_t.trigger();
					_t.source = null;
				}
				 
				// Create the instance of AudioBufferSourceNode
				_t.source = _t.context.createBufferSource();
				 
				// for legacy browsers
				_t.source.start = _t.source.start || _t.source.noteOn;
				_t.source.stop  = _t.source.stop  || _t.source.noteOff;
				 
				// Set the instance of AudioBuffer
				_t.source.buffer = audioBuffer;
				 
				// Set parameters
				_t.source.loop = true;
				_t.source.loopStart = 0;
				_t.source.loopEnd = audioBuffer.duration;
				_t.source.playbackRate.value = 1.0;

				// AudioBufferSourceNode (Input) -> GainNode (Volume) -> AudioDestinationNode (Output)
				_t.source.connect( _t.gain);
				_t.gain.connect( _t.context.destination );

				//	analyser
				_t.analyser = _t.context.createAnalyser();
				_t.analyser.fftSize = 2048;


				_t.oscillator = _t.context.createOscillator();
				_t.oscillator.start = _t.oscillator.start || _t.oscillator.noteOn;
				_t.oscillator.stop  = _t.oscillator.stop  || _t.oscillator.noteOff;

				//INPUT -> OUTPUT / OUTPUT / INPUT
				_t.oscillator.connect(_t.analyser);
				_t.analyser.connect(_t.context.destination);
				_t.source.connect(_t.analyser);

				_t.filter = _t.context.createBiquadFilter();
				_t.source.connect( _t.filter );
	            _t.filter.connect( _t.gain );
				 
				// Start audio
				_t.source.start(0);
				 
				// Set Callback
				_t.source.onended = function(event)
				{
					// Remove event handler
					_t.source.onended     = null;
					 
					// Stop audio
					_t.source.stop(0);
					 
					console.log('STOP by "on' + event.type + '" event handler !!');
					 
					// Audio is not started !!
					// It is necessary to create the instance of AudioBufferSourceNode again
					 
					// Cannot replay
					// source.start(0);
				};

				//_edge.setUpData( _file, _arrayBuffer, audioBuffer, source, context, gain, analyser, oscillator, filter, channels );

				$( _t ).trigger( soundAnalyser.COMPLETE );
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

				$( _t ).trigger( soundAnalyser.ERROR );
			};
			 
			// Create the instance of AudioBuffer (Asynchronously)
			this.context.decodeAudioData( arrayBuffer, _successCallback, _errorCallback );
		},
		getByteTimeDomainData : function()
		{
			var times = new Uint8Array(this.analyser.fftSize);
			this.analyser.getByteTimeDomainData(times);
			return times;
		},
		getByteFrequencyData : function()
		{
			var spectrums = new Uint8Array(this.analyser.frequencyBinCount);
			this.analyser.getByteFrequencyData(spectrums);
			return spectrums;
		},
		getFloatFrequencyData : function()
		{	
			// Get data for drawing spectrum (dB)
			var spectrums = new Float32Array(this.analyser.frequencyBinCount);
			this.analyser.getFloatFrequencyData(spectrums);
			return spectrums;
		},
	};
	
	return soundAnalyser;

})();