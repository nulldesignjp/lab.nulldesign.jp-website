/*
	engine.js
*/

(function(){

	//	佐藤遥推し
	console.log('%cLearning three.js in IST. ♡♡♡', 'color: #003366;font: bold 32px sans-serif;');

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;

	var _bgColor = 0x99CCFF;

	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( _bgColor, 1600, 3200 );

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 400;
	camera.position.z = 1600;

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( _bgColor, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = true;

	document.getElementById('container').appendChild(renderer.domElement);

	var amb = new THREE.AmbientLight( _bgColor );
	scene.add( amb );

	var _pl = new THREE.PointLight( 0xFFFFFF,2.0,2400)
	_pl.position.set( 400, 800, 100 )
	scene.add( _pl );

	var geometry = new THREE.DelaunayGeometry(9600,9600,3600);	//	nulldesign.jp
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
	var _scale = 0.0006;
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
				//var _geometry = new THREE.BoxGeometry(16,16,16,1,1,1);
				var _geometry = new THREE.CylinderGeometry( 0, 24, 60, 3 );
				var _material = new THREE.MeshLambertMaterial({color:0x009900});
				var _mesh = new THREE.Mesh(_geometry,_material);
				_mesh.position.set( _vertex.x, _vertex.y + 12, _vertex.z );
				scene.add( _mesh );
				var _scale = Math.random() * .2+.9;
				_mesh.scale.set(_scale,_scale,_scale);
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




	$.ajax({
		url:'StrokeData.xml',
		dataType:'XML',
		type:'GET',
		success: function(data)
		{
			var _lg = new THREE.Geometry();
			$(data).find('ClubPosition').each(function(){

				var _x = $( this ).attr('X') * 30.0;
				var _y = $( this ).attr('Y') * 30.0;
				var _z = $( this ).attr('Z') * 30.0;

				_lg.vertices.push( new THREE.Vector3(_x,_y,_z))

				var geo = new THREE.SphereGeometry(0.1)
				var mat = new THREE.MeshBasicMaterial({wireframe:true})
				var mesh = new THREE.Mesh(geo,mat);
				mesh.position.set(_x,_y,_z);
				scene.add(mesh)
			});
			var _lm = new THREE.LineBasicMaterial();
			var _line = new THREE.Line( _lg, _lm );
			scene.add(_line);

			var _list = [];
			$(data).find('BallPosition').each(function(){

				var _x = $( this ).attr('X') * 10.0;
				var _y = $( this ).attr('Y') * 10.0;
				var _z = $( this ).attr('Z') * 10.0;

				_list.push( new THREE.Vector3(_x,_y,_z) );

				var geo = new THREE.SphereGeometry(1)
				var mat = new THREE.MeshBasicMaterial({wireframe:true})
				var mesh = new THREE.Mesh(geo,mat);
				mesh.position.set(_x,_y,_z);
				scene.add(mesh)
			});

			var curve = new THREE.SplineCurve3( _list );
			var _lg = new THREE.Geometry();
			_lg.vertices = curve.getPoints( 500 );
			var _lm = new THREE.LineBasicMaterial();
			var _line = new THREE.Line( _lg, _lm );
			scene.add(_line);

			camera.position.set(-150, 30, 50);
			focus.x = 1000;
			focus.y = 36;
			focus.z = 0;

			var _count = 0;
			// (function render(){
			// 	_count ++;
			// 	_count %= _lg.vertices.length;

			// 	camera.position.x = focus.x;
			// 	camera.position.y = focus.y;
			// 	camera.position.z = focus.z;

			// 	camera.position.y = camera.position.y<100?100:camera.position.y;
			// 	camera.position.x = focus.x - 100;

			// 	focus.x = _lg.vertices[_count].x;
			// 	focus.y = _lg.vertices[_count].y;
			// 	focus.z = _lg.vertices[_count].z;

			// 	window.requestAnimationFrame(render);
			// })();


			focus.x = _lg.vertices[_lg.vertices.length-1].x + 500;
			(function render(){
				_count ++;
				camera.position.x = Math.sin( Date.now() * 0.0005 ) * 1350 + 1050;
				camera.position.y = Math.sin( Date.now() * 0.0005 ) * 100 + 110;;
				camera.position.z = Math.cos( Date.now() * 0.0001 ) * 10;
				//camera.position.z = focus.z;
				window.requestAnimationFrame(render);
			})();


				var _g = new THREE.GridHelper(10000, 50);
				scene.add(_g)
		},
		error: function(data)
		{
			//console.log(data)
		}
	});


})();