
    var _scale = screen.width / ( 1280 * 3 );
    var _top = Math.floor( ( screen.height - 1024 * _scale ) * 0.5 );
    window.moveTo( 0, _top );
    window.resizeTo( 1280 * 3  * _scale, 1024 * _scale );

(function(){
	//	box
	var _size = 900;
	var _hsize = _size * 0.5;

	//	noise
	var simplexNoiseX = new SimplexNoise();
	var simplexNoiseY = new SimplexNoise();
	var simplexNoiseZ = new SimplexNoise();
	var _cube;
	var _wheelValue = 1200;
	var __wheelValue = 1200;

	//	setinterval
	var _intervalkey;

	//	color
	var _tr = Math.random();
	var _tg = Math.random();
	var _tb = Math.random();
	var __r = _tr;
	var __g = _tg;
	var __b = _tb;

	//	positions
	var _vlist = [];
	var _v2list = [];
	var _update = function(){}

	//	param
	var _speed = 0.26 * 2;
	var _scale = 1.6;
	var _frection = 0.96;


	//	ALL
	var _meshTarget;
	var _mode = 0;

	//	LINE
	var lineNums = 1024;
	var lineLenght = 24;
	var _lineList = [];

	//	PARTICLE - A
	var _particleAccell = 0.01;

	//
	var _waveSpeed = 3;
	var _fov;
	var _cameraRad = Math.PI * 0.5;

	var _wind = 0;

	var _mlist = [];
	var meteorite_material = new THREE.MeshLambertMaterial({color:0xCCCCCC,shading:THREE.FlatShading,wireframe:true});;
	var _cylinder;

	var _lineMaterial = new THREE.Material();

	var _mouse = {x:0,y:0};
	$( window ).on( 'mousemove', function(e){
		_mouse.x = e.originalEvent.pageX;
		_mouse.y = e.originalEvent.pageY;
	})

	/*
		start
	*/
	var _dom = document.getElementById('container');
	var _world = new world3d.three( _dom );
	_world.camera.position.set( 0, 0, _wheelValue );
	_fov = _world.camera.fov;

	var _l0 = new THREE.AmbientLight( 0x181818 );
	//_world.scene.add( _l0 );

	var _l1 = new THREE.DirectionalLight( 0xCCCCCC, 1.0 );
	_l1.position.set( 1, 1, 1 );
	//_world.scene.add( _l1 );

	var _l2 = new THREE.SpotLight( 0xCCCCCC );
	//_l2.position.set( 100, 1000, 100 );
	// spotLight.castShadow = true;

	// spotLight.shadowMapWidth = 1024;
	// spotLight.shadowMapHeight = 1024;

	// spotLight.shadowCameraNear = 500;
	// spotLight.shadowCameraFar = 4000;
	// spotLight.shadowCameraFov = 30;
	//_world.scene.add( _l2 );

	var _pl00 = new THREE.PointLight( 0xFFFFFF, 4, 800 );
	_world.scene.add( _pl00 );

	var _pl01 = new THREE.PointLight( 0xd81d42, 4, 1600 );
	_world.scene.add( _pl01 );

	var _pl02 = new THREE.PointLight( 0x00d8c0, 4, 1600 );
	_world.scene.add( _pl02 );

	var _pl03 = new THREE.PointLight( 0x592349, 3, 1600 );
	_world.scene.add( _pl03 );


	//	container
	var _container = new THREE.Object3D();
	_world.scene.add( _container );

	//	cube
	_cube = new THREE.Object3D();
	_container.add( _cube );
	_createBox();







	var _ball = new THREE.Mesh( new THREE.SphereGeometry(5,8,5),new THREE.MeshBasicMaterial({color:0xCC0000}));
	var _pl001 = new THREE.PointLight( 0xFF0000, 3, 400 );
	_ball.add( _pl001 );

	init();
	addControll();
	create_meteorite();
	create_Cylinder();
	start();


	console.log( 'CUBE > ', _cube )


	//	
	_init_open();
	_update = _update_open;


	function create_meteorite()
	{
		//var material = new THREE.MeshBasicMaterial();
		for( var i = 0; i < 1600; i++ )
		{
			var vertices = [];
			var _rockSize = Math.random() * 4.0 + 0.2;
			for( var j = 0; j < 12; j++ )
			{
				var _x = Math.random()*20-10;
				var _y = Math.random()*20-10;
				var _z = Math.random()*20-10;
				_x *= _rockSize;
				_y *= _rockSize;
				_z *= _rockSize;
				vertices.push( new THREE.Vector3(_x,_y,_z));
			}
			var geometry = new THREE.ConvexGeometry( vertices );
			var _mesh = new THREE.Mesh( geometry, meteorite_material );
			var _dist = 2400;
			_mesh.position.set(rnd()*_dist,rnd()*_dist,rnd()*_dist);
			_mesh.rotation.set(rnd()*Math.PI*2,rnd()*Math.PI*2,rnd()*Math.PI*2);
			//_container.add( _mesh );
			_mesh.vector = {x:0,y:0,z: Math.random() * 2.0 + 0.5 };
			_mesh.vectorR = {x:rnd() * Math.PI * 0.02,y:rnd() * Math.PI * 0.02,z: 0.0 };
			_mesh.targetScale = 1.0;

			_mlist.push( _mesh );
		}
	}

	function create_Cylinder()
	{
		//	tube
		var geometry = new THREE.CylinderGeometry( 300, 300, 3600, 24, 96, false );
		//var material = new THREE.MeshNormalMaterial({shading:THREE.NoShading,wireframe:true});
		var material = new THREE.MeshLambertMaterial({color: 0x333333, shading: THREE.FlatShading,side:THREE.BackSide});
		var material = new THREE.MeshPhongMaterial({color: 0x333333, shading: THREE.FlatShading,side:THREE.DoubleSide});
		_cylinder = new THREE.Mesh( geometry, material );
		_cylinder.position.set( 0, 0, 0 );
		_cylinder.rotation.x = Math.PI * 0.5;

		var len = geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _scale = Math.random() * .2 + .9;
			geometry.vertices[i].x *= _scale;
			geometry.vertices[i].z *= _scale;
		}
		//_cylinder.geometry.verticesNeedUpdate = true;
	    _cylinder.geometry.computeFaceNormals();
	    _cylinder.geometry.verticesNeedUpdate = true;
	    _cylinder.geometry.normalsNeedUpdate = true;

	}


	/*
(function(){
    var _host = "http://localhost:3000/";
    var _socket;
    init();
    function init()
    {
        _socket = io( _host );
        _socket.emit("pc");
        _socket.on("accel", function(data){
            console.log("accel", data);
        });
        _socket.on("kinect", function(data){
            console.log("kinect", data);
        });
    }
})();
	*/


	function addControll()
	{
		var mousewheelevt=(/Firefox/i.test(navigator.userAgent))? "DOMMouseScroll" : "mousewheel";
		if (document.attachEvent)
		{
			document.attachEvent("on"+mousewheelevt, displaywheel);
		} else if(document.addEventListener)
		{
			document.addEventListener(mousewheelevt, displaywheel, false)
		}

		function displaywheel( e )
		{
			var evt = window.event || e //equalize event object
			var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;
			delta = Math.floor( delta / 12 );
			_wheelValue += delta;
			_wheelValue = _wheelValue<250?250:_wheelValue>1500?1500:_wheelValue;
		}
		$( window ).on('keydown', function(e){
			//	console.log( e.originalEvent.keyCode );
			var _code = e.originalEvent.keyCode;

			console.log( _code );

			//	ENTER	RESET
			if( _code == 13 )
			{
				__wheelValue =1200;
				_cameraRad = Math.PI * 0.5;
				_world.camera.x = 0;
				_world.camera.y = 0;
				_fov = 35;

				_pl01.color = new THREE.Color( 0xd81d42 );
				_pl02.color = new THREE.Color( 0x00d8c0 );
				_pl03.color = new THREE.Color( 0x592349 );
				return;
			}

			//	scene
			if( _code == 49 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 0 )	return;
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 0;
				_init_line();
				_update = _update_line;
			} else if( _code == 50 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 1 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 1;
				_init_particle();
				_update = _update_particle;
			} else if( _code == 51 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 2 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 2;
				_init_particle_A();
				_update = _update_particle_A;
			} else if( _code == 52 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 3 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 3;
				_init_colorField();
				_update = _update_colorField;
			} else if( _code == 53 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 4 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 4;
				_init_particle_B();
				_update = _update_particle_B;
			} else if( _code == 54 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 5 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_mode = 5;
				_init_particle_F();
				_update = _update_particle_F;
			} else if( _code == 55 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 6 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 7 )	_kill_cube();

				_mode = 6;
				_init_meteorite();
				_update = _update_meteorite;
			} else if( _code == 56 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 7 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();

				_mode = 7;
				_init_cube();
				_update = _update_cube;

				_cameraRad = Math.PI * 0.5;

				var _tx = Math.cos( _cameraRad ) * _wheelValue;
				var _tz = Math.sin( _cameraRad ) * _wheelValue;
				_world.camera.position.x = _tx;
				_world.camera.position.z = _tz;

			} else if( _code == 57 )
			{
				return;
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 8 )	return;
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();

				_mode = 8;

				/*
				var _iframe = $('<iframe>');
				$( '#container' ).append( _iframe );
				_iframe.css({
					'position':'fixed',
					'left':'50%',
					'top':'50%',
					'width': '3480px',
					'height': '1024px',
					'margin': '-512px 0 0 -1740px'
				});
				_iframe.attr('src','http://nulldesign.jp/metrogram3d/')
				*/

			}



			//	ZERO	no scene
			if( _code == 48 )
			{
				if( !_isInit )
				{
					_isInit = true;
					_kill_open();
				}
				if( _mode == 0 )	_kill_line();
				if( _mode == 1 )	_kill_particle();
				if( _mode == 2 )	_kill_particle_A();
				if( _mode == 3 )	_kill_colorField();
				if( _mode == 4 )	_kill_particle_B();
				if( _mode == 5 )	_kill_particle_F();
				if( _mode == 6 )	_kill_meteorite();
				if( _mode == 7 )	_kill_cube();

				_cube.visible = false;

				_mode = 999;
				_update = function(){};
			}


			

			//	WDSA	MOVE
			if( _code == 87 )
			{
				__wheelValue -= 100;
				__wheelValue = __wheelValue < 100? 100 : __wheelValue;
			} else if( _code == 68 )
			{
			} else if( _code == 83 )
			{
				__wheelValue += 100;
				__wheelValue = __wheelValue > 1600? 1600 : __wheelValue;
			} else if( _code == 65 )
			{
			}

			//	ARROW	ROTATE
			if( _code == 38 )
			{
				_fov-=3;
				_fov = _fov < 5?5:_fov;
			} else if( _code == 39 )
			{
				_cameraRad += Math.PI * 0.5;
			} else if( _code == 40 )
			{
				_fov+=3;
				_fov = _fov > 120?120:_fov;

			} else if( _code == 37 )
			{
				_cameraRad -= Math.PI * 0.5;
			}

			//	Z
			if( _code == 90 )
			{
				_tr = Math.random() * 0.05;
				_tg = Math.random() * 0.05;
				_tb = Math.random() * 0.05;

				if( _mode == 6 || _mode == 7 )
				{
					_pl01.color = new THREE.Color(Math.random()*.9+.1,_tg,_tb);
					_pl02.color = new THREE.Color(_tr,Math.random()*.9+.1,_tb);
					_pl03.color = new THREE.Color(_tr,_tg,Math.random()*.9+.1);
				}

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

				return;
			}

			//	X
			if( _code == 88 )
			{
				_lineMaterial.linewidth = Math.floor(Math.random()*10)+1;
				_lineMaterial.opacity = Math.random()*0.8+0.2;
				_lineMaterial.size = 10;

				if( _mode == 2 )
				{
					world3d.uniforms.scale.value = Math.random() * 2 + 1;
				}

				if( _mode == 3 )
				{
					_meshTarget.material.uniforms.scale.value = Math.random() * 3.0 + 1.0;
				}


				if( _mode == 5 )
				{
					_lineMaterial.size  = 10;
				}

				if( _mode == 6 )
				{
					var len = _mlist.length;
					while( len )
					{
						len --;
						var _m = _mlist[len];
						//_m.scale.set( rnd()*0.2 + 1.0 );
						var _scale = Math.random() * 5.0 + 0.5;
						_m.scale.set(_scale,_scale,_scale);
					}
				}



				return;
			}
			

			//	SPACE
			if( _code == 32 ){}

			//	個別
			if( _code == 32 && _mode == 0 )
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
			} else if( _code == 32 && _mode == 1 || _code == 32 && _mode == 2 )
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
				var _img = 'spark2.png';
				var _r = Math.random();
				if( _r < 0.25 )
				{
					_img = 'spark3.png';
					world3d.uniforms.scale.value = Math.random() * 2 + 1;
				} else if( _r > 0.5 && _r < 0.75 )
				{
					_img = 'spark4.png';
					world3d.uniforms.scale.value = Math.random() * 2 + 1;
				} else if( _r > 0.75 )
				{
					_img = 'spark5.png';
					world3d.uniforms.scale.value = Math.random() * 2 + 1;
				}
				world3d.uniforms.texture.value = THREE.ImageUtils.loadTexture( _img );

			} else if( _code == 32 && _mode == 3 )
			{
				//	COLOR FIELD
				_meshTarget.material.uniforms.volume.value += Math.random() * 10.0 + 5.0;

			} else if( _code == 32 && _mode == 4 )
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
			} else if( _code == 32 && _mode == 5 )
			{
				var len = _lineList.length;
				while( len )
				{
					len--;
					_lineList[len].vx *= Math.random() * 16;
					_lineList[len].vy *= Math.random() * 16;
				}
			} else if( _code == 32 && _mode == 6 )
			{
				meteorite_material.wireframe = !meteorite_material.wireframe;
			} else if(_code == 32 && _mode == 7 )
			{

				var _tf = _cylinder.material.wireframe;
				_tf = !_tf;
				_cylinder.material.wireframe = _tf;
				_ball.material.wireframe = _tf;

				var len = _clist.length;
				while( len )
				{
					len--;
					var _m = _clist[len];
					_m.material.wireframe = _tf;
					//_m = null;
				}
			}


				/*
				1-0
				[Log] 49 (engine.js, line 79)
				[Log] 50 (engine.js, line 79)
				[Log] 51 (engine.js, line 79)
				[Log] 52 (engine.js, line 79)
				[Log] 53 (engine.js, line 79)
				[Log] 54 (engine.js, line 79)
				[Log] 55 (engine.js, line 79)
				[Log] 56 (engine.js, line 79)
				[Log] 57 (engine.js, line 79)
				[Log] 48 (engine.js, line 79)
				*/

				/*
				上、右、下、左
					[Log] 38 (engine.js, line 79)
				[Log] 39 (engine.js, line 79)
				[Log] 40 (engine.js, line 79)
				[Log] 37 (engine.js, line 79)
				*/

				/*	WDSA
					[Log] 87 (engine.js, line 111)
					[Log] 68 (engine.js, line 111)
					[Log] 83 (engine.js, line 111)
					[Log] 65 (engine.js, line 111)
				*/

				/*
				space, enter
				[Log] 32 (engine.js, line 79)
				[Log] 13 (engine.js, line 79)
				*/

		});
	}

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

		_intervalkey = setInterval( _loop, 1000/60 );
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

	function _init_colorField()
	{
		_cube.visible = false;
		_container.rotation.x = 0;
		_container.rotation.y = 0
		_fov = 35;

		var _n = Math.floor( Math.random() * 3 ) + 5;
		var _div = Math.pow( 2, _n );
	    var geometry = new THREE.PlaneGeometry(3840,1024,_div,_div);

	    var uniforms = {
	        volume: { type: "f", value: 0.0 },
	        time: { type: "f", value: 1.0 },
	        scale: { type: "f", value: 1.0 },
	        resolution: { type: "v2", value: new THREE.Vector2() },
	        mouse: { type: "v2", value: new THREE.Vector2() },
	        pos: { type: "v2", value: new THREE.Vector2() }
	    };
	    uniforms.time.value = 0.0;
	    uniforms.resolution.value.x = window.innerWidth;
	    uniforms.resolution.value.y = window.innerHeight;
	    uniforms.mouse.value.x = 0;
	    uniforms.mouse.value.y = 0;
	    uniforms.pos.value.x = 0;
	    uniforms.pos.value.y = 0;
	    uniforms.volume.value = 1.0;
	    uniforms.scale.value = 1.0;

	    var _vertexShader = document.getElementById('vertexshader2').textContent;
	    var _fragmentShader = document.getElementById('fragmentshader2').textContent;
	    var material = new THREE.ShaderMaterial({
	        uniforms: uniforms,
	        vertexShader: _vertexShader,
	        fragmentShader: _fragmentShader,
	        side: THREE.DoubleSide
	    });

	    _lineMaterial = material;

	    _meshTarget = new THREE.Mesh( geometry, material );
	    //_meshTarget.rotation.x = Math.PI * 0.5;
	    _world.scene.add( _meshTarget );
	}
	function _update_colorField()
	{
		_meshTarget.material.uniforms.time.value += 0.05;
		//_meshTarget.material.uniforms.volume.value = Math.random() * 0.1 + .9;

		var _w = window.innerWidth;
		var _h = window.innerHeight;

		_meshTarget.material.uniforms.mouse.value.x = ( _mouse.x - _w*.5 ) / _w;
		_meshTarget.material.uniforms.mouse.value.y = ( _mouse.y - _h*.5 ) / _h;
		_meshTarget.material.uniforms.volume.value += ( 1.0 - _meshTarget.material.uniforms.volume.value ) * 0.01;
		_meshTarget.material.uniforms.scale.value += ( 1.0 - _meshTarget.material.uniforms.scale.value ) * 0.01;

		//var _rad = Math.PI * ( _meshTarget.material.uniforms.mouse.value.x + 0.5 );
		var _rad = Math.atan2( _meshTarget.material.uniforms.mouse.value.y, _meshTarget.material.uniforms.mouse.value.x );
		var _x = Math.cos( _rad ) * _meshTarget.material.uniforms.volume.value;
		var _y = Math.sin( _rad ) * _meshTarget.material.uniforms.volume.value;
		_meshTarget.material.uniforms.pos.value.x += _x;
		_meshTarget.material.uniforms.pos.value.y += _y;

		//	_container
		_container.rotation.x = world3d.time * 0.0036;
		_container.rotation.y = world3d.time * 0.0024;

		//	CAMERA
		_world.camera.lookAt( _world.focus );
	}
	function _kill_colorField()
	{
		_world.scene.remove( _meshTarget );
		_meshTarget.geometry.dispose();
		_meshTarget = null;
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

	function _init_particle_F()
	{
		_cube.visible = false;
		_speed = 0.36;
		_scale = 1.6;
		_frection = 0.986;
		__wheelValue = 1200;

		_container.rotation.x %= Math.PI;
		_container.rotation.y %= Math.PI;
		_container.rotation.z %= Math.PI;

		_fov = 35;

		var _material = new THREE.PointCloudMaterial({
			size: 5,
			color: new THREE.Color(__r,__g,__b),
			transparent:true,
			opacity:0.8,
			blending:       THREE.AdditiveBlending
		});

		_lineMaterial = _material;


		var _geometry = new THREE.Geometry();
		var len = _vlist.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i] = _vlist[i];
			var _vx = rnd() * 5.0;
			var _vy = rnd() * 5.0;
			var _vz = rnd() * 5.0;

			_lineList.push({
				vertices:_geometry.vertices[i],
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}
		var len = _v2list.length;
		for( var i = 0; i < len; i++ )
		{
			_geometry.vertices[i+_vlist.length] = _v2list[i];
			var _vx = rnd() * 5.0;
			var _vy = rnd() * 5.0;
			var _vz = rnd() * 5.0;

			_lineList.push({
				vertices:_geometry.vertices[i+_vlist.length],
				vx: _vx,
				vy: _vy,
				vz: _vz
			});
		}

		_meshTarget = new THREE.PointCloud( _geometry, _material );
		_container.add( _meshTarget );

		_cameraRad = Math.PI * 0.5;


		_meshTarget.scale.x = 32;
		_meshTarget.scale.y = 32;
		_meshTarget.scale.z = 32;
		_frection = 0.94;
		_speed *= 4 / _meshTarget.scale.x;

		_scale = 0.4;
	}
	function _update_particle_F()
	{
		_wind += ( 0 - _wind ) * 0.1;

		_container.rotation.x += ( 0 - _container.rotation.x ) * 0.01;
		_container.rotation.y += ( 0 - _container.rotation.y ) * 0.01;
		_container.rotation.z += ( 0 - _container.rotation.z ) * 0.01;

			//	LINE
			var _par = 1 / _meshTarget.scale.x;
			var _size = 3840 * 0.5 * _par;
			var _hsize = 1024 * 0.5 * _par;
			var _time = Date.now() * 0.02;
			var len = _lineList.length;
			while( len )
			{
				len--;
				var _obj = _lineList[len];
				var _vertices = _obj.vertices;
				var _px = _vertices.x;
				var _py = _vertices.y;

				_vertices.x += _obj.vx;
				_vertices.y += _obj.vy;
				_vertices.z += ( 10 - _vertices.z ) * 0.05;

				_obj.vx += simplexNoiseX.noise( ( _vertices.x + _size * 2 + _time ) / ( _size * 2.0 ) * _scale * 15/4 + _time*0.005 + _wind, ( _vertices.y + _hsize * 2 + _time ) / ( _hsize * 2.0 ) * _scale ) * _speed;
				_obj.vy += simplexNoiseY.noise( ( _vertices.y + _size * 2 + _time ) / ( _size * 2.0 ) * _scale * 15/4 + _time*0.005, ( _vertices.x + _hsize * 2 + _time ) / ( _hsize * 2.0 ) * _scale ) * _speed;

				_obj.vx += (Math.random()-.5)*.1;
				_obj.vy += (Math.random()-.5)*.1;

				//	air frection
				_obj.vx *= _frection;
				_obj.vy *= _frection;

				//
				if( _vertices.x < -_size )
				{
					//_vertices.x = -_hsize;
					_obj.vx *= Math.random() * .2 + .9;
					_vertices.x += _size * 2;

				} else if( _vertices.x > _size )
				{
					//_vertices.x = _hsize;
					_obj.vx *= Math.random() * .2 + .9;
					_vertices.x -= _size * 2;
				}
				if( _vertices.y < - _hsize )
				{
					//_vertices.y = -_hsize;
					_obj.vy *= Math.random() * .2 + .9;
					_vertices.y += _hsize * 2;
				} else if( _vertices.y > _hsize )
				{
					//_vertices.y = _hsize;
					_obj.vy *= Math.random() * .2 + .9;
					_vertices.y -= _hsize * 2;
				}
			}

			_meshTarget.geometry.verticesNeedUpdate = true;
	}
	function _kill_particle_F()
	{
		_kill_particle();
	}
	function _init_meteorite()
	{
		_cube.visible = false;

		_container.rotation.x = 0;
		_container.rotation.y = 0
		_fov = 90;

		var len = _mlist.length;
		while( len )
		{
			len--;
			var _m = _mlist[len];
			_container.add( _m );
		}
	}
	function _update_meteorite()
	{
		//	_container.rotation.x = world3d.time * 0.0001;
		//	_container.rotation.y = world3d.time * 0.0002;

		var len = _mlist.length;
		while( len )
		{
			len--;
			var _m = _mlist[len];
			_m.rotation.x += _m.vectorR.x;
			_m.rotation.y += _m.vectorR.x;

			var _targetScale = _m.targetScale;
			var _scale = _m.scale.x;
			_scale += ( _targetScale - _scale ) * 0.1;
			_m.scale.set( _scale, _scale, _scale );


			_m.position.z += _m.vector.z;

			if( _m.position.z > 1200 )
			{
				_m.position.z -= 2400;
			}
		}

		var _theTime = world3d.time * 0.01;
		_pl00.position.x = Math.cos( - _theTime ) * 1800;
		_pl00.position.y = - Math.sin( _theTime ) * 400;
		_pl00.position.z = Math.sin( _theTime * 0.275 ) * 600;

		_pl01.position.x = Math.cos( _theTime ) * 900;
		_pl01.position.y = Math.sin( _theTime ) * 900;
		_pl01.position.z = Math.sin( _theTime * 0.075 ) * 900;

		_pl02.position.x = - Math.cos( _theTime * 0.8 ) * 720;
		_pl02.position.y = Math.sin( - _theTime * 0.9 ) * 720;
		_pl02.position.z = Math.sin( _theTime * 0.075 ) * 720;

		_pl03.position.x = Math.cos( _theTime * 0.9 ) * 1200;
		_pl03.position.y = -Math.sin( - _theTime * 1.1 ) * 600;
		_pl03.position.z = -Math.sin( _theTime * 0.75 ) * 600;
	}
	function _kill_meteorite()
	{
		var len = _mlist.length;
		while( len )
		{
			len--;
			var _m = _mlist[len];
			//_m.geometry.dispose();
			_container.remove( _m );
			//_m = null;
		}
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
	function _update_cube()
	{
		_container.rotation.x += ( 0 - _container.rotation.x ) * 0.01;
		_container.rotation.y += ( 0 - _container.rotation.y ) * 0.01;
		_container.rotation.z += ( 0 - _container.rotation.z ) * 0.01;

		var _theTime = world3d.time * 0.01;
		_theTime %= 1000;
		_pl01.position.x = Math.cos( _theTime ) * 900;
		_pl01.position.y = Math.sin( _theTime ) * 900;
		_pl01.position.z = Math.sin( _theTime * 0.075 ) * 900;

		_pl02.position.x = - Math.cos( _theTime * 0.8 ) * 720;
		_pl02.position.y = Math.sin( - _theTime * 0.9 ) * 720;
		_pl02.position.z = Math.sin( _theTime * 0.075 ) * 720;

		_pl03.position.x = Math.cos( _theTime * 0.9 ) * 1200;
		_pl03.position.y = -Math.sin( - _theTime * 1.1 ) * 600;
		_pl03.position.z = -Math.sin( _theTime * 0.75 ) * 600;

    	_cylinder.rotation.y -= 0.001;

    	_ball.position.x = Math.cos( _theTime * 0.1 ) * 100;
    	_ball.position.y = Math.sin( _theTime * 0.1 ) * 100;
		_ball.position.z = Math.sin( _theTime * 0.5 ) * 300 + 900;

	    //_cylinder.geometry.verticesNeedUpdate = true;

	    var len = _cylinder.geometry.vertices.length;
	    var _grid = 24;
	    while( len )
	    {
	    	len --;
	    	var _rad = len / _grid * Math.PI * 2;
	    	var _x = Math.cos( _rad ) * 250;
	    	var _z = Math.sin( _rad ) * 250;
	    	var _y = _cylinder.geometry.vertices[len].y;

	    	var _value = simplexNoiseX.noise( ( len % _grid ) * 0.1, _y * 0.1 + _theTime * 0.2 );
	    	_cylinder.geometry.vertices[len].x = _x * ( _value * 0.2 + 0.9 );
	    	_cylinder.geometry.vertices[len].z = _z * ( _value * 0.2 + 0.9 );
	    }
	    _cylinder.geometry.verticesNeedUpdate = true;


		var len = _clist.length;
		while( len )
		{
			len--;
			var _m = _clist[len];
			_m.position.z += _m.vector.z;
			_m.rotation.x += _m.vectorR.x;
			_m.rotation.y += _m.vectorR.y;
			if( _m.position.z > 1600 )
			{
				var _ml = _clist.splice( len, 1 );
				_m.geometry.dispose();
				_container.remove( _m );
			}
			//_m = null;
		}
	}
	function _createMeteo()
	{
		//var _geometry = new THREE.BoxGeometry( 10, 10, 10, 1, 1, 1 );

		if( _clist.length > 1000 ) return;

		var vertices = [];
		var _rockSize = Math.random() * 4.0 + 0.2;
		for( var j = 0; j < 8; j++ )
		{
			var _x = rnd()*10;
			var _y = rnd()*10;
			var _z = rnd()*10;
			_x *= _rockSize;
			_y *= _rockSize;
			_z *= _rockSize;
			vertices.push( new THREE.Vector3(_x,_y,_z));
		}
		var _geometry = new THREE.ConvexGeometry( vertices );

		var _material = new THREE.MeshLambertMaterial({shading:THREE.FlatShading});
		var _mesh = new THREE.Mesh( _geometry, _material );
		_container.add( _mesh );
		_mesh.vector = {x:0,y:0,z:Math.random() * 8.0 + 1.0}
		_mesh.vectorR = {x:rnd()*0.2,y:rnd()*0.2,z:0}

		var _rad = rnd() * Math.PI * 2;
		var _r = 1 - Math.random()*Math.random()
		var _x = Math.cos( _rad ) * _r * 160;
		var _y = Math.sin( _rad ) * _r * 160;
		var _z = Math.random() * 100 - 1200;
		_mesh.position.set( _x, _y, _z );

		_clist.push( _mesh );

		var _scale = Math.random() * 0.2 + 0.9;
		_mesh.scale.set(_scale,_scale,_scale);
	}
	function _kill_cube()
	{
		clearInterval( _meteoKey )

		var len = _clist.length;
		while( len )
		{
			len--;
			var _m = _clist.pop();
			_m.geometry.dispose();
			_container.remove( _m );
			//_m = null;
		}
		_clist = [];

		_world.scene.remove( _ball );
		_world.scene.remove( _cylinder );
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