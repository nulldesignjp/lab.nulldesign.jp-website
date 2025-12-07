/*
	script.js
	v 1.2.0
*/

var backgroundView = (function(){
	function main( e )
	{
		this.dom = e;
		this.vs = [
			'attribute vec3 position;',
			'void main()',
			'{',
			'    gl_Position = vec4( position, 1.0 );',
			'}'
		].join("\n");
		this.fs = `
		precision highp float;
        uniform sampler2D tDiffuse;
        uniform sampler2D image;
        uniform vec2 resolution;
        uniform vec2 size;
        uniform float time;
        uniform float scroll;
        uniform float randomSeed;

        // uniform float difference;

        const vec3 chromaKeyColor = vec3(0.0, 1.0, 0.0);

        void main( void ) {
	        vec2 uv = gl_FragCoord.xy / resolution;

	        //	align-bottom
	        float _aspect = resolution.x / resolution.y / ( size.x / size.y );
	        uv.y /= _aspect;

	        vec4 tex = texture2D( tDiffuse, uv );
	        float diff = length(chromaKeyColor.rgb - tex.rgb);
	        if(diff < 0.75){
	            // discard;
	        }else{
	            gl_FragColor = tex;
	        }
        }
        `
		this.init();


		let _isPlaying = false;
		let _video = document.querySelector('#myvideo');
		let _btn = document.querySelector('#btn');
		_btn.addEventListener('click',()=>{

			_isPlaying = !_isPlaying;

			if( !_isPlaying )
			{
				_video.pause();
			} else {
				_video.play();
			}
			
		});

		_video.addEventListener('ended', ()=>{
			_isPlaying = false;
			_video.currentTime = 0;
		})



	}

	main.prototype = {
		init: function()
		{
			var _canvas = document.createElement('canvas');
		    _canvas.width = window.innerWidth;
		    _canvas.height = window.innerHeight;
		    this.dom.appendChild( _canvas );

		    // var gl = _canvas.getContext('webgl');
		    var gl = _canvas.getContext("webgl",{antialias:true,alpha: true}) ||_canvas.getContext("experimental-webgl",{antialias:true,alpha: true});

		    if( !gl )
		    {
		        return;
		    }

		    //  クリアカラーの設定
		    gl.clearColor( 1.0, 1.0, 1.0, 0.0 );
		    
		    // クリアする際の深度値を指定する
			gl.clearDepth(1.0);

		    //  canvasをクリアする
		    gl.clear( gl.COLOR_BUFFER_BIT );


		    //	geometry
		    var triangleData = createDrawCanvas();

		    //  頂点からbufferを生成
		    var vertexBuffer = gl.createBuffer();
		    gl.bindBuffer( gl.ARRAY_BUFFER, vertexBuffer );
		    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( triangleData.p ), gl.STATIC_DRAW );

		    var programs = shaderProgram( this.vs, this.fs );

		    //  uniforms
		    var resolution = [ _canvas.width, _canvas.height ];
		    var uniLocation = gl.getUniformLocation( programs, 'resolution' );
		    gl.uniform2fv( uniLocation, resolution );

		    var time = 0.0;
		    var uniLocation = gl.getUniformLocation( programs, 'time' );
		    gl.uniform1f( uniLocation, time );

		    var randomSeed = Math.random() * 1000.0;
		    var uniLocation = gl.getUniformLocation( programs, 'randomSeed' );
		    gl.uniform1f( uniLocation, randomSeed );

		    var scroll = window.scrollY;
		    var uniLocation = gl.getUniformLocation( programs, 'scroll' );
		    gl.uniform1f( uniLocation, scroll );

		    //	img
		    var image = new Image();
		    image.onload = () =>
		    {
				gl.activeTexture( gl.TEXTURE0 );
				const texture = gl.createTexture();
				gl.bindTexture( gl.TEXTURE_2D, texture );
				gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

				// どんなサイズの画像でもレンダリングできるようにパラメータを設定する
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

				gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
				gl.generateMipmap( gl.TEXTURE_2D );

				var texLoc = gl.getUniformLocation( programs, 'image' );
				gl.uniform1i( texLoc, 0 );
		    }
		    image.src = './assets/img/DSC00598.jpg';



		    //	video
		    let _video = document.querySelector('#myvideo');

			// テクスチャ関連
			var videoTexture = gl.createTexture(gl.TEXTURE_2D);

			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, videoTexture);
			gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, _video);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

			// gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, _video );
			gl.generateMipmap( gl.TEXTURE_2D );

			var texLocMoive = gl.getUniformLocation( programs, 'tDiffuse' );
			gl.uniform1i( texLocMoive, 0 );


		    var _size = [ _video.videoWidth, _video.videoHeight ];
		    var _videoSize = gl.getUniformLocation( programs, 'size' );
		    gl.uniform2fv( _videoSize, _size );


		    // attributes
		    var attLocation = gl.getAttribLocation( programs, 'position' );
		    gl.enableVertexAttribArray( attLocation );
		    gl.vertexAttribPointer( attLocation, 3, gl.FLOAT,false, 0, 0 );





		    //
		    window.addEventListener( "resize", function(){
		        _canvas.width = window.innerWidth;
		        _canvas.height = window.innerHeight;

		        //	screen size
		        var resolution = [ _canvas.width, _canvas.height ];
		        var uniLocation = gl.getUniformLocation( programs, 'resolution' );
		        gl.uniform2fv( uniLocation, resolution );

		        //	video
			    var _size = [ _video.videoWidth, _video.videoHeight ];
			    var _videoSize = gl.getUniformLocation( programs, 'size' );
			    gl.uniform2fv( _videoSize, _size );

		        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		    });

				// window.addEventListener('scroll', function(e) {
				// 	var uniLocation = gl.getUniformLocation( programs, 'scroll' );
				// 	gl.uniform1f( uniLocation, window.scrollY );
				// });

		    var _pastTime = Date.now() / 1000;
		    (function render(){
		        window.requestAnimationFrame( render );

		        //	movie update.
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, _video);

		        //  update uniforms value
		        var _current = Date.now() / 1000;
		        var _delta = _current - _pastTime;
		        _pastTime = _current;
		        time += _delta;

		        var uniLocation = gl.getUniformLocation( programs, 'time' );
		        gl.uniform1f( uniLocation, time );

		        draw();

		    })();

		    function draw()
		    {
		        gl.clear( gl.COLOR_BUFFER_BIT);
		        gl.drawArrays( gl.TRIANGLES, 0, triangleData.p.length / 3 );
		        gl.flush();
		    }

		    function createDrawCanvas()
		    {
		        var obj = {};
		        obj.p = [
		            -1.0, 1.0, 0.0,
		            1.0, -1.0, 0.0,
		            -1.0, -1.0, 0.0,
		            -1.0, 1.0, 0.0,
		            1.0, 1.0, 0.0,
		            1.0, -1.0, 0.0
		        ];
		        return obj;
		    }

		    function shaderProgram( vertexSource, fragmentSource )
		    {
		        var vertexShader = gl.createShader( gl.VERTEX_SHADER );
		        var fragmentShader = gl.createShader( gl.FRAGMENT_SHADER );

		        var programs = gl.createProgram();
		        gl.shaderSource( vertexShader, vertexSource );
		        gl.compileShader( vertexShader );
		        gl.attachShader( programs, vertexShader );
		        gl.shaderSource( fragmentShader, fragmentSource );
		        gl.compileShader( fragmentShader );
		        gl.attachShader( programs, fragmentShader );
		        gl.linkProgram( programs );
		        gl.useProgram( programs );
		        return programs;
		    }
		},
		update: function(){}
	}

	return main;
})();

//	execute....
window.addEventListener('load', function(e){
    var _backgroundView = new backgroundView(    document.getElementById('backgroundDOM') );
})



