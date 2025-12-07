/*

	shaders.js

	marge ....

		FilmShader.js
		HorizontalTiltShiftShader.js
		VerticalTiltShiftShader.js
		VignetteShader.js
		RGBShiftShader.js
		HueSaturationShader.js
		BloomShader.js
		InvertShader.js
		MonoShader.js

*/


/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Simple fake tilt-shift effect, modulating two pass Gaussian blur (see above) by vertical position
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 * - "r" parameter control where "focused" horizontal line lies
 */

THREE.VerticalTiltShiftShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"v":        { type: "f", value: 1.0 / 1024.0 },
		"r":        { type: "f", value: 0.35 }

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
		"uniform float v;",
		"uniform float r;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"float vv = v * abs( r - vUv.y );",

			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * vv ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * vv ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * vv ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * vv ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * vv ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * vv ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * vv ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * vv ) ) * 0.051;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};



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

THREE.RGBShiftShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },
		"angle":    { type: "f", value: Math.random() * 3.1416 * 2.0 }

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
		"uniform float angle;",

		"varying vec2 vUv;",

		"void main() {",

			//"vec2 offset = amount * vec2( cos(angle), sin(angle));",
			"vec2 offset = amount * vec2( cos(angle), sin(angle)) * length(vUv-0.5) * 2.;",	//	original
			"vec4 cr = texture2D(tDiffuse, vUv + offset);",
			"vec4 cga = texture2D(tDiffuse, vUv);",
			"vec4 cb = texture2D(tDiffuse, vUv - offset);",
			"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",

		"}"

	].join( "\n" )

};



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

THREE.InvertShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 0.005 },

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

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color = texture2D(tDiffuse, vUv);",
			"color.rgb = 1.0 - color.rgb;",
			"gl_FragColor = color;",

		"}"

	].join( "\n" )

};



/**
 * @author tapio / http://tapio.github.com/
 *
 * Hue and saturation adjustment
 * https://github.com/evanw/glfx.js
 * hue: -1 to 1 (-1 is 180 degrees in the negative direction, 0 is no change, etc.
 * saturation: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

THREE.HueSaturationShader = {

	uniforms: {

		"tDiffuse":   { type: "t", value: null },
		"hue":        { type: "f", value: 0 },
		"saturation": { type: "f", value: 0 }

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
		"uniform float hue;",
		"uniform float saturation;",

		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",

			// hue
			"float angle = hue * 3.14159265;",
			"float s = sin(angle), c = cos(angle);",
			"vec3 weights = (vec3(2.0 * c, -sqrt(3.0) * s - c, sqrt(3.0) * s - c) + 1.0) / 3.0;",
			"float len = length(gl_FragColor.rgb);",
			"gl_FragColor.rgb = vec3(",
				"dot(gl_FragColor.rgb, weights.xyz),",
				"dot(gl_FragColor.rgb, weights.zxy),",
				"dot(gl_FragColor.rgb, weights.yzx)",
			");",

			// saturation
			"float average = (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0;",
			"if (saturation > 0.0) {",
				"gl_FragColor.rgb += (average - gl_FragColor.rgb) * (1.0 - 1.0 / (1.001 - saturation));",
			"} else {",
				"gl_FragColor.rgb += (average - gl_FragColor.rgb) * (-saturation);",
			"}",

		"}"

	].join( "\n" )

};



/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Simple fake tilt-shift effect, modulating two pass Gaussian blur (see above) by vertical position
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 * - "r" parameter control where "focused" horizontal line lies
 */

THREE.HorizontalTiltShiftShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"h":        { type: "f", value: 1.0 / 1024.0 },
		"r":        { type: "f", value: 0.35 }

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
		"uniform float h;",
		"uniform float r;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"float hh = h * abs( r - vUv.y );",

			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * hh, vUv.y ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * hh, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * hh, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * hh, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * hh, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * hh, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * hh, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * hh, vUv.y ) ) * 0.051;",

			"gl_FragColor = sum;",

		"}"

	].join( "\n" )

};



/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Film grain & scanlines shader
 *
 * - ported from HLSL to WebGL / GLSL
 * http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Screen Space Static Postprocessor
 *
 * Produces an analogue noise overlay similar to a film grain / TV static
 *
 * Original implementation and noise algorithm
 * Pat 'Hawthorne' Shearon
 *
 * Optimized scanlines + noise version with intensity scaling
 * Georg 'Leviathan' Steinrohder
 *
 * This version is provided under a Creative Commons Attribution 3.0 License
 * http://creativecommons.org/licenses/by/3.0/
 */

