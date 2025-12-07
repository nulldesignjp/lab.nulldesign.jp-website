/*
	libs.js
	auth: TrekTrack @HAKUHODO i-studio, Inc.
	url: http://trektrack.jp/
*/

var Sky = (function(){

	function Sky( v3 ){
		this.mesh;
		this.init( v3 );
	}

	Sky.prototype = {
		init : function( v3 ){

			//	var _g = new THREE.IcosahedronGeometry( 500, 1 );
			var _g = new THREE.SphereGeometry( 500, 18, 12 );
			var _vertexShader = [
				"const int NUM_DATA = 6;",
				"uniform vec3 colors[NUM_DATA];",
				"uniform float intervals[NUM_DATA];",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",
				"void main()	{",
				"	vPosition = position;",
				"	for( int i = 0; i < NUM_DATA; i++ )",
				"	{",
				"		vColors[i] = colors[i];",
				"		vIntervals[i] = intervals[i];",
				"	}",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}",
			].join( "\n" );
			var _fragmentShader = [
				"const int NUM_DATA = 6;",
				"uniform float time;",
				"uniform vec3 light;",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",

				"void main()	{",
				"	vec3 pos = normalize( vPosition );",
				"	pos = ( pos + 1.0 ) * 0.5;",
				"	float _p = pos.y;",

				"	float i0 = vIntervals[0];",
				"	float i1 = vIntervals[1];",
				"	float i2 = vIntervals[2];",
				"	float i3 = vIntervals[3];",
				"	float i4 = vIntervals[4];",
				"	float i5 = vIntervals[5];",

				"	vec4 _c0 = vec4( vColors[0] / 255.0, 1.0 );",
				"	vec4 _c1 = vec4( vColors[1] / 255.0, 1.0 );",
				"	vec4 _c2 = vec4( vColors[2] / 255.0, 1.0 );",
				"	vec4 _c3 = vec4( vColors[3] / 255.0, 1.0 );",
				"	vec4 _c4 = vec4( vColors[4] / 255.0, 1.0 );",
				"	vec4 _c5 = vec4( vColors[5] / 255.0, 1.0 );",

				"	if( _p < i1 ){",
				"		_c0 *= 1.0 - ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c1 *= ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i2 && _p > i1 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 1.0 - ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c2 *= ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i3 && _p > i2 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 1.0 - ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c3 *= ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i4 && _p > i3 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 1.0 - ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c4 *= ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c5 *= 0.0;",
				"	} else {",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 1.0 - ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"		_c5 *= ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"	}",
				"	vec4 color = _c0 + _c1 + _c2 + _c3 + _c4 + _c5;",

				//	THE SUN
				"	float _d = distance( normalize( light ), normalize( vPosition ) )*100.0;",
				"	color += vec4( 1.0,1.0,1.0,0.1) * 3.0/_d;",

				"	gl_FragColor = color;",
				"}",
			].join( "\n" );

			var _colors = [
				new THREE.Color(0,0,0),
				new THREE.Color( 0,	0,	0 ),
				new THREE.Color( 0,	90,	117 ),
				new THREE.Color( 255,	255,	255 ),
				new THREE.Color( 92,	169,	199 ),
				new THREE.Color( 86,	183,	226 )
			];
			var _m = new THREE.ShaderMaterial({
				uniforms: {
					"time": { value: 0.0},
					"light": { value: v3},
					"colors" : {	type: "v4v",	value:  _colors },
					"intervals": {
						value: [
							0.0,
							0.1,
							0.35,
							0.5,
							0.65,
							1.0
						]
					}
				},
				vertexShader: _vertexShader,
				fragmentShader: _fragmentShader,
				transparent: true,
				side: THREE.BackSide
			});

			this.mesh = new THREE.Mesh( _g, _m );
		}
	};
	return Sky;
})();