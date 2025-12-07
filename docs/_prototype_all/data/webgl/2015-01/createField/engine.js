/*
	engine.js
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x13b0e7, 2400, 3200 );

	var sceneBG = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 85;
	camera.position.z = 1600;

	var cameraBG = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 32000);
	cameraBG.position.y = 85;
	cameraBG.position.z = 1600;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x13b0e7, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = false;

	document.getElementById('container').appendChild(renderer.domElement);

	//	フィールド
	var _bg = new BeltGramField();
	var _field = _bg.init();
	scene.add( _field );

	createskybox();

	function createskybox()
	{

		//	skybox
		var geometry = new THREE.IcosahedronGeometry( 24000, 2 );
		var material = new THREE.MeshBasicMaterial({
			color: 0x13b0e7,
			side: THREE.BackSide
		});

		var _shader = {
		uniforms: {
			"skyColor": { type: "c", value: new THREE.Color(0x13b0e7) },
			"time":     { type: "f", value: 0.0 }
		},

		vertexShader: [
			"varying vec3 vUv;",
			"void main() {",
			"vUv = position.xyz;",
			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
			"}"

		].join("\n"),

		fragmentShader: [
			"uniform vec3 skyColor;",
			"varying vec3 vUv;",
			"void main() {",
	    	"vec3 _h = normalize( vUv );",
	    	"float _value = abs( sin(0.1) * 0.1 / ( _h.y + 0.045 ) );",
			"gl_FragColor = vec4(skyColor.r, skyColor.g, skyColor.b, 1.0);",
	    	"gl_FragColor += vec4( vec3( _value ), 0.1 );",
			"}"
		].join("\n")

	};


	/*
	    vec3 allColor = vec3( 0.0, 0.0, 0.0 );
	    vec3 topColor = vec3( 0.1, 0.5, 0.8 );
	    vec3 bottomColor = vec3( 0.1, 0.1, 0.1 );
	    vec3 color = allColor + topColor * par + bottomColor * ( 1.0 - par );

	*/

		var _uniforms = {};
		var _fs = [].join();
		var material = new THREE.ShaderMaterial({
			uniforms: _shader.uniforms,
			fragmentShader: _shader.fragmentShader,
			vertexShader: _shader.vertexShader,
			side: THREE.BackSide
		});
		var _skyBox = new THREE.Mesh( geometry, material );
		sceneBG.add( _skyBox );
	}

	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	//	render
	(function render(){

		time ++;
		var _time = time * 0.3;

		camera.position.x = Math.sin( _time * 0.01 ) * 1600;
		camera.position.z = Math.cos( _time * 0.01 ) * 1600;

		cameraBG.position.x = camera.position.x;
		cameraBG.position.y = camera.position.y;
		cameraBG.position.z = camera.position.z;

		var _r = Math.sin( _time * 0.02 ) * 400 -400 + 1600;
		focus.x = Math.sin( ( _time + 10 ) * 0.01 ) * _r;
		focus.y = camera.position.y + Math.sin( _time * 0.001 ) * 30 - 30;
		focus.z = Math.cos( ( _time + 10 ) * 0.01 ) * _r;

		//	
		camera.lookAt( focus );
		cameraBG.lookAt( focus );
		renderer.render( sceneBG, cameraBG );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

	//	method
	function rnd()
	{
		return Math.random()*2-1;
	}

})();