precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	https://thebookofshaders.com/07/
	Piet Mondrian painting.
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

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 _mouse = mouse / resolution;

	float _weight = 0.005;
	vec3 b0 = border( uv, _weight );
	vec3 c0 = rect( vec4( 0.0 + _weight, 0.0 + _weight, 0.1, 0.2), uv );
	vec3 c1 = rect( vec4( 0.0 + _weight, 0.2 + _weight, 0.1, 1.0), uv ) * vec3( 0.4 );
	vec3 c2 = rect( vec4( 0.1 + _weight, 0.0 + _weight, 0.8, 0.1), uv );
	vec3 c3 = rect( vec4( 0.8 + _weight, 0.0 + _weight, 1.0, 0.1), uv ) * vec3( 1.0, 0.0, 0.0 );
	vec3 c4 = rect( vec4( 0.1 + _weight, 0.1 + _weight, 0.4, 0.5), uv ) * vec3( 0.2 );
	vec3 c5 = rect( vec4( 0.4 + _weight, 0.1 + _weight, 0.6, 0.5), uv );
	vec3 c6 = rect( vec4( 0.6 + _weight, 0.1 + _weight, 0.7, 0.5), uv ) * vec3( 0.0, 0.0, 1.0 );
	vec3 c7 = rect( vec4( 0.7 + _weight, 0.1 + _weight, 1.0, 0.5), uv );

	vec3 c8 = rect( vec4( 0.1 + _weight, 0.5 + _weight, 0.2, 0.8), uv );
	vec3 c9 = rect( vec4( 0.2 + _weight, 0.5 + _weight, 0.4, 0.8), uv );
	vec3 c10 = rect( vec4( 0.4 + _weight, 0.5 + _weight, 0.7, 0.8), uv );
	vec3 c11 = rect( vec4( 0.7 + _weight, 0.5 + _weight, 0.9, 0.8), uv );
	vec3 c12 = rect( vec4( 0.9 + _weight, 0.5 + _weight, 1.0, 0.8), uv ) * vec3( 0.0, 1.0, 0.0 );

	vec3 c13 = rect( vec4( 0.1 + _weight, 0.8 + _weight, 0.3, 1.0), uv ) * vec3( 1.0, 1.0, 0.0 );
	vec3 c14 = rect( vec4( 0.3 + _weight, 0.8 + _weight, 0.8, 1.0), uv ) * vec3( 1.0, 0.0, 1.0 );
	vec3 c15 = rect( vec4( 0.8 + _weight, 0.8 + _weight, 1.0, 1.0), uv ) * vec3( 0.0, 1.0, 1.0 );

	gl_FragColor = vec4( ( c0 + c1 + c2 + c3 + c4 + c5 + c6 + c7 + c8 + c9 + c10 + c11 + c12 + c13 + c14 + c15 ) * b0, 1.0 );
}
