precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D image0;

float random(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 tex = texture2D( image0, uv );
	gl_FragColor = vec4( tex.rgb, 1.0 );
    gl_FragColor *= vec4( 0.8, 0.2, 0.1, 1.0 );
}
