var MonoShader = {
	uniforms: {
		"tDiffuse": { type:"t", value: null }
	},
	vertexShader: [
		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),

	fragmentShader: [
			"uniform sampler2D tDiffuse;",
			"varying vec2 vUv;",
			"const float redScale   = 0.298912;",
			"const float greenScale = 0.586611;",
			"const float blueScale  = 0.114478;",
			"const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);",
		"void main() {",
			"vec4 smpColor = texture2D(tDiffuse, vUv);",
			"float grayColor = dot(smpColor.rgb, monochromeScale);",
			"smpColor = vec4(vec3(grayColor), 1.0);",
			"gl_FragColor = smpColor;",
		"}"

	].join( "\n" )

};
