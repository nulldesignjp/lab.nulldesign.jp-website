precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec4 v_color;

float circle(vec2 p, float size ){
    return length( p ) - size;
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	float _d = circle( uv - 0.5, 0.2 );
	vec2 _uv = uv;
	_uv -= 0.5;
	_uv = _uv * rotate2d( sin( time * 0.75 ) * _d * 3.0 );
	_uv += 0.5;
	_uv = fract( _uv * 8.0 );
	float d = circle( _uv - 0.5, 0.2 );
	//d = circle( _uv - 0.5, 0.2 * d * 10.0 );

	vec3 _color = vec3( 0 );

	if( d < 0.001 ){
		_color = vec3( 1.0 );
	}

    _color = _color * vec3( _uv, 1.0 );

	gl_FragColor = vec4( _color, 1.0 );
}
