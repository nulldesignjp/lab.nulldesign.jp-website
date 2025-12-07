/*
	engine.js
*/

window.onload = function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	var scene, camera, focus, renderer, controls;

	scene = new THREE.Scene();
	
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 6400 );
	camera.position.set( 0, 0, 10 );
	camera.lookAt( focus );
	scene.add( camera );

	camera.setFocalLength( 30 );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000 );
	renderer.setSize( width, height );

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		renderer.gammaInput = true;
		renderer.gammaOutput = true;

	document.getElementById( 'container' ).appendChild(renderer.domElement);

	var light0 = new THREE.AmbientLight( 0x333333 );
	scene.add( light0 );

	var light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	scene.add( light1 );
	light1.position.set( 1000, 1000, 1000 );

	var light2 = new THREE.PointLight( 0xFFFFFF, 0.6, 1800 );
	scene.add( light2 );
	light2.position.set( 600, 300, 600 );

	var _spotLight = new THREE.SpotLight( 0xffffff, 1 );
	_spotLight.position.set( 500, 1000, 500 );

	_spotLight.castShadow = true;

	_spotLight.shadow.mapSize.width = 1024;
	_spotLight.shadow.mapSize.height = 1024;

	_spotLight.shadow.camera.near = 500;
	_spotLight.shadow.camera.far = 2000;
	_spotLight.shadow.camera.fov = 30;

	_spotLight.distance = 2000;
	_spotLight.angle = 1.0;
	_spotLight.penumbra = 1.0;
	_spotLight.intensity = 2.0;

	scene.add( _spotLight );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	var _material = new THREE.MeshBasicMaterial({wireframe:true});
	//	Icos
	// var _geometry = new THREE.IcosahedronGeometry( 1, 2 );
	// var _geometry = new THREE.TetrahedronGeometry( 1, 0 );
	// var _geometry = new THREE.OctahedronGeometry( 1, 0 );
	// var _geometry = new THREE.DodecahedronGeometry(1,0);
	// var _geometry = new THREE.ConeGeometry(0.5,1,8,1);
	// var _geometry = new THREE.CylinderGeometry(0.5,0.5,1,8,1);
	var _geometry = new THREE.TorusGeometry(1,0.3,8,16);

	//	Convex
	// var _vertices = [];
	// for( var i = 0; i < 12; i++ )
	// {
	// 	var _v = new THREE.Vector3();
	// 		var _rad0 = Math.random() * Math.PI * 2.0;
	// 		var _rad1 = Math.random() * Math.PI * 2.0;
	// 		var _x = Math.cos( _rad1 ) * Math.cos( _rad0 )
	// 		var _y = Math.sin( _rad0 )
	// 		var _z = Math.sin( _rad1 ) * Math.cos( _rad0 )
	// 	_v.x = _x;
	// 	_v.y = _y;
	// 	_v.z = _z;

	// 	_vertices[i] = _v;
	// }
	// var _geometry = new THREE.ConvexGeometry( _vertices );
	var _geometry = new THREE.DelaunayGeometry(1,1,1000,[]);
	var _scale0 = 2.0;
	var _n = new SimplexNoise();
	var len = _geometry.vertices.length;
	for( var i = 0; i < len; i++ )
	{
		if( _geometry.vertices[i] )
		//	_geometry.vertices[i].z = ( Math.random() - .5 ) * 0.02;
		_geometry.vertices[i].z = _n.noise( _geometry.vertices[i].x * _scale0, _geometry.vertices[i].y * _scale0 ) * 0.02;
	}

	//
	var _mesh = new THREE.Mesh( _geometry, _material );
	scene.add( _mesh );




	getOBJ( _mesh );
	var _mesh2 = new THREE.Mesh( _geometry, new THREE.MeshPhongMaterial({shading: THREE.FlatShading, transparent: true, opacity: 0.4}) );
	_mesh.add( _mesh2 );

	function getOBJ( _mesh ){
		log(_mesh)

		var _objStr = '';
		var _header = '';
		_header += "# Three.js export OBJ." + "\n";
		_header += "# nulldesign.jp" + "\n";
		_header += "# publish: " + new Date().toString() + "\n";
		_header += '# mtllib no-use' + "\n";
		_header += '# usemtl Default' + "\n";
		
		var _name = 'o ' + _mesh.geometry.type + "\n";

		var _v = '';
		var len = _mesh.geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _vertex = _mesh.geometry.vertices[i];
			if(!_vertex)
			{
				_vertex = new THREE.Vector3();
			}
			_v += 'v '+Math.floor( _vertex.x * 10000 ) / 10000+' '+Math.floor( _vertex.y * 10000 ) / 10000+' '+Math.floor( _vertex.z * 10000 ) / 10000 + "\n";
		}

		var _vnl = [];
		var len = _mesh.geometry.faces.length;
		for( var i = 0; i < len; i++ )
		{
			var _fn = _mesh.geometry.faces[i];
			var _f = _mesh.geometry.faces[i].vertexNormals;
			_vnl[ _fn.a ] = _f[0];
			_vnl[ _fn.b ] = _f[1];
			_vnl[ _fn.c ] = _f[2];
		}

		var _vn = '';
		var len = _vnl.length;
		for( var i = 0; i < len; i++ )
		{
			var _f = _vnl[i];
			if( !_f )
			{
				_f = {x:0,y:0,z:1}
			}
			_vn += 'vn ' + Math.floor( _f.x * 10000 ) / 10000 + ' ' + Math.floor( _f.y * 10000 ) / 10000 + ' ' + Math.floor( _f.z * 10000 ) / 10000 + "\n";
		}

		var _section = "";
		//_section += 'usemtl None' + "\n";
		_section += 's off' + "\n";

		var _f = '';

		var len = _mesh.geometry.faces.length;
		for( var i = 0; i < len; i++ )
		{
			var _fa = _mesh.geometry.faces[i];
			_f += 'f ' + ( _fa.a + 1 ) + '/'+(i+1)+' ' + ( _fa.b + 1 ) + '/'+(i+1) + ' ' + ( _fa.c + 1 ) + '/'+(i+1) + "\n";
		}

		_objStr = _header + _name + _v + _vn + _section + _f;

		log( _objStr )

		document.getElementById('result').innerHTML = _objStr;

	}

	function log(e)
	{
		console.log(e);
	}

	window.onresize = resize;
	render();


	function render()
	{
		window.requestAnimationFrame(render);

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