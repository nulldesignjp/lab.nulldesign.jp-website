

THREE.BackBufferShader = {
	uniforms: {
		"tDiffuse": { value: null },
		"backbuffer":     { value: null },
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
		"uniform sampler2D backbuffer;",
		"uniform vec2 resolution;",
		
		"varying vec2 vUv;",
		"void main() {",
		"	vec4 tex1 = texture2D(tDiffuse, vUv);",


"vec4 b = texture2D( backbuffer, vUv );",
"b *= 0.32;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0,  1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  0.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  0.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0, -1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0, -1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0, -1.0)) / resolution.xy ) * 0.04;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0,  2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  1.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  1.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  0.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  0.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0, -1.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0, -1.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0, -2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0, -2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0, -2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0, -2.0)) / resolution.xy ) * 0.02;",
"b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0, -2.0)) / resolution.xy ) * 0.02;",
//"gl_FragColor = b * 0.8;",



			"gl_FragColor = b * 0.96 + tex1;",
		"}"

	].join("\n")

};
