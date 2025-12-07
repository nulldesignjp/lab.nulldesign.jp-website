    var sceneName = 'Opening';
    var resetProp = function(){};
    var colorChange = function(){};
    var weightChange = function(){};
    var customEffects = function(){};

    var __we = 1.0;
    var __op = 1.0;

    var _world,_pl00,_pl01,_pl02,_pl03;

    //	rends
	var _wheelValue = 1200;
	var __wheelValue = 1200;

	//	color
	var _tr = Math.random();
	var _tg = Math.random();
	var _tb = Math.random();
	var __r = _tr;
	var __g = _tg;
	var __b = _tb;

	//	param
	var _speed = 0.26 * 2;
	var _scale = 1.6;
	var _frection = 0.96;
	var _fov;
	var _cameraRad = Math.PI * 0.5;
	var _waveSpeed = 3;
	var _wind = 0;
	var _particleAccell = 0.01;

(function(){
	//	box
	var _size = 900;
	var _hsize = _size * 0.5;

	//	noise
	var simplexNoiseX = new SimplexNoise();
	var simplexNoiseY = new SimplexNoise();
	var simplexNoiseZ = new SimplexNoise();
	var _cube;

	//	setinterval
	var _intervalkey;
	var composer;

	//	positions
	var _vlist = [];
	var _v2list = [];
	var _update = function(){}



	//	ALL
	var _meshTarget;
	var _mode = 0;

	//	LINE
	var lineNums = 1024;
	var lineLenght = 24;
	var _lineList = [];


	//
	var _mlist = [];
	var meteorite_material = new THREE.MeshLambertMaterial({color:0xCCCCCC,shading:THREE.FlatShading,wireframe:true});;
	var _cylinder;
	var _lineMaterial = new THREE.Material();
	var _mouse = {x:0,y:0};
	$( window ).on( 'mousemove', function(e){
		_mouse.x = e.originalEvent.pageX;
		_mouse.y = e.originalEvent.pageY;
	})
	var _dom = document.getElementById('container');
	var _world = new world3d.three( _dom );
	_world.camera.position.set( 0, 0, _wheelValue );
	_fov = _world.camera.fov;
	var _l0 = new THREE.AmbientLight( 0x181818 );
	var _l1 = new THREE.DirectionalLight( 0xCCCCCC, 1.0 );
	_l1.position.set( 1, 1, 1 );
	var _l2 = new THREE.SpotLight( 0xCCCCCC );
	_pl00 = new THREE.PointLight( 0xFFFFFF, 4, 800 );
	_world.scene.add( _pl00 );
	_pl01 = new THREE.PointLight( 0xd81d42, 4, 1600 );
	_world.scene.add( _pl01 );
	_pl02 = new THREE.PointLight( 0x00d8c0, 4, 1600 );
	_world.scene.add( _pl02 );
	_pl03 = new THREE.PointLight( 0x592349, 3, 1600 );
	_world.scene.add( _pl03 );
	var _container = new THREE.Object3D();
	_world.scene.add( _container );
	_cube = new THREE.Object3D();
	_container.add( _cube );
	_createBox();
	var _ball = new THREE.Mesh( new THREE.SphereGeometry(5,8,5),new THREE.MeshBasicMaterial({color:0xCC0000}));
	var _pl001 = new THREE.PointLight( 0xFF0000, 3, 400 );
	_ball.add( _pl001 );

		var renderPass = new THREE.RenderPass( _world.scene, _world.camera );

		composer = new THREE.EffectComposer( _world.renderer );
		composer.addPass( renderPass );

		//	合成時の係数、サイズ、ぼけの強さ、解像度
		composer.addPass(new THREE.BloomPass(4.0, 30.0, 16.0, 256));

		//	http://www56.atwiki.jp/threejs/pages/89.html
		// var effect = new THREE.BokehPass( scene, camera,
		// 	{
		// 		focus: 1.60,
		// 		aperture:.025,
		// 		maxblur:1.0,
		// 		width:window.innerWidth,
		// 		height:window.innerHeight
		// 	});
		// //effect.uniforms[ 'maxblur' ].value = 1.0;
		// //effect.renderToScreen = true;
		// composer.addPass( effect );


		//
		var toScreen = new THREE.ShaderPass( THREE.CopyShader );
		toScreen.renderToScreen = true;
		composer.addPass(toScreen);

	init();
	start();

	//	GUI
	var gui = new dat.GUI();
	//	gui.add( window, 'hoge', 0, 100 ).step( 1 ).name('hoge').listen();
	gui.add( window, 'sceneName',[ 'scene00', 'scene01', 'scene02', 'scene03' ] ).name('SCENE').onFinishChange(function( newValue ){
		
		if( !_isInit )
		{
			_isInit = true;
			_kill_open();
		}

		if( newValue == 'scene00' )
		{
			if( _mode == 0 )	return;
			if( _mode == 1 )	_kill_particle();
			if( _mode == 2 )	_kill_particle_A();
			if( _mode == 4 )	_kill_particle_B();

			_mode = 0;
			_init_line();
			_update = _update_line;
		} else if( newValue == 'scene01' )
		{
			if( _mode == 1 )	return;
			if( _mode == 0 )	_kill_line();
			if( _mode == 2 )	_kill_particle_A();
			if( _mode == 4 )	_kill_particle_B();

			_mode = 1;
			_init_particle();
			_update = _update_particle;
		} else if( newValue == 'scene02' )
		{
			if( _mode == 2 )	return;
			if( _mode == 0 )	_kill_line();
			if( _mode == 1 )	_kill_particle();
			if( _mode == 4 )	_kill_particle_B();

			_mode = 2;
			_init_particle_A();
			_update = _update_particle_A;
		} else if( newValue == 'scene03' )
		{

			if( _mode == 4 )	return;
			if( _mode == 0 )	_kill_line();
			if( _mode == 1 )	_kill_particle();
			if( _mode == 2 )	_kill_particle_A();

			_mode = 4;
			_init_particle_B();
			_update = _update_particle_B;
		}
	});

	var f3 = gui.addFolder( 'Camera' );
	f3.add( window, '__wheelValue', 100, 1600 ).step(1).name('Zoom').listen();
	f3.add( window, '_fov', 5, 120 ).step(1).name('Parspective').listen();
	f3.add( window, '_cameraRad', 0.00, 6.28 ).step(0.01).name('Horizon').listen();
	f3.open();

	var f2 = gui.addFolder( 'Weight' );
	f2.add( window, '__we', 0.0, 10.0 ).step(0.1).name('Weight').listen().onChange(function(newValue){

		if( _mode == 0 )
		{
			_lineMaterial.linewidth = newValue;
		}

		if( _mode == 2 )
		{
			world3d.uniforms.scale.value = newValue/10 * 2 + 1;
		}

		if( _mode == 3 )
		{
			_meshTarget.material.uniforms.scale.value = newValue/10 * 3 + 1.0;
		}

		if( _mode == 1 || _mode == 2 || _mode == 4 )
		{
			world3d.uniforms.size.value = newValue;
		}
	});
	f2.add( window, '__op', 0.0, 1.0 ).step(0.01).name('Opacity').listen().onChange(function(newValue){
		_lineMaterial.opacity = newValue;
	});
	f2.open();

	var f1 = gui.addFolder( 'Color' );
	f1.add( window, '_tr', 0.0, 1.0 ).step(0.01).name('Red').listen();
	f1.add( window, '_tg', 0.0, 1.0 ).step(0.01).name('Green').listen();
	f1.add( window, '_tb', 0.0, 1.0 ).step(0.01).name('Blue').listen();
	f1.open();

	gui.add( window, 'colorChange' ).name('Color Change').onFinishChange(function(newValue){
		
		_tr = Math.random() * 0.05;
		_tg = Math.random() * 0.05;
		_tb = Math.random() * 0.05;

		var _v = Math.random();
		if( _v < 0.33 )
		{
			_tr = Math.random()*.1+.9;
		} else if( _v > 0.66 )
		{
			_tg = Math.random()*.1+.9;
		} else {
			_tb = Math.random()*.1+.9;
		}
	});

	gui.add( window, 'customEffects' ).name('Effect').onFinishChange(function(newValue){
			if( _mode == 0 )
			{
				var len = _vlist.length;
				while( len )
				{
					len--;
					var _v = _vlist[len]
					var _rad0 = Math.random() * Math.PI * 2.0;
					var _rad1 = Math.random() * Math.PI * 2.0;
					var _pow = ( 1 - Math.random() * Math.random() ) * 12.0;

					var _r = Math.cos( _rad0 ) * _pow;

					_v.y += Math.sin( _rad0 ) * _pow;
					_v.x += Math.cos( _rad1 ) * _r;
					_v.z += Math.sin( _rad1 ) * _r;
				}
			} else if( _mode == 1 || _mode == 2 )
			{
				var len = _vlist.length;
				for( var i = 0; i < len; i++ )
				{
					var _v = _vlist.shift();
					_v.x = rnd() * 5.0;
					_v.y = rnd() * 5.0;
					_v.z = rnd() * 5.0;

					var _vv = _lineList.shift();
					var _rad0 = Math.random() * Math.PI * 2.0;
					var _rad1 = Math.random() * Math.PI * 2.0;
					//var _pow = ( 1 - Math.random() * Math.random() ) * 32.0;

					var _pow = ( Math.random()*.2+.8)*16;

					_vv.vy = Math.sin( _rad0 ) * _pow;
					var _r = Math.cos( _rad0 ) * _pow;
					_vv.vx = Math.cos( _rad1 ) * _r;
					_vv.vz = Math.sin( _rad1 ) * _r;

					_vlist.push( _v );
					_lineList.push( _vv )
				}

				_tr = Math.random() * 1.0 + 0.0;
				_tg = Math.random() * 1.0 + 0.0;
				_tb = Math.random() * 1.0 + 0.0;

				__r = Math.random();
				__g = Math.random();
				__b = Math.random();

				world3d.uniforms.scale.value = 0.5;
				var _img = 'spark1.png';
				var _r = Math.random();
				if( _r < 0.5 )
				{
					_img = 'spark2.png';
					world3d.uniforms.scale.value = 1;
				}
				world3d.uniforms.texture.value = THREE.ImageUtils.loadTexture( _img );

			} else if( _mode == 4 )
			{
				_tr = Math.random() * 0.05;
				_tg = Math.random() * 0.05;
				_tb = Math.random() * 0.05;

				var _v = Math.random();
				if( _v < 0.33 )
				{
					_tr = Math.random()*.1+.9;
					_tb = Math.random()*.1+.9;
				} else if( _v > 0.66 )
				{
					_tb = Math.random()*.1+.9;
					_tg = Math.random()*.1+.9;
				} else {
					_tr = Math.random()*.1+.9;
					_tb = Math.random()*.1+.9;
				}

				_meshTarget.material.size = Math.random()*3+5;
				_waveSpeed = Math.random() * 7 + 3;
			}
	});

	gui.add( window, 'resetProp' ).name('RESET').onFinishChange(function(newValue){
		__wheelValue =1200;
		_cameraRad = Math.PI * 0.5;
		_world.camera.x = 0;
		_world.camera.y = 0;
		_fov = 35;

		_pl01.color = new THREE.Color( 0xd81d42 );
		_pl02.color = new THREE.Color( 0x00d8c0 );
		_pl03.color = new THREE.Color( 0x592349 );
	});


	


	//	
	//_init_open();
	//_update = _update_open;


			_mode = 0;
			_init_line();
			_update = _update_line;


	//	FUNCTION
	function init()
	{
		//	GEN PARTICLE
		for( var i = 0; i < 1024 * 32; i++ )
		{
			_vlist[i] = new THREE.Vector3( rnd(),rnd(),rnd() );
			_v2list[i] = new THREE.Vector3( rnd() * 3480,rnd()*1024,0 );
		}
	}

	function start()
	{
		//	RGBやnoiseを変更する共通パート
		setInterval(function(){
			_tr = Math.random();
			_tg = Math.random();
			_tb = Math.random();
		},1000 * 4);
		setInterval(function(){
			if( _mode != 4 )
			{
				simplexNoiseX = new SimplexNoise();
				simplexNoiseY = new SimplexNoise();
				simplexNoiseZ = new SimplexNoise();
			}
		},1000 * 8);

		//_intervalkey = setInterval( _loop, 1000/60 );

		_loop();
	}

	function _loop()
	{
		//	COLOR
		__r += ( _tr - __r ) * 0.01;
		__g += ( _tg - __g ) * 0.01;
		__b += ( _tb - __b ) * 0.01;

		_lineMaterial.color = new THREE.Color( __r,__g,__b );
		_wheelValue += ( __wheelValue - _wheelValue ) * 0.05;

		var _tx = Math.cos( _cameraRad ) * _wheelValue;
		var _tz = Math.sin( _cameraRad ) * _wheelValue;
		_world.camera.position.x += ( _tx - _world.camera.position.x ) * 0.02;
		_world.camera.position.z += ( _tz - _world.camera.position.z ) * 0.02;

		_world.camera.fov += ( _fov - _world.camera.fov ) * 0.1;
		_world.camera.updateProjectionMatrix();

		_update();

		window.requestAnimationFrame( _loop );
	}

	function _createBox()
	{
		var _material = new THREE.LineBasicMaterial({linewidth:1,color: 0xFFFFFF,transparent:true,opacity: 0.4});
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,_hsize,_hsize );
		_geometry.vertices[2] = new THREE.Vector3( -_hsize,_hsize,-_hsize );
		_geometry.vertices[3] = new THREE.Vector3( _hsize,_hsize,-_hsize );
		_geometry.vertices[4] = new THREE.Vector3( _hsize,_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,_hsize );
		_geometry.vertices[2] = new THREE.Vector3( -_hsize,-_hsize,-_hsize );
		_geometry.vertices[3] = new THREE.Vector3( _hsize,-_hsize,-_hsize );
		_geometry.vertices[4] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( _hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( -_hsize,_hsize,_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( -_hsize,_hsize,-_hsize );
		_geometry.vertices[1] = new THREE.Vector3( -_hsize,-_hsize,-_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
		
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3( _hsize,_hsize,-_hsize );
		_geometry.vertices[1] = new THREE.Vector3( _hsize,-_hsize,-_hsize );
		var _mesh = new THREE.Line( _geometry, _material );
		_cube.add( _mesh );
	}

	function rnd()
	{
		return Math.random() - .5;
	}

	function _init_line()
	{
		//
		_cube.visible = true;
		_speed = 0.26 * 2;
		_scale = 1.6;
		_frection = 0.96;

		var _material = new THREE.LineBasicMaterial({
			linewidth:1,
			color:new THREE.Color(__r,__g,__b),
			transparent:true,
			opacity:0.6,
			blending:       THREE.AdditiveBlending,
			depthTest:      false
		});
		_lineMaterial = _material;

		var _pointer = 0;
		for( var i = 0; i < lineNums; i++ )
		{
			var _geometry = new THREE.Geometry();
			_geometry.verticesNeedUpdate = true;
			_geometry.dynamic = true;

			for( var j = 0; j < lineLenght; j++ )
			{
				_geometry.vertices[j] = _vlist[_pointer];
				_pointer++;
			}

			var _mesh = new THREE.Line( _geometry, _material );
			_container.add( _mesh );

			var _vx = rnd() * 10.0;
			var _vy = rnd() * 10.0;
			var _vz = rnd() * 10.0;

			_lineList.push({
				mesh:_mesh,
				geometry:_geometry,
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}
	}
	function _update_line()
	{
		//	_container
		_container.rotation.x = world3d.time * 0.0036;
		_container.rotation.y = world3d.time * 0.0024;

		//	CAMERA
		_world.camera.lookAt( _world.focus );

		//	LINE
		var len = _lineList.length;
		while( len )
		{
			len--;
			var _obj = _lineList[len];
			var _vertices = _obj.geometry.vertices;
			var _px = _vertices[0].x;
			var _py = _vertices[0].y;
			var _pz = _vertices[0].z;

			var len0 = _vertices.length;
			for( var i = 0; i < len0; i++ )
			{
				var __px = _vertices[i].x;
				var __py = _vertices[i].y;
				var __pz = _vertices[i].z;

				_vertices[i].x = _px;
				_vertices[i].y = _py;
				_vertices[i].z = _pz;

				_px = __px;
				_py = __py;
				_pz = __pz;
			}
			_vertices[0].x += _obj.vx;
			_vertices[0].y += _obj.vy;
			_vertices[0].z += _obj.vz;

			_obj.vx += simplexNoiseX.noise( ( _vertices[0].z + _hsize ) / _size * _scale, ( _vertices[0].y + _hsize ) / _size * _scale ) * _speed;
			_obj.vy += simplexNoiseY.noise( ( _vertices[0].x + _hsize ) / _size * _scale, ( _vertices[0].z + _hsize ) / _size * _scale ) * _speed;
			_obj.vz += simplexNoiseZ.noise( ( _vertices[0].y + _hsize ) / _size * _scale, ( _vertices[0].x + _hsize ) / _size * _scale ) * _speed;

			//	air frection
			_obj.vx *= _frection;
			_obj.vy *= _frection;
			_obj.vz *= _frection;

			//	pseudo grav
			_vertices[0].x += ( 0 - _vertices[0].x ) * _particleAccell;
			_vertices[0].y += ( 0 - _vertices[0].y ) * _particleAccell;
			_vertices[0].z += ( 0 - _vertices[0].z ) * _particleAccell;

			//
			if( _vertices[0].x < -_hsize )
			{
				_vertices[0].x = -_hsize;
				_obj.vx *= - ( Math.random() * .2 + .9 );

			} else if( _vertices[0].x > _hsize )
			{
				_vertices[0].x = _hsize;
				_obj.vx *= - ( Math.random() * .2 + .9 );
			}
			if( _vertices[0].y < -_hsize )
			{
				_vertices[0].y = -_hsize;
				_obj.vy *= - ( Math.random() * .2 + .9 );
			} else if( _vertices[0].y > _hsize )
			{
				_vertices[0].y = _hsize;
				_obj.vy *= - ( Math.random() * .2 + .9 );
			}
			if( _vertices[0].z < -_hsize )
			{
				_vertices[0].z = -_hsize;
				_obj.vz *= - ( Math.random() * .2 + .9 );
			} else if( _vertices[0].z > _hsize )
			{
				_vertices[0].z = _hsize;
				_obj.vz *= - ( Math.random() * .2 + .9 );
			}
			_obj.geometry.verticesNeedUpdate = true;
		}
	}
	function _kill_line()
	{
		var len = _lineList.length;
		while( len )
		{
			len--;
			var _obj = _lineList.pop();

			_container.remove( _obj.mesh );
			_obj.mesh = null;

			_obj.geometry.dispose();
			_obj.geometry = null;

			_obj = null;
		}
		_lineList = [];
	}

	function _init_particle()
	{
		_cube.visible = true;
		_speed = 0.26 * 2;
		_scale = 1.6;
		_frection = 0.96;

		var _material = new THREE.PointCloudMaterial({
			size: 8,
			color: new THREE.Color(__r,__g,__b),
			transparent:true,
			opacity:0.9,
			blending:       THREE.AdditiveBlending
		});

		_lineMaterial = _material;

		_lineList = [];

		var _geometry = new THREE.Geometry();
		var len = _vlist.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i] = _vlist[i]
			var _vx = rnd() * 10.0;
			var _vy = rnd() * 10.0;
			var _vz = rnd() * 10.0;

			_lineList.push({
				vertices:_geometry.vertices[i],
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}
		_meshTarget = new THREE.PointCloud( _geometry, _material );
		_container.add( _meshTarget );
	}
	function _update_particle()
	{
		//	_container
		_container.rotation.x = world3d.time * 0.0036;
		_container.rotation.y = world3d.time * 0.0024;

		//	CAMERA
		var _x = world3d.mouse.x / world3d.resolution.x - 0.5;
		var _y = world3d.mouse.y / world3d.resolution.y - 0.5;
		_world.camera.lookAt( _world.focus );

		//	LINE
		var _time = Date.now() * 0.02;
		var len = _lineList.length;
		while( len )
		{
			len--;
			var _obj = _lineList[len];
			var _vertices = _obj.vertices;
			var _px = _vertices.x;
			var _py = _vertices.y;
			var _pz = _vertices.z;

			_vertices.x += _obj.vx;
			_vertices.y += _obj.vy;
			_vertices.z += _obj.vz;

			_obj.vx += simplexNoiseX.noise( ( _vertices.z + _hsize + _time ) / _size * _scale, ( _vertices.y + _hsize + _time ) / _size * _scale ) * _speed;
			_obj.vy += simplexNoiseY.noise( ( _vertices.x + _hsize + _time ) / _size * _scale, ( _vertices.z + _hsize + _time ) / _size * _scale ) * _speed;
			_obj.vz += simplexNoiseZ.noise( ( _vertices.y + _hsize + _time ) / _size * _scale, ( _vertices.x + _hsize + _time ) / _size * _scale ) * _speed;

			_obj.vx += (Math.random()-.5)*.06;
			_obj.vy += (Math.random()-.5)*.06;
			_obj.vz += (Math.random()-.5)*.06;

			//	air frection
			_obj.vx *= _frection;
			_obj.vy *= _frection;
			_obj.vz *= _frection;

			//	pseudo grav
			_vertices.x += ( 0 - _vertices.x ) * _particleAccell;
			_vertices.y += ( 0 - _vertices.y ) * _particleAccell;
			_vertices.z += ( 0 - _vertices.z ) * _particleAccell;

			//
			if( _vertices.x < -_hsize )
			{
				//_vertices.x = -_hsize;
				_obj.vx *= - ( Math.random() * .2 + .9 );
				_vertices.x += _hsize * 2;

			} else if( _vertices.x > _hsize )
			{
				//_vertices.x = _hsize;
				_obj.vx *= - ( Math.random() * .2 + .9 );
				_vertices.x -= _hsize * 2;
			}
			if( _vertices.y < -_hsize )
			{
				//_vertices.y = -_hsize;
				_obj.vy *= - ( Math.random() * .2 + .9 );
				_vertices.y += _hsize * 2;
			} else if( _vertices.y > _hsize )
			{
				//_vertices.y = _hsize;
				_obj.vy *= - ( Math.random() * .2 + .9 );
				_vertices.y -= _hsize * 2;
			}
			if( _vertices.z < -_hsize )
			{
				//_vertices.z = -_hsize;
				_obj.vz *= - ( Math.random() * .2 + .9 );
				_vertices.z += _hsize * 2;
			} else if( _vertices.z > _hsize )
			{
				//_vertices.z = _hsize;
				_obj.vz *= - ( Math.random() * .2 + .9 );
				_vertices.z -= _hsize * 2;
			}
		}

		_meshTarget.geometry.verticesNeedUpdate = true;
	}

	function _kill_particle()
	{
		_container.remove( _meshTarget );
		_meshTarget.geometry.dispose();
		_meshTarget.geometry = null;
		_meshTarget = null;

		var len = _lineList.length;
		while( len )
		{
			len--;
			var _obj = _lineList.pop();
			_obj = null;
		}
		_lineList = [];
	}

	function _init_particle_A()
	{
		_cube.visible = true;
		_speed = 0.26 * 2;
		_scale = 1.6;
		_frection = 0.96;

		// var _material = new THREE.PointCloudMaterial({
		// 	size: 100,
		// 	color: new THREE.Color(__r,__g,__b),
		// 	transparent:true,
		// 	opacity:0.6,
		// 	blending:THREE.AdditiveBlending,
		// 	map: new THREE.ImageUtils.loadTexture( "spark1.png" )
		// });
		world3d.uniforms.color = { type: "c", value: new THREE.Color(__r,__g,__b) };
		world3d.uniforms.texture = { type: "t", value: THREE.ImageUtils.loadTexture( "spark1.png" ) };
		world3d.uniforms.scale = { type: "f", value: 1.0 }
		world3d.uniforms.size = { type: "f", value: 10.0 }

		var _shaderMaterial = new THREE.ShaderMaterial( {
			uniforms:       world3d.uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			blending:       THREE.AdditiveBlending,
			depthTest:      false,
			transparent:    true
		});

		_lineMaterial = _shaderMaterial;

		var _geometry = new THREE.Geometry();
		var len = _vlist.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i] = _vlist[i];
			var _vx = rnd() * 10.0;
			var _vy = rnd() * 10.0;
			var _vz = rnd() * 10.0;

			_lineList.push({
				vertices:_geometry.vertices[i],
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}

		_meshTarget = new THREE.PointCloud( _geometry, _shaderMaterial );
		_container.add( _meshTarget )
	}
	function _update_particle_A()
	{
		_update_particle();

		world3d.uniforms.color.value = new THREE.Color(__r,__g,__b);
	}
	function _kill_particle_A()
	{
		_kill_particle();
	}

	function _init_particle_B()
	{
		var len = _vlist.length;

		_cube.visible = false;
		_speed = 0.26 * 2;
		_scale = 1.6;
		_frection = 0.96;

		var _material = new THREE.PointCloudMaterial({
			size: 10,
			color: new THREE.Color(__r,__g,__b),
			transparent:true,
			opacity:0.6,
			blending:       THREE.AdditiveBlending,
			//map: THREE.ImageUtils.loadTexture( "spark.png" )
		});

		_lineMaterial = _material;

		_lineList = [];

		var _geometry = new THREE.Geometry();
		var len = _vlist.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i] = _vlist[i]
			var _vx = rnd() * 10.0;
			var _vy = rnd() * 10.0;
			var _vz = rnd() * 10.0;

			var _rad = Math.PI * Math.random() * 2;
			var _pow = ( 1 - Math.random() * Math.random() ) * 1200;
			 _vlist[i].x = Math.cos( _rad ) * _pow;
			 _vlist[i].y = i%2 * 100 - 50;
			 _vlist[i].z = Math.sin( _rad ) * _pow;

			 _vlist[i].x = Math.random() * 2400-1200;
			 _vlist[i].z = Math.random() * 2400-1200;

			_lineList.push({
				vertices:_geometry.vertices[i],
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}
		_meshTarget = new THREE.PointCloud( _geometry, _material );
		_container.add( _meshTarget );



		//	_container
		_container.rotation.x = 0;
		_container.rotation.y = 0;

		//	CAMERA
		_world.camera.position.set( 0, 0, _wheelValue );
	}
	function _update_particle_B()
	{

		_meshTarget.rotation.z = world3d.time * 0.0012;
		_cube.rotation.z = world3d.time * 0.0012;

		//_update_particle();
		var _time = Date.now() * 0.02;
		var _waveScale = 0.0025;
		var len = _lineList.length;
		while( len )
		{
			len--;
			var _obj = _lineList[len];
			var _vertices = _obj.vertices;

			_vertices.z += _waveSpeed;
			if( _vertices.z > 1200 ) _vertices.z = -1200;

			_vertices.y = simplexNoiseX.noise( ( _vertices.x+1200) * _waveScale, (_vertices.z+1200) * _waveScale + _time * 0.0001 + ( len%2 )*10 ) * 25 + ( len%2 ) * 100 - 50;
		}

		_meshTarget.geometry.verticesNeedUpdate = true;
	}
	function _kill_particle_B()
	{
		_meshTarget.rotation.z = 
		_cube.rotation.z = 0;
		_kill_particle();
	}

	var _clist = [];
	var _meteoKey;
	function _init_cube()
	{
		_cube.visible = false;
		_cylinder.material.wireframe = false;
		_ball.material.wireframe = false;

		_container.rotation.x %= Math.PI;
		_container.rotation.y %= Math.PI;
		_container.rotation.z %= Math.PI;

		_world.scene.add( _ball );
		_world.scene.add( _cylinder );

		_meteoKey = setInterval( _createMeteo, 1000 / 12 );
	}


	var _openField;
	var _openPlane;
	var _openPlaneL;
	var _openPlaneR;
	var _openmaterial01;
	var _openmaterial02;
	var _isInit = false;
	var _openLight;

	var _openRed;
	var _openGreen;
	var _openBlue;
	var _openYellow;
	function _init_open()
	{
		_cube.visible = false;
		_openmaterial01 = THREE.ImageUtils.loadTexture( "logo_dede.png" );
		_openmaterial02 = THREE.ImageUtils.loadTexture( "logo_hackist.png" );

		var _geometry = new THREE.PlaneGeometry( 512, 512, 1, 1 );
		var _material = new THREE.MeshLambertMaterial({
			map: _openmaterial01,
			transparent: true,
			side: THREE.DoubleSide,
			color: 0xFFFFFF
		});

		_openPlane = new THREE.Mesh( _geometry, _material );
		_world.scene.add( _openPlane );

		_openLight = new THREE.PointLight( 0xFFFFFF, 2, 1024 );
		_openLight.position.set( -128, 128, 512 );
		//_world.scene.add( _openLight );


		var _geometry = new THREE.PlaneGeometry( 512, 512, 1, 1 );
		var _material = new THREE.MeshLambertMaterial({
			map: _openmaterial01,
			transparent: true,
			side: THREE.DoubleSide,
			color: 0xFFFFFF
		});
		_openPlaneL = new THREE.Mesh( _geometry, _material );
		_openPlaneR = new THREE.Mesh( _geometry, _material );


		_openPlaneL.material.map = _openmaterial02;
		_openPlaneR.material.map = _openmaterial02;
		_world.scene.add( _openPlaneL );
		_world.scene.add( _openPlaneR );

		var _adj = - Math.PI * 0.36;
		var _dist = 1350;

		_openPlaneL.rotation.y = Math.PI * 0.5 + _adj;
		_openPlaneL.position.x = - _dist;

		_openPlaneR.rotation.y = - Math.PI * 0.5 - _adj;
		_openPlaneR.position.x = _dist;

		_fov = 45;

		_mode = 999;


		_openRed	= new THREE.PointLight(0xCC0000,3,1600);
		_openGreen	= new THREE.PointLight(0x00CC00,3,1600);
		_openBlue	= new THREE.PointLight(0x0000CC,3,1600);
		_openYellow	= new THREE.PointLight(0xFFF000,3,1600);

		_world.scene.add( _openRed );
		_world.scene.add( _openGreen );
		_world.scene.add( _openBlue );
		_world.scene.add( _openYellow );

		var geometry = new THREE.PlaneGeometry( 5120, 1280, 52, 13 );
		var material = new THREE.MeshLambertMaterial({wireframe:true,color:0x090909,wireframeLinewidth:1,transparent:true});
		_openField = new THREE.Mesh( geometry, material );
		_world.scene.add( _openField );
		_openField.position.set( 0, 0, -100 );

		var len = geometry.vertices.length;
        for (var i = 0; i < len; i++) {
            geometry.vertices[i].x -= geometry.vertices[i].y * 0.5;
            geometry.vertices[i].y *= 2 / Math.sqrt(5);
        }
	}
	function _update_open()
	{
		var _time = Date.now() * 0.0001;
		_openRed.position.set( Math.cos( _time ) * 1280, Math.cos( _time * 1.5 ) * 640, 128 );
		_openGreen.position.set( Math.cos( _time * 1.1 ) * 1280, -Math.cos( _time * 2.5 ) * 640, 128 );
		_openBlue.position.set( -Math.cos( _time * 1.2 ) * 1280, Math.cos( _time * 3.5 ) * 640, 128 );
		_openYellow.position.set( -Math.cos( _time * 0.9 ) * 1280, -Math.cos( _time * 4.5 ) * 640, 128 );
	}
	function _kill_open()
	{
		_world.scene.add( _l0 );
		_world.scene.remove( _openLight );


		var _count = 0;
		var _intervalKeyOpen = setInterval(function(){

			_openField.material.opacity = 1 - _count / 60;
			_openPlane.material.opacity = 1 - _count / 60;
			_openPlaneL.material.opacity = 1 - _count / 60;
			_openPlaneR.material.opacity = 1 - _count / 60;

			if( _count == 60 )
			{
				_world.scene.remove( _openRed );
				_world.scene.remove( _openGreen );
				_world.scene.remove( _openGreen );
				_world.scene.remove( _openGreen );

				_world.scene.remove( _openField );
				_openField.geometry.dispose();

				_world.scene.remove( _openPlane );
				_world.scene.remove( _openPlaneL );
				_world.scene.remove( _openPlaneR );
				_openPlane.geometry.dispose();
				_openPlaneL.geometry.dispose();
				_openPlaneR.geometry.dispose();
				clearInterval( _intervalKeyOpen );
			}

			_count ++;



		},1000/60);

	}

})();