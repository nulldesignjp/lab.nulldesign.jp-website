/*
	engine.js
*/

window.onload = function(){
	

	var width = window.innerWidth;
	var height = window.innerHeight;

	var scene, camera, focus, renderer, controls;
	var _lineList = [];
	var _vList = [];
	var _lineNum = 1000;
	var _lineLength = 100;
	var _noise = new SimplexNoise();

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 1600, 3200 );
	
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 3200 );
	camera.position.set( 0, 0, 1000 );
	camera.lookAt( focus );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000 );
	renderer.setSize( width, height );
	document.getElementById( 'container' ).appendChild(renderer.domElement);

	var light0 = new THREE.AmbientLight( 0xCCCCCC );
	scene.add( light0 );

	var light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	scene.add( light1 );
	light1.position.set( 1000, 1000, 1000 );

	var light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 1800 );
	scene.add( light2 );
	light2.position.set( 600, 300, 600 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.autoRotate = true;
	controls.autoRotateSpeed = 1.0;

	for( var i = 0; i < _lineNum; i++ )
	{
		var _geometry = new THREE.Geometry();
		var len = _lineLength + Math.floor( Math.random() * _lineLength );
		for( var j = 0; j < len; j++ )
		{
			var _v = new THREE.Vector3();
			_v.x = ( Math.random() - .5 ) * 1;
			_v.y = ( Math.random() - .5 ) * 1;
			_v.z = ( Math.random() - .5 ) * 1;
			_geometry.vertices[j] = _v;
		}
		var _material = new THREE.LineBasicMaterial({
			linewidth:1,
			transparent: true,
			opacity: 0.1,
			blending: THREE.AdditiveBlending,
			depthWrite: false
		});
		var _line = new THREE.Line( _geometry, _material );
		scene.add( _line );
		_lineList[i] = _line;

		var _v = new THREE.Vector3();
		_vList[i] = _v;
	}


	var _geometry = new THREE.IcosahedronGeometry( 360, 1 );
	var _material = new THREE.MeshBasicMaterial({
		wireframe: true,
		transparent: true,
		opacity: 0.1,
		wireframelinewidth: 5
	});
	var _sphere = new THREE.Mesh( _geometry, _material );
	scene.add( _sphere );

	var _geometry = new THREE.IcosahedronGeometry( 100, 3 );
	var _material = new THREE.MeshPhongMaterial({
		color: 0x000000,
		specular: 0xFF0000,
		shininess: 6,
		//wireframe: true
	});
	var _sphere = new THREE.Mesh( _geometry, _material );
	scene.add( _sphere );



	//	INIT
	for( var k = 0; k < _lineLength * 2; k++ )
	{
		var _adj = new Date().getTime() * 0.0001;
		var _scale = 0.00125;
		var len0 = _lineNum;
		while( len0 )
		{
			len0 --;
			var _line = _lineList[len0];
			var _vector = _vList[len0];

			var len1 = _line.geometry.vertices.length;
			while( len1 > 1 )
			{
				len1--;
				_line.geometry.vertices[len1].copy( _line.geometry.vertices[len1 - 1] )
			}
			_line.geometry.vertices[0].add( _vector );
			_line.geometry.verticesNeedUpdate = true;

			var _p = _line.geometry.vertices[0];
			_vector.x += _noise.noise( _p.y * _scale + _adj, _p.z * _scale + _adj );
			_vector.y += _noise.noise( _p.z * _scale + _adj, _p.x * _scale + _adj );
			_vector.z += _noise.noise( _p.x * _scale + _adj, _p.y * _scale + _adj );

			_vector.multiplyScalar( 0.96 );
			_p.normalize().multiplyScalar( 300 );
		}
	}
	
	setInterval( function(){
		var len = _vList.length;
		while( len )
		{
			len --;
			_vList[len].x += ( Math.random() - .5 ) * 20;
			_vList[len].y += ( Math.random() - .5 ) * 20;
			_vList[len].z += ( Math.random() - .5 ) * 20;
		}
	}, 10000 );

	window.onresize = resize;
	render();


	function render()
	{
		window.requestAnimationFrame(render);

		var _adj = new Date().getTime() * 0.0001;
		var _scale = 0.00125;
		var len0 = _lineNum;
		while( len0 )
		{
			len0 --;
			var _line = _lineList[len0];
			var _vector = _vList[len0];

			var len1 = _line.geometry.vertices.length;
			while( len1 > 1 )
			{
				len1--;
				_line.geometry.vertices[len1].copy( _line.geometry.vertices[len1 - 1] )
			}
			_line.geometry.vertices[0].add( _vector );
			_line.geometry.verticesNeedUpdate = true;

			var _p = _line.geometry.vertices[0];
			_vector.x += _noise.noise( _p.y * _scale + _adj, _p.z * _scale + _adj );
			_vector.y += _noise.noise( _p.z * _scale + _adj, _p.x * _scale + _adj );
			_vector.z += _noise.noise( _p.x * _scale + _adj, _p.y * _scale + _adj );

			_vector.multiplyScalar( 0.98 );
			_p.multiplyScalar( 0.96 );
			_p.clampLength( 100, 300 );
			//_p.normalize().multiplyScalar( 300 );

		}


		//	render
		controls.update();
		camera.lookAt( focus );
		renderer.render( scene, camera );
	}
	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize( width, height );
		if( camera.aspect )
		{
			camera.aspect = width / height;
		} else {
			camera.left = - width * 0.5;
			camera.right = width * 0.5;
			camera.bottom = - height * 0.5;
			camera.top = height * 0.5;
		}
		
		camera.updateProjectionMatrix();
	}
};

function easeInBack(t,b,c,d){
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}
function easeInExpo(t,b,c,d){
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}
function easeOutExpo(t,b,c,d){
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}
function easeInQuad(t,b,c,d){
	return c*(t/=d)*t + b;
}