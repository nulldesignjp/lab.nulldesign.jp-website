/*
	engine.js
*/

(function(){

	console.log('%cTHREE.DelaunayGeometry', 'color: #003366;font: bold 24px sans-serif;');

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	//
	var scene = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 1000;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = true;

	document.getElementById('container').appendChild(renderer.domElement);

	//	THREE.DelaunayGeometry
	var geometry = new THREE.DelaunayGeometry(500,500,100,[]);
	var material = new THREE.MeshBasicMaterial({
		shading:THREE.FlatShading,
		wireframe:true
	});
	var mesh = new THREE.Mesh(geometry,material);
	scene.add( mesh );





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
		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

})();