

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

		"void main() {",
		"	float _range = ( ( 64.0 / resolution.x ) - ( 32.0 / resolution.x ) ) * random(vUv);",
		"	float _x = random( vec2(sin(time)*0.16) ) * _range;",
		"	float _y = random( vec2(cos(time)*0.12) ) * _range;",
		"	float _z = random( vec2(tan(time)*0.15) ) * _range;",
		"	float r = texture2D(tDiffuse, vUv + vec2( _x, 0 ) ).r;",
		"	float g = texture2D(tDiffuse, vUv + vec2( _y, 0 ) ).g;",
		"	float b = texture2D(tDiffuse, vUv + vec2( _z, 0 ) ).b;",
		"	gl_FragColor = texture2D(tDiffuse, vUv) + vec4(r,g,b,1.0);",
		"	gl_FragColor.rgb = gl_FragColor.rgb * 0.5;",
		"}"

	].join("\n")

};
