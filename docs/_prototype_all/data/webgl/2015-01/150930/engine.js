/*
	engine.js
*/

(function(){


	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 1600, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.z = 1000;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = false;
	renderer.shadowMapEnabled = true;

	document.getElementById('container').appendChild(renderer.domElement);


	//
	var frameWidth = 58;
	var frameHeight = 74;
	var geometry = new THREE.PlaneBufferGeometry(frameWidth,frameHeight,1,1);
	var material = new THREE.MeshBasicMaterial({
		map: THREE.ImageUtils.loadTexture( "sample.png",null,function(e){

			var _pw = 1.0;
			var _ph = 1.0;
			var _w = e.image.width;
			var _h = e.image.height;
			var _wp = frameWidth / _w;
			var _hp = frameHeight/ _h;
			var _px = _wp / _w;
			var _py = _hp / _h;

			//
			if( _px < _py )
			{
				_pw = _wp / _hp;
				_ph = 1.0;
			} else {
				_pw = 1.0;
				_ph = _hp / _wp;
			}

			if( _pw > 1.0 )
			{
				_ph /= _pw;
				_pw = 1.0;
			}

			if( _ph > 1.0 )
			{
				_pw /= _ph;
				_ph = 1.0;
			}

			var _offsetX = ( 1.0 - _pw ) * 0.5;
			var _offsetY = ( 1.0 - _ph ) * 0.5;


			material.map.repeat.set( _pw, _ph );
			material.map.offset = new THREE.Vector2( 0 + _offsetX, 0 + _offsetY );

			material.map.minFilter = THREE.LinearFilter;
			material.map.wrapS = THREE.RepeatWrapping;
			material.map.wrapT = THREE.RepeatWrapping;

		})
	});


	var mesh = new THREE.Mesh(geometry,material);

	mesh.scale.set(5,5,5);

	scene.add(mesh);

	//mesh.rotation.x = Math.PI * 0.5;


	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		//_width = _width<1024?1024:_width;

		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	//	render
	(function render(){

		time ++;
		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

})();