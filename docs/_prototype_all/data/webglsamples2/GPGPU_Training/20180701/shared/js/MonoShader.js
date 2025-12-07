

THREE.MonoShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
	},

	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
		"vUv = uv;",
		"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join("\n"),

	fragmentShader: [
		"#define R_LUMINANCE 0.298912",
		"#define G_LUMINANCE 0.586611",
		"#define B_LUMINANCE 0.114478",

		"uniform sampler2D tDiffuse;",
		"const vec3 monochromeScale = vec3(R_LUMINANCE, G_LUMINANCE, B_LUMINANCE);",
		
		"varying vec2 vUv;",
		"void main() {",
		"vec4 color = texture2D(tDiffuse, vUv);",
		"float grayColor = dot(color.rgb, monochromeScale);",
		"color = vec4(vec3(grayColor), 1.0);",
		"gl_FragColor = vec4(color);",
		"}"

	].join("\n")

};
