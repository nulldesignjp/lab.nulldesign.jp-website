/*
	engine.js
*/

(function(){

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;
	var scene,camera,focus,renderer,pl,sunLight,_sl01,sun;
	var mesh;
	var _sn;
	var _tn;
	var _scale;


	var _tlist = [];

	setUp();
	init();
	start();

	function setUp()
	{
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x13b0e7, 2400, 3200 );

		camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
		camera.position.y = 600;
		camera.position.z = 1600;

		focus = new THREE.Vector3(0,0,0);
		camera.lookAt( focus );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor( 0x13b0e7, 1 );
		renderer.setSize(_width, _height);
		renderer.autoClear = false;
		renderer.shadowMapEnabled = true;

		pl = new THREE.PointLight( 0xFFFFFF, 0.5, 1600 );
		pl.position.set( 400, 600, 200 );
		scene.add( pl );

		var amb = new THREE.AmbientLight( 0x181818 );
		scene.add( amb );

		//
		var geometry = new THREE.SphereGeometry(10);
		var material = new THREE.MeshBasicMaterial({wireframe:true});
		sun = new THREE.Mesh( geometry, material );
		scene.add( sun );

		sunLight = new THREE.PointLight( 0xFFFFFF, 2.0, 1200 );
		sun.add( sunLight );

		_sl01 = new THREE.SpotLight( 0xFFFFFF, 0.2 );
		_sl01.castShadow = true;
		_sl01.shadowMapWidth = 1024;
		_sl01.shadowMapHeight = 1024;
		scene.add( _sl01 );

		document.getElementById('container').appendChild(renderer.domElement);
	}

	function init()
	{
		var geometry = new THREE.BoxGeometry(1000,10,1000,20,1,20);
		var material = new THREE.MeshLambertMaterial({
			wireframe:false,
			shading:THREE.FlatShading,	//	bug?
			//side:THREE.DoubleSide,
			vertexColors: THREE.VertexColors
		});
		mesh = new THREE.Mesh(geometry,material);
		mesh.receiveShadow = true;
		scene.add(mesh);

		_sn = new SimplexNoise();
		_tn = new SimplexNoise();

		_scale = Math.random() * 0.002 + 0.001;

		var len = geometry.vertices.length;
		while( len )
		{
			len --;
			var _vertex = geometry.vertices[len];

			if( _vertex.y > 0 )
			{
				_vertex.x += rnd()*20;
				_vertex.z += rnd()*20;

				var _value = _sn.noise( _vertex.x * _scale, _vertex.z * _scale ) - .5;
				_vertex.y += _value * 60;
				geometry.colors[len] = new THREE.Color(0.2, 0.9, 0.1);


				var _value = _tn.noise( _vertex.x * _scale, _vertex.z * _scale ) - .5;
				if( _value > 0 )
				{
					var _geometry = new THREE.CylinderGeometry(0, 20, 40, 3, 1 );
					var _material = new THREE.MeshLambertMaterial({color: 0x33CC66});
					var _mesh = new THREE.Mesh( _geometry, _material );
					_mesh.rotation.y = Math.random() * Math.PI;
					//_mesh.scale.set( 0, 0, 0 );

					_mesh.castShadow = true;
					scene.add( _mesh );
					_tlist.push( {index: len, mesh: _mesh } );

				}

			} else if( _vertex.y == 0 )
			{
				_vertex.x += rnd()*10;
				_vertex.y += rnd()*10 - 30;
				_vertex.z += rnd()*10;

				geometry.colors[len] = new THREE.Color(1.0, 0.3, 0.1);
			} else {

				var _dist = Math.sqrt( _vertex.x * _vertex.x + _vertex.z * _vertex.z );
				_vertex.x += rnd()*10;
				_vertex.y -= Math.random() * 600 * ( 1.0 - Math.sin( _dist * 1.414 / 500 ) ) + 60;
				_vertex.z += rnd()*10;

				geometry.colors[len] = new THREE.Color(0.9, 0.5, 0.1);
			}
		}

		var len = geometry.faces.length;
		while( len )
		{
			len --;
			var _face = geometry.faces[len];
			_face.vertexColors = [geometry.colors[_face.a],geometry.colors[_face.b],geometry.colors[_face.c]];
		}

		geometry.colorsNeedUpdate = true;
		geometry.facesNeedUpdate = true;
		geometry.verticesNeedUpdate = true;
		geometry.computeFaceNormals();
		geometry.computeVertexNormals();

		//	CLONE
		var _geo = geometry.clone();


		var _geoObj = [];
		var len = _geo.vertices.length;
		while( len )
		{
			len --;
			var _vertex = _geo.vertices[len];
			_geoObj[len] = {no:len, vtx: Math.sqrt( _vertex.x * _vertex.x + _vertex.y * _vertex.y + _vertex.z * _vertex.z )};
		}

		_geoObj.sort(function(a,b){
			var _a = a.vtx;
			var _b = b.vtx;
			if( _a > _b ) return 1;
			return -1;
		})


		var _vec = [];
		var len = geometry.vertices.length;
		while( len )
		{
			len --;
			var _vertex = geometry.vertices[len];
			_vertex.x = 0;
			_vertex.y = -100;
			_vertex.z = 0;

			_vec[len] = new THREE.Vector3(0,0,0);
			
		}
		var _count = 0;
		(function render(){

			var len = mesh.geometry.vertices.length;
			var count = ( _count * 10.0 ) >> 0;
			len = len>count?count:len;
			while( len )
			{
				len --;
				var _idx = _geoObj[len].no;
				var _vertex = mesh.geometry.vertices[_idx];
				var _tVertex = _geo.vertices[_idx];
				var _vector = _vec[_idx];

				_vertex.x = _tVertex.x;
				_vertex.z = _tVertex.z;

				_vector.x = ( _vector.x + ( _tVertex.x - _vertex.x ) / 30 ) / 1.075000;
				_vector.y = ( _vector.y + ( _tVertex.y - _vertex.y ) / 30 ) / 1.0575000;
				_vector.z = ( _vector.z + ( _tVertex.z - _vertex.z ) / 30 ) / 1.075000;

				_vertex.x += _vector.x;
				_vertex.y += _vector.y;
				_vertex.z += _vector.z;
				
			}
			mesh.geometry.verticesNeedUpdate = true;

			_count ++;
			window.requestAnimationFrame( render );


			var len = _tlist.length;
			while( len )
			{
				len --;
				var _idx = _tlist[len].index;
				var _mesh = _tlist[len].mesh;
				var _vertex = mesh.geometry.vertices[_idx];
				_mesh.position.set( _vertex.x, _vertex.y + 20, _vertex.z );
			}
		})();


		//	frame
		var geometry = new THREE.BoxGeometry(1000,333,1000,3,1,3);
		var material = new THREE.MeshBasicMaterial({wireframe:true,color:0xFFFFFF,transparent:true,opacity:0.2});
		var _frame = new THREE.Mesh(geometry,material);
		scene.add(_frame);



	}

	function start()
	{
		render();
	}

	//	render
	function render(){
		time ++;
		camera.lookAt( focus );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);

		camera.position.x = Math.sin( time * 0.0025 ) * 1600;
		camera.position.z = Math.cos( time * 0.0025 ) * 1600;
		camera.position.y = Math.cos( time * 0.0005 ) * 300 + 350;

		sun.position.x = Math.cos( time * 0.01 ) * 600;
		sun.position.y = Math.sin( time * 0.01 ) * 600;

		sunLight.intensity = ( Math.sin( time * 0.01 ) + 1.0 ) * 0.5 * 2.0;

		_sl01.position.x = sun.position.x;
		_sl01.position.y = sun.position.y;
	}


	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	//	method
	function rnd()
	{
		return Math.random()*2-1;
	}

})();