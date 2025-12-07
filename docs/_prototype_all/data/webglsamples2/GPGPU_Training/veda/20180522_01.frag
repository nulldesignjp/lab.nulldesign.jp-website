/*{ "audio": true }*/
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D spectrum;
uniform sampler2D backbuffer;

void main() {
    //vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / resolution;

    //  backbuffer
    vec4 b = texture2D( backbuffer, uv ) * vec4( 1.0, 0.0, 0.0, 1.0 );

    vec4 color = texture2D( spectrum, uv ); //  original
    color += texture2D( spectrum, vec2( 1.0 - uv.x, uv.y ) );
    color += texture2D( spectrum, vec2( uv.y, uv.x ) );
    color += texture2D( spectrum, vec2( 1.0 - uv.y, uv.x ) );

	gl_FragColor = color + b * 0.75;
}
