/*
	engine.js
*/



(function(){
	var scene, camera, renderer;

	init();

	var uniforms = {
		tDiffuse: { 'type': 't', 'value': THREE.ImageUtils.loadTexture('img.jpg') },
		tDgm: { 'type': 't', 'value': THREE.ImageUtils.loadTexture('dgm.png') },
		tTxt: { 'type': 't', 'value': THREE.ImageUtils.loadTexture('txt.png') },
		time: { 'type': 'f', 'value': 0.0 },
		resolution: { 'type': 'v2', 'value': new THREE.Vector2() },
		mouse: { 'type': 'v2', 'value': new THREE.Vector2() }
	};;
	var defines = {};
	var attributes = {};

	uniforms.time.value = 0.0;
	uniforms.resolution.value.x = window.innerWidth;
	uniforms.resolution.value.y = window.innerHeight;
	uniforms.mouse.value.x = 0;
	uniforms.mouse.value.y = 0;

	var vertexShader = [
		'varying vec3 vUv;',
		'void main() {',
		'	vUv = normalize( position );',
		'  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4( position, 1.0);',
		'}'
	].join( "\n" );

	var fragmentShader = [
		'uniform sampler2D tDiffuse;',
		'uniform sampler2D tDgm;',
		'uniform sampler2D tTxt;',
		'uniform float time;',
		'uniform vec2 resolution;',
		'varying vec3 vUv;',
		'void main() {',
		//'gl_FragColor = vec4( (vUv+1.0)*.5, 1.0);',
		'vec2 uv = vUv.xy;',
		'gl_FragColor = texture2D( tDiffuse, (uv+1.0)*.5 );',
		'vec4 dgm = texture2D( tDgm, (uv+1.0)*.5 );',
		'vec4 txt = texture2D( tTxt, (uv+1.0)*.5 );',
		//'dgm = dgm + txt;',
		'if( txt.a == dgm.a ){',
		'txt.a = 0.0;',
		'dgm.a = 0.0;',
		'}',
		'if( dgm.a != 0.0 ){',
		'gl_FragColor = dgm;',
		'}',
		'if( txt.a != 0.0 ){',
		'gl_FragColor = txt;',
		'}',
		//'gl_FragColor.a = gl_FragColor.r * gl_FragColor.r * gl_FragColor.r;',
		'}',
	].join( "\n" );

	var geometry = new THREE.PlaneGeometry(640,640,1,1);
	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
		attributes: attributes,
		defines: {},
		vertexShader: vertexShader,
		fragmentShader: fragmentShader,
		side: THREE.DoubleSide,
		transparent: true,
		depthTest: false,
		shading: THREE.FlatShading
	});
	var mesh = new THREE.Mesh(geometry,material);
	scene.add(mesh);

	(function render(){
		uniforms.time.value += 0.01;


		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	})();

	function init()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xFFFFFF, 800, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1600 );
		camera.position.set(0, 0, 1000);
		camera.lookAt(focus);

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(0xFFFFFF, 1);
		renderer.setSize(_width, _height);
		renderer.gammaInput = true;
		renderer.gammaOutput = true;
		renderer.autoClear = true;

		document.getElementById('container').appendChild(renderer.domElement);

		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
                if (camera.aspect) {
                    camera.aspect = _width / _height;
                }
                else {
                    camera.left = -_width * 0.5;
                    camera.right = _width * 0.5;
                    camera.top = _height * 0.5;
                    camera.bottom = -_height * 0.5;
                }
			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );
		}, false );
	}

})();