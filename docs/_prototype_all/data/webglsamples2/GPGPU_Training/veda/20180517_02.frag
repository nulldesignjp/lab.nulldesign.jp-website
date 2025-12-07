precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	original....
	master: https://thebookofshaders.com/08/?lan=jp
*/

float box(in vec2 _st, in vec2 _size){
    _size = vec2(0.5) - _size*0.5;
    vec2 uv = smoothstep(_size,
                        _size+vec2(0.001),
                        _st);
    uv *= smoothstep(_size,
                    _size+vec2(0.001),
                    vec2(1.0)-_st);
    return uv.x*uv.y;
}
float cross(in vec2 _st, float _size){
    return  box(_st, vec2(_size,_size/4.)) +
            box(_st, vec2(_size/4.,_size));
}
mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec3 color = vec3(0.0);

	//	中心で回転させる処理。先にUVを回転させておく
    uv -= vec2(0.5);
    uv = rotate2d( sin(time) * 3.1416 ) * uv;
    uv += vec2(0.5);

	//	計算結果の反映
	color += vec3(cross(uv,0.4));

	//	色の代入
	gl_FragColor = vec4(color,1.0);
}
