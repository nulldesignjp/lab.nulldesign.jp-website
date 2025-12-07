/*
	engine.js
*/



window.onload = (function(){

	var _clock = new THREE.Clock();
	var _time = 0;

	var _size = 1000.;
	var _scale = 0.0025;
	var _grid = 30.0;

	var _sList = [];

	var _world = new world('webglView');


		var _gui = new dat.GUI();
		var _prop = {
			dist: 100,
			fov: 50
		}
		_gui.add( _prop,'fov',10, 160, 1).onChange(function(){
			_world.camera.fov = _prop.fov;
		});
		_gui.add( _prop,'dist',10, 300, 1).onChange(function(){
			_dollyDist = _prop.dist;
		});

		_world.camera.fov = _prop.fov;
		_dollyDist = _prop.dist;



	//	水平面基準平面
	var _gridObj = new THREE.GridHelper( _size, _size * 0.01 );
	_gridObj.material.color = new THREE.Color(255,255,255);
	_gridObj.material.transparent = true;
	_gridObj.material.opacity = 0.15;
	_world.add( _gridObj );

	var _n = new SimplexNoise();

	var _geometry = new THREE.PlaneGeometry( _size, _size, 100, 100 );
	_geometry.rotateX( - Math.PI * 0.5 );
	var _material = new THREE.MeshBasicMaterial({
		color: new THREE.Color(0.8,0.8,0.8),
		transparent: true,
		opacity: 0.1,
		wireframe: true
	});

	//_geometry.colors = [];
	for( var i = 0; i < _geometry.vertices.length; i++ )
	{
		var _x = _geometry.vertices[i].x * _scale;
		var _z = _geometry.vertices[i].z * _scale;
		var _y = _n.noise( _x, _z );
		_geometry.vertices[i].y = _y * 10.;
		_geometry.colors[i] = new THREE.Color( _geometry.vertices[i].y * 0.5 + 0.5, 0.0, 0.0 );
	}
	_geometry.verticesNeedUpdate = true;
	_geometry.colorsNeedUpdate = true;
	_geometry.elementsNeedUpdate = true;

	_geometry.computeBoundingBox();
	_geometry.computeBoundingSphere();



	var _mesh = new THREE.Mesh( _geometry, _material );
	_world.add( _mesh );



	//	grid2 - pointgrid
	var _count = 0;
	var _gr = 1 - 0.5 * 0.5;
	_gr = Math.sqrt( _gr );

	var _geometry = new THREE.Geometry();
	var _material = new THREE.PointsMaterial();
	for( var i = - _size * 0.5; i <  _size * 0.5; i += _grid )
	{
		_count++;
		var _offset = _count%2==0?0:_grid * 0.5;
		for( var j = - _size * 0.5; j <  _size * 0.5; j += _grid )
		{
			var _x = j + _offset;
			var _z = i;


			var _v3 = new THREE.Vector3( _x, 0, _z );
			_geometry.vertices.push( _v3 );

			
		}
	}


	var _points = new THREE.Points( _geometry, _material );
	_world.add( _points );

	var _woodGeometry = new THREE.Geometry();

	var _boxGeometry = new THREE.Geometry();
	var _boxMaterial = new THREE.MeshBasicMaterial({
		wireframe: true,
		transparent: true,
		opacity: 0.2,
		// color: new THREE.Color( 0.2,0.9,0.4)
	});

	var _humanGeometry = new THREE.Geometry();
	var _humanMaterial = new THREE.MeshBasicMaterial({
		wireframe: true,
		transparent: true,
		opacity: 0.4
		// color: new THREE.Color( 0.4, 0.4, 1.0 )
	});

	var len = _geometry.vertices.length;
	for( var i = 0; i < len; i++ )
	{
		var _x = _geometry.vertices[i].x;
		var _z = _geometry.vertices[i].z;
		var _y = _n.noise( _x * _scale, _z * _scale );

		var _dist = 1.0 - _geometry.vertices[i].length() / ( _size * 0.5 );

		var _isTree = false;

		if( _y - _dist > 0 )
		{
			//	tree
			var _geo = new THREE.BoxGeometry( _grid, _grid, _grid, 1, 1, 1 );
			//_y = _y * 0.5 + 0.5;
			_geo.rotateY( Math.random() * Math.PI * 2.0 );
			_geo.scale( _y, _y, _y );
			_geo.translate( _x, 0 + _grid * _y * 0.5 + 5, _z );
			_boxGeometry.merge ( _geo );

			_woodGeometry.vertices.push( new THREE.Vector3( _x, 0, _z ) );
			_woodGeometry.vertices.push( new THREE.Vector3( _x, 0 + _grid * _y * 0.5 + 5, _z ) );

			_isTree = true;

		} else if( _y - ( 1.0 - _dist ) > 0 && Math.random() < 0.5 )
		{
			//	human
			var _geo = new THREE.ConeGeometry( _grid, _grid * 3, 3, 1 );
			_geo.rotateX( Math.PI );
			_geo.rotateY( Math.random() * Math.PI * 2.0 );
			_geo.scale( 0.1, 0.1, 0.1 );
			_geo.translate( _x, _y + 5, _z );
			_humanGeometry.merge ( _geo );

		}

		//	random
		if( !_isTree && Math.random() < 0.4 )
		{
			_y = Math.random() * 0.2 + 0.2;
			var _geo = new THREE.BoxGeometry( _grid, _grid, _grid, 1, 1, 1 );
			//_y = _y * 0.5 + 0.5;
			_geo.rotateY( Math.random() * Math.PI * 2.0 );
			_geo.scale( _y, _y, _y );
			_geo.translate( _x, 0 + _grid * _y * 0.5 + 5, _z );
			_boxGeometry.merge ( _geo );

			_woodGeometry.vertices.push( new THREE.Vector3( _x, 0, _z ) );
			_woodGeometry.vertices.push( new THREE.Vector3( _x, 0 + _grid * _y * 0.5 + 5, _z ) );
		}
	}

	var _box = new THREE.Mesh( _boxGeometry, _boxMaterial );
	_world.add( _box );

	var _wood = new THREE.LineSegments( _woodGeometry, new THREE.LineBasicMaterial({
		transparent: true,
		opacity: 0.4
	}) );
	_world.add( _wood );



	var _human = new THREE.Mesh( _humanGeometry, _humanMaterial );
	_world.add( _human );


	//	getOBJ( _box, document.getElementById('result0') );
	//	getOBJ( _wood, document.getElementById('result1') );

	var _geometry = new THREE.IcosahedronGeometry( 5, 1 );
	var _material = new THREE.MeshPhongMaterial({
		flatShading: true
	})
	var _mesh = new THREE.Mesh( _geometry, _material );
	_world.add( _mesh )


	//	ループ処理	
	var _count = 0;
	(function _loop(){

		window.requestAnimationFrame(_loop);

		_time += _clock.getDelta();


		// var __time = Math.sin(_time * 0.36) * 0.05;
		// _world.camera.up.set(Math.sin(__time), Math.cos(__time), 0);

		//	dolly zoom
		//var _dist = 100;
		var _distance = _dollyDist / ( 2 * Math.tan( 0.5 * _world.camera.fov / 180.0 * Math.PI ) );
		var _dir = _world.camera.position.normalize();
		_world.camera.position.x = _dir.x * _distance;
		_world.camera.position.y = _dir.y * _distance;
		_world.camera.position.z = _dir.z * _distance;


		_world.camera.updateProjectionMatrix ();

	})();


})();

function easeInOutSine(t,b,c,d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

function getOBJ( _mesh, _dom ){
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

	_dom.innerHTML = _objStr;
}

