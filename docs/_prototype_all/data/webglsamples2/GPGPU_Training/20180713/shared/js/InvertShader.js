

THREE.InvertShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		//"time":     { type: "f", value: 0.0 },
		//"resolution":     { type: "f", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
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
		"varying vec2 vUv;",

		"void main() {",
			"gl_FragColor = texture2D(tDiffuse, vUv);",
			"gl_FragColor.rgb = 1.0 - gl_FragColor.rgb;",
		"}"

	].join("\n")

};
