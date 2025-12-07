/*{ "midi": true }*/
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D midi;
uniform sampler2D note;

void main() {
    //vec2 p = (gl_FragCoord.xy * 2. - resolution) / min(resolution.x, resolution.y);
    vec2 uv = gl_FragCoord.xy / resolution;

    //  yields the value of CC message of CC#8 sent to Channel 1
    //float color = texture2D(midi, vec2( 176. / 256., 8. / 128.)).x;
    //float note = texture2D( note, vec2(60. / 128., 0)).x;

    //  backbuffer


    	// gl_FragColor = vec4( color, note, 0.0, 1.0 );

        //gl_FragColor = texture2D(midi, vec2( 176. / 256., 8. / 128.));
        gl_FragColor = texture2D( note, uv) + texture2D(midi, uv);

        //  176
        if( uv.x > 175.0 / 256.0 && uv.x < 177.0 / 256.0 )
        {
            gl_FragColor += vec4( 1.0, 0.0, 0.0, 1.0 );
        }


}
