/*{ "osc": 4000 }*/
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D osc_foo;      // OSC on /foo
uniform sampler2D osc_foo_bar;  // OSC on /foo/bar
uniform sampler2D osc_mouse_x;
uniform sampler2D osc_mouse_y;

void main() {
    //vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / resolution;

    float _x = texture2D( osc_mouse_x, uv ).x;
    float _y = texture2D( osc_mouse_y, uv ).x;

    float d = distance(gl_FragCoord.xy,vec2( _x,_y) );
    float c = pow( 5.0 / d, 2.0 );

    gl_FragColor = vec4( c, c, c, 1.0 );
}
