/*
	engine.js
*/

window.onload = function(){
	//	FadeIn
	$('#container').addClass('open');

	var _world = new world('webglView');


	var _geometry = new THREE.BoxGeometry(200,200,200,1,1,1);
	var _material = new THREE.MeshBasicMaterial({
		color: 0x666666,
		wireframe: true
	});
	var _box = new THREE.Mesh( _geometry, _material );
	_world.add( _box );

	var _pointer = $('#pointer');
	_pointer.css({
		'position':'fixed',
		'z-index':'1000',
		'margin':'-5px 0 0 -5px',
		'width':'10px',
		'height':'10px',
		'background':'#F00',
		'font-size':'12px',
		'font-family':'Arial'
	});


	loop();

	function loop(){
		window.requestAnimationFrame(loop);

		_box.rotation.x += 0.01;
		_box.rotation.y += 0.01;
		_box.rotation.z += 0.01;

		//	https://manu.ninja/webgl-three-js-annotations
		var _canvas = _world.renderer.domElement;
		var _camera = _world.camera;
		var _vector = _box.geometry.vertices[0].clone();
		//_vector.applyMatrix4( _box.matrixWorld );	//	localToGlobal
		_box.localToWorld( _vector );	//	localToGlobal
		_vector.project(_camera);
		_vector.x = ~~Math.round((0.5 + _vector.x / 2) * (_canvas.width / window.devicePixelRatio));
		_vector.y = ~~Math.round((0.5 - _vector.y / 2) * (_canvas.height / window.devicePixelRatio));

		// var meshDistance = _camera.position.distanceTo(mesh.position);
		// var spriteDistance = _camera.position.distanceTo(sprite.position);
		// spriteBehindObject = spriteDistance > meshDistance;

		// sprite.material.opacity = spriteBehindObject ? 0.25 : 1;
		// annotation.style.opacity = spriteBehindObject ? 0.25 : 1;

		_pointer.css({
			'left':_vector.x+'px',
			'top':_vector.y+'px'
		});

		_pointer.text( _vector.x+', ' + _vector.y);
		
	}

}
