/*
	ofxNDShaderEffect.js
*/

var ofxNDShaderEffect = ofxNDShaderEffect || {};

ofxNDShaderEffect.ef00 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"void main() {",
				"	 vec2 uv = gl_FragCoord.xy / resolution.xy;",
					"vec4 img = texture2D( tDiffuse,  uv);",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef01 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
				"grid": {type: "f", value: 10.0 },
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
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"uniform float grid;",
				"varying vec2 vUv;",
				"void main() {",
					//"float dist = distance( gl_FragCoord.xy, mouse ) / 64.0;",
					"float _x = floor( gl_FragCoord.x / grid ) * grid - mod( gl_FragCoord.x, grid );",
					"float _y = floor( gl_FragCoord.y / grid ) * grid - mod( gl_FragCoord.y, grid );",
					"vec2 pos2 = ( vec2( _x, _y ) / resolution );",
					"vec4 img = texture2D( tDiffuse, ( vUv + pos2 ) * 0.5 );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef02 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"grid": {type: "f", value: 10.0 },
				"time": {type: "f", value: 0 },
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
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float grid;",
				"uniform float time;",
				"varying vec2 vUv;",
				"void main() {",
					//"float dist = distance( gl_FragCoord.xy, mouse ) / 64.0;",
					"float _x = cos( gl_FragCoord.x / grid + time ) * 32.0;",
					"float _y = sin( gl_FragCoord.y / grid + time ) * 32.0;",
					"vec2 pos2 = ( vec2( _x, _y ) / resolution );",
					"vec4 img = texture2D( tDiffuse, vUv + pos2 );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef03 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( window.innerWidth * 0.5, window.innerHeight * 0.5 ) },
				"vec": {type: "v2", value: new THREE.Vector2( (Math.random()-.5)*0.01,(Math.random()-.5)*0.01 ) },
				"time": {type: "f", value: 0 },
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
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"varying vec2 vUv;",
				"void main() {",
					"float dist = distance( gl_FragCoord.xy, mouse ) / 64.0;",
					"vec2 pos2 = ( mouse / resolution ) - 0.5;",
					"vec4 img = texture2D( tDiffuse, vUv / dist );",
					//"img *= texture2D( tDiffuse, vUv + pos2 / dist );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef04 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"vec": {type: "v2", value: new THREE.Vector2( (Math.random()-.5)*0.01,(Math.random()-.5)*0.01 ) },
				"time": {type: "f", value: 0 },
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
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"varying vec2 vUv;",
				"void main() {",
					"float dist = distance( gl_FragCoord.xy, mouse ) / 512.0;",
					"vec2 pos2 = ( mouse / resolution ) - 0.5;",
					"vec4 img = texture2D( tDiffuse, vUv - pos2 / dist );",
					//"img *= texture2D( tDiffuse, vUv + pos2 / dist );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef05 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
				"rand": {type: "f", value: Math.random() * 100 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"void main() {",
					"pos = position;",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"uniform float rand;",
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"float rands(vec2 co){",
					"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
				"}",
				"void main() {",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2(floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0,0) );",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2( mod( floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0, 1.0 ),0) );",
					"float def = rands( vec2( time, time * rand ) );",
					"float valY = floor( pos.y / def );",
					"vec2 offset = vec2( mod( rands( vec2( valY, time * 0.001 ) ), 1.0 ), 0. );",
					"vec4 img = texture2D( tDiffuse, mod( vUv + offset * 0.2, 1.0 ) );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef06 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
				"rand": {type: "f", value: Math.random() * 100 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"void main() {",
					"pos = position;",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"uniform float rand;",
				"varying vec3 pos;",
				"varying vec2 vUv;",
				"float rands(vec2 co){",
					"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
				"}",
				"void main() {",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2(floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0,0) );",
					//"vec4 img = texture2D( tDiffuse, vUv + vec2( mod( floor(sin(pos.y/10.0*rand+rand*rand))*1.0*rand/100.0, 1.0 ),0) );",
					"float def = rands( vec2( time, time * rand ) );",
					"float valY = floor( pos.y / def );",
					"vec2 offset = vec2( mod( rands( vec2( valY, time * 0.001 ) ), 1.0 ), 0. );",
					"vec4 img = texture2D( tDiffuse, mod( ( vUv + offset * 0.2 ) * rand, 1.0 ) );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef07 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0 },
				"step": {type: "i", value: Math.floor( Math.random() * 5 ) + 1 }
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
				"uniform vec2 resolution;",
				"uniform vec2 mouse;",
				"uniform float time;",
				"uniform int step;",
				"varying vec2 vUv;",
				"void main() {",
					"vec4 img = texture2D( tDiffuse, mod( vUv * float(step), 1.0 ) );",
					"gl_FragColor = img;",
				"}"
			].join("\n")
		};

//	http://transitions.glsl.io/transition/b86b90161503a0023231
ofxNDShaderEffect.ef08 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"progress": {type: "f", value: 0 },
				"strength": {type: "f", value: 0.5 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float progress;",
				"uniform float strength;",
				"const float PI = 3.141592653589793;",
				"",
				"float Linear_ease(in float begin, in float change, in float duration, in float time) {",
				"    return change * time / duration + begin;",
				"}",
				"",
				"float Exponential_easeInOut(in float begin, in float change, in float duration, in float time) {",
				"    if (time == 0.0)",
				"        return begin;",
				"    else if (time == duration)",
				"        return begin + change;",
				"    time = time / (duration / 2.0);",
				"    if (time < 1.0)",
				"        return change / 2.0 * pow(2.0, 10.0 * (time - 1.0)) + begin;",
				"    return change / 2.0 * (-pow(2.0, -10.0 * (time - 1.0)) + 2.0) + begin;",
				"}",
				"",
				"float Sinusoidal_easeInOut(in float begin, in float change, in float duration, in float time) {",
				"    return -change / 2.0 * (cos(PI * time / duration) - 1.0) + begin;",
				"}",
				"",
				"/* random number between 0 and 1 */",
				"float random(in vec3 scale, in float seed) {",
				"    /* use the fragment position for randomness */",
				"    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);",
				"}",
				"",
				"void main() {",
				"    vec2 texCoord = gl_FragCoord.xy / resolution.xy;",
				"",
				"    // Linear interpolate center across center half of the image",
				"    vec2 center = vec2(0.5, 0.5);",
				"    float dissolve = Exponential_easeInOut(0.0, 1.0, 1.0, progress);",
				"",
				"    // Mirrored sinusoidal loop. 0->strength then strength->0",
				"    float strength = Sinusoidal_easeInOut(0.0, strength, 0.5, progress);",
				"",
				"    vec3 color = vec3(0.0);",
				"    float total = 0.0;",
				"    vec2 toCenter = center - texCoord;",
				"",
				"    /* randomize the lookup values to hide the fixed number of samples */",
				"    float offset = random(vec3(12.9898, 78.233, 151.7182), 0.0);",
				"",
				"    for (float t = 0.0; t <= 40.0; t++) {",
				"        float percent = (t + offset) / 40.0;",
				"        float weight = 4.0 * (percent - percent * percent);",
				"        color += texture2D(tDiffuse, texCoord + toCenter * percent * strength).rgb * weight;",
				"        total += weight;",
				"    }",
				"    gl_FragColor = vec4(color / total, 1.0);",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef09 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0.0 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float time;",
				"const vec3 WaterColor = vec3(.5,1,1);",
				"",
				"void main()",
				"{",
				"	vec2 uv = gl_FragCoord.xy / resolution.xy;",
				"    float sepoffset = 0.005*cos(time*3.0);",
				"    float xoffset = 0.005*cos(time*3.0+200.0*uv.y);",
				"    float yoffset = ((0.3 - uv.y)/0.3) * 0.05 * (1.0+cos(time*3.0+50.0*uv.y));",
				"    vec4 tcolor = texture2D(tDiffuse, vec2(uv.x+xoffset , -1.0*(0.6 -uv.y+ yoffset)+0.5));",
				"    gl_FragColor = vec4(mix(tcolor.rgb, WaterColor, 0.0), 1.0);",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef10 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0.0 },
				"colorStep": {type: "f", value: 4.0 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float time;",
				"uniform float colorStep;",
				"",
				"void main()",
				"{",
				"	vec2 uv = gl_FragCoord.xy / resolution.xy;",
				"   vec4 tcolor = texture2D(tDiffuse, uv);",
				"	tcolor = floor( tcolor * colorStep ) / colorStep;",
				"   gl_FragColor = vec4(tcolor.rgb, 1.0);",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef11 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0.0 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float time;",
				"",
				"void main()",
				"{",
				"    vec2 pos = 256.0 * gl_FragCoord.xy/resolution.x + time;",
				"	 vec2 uv = gl_FragCoord.xy / resolution.xy;",
				"",
				"    vec3 col = texture2D( tDiffuse, uv ).rgb;",
				"    for( int i=0; i<6; i++ ) ",
				"    {",
				"        vec2 a = floor(pos);",
				"        vec2 b = fract(pos);",
				"        ",
				"        vec4 w = fract((sin(a.x*7.0+31.0*a.y + 0.01*time)+vec4(0.035,0.01,0.0,0.7))*13.545317);",
				"                ",
				"        col += col *                                   // color",
				"               smoothstep(0.45,0.55,w.w) *               // intensity",
				"               sqrt( 16.0*b.x*b.y*(1.0-b.x)*(1.0-b.y) ); // pattern",
				"        ",
				"        pos /= 2.0; // lacunarity",
				"        col /= 2.0; // attenuate high frequencies",
				"    }",
				"    ",
				"    col = pow( 2.5*col, vec3(1.0,1.0,0.7) );    // contrast and color shape",
				"    ",
				"    gl_FragColor = vec4( col, 1.0 );",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.ef12 =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": {type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"mouse": {type: "v2", value: new THREE.Vector2( 0, 0 ) },
				"time": {type: "f", value: 0.0 },
			},
			vertexShader: [
				"void main() {",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float time;",
				"",
				"#define RAIN_SPEED 6.00 // Speed of rain droplets",
				"#define DROP_SIZE  10.0  // Higher value lowers, the size of individual droplets",
				"",
				"float rand(vec2 co){",
				"    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
				"}",
				"",
				"float rchar(vec2 outer, vec2 inner, float globalTime) {",
				"	//return float(rand(floor(inner * 2.0) + outer) > 0.9);",
				"	",
				"	vec2 seed = floor(inner * 4.0) + outer.y;",
				"	if (rand(vec2(outer.y, 23.0)) > 0.98) {",
				"		seed += floor((globalTime + rand(vec2(outer.y, 49.0))) * 3.0);",
				"	}",
				"	",
				"	return float(rand(seed) > 0.5);",
				"}",
				"",
				"void main() {",
				"",
				"	vec2 position = gl_FragCoord.xy / resolution.xy;",
				"	vec2 uv = vec2(position.x, position.y);",
				"    position.x /= resolution.x / resolution.y;",
				"	float globalTime = time * RAIN_SPEED;",
				"	",
				"	float scaledown = DROP_SIZE;",
				"	float rx = gl_FragCoord.x / (40.0 * scaledown);",
				"	float mx = 40.0*scaledown*fract(position.x * 30.0 * scaledown);",
				"	vec4 result;",
				"	",
				"	if (mx > 12.0 * scaledown) {",
				"		result = vec4(0.0);",
				"	} else ",
				"	{",
				"        float x = floor(rx);",
				"		float r1x = floor(gl_FragCoord.x / (15.0));",
				"		",
				"",
				"		float ry = position.y*600.0 + rand(vec2(x, x * 3.0)) * 100000.0 + globalTime* rand(vec2(r1x, 23.0)) * 120.0;",
				"		float my = mod(ry, 15.0);",
				"		if (my > 12.0 * scaledown) {",
				"			result = vec4(0.0);",
				"		} else {",
				"		",
				"			float y = floor(ry / 15.0);",
				"			",
				"			float b = rchar(vec2(rx, floor((ry) / 15.0)), vec2(mx, my) / 12.0, globalTime);",
				"			float col = max(mod(-y, 24.0) - 4.0, 0.0) / 20.0;",
				"			vec3 c = col < 0.8 ? vec3(0.0, col / 0.8, 0.0) : mix(vec3(0.0, 1.0, 0.0), vec3(1.0), (col - 0.8) / 0.2);",
				"			",
				"			result = vec4(c * b, 1.0)  ;",
				"		}",
				"	}",
				"	",
				"	position.x += 0.05;",
				"",
				"	scaledown = DROP_SIZE;",
				"	rx = gl_FragCoord.x / (40.0 * scaledown);",
				"	mx = 40.0*scaledown*fract(position.x * 30.0 * scaledown);",
				"	",
				"	if (mx > 12.0 * scaledown) {",
				"		result += vec4(0.0);",
				"	} else ",
				"	{",
				"        float x = floor(rx);",
				"		float r1x = floor(gl_FragCoord.x / (12.0));",
				"		",
				"",
				"		float ry = position.y*700.0 + rand(vec2(x, x * 3.0)) * 100000.0 + globalTime* rand(vec2(r1x, 23.0)) * 120.0;",
				"		float my = mod(ry, 15.0);",
				"		if (my > 12.0 * scaledown) {",
				"			result += vec4(0.0);",
				"		} else {",
				"		",
				"			float y = floor(ry / 15.0);",
				"			",
				"			float b = rchar(vec2(rx, floor((ry) / 15.0)), vec2(mx, my) / 12.0, globalTime);",
				"			float col = max(mod(-y, 24.0) - 4.0, 0.0) / 20.0;",
				"			vec3 c = col < 0.8 ? vec3(0.0, col / 0.8, 0.0) : mix(vec3(0.0, 1.0, 0.0), vec3(1.0), (col - 0.8) / 0.2);",
				"			",
				"			result += vec4(c * b, 1.0)  ;",
				"		}",
				"	}",
				"	",
				"	result = result * length(texture2D(tDiffuse,uv).rgb) + 0.22 * vec4(0.,texture2D(tDiffuse,uv).g,0.,1.);",
				"	if(result.b < 0.5)",
				"	result.b = result.g * 0.5 ;",
				"	gl_FragColor = result;",
				"}"
			].join("\n")
		};

