precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	original....
	master: https://thebookofshaders.com/08/?lan=jp
*/

vec3 border( vec2 st, float _weight ){
	vec2 bl = step(vec2(_weight),st);
	vec2 tr = step(vec2(_weight),1.0-st);
	return vec3(bl.x * bl.y * tr.x * tr.y);
}

vec3 rect( vec4 st,vec2 uv ){
	vec2 bl = step( st.xy,uv );
	vec2 tr = step( 1.0 - st.zw,1.0-uv );
	return vec3(bl.x * bl.y * tr.x * tr.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;



	vec3 c0 = rect( vec4( 0.49, 0.45, 0.51, 0.55 ), ( uv - 0.5 ) * rotate2d( time ) + 0.5 );
	vec3 c1 = rect( vec4( 0.45, 0.49, 0.55, 0.51 ), ( uv - 0.5 ) * rotate2d( time ) + 0.5 );
	vec3 c = c0 + c1;
	gl_FragColor = vec4( c, 1.0 );
}
