/*
	script.js
	v 2.0.0
*/

var backgroundView = (function(){
	function main( e )
	{
		this.dom = e;
		this.vs = `
attribute vec3 position;
void main()
{
	gl_Position = vec4( position, 1.0 );
}
`;
		this.fs = `
precision highp float;
uniform float randomSeed;
uniform float scroll;
uniform float time;
uniform vec2 resolution;
const float Pi = 3.14159;

void main()
{
	//	uv
    vec2 st = (gl_FragCoord.xy - 0.5 * resolution.xy) / min( resolution.x, resolution.y );

    vec2 _st = vec2(0,0);
    float _time = time * 0.1;
    _st.x = sin( _time ) * st.x - cos( _time ) * st.y;
    _st.y = cos( _time ) * st.x + sin( _time ) * st.y;
    st = _st;


    //	IN - uniformに調整？
    vec3 color0 = vec3( 0.9, 0.1, 0.1 );
    vec2 position0 = vec2( -0.35, 0.0 );
    float _radius0 = 0.4;
    float _boke0 = _radius0 * 0.75;

    vec3 color1 = vec3( 0.1, 0.1, 0.9 );
    vec2 position1 = vec2( 0.24, 0.0 );
    float _radius1 = 0.6;
    float _boke1 = _radius1 * 0.75;

    //	motion
    position0.y = cos( time * 0.309 ) * 0.15;
    position1.y = sin( time * 0.237 ) * 0.125;

    position0.x = cos( time * 0.1309 ) * 0.15 - 0.23;
    position1.x = sin( time * 0.291 ) * 0.125 + 0.15;

    //	scale
    // float _scale = resolution.x / resolution.y;
    // _scale = _scale < 1.0? 1.0 : _scale;
    float _scale = 1.0;

    //	left circle
    float _dist0 = length( position0 - st );
    float _opacity0 = 1.0 - smoothstep( ( _radius0 - _boke0 ) * _scale, _radius0 * _scale, _dist0 );
    vec3 _color0 = color0 * _opacity0;

    //	right circle
    float _dist1 = length( position1 - st );
    float _opacity1 = 1.0 - smoothstep( ( _radius1 - _boke1 ) * _scale, _radius1 * _scale, _dist1 );
    vec3 _color1 = color1 * _opacity1;

    //  color blend
    vec3 _color = _color0 + _color1;
    _color = min( _color, vec3( 1.0 ) );

    //  加算色
    //	gl_FragColor = vec4( _color, 1.0 );

    //  減算色
    gl_FragColor = vec4( 1.0 - _color, 1.0 );


}
`;
		this.init();
	}

	main.prototype = {
		init: function()
		{
			var _canvas = this.dom;

	    var gl = _canvas.getContext("webgl",{antialias:false}) ||_canvas.getContext("experimental-webgl");

	    //	Webgl利用できない環境
	    if( !gl )
	    {
	        return;
	    }

	    //  クリアカラーの設定
	    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
		    
		    // クリアする際の深度値を指定する
			gl.clearDepth(1.0);

		    //  canvasをクリアする
		    gl.clear( gl.COLOR_BUFFER_BIT);


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


		    // attributes
		    var attLocation = gl.getAttribLocation( programs, 'position' );
		    gl.enableVertexAttribArray( attLocation );
		    gl.vertexAttribPointer( attLocation, 3, gl.FLOAT,false, 0, 0 );

		    //	resize
		    window.addEventListener( "resize", function(){
		        _canvas.width = window.innerWidth;
		        _canvas.height = window.innerHeight;

		        var resolution = [ _canvas.width, _canvas.height ];
		        var uniLocation = gl.getUniformLocation( programs, 'resolution' );
		        gl.uniform2fv( uniLocation, resolution );

		        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
		    })

		    //	scroll
				window.addEventListener('scroll', function(e) {
			        var uniLocation = gl.getUniformLocation( programs, 'scroll' );
			        gl.uniform1f( uniLocation, window.scrollY );
				});


		        _canvas.width = window.innerWidth;
		        _canvas.height = window.innerHeight;
		        var resolution = [ _canvas.width, _canvas.height ];
		        var uniLocation = gl.getUniformLocation( programs, 'resolution' );
		        gl.uniform2fv( uniLocation, resolution );
		        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		    var _pastTime = Date.now() / 1000;
		    (function render(){
		        window.requestAnimationFrame( render );

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

window.addEventListener('load', function(e){
    var _backgroundView = new backgroundView(    document.getElementById('backgroundDOM') );
})