ofxNDShaderEffect.convergence = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'f', value: Math.random() }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform float range;",
				"varying vec3 pos;",
				"void main() {",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec4 col_r = texture2D(tDiffuse,texCoord + vec2( sin( rand ) * range * 0.01 + 0.5,0.5+sin(range)*0.1));",
					"vec4 col_l = texture2D(tDiffuse,texCoord + vec2( - cos( rand * range ) * range * 0.01 + 0.5,0.5+cos(range*1.66)*0.12));",
					"vec4 col_g = texture2D(tDiffuse,texCoord + vec2( - sin( rand * 2.143 ) * range * 0.01 + 0.5,0.5-sin(range*5.1)*0.1));",
					"col.b = col.b + col_r.b*max(1.0,sin(pos.y*1.2)*2.5)*rand;",
					"col.r = col.r + col_l.r*max(1.0,sin(pos.y*1.2)*2.5)*rand;",
					"col.g = col.g + col_g.g*max(1.0,sin(pos.y*1.2)*2.5)*rand;",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crBlueinvert = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.2,0.2,0.4);",
					"vec3 min = vec3(0.0,0.0,1.0);",
					"vec3 max = vec3(1.0,1.0,0.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crBlueraise = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.2,0.2,.25);",
					"vec3 min = vec3(0.0,0.0,0.2);",
					"vec3 max = vec3(1.0,1.0,0.8);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crGreeninvert = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.2,0.4,0.2);",
					"vec3 min = vec3(0.0,1.0,0.0);",
					"vec3 max = vec3(1.0,0.0,1.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crGreenraise = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.2,.25,0.2);",
					"vec3 min = vec3(0.0,0.2,0.0);",
					"vec3 max = vec3(1.0,0.0,1.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crHighContrast = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.8,0.8,0.8);",
					"vec3 min = vec3(0.0,0.0,0.0);",
					"vec3 max = vec3(1.0,1.0,1.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crRedinvert = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(0.4,0.2,0.2);",
					"vec3 min = vec3(1.0,0.0,0.0);",
					"vec3 max = vec3(0.0,1.0,1.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.crRedraise = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec3 k =   vec3(.25,0.2,0.2);",
					"vec3 min = vec3(0.2,0.0,0.0);",
					"vec3 max = vec3(0.8,1.0,1.0);",
					"col.r = (1.0/(1.0+pow(e,(-k.r*((col.r*2.0)-1.0)*20.0)))*(max.r-min.r)+min.r);",
					"col.g = (1.0/(1.0+pow(e,(-k.g*((col.g*2.0)-1.0)*20.0)))*(max.g-min.g)+min.g);",
					"col.b = (1.0/(1.0+pow(e,(-k.b*((col.b*2.0)-1.0)*20.0)))*(max.b-min.b)+min.b);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.cut_slider = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float rand;",
				"varying vec3 pos;",
				"void main() {",
					"vec2 texCoord = vec2(pos.x, pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec4 col_s = texture2D(tDiffuse,texCoord + 0.5 + vec2(floor(sin(pos.y * 16.0 * rand + rand * rand ) ) * 0.2 * rand, 0.0 ) );",
					"col = col_s;",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.glow = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"#define blur_w 8",
				"#define blur_T blur_w * blur_w",
				"void main() {",
					"float e = 2.718281828459045235360287471352;",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					//"int blur_w = 8;",
					"float pi = 3.1415926535;",
					"vec4 gws = vec4(0.0,0.0,0.0,1.0);",
					"float weight;",
					"float k = 1.0;",
					"weight = 1.0/(float(blur_w)*2.0+1.0)/(float(blur_w)*2.0+1.0);",
					"// This algorithm doesn't support Intel HD graphics...",
					"    for (int i = -blur_w;i < blur_w;i++){",
					"       for (int j = -blur_w;j < blur_w;j++){",
					"            weight = pow(1.0/2.0*pi*k*k,-((float(i*i)+float(j*j))/2.0*k*k))/(float(blur_w)+1.0);//ガウシアンフィルタの重み係数を計算",
					"            gws = gws + texture2D(tDiffuse,vec2(pos.x+float(j)/resolution.x*4.0,pos.y+float(i)/resolution.y*4.0) * 0.5 + 0.5)*weight*1.3;",
					"       }",
					"    }",
					"//for (int i = 0;i < blur_w*blur_w;i++)",	//	loopは固定値
					"//for (int i = 0;i < blur_T;i++)",
					"//{",
					"//	gws = gws + texture2D(tDiffuse,vec2(pos.x+float(mod(float(i),float(blur_w))),pos.y+float(i/blur_w)) * 0.5)*weight*1.3;",
					"//	gws = gws + texture2D(tDiffuse,vec2(pos.x-float(mod(float(i),float(blur_w))),pos.y+float(i/blur_w)) * 0.5)*weight*1.3;",
					"//	gws = gws + texture2D(tDiffuse,vec2(pos.x+float(mod(float(i),float(blur_w))),pos.y-float(i/blur_w)) * 0.5)*weight*1.3;",
					"//	gws = gws + texture2D(tDiffuse,vec2(pos.x-float(mod(float(i),float(blur_w))),pos.y-float(i/blur_w)) * 0.5)*weight*1.3;",
					"//}",
					"gl_FragColor.rgba = col+gws;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.invert = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"void main() {",
					"vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"col.r = 1.0 - col.r;",
					"col.g = 1.0 - col.g;",
					"col.b = 1.0 - col.b;",
					"gl_FragColor = col;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.noise = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform int range;",
				"varying vec3 pos;",
				"//",
				"// Description : Array and textureless GLSL 2D simplex noise function.",
				"//      Author : Ian McEwan, Ashima Arts.",
				"//  Maintainer : ijm",
				"//     Lastmod : 20110822 (ijm)",
				"//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.",
				"//               Distributed under the MIT License. See LICENSE file.",
				"//               https://github.com/ashima/webgl-noise",
				"//",
				"vec3 mod289(vec3 x) {",
				"	return x - floor(x * (1.0 / 289.0)) * 289.0;",
				"}",
				"",
				"vec2 mod289(vec2 x) {",
				"	return x - floor(x * (1.0 / 289.0)) * 289.0;",
				"}",
				"",
				"vec3 permute(vec3 x) {",
				"	return mod289(((x*34.0)+1.0)*x);",
				"}",
				"",
				"float snoise(vec2 v)",
				"{",
				"	const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0",
				"		0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)",
				"		-0.577350269189626,  // -1.0 + 2.0 * C.x",
				"		0.024390243902439); // 1.0 / 41.0",
				"	// First corner",
				"	vec2 i  = floor(v + dot(v, C.yy) );",
				"	vec2 x0 = v -   i + dot(i, C.xx);",
				"",
				"	// Other corners",
				"	vec2 i1;",
				"	//i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0",
				"	//i1.y = 1.0 - i1.x;",
				"	i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);",
				"	// x0 = x0 - 0.0 + 0.0 * C.xx ;",
				"	// x1 = x0 - i1 + 1.0 * C.xx ;",
				"	// x2 = x0 - 1.0 + 2.0 * C.xx ;",
				"	vec4 x12 = x0.xyxy + C.xxzz;",
				"	x12.xy -= i1;",
				"",
				"	// Permutations",
				"	i = mod289(i); // Avoid truncation effects in permutation",
				"	vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))",
				"	+ i.x + vec3(0.0, i1.x, 1.0 ));",
				"",
				"	vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);",
				"	m = m*m ;",
				"	m = m*m ;",
				"",
				"	// Gradients: 41 points uniformly over a line, mapped onto a diamond.",
				"	// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)",
				"",
				"	vec3 x = 2.0 * fract(p * C.www) - 1.0;",
				"	vec3 h = abs(x) - 0.5;",
				"	vec3 ox = floor(x + 0.5);",
				"	vec3 a0 = x - ox;",
				"",
				"	// Normalise gradients implicitly by scaling m",
				"	// Approximation of: m *= inversesqrt( a0*a0 + h*h );",
				"	m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );",
				"",
				"	// Compute final noise value at P",
				"	vec3 g;",
				"	g.x  = a0.x  * x0.x  + h.x  * x0.y;",
				"	g.yz = a0.yz * x12.xz + h.yz * x12.yw;",
				"	return 130.0 * dot(m, g);",
				"}",
				"",
				"void main (void)",
				"{",
				"	vec2 texCoord = vec2(pos.x , pos.y) * 0.5;",
				"	vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
				"	col.rgb = col.rgb + snoise(vec2(pos.x*pos.y+rand*231.5 , pos.x+pos.y-rand*324.1) * 10.0 );",
				"	float val = rand<0.5?0.5:rand;",
				"	col.rgb = col.rgb + snoise(vec2(pos.x + pos.y * val * 100.0,pos.y + pos.x * val * 100.0 ));",
				"	gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.outline = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"varying vec3 pos;",
				"#define step 3",
				"void main() {",
					"vec4 cols[step*step];",
					"vec2 texCoord = vec2(pos.x,pos.y);	//vec2(min(max(0.0,pos.x),1.0),min(max(0.0,pos.y),1.0));",
					"for (int i = 0;i < step;i++){",
					"	for (int j = 0;j < step;j++){",
					"		cols[i*step+j] = texture2D(tDiffuse,vec2((pos.x+float(j) / resolution.x * 3.0 ), (pos.y+float(i) / resolution.y * 3.0 ))*0.5 +0.5);",
					"		//cols[i*step+j].r = (cols[i*step+j].r + cols[i*step+j].g + cols[i*step+j].b) / 3.0;",
					"	}",
					"}",
					"float mn = 1.0,mx = 0.0;",
					"for (int i = 0;i < step*step;i++){",
					"	mn = min(cols[i].r,mn);",
					"	mx = max(cols[i].r,mx);",
					"}",
					"float dst = abs(1.0 - (mx-mn));",
					"gl_FragColor.a = 1.0;",
					"gl_FragColor.rgb = vec3(dst,dst,dst)+cols[4].rgb;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.shaker = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"rand" : { type: 'f', value: Math.random() },
				"blur_vec" : { type: "v2", value: new THREE.Vector2( 8, 8 )}
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float rand;",
				"varying vec3 pos;",
				"uniform vec2 blur_vec;",
				"uniform int flags;",
				"float pix_w,pix_h;",
				"void main() {",
					"pix_w = 0.1;",
					"pix_h = 0.1;",
					"vec2 texCoord = vec2(pos.x, pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec4 col_s[5],col_s2[5];",
					"for (int i = 0;i < 5;i++){",
					"	col_s[i] = texture2D(tDiffuse,texCoord + 0.5 +  vec2(-pix_w*float(i)*blur_vec.x ,-pix_h*float(i)*blur_vec.y) / resolution.x);",
					"	col_s2[i] = texture2D(tDiffuse,texCoord + 0.5 + vec2( pix_w*float(i)*blur_vec.x , pix_h*float(i)*blur_vec.y) / resolution.y);",
					"}",
					"col_s[0] = (col_s[0] + col_s[1] + col_s[2] + col_s[3] + col_s[4])/5.0;",
					"col_s2[0]= (col_s2[0]+ col_s2[1]+ col_s2[2]+ col_s2[3]+ col_s2[4])/5.0;",
					"col = (col_s[0] + col_s2[0]) / 2.0;",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.slitscan = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"range" : { type: 'i', value: 1 },
				"imgWidth" : { type: 'i', value: window.innerWidth },
				"imgHeight" : { type: 'i', value: window.innerHeight },
				"val1" : { type: 'f', value: Math.random() },
				"val2" : { type: 'f', value: Math.random() },
				"val3" : { type: 'f', value: Math.random() },
				"val4" : { type: 'f', value: Math.random() }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform int imgWidth,imgHeight;",
				"uniform float rand;",
				"uniform int flags;",
				"uniform vec2 blur_vec;",
				"uniform float val1,val2,val3,val4;",
				"int flgs;",
				"float pix_w,pix_h;",
				"varying vec3 pos;",
				"void main() {",
					"pix_w = float(imgWidth);",
					"pix_h = float(imgHeight);",
					"flgs = flags;",
					"float slit_h = val3;",
					"vec2 texCoord = vec2(floor(pos.x/slit_h) * slit_h ,pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.swell = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"resolution": { type: "v2", value: new THREE.Vector2( window.innerWidth, window.innerHeight ) },
				"rand" : { type: 'f', value: Math.random() },
				"timer" : { type: 'f', value: 0 },
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform vec2 resolution;",
				"uniform float rand;",
				"uniform float timer;",
				"varying vec3 pos;",
				"void main() {",
					"vec2 texCoord = vec2(pos.x,pos.y) * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"vec4 col_s = texture2D(tDiffuse,texCoord + 0.5 + vec2(sin(pos.y*6.15+timer*30.0)* 0.15 * rand,0));",
					"col = col_s;",
					"//    col.r = col.r * sin(rand);",
					"//	col.g = col.g * sin(rand*1.34+pos.y);",
					"//	col.b = col.b * cos(rand*1.56+pos.x*pos.y);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

ofxNDShaderEffect.twist = 
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"rand" : { type: 'f', value: Math.random() },
				"timer" : { type: 'f', value: 0 },
				"trueWidth" : { type: 'i', value: window.innerWidth },
				"trueHeight" : { type: 'i', value: window.innerHeight },
				"imgWidth" : { type: 'i', value: window.innerWidth },
				"imgHeight" : { type: 'i', value: window.innerHeight },
				"val1" : { type: 'f', value: Math.random() },
				"val2" : { type: 'f', value: Math.random() },
				"val3" : { type: 'f', value: Math.random() },
				"val4" : { type: 'f', value: Math.random() }
			},
			vertexShader: [
				"varying vec3 pos;",
				"void main() {",
					"pos = position;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float rand;",
				"uniform float timer;",
				"uniform int trueWidth,trueHeight;",
				"uniform int imgWidth,imgHeight;",
				"uniform float val1,val2,val3,val4;",
				"varying vec3 pos;",
				"void main() {",
					"vec2 texCoord = vec2(",
					"max(- 0.5,min(0.5 ,pos.x+sin(pos.y/(153.25*rand*rand)*rand+rand*val2+timer*3.0)*val3)),",
					"max(- 0.5,min(0.5,pos.y+cos(pos.x/(251.57*rand*rand)*rand+rand*val2+timer*2.4)*val3)-1.)",
					") * 0.5;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.EffectComposer = function ( renderer, renderTarget ) {

	this.renderer = renderer;

	if ( renderTarget === undefined ) {

		var parameters = {
			minFilter: THREE.LinearFilter,
			magFilter: THREE.LinearFilter,
			format: THREE.RGBAFormat,
			stencilBuffer: false
		};
		var size = renderer.getSize();
		renderTarget = new THREE.WebGLRenderTarget( size.width, size.height, parameters );

	}

	this.renderTarget1 = renderTarget;
	this.renderTarget2 = renderTarget.clone();

	this.writeBuffer = this.renderTarget1;
	this.readBuffer = this.renderTarget2;

	this.passes = [];

	if ( THREE.CopyShader === undefined )
		console.error( "THREE.EffectComposer relies on THREE.CopyShader" );

	this.copyPass = new THREE.ShaderPass( THREE.CopyShader );

};

Object.assign( THREE.EffectComposer.prototype, {

	swapBuffers: function() {

		var tmp = this.readBuffer;
		this.readBuffer = this.writeBuffer;
		this.writeBuffer = tmp;

	},

	addPass: function ( pass ) {

		this.passes.push( pass );

		var size = this.renderer.getSize();
		pass.setSize( size.width, size.height );

	},

	insertPass: function ( pass, index ) {

		this.passes.splice( index, 0, pass );

	},

	render: function ( delta ) {

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

		var maskActive = false;

		var pass, i, il = this.passes.length;

		for ( i = 0; i < il; i ++ ) {

			pass = this.passes[ i ];

			if ( ! pass.enabled ) continue;

			pass.render( this.renderer, this.writeBuffer, this.readBuffer, delta, maskActive );

			if ( pass.needsSwap ) {

				if ( maskActive ) {

					var context = this.renderer.context;

					context.stencilFunc( context.NOTEQUAL, 1, 0xffffffff );

					this.copyPass.render( this.renderer, this.writeBuffer, this.readBuffer, delta );

					context.stencilFunc( context.EQUAL, 1, 0xffffffff );

				}

				this.swapBuffers();

			}

			if ( pass instanceof THREE.MaskPass ) {

				maskActive = true;

			} else if ( pass instanceof THREE.ClearMaskPass ) {

				maskActive = false;

			}

		}

	},

	reset: function ( renderTarget ) {

		if ( renderTarget === undefined ) {

			var size = this.renderer.getSize();

			renderTarget = this.renderTarget1.clone();
			renderTarget.setSize( size.width, size.height );

		}

		this.renderTarget1.dispose();
		this.renderTarget2.dispose();
		this.renderTarget1 = renderTarget;
		this.renderTarget2 = renderTarget.clone();

		this.writeBuffer = this.renderTarget1;
		this.readBuffer = this.renderTarget2;

	},

	setSize: function ( width, height ) {

		this.renderTarget1.setSize( width, height );
		this.renderTarget2.setSize( width, height );

		for ( var i = 0; i < this.passes.length; i ++ ) {

			this.passes[i].setSize( width, height );

		}

	}

} );


THREE.Pass = function () {

	// if set to true, the pass is processed by the composer
	this.enabled = true;

	// if set to true, the pass indicates to swap read and write buffer after rendering
	this.needsSwap = true;

	// if set to true, the pass clears its buffer before rendering
	this.clear = false;

	// if set to true, the result of the pass is rendered to screen
	this.renderToScreen = false;

};

Object.assign( THREE.Pass.prototype, {

	setSize: function( width, height ) {},

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		console.error( "THREE.Pass: .render() must be implemented in derived pass." );

	}

} );

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.MaskPass = function ( scene, camera ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.clear = true;
	this.needsSwap = false;

	this.inverse = false;

};

THREE.MaskPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.MaskPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		var context = renderer.context;
		var state = renderer.state;

		// don't update color or depth

		state.buffers.color.setMask( false );
		state.buffers.depth.setMask( false );

		// lock buffers

		state.buffers.color.setLocked( true );
		state.buffers.depth.setLocked( true );

		// set up stencil

		var writeValue, clearValue;

		if ( this.inverse ) {

			writeValue = 0;
			clearValue = 1;

		} else {

			writeValue = 1;
			clearValue = 0;

		}

		state.buffers.stencil.setTest( true );
		state.buffers.stencil.setOp( context.REPLACE, context.REPLACE, context.REPLACE );
		state.buffers.stencil.setFunc( context.ALWAYS, writeValue, 0xffffffff );
		state.buffers.stencil.setClear( clearValue );

		// draw into the stencil buffer

		renderer.render( this.scene, this.camera, readBuffer, this.clear );
		renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		// unlock color and depth buffer for subsequent rendering

		state.buffers.color.setLocked( false );
		state.buffers.depth.setLocked( false );

		// only render where stencil is set to 1

		state.buffers.stencil.setFunc( context.EQUAL, 1, 0xffffffff );  // draw if == 1
		state.buffers.stencil.setOp( context.KEEP, context.KEEP, context.KEEP );

	}

} );


