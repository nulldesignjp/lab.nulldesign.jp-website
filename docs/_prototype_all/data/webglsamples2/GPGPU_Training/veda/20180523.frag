/*
{
  "PASSES": [{
    "vs": "./20180523.vert",
  }],
  "vertexMode": "POINTS"
}
*/

precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//uniform sampler2D backbuffer;

varying vec4 v_color;

void main() {
	// vec2 uv = gl_FragCoord.xy / resolution.xy;
    // vec4 b = texture2D( backbuffer, uv );
    gl_FragColor = v_color;
}
