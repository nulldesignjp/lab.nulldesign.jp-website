/*
	engine.js
*/

window.onload = function(){
	var width = window.innerWidth;
	var height = window.innerHeight;
	var scene, camera, focus, renderer, controls;

	scene = new THREE.Scene();
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 50, width / height, 1, 6400 );
	camera.position.set( 0, 0, 1000 );
	camera.lookAt( focus );
	scene.add( camera );

	camera.setFocalLength( 30 );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000 );
	renderer.setSize( width, height );

	document.getElementById( 'container' ).appendChild(renderer.domElement);

	var light0 = new THREE.AmbientLight( 0x333333 );
	scene.add( light0 );

	var light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	scene.add( light1 );
	light1.position.set( 1000, 1000, 1000 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	var _grid = new THREE.GridHelper( 1600, 16 );
	_grid.material.transparent = true;
	_grid.material.opacity = 0.4;
	scene.add( _grid )

	// var _material = new THREE.MeshBasicMaterial({wireframe:true});
	// var _mesh = new THREE.Mesh( _geometry, _material );
	// scene.add( _mesh );


	loadModel('../ape1_lowpoly.fbx');
	loadModelResult('stage01.obj');

	//	getOBJ( _mesh );

	function loadModel( e )
	{
		var _loader = new THREE.FBXLoader();
		_loader.load(
			e,
			function(e){
				var _mesh = e.children[0];

				var _geometry = new THREE.Geometry().fromBufferGeometry( _mesh.geometry );
				_geometry.computeBoundingBox();
				_geometry.computeBoundingSphere();
				_geometry.computeFaceNormals();
				_geometry.computeFlatVertexNormals();
				_geometry.computeVertexNormals();
				_geometry.normalsNeedUpdate = true;
				_geometry.elementsNeedUpdate = true;

				var _material = new THREE.MeshBasicMaterial({wireframe:true});
				var _newMesh = new THREE.Mesh( _geometry, _material );
				scene.add( _newMesh );

				console.log(_newMesh)

				getOBJ( _newMesh );
			},
			function(e){},
			function(e){
				console.log( 'Error', e );
				document.getElementById('result').innerHTML = 'Error';
			}
		);
	}

	function loadModelResult(e){
		var _loader = new THREE.OBJLoader();
		_loader.load(
			e,
			function(e){
				var _mesh = e;
				var _material = new THREE.MeshPhongMaterial({
					floatShading: true,
					shininess: 100,
					specular: 0xFFFFFF
				});
				_mesh.material = _material;
				scene.add( _mesh );
				_mesh.position.x = 100;
			},
			function(e){},
			function(e){
				document.getElementById('result').innerHTML = 'ObjLoadError';
			}
		);
	}

	function getOBJ( _mesh ){
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


		document.getElementById('result').innerHTML = _objStr;

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