THREE.ClearMaskPass = function () {

	THREE.Pass.call( this );

	this.needsSwap = false;

};

THREE.ClearMaskPass.prototype = Object.create( THREE.Pass.prototype );

Object.assign( THREE.ClearMaskPass.prototype, {

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		renderer.state.buffers.stencil.setTest( false );

	}

} );

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.RenderPass = function ( scene, camera, overrideMaterial, clearColor, clearAlpha ) {

	THREE.Pass.call( this );

	this.scene = scene;
	this.camera = camera;

	this.overrideMaterial = overrideMaterial;

	this.clearColor = clearColor;
	this.clearAlpha = ( clearAlpha !== undefined ) ? clearAlpha : 1;

	this.oldClearColor = new THREE.Color();
	this.oldClearAlpha = 1;

	this.clear = true;
	this.needsSwap = false;

};

THREE.RenderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.RenderPass,

	render: function ( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		this.scene.overrideMaterial = this.overrideMaterial;

		if ( this.clearColor ) {

			this.oldClearColor.copy( renderer.getClearColor() );
			this.oldClearAlpha = renderer.getClearAlpha();

			renderer.setClearColor( this.clearColor, this.clearAlpha );

		}

		renderer.render( this.scene, this.camera, readBuffer, this.clear );

		if ( this.clearColor ) {

			renderer.setClearColor( this.oldClearColor, this.oldClearAlpha );

		}

		this.scene.overrideMaterial = null;

	}

} );

/**
 * @author alteredq / http://alteredqualia.com/
 */

THREE.ShaderPass = function( shader, textureID ) {

	THREE.Pass.call( this );

	this.textureID = ( textureID !== undefined ) ? textureID : "tDiffuse";

	if ( shader instanceof THREE.ShaderMaterial ) {

		this.uniforms = shader.uniforms;

		this.material = shader;

	}
	else if ( shader ) {

		this.uniforms = THREE.UniformsUtils.clone( shader.uniforms );

		this.material = new THREE.ShaderMaterial( {

			defines: shader.defines || {},
			uniforms: this.uniforms,
			vertexShader: shader.vertexShader,
			fragmentShader: shader.fragmentShader

		} );

	}

	this.camera = new THREE.OrthographicCamera( - 1, 1, 1, - 1, 0, 1 );
	this.scene = new THREE.Scene();

	this.quad = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2, 2 ), null );
	this.scene.add( this.quad );

};

THREE.ShaderPass.prototype = Object.assign( Object.create( THREE.Pass.prototype ), {

	constructor: THREE.ShaderPass,

	render: function( renderer, writeBuffer, readBuffer, delta, maskActive ) {

		if ( this.uniforms[ this.textureID ] ) {

			this.uniforms[ this.textureID ].value = readBuffer.texture;

		}

		this.quad.material = this.material;

		if ( this.renderToScreen ) {

			renderer.render( this.scene, this.camera );

		} else {

			renderer.render( this.scene, this.camera, writeBuffer, this.clear );

		}

	}

} );

/**
 * @author mrdoob / http://www.mrdoob.com
 *
 * Simple test shader
 */

