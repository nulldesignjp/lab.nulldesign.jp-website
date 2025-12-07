precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise2(vec2 st)
{
    vec2 p = floor(st);
    return random(p);
}

float noise3(vec2 st)
{
    vec2 p = floor(st);
    return random(p + vec2(time,0.0));
}

float valueNoise(vec2 st)
{
    vec2 p = floor(st);
    vec2 f = fract(st);

    float v00 = random( p + vec2( 0, 0 ) );
    float v10 = random( p + vec2( 1, 0 ) );
    float v01 = random( p + vec2( 0, 1 ) );
    float v11 = random( p + vec2( 1, 1 ) );

    vec2 u = f * f * (3.0 - 2.0 * f);

    float v0010 = mix(v00, v10, u.x);
    float v0111 = mix(v01, v11, u.x);
    return mix(v0010, v0111, u.y);
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float c = valueNoise( uv * 16.0 + vec2( time, 0.0 ) );
	gl_FragColor = vec4( c, c, c, 1.0 );
}
