

THREE.NoiseShader = {
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
		"varying vec2 vUv;",

		"float random (in vec2 st) {",
    	"	return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);",
		"}",

		"void main() {",
			"gl_FragColor = texture2D(tDiffuse, vUv );",
			"gl_FragColor.rgb *= random(vUv+time) * 0.2 + 0.9;",
		"}"

	].join("\n")

};
