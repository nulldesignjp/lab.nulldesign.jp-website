/*
	engine.js
*/

(function(){

	var midi;
	var world,_plane;
	var _simplexNoiseX,_simplexNoiseY,_simplexNoiseZ;
	var _convexlist = [];

	var _particle;


	var _stars = [
	//	球体半径		軌道半径	公転周期	自転周期
		{r: 1392038,r2:	0.0,	kakudo:0,	publicRot: 0,	privateRot: 27.275,		},
		{r: 4879.4,r2:	0.38709927,	kakudo:7.004,	publicRot: 0.241,	privateRot: 58.65	},
		{r: 12103.6,r2:	0.72333566,	kakudo:3.39471,	publicRot: 0.615,	privateRot: 243.0187	},
		{r: 12756.3,r2:	1.00000261,	kakudo:0.00005,	publicRot: 1.000,	privateRot: 0.997271	},
		{r: 6794.4,r2:	1.52371034,	kakudo:1.85061,	publicRot: 1.881,	privateRot: 1.02595	},
		{r: 142984,r2:	5.20288700,	kakudo:1.30530,	publicRot: 11.86,	privateRot: 0.4135	},
		{r: 120536,r2:	9.53667594,	kakudo:2.48446,	publicRot: 29.46,	privateRot: 0.4264	},
		{r: 51118,r2:	19.18916464,	kakudo:0.774,	publicRot: 84.01,	privateRot: 0.7181	},
		{r: 49572,r2:	30.06992276,	kakudo:1.76917,	publicRot: 164.79,	privateRot: 0.6712	}
	];

	var _starList = [];

	//	start
	var midi = new midiControl( _midiMessage );

	if( midi )
	{
		console.log( 'log', midi );
		console.debug('debug', midi);
		console.error('error', midi);
		console.info('info', midi);
		console.warn('warn', midi);
		console.count('count');
		console.count('count');
		console.count('count');

		console.trace(	new Date() );

		console.time('hoge');
		console.timeEnd('hoge');

		console.table(midi);
		console.dir(document.getElementById('container'));
		console.dirxml(document.getElementById('container'));
	}

	var world = new world3d( document.getElementById('container') );
	initWorld();

	world.update = update;
	
	//	callbackALL
	function _midiMessage(e)
	{
		//	console.log(e);
	}

	function initWorld()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var _geometry = new THREE.PlaneGeometry(5000,5000,50,50);
		var _material = new THREE.MeshPhongMaterial({
			shininess: 140,
			specular: 0xCCCCCC,
			metal: true,
			transparent: true,
			opacity: 0.4
		});
		_plane = new  THREE.Mesh( _geometry, _material );
		_plane.rotation.x = - Math.PI * 0.5;
		_plane.receiveShadow = true;
		world.scene.add( _plane );

		// _plane.material.shininess = 60;
		// _plane.material.specular = 0x9999FF;
		// _plane.material.emissive = 0xFFFFFF;

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 10000; i++ )
		{
			_geometry.vertices[i] = new THREE.Vector3( rnd()*1000,rnd()*1000,rnd()*1000 )
		}
		var _material = new THREE.PointCloudMaterial({
			size: 8,
			depthTest: false,
			transparent: true,
			//blending: THREE.AdditiveBlending,
			//vertexColors: THREE.VertexColors,
			map: THREE.ImageUtils.loadTexture('particle.png')
		});
		_particle = new THREE.PointCloud( _geometry, _material );

		world.scene.add( _particle );

		var _pl01 = new THREE.PointLight( 0xFFFFFF, 1.0, 600 );
		_pl01.position.set( 100, 400, 100 );
		world.scene.add( _pl01 );

		var _dl01 = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );
		_dl01.position.set( 0, 1, 0 );
		world.scene.add( _dl01 );
		
		var _sl01 = new THREE.SpotLight( 0xFFFFFF, 0.2 );
		_sl01.position.set( 300, 400, -600 );
		_sl01.angle = Math.PI * 0.35;
		_sl01.castShadow = true;
		_sl01.shadowMapWidth = 1024;
		_sl01.shadowMapHeight = 1024;
		world.scene.add( _sl01 );

		//	noise
		_simplexNoiseX = new SimplexNoise();
		_simplexNoiseY = new SimplexNoise();
		_simplexNoiseZ = new SimplexNoise();

		//	uni
		var au = 149597870.700;	// m (定義値)	
		var _scale2 = 0.000000001;


		_scale2 *= 0.1;

		var _scale = _scale2 * 100000.0 * 5.0;
		var _scale = _scale2 * 100000;

		_scale *= 10;

		var len = _stars.length;
		while( len )
		{
			len --;

			var _group = new THREE.Object3D();
			world.scene.add( _group );
			//_group.rotation.z = _stars[len].kakudo / 180 * Math.PI;

			var _r = _stars[len].r2 * 1000.0 * au * _scale2;
			var _geometry = new THREE.CircleGeometry( _r, 32 );
			var _material = new THREE.MeshBasicMaterial({wireframe:true,transparent:true,opacity:0.0});
			var _mesh = new THREE.Mesh( _geometry, _material );
			_mesh.rotation.x = Math.PI * 0.5;
			_group.add( _mesh );

			var _edge = new THREE.EdgesHelper( _mesh, 0x003366 )
			_group.add( _edge );

			var __r = _stars[len].r * _scale;
			var _geometry = new THREE.IcosahedronGeometry(__r,1);
			var _material = new THREE.MeshBasicMaterial({wireframe:true,side:THREE.DoubleSide});
			var _mesh = new THREE.Mesh(_geometry,_material);
			_mesh.position.z = _r;
			_group.add( _mesh );

			_starList.push({
				obj: _mesh,
				length: _r,
				publicRot: _stars[len].publicRot,
				privateRot: _stars[len].privateRot,
			});

			console.log( __r );

		}


		//	メインベルト
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 1000; i++ )
		{
			//var _leng = Math.random() * ( 4.2 - 1.8 ) + 1.8;
			var _r = _leng * 1000.0 * au * _scale2;
			var _rad = Math.random() * Math.PI * 2;
			var _leng = ( ( Math.sin( _rad - Math.PI * 0.25 ) + 1.0 ) * 0.5 ) * ( 4.2 - 1.8) + 1.8;
			var _x = Math.cos( _rad ) * _r;
			var _z = Math.sin( _rad ) * _r;
			_geometry.vertices[i] = new THREE.Vector3( _x, rnd()*3, _z )
		}
		var _material = new THREE.PointCloudMaterial({
			size: 3,
			depthTest: false,
			transparent: true,
			//blending: THREE.AdditiveBlending,
			//vertexColors: THREE.VertexColors,
			map: THREE.ImageUtils.loadTexture('particle.png')
		});
		var _tparticle = new THREE.PointCloud( _geometry, _material );
		world.scene.add( _tparticle );


	}

	function update()
	{
		world._focus.x = Math.sin( world.time * 0.01 ) * 16;
		world._focus.y = Math.cos( world.time * 0.016 ) * 16 + 110;
		world._focus.z = Math.cos( world.time * 0.001 ) * 16;

		world._camera.x = Math.sin( world.time * 0.01 ) * 90;
		world._camera.y = Math.cos( world.time * 0.008 ) * 16 + 100;
		world._camera.z = Math.cos( world.time * 0.001 ) * 16+400;

		world.focus.x += ( world._focus.x - world.focus.x ) * 0.05;
		world.focus.y += ( world._focus.y - world.focus.y ) * 0.05;
		world.focus.z += ( world._focus.z - world.focus.z ) * 0.05;
		world.camera.position.x += ( world._camera.x - world.camera.position.x ) * 0.05;
		world.camera.position.y += ( world._camera.y - world.camera.position.y ) * 0.05;
		world.camera.position.z += ( world._camera.z - world.camera.position.z ) * 0.05;

		var _color = new THREE.Color( midi.data(77)/127, midi.data(78)/127, midi.data(79)/127 );
		world.scene.fog.color = _color;
		world.renderer.setClearColor(_color, 1);
		_plane.material.specular = _color;

		_val = midi.data(84)/127;
		_val = Math.floor( _val * 16 );
		document.getElementById('container').style.webkitFilter = "blur("+_val+"px)";

		// _particle.geometry.vertices.push( new THREE.Vector3(rnd()*100,rnd()*100,rnd()*100) );
		// _particle.geometry.verticesNeedUpdate = true;


			// _starList[len] = {
			// 	obj: _mesh,
			// 	length: _r,
			// 	rot0: 0,
			// 	rot1: 0,
			// 	publicRot: _stars[len].publicRot,
			// 	privateRot: _stars[len].privateRot,
			// };
			var _timeScale = 0.01;
			var len = _starList.length;
			while( len )
			{
				len --;

				var _rad = world.time * _timeScale;
				var _radP0 = _rad / _starList[len].publicRot;

				var _x = Math.cos( _radP0 ) * _starList[len].length;
				var _z = Math.sin( _radP0 ) * _starList[len].length;
				_starList[len].obj.position.x = _x;
				_starList[len].obj.position.z = _z;

				_starList[len].obj.rotation.y = - _rad / _starList[len].privateRot;
			}


		world.camera.lookAt( _starList[3].obj )
	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();