/*{ "camera": true,
"audio": true
 }*/
precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D image1;
uniform sampler2D spectrum;
uniform sampler2D backbuffer;
uniform sampler2D camera;

const int   oct  = 8;
const float per  = 0.5;
const float PI   = 3.1415926;
const float cCorners = 1.0 / 16.0;
const float cSides   = 1.0 / 8.0;
const float cCenter  = 1.0 / 4.0;

const float contrast = 0.9;

// 補間関数
float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return a * (1.0 - f) + b * f;
}

// 乱数生成
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

// 補間乱数
float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                  rnd(vec2(i.x + 1.0, i.y      )),
                  rnd(vec2(i.x,       i.y + 1.0)),
                  rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);
}

// ノイズ生成
float noise(vec2 p){
    float t = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i));
        float amp  = pow(per, float(oct - i));
        t += irnd(vec2(p.x / freq, p.y / freq)) * amp;
    }
    return t;
}

// シームレスノイズ生成
float snoise(vec2 p, vec2 q, vec2 r){
    return noise(vec2(p.x,       p.y      )) *        q.x  *        q.y  +
           noise(vec2(p.x,       p.y + r.y)) *        q.x  * (1.0 - q.y) +
           noise(vec2(p.x + r.x, p.y      )) * (1.0 - q.x) *        q.y  +
           noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 _uv = uv;
    vec2 tFrag = vec2(1.0 / 256.0);
	float d = distance( gl_FragCoord.xy, mouse * resolution );
	float c = pow( 8.0 / d, 2.0 );

    _uv = uv - 0.5;
    _uv = _uv * rotate2d( distance( _uv,vec2(0.5) ) * 0.0125 );
    _uv = _uv + 0.5;

        vec4 _audio = texture2D( spectrum, uv ); //  original
        float _power = _audio.x;

    //  blur
	vec4 b = texture2D( backbuffer, _uv);
    float luminance = ( 0.298912 * b.r + 0.586611 * b.g + 0.114478 * b.b );

    if( luminance > _power ){
        b *= 0.32;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0,  1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  0.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  0.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0, -1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0, -1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0, -1.0)) / resolution.xy ) * 0.04;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0,  2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0,  2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0,  2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  1.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  1.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0,  0.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0,  0.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0, -1.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0, -1.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-2.0, -2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2(-1.0, -2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 0.0, -2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 1.0, -2.0)) / resolution.xy ) * 0.02;
        b += texture2D(backbuffer, (gl_FragCoord.xy + vec2( 2.0, -2.0)) / resolution.xy ) * 0.02;
    } else {
        b *= 0.9;
        b += vec4( ( sin(time) * 0.5 + 0.5 ) * 0.3, ( cos(time * 0.25) * 0.5 + 0.5 ) * 0.2, 0.2, 1.0 );
    }

	float _rad = noise( _uv * 160.0 * _power + vec2( time * 1.1, - time * 100.0 ) * 0.18341 ) * PI * 4.0;
	float _dist = ( sin( noise( _uv ) * PI * 2.0 ) * 0.5 + 0.5 ) * 0.2 * _power * 5.0;
	vec2 _cuv = _uv + vec2( cos( _rad ), sin( _rad ) ) * _dist;
    vec4 cam = texture2D( camera, _cuv);

    //  contrast
    cam = vec4( cam.rgb - vec3( 0.5 ) * contrast + vec3( 0.5 ), 1.0 );


    //  draw
	gl_FragColor = cam * 0.05 + b * 0.999;
}
