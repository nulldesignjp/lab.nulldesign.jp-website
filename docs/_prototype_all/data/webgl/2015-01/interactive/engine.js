/*
	particle study
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;

	var resolution = {x:_width, y:_height};
	var mouse = {x:resolution.x*.5, y:resolution.y*.5};
	//	
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xFFFFFF, 500, 1000 );
	//scene.fog = new THREE.FogExp2( 0x000000, 0.00100 );

	//$('body').css('backgroundColor', '#FFF' );

	var camera = new THREE.PerspectiveCamera( 24, _width / _height, 0.1, 1000 );
	camera.position.set( 0, 0, 500 );

	var focus = new THREE.Vector3();
	focus.set( 0, 0, 0 );
	camera.lookAt( focus );

	// var _amb = new THREE.AmbientLight( 0x060606 );
	// scene.add( _amb );

	// var _dir = new THREE.DirectionalLight( 0xFFFFFF, 0.01 );
	// _dir.position.set( 0.5, 1, 0);
	// scene.add( _dir );

	// var _light = new THREE.PointLight( 0xFFFFFF, 0.2, 1500 );
	// _light.position.set( 200, 200, 200 );
	// scene.add( _light );

	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setClearColor( scene.fog.color, 1 );
	renderer.setSize( _width, _height );
	renderer.gammaInput = true;
	renderer.gammaOutput = true;
	//renderer.autoClear = false;

	var world = new THREE.Group();
	scene.add( world );

	//
	document.getElementById('container').appendChild( renderer.domElement );


	//var _axis = new THREE.AxisHelper(1000);
	//scene.add(_axis);

	// var edges = new THREE.EdgesHelper( _mesh, 0x00FF00 );
	// scene.add(edges);



	for( var i = 0; i < 12; i++ )
	{
		var _x = i%5 - 2;
		var _y = - Math.floor( i / 5 );
		var _z = 0;
		var _grid = 60;
		_x *= _grid;
		_y *= _grid;

		var _geometry = new THREE.BoxGeometry( 20, 20, 20, 1,1,1 );
		var _material = new THREE.MeshBasicMaterial({wireframe:true,color:0x666666});
		var _mesh = new THREE.Mesh( _geometry, _material );
		scene.add( _mesh );


		_mesh.position.set( _x, _y, _z );

		var edges = new THREE.EdgesHelper( _mesh, 0x00FF00 );
		//scene.add(edges);
	}

	addEvents();
	render();





		var geometry = new THREE.Geometry();

		// 立方体個別の要素を作成
		//var meshItem = new THREE.Mesh(new THREE.BoxGeometry(30, 30, 30, 1, 1, 1));
		var _geo = new THREE.Geometry();
		_geo.vertices[0] = new THREE.Vector3(0,0,0);
		_geo.vertices[1] = new THREE.Vector3(0,0,0);
		var meshItem = new THREE.Line(_geo);

		// Box
		for (var i = 0; i < 32; i++) {
		    // meshItem.position.x = 1000 * Math.random() - 500;
		    // meshItem.position.y = 1000 * Math.random() - 500;
		    // meshItem.position.z = 1000 * Math.random() - 500;
		    // meshItem.rotation.x = Math.PI * Math.random() * 2;
		    // meshItem.rotation.y = Math.PI * Math.random() * 2;
		    // meshItem.rotation.z = Math.PI * Math.random() * 2;

		    meshItem.geometry.vertices[0].x = Math.random() * 100 - 50;
		    meshItem.geometry.vertices[0].y = Math.random() * 100 - 50;
		    meshItem.geometry.vertices[0].z = Math.random() * 100 - 50;
		    meshItem.geometry.vertices[1].x = Math.random() * 100 - 50;
		    meshItem.geometry.vertices[1].y = Math.random() * 100 - 50;
		    meshItem.geometry.vertices[1].z = Math.random() * 100 - 50;

		    meshItem.updateMatrix();
		    meshItem.vertexNeedUpdate = true;
		 
		    // ジオメトリを結合
		    //THREE.GeometryUtils.merge( geometry, meshItem.geometry, 0 );
		    geometry.merge( meshItem.geometry, meshItem.matrix );
		}
 
		// マテリアルを作成
		//var material = new THREE.MeshBasicMaterial({color:"#F00",wireframe:true});
		//var material = new THREE.LineBasicMaterial({color:"#F00"});
		var material = new THREE.LineDashedMaterial( { color: 0xFF0000, dashSize: 3, gapSize: 1, linewidth: 1 } );
		// 3D空間に追加
		var mesh = new THREE.Line(geometry, material, THREE.LinePieces);
		scene.add(mesh);


	function render()
	{
		camera.lookAt( focus );
		renderer.render( scene, camera );

		onDocumentMouseDown();

		requestAnimationFrame(render);
	}
	//http://qiita.com/edo_m18/items/5aff5c5e4f421ddd97dc
			function onDocumentMouseDown()
			{

				// 取得したスクリーン座標を-1〜1に正規化する（WebGLは-1〜1で座標が表現される）
				var mouseX =  (mouse.x/resolution.x)  * 2 - 1;
				var mouseY = -(mouse.y/resolution.y) * 2 + 1;

				var vector = new THREE.Vector3( mouseX, mouseY, 1 );
				vector.unproject( camera );

				// 始点、向きベクトルを渡してレイを作成
				var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize());
				// 交差判定
  				// 引数は取得対象となるMeshの配列を渡す。以下はシーン内のすべてのオブジェクトを対象に。
   				var objs = ray.intersectObjects( scene.children );

				if ( objs.length > 0 ) {

					objs[0].object.rotation.x += 0.1;
					objs[0].object.rotation.y += 0.1;

				} else {

				}

			}

	function rnd()
	{
		return Math.random()-.5;
	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			camera.aspect = _width / _height;
			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );
			resolution = {x:_width,y:_height};
		}, false );
		window.addEventListener( 'mousemove', function(e){
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			e.preventDefault();
		}, false );
		window.addEventListener( 'touchmove', function(e){
			mouse.x = e.touches[0].pageX;
			mouse.y = e.touches[0].pageY;
			e.preventDefault();

		}, false );
	}

})();