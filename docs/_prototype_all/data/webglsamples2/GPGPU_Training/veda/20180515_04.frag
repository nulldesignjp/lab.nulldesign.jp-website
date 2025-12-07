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

vec2 random2(vec2 st){
       vec2 _st = vec2( dot(st,vec2(127.1,311.7)),
                      dot(st,vec2(269.5,183.3)));
       return -1.0 + 2.0 * fract( sin(_st) * 43758.5453123 );
   }

float perlinNoise(vec2 st)
{
    vec2 p = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-2.0*f);

    vec2 v00 = random2( p + vec2(0,0) );
    vec2 v10 = random2( p + vec2(1,0) );
    vec2 v01 = random2( p + vec2(0,1) );
    vec2 v11 = random2( p + vec2(1,1) );

    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),
                 mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ),
                 u.y ) + 0.5;
}

float fBm (vec2 st)
{
    float f = 0.0;
    vec2 q = st;

    f += 0.5000 * perlinNoise( q ); q = q*2.01;
    f += 0.2500 * perlinNoise( q ); q = q*2.02;
    f += 0.1250 * perlinNoise( q ); q = q*2.03;
    f += 0.0625 * perlinNoise( q ); q = q*2.01;

    return f;
}

void main() {
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	float c = fBm( uv * 2.0 + vec2( time * 0.1, 0.0 ) );
	gl_FragColor = vec4( c, c, c, 1.0 );
}
