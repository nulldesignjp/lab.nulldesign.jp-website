uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

uniform vec3 lightPosition;
uniform vec3 lightColor;
uniform vec3 planeColor;
uniform vec3 ambientColor;

varying vec3 vNormal;
varying vec3 vUv;

void main()
{
  vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );
  vec3 N = normalize( vNormal );
  vec3 L = normalize( viewLightPosition.xyz );

  float dotNL = dot( N, L );

  vec3 diffuse = planeColor * lightColor * max( dotNL, 0.0 );
  vec3 ambient = planeColor * ambientColor;

  //  opacity
  float dist = length( vUv.xyz );
  float _opacity = 1.0 - dist / 480.0;


  if( _opacity > 0.5 )
  {
    _opacity = 1.0;
  } else {
    _opacity *= 2.0;
  }
  gl_FragColor = vec4( diffuse + ambient, _opacity );

}