THREE.FilmShader = {

	uniforms: {

		"tDiffuse":   { type: "t", value: null },
		"time":       { type: "f", value: 0.0 },
		"nIntensity": { type: "f", value: 0.5 },
		"sIntensity": { type: "f", value: 0.05 },
		"sCount":     { type: "f", value: 4096 },
		"grayscale":  { type: "i", value: 0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"#include <common>",
		
		// control parameter
		"uniform float time;",

		"uniform bool grayscale;",

		// noise effect intensity value (0 = no effect, 1 = full effect)
		"uniform float nIntensity;",

		// scanlines effect intensity value (0 = no effect, 1 = full effect)
		"uniform float sIntensity;",

		// scanlines effect count value (0 = no effect, 4096 = full effect)
		"uniform float sCount;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			// sample the source
			"vec4 cTextureScreen = texture2D( tDiffuse, vUv );",

			// make some noise
			"float dx = rand( vUv + time );",

			// add noise
			"vec3 cResult = cTextureScreen.rgb + cTextureScreen.rgb * clamp( 0.1 + dx, 0.0, 1.0 );",

			// get us a sine and cosine
			"vec2 sc = vec2( sin( vUv.y * sCount ), cos( vUv.y * sCount ) );",

			// add scanlines
			"cResult += cTextureScreen.rgb * vec3( sc.x, sc.y, sc.x ) * sIntensity;",

			// interpolate between source and result by intensity
			"cResult = cTextureScreen.rgb + clamp( nIntensity, 0.0,1.0 ) * ( cResult - cTextureScreen.rgb );",

			// convert to grayscale if desired
			"if( grayscale ) {",

				"cResult = vec3( cResult.r * 0.3 + cResult.g * 0.59 + cResult.b * 0.11 );",

			"}",

			"gl_FragColor =  vec4( cResult, cTextureScreen.a );",

		"}"

	].join( "\n" )

};



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


/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Vignette shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */

THREE.VignetteShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"offset":   { type: "f", value: 1.0 },
		"darkness": { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float offset;",
		"uniform float darkness;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			// Eskil's vignette

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"vec2 uv = ( vUv - vec2( 0.5 ) ) * vec2( offset );",
			"gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );",

			/*
			// alternative version from glfx.js
			// this one makes more "dusty" look (as opposed to "burned")

			"vec4 color = texture2D( tDiffuse, vUv );",
			"float dist = distance( vUv, vec2( 0.5 ) );",
			"color.rgb *= smoothstep( 0.8, offset * 0.799, dist *( darkness + offset ) );",
			"gl_FragColor = color;",
			*/

		"}"

	].join( "\n" )

};


/**
 * @author nulldesign.jp / http://nulldesign.jp/
 *
 * cloud shader
 */

