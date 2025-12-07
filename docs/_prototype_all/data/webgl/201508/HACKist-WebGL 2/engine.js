/*
	engine.js
*/

(function(){

	//	prop
	var scene, camera, focus, renderer, time;
	var _boxList = [];
	var _size = 320;
	var _grid = 200;
	var _offsetX = 0;
	var _offsetY = 640;

	var _intervalKey,_resizeKey;


	//	start
	init();
	//createGridField();
	render();

	//	method
	function init()
	{

		var _width = window.innerWidth;
		var _height = window.innerHeight;

		time = 0;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xFFFFFF, 400, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		//camera = new THREE.PerspectiveCamera( 60, _width / _height, 0.1, 1600);
		camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
		camera.position.set( 400, 400, 400);
		//camera.position.set(0, 400, 0);
		camera.lookAt(focus);

		var _amb = new THREE.AmbientLight( 0x181818 );
		scene.add( _amb );

		var _pl01 = new THREE.PointLight( 0xFFFFFF, 0.6, 1600 );
		_pl01.position.set( 100, 400, 400 );
		scene.add( _pl01 );

		var _dl01 = new THREE.DirectionalLight( 0xFFFFFF, 0.8, 1200 );
		_dl01.position.set( 400, 1000, 800 );
		scene.add( _dl01 );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0xFFFFFF, 1);
		renderer.setSize(_width, _height);

		document.getElementById('container').appendChild(renderer.domElement);


		//	imgTexture = THREE.ImageUtils.loadTexture( "earth_atmos_2048.jpg", null, _callback );
		var _path = 'images/';
		var _images = ['imgs_01.png','imgs_02.png','imgs_03.png','imgs_04.png','imgs_05.png','imgs_06.png','imgs_07.png','imgs_08.png','imgs_09.png','imgs_10.png','imgs_11.png','imgs_12.png','imgs_13.png','imgs_14.png','imgs_15.png','imgs_16.png','imgs_17.png','imgs_18.png','imgs_19.png','imgs_20.png','imgs_21.png','imgs_22.png','imgs_23.png','imgs_24.png','imgs_25.png','imgs_26.png','imgs_27.png','imgs_28.png','imgs_29.png','imgs_30.png','imgs_31.png','imgs_32.png','imgs_33.png','imgs_34.png','imgs_35.png','imgs_36.png','imgs_37.png','imgs_38.png','imgs_39.png','imgs_40.png','imgs_41.png','imgs_42.png','imgs_43.png','imgs_44.png','imgs_45.png','imgs_46.png','imgs_47.png','imgs_48.png','imgs_49.png','imgs_50.png'];
		for( var i = 0; i < 60; i++ )
		{
			var _img = _path + _images[ Math.floor( Math.random() * _images.length ) ] + '?cache=' + new Date().getTime();
			var _data = {
				title: 'title ' + i,
				description: 'description ' + i,
				images: [_img],
				href: 'http://nulldesign.jp/',
				size: _size,
				date: '2015.08.24'
			};


			var _cell = new indexCell( _data );
			var _mesh = _cell.mesh;

			var _x = Math.floor( Math.random() * 16 - 8 ) * _size;
			var _y = 0;
			var _z = Math.floor( Math.random() * 3 - 1 ) * _size;

			_x = Math.floor( i / 3 ) *  _size;
			_z = (i%3-1) * _size;

			_mesh.position.set( _x, _y, _z );
			scene.add( _mesh );

			//	Event
			// (function(){
			// 	var _a = _post.find('a');
			// 	$.data(_a[0],'data',_data);

			// 	_a.on('mouseover',function(e){
			// 		if( $(e.target)[0] == $(e.currentTarget)[0] )
			// 		{
			// 			var _data = $.data($(e.currentTarget)[0],'data');
			// 			_data.isHover = true;
			// 			$.data($(e.currentTarget)[0],'data',_data);
			// 			_data.mesh.rotation.y = rnd()*Math.PI;
			// 		}
			// 	});
			// 	_a.on('mouseout',function(e){
			// 		if( $(e.target)[0] == $(e.currentTarget)[0] )
			// 		{
			// 			var _data = $.data($(e.currentTarget)[0],'data');
			// 			_data.isHover = false;
			// 			$.data($(e.currentTarget)[0],'data',_data);
			// 		}
			// 	});
			// })();

			//	thx
		}

		var geometry = new THREE.PlaneGeometry(10000,10000,10,10);
		var material = new THREE.MeshBasicMaterial({color:0x000000});
		var _plane = new THREE.Mesh(geometry,material);
		scene.add(_plane);
		_plane.position.y = 100;
		_plane.rotation.x = Math.PI * 0.5;


		//	event
		window.addEventListener( 'resize', function(e)
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			if (camera.aspect) {
				camera.aspect = _width / _height;
			}
			else {
				camera.left = -_width * 0.5;
				camera.right = _width * 0.5;
				camera.top = _height * 0.5;
				camera.bottom = -_height * 0.5;
			}

			camera.updateProjectionMatrix();
			renderer.setSize( _width, _height );

			//	fadeIn
			(function(){
				$('body').removeClass('fadeIn');
				$('body').css('opacity',0);
				clearTimeout( _resizeKey );
				_resizeKey = setTimeout( function(){
					$('body').addClass('fadeIn');
				},400 );
			})();

		}, false );
	}

	function render()
	{
		update();
		time = ( time + 1 ) | 0;

		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	}

	function update()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;
	}

	function createGridField()
	{
		var geometry = new THREE.Geometry();
		for( var i = 0; i < 100; i++ )
		{
			var _p0 = new THREE.Vector3( - 5000 - 50, 0, - 5000 + i * 100-50 )
			var _p1 = new THREE.Vector3( 5000, 0, - 5000 + i * 100-50 )
			geometry.vertices.push( _p0 );
			geometry.vertices.push( _p1 );
		}
		for( var i = 0; i < 100; i++ )
		{
			var _p0 = new THREE.Vector3( - 5000 + i * 100-50, 0, - 5000 )
			var _p1 = new THREE.Vector3( - 5000 + i * 100-50, 0, 5000 )
			geometry.vertices.push( _p0 );
			geometry.vertices.push( _p1 );
		}
		var material = new THREE.LineBasicMaterial({color:0xCCCCCC,transparent:true,opacity:0.4});
		var line = new THREE.Line(geometry,material,THREE.LinePieces);
		scene.add(line);
	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();