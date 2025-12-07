/*
	libs.js
*/

var cEdge = (function(){

	function cEdge( e )
	{
		this.world;

			this.file;
			this.arrayBuffer;
			this.audioBuffer;
			this.source;
			this.context;
			this.gain;
			this.analyser;
			this.oscillator;
			this.filter;

		this.line;
		this.line2;
		this.line3;
		this.line4;


		//
		this.init( e );
		this.setUp();
	}

	cEdge.prototype = 
	{
		init : function()
		{
			this.world = new world('webglView');
			this.world.camera.position.z = 1000;
			this.world.controls.autoRotate = false;

			this.loop();
		},
		setUp : function()
		{
			//	
			var _gh = new THREE.GridHelper( 200, 100 );
			this.world.add( _gh );
		},
		setUpData : function( _file, _arrayBuffer, _audioBuffer, _source, _context, _gain )
		{
			//	connect AudioAPI and WebGL
			this.file = _file;
			this.arrayBuffer = _arrayBuffer;
			this.audioBuffer = _audioBuffer;
			this.source = _source;
			this.context = _context;
			this.gain = _gain;
			this.analyser = this.context.createAnalyser();
			this.analyser.fftSize = 2048;

			this.oscillator = _context.createOscillator();
			this.oscillator.start = this.oscillator.start || this.oscillator.noteOn;
			this.oscillator.stop  = this.oscillator.stop  || this.oscillator.noteOff;

			//INPUT -> OUTPUT / OUTPUT / INPUT
			this.oscillator.connect(this.analyser);
			this.analyser.connect(this.context.destination);
			this.source.connect(this.analyser);

			this.filter = this.context.createBiquadFilter();
			this.source.connect(this.filter);
            this.filter.connect(this.gain);

            var _t = this;
            $( window ).on('click',function(){
            	var _id = Math.floor( Math.random() * 7 )
            	_t.filter.type = _id;

            	var _hoge = [
            		'LOWPASS',
            		'HIGHPASS',
            		'BANDPASS',
            		'LOWSHELF',
            		'HIGHSHELF',
            		'PEAKING',
            		'NOTCH',
            		'ALLPASS'
            	]
            	$('#filter').text( _hoge[_id] );
            })
			/*
				filter.type = '';
				LOWPASS: 0, HIGHPASS: 1, BANDPASS: 2, LOWSHELF: 3,
				HIGHSHELF: 4, PEAKING: 5, NOTCH: 6, ALLPASS: 7
			*/
			$('#title').text( this.file.name );
			$('#current').text( '0' );
			$('#total').text( Math.floor( this.audioBuffer.duration * 100 ) / 100 );
			$('#filter').text( 'LOWPASS' );



			//	sample code....
			var channelLs = new Float32Array(_audioBuffer.length);
			var channelRs = new Float32Array(_audioBuffer.length);

				channelLs.set(_audioBuffer.getChannelData(0));
				channelRs.set(_audioBuffer.getChannelData(1));

			var period = 1 / this.context.sampleRate;
			var n50msec = Math.floor(50 * Math.pow(10, -3) * this.context.sampleRate);

			/*
				sample
			*/
			var _material = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 0.5
			});
			//	Left
			var _geometry = new THREE.Geometry();
			var len = channelLs.length;
			var _count = 0;
			for( var i = 0; i < channelLs.length; i++ )
			{
				if ( (i % n50msec ) === 0 ) 
				{
					var _x = _count - ( channelLs.length / n50msec * 0.5 );
					var _y = channelLs[i] * 100;
					var _v = new THREE.Vector3( _x, _y, 50 );
					_geometry.vertices.push( _v );
					_count++;
				}
			}
			var _mesh = new THREE.Line( _geometry, _material );
			_mesh.position.y = - 100;
			this.world.scene.add( _mesh );


			//	Right
			var _geometry = new THREE.Geometry();
			var len = channelRs.length;
			var _count = 0;
			for( var i = 0; i < channelRs.length; i++ )
			{
				if ( (i % n50msec ) === 0 ) 
				{
					var _x = _count - ( channelRs.length / n50msec * 0.5 );
					var _y = channelRs[i] * 100;
					var _v = new THREE.Vector3( _x, _y, -50 );
					_geometry.vertices.push( _v );
					_count++;
				}
			}
			var _mesh = new THREE.Line( _geometry, _material );
			_mesh.position.y = - 100;
			this.world.scene.add( _mesh );

			//	line1
			this.line = createLine( this.analyser.fftSize, {} );
			this.world.scene.add( this.line );

			//	line2
			this.line2 = createLine( this.analyser.frequencyBinCount, {color:0x00CC00} );
			this.line.position.y = 100;
			this.world.scene.add( this.line2 );

			//	line3
			this.line3 = createLine( this.analyser.frequencyBinCount, {color: 0xCC0000} );
			this.line3.position.y = 200;
			this.world.scene.add( this.line3 );

			//	line4
			this.line4 = createLine( this.analyser.frequencyBinCount, {color: 0x0000CC} );
			this.line4.position.y = 0;
			this.world.scene.add( this.line4 );

		},
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			if( this.line )
			{
				//var period = 1 / this.context.sampleRate;
				var times = new Uint8Array(this.analyser.fftSize);
    			this.analyser.getByteTimeDomainData(times);
    			var len = times.length;
    			for (var i = 0; i < len; i++ )
    			{
    				var y = 1.0 - times[i] / 255;  // 0 - 1
    				this.line.geometry.vertices[i].y = y * 100;
    			}

    			this.line.geometry.verticesNeedUpdate = true;
			}

			if( this.line2 )
			{
				var period = 1 / this.context.sampleRate;
				var spectrums = new Uint8Array(this.analyser.frequencyBinCount);
    			this.analyser.getByteFrequencyData(spectrums);
    			var len = spectrums.length;
    			for (var i = 0; i < len; i++ )
    			{
    				var y = 1.0 - spectrums[i] / 255;  // 0 - 1
    				this.line2.geometry.vertices[i].y = y * 100;
    			}

    			this.line2.geometry.verticesNeedUpdate = true;
			}

			if( this.line3 )
			{
				var range = this.analyser.maxDecibels - this.analyser.minDecibels;  // 70 dB

				// Get data for drawing spectrum (dB)
				var spectrums = new Float32Array(this.analyser.frequencyBinCount);  // Array size is 1024 (half of FFT size)
				this.analyser.getFloatFrequencyData(spectrums);

    			var len = spectrums.length;
    			for (var i = 0; i < len; i++ )
    			{
    				var y = - 1 * ( (spectrums[i] - this.analyser.maxDecibels) / range );  // 0 - 1
    				this.line3.geometry.vertices[i].y = y * 100;
    			}

    			this.line3.geometry.verticesNeedUpdate = true;
			}

			//return;
			if( this.line4 )
			{
				var channels = new Float32Array(this.audioBuffer.length);
				channels.set(this.audioBuffer.getChannelData(0));

				//var period = 1 / this.context.sampleRate;
				var _msec = 1;
				var n50msec = Math.floor( _msec * Math.pow( 10, -3 ) * this.context.sampleRate);

				var _duration = this.audioBuffer.duration;
				var _current = this.context.currentTime;
				var len = this.line4.geometry.vertices.length;
				var len0 = channels.length - len * n50msec;
				var _start = Math.floor( _current / _duration * len0 )

				// Get data for drawing spectrum (dB)
				var spectrums = new Float32Array(this.analyser.frequencyBinCount);  // Array size is 1024 (half of FFT size)
				this.analyser.getFloatFrequencyData(spectrums);

    			var len = spectrums.length;
    			var _count = 0;
    			for (var i = _start; i < _start + len * n50msec; i++ )
    			{
					if ( (i % n50msec ) === 0 ) 
					{
    					this.line4.geometry.vertices[_count].y = channels[i] * 100;
    					_count ++;
					}
    			}

    			this.line4.geometry.verticesNeedUpdate = true;


				$('#current').text( Math.floor( this.context.currentTime * 100 ) / 100 );
			}


			
		}
	};

	return cEdge;

})();


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