THREE.CustomCloudShader = {

	uniforms: {
			'time': {value:0},
			'fogColor': { type: "c", value: 0x000000},
			'fogNear': { type: "f", value: 100.0 },
			'fogFar': { type: "f", value: 1000.0 }
	},

	vertexShader: [
		"varying vec2 vUv;",
		"void main()",
		"{",
		"	vUv = uv;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float time;",
		"uniform vec3 fogColor;",
		"uniform float fogNear;",
		"uniform float fogFar;",
		"",
		"//  uniform vec3 cameraPosition;  //  predefined;",
		"",
		"varying vec2 vUv;",
		"",
		"float random(vec2 p){",
		"    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);",
		"}",
		"",
		"float noise2(vec2 st)",
		"{",
		"    vec2 p = floor(st);",
		"    return random(p);",
		"}",
		"",
		"float noise3(vec2 st)",
		"{",
		"    vec2 p = floor(st);",
		"    return random(p + vec2(time,0.0));",
		"}",
		"",
		"float valueNoise(vec2 st)",
		"{",
		"    vec2 p = floor(st);",
		"    vec2 f = fract(st);",
		"",
		"    float v00 = random( p + vec2( 0, 0 ) );",
		"    float v10 = random( p + vec2( 1, 0 ) );",
		"    float v01 = random( p + vec2( 0, 1 ) );",
		"    float v11 = random( p + vec2( 1, 1 ) );",
		"",
		"    vec2 u = f * f * (3.0 - 2.0 * f);",
		"",
		"    float v0010 = mix(v00, v10, u.x);",
		"    float v0111 = mix(v01, v11, u.x);",
		"    return mix(v0010, v0111, u.y);",
		"}",
		"",
		"vec2 random2(vec2 st){",
		"       vec2 _st = vec2( dot(st,vec2(127.1,311.7)),",
		"                      dot(st,vec2(269.5,183.3)));",
		"       return -1.0 + 2.0 * fract( sin(_st) * 43758.5453123 );",
		"   }",
		"",
		"float perlinNoise(vec2 st)",
		"{",
		"    vec2 p = floor(st);",
		"    vec2 f = fract(st);",
		"    vec2 u = f*f*(3.0-2.0*f);",
		"",
		"    vec2 v00 = random2( p + vec2(0,0) );",
		"    vec2 v10 = random2( p + vec2(1,0) );",
		"    vec2 v01 = random2( p + vec2(0,1) );",
		"    vec2 v11 = random2( p + vec2(1,1) );",
		"",
		"    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),",
		"                 mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ),",
		"                 u.y ) + 0.5;",
		"}",
		"",
		"float fBm (vec2 st)",
		"{",
		"    float f = 0.0;",
		"    vec2 q = st;",
		"",
		"    f += 0.5000 * perlinNoise( q ); q = q*2.01;",
		"    f += 0.2500 * perlinNoise( q ); q = q*2.02;",
		"    f += 0.1250 * perlinNoise( q ); q = q*2.03;",
		"    f += 0.0625 * perlinNoise( q ); q = q*2.01;",
		"",
		"    return f;",
		"}",
		"",
		"void main()",
		"{",
		"  //vec2 uv = gl_FragCoord.xy / resolution.xy;",
		"  float _time = time * 0.00005;",
		"  float _opacity = fBm(",
		"    ( vUv + vec2( 0.0, _time ) ) * 160.0 ) *",
		"    perlinNoise( ( vUv + vec2( 0.0, - _time ) ) * 20.0 ) *",
		"    perlinNoise( ( vUv + vec2( 0.0, _time * 0.2 ) ) * 40.0 ) *",
		"    perlinNoise( ( vUv + vec2( - _time * 0.50, 0.0 ) ) * 60. ) *",
		"    perlinNoise( ( vUv + vec2( 0.0, _time * 24.0 ) ) * 12.5",
		"  );",
		"  //  _opacity *= step( mod( ( vUv.x + vUv.y ) * 512.0, 1.0 ), 0.5 );",
		"  float _nPar = cameraPosition.y/512.0;",
		"  _opacity *= sin( mod( ( vUv.x + vUv.y - _time * _nPar ) * 512.0 / _nPar * 4.0, 1.0 ) * 3.1416 * 2.0 ) * 0.5 + 0.5;",
		"  _opacity *= 2.0;",
		"  _opacity = _opacity * 0.96 + 0.04;",
		"",
		"  gl_FragColor = vec4( 1.0, 1.0, 1.0, _opacity);",
		"",
		"",
		"  //  FOG",
		"  #ifdef USE_FOG",
		"      #ifdef USE_LOGDEPTHBUF_EXT",
		"          float depth = gl_FragDepthEXT / gl_FragCoord.w;",
		"      #else",
		"          float depth = gl_FragCoord.z / gl_FragCoord.w;",
		"      #endif",
		"      float fogFactor = smoothstep( fogNear, fogFar, depth );",
		"      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );",
		"  #endif",
		"}"

	].join( "\n" )

};


/**
 * @author nulldesign.jp / http://nulldesign.jp/
 *
 * AirLine shader
 */

THREE.CustomAirLineShader = {

	uniforms: {
			'time': {value:0},
			'color': {value: new THREE.Color( 0xCC3333 )	},
			'fogColor': { type: "c", value: 0x000000},
			'fogNear': { type: "f", value: 100.0 },
			'fogFar': { type: "f", value: 1000.0 }
	},

	vertexShader: [

		"attribute float opacities;",
		"varying float vOpacities;",
		"void main()",
		"{",
		"	vOpacities = opacities;",
		"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"

	].join( "\n" ),

	fragmentShader: [

		"#include <common>",
		"",
		"uniform float time;",
		"uniform vec3 color;",
		"uniform vec3 fogColor;",
		"uniform float fogNear;",
		"uniform float fogFar;",
		"",
		"varying float vOpacities;",
		"",
		"void main()",
		"{",
		"  //vec2 uv = gl_FragCoord.xy / resolution.xy;",
		"  float _time = time * 0.0001;",
		"",
		"  gl_FragColor = vec4( color.rgb, vOpacities );",
		"  gl_FragColor.a *= 3.0;",
		"",
		"  //  FOG",
		"  #ifdef USE_FOG",
		"      #ifdef USE_LOGDEPTHBUF_EXT",
		"          float depth = gl_FragDepthEXT / gl_FragCoord.w;",
		"      #else",
		"          float depth = gl_FragCoord.z / gl_FragCoord.w;",
		"      #endif",
		"      float fogFactor = smoothstep( fogNear, fogFar, depth );",
		"      gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );",
		"  #endif",
		"}"

	].join( "\n" )

};








