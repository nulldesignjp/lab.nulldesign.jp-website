/*
	engine.js
*/






//	core
(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = Date.now()%1000;
	var _meshList = [];

	var _ff = new SimplexNoise();
	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 1600, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.z = 2400;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize(_width, _height);

	document.getElementById('container').appendChild(renderer.domElement);

	var _geometry = new THREE.BoxGeometry( 20,20,20,1,1,1 );
	var _material = new THREE.MeshBasicMaterial({
		wireframe: true
	});
	for( var i = 0; i < 11; i++ )
	{
		for( var j = 0; j < 11; j++ )
		{
			for( var k = 0; k < 11; k++ )
			{
				var _mesh = new THREE.Mesh( _geometry, _material );
				_mesh.position.set( i * 100 - 500, j * 100 - 500, k * 100 - 500 );
				scene.add( _mesh );
				_meshList.push( _mesh );
			}
		}
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

		var _zoom = 0.0006;
		var len = _meshList.length;
		while( len )
		{

			len --;
			var _mesh = _meshList[len];

			var _p = _ff.noise3d( _mesh.position.x*_zoom + time * 0.01,_mesh.position.y*_zoom,_mesh.position.z*_zoom );
			var _scale = ( _p + 1.0 ) * 1.0;

			_scale = _scale * _scale;
			_mesh.scale.set( _scale,_scale,_scale );
		}

scene.rotation.x += 0.001;
scene.rotation.y += 0.001;

		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

})();