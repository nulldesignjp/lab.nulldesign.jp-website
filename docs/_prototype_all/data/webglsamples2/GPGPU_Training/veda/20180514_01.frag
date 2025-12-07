precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D image0;
uniform sampler2D image1;

float random(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tex0 = texture2D( image0, uv);
    vec4 tex1 = texture2D( image1, uv);
	gl_FragColor = tex0 + tex1;
}
