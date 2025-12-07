

THREE.VignetteShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"intensity":     { type: "f", value: 1.0 },
		"distance":     { type: "f", value: 4.0 }
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
		"uniform float intensity;",
		"uniform float distance;",
		
		"varying vec2 vUv;",
		"void main() {",
			"gl_FragColor = texture2D(tDiffuse, vUv);",
			"float _d = length( vUv - 0.5 ) * intensity;",
			"_d = pow( _d, distance );",
			"_d = 1.0 - _d;",
			"gl_FragColor.rgb *= _d;",
		"}"

	].join("\n")

};
