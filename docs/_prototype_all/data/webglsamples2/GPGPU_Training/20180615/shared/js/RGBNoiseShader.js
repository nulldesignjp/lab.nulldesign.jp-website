

THREE.RGBNoiseShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"resolution":     { type: "f", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
	},

	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float time;",
		"uniform vec2 resolution;",
		"varying vec2 vUv;",

		"float random (in vec2 st) {",
    	"	return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);",
		"}",



		"float perlinNoise(vec2 st)",
		"{",
		"    vec2 p = floor(st);",
		"    vec2 f = fract(st);",
		"    vec2 u = f*f*(3.0-2.0*f);",
		"",
		"    vec2 v00 = random( p + vec2(0,0) );",
		"    vec2 v10 = random( p + vec2(1,0) );",
		"    vec2 v01 = random( p + vec2(0,1) );",
		"    vec2 v11 = random( p + vec2(1,1) );",
		"",
		"    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),",
		"                 mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ),",
		"                 u.y ) + 0.5;",
		"}",
		"",
		"float fBm (vec2 st)",
		"{",
		"    float f = 0.0;",
		"    vec2 q = st;",
		"",
		"    f += 0.5000 * perlinNoise( q ); q = q*2.01;",
		"    f += 0.2500 * perlinNoise( q ); q = q*2.02;",
		"    f += 0.1250 * perlinNoise( q ); q = q*2.03;",
		"    f += 0.0625 * perlinNoise( q ); q = q*2.01;",
		"",
		"    return f;",
		"}",

		"void main() {",
		"	float _range = ( 16.0 / resolution.x ) - ( 8.0 / resolution.x );",
		// "	float _x = perlinNoise( vec2(sin(time)*0.1) ) * _range;",
		// "	float _y = perlinNoise( vec2(cos(time)*0.1) ) * _range;",
		// "	float _z = perlinNoise( vec2(tan(time)*0.1) ) * _range;",
		"	float _x = fBm( vec2(sin(time)*0.1) ) * _range;",
		"	float _y = fBm( vec2(cos(time)*0.1) ) * _range;",
		"	float _z = fBm( vec2(tan(time)*0.1) ) * _range;",
		"	float r = texture2D(tDiffuse, vUv + vec2( _x, 0 ) ).r;",
		"	float g = texture2D(tDiffuse, vUv + vec2( _y, 0 ) ).g;",
		"	float b = texture2D(tDiffuse, vUv + vec2( _z, 0 ) ).b;",
			"gl_FragColor = vec4(r,g,b,1.0);",
		"}"

	].join("\n")

};
