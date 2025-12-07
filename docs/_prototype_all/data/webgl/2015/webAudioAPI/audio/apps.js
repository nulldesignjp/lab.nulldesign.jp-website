(function(){
    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/draw-wave
    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-10
    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-11
    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-12

    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-14
    //  http://curtaincall.weblike.jp/portfolio-web-sounder/webaudioapi-visualization/demos/demo-15
    var _playing = false;
    var _size = 2048;

    var _canvasA,_ctxA;

    _audio = new Audio();

    // オーディオの各種イベント
    setUpAudioEvents();

    // CANVASイベントA
    setUpCanvasA();

    //  リサイズ
    setUpResize();

    //  ステータスチェック
    checkStatus();

    //  操作系
    document.getElementById('pp').onclick = function(){
        if( _playing )
        {
            _audio.pause();
        } else {
            _audio.play();
        }
    }

    //  LOAD     
    _audio.src = '02 名前のない怪物.mp3';







    /*
        method
    */
    function setUpAudioEvents()
    {
        _audio.addEventListener('abort',function (e){
            resultBlock.value = 'abort:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('canplay',function (e){
            resultBlock.value = 'canplay:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('canplaythrough',function (e){
            resultBlock.value = 'canplaythrough:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('durationchange',function (e){
            resultBlock.value = 'durationchange:' + ' duration:' + this.duration + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('emptied',function (e){
            resultBlock.value = 'emptied:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('ended',function (e){
            resultBlock.value = 'ended:' + '\n' + resultBlock.value;
            _playing = false;
            _audio.currentTime = 0;
            _audio.play();
        },false);
        _audio.addEventListener('error',function (e){
            resultBlock.value = 'error:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('loadeddata',function (e){
            resultBlock.value = 'loadeddata:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('loadedmetadata',function (e){
            resultBlock.value = 'loadedmetadata:' + '\n' + resultBlock.value;

            if( e.path )
            {
                var _duration = e.path[0].duration;
                var _texts = e.path[0].TextTrackList;
                var _title = e.path[0].title;
                console.log(_duration,_texts,_title)
            }

        },false);
        _audio.addEventListener('loadstart',function (e){
            resultBlock.value = 'loadstart:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('pause',function (e){
            resultBlock.value = 'pause:' + '\n' + resultBlock.value;
            _playing = false;
        },false);
        _audio.addEventListener('play',function (e){
            resultBlock.value = 'play:' + '\n' + resultBlock.value;
            _playing = true;
        },false);
        _audio.addEventListener('playing',function (e){
            resultBlock.value = 'playing:' + '\n' + resultBlock.value;
            _playing = true;
        },false);
        _audio.addEventListener('progress',function (e){
            resultBlock.value = 'progress:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('ratechange',function (e){
            resultBlock.value = 'ratechange:' + ' defaultPlaybackRate:' + this.defaultPlaybackRate + ' playbackRate:' + this.playbackRate + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('seeked',function (e){
            resultBlock.value = 'seeked:' + ' seeking:' + this.seeking + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('seeking',function (e){
            resultBlock.value = 'seeking:' + ' seeking:' + this.seeking + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('stalled',function (e){
            resultBlock.value = 'stalled:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('suspend',function (e){
            resultBlock.value = 'suspend:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('timeupdate',function (e){
            resultBlock.value = 'timeupdate:' + ' currentTime:' + this.currentTime + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('volumechange',function (e){
            resultBlock.value = 'volumechange:' + ' volume:' + this.volume + ' muted:' + this.muted + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('waiting',function (e){
            resultBlock.value = 'waiting:' + '\n' + resultBlock.value;
        },false);
        _audio.addEventListener('canplaythrough',function (e){
            _audio.play();
            _audio.volume = 0.1;
        },false);
    }

    function setUpCanvasA()
    {
        _canvasA = document.createElement('canvas');
        _ctxA = _canvasA.getContext('2d');

        _canvasA.width = 1024;

        document.getElementById('vis').appendChild( _canvasA );

        window.AudioContext = window.AudioContext || window.webkitAudioContext;

        // Create the instance of AudioContext
        var context = new AudioContext();

        // Create the instance of AnalyserNode
        var analyser = context.createAnalyser();
        analyser.fftSize = _size;

        //  AnalyserNodeインスタンスのプロパティ
        //  高速フーリエ変換のデータサイズ
        console.log( 'fftSize: ', analyser.fftSize );

        //  fftSizeプロパティの1 / 2の値
        console.log( 'frequencyBinCount: ', analyser.frequencyBinCount );

        //  getByteFrequencyDataメソッドで取得可能なデシベルの下限
        console.log( 'minDecibels: ', analyser.minDecibels );

        //  getByteFrequencyDataメソッドで取得可能なデシベルの上限
        console.log( 'maxDecibels: ', analyser.maxDecibels );

        //  周波数領域の波形 (振幅スペクトル) 描画に関連するプパティ
        console.log( 'smoothingTimeConstant: ', analyser.smoothingTimeConstant );

        // Create the instance of OscillatorNode
        var oscillator = context.createOscillator();
        oscillator.start = oscillator.start || oscillator.noteOn;
        oscillator.stop  = oscillator.stop  || oscillator.noteOff;
        oscillator.connect(analyser);


        var source = context.createMediaElementSource(_audio);
        source.connect(analyser);

        analyser.connect(context.destination);
        //oscillator.start(0);

        var period = 1 / context.sampleRate;

        setInterval(freqAnalyser,1000/60);

        function freqAnalyser()
        {
            //window.requestAnimFrame(freqAnalyser);
            var sum;
            var average;
            var bar_width;
            var scaled_average;
            var num_bars = 60;
            var data = new Uint8Array(_size);

            //  CLEAR
            _ctxA.beginPath();
            _ctxA.clearRect(0, 0, _canvasA.width, _canvasA.height);


            //  周波数領域の波形データ (振幅スペクトル) を取得するメソッド
            analyser.getByteFrequencyData(data);
            var bin_size = Math.floor(data.length / num_bars);
            _ctxA.fillStyle = '#333333';
            for (var i = 0; i < num_bars; i++ )
            {
                sum = 0;
                for (var j = 0; j < bin_size; j++ )
                {
                    sum += data[(i * bin_size) + j];
                }
                average = sum / bin_size;
                bar_width = _canvasA.width / num_bars;
                scaled_average = (average / 256) * _canvasA.height;
                _ctxA.fillRect(i * bar_width, _canvasA.height, bar_width - 2, - scaled_average);
            }
            _ctxA.fill();

            //  周波数領域の波形データ (振幅スペクトル) を取得するメソッド
            _ctxA.beginPath();
            _ctxA.strokeStyle = '#FF0000';
            var spectrums = new Uint8Array(analyser.frequencyBinCount);  // Array size is 1024 (half of FFT size)
            analyser.getByteFrequencyData(spectrums);

            for (var i = 0, len = spectrums.length; i < len; i++)
            {
                var x = (i / len) * _canvasA.width;
                var y = (1 - (spectrums[i] / 255)) * _canvasA.height;

                if (i === 0) {
                    _ctxA.moveTo(x, y);
                } else {
                    _ctxA.lineTo(x, y);
                }
            }
            _ctxA.stroke();

            //  時間領域の波形データを取得するメソッド
            _ctxA.beginPath();
            _ctxA.strokeStyle = '#0000FF';
            var times = new Uint8Array( analyser.fftSize );
            analyser.getByteTimeDomainData(times);
            for (var i = 0, len = times.length; i < len; i++)
            {
                var x = (i / len) * _canvasA.width;
                var y = ( 1 - ( times[i] / 255 ) ) * _canvasA.height;

                if (i === 0) {
                    _ctxA.moveTo(x, y);
                } else {
                    _ctxA.lineTo(x, y);
                }
            }
            _ctxA.stroke();
        }
    }

    function setUpResize()
    {
        $( window ).on('resize',function(){ resize();   });
        function resize()
        {
            var _w = $(window).width();
            _w = _w<480?480:_w;

            _w = Math.floor( ( _w - 480 ) / 20 );
            var _result = 'Audio';
            for( var i = 0; i < _w; i++ )
            {
                _result += 'o';
            }
            document.title = _result;
            $('h1').text(_result);
        }
        resize();
    }

    function checkStatus()
    {
        document.getElementById('supported').innerHTML = window.HTMLAudioElement?'Audio利用可能です':'Audio利用不可能です';

        var param = [
            {name:"WAVE", type:'audio/wav'},
            {name:"MP3", type:'audio/mpeg'},
            {name:"Ogg Vorbis", type:'audio/ogg'},
            {name:"AAC", type:'audio/mp4'},
            {name:"", type:'audio/32kadpcm'},
            {name:".aiff .aif .aifc", type:'audio/aiff'},
            {name:".au .snd", type:'audio/basic'},
            {name:".es .esl", type:'audio/echospeech'},
            {name:".mid .midi .rmi .kar", type:'audio/mid'},
            {name:".mid .midi .rmi .kar", type:'audio/midi'},
            {name:".mp3", type:'audio/mp3'},
            {name:".m3u .pls", type:'audio/mpegurl'},
            {name:".mp3", type:'audio/mpg'},
            {name:".la .lma", type:'audio/nspaudio'},
            {name:".rmf", type:'audio/rmf'},
            {name:".tsi", type:'audio/tsplayer'},
            {name:"", type:'audio/vnd.qcelp'},
            {name:".ra", type:'audio/vnd.rn-realaudio'},
            {name:".vox", type:'audio/voxware'},
            {name:".aiff .aif .aifc", type:'audio/x-aiff'},
            {name:".cht .dus", type:'audio/x-dspeech'},
            {name:".pae", type:'audio/x-epac'},
            {name:".oke", type:'audio/x-karaoke'},
            {name:"", type:'audio/x-liquid'},
            {name:"", type:'audio/x-liquid-file'},
            {name:"", type:'audio/x-liquid-secure'},
            {name:".lam", type:'audio/x-liveaudio'},
            {name:".mid .midi .rmi .kar", type:'audio/x-mid'},
            {name:".mid .midi .rmi .kar", type:'audio/x-midi'},
            {name:".mio", type:'audio/x-mio'},
            {name:".mp3", type:'audio/x-mp3'},
            {name:".mp2 .mpa .abs .mpega", type:'audio/x-mpeg'},
            {name:".m3u .pls", type:'audio/x-mpegurl'},
            {name:".mp3", type:'audio/x-mpg'},
            {name:".wma", type:'audio/x-ms-wma'},
            {name:".la .lma", type:'audio/x-nspaudio'},
            {name:".pac", type:'audio/x-pac'},
            {name:".aiff .aif", type:'audio/x-pn-aiff'},
            {name:".au", type:'audio/x-pn-au'},
            {name:".ra .ram .rm .rmm", type:'audio/x-pn-realaudio'},
            {name:".rpm", type:'audio/x-pn-realaudio-plugin'},
            {name:".wav", type:'audio/x-pn-wav'},
            {name:".wav", type:'audio/x-pn-windows-acm'},
            {name:".ra", type:'audio/x-realaudio'},
            {name:".rmf", type:'audio/x-rmf'},
            {name:".m3u .pls", type:'audio/x-scpls'},
            {name:".sd2", type:'audio/x-sd2'},
            {name:".vqf .vql", type:'audio/x-twinvq'},
            {name:".vqe", type:'audio/x-twinvq-plugin'},
            {name:".wav", type:'audio/x-wav'}
        ];

        // エレメントを取得
        var element = document.getElementById("edit_box01_01");
        var s = "";
        var i;
        var num = param.length;
        for(i=0;i < num;i++){
            s += param[i].name + "(" + param[i].type + "):";

            // フォーマットが対応しているか調べる
            if(_audio.canPlayType(param[i].type) !== ""){
                s += "対応している";
            }else{
                s += "未対応";
            }
            s += "\n";
        }
        element.value = s;
    }
})();