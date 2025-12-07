precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float c = random( uv * 32.0 + vec2( time * 0.001, 0.0 ) ) * 0.5;
	gl_FragColor = vec4( c,c,c, 1.0 );
}
