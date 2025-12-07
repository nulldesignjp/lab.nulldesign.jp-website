/*
	engine.js
*/

(function(){

	console.log('%cTHREE.DelaunayGeometry', 'color: #003366;font: bold 24px sans-serif;');

	/*
		平 11cf0b
		山 046d19
		木 03962c
		空 13b0e7
		雲 dcded3
	*/

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x13b0e7, 2400, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 85;
	camera.position.z = 1600;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x13b0e7, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = true;

	document.getElementById('container').appendChild(renderer.domElement);

	//	フィールド
	var _bg = new BeltGramField();
	var _field = _bg.init();
	scene.add( _field );

	//	中央の怪しい球体群	
	var _s = new THREEURLLoader();
	_s.load( 'cloud3.json', function(e){
		scene.add( e );
		e.position.y = 100;
		e.scale.set(10,10,10);
		//	render
		(function render(){
			e.rotation.x += 0.01;
			e.rotation.y += 0.01;
			e.rotation.z += 0.01;
			window.requestAnimationFrame(render);
		})();
	});


	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		_width = _width<1024?1024:_width;

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

		var _r = Math.sin( _time * 0.02 ) * 400 -400 + 1600;
		focus.x = Math.sin( ( _time + 10 ) * 0.01 ) * _r;
		focus.y = camera.position.y + Math.sin( _time * 0.001 ) * 30 - 30;
		focus.z = Math.cos( ( _time + 10 ) * 0.01 ) * _r;

		//	
		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

	//	method
	function rnd()
	{
		return Math.random()*2-1;
	}

})();