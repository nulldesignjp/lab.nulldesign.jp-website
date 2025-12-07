/*
	engine.js
*/

(function(){

	//	prop
	var scene, camera, focus, renderer;
	var _boxList = [];
	var _size = 100;
	var _grid = 200;
	var _offsetX = 0;
	var _offsetY = 110;

	var _intervalKey,_resizeKey;


	//	start
	init();
	changeView();
	render();

	//	method
	function init()
	{

		var _width = window.innerWidth;
		var _height = window.innerHeight;

		scene = new THREE.Scene();
		//scene.fog = new THREE.Fog( _bg, 400, 1600 );

		focus = new THREE.Vector3( 0, 0, 0 );

		//camera = new THREE.PerspectiveCamera( 60, _width / _height, 0.1, 1600);
		camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
		camera.position.set(0, 0, 400);
		camera.lookAt(focus);

		renderer = new THREE.WebGLRenderer({ antialias: false });
		renderer.setClearColor(0xFFFFFF, 1);
		renderer.setSize(_width, _height);

		document.getElementById('container').appendChild(renderer.domElement);


		//	imgTexture = THREE.ImageUtils.loadTexture( "earth_atmos_2048.jpg", null, _callback );
		for( var i = 0; i < 125; i++ )
		{

			//	data
			var _srcData = {
				title:'title ' + i,
				description:'description ' + i,
				date:'2015.08.24',
				images:['image.png'],
				href:'# ',
				size: _size
			}

			//	create cell
			var _cell = new indexCell( _srcData );
			_cellData = _cell.init();

			//	layout
			var _num = Math.floor( _width / _grid );
			_offsetX = ( _width - ( _num - 1 ) * _grid ) * 0.5;
			var _x = - _width * 0.5 + ( i % _num) * _grid + _offsetX;
			var _y = _height * 0.5 - _size*.5 - ( Math.floor( i / _num ) * _grid ) - _offsetY;
			_cellData.mesh.position.set(_x,_y,0);
			scene.add(_cellData.mesh);

			var _post = _cellData.dom;
			$('#seo').append(_post);

			var _x = _offsetX + ( i % _num) * _grid - _size*0.5;
			var _y = _offsetY + ( Math.floor( i / _num ) * _grid );
			_post.css({
				left: _x + 'px',
				top: _y + 'px'
			});

			$('#siteId').css('left', _offsetX - _size * 0.5 + 'px' );

			//	data
			var _data = {
				mesh: _cellData.mesh,
				dom: _post,
				faces: {x:0,y:0,z:0},
				isHover:false
			}
			_boxList.push(_data);

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

			//	LAYOUT
			var _num = Math.floor( _width / _grid );
			_offsetX = ( _width - ( _num - 1 ) * _grid ) * 0.5;
			var len = _boxList.length;
			for( var i = 0; i < len; i ++ )
			{
				var mesh = _boxList[i].mesh;

				var _x = - _width * 0.5 + _offsetX + ( i % _num ) * _grid;
				var _y = _height * 0.5 - _offsetY - _size*.5 - ( Math.floor( i / _num ) * _grid );
				mesh.position.set(_x,_y,0);

				_boxList[i].faces = {x:0,y:0,z:0};
				mesh.rotation.set(0,0,0);

				var _post = _boxList[i].dom;
				var _x = _offsetX + ( i % _num) * _grid - _size*0.5;
				var _y = _offsetY + ( Math.floor( i / _num ) * _grid );
				_post.css({
					left: _x + 'px',
					top: _y + 'px'
				});
			}


			$('#siteId').css('left', _offsetX - _size * 0.5 + 'px' );

			//	fadeIn
			(function(){
				$('body').removeClass('fadeIn');
				$('body').css('opacity',0);
				clearTimeout( _resizeKey );
				_resizeKey = setTimeout( function(){
					$('body').addClass('fadeIn');
					changeView();
				},400 );
			})();


			// var _height = _y + _grid;
			// renderer.setSize(_width-20, _height);

		}, false );
	}

	function render()
	{
		update()

		camera.lookAt(focus);
		renderer.render( scene, camera);
		window.requestAnimationFrame(render);
	}

	function update()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var len = _boxList.length;
		var _time = Date.now() * 0.0001;
		while( len )
		{
			len --;
			var mesh = _boxList[len].mesh;
			var face = _boxList[len].faces;
			var _x = mesh.rotation.x;
			var _y = mesh.rotation.y;
			var _z = mesh.rotation.z;
			_x += ( face.x - _x ) * 0.16;
			_y += ( face.y - _y ) * 0.16;
			_z += ( face.z - _z ) * 0.16;
			mesh.rotation.set(_x,_y,_z);
		}

		// var _hoge = Math.sin(_time + len * 0.1 ) * Math.PI*100;
		// scroll(_hoge);
	}

	function scroll(e)
	{
		$('#seo').css('top', e + 'px');
		camera.position.y = e;
		focus.y = e;
	}

	function changeView()
	{
		//return;
		var len = _boxList.length;
		var _time = Date.now() * 0.0001;
		while( len )
		{
			len --;
			var data = _boxList[len];
			var isHover = data.isHover;
			if( isHover == false )
			{
				//data.faces = Math.floor( Math.random() * 4 );
				var _no = Math.random()*3;

				var _value = Math.random()<.5?-1:1;

				if( _no < 1 )
				{
					data.faces.x += _value * Math.PI * 0.5;
				} else if( _no < 2 )
				{
					data.faces.y += _value * Math.PI * 0.5;
				} else {
					data.faces.z += _value * Math.PI * 0.5;
				}
			}
			
		}

		clearTimeout( _intervalKey );
		_intervalKey = setTimeout( changeView, 1000 );
	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();