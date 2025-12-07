/*
	engine.js
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var _miffy;
	var _scale = 100;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x001833, 1600, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.z = 1000;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var amb = new THREE.AmbientLight( 0x333333 );
	scene.add( amb );

	var pl = new THREE.PointLight( 0xFFFFFF, 1.0, 900 );
	pl.position.set( 100, 300, 300 );
	scene.add( pl );

	var dl = new THREE.DirectionalLight( 0xFFFFFF, 0.2, 800 );
	dl.position.set( 100, 100, 300 );
	scene.add( dl );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x001833, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = true;

	document.getElementById('container').appendChild(renderer.domElement);

	(function render(){
		camera.lookAt(focus);
		renderer.render(scene, camera);
		window.requestAnimationFrame( render );
	})();

	_miffy   = new THREE.Object3D(); // 読み込みが完了するまでのダミー
	var _d = new THREEURLLoader();
	_d.load( 'untitled.json', function(geometry,materials){

			var mesh = new THREE.MorphAnimMesh( geometry, materials[0] );
		    scene.add(mesh);

		    var currentKeyFrame = 0;
		    (function ho(){

		    	currentKeyFrame ++;
				mesh.updateAnimation(currentKeyFrame/60);
		    	window.requestAnimationFrame(ho);
		    })();

		    _miffy = mesh;

		_miffy.scale.set(_scale,_scale,_scale);

		var _v = _miffy.geometry.vertices.length;
		var _f = _miffy.geometry.faces.length;

		document.getElementById('info').innerHTML = _f + ' Polygon';

	});

	//$( document ).on( 'mousemove', function(e){
	window.addEventListener( 'mousemove', function(e){
		var _x = e.pageX;
		var _y = e.pageY;
		var _w = window.innerWidth;
		var _h = window.innerHeight;
		var _dx = _x - _w * 0.5;
		var _dy = _y - _h * 0.5;

		var _rad0 = Math.PI * _dx / _w * 2.0;
		var _rad1 = Math.PI * _dy / _h * 2.0;

		_miffy.rotation.y = _rad0;
		_miffy.rotation.x = _rad1;
	});

	window.addEventListener('resize', function (e) {
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
		renderer.setSize(_width, _height);
	}, false);

	function rnd()
	{
		return Math.random() * 2 - 1;
	}
})();