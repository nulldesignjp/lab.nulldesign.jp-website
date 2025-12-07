

THREE.BlurShader = {
	uniforms: {
		"tDiffuse": { type: "t", value: null },
		// "time":     { type: "f", value: 0.0 },
		// "resolution":     { type: "f", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
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

		"void main() {",

		"	vec4 destColor = texture2D(tDiffuse, vUv );",
        "	destColor *= 0.36;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-1.0,  1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 0.0,  1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 1.0,  1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-1.0,  0.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 1.0,  0.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-1.0, -1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 0.0, -1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 1.0, -1.0 ) / resolution.xy ) ) * 0.04;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-2.0,  2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-1.0,  2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 0.0,  2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 1.0,  2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 2.0,  2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-2.0,  1.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 2.0,  1.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-2.0,  0.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 2.0,  0.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-2.0, -1.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 2.0, -1.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-2.0, -2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2(-1.0, -2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 0.0, -2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 1.0, -2.0 ) / resolution.xy ) ) * 0.02;",
        "	destColor += texture2D( tDiffuse, ( vUv + vec2( 2.0, -2.0 ) / resolution.xy ) ) * 0.02;",
		"	gl_FragColor = destColor;",
		"}"

	].join("\n")

};
