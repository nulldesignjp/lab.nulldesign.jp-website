/*
    audioAnalyser.js
    v 1.0.0
*/

var audioAnalyser = (function(){

    function audioAnalyser( e )
    {
        //  prop
        this.size;
        this.audio;
        this.context;
        this.analyser;
        this.spectrums;
        this.volume;

        //
        this.init( e );
    }

    audioAnalyser.prototype = 
    {
        init : function( e )
        {
            this.spectrums = [];
            this.volume = 0;
            this.size = 2048;
            this.audio = document.getElementById( e );
            // コントロールの表示を有効
            this.audio.controls = true;

            window.AudioContext = window.AudioContext || window.webkitAudioContext;

            // Create the instance of AudioContext
            this.context = new AudioContext();
            this.context.createGain = this.context.createGain || this.context.createGainNode;

            // Create the instance of GainNode
            this.gain = this.context.createGain();

            // Create the instance of AnalyserNode
            this.analyser = this.context.createAnalyser();
            this.analyser.fftSize = this.size;

            this.source = this.context.createMediaElementSource(this.audio);
            this.source.connect(this.analyser);

            this.analyser.connect(this.context.destination);
            
            //  event
            var _t = this;
            this.audio.addEventListener('ended',function (e){
                _t.audio.currentTime = 0;
                _t.audio.play();
            },false);
            this.audio.addEventListener('canplaythrough',function (e){
                _t.audio.play();
            },false);

            //  loop
            this.freqAnalyser();
        },
        freqAnalyser : function()
        {
            var _t = this;
            window.requestAnimationFrame( function(){   _t.freqAnalyser();  } );

            var range = this.analyser.maxDecibels - this.analyser.minDecibels;
            var _byte = true;
            var spectrums,_max,len;
            _max = 0;
            if( _byte )
            {
                spectrums = new Uint8Array(this.analyser.frequencyBinCount);
                this.analyser.getByteFrequencyData( spectrums );
                len = spectrums.length;
                for ( var i = 0; i < len; i++ )
                {
                    _max += 1 - spectrums[i] / 255;
                }
            } else {
                var spectrums = new Float32Array(this.analyser.frequencyBinCount);
                this.analyser.getFloatFrequencyData( spectrums );
                len = spectrums.length;
                for ( var i = 0; i < len; i++ )
                {
                    var _value = (spectrums[i] - this.analyser.maxDecibels ) / range;  // 0 - 1
                    spectrums[i] = _value;
                    _max += 1 - spectrums[i];
                }
            } 

            this.spectrums = spectrums;
            this.volume = 1.0 - _max / spectrums.length;
        },
        play : function()
        {
            this.audio.play();
        },
        pause : function()
        {
            this.audio.pause();
        },
        volume : function( e )
        {
            if( e == undefined )
            {
                return this.audio.volume;
            } else {
                this.audio.volume = e;
            }
        },
        src : function( e )
        {
            this.audio.src = e;
        }

    }

    return audioAnalyser;


})();