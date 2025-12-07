precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 _mouse = mouse / resolution;
	float d = distance( gl_FragCoord.xy, mouse * resolution );
	float c = 10.0 / d;
	gl_FragColor = vec4(uv,0.5+0.5*sin(time),1.0) + vec4( c, c, c, 1.0 );;
}
