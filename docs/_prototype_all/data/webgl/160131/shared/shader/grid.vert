varying vec3 pos;
varying vec2 vUv;
varying vec3 vNormal;

void main()
{
    pos = position;
    vUv = uv;

    //	視野座標系の法線ベクトル
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}