THREE.BasicShader = {

	uniforms: {},

	vertexShader: [

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"void main() {",

			"gl_FragColor = vec4( 1.0, 0.0, 0.0, 0.5 );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Bleach bypass shader [http://en.wikipedia.org/wiki/Bleach_bypass]
 * - based on Nvidia example
 * http://developer.download.nvidia.com/shaderlibrary/webpages/shader_library.html#post_bleach_bypass
 */

THREE.BleachBypassShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 base = texture2D( tDiffuse, vUv );",

			"vec3 lumCoeff = vec3( 0.25, 0.65, 0.1 );",
			"float lum = dot( lumCoeff, base.rgb );",
			"vec3 blend = vec3( lum );",

			"float L = min( 1.0, max( 0.0, 10.0 * ( lum - 0.45 ) ) );",

			"vec3 result1 = 2.0 * base.rgb * blend;",
			"vec3 result2 = 1.0 - 2.0 * ( 1.0 - blend ) * ( 1.0 - base.rgb );",

			"vec3 newColor = mix( result1, result2, L );",

			"float A2 = opacity * base.a;",
			"vec3 mixRGB = A2 * newColor.rgb;",
			"mixRGB += ( ( 1.0 - A2 ) * base.rgb );",

			"gl_FragColor = vec4( mixRGB, base.a );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Blend two textures
 */

THREE.BlendShader = {

	uniforms: {

		"tDiffuse1": { type: "t", value: null },
		"tDiffuse2": { type: "t", value: null },
		"mixRatio":  { type: "f", value: 0.5 },
		"opacity":   { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",
		"uniform float mixRatio;",

		"uniform sampler2D tDiffuse1;",
		"uniform sampler2D tDiffuse2;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel1 = texture2D( tDiffuse1, vUv );",
			"vec4 texel2 = texture2D( tDiffuse2, vUv );",
			"gl_FragColor = opacity * mix( texel1, texel2, mixRatio );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Depth-of-field shader with bokeh
 * ported from GLSL shader by Martins Upitis
 * http://artmartinsh.blogspot.com/2010/02/glsl-lens-blur-filter-with-bokeh.html
 */

THREE.BokehShader = {

	uniforms: {

		"tColor":   { type: "t", value: null },
		"tDepth":   { type: "t", value: null },
		"focus":    { type: "f", value: 1.0 },
		"aspect":   { type: "f", value: 1.0 },
		"aperture": { type: "f", value: 0.025 },
		"maxblur":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"varying vec2 vUv;",

		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",

		"uniform float maxblur;",  // max blur amount
		"uniform float aperture;", // aperture - bigger values for shallower depth of field

		"uniform float focus;",
		"uniform float aspect;",

		"void main() {",

			"vec2 aspectcorrect = vec2( 1.0, aspect );",

			"vec4 depth1 = texture2D( tDepth, vUv );",

			"float factor = depth1.x - focus;",

			"vec2 dofblur = vec2 ( clamp( factor * aperture, -maxblur, maxblur ) );",

			"vec2 dofblur9 = dofblur * 0.9;",
			"vec2 dofblur7 = dofblur * 0.7;",
			"vec2 dofblur4 = dofblur * 0.4;",

			"vec4 col = vec4( 0.0 );",

			"col += texture2D( tColor, vUv.xy );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur );",

			"col += texture2D( tColor, vUv.xy + ( vec2(  0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.15,  0.37 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.37,  0.15 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.37, -0.15 ) * aspectcorrect ) * dofblur9 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.15, -0.37 ) * aspectcorrect ) * dofblur9 );",

			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.40,  0.0  ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur7 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur7 );",

			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,  -0.4  ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29,  0.29 ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.4,   0.0  ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2( -0.29, -0.29 ) * aspectcorrect ) * dofblur4 );",
			"col += texture2D( tColor, vUv.xy + ( vec2(  0.0,   0.4  ) * aspectcorrect ) * dofblur4 );",

			"gl_FragColor = col / 41.0;",
			"gl_FragColor.a = 1.0;",

		"}"

	].join( "\n" )

};

/**
 * @author zz85 / https://github.com/zz85 | twitter.com/blurspline
 *
 * Depth-of-field shader with bokeh
 * ported from GLSL shader by Martins Upitis
 * http://blenderartists.org/forum/showthread.php?237488-GLSL-depth-of-field-with-bokeh-v2-4-(update)
 *
 * Requires #define RINGS and SAMPLES integers
 */



THREE.BokehShader = {

	uniforms: {

		"textureWidth":  { type: "f", value: 1.0 },
		"textureHeight":  { type: "f", value: 1.0 },

		"focalDepth":   { type: "f", value: 1.0 },
		"focalLength":   { type: "f", value: 24.0 },
		"fstop": { type: "f", value: 0.9 },

		"tColor":   { type: "t", value: null },
		"tDepth":   { type: "t", value: null },

		"maxblur":  { type: "f", value: 1.0 },

		"showFocus":   { type: "i", value: 0 },
		"manualdof":   { type: "i", value: 0 },
		"vignetting":   { type: "i", value: 0 },
		"depthblur":   { type: "i", value: 0 },

		"threshold":  { type: "f", value: 0.5 },
		"gain":  { type: "f", value: 2.0 },
		"bias":  { type: "f", value: 0.5 },
		"fringe":  { type: "f", value: 0.7 },

		"znear":  { type: "f", value: 0.1 },
		"zfar":  { type: "f", value: 100 },

		"noise":  { type: "i", value: 1 },
		"dithering":  { type: "f", value: 0.0001 },
		"pentagon": { type: "i", value: 0 },

		"shaderFocus":  { type: "i", value: 1 },
		"focusCoords":  { type: "v2", value: new THREE.Vector2() },


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

		"varying vec2 vUv;",

		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",
		"uniform float textureWidth;",
		"uniform float textureHeight;",

		"uniform float focalDepth;  //focal distance value in meters, but you may use autofocus option below",
		"uniform float focalLength; //focal length in mm",
		"uniform float fstop; //f-stop value",
		"uniform bool showFocus; //show debug focus point and focal range (red = focal point, green = focal range)",

		"/*",
		"make sure that these two values are the same for your camera, otherwise distances will be wrong.",
		"*/",

		"uniform float znear; // camera clipping start",
		"uniform float zfar; // camera clipping end",

		"//------------------------------------------",
		"//user variables",

		"const int samples = SAMPLES; //samples on the first ring",
		"const int rings = RINGS; //ring count",

		"const int maxringsamples = rings * samples;",

		"uniform bool manualdof; // manual dof calculation",
		"float ndofstart = 1.0; // near dof blur start",
		"float ndofdist = 2.0; // near dof blur falloff distance",
		"float fdofstart = 1.0; // far dof blur start",
		"float fdofdist = 3.0; // far dof blur falloff distance",

		"float CoC = 0.03; //circle of confusion size in mm (35mm film = 0.03mm)",

		"uniform bool vignetting; // use optical lens vignetting",

		"float vignout = 1.3; // vignetting outer border",
		"float vignin = 0.0; // vignetting inner border",
		"float vignfade = 22.0; // f-stops till vignete fades",

		"uniform bool shaderFocus;",
		"// disable if you use external focalDepth value",

		"uniform vec2 focusCoords;",
		"// autofocus point on screen (0.0,0.0 - left lower corner, 1.0,1.0 - upper right)",
		"// if center of screen use vec2(0.5, 0.5);",

		"uniform float maxblur;",
		"//clamp value of max blur (0.0 = no blur, 1.0 default)",

		"uniform float threshold; // highlight threshold;",
		"uniform float gain; // highlight gain;",

		"uniform float bias; // bokeh edge bias",
		"uniform float fringe; // bokeh chromatic aberration / fringing",

		"uniform bool noise; //use noise instead of pattern for sample dithering",

		"uniform float dithering;",

		"uniform bool depthblur; // blur the depth buffer",
		"float dbsize = 1.25; // depth blur size",

		"/*",
		"next part is experimental",
		"not looking good with small sample and ring count",
		"looks okay starting from samples = 4, rings = 4",
		"*/",

		"uniform bool pentagon; //use pentagon as bokeh shape?",
		"float feather = 0.4; //pentagon shape feather",

		"//------------------------------------------",

		"float penta(vec2 coords) {",
			"//pentagonal shape",
			"float scale = float(rings) - 1.3;",
			"vec4  HS0 = vec4( 1.0,         0.0,         0.0,  1.0);",
			"vec4  HS1 = vec4( 0.309016994, 0.951056516, 0.0,  1.0);",
			"vec4  HS2 = vec4(-0.809016994, 0.587785252, 0.0,  1.0);",
			"vec4  HS3 = vec4(-0.809016994,-0.587785252, 0.0,  1.0);",
			"vec4  HS4 = vec4( 0.309016994,-0.951056516, 0.0,  1.0);",
			"vec4  HS5 = vec4( 0.0        ,0.0         , 1.0,  1.0);",

			"vec4  one = vec4( 1.0 );",

			"vec4 P = vec4((coords),vec2(scale, scale));",

			"vec4 dist = vec4(0.0);",
			"float inorout = -4.0;",

			"dist.x = dot( P, HS0 );",
			"dist.y = dot( P, HS1 );",
			"dist.z = dot( P, HS2 );",
			"dist.w = dot( P, HS3 );",

			"dist = smoothstep( -feather, feather, dist );",

			"inorout += dot( dist, one );",

			"dist.x = dot( P, HS4 );",
			"dist.y = HS5.w - abs( P.z );",

			"dist = smoothstep( -feather, feather, dist );",
			"inorout += dist.x;",

			"return clamp( inorout, 0.0, 1.0 );",
		"}",

		"float bdepth(vec2 coords) {",
			"// Depth buffer blur",
			"float d = 0.0;",
			"float kernel[9];",
			"vec2 offset[9];",

			"vec2 wh = vec2(1.0/textureWidth,1.0/textureHeight) * dbsize;",

			"offset[0] = vec2(-wh.x,-wh.y);",
			"offset[1] = vec2( 0.0, -wh.y);",
			"offset[2] = vec2( wh.x -wh.y);",

			"offset[3] = vec2(-wh.x,  0.0);",
			"offset[4] = vec2( 0.0,   0.0);",
			"offset[5] = vec2( wh.x,  0.0);",

			"offset[6] = vec2(-wh.x, wh.y);",
			"offset[7] = vec2( 0.0,  wh.y);",
			"offset[8] = vec2( wh.x, wh.y);",

			"kernel[0] = 1.0/16.0;   kernel[1] = 2.0/16.0;   kernel[2] = 1.0/16.0;",
			"kernel[3] = 2.0/16.0;   kernel[4] = 4.0/16.0;   kernel[5] = 2.0/16.0;",
			"kernel[6] = 1.0/16.0;   kernel[7] = 2.0/16.0;   kernel[8] = 1.0/16.0;",


			"for( int i=0; i<9; i++ ) {",
				"float tmp = texture2D(tDepth, coords + offset[i]).r;",
				"d += tmp * kernel[i];",
			"}",

			"return d;",
		"}",


		"vec3 color(vec2 coords,float blur) {",
			"//processing the sample",

			"vec3 col = vec3(0.0);",
			"vec2 texel = vec2(1.0/textureWidth,1.0/textureHeight);",

			"col.r = texture2D(tColor,coords + vec2(0.0,1.0)*texel*fringe*blur).r;",
			"col.g = texture2D(tColor,coords + vec2(-0.866,-0.5)*texel*fringe*blur).g;",
			"col.b = texture2D(tColor,coords + vec2(0.866,-0.5)*texel*fringe*blur).b;",

			"vec3 lumcoeff = vec3(0.299,0.587,0.114);",
			"float lum = dot(col.rgb, lumcoeff);",
			"float thresh = max((lum-threshold)*gain, 0.0);",
			"return col+mix(vec3(0.0),col,thresh*blur);",
		"}",

		"vec3 debugFocus(vec3 col, float blur, float depth) {",
			"float edge = 0.002*depth; //distance based edge smoothing",
			"float m = clamp(smoothstep(0.0,edge,blur),0.0,1.0);",
			"float e = clamp(smoothstep(1.0-edge,1.0,blur),0.0,1.0);",

			"col = mix(col,vec3(1.0,0.5,0.0),(1.0-m)*0.6);",
			"col = mix(col,vec3(0.0,0.5,1.0),((1.0-e)-(1.0-m))*0.2);",

			"return col;",
		"}",

		"float linearize(float depth) {",
			"return -zfar * znear / (depth * (zfar - znear) - zfar);",
		"}",


		"float vignette() {",
			"float dist = distance(vUv.xy, vec2(0.5,0.5));",
			"dist = smoothstep(vignout+(fstop/vignfade), vignin+(fstop/vignfade), dist);",
			"return clamp(dist,0.0,1.0);",
		"}",

		"float gather(float i, float j, int ringsamples, inout vec3 col, float w, float h, float blur) {",
			"float rings2 = float(rings);",
			"float step = PI*2.0 / float(ringsamples);",
			"float pw = cos(j*step)*i;",
			"float ph = sin(j*step)*i;",
			"float p = 1.0;",
			"if (pentagon) {",
				"p = penta(vec2(pw,ph));",
			"}",
			"col += color(vUv.xy + vec2(pw*w,ph*h), blur) * mix(1.0, i/rings2, bias) * p;",
			"return 1.0 * mix(1.0, i /rings2, bias) * p;",
		"}",

		"void main() {",
			"//scene depth calculation",

			"float depth = linearize(texture2D(tDepth,vUv.xy).x);",

			"// Blur depth?",
			"if (depthblur) {",
				"depth = linearize(bdepth(vUv.xy));",
			"}",

			"//focal plane calculation",

			"float fDepth = focalDepth;",

			"if (shaderFocus) {",

				"fDepth = linearize(texture2D(tDepth,focusCoords).x);",

			"}",

			"// dof blur factor calculation",

			"float blur = 0.0;",

			"if (manualdof) {",
				"float a = depth-fDepth; // Focal plane",
				"float b = (a-fdofstart)/fdofdist; // Far DoF",
				"float c = (-a-ndofstart)/ndofdist; // Near Dof",
				"blur = (a>0.0) ? b : c;",
			"} else {",
				"float f = focalLength; // focal length in mm",
				"float d = fDepth*1000.0; // focal plane in mm",
				"float o = depth*1000.0; // depth in mm",

				"float a = (o*f)/(o-f);",
				"float b = (d*f)/(d-f);",
				"float c = (d-f)/(d*fstop*CoC);",

				"blur = abs(a-b)*c;",
			"}",

			"blur = clamp(blur,0.0,1.0);",

			"// calculation of pattern for dithering",

			"vec2 noise = vec2(rand(vUv.xy), rand( vUv.xy + vec2( 0.4, 0.6 ) ) )*dithering*blur;",

			"// getting blur x and y step factor",

			"float w = (1.0/textureWidth)*blur*maxblur+noise.x;",
			"float h = (1.0/textureHeight)*blur*maxblur+noise.y;",

			"// calculation of final color",

			"vec3 col = vec3(0.0);",

			"if(blur < 0.05) {",
				"//some optimization thingy",
				"col = texture2D(tColor, vUv.xy).rgb;",
			"} else {",
				"col = texture2D(tColor, vUv.xy).rgb;",
				"float s = 1.0;",
				"int ringsamples;",

				"for (int i = 1; i <= rings; i++) {",
					"/*unboxstart*/",
					"ringsamples = i * samples;",

					"for (int j = 0 ; j < maxringsamples ; j++) {",
						"if (j >= ringsamples) break;",
						"s += gather(float(i), float(j), ringsamples, col, w, h, blur);",
					"}",
					"/*unboxend*/",
				"}",

				"col /= s; //divide by sample count",
			"}",

			"if (showFocus) {",
				"col = debugFocus(col, blur, depth);",
			"}",

			"if (vignetting) {",
				"col *= vignette();",
			"}",

			"gl_FragColor.rgb = col;",
			"gl_FragColor.a = 1.0;",
		"} "

	].join( "\n" )

};

/**
 * @author tapio / http://tapio.github.com/
 *
 * Brightness and contrast adjustment
 * https://github.com/evanw/glfx.js
 * brightness: -1 to 1 (-1 is solid black, 0 is no change, and 1 is solid white)
 * contrast: -1 to 1 (-1 is solid gray, 0 is no change, and 1 is maximum contrast)
 */

THREE.BrightnessContrastShader = {

	uniforms: {

		"tDiffuse":   { type: "t", value: null },
		"brightness": { type: "f", value: 0 },
		"contrast":   { type: "f", value: 0 }

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
		"uniform float brightness;",
		"uniform float contrast;",

		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",

			"gl_FragColor.rgb += brightness;",

			"if (contrast > 0.0) {",
				"gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) / (1.0 - contrast) + 0.5;",
			"} else {",
				"gl_FragColor.rgb = (gl_FragColor.rgb - 0.5) * (1.0 + contrast) + 0.5;",
			"}",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Color correction
 */

THREE.ColorCorrectionShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"powRGB":   { type: "v3", value: new THREE.Vector3( 2, 2, 2 ) },
		"mulRGB":   { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },
		"addRGB":   { type: "v3", value: new THREE.Vector3( 0, 0, 0 ) }

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
		"uniform vec3 powRGB;",
		"uniform vec3 mulRGB;",
		"uniform vec3 addRGB;",

		"varying vec2 vUv;",

		"void main() {",

			"gl_FragColor = texture2D( tDiffuse, vUv );",
			"gl_FragColor.rgb = mulRGB * pow( ( gl_FragColor.rgb + addRGB ), powRGB );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Colorify shader
 */

THREE.ColorifyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"color":    { type: "c", value: new THREE.Color( 0xffffff ) }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec3 color;",
		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",
			"float v = dot( texel.xyz, luma );",

			"gl_FragColor = vec4( v * color, texel.w );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Convolution shader
 * ported from o3d sample to WebGL / GLSL
 * http://o3d.googlecode.com/svn/trunk/samples/convolution.html
 */

THREE.ConvolutionShader = {

	defines: {

		"KERNEL_SIZE_FLOAT": "25.0",
		"KERNEL_SIZE_INT": "25",

	},

	uniforms: {

		"tDiffuse":        { type: "t", value: null },
		"uImageIncrement": { type: "v2", value: new THREE.Vector2( 0.001953125, 0.0 ) },
		"cKernel":         { type: "fv1", value: [] }

	},

	vertexShader: [

		"uniform vec2 uImageIncrement;",

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv - ( ( KERNEL_SIZE_FLOAT - 1.0 ) / 2.0 ) * uImageIncrement;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float cKernel[ KERNEL_SIZE_INT ];",

		"uniform sampler2D tDiffuse;",
		"uniform vec2 uImageIncrement;",

		"varying vec2 vUv;",

		"void main() {",

			"vec2 imageCoord = vUv;",
			"vec4 sum = vec4( 0.0, 0.0, 0.0, 0.0 );",

			"for( int i = 0; i < KERNEL_SIZE_INT; i ++ ) {",

				"sum += texture2D( tDiffuse, imageCoord ) * cKernel[ i ];",
				"imageCoord += uImageIncrement;",

			"}",

			"gl_FragColor = sum;",

		"}"


	].join( "\n" ),

	buildKernel: function ( sigma ) {

		// We lop off the sqrt(2 * pi) * sigma term, since we're going to normalize anyway.

		function gauss( x, sigma ) {

			return Math.exp( - ( x * x ) / ( 2.0 * sigma * sigma ) );

		}

		var i, values, sum, halfWidth, kMaxKernelSize = 25, kernelSize = 2 * Math.ceil( sigma * 3.0 ) + 1;

		if ( kernelSize > kMaxKernelSize ) kernelSize = kMaxKernelSize;
		halfWidth = ( kernelSize - 1 ) * 0.5;

		values = new Array( kernelSize );
		sum = 0.0;
		for ( i = 0; i < kernelSize; ++ i ) {

			values[ i ] = gauss( i - halfWidth, sigma );
			sum += values[ i ];

		}

		// normalize the kernel

		for ( i = 0; i < kernelSize; ++ i ) values[ i ] /= sum;

		return values;

	}

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Full-screen textured quad shader
 */

THREE.CopyShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			"gl_FragColor = opacity * texel;",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Depth-of-field shader using mipmaps
 * - from Matt Handley @applmak
 * - requires power-of-2 sized render target with enabled mipmaps
 */

THREE.DOFMipMapShader = {

	uniforms: {

		"tColor":   { type: "t", value: null },
		"tDepth":   { type: "t", value: null },
		"focus":    { type: "f", value: 1.0 },
		"maxblur":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float focus;",
		"uniform float maxblur;",

		"uniform sampler2D tColor;",
		"uniform sampler2D tDepth;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 depth = texture2D( tDepth, vUv );",

			"float factor = depth.x - focus;",

			"vec4 col = texture2D( tColor, vUv, 2.0 * maxblur * abs( focus - depth.x ) );",

			"gl_FragColor = col;",
			"gl_FragColor.a = 1.0;",

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

THREE.DigitalGlitch = {

	uniforms: {

		"tDiffuse":		{ type: "t", value: null },//diffuse texture
		"tDisp":		{ type: "t", value: null },//displacement texture for digital glitch squares
		"byp":			{ type: "i", value: 0 },//apply the glitch ?
		"amount":		{ type: "f", value: 0.08 },
		"angle":		{ type: "f", value: 0.02 },
		"seed":			{ type: "f", value: 0.02 },
		"seed_x":		{ type: "f", value: 0.02 },//-1,1
		"seed_y":		{ type: "f", value: 0.02 },//-1,1
		"distortion_x":	{ type: "f", value: 0.5 },
		"distortion_y":	{ type: "f", value: 0.6 },
		"col_s":		{ type: "f", value: 0.05 }
	},

	vertexShader: [

		"varying vec2 vUv;",
		"void main() {",
			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
		"}"
	].join( "\n" ),

	fragmentShader: [
		"uniform int byp;",//should we apply the glitch ?
		
		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDisp;",
		
		"uniform float amount;",
		"uniform float angle;",
		"uniform float seed;",
		"uniform float seed_x;",
		"uniform float seed_y;",
		"uniform float distortion_x;",
		"uniform float distortion_y;",
		"uniform float col_s;",
			
		"varying vec2 vUv;",
		
		
		"float rand(vec2 co){",
			"return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);",
		"}",
				
		"void main() {",
			"if(byp<1) {",
				"vec2 p = vUv;",
				"float xs = floor(gl_FragCoord.x / 0.5);",
				"float ys = floor(gl_FragCoord.y / 0.5);",
				//based on staffantans glitch shader for unity https://github.com/staffantan/unityglitch
				"vec4 normal = texture2D (tDisp, p*seed*seed);",
				"if(p.y<distortion_x+col_s && p.y>distortion_x-col_s*seed) {",
					"if(seed_x>0.){",
						"p.y = 1. - (p.y + distortion_y);",
					"}",
					"else {",
						"p.y = distortion_y;",
					"}",
				"}",
				"if(p.x<distortion_y+col_s && p.x>distortion_y-col_s*seed) {",
					"if(seed_y>0.){",
						"p.x=distortion_x;",
					"}",
					"else {",
						"p.x = 1. - (p.x + distortion_x);",
					"}",
				"}",
				"p.x+=normal.x*seed_x*(seed/5.);",
				"p.y+=normal.y*seed_y*(seed/5.);",
				//base from RGB shift shader
				"vec2 offset = amount * vec2( cos(angle), sin(angle));",
				"vec4 cr = texture2D(tDiffuse, p + offset);",
				"vec4 cga = texture2D(tDiffuse, p);",
				"vec4 cb = texture2D(tDiffuse, p - offset);",
				"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
				//add noise
				"vec4 snow = 200.*amount*vec4(rand(vec2(xs * seed,ys * seed*50.))*0.2);",
				"gl_FragColor = gl_FragColor+ snow;",
			"}",
			"else {",
				"gl_FragColor=texture2D (tDiffuse, vUv);",
			"}",
		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Dot screen shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

THREE.DotScreenShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"tSize":    { type: "v2", value: new THREE.Vector2( 256, 256 ) },
		"center":   { type: "v2", value: new THREE.Vector2( 0.5, 0.5 ) },
		"angle":    { type: "f", value: 1.57 },
		"scale":    { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform vec2 center;",
		"uniform float angle;",
		"uniform float scale;",
		"uniform vec2 tSize;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"float pattern() {",

			"float s = sin( angle ), c = cos( angle );",

			"vec2 tex = vUv * tSize - center;",
			"vec2 point = vec2( c * tex.x - s * tex.y, s * tex.x + c * tex.y ) * scale;",

			"return ( sin( point.x ) * sin( point.y ) ) * 4.0;",

		"}",

		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",

			"float average = ( color.r + color.g + color.b ) / 3.0;",

			"gl_FragColor = vec4( vec3( average * 10.0 - 5.0 + pattern() ), color.a );",

		"}"

	].join( "\n" )

};

/**
 * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog
 *
 * Edge Detection Shader using Frei-Chen filter
 * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
 *
 * aspect: vec2 of (1/width, 1/height)
 */

THREE.EdgeShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"aspect":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
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

		"uniform vec2 aspect;",

		"vec2 texel = vec2(1.0 / aspect.x, 1.0 / aspect.y);",


		"mat3 G[9];",

		// hard coded matrix values!!!! as suggested in https://github.com/neilmendoza/ofxPostProcessing/blob/master/src/EdgePass.cpp#L45

		"const mat3 g0 = mat3( 0.3535533845424652, 0, -0.3535533845424652, 0.5, 0, -0.5, 0.3535533845424652, 0, -0.3535533845424652 );",
		"const mat3 g1 = mat3( 0.3535533845424652, 0.5, 0.3535533845424652, 0, 0, 0, -0.3535533845424652, -0.5, -0.3535533845424652 );",
		"const mat3 g2 = mat3( 0, 0.3535533845424652, -0.5, -0.3535533845424652, 0, 0.3535533845424652, 0.5, -0.3535533845424652, 0 );",
		"const mat3 g3 = mat3( 0.5, -0.3535533845424652, 0, -0.3535533845424652, 0, 0.3535533845424652, 0, 0.3535533845424652, -0.5 );",
		"const mat3 g4 = mat3( 0, -0.5, 0, 0.5, 0, 0.5, 0, -0.5, 0 );",
		"const mat3 g5 = mat3( -0.5, 0, 0.5, 0, 0, 0, 0.5, 0, -0.5 );",
		"const mat3 g6 = mat3( 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.6666666865348816, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204 );",
		"const mat3 g7 = mat3( -0.3333333432674408, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, 0.6666666865348816, 0.1666666716337204, -0.3333333432674408, 0.1666666716337204, -0.3333333432674408 );",
		"const mat3 g8 = mat3( 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408, 0.3333333432674408 );",

		"void main(void)",
		"{",

			"G[0] = g0,",
			"G[1] = g1,",
			"G[2] = g2,",
			"G[3] = g3,",
			"G[4] = g4,",
			"G[5] = g5,",
			"G[6] = g6,",
			"G[7] = g7,",
			"G[8] = g8;",

			"mat3 I;",
			"float cnv[9];",
			"vec3 sample;",

			/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			"for (float i=0.0; i<3.0; i++) {",
				"for (float j=0.0; j<3.0; j++) {",
					"sample = texture2D(tDiffuse, vUv + texel * vec2(i-1.0,j-1.0) ).rgb;",
					"I[int(i)][int(j)] = length(sample);",
				"}",
			"}",

			/* calculate the convolution values for all the masks */
			"for (int i=0; i<9; i++) {",
				"float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);",
				"cnv[i] = dp3 * dp3;",
			"}",

			"float M = (cnv[0] + cnv[1]) + (cnv[2] + cnv[3]);",
			"float S = (cnv[4] + cnv[5]) + (cnv[6] + cnv[7]) + (cnv[8] + M);",

			"gl_FragColor = vec4(vec3(sqrt(M/S)), 1.0);",
		"}",

	].join( "\n" )
};

/**
 * @author zz85 / https://github.com/zz85 | https://www.lab4games.net/zz85/blog
 *
 * Edge Detection Shader using Sobel filter
 * Based on http://rastergrid.com/blog/2011/01/frei-chen-edge-detector
 *
 * aspect: vec2 of (1/width, 1/height)
 */

THREE.EdgeShader2 = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"aspect":    { type: "v2", value: new THREE.Vector2( 512, 512 ) },
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
		"uniform vec2 aspect;",


		"vec2 texel = vec2(1.0 / aspect.x, 1.0 / aspect.y);",

		"mat3 G[2];",

		"const mat3 g0 = mat3( 1.0, 2.0, 1.0, 0.0, 0.0, 0.0, -1.0, -2.0, -1.0 );",
		"const mat3 g1 = mat3( 1.0, 0.0, -1.0, 2.0, 0.0, -2.0, 1.0, 0.0, -1.0 );",


		"void main(void)",
		"{",
			"mat3 I;",
			"float cnv[2];",
			"vec3 sample;",

			"G[0] = g0;",
			"G[1] = g1;",

			/* fetch the 3x3 neighbourhood and use the RGB vector's length as intensity value */
			"for (float i=0.0; i<3.0; i++)",
			"for (float j=0.0; j<3.0; j++) {",
				"sample = texture2D( tDiffuse, vUv + texel * vec2(i-1.0,j-1.0) ).rgb;",
				"I[int(i)][int(j)] = length(sample);",
			"}",

			/* calculate the convolution values for all the masks */
			"for (int i=0; i<2; i++) {",
				"float dp3 = dot(G[i][0], I[0]) + dot(G[i][1], I[1]) + dot(G[i][2], I[2]);",
				"cnv[i] = dp3 * dp3; ",
			"}",

			"gl_FragColor = vec4(0.5 * sqrt(cnv[0]*cnv[0]+cnv[1]*cnv[1]));",
		"} ",

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 * @author davidedc / http://www.sketchpatch.net/
 *
 * NVIDIA FXAA by Timothy Lottes
 * http://timothylottes.blogspot.com/2011/06/fxaa3-source-released.html
 * - WebGL port by @supereggbert
 * http://www.glge.org/demos/fxaa/
 */

THREE.FXAAShader = {

	uniforms: {

		"tDiffuse":   { type: "t", value: null },
		"resolution": { type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }

	},

	vertexShader: [

		"void main() {",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform vec2 resolution;",

		"#define FXAA_REDUCE_MIN   (1.0/128.0)",
		"#define FXAA_REDUCE_MUL   (1.0/8.0)",
		"#define FXAA_SPAN_MAX     8.0",

		"void main() {",

			"vec3 rgbNW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, -1.0 ) ) * resolution ).xyz;",
			"vec3 rgbNE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, -1.0 ) ) * resolution ).xyz;",
			"vec3 rgbSW = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( -1.0, 1.0 ) ) * resolution ).xyz;",
			"vec3 rgbSE = texture2D( tDiffuse, ( gl_FragCoord.xy + vec2( 1.0, 1.0 ) ) * resolution ).xyz;",
			"vec4 rgbaM  = texture2D( tDiffuse,  gl_FragCoord.xy  * resolution );",
			"vec3 rgbM  = rgbaM.xyz;",
			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",

			"float lumaNW = dot( rgbNW, luma );",
			"float lumaNE = dot( rgbNE, luma );",
			"float lumaSW = dot( rgbSW, luma );",
			"float lumaSE = dot( rgbSE, luma );",
			"float lumaM  = dot( rgbM,  luma );",
			"float lumaMin = min( lumaM, min( min( lumaNW, lumaNE ), min( lumaSW, lumaSE ) ) );",
			"float lumaMax = max( lumaM, max( max( lumaNW, lumaNE) , max( lumaSW, lumaSE ) ) );",

			"vec2 dir;",
			"dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));",
			"dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));",

			"float dirReduce = max( ( lumaNW + lumaNE + lumaSW + lumaSE ) * ( 0.25 * FXAA_REDUCE_MUL ), FXAA_REDUCE_MIN );",

			"float rcpDirMin = 1.0 / ( min( abs( dir.x ), abs( dir.y ) ) + dirReduce );",
			"dir = min( vec2( FXAA_SPAN_MAX,  FXAA_SPAN_MAX),",
				  "max( vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),",
						"dir * rcpDirMin)) * resolution;",
			"vec4 rgbA = (1.0/2.0) * (",
        	"texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (1.0/3.0 - 0.5)) +",
			"texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (2.0/3.0 - 0.5)));",
    		"vec4 rgbB = rgbA * (1.0/2.0) + (1.0/4.0) * (",
			"texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (0.0/3.0 - 0.5)) +",
      		"texture2D(tDiffuse,  gl_FragCoord.xy  * resolution + dir * (3.0/3.0 - 0.5)));",
    		"float lumaB = dot(rgbB, vec4(luma, 0.0));",

			"if ( ( lumaB < lumaMin ) || ( lumaB > lumaMax ) ) {",

				"gl_FragColor = rgbA;",

			"} else {",
				"gl_FragColor = rgbB;",

			"}",

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
		"grayscale":  { type: "i", value: 1 }

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
 * @author alteredq / http://alteredqualia.com/
 *
 * Focus shader
 * based on PaintEffect postprocess from ro.me
 * http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */

THREE.FocusShader = {

	uniforms : {

		"tDiffuse":       { type: "t", value: null },
		"screenWidth":    { type: "f", value: 1024 },
		"screenHeight":   { type: "f", value: 1024 },
		"sampleDistance": { type: "f", value: 0.94 },
		"waveFactor":     { type: "f", value: 0.00125 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float screenWidth;",
		"uniform float screenHeight;",
		"uniform float sampleDistance;",
		"uniform float waveFactor;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color, org, tmp, add;",
			"float sample_dist, f;",
			"vec2 vin;",
			"vec2 uv = vUv;",

			"add = color = org = texture2D( tDiffuse, uv );",

			"vin = ( uv - vec2( 0.5 ) ) * vec2( 1.4 );",
			"sample_dist = dot( vin, vin ) * 2.0;",

			"f = ( waveFactor * 100.0 + sample_dist ) * sampleDistance * 4.0;",

			"vec2 sampleSize = vec2(  1.0 / screenWidth, 1.0 / screenHeight ) * vec2( f );",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.111964, 0.993712 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.846724, 0.532032 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.943883, -0.330279 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( 0.330279, -0.943883 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.532032, -0.846724 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.993712, -0.111964 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"add += tmp = texture2D( tDiffuse, uv + vec2( -0.707107, 0.707107 ) * sampleSize );",
			"if( tmp.b < color.b ) color = tmp;",

			"color = color * vec4( 2.0 ) - ( add / vec4( 8.0 ) );",
			"color = color + ( add / vec4( 8.0 ) - color ) * ( vec4( 1.0 ) - vec4( sample_dist * 0.5 ) );",

			"gl_FragColor = vec4( color.rgb * color.rgb * vec3( 0.95 ) + color.rgb, 1.0 );",

		"}"


	].join( "\n" )
};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Based on Nvidia Cg tutorial
 */

THREE.FresnelShader = {

	uniforms: {

		"mRefractionRatio": { type: "f", value: 1.02 },
		"mFresnelBias": { type: "f", value: 0.1 },
		"mFresnelPower": { type: "f", value: 2.0 },
		"mFresnelScale": { type: "f", value: 1.0 },
		"tCube": { type: "t", value: null }

	},

	vertexShader: [

		"uniform float mRefractionRatio;",
		"uniform float mFresnelBias;",
		"uniform float mFresnelScale;",
		"uniform float mFresnelPower;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vec4 worldPosition = modelMatrix * vec4( position, 1.0 );",

			"vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );",

			"vec3 I = worldPosition.xyz - cameraPosition;",

			"vReflect = reflect( I, worldNormal );",
			"vRefract[0] = refract( normalize( I ), worldNormal, mRefractionRatio );",
			"vRefract[1] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.99 );",
			"vRefract[2] = refract( normalize( I ), worldNormal, mRefractionRatio * 0.98 );",
			"vReflectionFactor = mFresnelBias + mFresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), mFresnelPower );",

			"gl_Position = projectionMatrix * mvPosition;",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform samplerCube tCube;",

		"varying vec3 vReflect;",
		"varying vec3 vRefract[3];",
		"varying float vReflectionFactor;",

		"void main() {",

			"vec4 reflectedColor = textureCube( tCube, vec3( -vReflect.x, vReflect.yz ) );",
			"vec4 refractedColor = vec4( 1.0 );",

			"refractedColor.r = textureCube( tCube, vec3( -vRefract[0].x, vRefract[0].yz ) ).r;",
			"refractedColor.g = textureCube( tCube, vec3( -vRefract[1].x, vRefract[1].yz ) ).g;",
			"refractedColor.b = textureCube( tCube, vec3( -vRefract[2].x, vRefract[2].yz ) ).b;",

			"gl_FragColor = mix( refractedColor, reflectedColor, clamp( vReflectionFactor, 0.0, 1.0 ) );",

		"}"

	].join( "\n" )

};

/**
 * @author WestLangley / http://github.com/WestLangley
 *
 * Gamma Correction Shader
 * http://en.wikipedia.org/wiki/gamma_correction
 */

THREE.GammaCorrectionShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

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

		"void main() {",

			"vec4 tex = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",

			"gl_FragColor = LinearToGamma( tex, float( GAMMA_FACTOR ) );",

		"}"

	].join( "\n" )

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.HorizontalBlurShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"h":        { type: "f", value: 1.0 / 512.0 }

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

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, vec2( vUv.x - 4.0 * h, vUv.y ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x - 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 1.0 * h, vUv.y ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 2.0 * h, vUv.y ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 3.0 * h, vUv.y ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x + 4.0 * h, vUv.y ) ) * 0.051;",

			"gl_FragColor = sum;",

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
		"h":        { type: "f", value: 1.0 / 512.0 },
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
 * @author felixturner / http://airtight.cc/
 *
 * Kaleidoscope Shader
 * Radial reflection around center point
 * Ported from: http://pixelshaders.com/editor/
 * by Toby Schachman / http://tobyschachman.com/
 *
 * sides: number of reflections
 * angle: initial angle in radians
 */

THREE.KaleidoShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"sides":    { type: "f", value: 6.0 },
		"angle":    { type: "f", value: 0.0 }

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
		"uniform float sides;",
		"uniform float angle;",
		
		"varying vec2 vUv;",

		"void main() {",

			"vec2 p = vUv - 0.5;",
			"float r = length(p);",
			"float a = atan(p.y, p.x) + angle;",
			"float tau = 2. * 3.1416 ;",
			"a = mod(a, tau/sides);",
			"a = abs(a - tau/sides/2.) ;",
			"p = r * vec2(cos(a), sin(a));",
			"vec4 color = texture2D(tDiffuse, p + 0.5);",
			"gl_FragColor = color;",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Luminosity
 * http://en.wikipedia.org/wiki/Luminosity
 */

THREE.LuminosityShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null }

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

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",

			"vec3 luma = vec3( 0.299, 0.587, 0.114 );",

			"float v = dot( texel.xyz, luma );",

			"gl_FragColor = vec4( v, v, v, texel.w );",

		"}"

	].join( "\n" )

};

/**
 * @author felixturner / http://airtight.cc/
 *
 * Mirror Shader
 * Copies half the input to the other half
 *
 * side: side of input to mirror (0 = left, 1 = right, 2 = top, 3 = bottom)
 */

THREE.MirrorShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"side":     { type: "i", value: 1 }

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
		"uniform int side;",
		
		"varying vec2 vUv;",

		"void main() {",

			"vec2 p = vUv;",
			"if (side == 0){",
				"if (p.x > 0.5) p.x = 1.0 - p.x;",
			"}else if (side == 1){",
				"if (p.x < 0.5) p.x = 1.0 - p.x;",
			"}else if (side == 2){",
				"if (p.y < 0.5) p.y = 1.0 - p.y;",
			"}else if (side == 3){",
				"if (p.y > 0.5) p.y = 1.0 - p.y;",
			"} ",
			"vec4 color = texture2D(tDiffuse, p);",
			"gl_FragColor = color;",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Normal map shader
 * - compute normals from heightmap
 */

THREE.NormalMapShader = {

	uniforms: {

		"heightMap":  { type: "t", value: null },
		"resolution": { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"scale":      { type: "v2", value: new THREE.Vector2( 1, 1 ) },
		"height":     { type: "f", value: 0.05 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float height;",
		"uniform vec2 resolution;",
		"uniform sampler2D heightMap;",

		"varying vec2 vUv;",

		"void main() {",

			"float val = texture2D( heightMap, vUv ).x;",

			"float valU = texture2D( heightMap, vUv + vec2( 1.0 / resolution.x, 0.0 ) ).x;",
			"float valV = texture2D( heightMap, vUv + vec2( 0.0, 1.0 / resolution.y ) ).x;",

			"gl_FragColor = vec4( ( 0.5 * normalize( vec3( val - valU, val - valV, height  ) ) + 0.5 ), 1.0 );",

		"}"

	].join( "\n" )

};

// Author: Aleksandr Albert
// Website: www.routter.co.tt

// Description: A deep water ocean shader set
// based on an implementation of a Tessendorf Waves
// originally presented by David Li ( www.david.li/waves )

// The general method is to apply shaders to simulation Framebuffers
// and then sample these framebuffers when rendering the ocean mesh

// The set uses 7 shaders:

// -- Simulation shaders
// [1] ocean_sim_vertex         -> Vertex shader used to set up a 2x2 simulation plane centered at (0,0)
// [2] ocean_subtransform       -> Fragment shader used to subtransform the mesh (generates the displacement map)
// [3] ocean_initial_spectrum   -> Fragment shader used to set intitial wave frequency at a texel coordinate
// [4] ocean_phase              -> Fragment shader used to set wave phase at a texel coordinate
// [5] ocean_spectrum           -> Fragment shader used to set current wave frequency at a texel coordinate
// [6] ocean_normal             -> Fragment shader used to set face normals at a texel coordinate

// -- Rendering Shader
// [7] ocean_main               -> Vertex and Fragment shader used to create the final render


THREE.ShaderLib[ 'ocean_sim_vertex' ] = {
	varying: {
		"vUV": { type: "v2" }
	},
	vertexShader: [
		'varying vec2 vUV;',

		'void main (void) {',
			'vUV = position.xy * 0.5 + 0.5;',
			'gl_Position = vec4(position, 1.0 );',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_subtransform' ] = {
	uniforms: {
		"u_input": { type: "t", value: null },
		"u_transformSize": { type: "f", value: 512.0 },
		"u_subtransformSize": { type: "f", value: 250.0 }
	},
	varying: {
		"vUV": { type: "v2" }
	},
	fragmentShader: [
		//GPU FFT using a Stockham formulation

		'precision highp float;',
		'#include <common>',

		'uniform sampler2D u_input;',
		'uniform float u_transformSize;',
		'uniform float u_subtransformSize;',

		'varying vec2 vUV;',

		'vec2 multiplyComplex (vec2 a, vec2 b) {',
			'return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);',
		'}',

		'void main (void) {',
			'#ifdef HORIZONTAL',
			'float index = vUV.x * u_transformSize - 0.5;',
			'#else',
			'float index = vUV.y * u_transformSize - 0.5;',
			'#endif',

			'float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize * 0.5) + mod(index, u_subtransformSize * 0.5);',

			//transform two complex sequences simultaneously
			'#ifdef HORIZONTAL',
			'vec4 even = texture2D(u_input, vec2(evenIndex + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
			'vec4 odd = texture2D(u_input, vec2(evenIndex + u_transformSize * 0.5 + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
			'#else',
			'vec4 even = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + 0.5) / u_transformSize).rgba;',
			'vec4 odd = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + u_transformSize * 0.5 + 0.5) / u_transformSize).rgba;',
			'#endif',

			'float twiddleArgument = -2.0 * PI * (index / u_subtransformSize);',
			'vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));',

			'vec2 outputA = even.xy + multiplyComplex(twiddle, odd.xy);',
			'vec2 outputB = even.zw + multiplyComplex(twiddle, odd.zw);',

			'gl_FragColor = vec4(outputA, outputB);',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_initial_spectrum' ] = {
	uniforms: {
		"u_wind": { type: "v2", value: new THREE.Vector2( 10.0, 10.0 ) },
		"u_resolution": { type: "f", value: 512.0 },
		"u_size": { type: "f", value: 250.0 },
	},
	fragmentShader: [
		'precision highp float;',
		'#include <common>',

		'const float G = 9.81;',
		'const float KM = 370.0;',
		'const float CM = 0.23;',

		'uniform vec2 u_wind;',
		'uniform float u_resolution;',
		'uniform float u_size;',

		'float omega (float k) {',
			'return sqrt(G * k * (1.0 + pow2(k / KM)));',
		'}',

		'float tanh (float x) {',
			'return (1.0 - exp(-2.0 * x)) / (1.0 + exp(-2.0 * x));',
		'}',

		'void main (void) {',
			'vec2 coordinates = gl_FragCoord.xy - 0.5;',

			'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
			'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',

			'vec2 K = (2.0 * PI * vec2(n, m)) / u_size;',
			'float k = length(K);',

			'float l_wind = length(u_wind);',

			'float Omega = 0.84;',
			'float kp = G * pow2(Omega / l_wind);',

			'float c = omega(k) / k;',
			'float cp = omega(kp) / kp;',

			'float Lpm = exp(-1.25 * pow2(kp / k));',
			'float gamma = 1.7;',
			'float sigma = 0.08 * (1.0 + 4.0 * pow(Omega, -3.0));',
			'float Gamma = exp(-pow2(sqrt(k / kp) - 1.0) / 2.0 * pow2(sigma));',
			'float Jp = pow(gamma, Gamma);',
			'float Fp = Lpm * Jp * exp(-Omega / sqrt(10.0) * (sqrt(k / kp) - 1.0));',
			'float alphap = 0.006 * sqrt(Omega);',
			'float Bl = 0.5 * alphap * cp / c * Fp;',

			'float z0 = 0.000037 * pow2(l_wind) / G * pow(l_wind / cp, 0.9);',
			'float uStar = 0.41 * l_wind / log(10.0 / z0);',
			'float alpham = 0.01 * ((uStar < CM) ? (1.0 + log(uStar / CM)) : (1.0 + 3.0 * log(uStar / CM)));',
			'float Fm = exp(-0.25 * pow2(k / KM - 1.0));',
			'float Bh = 0.5 * alpham * CM / c * Fm * Lpm;',

			'float a0 = log(2.0) / 4.0;',
			'float am = 0.13 * uStar / CM;',
			'float Delta = tanh(a0 + 4.0 * pow(c / cp, 2.5) + am * pow(CM / c, 2.5));',

			'float cosPhi = dot(normalize(u_wind), normalize(K));',

			'float S = (1.0 / (2.0 * PI)) * pow(k, -4.0) * (Bl + Bh) * (1.0 + Delta * (2.0 * cosPhi * cosPhi - 1.0));',

			'float dk = 2.0 * PI / u_size;',
			'float h = sqrt(S / 2.0) * dk;',

			'if (K.x == 0.0 && K.y == 0.0) {',
				'h = 0.0;', //no DC term
			'}',
			'gl_FragColor = vec4(h, 0.0, 0.0, 0.0);',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_phase' ] = {
	uniforms: {
		"u_phases": { type: "t", value: null },
		"u_deltaTime": { type: "f", value: null },
		"u_resolution": { type: "f", value: null },
		"u_size": { type: "f", value: null },
	},
	varying: {
		"vUV": { type: "v2" }
	},
	fragmentShader: [
		'precision highp float;',
		'#include <common>',

		'const float G = 9.81;',
		'const float KM = 370.0;',

		'varying vec2 vUV;',

		'uniform sampler2D u_phases;',
		'uniform float u_deltaTime;',
		'uniform float u_resolution;',
		'uniform float u_size;',

		'float omega (float k) {',
			'return sqrt(G * k * (1.0 + k * k / KM * KM));',
		'}',

		'void main (void) {',
			'float deltaTime = 1.0 / 60.0;',
			'vec2 coordinates = gl_FragCoord.xy - 0.5;',
			'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
			'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',
			'vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;',

			'float phase = texture2D(u_phases, vUV).r;',
			'float deltaPhase = omega(length(waveVector)) * u_deltaTime;',
			'phase = mod(phase + deltaPhase, 2.0 * PI);',

			'gl_FragColor = vec4(phase, 0.0, 0.0, 0.0);',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_spectrum' ] = {
	uniforms: {
		"u_size": { type: "f", value: null },
		"u_resolution": { type: "f", value: null },
		"u_choppiness": { type: "f", value: null },
		"u_phases": { type: "t", value: null },
		"u_initialSpectrum": { type: "t", value: null },
	},
	varying: {
		"vUV": { type: "v2" }
	},
	fragmentShader: [
		'precision highp float;',
		'#include <common>',

		'const float G = 9.81;',
		'const float KM = 370.0;',

		'varying vec2 vUV;',

		'uniform float u_size;',
		'uniform float u_resolution;',
		'uniform float u_choppiness;',
		'uniform sampler2D u_phases;',
		'uniform sampler2D u_initialSpectrum;',

		'vec2 multiplyComplex (vec2 a, vec2 b) {',
			'return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);',
		'}',

		'vec2 multiplyByI (vec2 z) {',
			'return vec2(-z[1], z[0]);',
		'}',

		'float omega (float k) {',
			'return sqrt(G * k * (1.0 + k * k / KM * KM));',
		'}',

		'void main (void) {',
			'vec2 coordinates = gl_FragCoord.xy - 0.5;',
			'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
			'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',
			'vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;',

			'float phase = texture2D(u_phases, vUV).r;',
			'vec2 phaseVector = vec2(cos(phase), sin(phase));',

			'vec2 h0 = texture2D(u_initialSpectrum, vUV).rg;',
			'vec2 h0Star = texture2D(u_initialSpectrum, vec2(1.0 - vUV + 1.0 / u_resolution)).rg;',
			'h0Star.y *= -1.0;',

			'vec2 h = multiplyComplex(h0, phaseVector) + multiplyComplex(h0Star, vec2(phaseVector.x, -phaseVector.y));',

			'vec2 hX = -multiplyByI(h * (waveVector.x / length(waveVector))) * u_choppiness;',
			'vec2 hZ = -multiplyByI(h * (waveVector.y / length(waveVector))) * u_choppiness;',

			//no DC term
			'if (waveVector.x == 0.0 && waveVector.y == 0.0) {',
				'h = vec2(0.0);',
				'hX = vec2(0.0);',
				'hZ = vec2(0.0);',
			'}',

			'gl_FragColor = vec4(hX + multiplyByI(h), hZ);',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_normals' ] = {
	uniforms: {
		"u_displacementMap": { type: "t", value: null },
		"u_resolution": { type: "f", value: null },
		"u_size": { type: "f", value: null },
	},
	varying: {
		"vUV": { type: "v2" }
	},
	fragmentShader: [
		'precision highp float;',

		'varying vec2 vUV;',

		'uniform sampler2D u_displacementMap;',
		'uniform float u_resolution;',
		'uniform float u_size;',

		'void main (void) {',
			'float texel = 1.0 / u_resolution;',
			'float texelSize = u_size / u_resolution;',

			'vec3 center = texture2D(u_displacementMap, vUV).rgb;',
			'vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_displacementMap, vUV + vec2(texel, 0.0)).rgb - center;',
			'vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_displacementMap, vUV + vec2(-texel, 0.0)).rgb - center;',
			'vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_displacementMap, vUV + vec2(0.0, -texel)).rgb - center;',
			'vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_displacementMap, vUV + vec2(0.0, texel)).rgb - center;',

			'vec3 topRight = cross(right, top);',
			'vec3 topLeft = cross(top, left);',
			'vec3 bottomLeft = cross(left, bottom);',
			'vec3 bottomRight = cross(bottom, right);',

			'gl_FragColor = vec4(normalize(topRight + topLeft + bottomLeft + bottomRight), 1.0);',
		'}'
	].join( '\n' )
};
THREE.ShaderLib[ 'ocean_main' ] = {
	uniforms: {
		"u_displacementMap": { type: "t", value: null },
		"u_normalMap": { type: "t", value: null },
		"u_geometrySize": { type: "f", value: null },
		"u_size": { type: "f", value: null },
		"u_projectionMatrix": { type: "m4", value: null },
		"u_viewMatrix": { type: "m4", value: null },
		"u_cameraPosition": { type: "v3", value: null },
		"u_skyColor": { type: "v3", value: null },
		"u_oceanColor": { type: "v3", value: null },
		"u_sunDirection": { type: "v3", value: null },
		"u_exposure": { type: "f", value: null },
	},
	varying: {
		"vPos": { type: "v3" },
		"vUV": { type: "v2" }
	},
	vertexShader: [
		'precision highp float;',

		'varying vec3 vPos;',
		'varying vec2 vUV;',

		'uniform mat4 u_projectionMatrix;',
		'uniform mat4 u_viewMatrix;',
		'uniform float u_size;',
		'uniform float u_geometrySize;',
		'uniform sampler2D u_displacementMap;',

		'void main (void) {',
			'vec3 newPos = position + texture2D(u_displacementMap, uv).rgb * (u_geometrySize / u_size);',
			'vPos = newPos;',
			'vUV = uv;',
			'gl_Position = u_projectionMatrix * u_viewMatrix * vec4(newPos, 1.0);',
		'}'
	].join( '\n' ),
	fragmentShader: [
		'precision highp float;',

		'varying vec3 vPos;',
		'varying vec2 vUV;',

		'uniform sampler2D u_displacementMap;',
		'uniform sampler2D u_normalMap;',
		'uniform vec3 u_cameraPosition;',
		'uniform vec3 u_oceanColor;',
		'uniform vec3 u_skyColor;',
		'uniform vec3 u_sunDirection;',
		'uniform float u_exposure;',

		'vec3 hdr (vec3 color, float exposure) {',
			'return 1.0 - exp(-color * exposure);',
		'}',

		'void main (void) {',
			'vec3 normal = texture2D(u_normalMap, vUV).rgb;',

			'vec3 view = normalize(u_cameraPosition - vPos);',
			'float fresnel = 0.02 + 0.98 * pow(1.0 - dot(normal, view), 5.0);',
			'vec3 sky = fresnel * u_skyColor;',

			'float diffuse = clamp(dot(normal, normalize(u_sunDirection)), 0.0, 1.0);',
			'vec3 water = (1.0 - fresnel) * u_oceanColor * u_skyColor * diffuse;',

			'vec3 color = sky + water;',

			'gl_FragColor = vec4(hdr(color, u_exposure), 1.0);',
		'}'
	].join( '\n' )
};

// Parallax Occlusion shaders from
//    http://sunandblackcat.com/tipFullView.php?topicid=28
// No tangent-space transforms logic based on
//   http://mmikkelsen3d.blogspot.sk/2012/02/parallaxpoc-mapping-and-no-tangent.html

THREE.ParallaxShader = {
	// Ordered from fastest to best quality.
	modes: {
		none:  'NO_PARALLAX',
		basic: 'USE_BASIC_PARALLAX',
		steep: 'USE_STEEP_PARALLAX',
		occlusion: 'USE_OCLUSION_PARALLAX', // a.k.a. POM
		relief: 'USE_RELIEF_PARALLAX',
	},

	uniforms: {
		"bumpMap": { type: "t", value: null },
		"map": { type: "t", value: null },
		"parallaxScale": { type: "f", value: null },
		"parallaxMinLayers": { type: "f", value: null },
		"parallaxMaxLayers": { type: "f", value: null }
	},

	vertexShader: [
		"varying vec2 vUv;",
		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",

		"void main() {",

			"vUv = uv;",
			"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
			"vViewPosition = -mvPosition.xyz;",
			"vNormal = normalize( normalMatrix * normal );",
			"gl_Position = projectionMatrix * mvPosition;",

		"}"

  ].join( "\n" ),

	fragmentShader: [
		"uniform sampler2D bumpMap;",
		"uniform sampler2D map;",

		"uniform float parallaxScale;",
		"uniform float parallaxMinLayers;",
		"uniform float parallaxMaxLayers;",

		"varying vec2 vUv;",
		"varying vec3 vViewPosition;",
		"varying vec3 vNormal;",

		"#ifdef USE_BASIC_PARALLAX",

			"vec2 parallaxMap( in vec3 V ) {",

				"float initialHeight = texture2D( bumpMap, vUv ).r;",

				// No Offset Limitting: messy, floating output at grazing angles.
				//"vec2 texCoordOffset = parallaxScale * V.xy / V.z * initialHeight;",

				// Offset Limiting
				"vec2 texCoordOffset = parallaxScale * V.xy * initialHeight;",
				"return vUv - texCoordOffset;",

			"}",

		"#else",

			"vec2 parallaxMap( in vec3 V ) {",

				// Determine number of layers from angle between V and N
				"float numLayers = mix( parallaxMaxLayers, parallaxMinLayers, abs( dot( vec3( 0.0, 0.0, 1.0 ), V ) ) );",

				"float layerHeight = 1.0 / numLayers;",
				"float currentLayerHeight = 0.0;",
				// Shift of texture coordinates for each iteration
				"vec2 dtex = parallaxScale * V.xy / V.z / numLayers;",

				"vec2 currentTextureCoords = vUv;",

				"float heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",

				// while ( heightFromTexture > currentLayerHeight )
				// Infinite loops are not well supported. Do a "large" finite
				// loop, but not too large, as it slows down some compilers.
				"for ( int i = 0; i < 30; i += 1 ) {",
					"if ( heightFromTexture <= currentLayerHeight ) {",
						"break;",
					"}",
					"currentLayerHeight += layerHeight;",
					// Shift texture coordinates along vector V
					"currentTextureCoords -= dtex;",
					"heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",
				"}",

				"#ifdef USE_STEEP_PARALLAX",

					"return currentTextureCoords;",

				"#elif defined( USE_RELIEF_PARALLAX )",

					"vec2 deltaTexCoord = dtex / 2.0;",
					"float deltaHeight = layerHeight / 2.0;",

					// Return to the mid point of previous layer
					"currentTextureCoords += deltaTexCoord;",
					"currentLayerHeight -= deltaHeight;",

					// Binary search to increase precision of Steep Parallax Mapping
					"const int numSearches = 5;",
					"for ( int i = 0; i < numSearches; i += 1 ) {",

						"deltaTexCoord /= 2.0;",
						"deltaHeight /= 2.0;",
						"heightFromTexture = texture2D( bumpMap, currentTextureCoords ).r;",
						// Shift along or against vector V
						"if( heightFromTexture > currentLayerHeight ) {", // Below the surface

							"currentTextureCoords -= deltaTexCoord;",
							"currentLayerHeight += deltaHeight;",

						"} else {", // above the surface

							"currentTextureCoords += deltaTexCoord;",
							"currentLayerHeight -= deltaHeight;",

						"}",

					"}",
					"return currentTextureCoords;",

				"#elif defined( USE_OCLUSION_PARALLAX )",

					"vec2 prevTCoords = currentTextureCoords + dtex;",

					// Heights for linear interpolation
					"float nextH = heightFromTexture - currentLayerHeight;",
					"float prevH = texture2D( bumpMap, prevTCoords ).r - currentLayerHeight + layerHeight;",

					// Proportions for linear interpolation
					"float weight = nextH / ( nextH - prevH );",

					// Interpolation of texture coordinates
					"return prevTCoords * weight + currentTextureCoords * ( 1.0 - weight );",

				"#else", // NO_PARALLAX

					"return vUv;",

				"#endif",

			"}",
		"#endif",

		"vec2 perturbUv( vec3 surfPosition, vec3 surfNormal, vec3 viewPosition ) {",

 			"vec2 texDx = dFdx( vUv );",
			"vec2 texDy = dFdy( vUv );",

			"vec3 vSigmaX = dFdx( surfPosition );",
			"vec3 vSigmaY = dFdy( surfPosition );",
			"vec3 vR1 = cross( vSigmaY, surfNormal );",
			"vec3 vR2 = cross( surfNormal, vSigmaX );",
			"float fDet = dot( vSigmaX, vR1 );",

			"vec2 vProjVscr = ( 1.0 / fDet ) * vec2( dot( vR1, viewPosition ), dot( vR2, viewPosition ) );",
			"vec3 vProjVtex;",
			"vProjVtex.xy = texDx * vProjVscr.x + texDy * vProjVscr.y;",
			"vProjVtex.z = dot( surfNormal, viewPosition );",

			"return parallaxMap( vProjVtex );",
		"}",

		"void main() {",

			"vec2 mapUv = perturbUv( -vViewPosition, normalize( vNormal ), normalize( vViewPosition ) );",
			"gl_FragColor = texture2D( map, mapUv );",

		"}",

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
		"angle":    { type: "f", value: 0.0 }

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

			"vec2 offset = amount * vec2( cos(angle), sin(angle));",
			"vec4 cr = texture2D(tDiffuse, vUv + offset);",
			"vec4 cga = texture2D(tDiffuse, vUv);",
			"vec4 cb = texture2D(tDiffuse, vUv - offset);",
			"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",

		"}"

	].join( "\n" )

};

/**
 * @author mpk / http://polko.me/
 *
 * WebGL port of Subpixel Morphological Antialiasing (SMAA) v2.8
 * Preset: SMAA 1x Medium (with color edge detection)
 * https://github.com/iryoku/smaa/releases/tag/v2.8
 */

THREE.SMAAShader = [ {

	defines: {

		"SMAA_THRESHOLD": "0.1"

	},

	uniforms: {

		"tDiffuse":		{ type: "t", value: null },
		"resolution":	{ type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }

	},

	vertexShader: [

		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[ 3 ];",

		"void SMAAEdgeDetectionVS( vec2 texcoord ) {",
			"vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0,  1.0 );", // WebGL port note: Changed sign in W component
			"vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4(  1.0, 0.0, 0.0, -1.0 );", // WebGL port note: Changed sign in W component
			"vOffset[ 2 ] = texcoord.xyxy + resolution.xyxy * vec4( -2.0, 0.0, 0.0,  2.0 );", // WebGL port note: Changed sign in W component
		"}",

		"void main() {",

			"vUv = uv;",

			"SMAAEdgeDetectionVS( vUv );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[ 3 ];",

		"vec4 SMAAColorEdgeDetectionPS( vec2 texcoord, vec4 offset[3], sampler2D colorTex ) {",
			"vec2 threshold = vec2( SMAA_THRESHOLD, SMAA_THRESHOLD );",

			// Calculate color deltas:
			"vec4 delta;",
			"vec3 C = texture2D( colorTex, texcoord ).rgb;",

			"vec3 Cleft = texture2D( colorTex, offset[0].xy ).rgb;",
			"vec3 t = abs( C - Cleft );",
			"delta.x = max( max( t.r, t.g ), t.b );",

			"vec3 Ctop = texture2D( colorTex, offset[0].zw ).rgb;",
			"t = abs( C - Ctop );",
			"delta.y = max( max( t.r, t.g ), t.b );",

			// We do the usual threshold:
			"vec2 edges = step( threshold, delta.xy );",

			// Then discard if there is no edge:
			"if ( dot( edges, vec2( 1.0, 1.0 ) ) == 0.0 )",
				"discard;",

			// Calculate right and bottom deltas:
			"vec3 Cright = texture2D( colorTex, offset[1].xy ).rgb;",
			"t = abs( C - Cright );",
			"delta.z = max( max( t.r, t.g ), t.b );",

			"vec3 Cbottom  = texture2D( colorTex, offset[1].zw ).rgb;",
			"t = abs( C - Cbottom );",
			"delta.w = max( max( t.r, t.g ), t.b );",

			// Calculate the maximum delta in the direct neighborhood:
			"float maxDelta = max( max( max( delta.x, delta.y ), delta.z ), delta.w );",

			// Calculate left-left and top-top deltas:
			"vec3 Cleftleft  = texture2D( colorTex, offset[2].xy ).rgb;",
			"t = abs( C - Cleftleft );",
			"delta.z = max( max( t.r, t.g ), t.b );",

			"vec3 Ctoptop = texture2D( colorTex, offset[2].zw ).rgb;",
			"t = abs( C - Ctoptop );",
			"delta.w = max( max( t.r, t.g ), t.b );",

			// Calculate the final maximum delta:
			"maxDelta = max( max( maxDelta, delta.z ), delta.w );",

			// Local contrast adaptation in action:
			"edges.xy *= step( 0.5 * maxDelta, delta.xy );",

			"return vec4( edges, 0.0, 0.0 );",
		"}",

		"void main() {",

			"gl_FragColor = SMAAColorEdgeDetectionPS( vUv, vOffset, tDiffuse );",

		"}"

	].join("\n")

}, {

	defines: {

		"SMAA_MAX_SEARCH_STEPS":		"8",
		"SMAA_AREATEX_MAX_DISTANCE":	"16",
		"SMAA_AREATEX_PIXEL_SIZE":		"( 1.0 / vec2( 160.0, 560.0 ) )",
		"SMAA_AREATEX_SUBTEX_SIZE":		"( 1.0 / 7.0 )"

	},

	uniforms: {

		"tDiffuse":		{ type: "t", value: null },
		"tArea":		{ type: "t", value: null },
		"tSearch":		{ type: "t", value: null },
		"resolution":	{ type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }

	},

	vertexShader: [

		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[ 3 ];",
		"varying vec2 vPixcoord;",

		"void SMAABlendingWeightCalculationVS( vec2 texcoord ) {",
			"vPixcoord = texcoord / resolution;",

			// We will use these offsets for the searches later on (see @PSEUDO_GATHER4):
			"vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.25, 0.125, 1.25, 0.125 );", // WebGL port note: Changed sign in Y and W components
			"vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( -0.125, 0.25, -0.125, -1.25 );", // WebGL port note: Changed sign in Y and W components

			// And these for the searches, they indicate the ends of the loops:
			"vOffset[ 2 ] = vec4( vOffset[ 0 ].xz, vOffset[ 1 ].yw ) + vec4( -2.0, 2.0, -2.0, 2.0 ) * resolution.xxyy * float( SMAA_MAX_SEARCH_STEPS );",

		"}",

		"void main() {",

			"vUv = uv;",

			"SMAABlendingWeightCalculationVS( vUv );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"#define SMAASampleLevelZeroOffset( tex, coord, offset ) texture2D( tex, coord + float( offset ) * resolution, 0.0 )",

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tArea;",
		"uniform sampler2D tSearch;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[3];",
		"varying vec2 vPixcoord;",

		"vec2 round( vec2 x ) {",
			"return sign( x ) * floor( abs( x ) + 0.5 );",
		"}",

		"float SMAASearchLength( sampler2D searchTex, vec2 e, float bias, float scale ) {",
			// Not required if searchTex accesses are set to point:
			// float2 SEARCH_TEX_PIXEL_SIZE = 1.0 / float2(66.0, 33.0);
			// e = float2(bias, 0.0) + 0.5 * SEARCH_TEX_PIXEL_SIZE +
			//     e * float2(scale, 1.0) * float2(64.0, 32.0) * SEARCH_TEX_PIXEL_SIZE;
			"e.r = bias + e.r * scale;",
			"return 255.0 * texture2D( searchTex, e, 0.0 ).r;",
		"}",

		"float SMAASearchXLeft( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {",
			/**
			* @PSEUDO_GATHER4
			* This texcoord has been offset by (-0.25, -0.125) in the vertex shader to
			* sample between edge, thus fetching four edges in a row.
			* Sampling with different offsets in each direction allows to disambiguate
			* which edges are active from the four fetched ones.
			*/
			"vec2 e = vec2( 0.0, 1.0 );",

			"for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {", // WebGL port note: Changed while to for
				"e = texture2D( edgesTex, texcoord, 0.0 ).rg;",
				"texcoord -= vec2( 2.0, 0.0 ) * resolution;",
				"if ( ! ( texcoord.x > end && e.g > 0.8281 && e.r == 0.0 ) ) break;",
			"}",

			// We correct the previous (-0.25, -0.125) offset we applied:
			"texcoord.x += 0.25 * resolution.x;",

			// The searches are bias by 1, so adjust the coords accordingly:
			"texcoord.x += resolution.x;",

			// Disambiguate the length added by the last step:
			"texcoord.x += 2.0 * resolution.x;", // Undo last step
			"texcoord.x -= resolution.x * SMAASearchLength(searchTex, e, 0.0, 0.5);",

			"return texcoord.x;",
		"}",

		"float SMAASearchXRight( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {",
			"vec2 e = vec2( 0.0, 1.0 );",

			"for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {", // WebGL port note: Changed while to for
				"e = texture2D( edgesTex, texcoord, 0.0 ).rg;",
				"texcoord += vec2( 2.0, 0.0 ) * resolution;",
				"if ( ! ( texcoord.x < end && e.g > 0.8281 && e.r == 0.0 ) ) break;",
			"}",

			"texcoord.x -= 0.25 * resolution.x;",
			"texcoord.x -= resolution.x;",
			"texcoord.x -= 2.0 * resolution.x;",
			"texcoord.x += resolution.x * SMAASearchLength( searchTex, e, 0.5, 0.5 );",

			"return texcoord.x;",
		"}",

		"float SMAASearchYUp( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {",
			"vec2 e = vec2( 1.0, 0.0 );",

			"for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {", // WebGL port note: Changed while to for
				"e = texture2D( edgesTex, texcoord, 0.0 ).rg;",
				"texcoord += vec2( 0.0, 2.0 ) * resolution;", // WebGL port note: Changed sign
				"if ( ! ( texcoord.y > end && e.r > 0.8281 && e.g == 0.0 ) ) break;",
			"}",

			"texcoord.y -= 0.25 * resolution.y;", // WebGL port note: Changed sign
			"texcoord.y -= resolution.y;", // WebGL port note: Changed sign
			"texcoord.y -= 2.0 * resolution.y;", // WebGL port note: Changed sign
			"texcoord.y += resolution.y * SMAASearchLength( searchTex, e.gr, 0.0, 0.5 );", // WebGL port note: Changed sign

			"return texcoord.y;",
		"}",

		"float SMAASearchYDown( sampler2D edgesTex, sampler2D searchTex, vec2 texcoord, float end ) {",
			"vec2 e = vec2( 1.0, 0.0 );",

			"for ( int i = 0; i < SMAA_MAX_SEARCH_STEPS; i ++ ) {", // WebGL port note: Changed while to for
				"e = texture2D( edgesTex, texcoord, 0.0 ).rg;",
				"texcoord -= vec2( 0.0, 2.0 ) * resolution;", // WebGL port note: Changed sign
				"if ( ! ( texcoord.y < end && e.r > 0.8281 && e.g == 0.0 ) ) break;",
			"}",

			"texcoord.y += 0.25 * resolution.y;", // WebGL port note: Changed sign
			"texcoord.y += resolution.y;", // WebGL port note: Changed sign
			"texcoord.y += 2.0 * resolution.y;", // WebGL port note: Changed sign
			"texcoord.y -= resolution.y * SMAASearchLength( searchTex, e.gr, 0.5, 0.5 );", // WebGL port note: Changed sign

			"return texcoord.y;",
		"}",

		"vec2 SMAAArea( sampler2D areaTex, vec2 dist, float e1, float e2, float offset ) {",
			// Rounding prevents precision errors of bilinear filtering:
			"vec2 texcoord = float( SMAA_AREATEX_MAX_DISTANCE ) * round( 4.0 * vec2( e1, e2 ) ) + dist;",

			// We do a scale and bias for mapping to texel space:
			"texcoord = SMAA_AREATEX_PIXEL_SIZE * texcoord + ( 0.5 * SMAA_AREATEX_PIXEL_SIZE );",

			// Move to proper place, according to the subpixel offset:
			"texcoord.y += SMAA_AREATEX_SUBTEX_SIZE * offset;",

			"return texture2D( areaTex, texcoord, 0.0 ).rg;",
		"}",

		"vec4 SMAABlendingWeightCalculationPS( vec2 texcoord, vec2 pixcoord, vec4 offset[ 3 ], sampler2D edgesTex, sampler2D areaTex, sampler2D searchTex, ivec4 subsampleIndices ) {",
			"vec4 weights = vec4( 0.0, 0.0, 0.0, 0.0 );",

			"vec2 e = texture2D( edgesTex, texcoord ).rg;",

			"if ( e.g > 0.0 ) {", // Edge at north
				"vec2 d;",

				// Find the distance to the left:
				"vec2 coords;",
				"coords.x = SMAASearchXLeft( edgesTex, searchTex, offset[ 0 ].xy, offset[ 2 ].x );",
				"coords.y = offset[ 1 ].y;", // offset[1].y = texcoord.y - 0.25 * resolution.y (@CROSSING_OFFSET)
				"d.x = coords.x;",

				// Now fetch the left crossing edges, two at a time using bilinear
				// filtering. Sampling at -0.25 (see @CROSSING_OFFSET) enables to
				// discern what value each edge has:
				"float e1 = texture2D( edgesTex, coords, 0.0 ).r;",

				// Find the distance to the right:
				"coords.x = SMAASearchXRight( edgesTex, searchTex, offset[ 0 ].zw, offset[ 2 ].y );",
				"d.y = coords.x;",

				// We want the distances to be in pixel units (doing this here allow to
				// better interleave arithmetic and memory accesses):
				"d = d / resolution.x - pixcoord.x;",

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				"vec2 sqrt_d = sqrt( abs( d ) );",

				// Fetch the right crossing edges:
				"coords.y -= 1.0 * resolution.y;", // WebGL port note: Added
				"float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 1, 0 ) ).r;",

				// Ok, we know how this pattern looks like, now it is time for getting
				// the actual area:
				"weights.rg = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.y ) );",
			"}",

			"if ( e.r > 0.0 ) {", // Edge at west
				"vec2 d;",

				// Find the distance to the top:
				"vec2 coords;",

				"coords.y = SMAASearchYUp( edgesTex, searchTex, offset[ 1 ].xy, offset[ 2 ].z );",
				"coords.x = offset[ 0 ].x;", // offset[1].x = texcoord.x - 0.25 * resolution.x;
				"d.x = coords.y;",

				// Fetch the top crossing edges:
				"float e1 = texture2D( edgesTex, coords, 0.0 ).g;",

				// Find the distance to the bottom:
				"coords.y = SMAASearchYDown( edgesTex, searchTex, offset[ 1 ].zw, offset[ 2 ].w );",
				"d.y = coords.y;",

				// We want the distances to be in pixel units:
				"d = d / resolution.y - pixcoord.y;",

				// SMAAArea below needs a sqrt, as the areas texture is compressed
				// quadratically:
				"vec2 sqrt_d = sqrt( abs( d ) );",

				// Fetch the bottom crossing edges:
				"coords.y -= 1.0 * resolution.y;", // WebGL port note: Added
				"float e2 = SMAASampleLevelZeroOffset( edgesTex, coords, ivec2( 0, 1 ) ).g;",

				// Get the area for this direction:
				"weights.ba = SMAAArea( areaTex, sqrt_d, e1, e2, float( subsampleIndices.x ) );",
			"}",

			"return weights;",
		"}",

		"void main() {",

			"gl_FragColor = SMAABlendingWeightCalculationPS( vUv, vPixcoord, vOffset, tDiffuse, tArea, tSearch, ivec4( 0.0 ) );",

		"}"

	].join("\n")

}, {

	uniforms: {

		"tDiffuse":		{ type: "t", value: null },
		"tColor":		{ type: "t", value: null },
		"resolution":	{ type: "v2", value: new THREE.Vector2( 1 / 1024, 1 / 512 ) }

	},

	vertexShader: [

		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[ 2 ];",

		"void SMAANeighborhoodBlendingVS( vec2 texcoord ) {",
			"vOffset[ 0 ] = texcoord.xyxy + resolution.xyxy * vec4( -1.0, 0.0, 0.0, 1.0 );", // WebGL port note: Changed sign in W component
			"vOffset[ 1 ] = texcoord.xyxy + resolution.xyxy * vec4( 1.0, 0.0, 0.0, -1.0 );", // WebGL port note: Changed sign in W component
		"}",

		"void main() {",

			"vUv = uv;",

			"SMAANeighborhoodBlendingVS( vUv );",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join("\n"),

	fragmentShader: [

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tColor;",
		"uniform vec2 resolution;",

		"varying vec2 vUv;",
		"varying vec4 vOffset[ 2 ];",

		"vec4 SMAANeighborhoodBlendingPS( vec2 texcoord, vec4 offset[ 2 ], sampler2D colorTex, sampler2D blendTex ) {",
			// Fetch the blending weights for current pixel:
			"vec4 a;",
			"a.xz = texture2D( blendTex, texcoord ).xz;",
			"a.y = texture2D( blendTex, offset[ 1 ].zw ).g;",
			"a.w = texture2D( blendTex, offset[ 1 ].xy ).a;",

			// Is there any blending weight with a value greater than 0.0?
			"if ( dot(a, vec4( 1.0, 1.0, 1.0, 1.0 )) < 1e-5 ) {",
				"return texture2D( colorTex, texcoord, 0.0 );",
			"} else {",
				// Up to 4 lines can be crossing a pixel (one through each edge). We
				// favor blending by choosing the line with the maximum weight for each
				// direction:
				"vec2 offset;",
				"offset.x = a.a > a.b ? a.a : -a.b;", // left vs. right
				"offset.y = a.g > a.r ? -a.g : a.r;", // top vs. bottom // WebGL port note: Changed signs

				// Then we go in the direction that has the maximum weight:
				"if ( abs( offset.x ) > abs( offset.y )) {", // horizontal vs. vertical
					"offset.y = 0.0;",
				"} else {",
					"offset.x = 0.0;",
				"}",

				// Fetch the opposite color and lerp by hand:
				"vec4 C = texture2D( colorTex, texcoord, 0.0 );",
				"texcoord += sign( offset ) * resolution;",
				"vec4 Cop = texture2D( colorTex, texcoord, 0.0 );",
				"float s = abs( offset.x ) > abs( offset.y ) ? abs( offset.x ) : abs( offset.y );",

				// WebGL port note: Added gamma correction
				"C.xyz = pow(C.xyz, vec3(2.2));",
				"Cop.xyz = pow(Cop.xyz, vec3(2.2));",
				"vec4 mixed = mix(C, Cop, s);",
				"mixed.xyz = pow(mixed.xyz, vec3(1.0 / 2.2));",

				"return mixed;",
			"}",
		"}",

		"void main() {",

			"gl_FragColor = SMAANeighborhoodBlendingPS( vUv, vOffset, tColor, tDiffuse );",

		"}"

	].join("\n")

} ];

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Screen-space ambient occlusion shader
 * - ported from
 *   SSAO GLSL shader v1.2
 *   assembled by Martins Upitis (martinsh) (http://devlog-martinsh.blogspot.com)
 *   original technique is made by ArKano22 (http://www.gamedev.net/topic/550699-ssao-no-halo-artifacts/)
 * - modifications
 * - modified to use RGBA packed depth texture (use clear color 1,1,1,1 for depth pass)
 * - refactoring and optimizations
 */

THREE.SSAOShader = {

	uniforms: {

		"tDiffuse":     { type: "t", value: null },
		"tDepth":       { type: "t", value: null },
		"size":         { type: "v2", value: new THREE.Vector2( 512, 512 ) },
		"cameraNear":   { type: "f", value: 1 },
		"cameraFar":    { type: "f", value: 100 },
		"onlyAO":       { type: "i", value: 0 },
		"aoClamp":      { type: "f", value: 0.5 },
		"lumInfluence": { type: "f", value: 0.5 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",

			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float cameraNear;",
		"uniform float cameraFar;",

		"uniform bool onlyAO;",      // use only ambient occlusion pass?

		"uniform vec2 size;",        // texture width, height
		"uniform float aoClamp;",    // depth clamp - reduces haloing at screen edges

		"uniform float lumInfluence;",  // how much luminance affects occlusion

		"uniform sampler2D tDiffuse;",
		"uniform sampler2D tDepth;",

		"varying vec2 vUv;",

		// "#define PI 3.14159265",
		"#define DL 2.399963229728653",  // PI * ( 3.0 - sqrt( 5.0 ) )
		"#define EULER 2.718281828459045",

		// user variables

		"const int samples = 8;",     // ao sample count
		"const float radius = 5.0;",  // ao radius

		"const bool useNoise = false;",      // use noise instead of pattern for sample dithering
		"const float noiseAmount = 0.0003;", // dithering amount

		"const float diffArea = 0.4;",   // self-shadowing reduction
		"const float gDisplace = 0.4;",  // gauss bell center


		// RGBA depth

		"#include <packing>",

		// generating noise / pattern texture for dithering

		"vec2 rand( const vec2 coord ) {",

			"vec2 noise;",

			"if ( useNoise ) {",

				"float nx = dot ( coord, vec2( 12.9898, 78.233 ) );",
				"float ny = dot ( coord, vec2( 12.9898, 78.233 ) * 2.0 );",

				"noise = clamp( fract ( 43758.5453 * sin( vec2( nx, ny ) ) ), 0.0, 1.0 );",

			"} else {",

				"float ff = fract( 1.0 - coord.s * ( size.x / 2.0 ) );",
				"float gg = fract( coord.t * ( size.y / 2.0 ) );",

				"noise = vec2( 0.25, 0.75 ) * vec2( ff ) + vec2( 0.75, 0.25 ) * gg;",

			"}",

			"return ( noise * 2.0  - 1.0 ) * noiseAmount;",

		"}",

		"float readDepth( const in vec2 coord ) {",

			"float cameraFarPlusNear = cameraFar + cameraNear;",
			"float cameraFarMinusNear = cameraFar - cameraNear;",
			"float cameraCoef = 2.0 * cameraNear;",

			// "return ( 2.0 * cameraNear ) / ( cameraFar + cameraNear - unpackDepth( texture2D( tDepth, coord ) ) * ( cameraFar - cameraNear ) );",
			"return cameraCoef / ( cameraFarPlusNear - unpackRGBAToDepth( texture2D( tDepth, coord ) ) * cameraFarMinusNear );",


		"}",

		"float compareDepths( const in float depth1, const in float depth2, inout int far ) {",

			"float garea = 2.0;",                         // gauss bell width
			"float diff = ( depth1 - depth2 ) * 100.0;",  // depth difference (0-100)

			// reduce left bell width to avoid self-shadowing

			"if ( diff < gDisplace ) {",

				"garea = diffArea;",

			"} else {",

				"far = 1;",

			"}",

			"float dd = diff - gDisplace;",
			"float gauss = pow( EULER, -2.0 * dd * dd / ( garea * garea ) );",
			"return gauss;",

		"}",

		"float calcAO( float depth, float dw, float dh ) {",

			"float dd = radius - depth * radius;",
			"vec2 vv = vec2( dw, dh );",

			"vec2 coord1 = vUv + dd * vv;",
			"vec2 coord2 = vUv - dd * vv;",

			"float temp1 = 0.0;",
			"float temp2 = 0.0;",

			"int far = 0;",
			"temp1 = compareDepths( depth, readDepth( coord1 ), far );",

			// DEPTH EXTRAPOLATION

			"if ( far > 0 ) {",

				"temp2 = compareDepths( readDepth( coord2 ), depth, far );",
				"temp1 += ( 1.0 - temp1 ) * temp2;",

			"}",

			"return temp1;",

		"}",

		"void main() {",

			"vec2 noise = rand( vUv );",
			"float depth = readDepth( vUv );",

			"float tt = clamp( depth, aoClamp, 1.0 );",

			"float w = ( 1.0 / size.x )  / tt + ( noise.x * ( 1.0 - noise.x ) );",
			"float h = ( 1.0 / size.y ) / tt + ( noise.y * ( 1.0 - noise.y ) );",

			"float ao = 0.0;",

			"float dz = 1.0 / float( samples );",
			"float z = 1.0 - dz / 2.0;",
			"float l = 0.0;",

			"for ( int i = 0; i <= samples; i ++ ) {",

				"float r = sqrt( 1.0 - z );",

				"float pw = cos( l ) * r;",
				"float ph = sin( l ) * r;",
				"ao += calcAO( depth, pw * w, ph * h );",
				"z = z - dz;",
				"l = l + DL;",

			"}",

			"ao /= float( samples );",
			"ao = 1.0 - ao;",

			"vec3 color = texture2D( tDiffuse, vUv ).rgb;",

			"vec3 lumcoeff = vec3( 0.299, 0.587, 0.114 );",
			"float lum = dot( color.rgb, lumcoeff );",
			"vec3 luminance = vec3( lum );",

			"vec3 final = vec3( color * mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );",  // mix( color * ao, white, luminance )

			"if ( onlyAO ) {",

				"final = vec3( mix( vec3( ao ), vec3( 1.0 ), luminance * lumInfluence ) );",  // ambient occlusion only

			"}",

			"gl_FragColor = vec4( final, 1.0 );",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Sepia tone shader
 * based on glfx.js sepia shader
 * https://github.com/evanw/glfx.js
 */

THREE.SepiaShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"amount":   { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float amount;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color = texture2D( tDiffuse, vUv );",
			"vec3 c = color.rgb;",

			"color.r = dot( c, vec3( 1.0 - 0.607 * amount, 0.769 * amount, 0.189 * amount ) );",
			"color.g = dot( c, vec3( 0.349 * amount, 1.0 - 0.314 * amount, 0.168 * amount ) );",
			"color.b = dot( c, vec3( 0.272 * amount, 0.534 * amount, 1.0 - 0.869 * amount ) );",

			"gl_FragColor = vec4( min( vec3( 1.0 ), color.rgb ), color.a );",

		"}"

	].join( "\n" )

};

/**
 * @author flimshaw / http://charliehoey.com
 *
 * Technicolor Shader
 * Simulates the look of the two-strip technicolor process popular in early 20th century films.
 * More historical info here: http://www.widescreenmuseum.com/oldcolor/technicolor1.htm
 * Demo here: http://charliehoey.com/technicolor_shader/shader_test.html
 */

THREE.TechnicolorShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },

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

		"void main() {",

			"vec4 tex = texture2D( tDiffuse, vec2( vUv.x, vUv.y ) );",
			"vec4 newTex = vec4(tex.r, (tex.g + tex.b) * .5, (tex.g + tex.b) * .5, 1.0);",

			"gl_FragColor = newTex;",

		"}"

	].join( "\n" )

};

/**
 * @author miibond
 *
 * Full-screen tone-mapping shader based on http://www.graphics.cornell.edu/~jaf/publications/sig02_paper.pdf
 */

THREE.ToneMapShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"averageLuminance":  { type: "f", value: 1.0 },
		"luminanceMap":  { type: "t", value: null },
		"maxLuminance":  { type: "f", value: 16.0 },
		"middleGrey":  { type: "f", value: 0.6 }
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

		"uniform float middleGrey;",
		"uniform float maxLuminance;",
		"#ifdef ADAPTED_LUMINANCE",
			"uniform sampler2D luminanceMap;",
		"#else",
			"uniform float averageLuminance;",
		"#endif",
		
		"const vec3 LUM_CONVERT = vec3(0.299, 0.587, 0.114);",

		"vec3 ToneMap( vec3 vColor ) {",
			"#ifdef ADAPTED_LUMINANCE",
				// Get the calculated average luminance 
				"float fLumAvg = texture2D(luminanceMap, vec2(0.5, 0.5)).r;",
			"#else",
				"float fLumAvg = averageLuminance;",
			"#endif",
			
			// Calculate the luminance of the current pixel
			"float fLumPixel = dot(vColor, LUM_CONVERT);",

			// Apply the modified operator (Eq. 4)
			"float fLumScaled = (fLumPixel * middleGrey) / fLumAvg;",

			"float fLumCompressed = (fLumScaled * (1.0 + (fLumScaled / (maxLuminance * maxLuminance)))) / (1.0 + fLumScaled);",
			"return fLumCompressed * vColor;",
		"}",

		"void main() {",

			"vec4 texel = texture2D( tDiffuse, vUv );",
			
			"gl_FragColor = vec4( ToneMap( texel.xyz ), texel.w );",

		"}"

	].join( "\n" )

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Triangle blur shader
 * based on glfx.js triangle blur shader
 * https://github.com/evanw/glfx.js
 *
 * A basic blur filter, which convolves the image with a
 * pyramid filter. The pyramid filter is separable and is applied as two
 * perpendicular triangle filters.
 */

THREE.TriangleBlurShader = {

	uniforms : {

		"texture": { type: "t", value: null },
		"delta":   { type: "v2", value: new THREE.Vector2( 1, 1 ) }

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

		"#define ITERATIONS 10.0",

		"uniform sampler2D texture;",
		"uniform vec2 delta;",

		"varying vec2 vUv;",

		"void main() {",

			"vec4 color = vec4( 0.0 );",

			"float total = 0.0;",

			// randomize the lookup values to hide the fixed number of samples

			"float offset = rand( vUv );",

			"for ( float t = -ITERATIONS; t <= ITERATIONS; t ++ ) {",

				"float percent = ( t + offset - 0.5 ) / ITERATIONS;",
				"float weight = 1.0 - abs( percent );",

				"color += texture2D( texture, vUv + delta * percent ) * weight;",
				"total += weight;",

			"}",

			"gl_FragColor = color / total;",

		"}"

	].join( "\n" )

};

/**
 * @author alteredq / http://alteredqualia.com/
 *
 * Unpack RGBA depth shader
 * - show RGBA encoded depth as monochrome color
 */

THREE.UnpackDepthRGBAShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"opacity":  { type: "f", value: 1.0 }

	},

	vertexShader: [

		"varying vec2 vUv;",

		"void main() {",

			"vUv = uv;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",

		"}"

	].join( "\n" ),

	fragmentShader: [

		"uniform float opacity;",

		"uniform sampler2D tDiffuse;",

		"varying vec2 vUv;",

		"#include <packing>",

		"void main() {",

			"float depth = 1.0 - unpackRGBAToDepth( texture2D( tDiffuse, vUv ) );",
			"gl_FragColor = opacity * vec4( vec3( depth ), 1.0 );",

		"}"

	].join( "\n" )

};

/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Two pass Gaussian blur filter (horizontal and vertical blur shaders)
 * - described in http://www.gamerendering.com/2008/10/11/gaussian-blur-filter-shader/
 *   and used in http://www.cake23.de/traveling-wavefronts-lit-up.html
 *
 * - 9 samples per pass
 * - standard deviation 2.7
 * - "h" and "v" parameters should be set to "1 / width" and "1 / height"
 */

THREE.VerticalBlurShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"v":        { type: "f", value: 1.0 / 512.0 }

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

		"varying vec2 vUv;",

		"void main() {",

			"vec4 sum = vec4( 0.0 );",

			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 4.0 * v ) ) * 0.051;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y - 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y ) ) * 0.1633;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 1.0 * v ) ) * 0.1531;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 2.0 * v ) ) * 0.12245;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 3.0 * v ) ) * 0.0918;",
			"sum += texture2D( tDiffuse, vec2( vUv.x, vUv.y + 4.0 * v ) ) * 0.051;",

			"gl_FragColor = sum;",

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

THREE.VerticalTiltShiftShader = {

	uniforms: {

		"tDiffuse": { type: "t", value: null },
		"v":        { type: "f", value: 1.0 / 512.0 },
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

/*
TWEENER.AS	-	CLONE();
	@param t		Current time (in frames or seconds).
	@param b		Starting value.
	@param c		Change needed in value.
	@param d		Expected easing duration (in frames or seconds).
	@return		The correct value.
*/

function easeNone(t,b,c,d)
{
	return c*t/d + b;
}

function easeInQuad(t,b,c,d)
{
	return c*(t/=d)*t + b;
}

function easeOutQuad(t,b,c,d)
{
	return -c *(t/=d)*(t-2) + b;
}

function easeInOutQuad(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}

function easeOutInQuad(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuad (t*2, b, c/2, d);
	return this.easeInQuad((t*2)-d, b+c/2, c/2, d);
}

function easeInCubic(t,b,c,d)
{
	return c*(t/=d)*t*t + b;
}

function easeOutCubic(t,b,c,d)
{
	return c*((t=t/d-1)*t*t + 1) + b;
}

function easeInOutCubic(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
}

function easeOutInCubic(t,b,c,d)
{
	if (t < d/2) return this.easeOutCubic (t*2, b, c/2, d);
	return this.easeInCubic((t*2)-d, b+c/2, c/2, d);
}

function easeInQuart(t,b,c,d)
{
	return c*(t/=d)*t*t*t + b;
}

function easeOutQuart(t,b,c,d)
{
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
}

function easeInOutQuart(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b
}

function easeOutInQuart(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuart (t*2, b, c/2, d);
	return this.easeInQuart((t*2)-d, b+c/2, c/2, d);
}

function easeInQuint(t,b,c,d)
{
	return c*(t/=d)*t*t*t*t + b;
}

function easeOutQuint(t,b,c,d)
{
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}

function easeInOutQuint(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
}

function easeOutInQuint(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuint (t*2, b, c/2, d);
	return this.easeInQuint((t*2)-d, b+c/2, c/2, d);
}

function easeInSine(t,b,c,d)
{
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}

function easeOutSine(t,b,c,d)
{
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}

function easeInOutSine(t,b,c,d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

function easeOutInSine(t,b,c,d)
{
	if (t < d/2) return this.easeOutSine (t*2, b, c/2, d);
	return this.easeInSine((t*2)-d, b+c/2, c/2, d);
}

function easeInExpo(t,b,c,d)
{
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}

function easeOutExpo(t,b,c,d)
{
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}

function easeInOutExpo(t,b,c,d)
{
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
	return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
}

function easeOutInExpo(t,b,c,d)
{
	if (t < d/2) return this.easeOutExpo (t*2, b, c/2, d);
	return this.easeInExpo((t*2)-d, b+c/2, c/2, d);
}

function easeInCirc(t,b,c,d)
{
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}

function easeOutCirc(t,b,c,d)
{
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

function easeInOutCirc(t,b,c,d)
{
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}

function easeOutInCirc(t,b,c,d)
{
	if (t < d/2) return this.easeOutCirc (t*2, b, c/2, d);
	return this.easeInCirc((t*2)-d, b+c/2, c/2, d);
}

function easeInElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = d*.3;
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

function easeOutElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = d*.3;
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

function easeInOutElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d/2)==2) return b+c;
	var p = d*(.3*1.5);
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

function easeOutInElastic(t,b,c,d)
{
	if (t < d/2) return this.easeOutElastic (t*2, b, c/2, d);
	return this.easeInElastic((t*2)-d, b+c/2, c/2, d);
}

function easeInBack(t,b,c,d)
{
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}

function easeOutBack(t,b,c,d)
{
	var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

function easeInOutBack(t,b,c,d)
{
	var s = 1.70158;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

function easeOutInBack(t,b,c,d)
{
	if (t < d/2) return this.easeOutBack (t*2, b, c/2, d);
	return this.easeInBack((t*2)-d, b+c/2, c/2, d);
}

function easeInBounce(t,b,c,d)
{
	return c - this.easeOutBounce (d-t, 0, c, d) + b;
}

function easeOutBounce(t,b,c,d)
{
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}

function easeInOutBounce(t,b,c,d)
{
	if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
	else return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
}

function easeOutInBounce(t,b,c,d)
{
	if (t < d/2) return this.easeOutBounce (t*2, b, c/2, d);
	return this.easeInBounce((t*2)-d, b+c/2, c/2, d);
}
