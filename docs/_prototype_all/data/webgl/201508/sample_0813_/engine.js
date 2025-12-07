/*
	engine.js
*/

(function(){

	//	佐藤遥推し
	console.log('%cLearning three.js in IST. ♡♡♡', 'color: #003366;font: bold 32px sans-serif;');

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	var time = 0;

	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x000000, 400, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 400;
	camera.position.z = 1600;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = true;

	document.getElementById('container').appendChild(renderer.domElement);

	var amb = new THREE.AmbientLight( 0x181818 );
	scene.add( amb );

	var _pl = new THREE.PointLight( 0xFFFFFF,2.0,2400)
	_pl.position.set( 400, 800, 100 )
	scene.add( _pl );

	var geometry = new THREE.DelaunayGeometry(3200,3200,3200);	//	nulldesign.jp
	var material = new THREE.MeshLambertMaterial({
		//color:0x33CC66,
		vertexColors: THREE.VertexColors,
		shading:THREE.FlatShading,
		wireframe:false
	});
	var mesh = new THREE.Mesh(geometry,material);
	scene.add( mesh );
	//mesh.rotation.x = Math.PI * 0.5;

	var _n = new SimplexNoise();
	var len = geometry.vertices.length;
	var _scale = 0.001;
	while( len )
	{
		len --;
		var _p = geometry.vertices[len]
		var _value = _n.noise( _p.x * _scale, _p.z * _scale );
		_p.y = _value * 160;
	}

	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	(function(){

		var len = geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			//	THREE.Vector3
			var _vertex = geometry.vertices[i];
			var _value = _vertex.y / 160

			//	頂点に色を設定	//	適当
			geometry.colors[i] = new THREE.Color( 0.1, _value * .4+.4, - _value * .4+.4 );
		}
		//	色情報を面情報に追記
		var len = geometry.faces.length;
		for( var i = 0; i < len; i++ )
		{
			//	面を構成するvertexのverticesでのINDEXの値を取得
			var _index0 = geometry.faces[i].a;
			var _index1 = geometry.faces[i].b;
			var _index2 = geometry.faces[i].c;

			//	色を上記のINDEXごとに取得
			var _color0 = geometry.colors[_index0];
			var _color1 = geometry.colors[_index1];
			var _color2 = geometry.colors[_index2];

			//	面の色情報に色を設定
			geometry.faces[i].vertexColors = [_color0,_color1,_color2];
		}
		// geometry.computeFaceNormals();
		// geometry.computeVertexNormals();

		geometry.colorsNeedUpdate = true;

		console.log(geometry)

		//	植物をはやす
		var len = geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			//	THREE.Vector3
			var _vertex = geometry.vertices[i];

			if( _vertex.y > 40 )
			{
				var _geometry = new THREE.BoxGeometry(16,16,16,1,1,1);
				var _material = new THREE.MeshLambertMaterial({color:0x009900});
				var _mesh = new THREE.Mesh(_geometry,_material);
				_mesh.position.set( _vertex.x, _vertex.y, _vertex.z );
				scene.add( _mesh );
			}

		}

	})();


	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	createGridField();

	//	レンダリング
	(function render(){

		time ++;
		_pl.position.x = Math.sin( time * 0.01 ) * 800;

	// var len = geometry.vertices.length;
	// var _scale = 0.001;
	// while( len )
	// {
	// 	len --;
	// 	var _p = geometry.vertices[len]
	// 	var _value = _n.noise( _p.x * _scale + time * .01, _p.z * _scale );
	// 	_p.y = _value * 160;
	// }

	// geometry.verticesNeedUpdate = true;

	// geometry.computeFaceNormals();
	// geometry.computeVertexNormals();


		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

	function createGridField()
	{
		var geometry = new THREE.Geometry();
		for( var i = 0; i < 100; i++ )
		{
			var _p0 = new THREE.Vector3( - 5000, 0, - 5000 + i * 100 )
			var _p1 = new THREE.Vector3( 5000, 0, - 5000 + i * 100 )
			geometry.vertices.push( _p0 );
			geometry.vertices.push( _p1 );
		}
		for( var i = 0; i < 100; i++ )
		{
			var _p0 = new THREE.Vector3( - 5000 + i * 100, 0, - 5000 )
			var _p1 = new THREE.Vector3( - 5000 + i * 100, 0, 5000 )
			geometry.vertices.push( _p0 );
			geometry.vertices.push( _p1 );
		}
		var material = new THREE.LineBasicMaterial({color:0xFFFFFF,transparent:true,opacity:0.2});
		var line = new THREE.Line(geometry,material,THREE.LinePieces);
		scene.add(line);
	}



})();