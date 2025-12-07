
THREE.ToyCamShader = {
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
			"vec4 color = vec4(0.0,0.0,0.0,1.0);",
			"if( vUv.x>.5 && vUv.y>.5 ){	color += texture2D( tDiffuse, vec2( pow(vUv.x - 0.5, 2.0)+.5, pow( vUv.y - 0.5, 2.0)+.5 ) );}",
			"if( vUv.x<.5 && vUv.y>.5 ){	color += texture2D( tDiffuse, vec2( -pow(.5 - vUv.x, 2.0)+.5, pow( vUv.y - 0.5, 2.0)+.5 ) );}",
			"if( vUv.x>.5 && vUv.y<.5 ){	color += texture2D( tDiffuse, vec2( pow(vUv.x - 0.5, 2.0)+.5, -pow( - vUv.y + 0.5, 2.0)+.5 ) );}",
			"if( vUv.x<.5 && vUv.y<.5 ){	color += texture2D( tDiffuse, vec2( -pow(.5 - vUv.x, 2.0)+.5, -pow( - vUv.y + 0.5, 2.0)+.5 ) );}",
			//"vec4 color = texture2D( tDiffuse, vec2( pow(vUv.x - 0.5, 2.0)+.5, pow( vUv.y - 0.5, 2.0)+.5 ) );",
			//"vec3 fColor = normalize(color.rgb);",
			"gl_FragColor = color;",
		"}"

  
    // // 青っぽくして適用
    // gl_FragColor = vec4(
    //   vec3(
    //     color.r *   0.0 / 255.0,
    //     color.g * 153.0 / 255.0,
    //     color.b * 204.0 / 255.0
    //   ),
    //   1.0
    // );

	].join("\n")

};
