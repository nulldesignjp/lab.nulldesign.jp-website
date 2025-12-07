uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 skyColor;
varying vec3 vUv;
//  http://glslsandbox.com/e#26859.0
//  http://glslsandbox.com/e#23849.0
//  http://glslsandbox.com/e#23596.0 
//  http://glslsandbox.com/e#22793.8
//  http://glslsandbox.com/e#22713.1
//  http://glslsandbox.com/e#18976.0

//  http://glslsandbox.com/e#16256.1
//  http://glslsandbox.com/e#16255.0

//  http://glslsandbox.com/e#22067.0 
//  http://glslsandbox.com/e#20897.0
//  http://glslsandbox.com/e#13133.1

void main()
{
  vec2 position = gl_FragCoord.xy / resolution.xy;
  vec3 p = normalize( vUv );
  
  float par = ( p.y + 1.0 ) * 0.5;
  float parZ = ( p.z + 1.0 ) * 0.5;
  parZ = parZ*0.5 + 0.5;
  //  _wPar *= parZ; は質感を出すため。
  //  上記　parZ = parZ*0.5 + 0.5; ごと削除しても動くのでイラッとしたら消してもいい。

  vec3 color = vec3( 0.0, 0.0, 0.0 );
  vec3 blue0 = vec3( 0.1725, 0.2235, 0.3019 );
  vec3 blue1 = vec3( 0.6902, 0.8078, 0.9451 );

  //  夕焼け用。失敗。
  //vec3 blue1 = vec3( 0.9902, 0.1078, 0.1451 );
  vec3 white = vec3( 1.0, 1.0, 1.0 );
  vec3 black = vec3( 0.2431, 0.2431, 0.3686 );

    float _wPar = ( par - 0.5 ) / 5.0 * 10.0;
    color += blue0 * _wPar + blue1 * ( 1.0 - _wPar );

    float timeValue = - cos( time );
    timeValue = timeValue<0.0?0.0:timeValue;
    gl_FragColor = vec4( color * timeValue, 1.0 );
    
    //  white
    vec3 _h = normalize( vUv );
    //float _value = abs( _h.y / 1.0 );
    float _value = abs( ( 1.0 - _h.y ) / 1.0 ) * timeValue * 0.5;
    gl_FragColor += vec4( vec3( _value * _value * _value ), 1.0 );
}

//  http://glslsandbox.com/e#15858.0
//  http://glslsandbox.com/e#14877.2
//  http://glslsandbox.com/e#14594.0
//  