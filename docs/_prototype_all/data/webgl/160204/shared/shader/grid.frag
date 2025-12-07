uniform sampler2D texture;
varying vec3 pos;
varying vec2 vUv;

uniform vec3 lightPosition;	//	光源位置座標
uniform vec3 lightColor;	//	光源色	
uniform vec3 ambientColor;	//	環境光

varying vec3 vNormal;

void main()
{
  vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );

  //	ベクトルの規格化
  vec3 N = normalize( vNormal );
  vec3 L = normalize( viewLightPosition.xyz );
  //法線ベルトルト光源ベクトルの内積
  float dotNL = dot( N, L );
  vec3 materialColor = vec3( 1.0, 1.0, 1.0 );
  vec3 diffuse = materialColor * lightColor * max( dotNL, 0.0 );
  vec3 ambient = materialColor * ambientColor;

  //
  vec3 color = vec3(0.1, 0.6, 0.3);
  gl_FragColor = texture2D( texture, vUv );

  if( mod( pos.z, 0.2 ) < 0.01 ){ gl_FragColor = vec4( color, 0.40 );  };
  if( mod( pos.z, 1.0 ) < 0.04 ){ gl_FragColor = vec4( color, 0.50 );  };
  gl_FragColor *= vec4( diffuse + ambient, 1.0 );
}