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
				//"	float val = rand<0.5?0.5:rand;",
				//"	col.rgb = col.rgb + snoise(vec2(pos.x + pos.y * val * 100.0,pos.y + pos.x * val * 100.0 ));",
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
					") * 0.125;",
					"vec4 col = texture2D(tDiffuse,texCoord + 0.5);",
					"gl_FragColor.rgba = col.rgba;",
				"}"
			].join("\n")
		}
