/*
	engine.js
*/

(function(){

	var _scene,_camera,_focus,_renderer;

	//	初期化
	init();


	/*	----------------------------------------------------------------------------
		Shaderここから
	*/
	var _defines = {};

	var _uniforms = {
		time: { type: "f", value: 0.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		mouse: { type: "v2", value: new THREE.Vector2() },
		px: {	type: 'fv1', value: [] },
		py: {	type: 'fv1', value: [] },
	};

	_uniforms.resolution.value.x = window.innerWidth;
	_uniforms.resolution.value.y = window.innerHeight;
	_uniforms.mouse.value.x = 0;
	_uniforms.mouse.value.y = 0;

	for( var i = 0; i < 256; i++ )
	{
		_uniforms.px.value[i] = Math.random();
		_uniforms.py.value[i] = Math.random();

		//console.log('color += hoge( vec2( px['+i+'], py['+i+'] ) );')
	}

	var _shaderMaterial = new THREE.ShaderMaterial( {
		defines: _defines,
		//attributes:     _attributes,
		uniforms:       _uniforms,
		vertexShader:   document.getElementById( 'vertexshader' ).textContent,
		fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
		side: THREE.DoubleSide
	});


	// BufferGeometryを生成
	var _geometry = new THREE.PlaneGeometry( 800, 800, 1, 1 );
	var mesh = new THREE.Mesh(_geometry, _shaderMaterial);
	_scene.add(mesh);

	(function loop()
	{
		for( var i = 0; i < 256; i++ )
		{
			_uniforms.px.value[i] = Math.random();
			_uniforms.py.value[i] = Math.random();
		}
	})();


	/*	----------------------------------------------------------------------------
		Shadertここまで
	*/







	//	レンダリングスタート
	render();












	/*
		setting
	*/
	function init()
	{

		var width  = window.innerWidth;
		var height = window.innerHeight;
		_scene = new THREE.Scene();
		_scene.fog = new THREE.Fog( 0x181818, 1600, 3200 );

		_camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3200);
		_camera.position.set( 0, 0, 1000 );

		_focus = new THREE.Vector3(0,0,0);

		_renderer = new THREE.WebGLRenderer();
		_renderer.setSize( width, height  );
		_renderer.setClearColor( 0x181818 );

		document.getElementById('webgl').appendChild(_renderer.domElement);
	}

	function render()
	{
		_camera.lookAt( _focus );
		_renderer.render( _scene, _camera );
		window.requestAnimationFrame( render );
	}

	window.onresize = function()
	{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			_renderer.setSize( width, height );
			_camera.aspect = width / height;
			_camera.updateProjectionMatrix();
	}
})();
