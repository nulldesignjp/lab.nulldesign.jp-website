
THREE.NoiseShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		"time":     { type: "f", value: 0.0 }
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
		"float rand(vec2 co){",
			"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
		"}",

		"void main() {",
			"vec4 color = texture2D(tDiffuse,vUv);",
			"float value = rand( vec2( color.x, color.y ) ) * 0.4 + 0.6;",
			"gl_FragColor = vec4(color.xyz * value, 1.0 );",
		"}"

	].join("\n")

};
