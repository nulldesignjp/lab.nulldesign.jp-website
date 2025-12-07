/*
	engine.js
*/

(function(){

	//	is mobile?
	var _ua = navigator.userAgent.toLowerCase();
	_ua = _ua.replace(/ /g, "");

	if( _ua.indexOf( 'android' ) != -1 || _ua.indexOf( 'iphone' ) != -1 )
	{
		$( 'body' ).addClass('sp');
		return;
	}

	//	is webgl?
	if ( ! Detector.webgl )
	{
		//	alert('no webgl.');
		return;
	}

	//	
	var domData = {};
	var boxList = [];
	var _helpers = [];
	var _datalist = {};
	var scene,camera,focus,renderer;
	var time = 0;
	var _grid = 200;
	var _half = 0;
	var _sceneScale = 1.0;
	var _offset = 0;
	var _intervalKey;
	var mouse = {x:0,y:0};
	var resolution = {x:window.innerWidth,y:window.innerHeight};
	var shuffle = function() {return Math.random()-.5};
	var _is3D = true;
	var _resizeKey;

	//
	init();
	addEvents();
	render();

	loadHTML('index.html');


	function loadHTML( e )
	{
		$.ajax({
			url: e,
			type: 'GET',
			dataTyle: 'HTML',
			success: loadHTMLComplete,
			error: loadHTMLError
		});
	}

	function loadHTMLComplete(data)
	{
		domData = [];
		$( data ).find('.post').each(function(){
			var _list = [];
			var _title = $( this ).find('h1').text();
			var _date = $( this ).find('time').text();
			var _images = $( this ).find('img').each(function(){
				_list.push( $( this ).attr('src') );
			});
			var _url = $( this ).find('a').attr('href');

			var _obj = {
				name: _title,
				date: _date,
				url: _url,
				images: _list
			}
			domData.push(_obj);
		});

		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var _hd = Math.sqrt(_width*_width+_height*_height)/2;
		_offset = _hd - 600;
		_offset = _offset / 1.4142;

		_half = 0;
		while( _half < 20 )
		{
			_half += domData.length;
		}
		_half = Math.floor( _half / 2 );

		for( var j = 0; j < 8; j++ )
		{
			boxList[j] = [];
			while( boxList[j].length < 20 )
			{
				domData.sort(shuffle);
				for( var i = 0; i < domData.length; i++ )
				{
					var _geometry = new THREE.BoxGeometry(100,100,100,1,1,1);
					var _material = new THREE.MeshBasicMaterial({
						wireframe:true,
						color: 0xCCCCCC
					});

					var _mesh = new THREE.Mesh( _geometry, _material );
					scene.add( _mesh );

					_mesh.position.set( ( boxList[j].length - _half ) * _grid, 0, j * _grid );
					_datalist[ _mesh.uuid ] = domData[i];
					boxList[j].push( _mesh );

 					var _name = domData[i].name;
 					var _url = domData[i].url;
 					var _images = domData[i].images;
					var _helper = new contentsBoxHelper( _mesh, _name, _url, _images, _nextStep );
					_helpers.push( _helper );
				}
			}
		}
		_helpers.sort(shuffle);
		_helpers.sort(shuffle);

		setTimeout( _nextStep, 100 );

	}
	function loadHTMLError(data)
	{
		console.error( data );
	}

	function _nextStep()
	{
		if( _helpers.length )
		{
			var _helper = _helpers.pop();
			_helper.init();
		} else {
			start();
			$('#changeView').addClass('show');
			$('#changeView').addClass('fadeIn');
			$('#changeView').on('click', _changeView );

			$('#changeScale').addClass('show');
			$('#changeScale').addClass('fadeIn');
			$('#changeScale').on('click', _changeScale );
		}
	}

	function init()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0xFFFFFF, 1600, 3200 );

		//camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
		//camera.position.set( -1000, 1000, 1000 );
		camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 3200 );
		camera.position.set(-1000, 1000 * Math.sqrt(2), 1000);

		focus = new THREE.Vector3(0,0,0);
		camera.lookAt( focus );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor( 0xFFFFFF, 1 );
		renderer.setSize(_width, _height);
		renderer.autoClear = true;

		document.getElementById('three').appendChild(renderer.domElement);
	}

	function render()
	{
		window.requestAnimationFrame( render );

		if( !_is3D ) return;

		var len0 = boxList.length;
		for( var i = 0; i < len0; i++ )
		{
			var len1 = boxList[i].length;
			for( var j = 0; j < len1; j++ )
			{
				var _x = ( j - _half ) * _grid;
				var _z = ( i - 0 ) * _grid;
				boxList[i][j].position.x += ( _x - boxList[i][j].position.x ) * 0.2;
				boxList[i][j].position.z += ( _z - _offset - boxList[i][j].position.z ) * 0.2;
			}
		}

		camera.lookAt(focus);
		renderer.render( scene, camera );
	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(e)
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			resolution.x = _width;
			resolution.y = _height;

			var _hd = Math.sqrt(_width*_width+_height*_height)/2;
			_offset = _hd - 600;
			_offset = _offset / 1.4142;
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

			$('body').css({
				'display':'none',
				'opacity': '0'
			});
			clearTimeout( _resizeKey );
			_resizeKey = setTimeout( function(){
				$('body').css({
					'display':'block',
					'opacity': '1'
				});
				$('body').addClass('fadeIn');
			}, 400 );


		}, false );
		window.addEventListener( 'mousemove', function(e)
		{
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			onDocumentMouseEvent( e );

		}, false );
		window.addEventListener( 'mousedown', function(e)
		{
			mouse.x = e.pageX;
			mouse.y = e.pageY;
			onDocumentMouseEvent( e );

		}, false );

		window.addEventListener( 'mousewheel', function(e)
		{
			if( _is3D )
			{
				stop();
				setTimeout( 400, start );
				countUp();
				e.preventDefault();
			}
		}, false );


	}

	function countUp()
	{
		var len = boxList.length;

		if( Math.random() < 0.4 )
		{
			//	Yoko
			var len0 = boxList[0].length;
			var _no = Math.floor( Math.random() * len0 );

			if( Math.random() < .5 )
			{
				var _mesh = boxList[0].splice( _no, 1 );

				for( var i = 0; i < len-1; i++ )
				{
					var _mesh0 = boxList[i+1].splice( _no, 1 );
					boxList[i].splice( _no, 0, _mesh0[0] );
				}
				_mesh[0].position.z = 3000;
				boxList[len-1].splice( _no, 0, _mesh[0] );
			} else {
				for( var i = 0; i < len - 1; i++ )
				{
					var _mesh0 = boxList[i].splice( _no, 1 );
					boxList[i+1].splice( _no+1, 0, _mesh0[0] );
				}
				var _mesh = boxList[len-1].splice( _no+1, 1 );
				_mesh[0].position.z = -3000;
				boxList[0].splice( _no, 0, _mesh[0] );
			}

		} else {
			//	Tate
			var _no = Math.floor( Math.random() * len );
			if( Math.random() < .5 )
			{
				var _mesh = boxList[_no].shift();
				_mesh.position.x = 3000;
				boxList[_no].push( _mesh );
			} else {
				var _mesh = boxList[_no].pop();
				_mesh.position.x = -3000;
				boxList[_no].unshift( _mesh );
			}
		}
	}

	//http://qiita.com/edo_m18/items/5aff5c5e4f421ddd97dc
	function onDocumentMouseEvent( e )
	{
		if( !_is3D )
		{
			return;
		}

		var vector = new THREE.Vector3();
		var raycaster = new THREE.Raycaster();
		var dir = new THREE.Vector3();

		vector.set( (mouse.x/resolution.x)  * 2 - 1, -(mouse.y/resolution.y) * 2 + 1, - 1 );
		vector.unproject( camera );
		dir.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );
		raycaster.set( vector, dir );

		//var intersects = raycaster.intersectObjects( objects );
		var objs = raycaster.intersectObjects( scene.children );

		if ( objs.length > 0 ) {

			var _mesh = objs[0].object;
			var _uuid = _mesh.uuid;
			var _data = _datalist[ _uuid ];

			$('#entryTitle').text(_data.name);

			switch( e.type )
			{
				case 'mousemove' :
					break;
				case 'mousedown' :
					window.open(_data.url,'_blank');
					break; 
			}
		}

	}

	function start()
	{
		stop();
		_intervalKey = setInterval( countUp, 1000 );
	}
	function stop()
	{
		clearInterval( _intervalKey );
	}

	function _changeView()
	{
		$('body').removeClass();
		_is3D = !_is3D;
		if( !_is3D )
		{

			$('canvas').removeClass('fadeIn');
			$('canvas').addClass('fadeIn');

			$('body').addClass('three');
			start();
		}

		if( $('body').hasClass('three') )
		{
			$('#container').removeClass('fillIn');
			$('#container').addClass('fillIn');
		}
	}

	function _changeScale()
	{
		if( !$('body').hasClass('three') )
		{
			$('#changeScale').removeClass('max');
			$('#changeScale').removeClass('min');
			if( _sceneScale == 1 )
			{
				_sceneScale = 0.5;
				$('#changeScale').addClass('min');
			} else {
				_sceneScale = 1;
			}
			TweenMax.to( scene.scale , 0.2 , {x:_sceneScale,y:_sceneScale,z:_sceneScale});
		}
	}

})();
