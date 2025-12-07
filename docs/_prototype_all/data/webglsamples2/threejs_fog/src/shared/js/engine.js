/*
	engine.js
*/

window.onload = function(){


var _plane;

	//	FadeIn
	$('#siteBody').addClass('open');

	var _world = new world('webglView');
	_world.camera.position.x = 0;
	_world.camera.position.y = 0;
	_world.camera.position.z = 500;



	var _url = '20180506-DSC04328.jpg';
	var _texture = new THREE.TextureLoader();
	_texture.load(
		_url,
		function( _texture ){

			_plane = createPlane( _texture );
			_world.add( _plane );

			var _w = _texture.image.width;
			var _h = _texture.image.height;

			_plane.scale.y = _h * 0.05;
			_plane.scale.x = _w * 0.05;

			loop();

			//	parse check
			var _geometry = new THREE.BoxGeometry(20,20,20,1,1,1);
			var _material = new THREE.MeshPhongMaterial({
				flatShading: true
			});
			var _mesh = new THREE.Mesh( _geometry, _material );
			_world.add( _mesh );

			_mesh.position.y = 140;

		},
		undefined,
		function( err ){
		}
	);

	function loop(){
		window.requestAnimationFrame( loop );

		_plane.material.uniforms.time.value += 1 / 60;
		_plane.material.needsUpdate = true;
		_plane.material.uniformsNeedUpdate = true;
	}

	function createPlane( _texture ){

			var _vertex = [
				"varying vec2 vUv;",
				"varying vec3 vNormal;",
				"void main()",
				"{",
				"	vUv = uv;",
				"	vNormal = normalMatrix * normal;",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}",
			].join('\n');

			var _fragment = [
				"uniform sampler2D texture;",
				"uniform float time;",
				"",

				"uniform vec3 planeColor;",
				"uniform vec3 lightPosition;",
				"uniform vec3 lightColor;",
				"uniform vec3 ambientColor;",
				"",

				"uniform vec3 fogColor;",
				"uniform float fogNear;",
				"uniform float fogFar;",
				"",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",

				"void main()",
				"{",
				"	vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );",
				"	vec3 N = normalize( vNormal );",
				"	vec3 L = normalize( viewLightPosition.xyz );",
				"",
				"	float dotNL = dot( N, L );",
				"",
				"	vec3 diffuse = planeColor * lightColor * max( dotNL, 0.0 );",
				"	vec3 ambient = planeColor * ambientColor;",
				"",
				"	vec4 _color = texture2D( texture, vUv );",
				//	"	float luminance = ( 0.298912 * _color.r + 0.586611 * _color.g + 0.114478 * _color.b );",

				"	gl_FragColor = clamp(_color, 0.0, 1.0);",
				"	gl_FragColor *= vec4( diffuse + ambient, 1.0 );",

				//	FOG
				"#ifdef USE_FOG",
				"    #ifdef USE_LOGDEPTHBUF_EXT",
				"        float depth = gl_FragDepthEXT / gl_FragCoord.w;",
				"    #else",
				"        float depth = gl_FragCoord.z / gl_FragCoord.w;",
				"    #endif",
				"    float fogFactor = smoothstep( fogNear, fogFar, depth );",
				"    gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );",
				"#endif",

				"",
				"}"
			].join( "\n" );

			var _uniforms = {
				'texture': { value: _texture },
				'planeColor': {type: "c", value: new THREE.Color(1.0,1.0,1.0) },
				'lightPosition': {type: "v3", value: _world.directional.position },
				'lightColor': {type: "c", value: _world.directional.color },
				'ambientColor': {type: "c", value: _world.ambient.color },
				'fogColor': { type: "c", value: _world.scene.fog.color },
				'fogNear': { type: "f", value: _world.scene.fog.near },
				'fogFar': { type: "f", value: _world.scene.fog.far },
				'time': { type: "f", value:0}
			};

			var _g = new THREE.PlaneGeometry(1,1,1,1);
			var _m = new THREE.ShaderMaterial({
				uniforms: _uniforms,
				vertexShader: _vertex,
				fragmentShader: _fragment,
				transparent: true,
				//side: THREE.DoubleSide,
				fog: true,
				lights: false
			});

			return new THREE.Mesh( _g, _m );
	}

}





