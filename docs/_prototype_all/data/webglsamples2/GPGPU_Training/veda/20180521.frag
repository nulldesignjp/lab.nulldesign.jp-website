precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D image1;

float circle(vec2 p, float size ){
    return length( p ) - size;
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	//float _d = circle( uv - 0.5, 0.2 );
	vec2 _uv = uv;

	vec4 _color = texture2D( image1, _uv );
    //  _color.rgb = _color.rgb * vec3( _uv, 1.0 );

	gl_FragColor = _color;
}
