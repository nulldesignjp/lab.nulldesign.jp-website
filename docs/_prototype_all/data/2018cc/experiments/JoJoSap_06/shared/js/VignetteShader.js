

THREE.VignetteShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 },
		"resolution":     { type: "f", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
	},

	vertexShader: [
		"void main() {",
		//"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform float time;",
		"uniform vec2 resolution;",

		"void main() {",
			"vec2 uv = gl_FragCoord.xy / resolution.xy;",
			"gl_FragColor = texture2D(tDiffuse, uv);",
			"float _d = length( uv - 0.5 );",
			"_d = pow( _d, 2.0 );",
			"_d = 1.0 - _d;",
			"gl_FragColor.rgb *= _d;",
		"}"

	].join("\n")

};
