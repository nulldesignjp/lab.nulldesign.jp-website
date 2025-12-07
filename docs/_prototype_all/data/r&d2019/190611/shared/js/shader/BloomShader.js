/**
 * @author felixturner / http://airtight.cc/
 *
 * RGB Shift Shader
 * Shifts red and blue channels from center in opposite directions
 * Ported from http://kriss.cx/tom/2009/05/rgb-shift/
 * by Tom Butterworth / http://kriss.cx/tom/
 *
 * amount: shift distance (1 is width of input)
 * angle: shift angle in radians
 */

THREE.BloomShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.92 },
		"power":   { type: "f", value: 32.0 },

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
		"uniform float amount;",
		"uniform float power;",

		"varying vec2 vUv;",

		"void main() {",

			//"vec2 offset = amount * vec2( cos(angle), sin(angle));",
			//"vec2 offset = amount * vec2( cos(angle), sin(angle)) * length(vUv-0.5) * 2.;",	//	original

			"vec4 color = texture2D(tDiffuse, vUv);",
			"",

			"float luminance = ( 0.298912 * color.r + 0.586611 * color.g + 0.114478 * color.b );",
			"if( luminance > amount ){",
			"	vec4 bcolor = texture2D( tDiffuse, vUv );",
			"	bcolor *= 0.34;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -1.0,  1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  0.0,  1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  1.0,  1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -1.0,  0.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  1.0,  0.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -1.0, -1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  0.0, -1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  1.0, -1.0 ) / 256.0 ) * 0.04;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -2.0,  2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -1.0,  2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  0.0,  2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  1.0,  2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  2.0,  2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -2.0,  1.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  2.0,  1.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -2.0,  0.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  2.0,  0.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -2.0, -1.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  2.0, -1.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -2.0, -2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2( -1.0, -2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  0.0, -2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  1.0, -2.0 ) / 256.0 ) * 0.02;",
			"	bcolor += texture2D(tDiffuse, vUv + vec2(  2.0, -2.0 ) / 256.0 ) * 0.02;",
			"	color += bcolor;",

			"	color.rgb += color.rgb * ( luminance - amount ) * power;",
			"};",
			"gl_FragColor = color + color * vec4( 0.01, 0.44, 0.7, 1.0 );",

		"}"

	].join( "\n" )

};
