/*
	engine.js
*/

(function(){

	var midi;
	var world,_plane;
	var _composer00;
	var _rgbShift,_focus,_glitch,_film,_hueAndSaturetion,_vignette,_BadTVShader;
	var _simplexNoiseX,_simplexNoiseY,_simplexNoiseZ;
	var _convexlist = [];
	var _trianglelist = [];
	var _container;
	var _particle;
	var _sphere,_sphereBase;
	var _line;

	var _dataList = [];
	_dataList = [
		0,0,0,0,0,0,	0.5,	0.5,
		0,0,0,0,0,0,	0.5,	0,
		0,0,0,0,0,0,	0,	0,
		0,0,0,0,0,0,	0,	0
	];
	var _tfList = [0,0,0,0,0,0,0,0];

	//	start
	var midi = new midiControl( _midiMessage );

	if( midi )
	{
		/*
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
		*/

		//	$('#container').css('opacity',1);
	}

	var world = new world3d( document.getElementById('container') );
	initWorld();

	world.update = update;
	
	//	callbackALL
	function _midiMessage(e)
	{
		//console.log(e);
		//_dataList[ e.note - 1 ] = e.velocity / 127;

		//		13-19
		//		29-36
		//		49-56
		//		77-84


		if( e.note >= 13 && e.note <= 19)
		{
			_dataList[ e.note - 13 -+ 0 ] = e.velocity / 127;
			return;
		} else if( e.note >= 29 && e.note <= 36)
		{
			_dataList[ e.note - 29 + 8 ] = e.velocity / 127;
			return;
		} else if( e.note >= 49 && e.note <= 56)
		{
			_dataList[ e.note - 49 + 16 ] = e.velocity / 127;
			return;
		} else if( e.note >= 77 && e.note <= 84)
		{
			_dataList[ e.note - 77 + 24 ] = e.velocity / 127;

			if( e.note - 77 + 24 == 31 )
			{
				$('#container').css('opacity', e.velocity / 127 );
			}

			return;
		}


		if( e.note == 41 )
		{
			_tfList[0] = e.velocity / 127;
		}
		if( e.note == 42 )
		{
			_tfList[1] = e.velocity / 127;
		}
	}

	function initWorld()
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		_container = new THREE.Object3D();
		world.scene.add( _container );

		initPostprocessing();



		var _geometry = new THREE.PlaneGeometry(5000,5000,50,50);

		var _material = new THREE.MeshPhongMaterial({
			shininess: 140,
			specular: 0x999999,
			metal: true,
			shading: THREE.FlatShading
		});
		_plane = new  THREE.Mesh( _geometry, _material );
		_plane.rotation.x = - Math.PI * 0.5;
		_plane.receiveShadow = true;
		_container.add( _plane );

		// _plane.material.shininess = 60;
		// _plane.material.specular = 0x9999FF;
		// _plane.material.emissive = 0xFFFFFF;

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 10000; i++ )
		{
			_geometry.vertices[i] = new THREE.Vector3( rnd()*800,rnd()*400,rnd()*600 );
		}
		var _material = new THREE.PointCloudMaterial({
			color: 0xFFFFFF,
			size: 2,
			depthTest: false,
			transparent: true,
			blending: THREE.AdditiveBlending,
			//vertexColors: THREE.VertexColors,
			map: THREE.ImageUtils.loadTexture('particle.png'),
			//opacity: 0.2
		});
		_particle = new THREE.PointCloud( _geometry, _material );
		_container.add( _particle );

		//console.log( _particle.geometry )



		/*
			llighting
		*/
		var _pl01 = new THREE.PointLight( 0xFFFFFF, 1.0, 600 );
		_pl01.position.set( 100, 400, 100 );
		_container.add( _pl01 );

		var _dl01 = new THREE.DirectionalLight( 0xFFFFFF, 0.05 );
		_dl01.position.set( 0, 1, 0 );
		_container.add( _dl01 );
		
		var _sl01 = new THREE.SpotLight( 0xFFFFFF, 0.2 );
		_sl01.position.set( 300, 400, -600 );
		_sl01.angle = Math.PI * 0.35;
		_sl01.castShadow = true;
		_sl01.shadowMapWidth = 1024;
		_sl01.shadowMapHeight = 1024;
		_container.add( _sl01 );

		//	noise
		_simplexNoiseX = new SimplexNoise();
		_simplexNoiseY = new SimplexNoise();
		_simplexNoiseZ = new SimplexNoise();

		for( var i = 0; i < 300; i++ )
		{
			var _mesh = createConvex();
			_convexlist.push( _mesh );

			_mesh.position.set( rnd()*800, rnd()*200+200, rnd()*600 );
			_mesh.castShadow = true;
			_mesh.vector3 = new THREE.Vector3( - (Math.random()*3+1), rnd()*0.2, rnd()*0.2 );
			_mesh.vectorR3 = new THREE.Vector3(rnd()*Math.PI*2*0.004,rnd()*Math.PI*2*0.004,rnd()*Math.PI*2*0.004 );
			_container.add( _mesh );
		}


		_sphereBase = new THREE.IcosahedronGeometry(50,5);
		var _geometry = _sphereBase.clone();
		var _material = new THREE.MeshPhongMaterial({
			color: 0x000000,
			shading: THREE.SmoothShading,
			emissive: 0x000000,
			shininess: 40,
			specular: 0x003366,
			metal: true,
			transparent: true,
			depthTest: true,
			blending: THREE.NormalBlending,
			opacity: 0.8,
			depthTest: true,
			side: THREE.DoubleSide 
		});

		_sphere = new THREE.Mesh( _geometry, _material );
		_sphere.scale.set(2,2,2)
		_sphere.position.y = 100;
		_sphere.castShadow = true;
		_sphere.receiveShadow = true;
		_container.add( _sphere );

		var _pl02 = new THREE.PointLight( 0x336699, 1.0, 1200 );
		_pl02.position.set( 0, 100, 0 );
		_container.add( _pl02 );


		// for( var i = 0; i < 100; i++ )
		// {
		// 	var _s = Math.floor(Math.random()*10)*10;
		// 	var _geometry = new THREE.BoxGeometry( _s,_s*0.5,_s,1,1,1);
		// 	var _material = new THREE.MeshLambertMaterial();
		// 	var _mesh = new THREE.Mesh( _geometry, _material );
		// 	_mesh.position.set( rnd()*500, _s * 0.25, rnd()*500 );
		// 	_mesh.rotation.set(rnd()*Math.PI*0.1,rnd()*Math.PI*0.1,rnd()*Math.PI*0.1)
		// 	_container.add( _mesh );
		// }

	}

	// postprocessing
	function initPostprocessing()
	{
		_composer00 = new THREE.EffectComposer( world.renderer );
		_composer00.addPass( new THREE.RenderPass( world.scene, world.camera ) );

		// var effect = new THREE.ShaderPass( THREE.DotScreenShader );
		// effect.uniforms[ 'scale' ].value = 2;
		// //effect.renderToScreen = true;
		// _composer00.addPass( effect );

		_rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
		_rgbShift.uniforms[ 'amount' ].value = 0.0015;
		//_rgbShift.renderToScreen = true;
		_composer00.addPass( _rgbShift );

		_film = new THREE.ShaderPass( THREE.FilmShader );
		_film.uniforms[ 'sIntensity' ].value = Math.random();
		_film.uniforms[ 'nIntensity' ].value = Math.random();
		_film.uniforms[ 'sCount' ].value = 32;
		_film.uniforms[ 'grayscale' ].value = 0;
		//_film.renderToScreen = true;
		_composer00.addPass( _film );

		// 	くそ重い
		// var effect = new THREE.ShaderPass( THREE.EdgeShader );
		// effect.uniforms[ 'aspect' ].value = new THREE.Vector2(1024,1024);
		// //effect.renderToScreen = true;
		// _composer00.addPass( effect );

		_focus = new THREE.ShaderPass( THREE.FocusShader );
		_focus.uniforms[ 'screenWidth' ].value = window.innerWidth;
		_focus.uniforms[ 'screenHeight' ].value = window.innerHeight;
		_focus.uniforms[ 'waveFactor' ].value = 0.005;	//	0.00125
		//_focus.renderToScreen = true;
		_composer00.addPass( _focus );

		_hueAndSaturetion = new THREE.ShaderPass( THREE.HueSaturationShader );
		_hueAndSaturetion.uniforms[ 'hue' ].value = 0.0;
		_hueAndSaturetion.uniforms[ 'saturation' ].value = 0.0;
		//_hueAndSaturetion.renderToScreen = true;
		_composer00.addPass( _hueAndSaturetion );

		// _vignette = new THREE.ShaderPass( THREE.VignetteShader );
		// _vignette.uniforms[ 'darkness' ].value = 0.0;
		// //_vignette.renderToScreen = true;
		// _composer00.addPass( _vignette );


		_BadTVShader = new THREE.ShaderPass( THREE.BadTVShader );
		_BadTVShader.uniforms[ 'time' ].value = 0.0;
		_BadTVShader.uniforms[ 'distortion' ].value = 3.0;
		_BadTVShader.uniforms[ 'distortion2' ].value = 5.0;
		_BadTVShader.uniforms[ 'speed' ].value = 0.2;
		_BadTVShader.uniforms[ 'rollSpeed' ].value = 0.1;

		//_BadTVShader.renderToScreen = true;
		_composer00.addPass( _BadTVShader );


		_glitch = new THREE.ShaderPass( THREE.DigitalGlitch );
		//_glitch.uniforms[ 'byp' ].value = 1;
		_glitch.uniforms[ 'amount' ].value = Math.random()*0.01;
		_glitch.uniforms[ 'angle' ].value = Math.random();
		_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;
		_glitch.uniforms[ 'seed_y' ].value = Math.random()*2-1;
		_glitch.uniforms[ 'distortion_x' ].value = Math.random()*10;
		_glitch.uniforms[ 'distortion_y' ].value = Math.random()*10;

		_glitch.renderToScreen = true;
		_composer00.addPass( _glitch );
	}

	function update()
	{
		var _timeScale = _dataList[23];


		world._focus.x = Math.sin( world.time * 0.004 ) * 16;
		world._focus.y = Math.cos( world.time * 0.006 ) * 16 + 110;
		world._focus.z = Math.cos( world.time * 0.001 ) * 16;

		world._camera.x = Math.sin( world.time * 0.002 ) * 90;
		world._camera.y = Math.cos( world.time * 0.003 ) * 16 + 100;
		world._camera.z = Math.cos( world.time * 0.001 ) * 16 + 400;

		world.focus.x += ( world._focus.x - world.focus.x ) * 0.05;
		world.focus.y += ( world._focus.y - world.focus.y ) * 0.05;
		world.focus.z += ( world._focus.z - world.focus.z ) * 0.05;
		world.camera.position.x += ( world._camera.x - world.camera.position.x ) * 0.05;
		world.camera.position.y += ( world._camera.y - world.camera.position.y ) * 0.05;
		world.camera.position.z += ( world._camera.z - world.camera.position.z ) * 0.05;

		//	all
		var _scale = 0.01;
		var _speed = 0.05 * _dataList[29] * 10;
		var len = _convexlist.length;
		while( len )
		{
			len = ( len - 1 ) | 0;
			var _mesh = _convexlist[len];

			var _value = ( _dataList[25] * 2 + 1.0 );
			_mesh.position.x += _mesh.vector3.x * _value;
			_mesh.position.y += _mesh.vector3.y * _value;
			_mesh.position.z += _mesh.vector3.z * _value;
			_mesh.rotation.x += _mesh.vectorR3.x * _value;
			_mesh.rotation.y += _mesh.vectorR3.y * _value;
			_mesh.rotation.z += _mesh.vectorR3.z * _value;

			//_mesh.vector3.x += _simplexNoiseX.noise( _mesh.position.y * _scale, _mesh.position.z * _scale ) *_speed;
			_mesh.vector3.y += _simplexNoiseY.noise( _mesh.position.z * _scale, _mesh.position.x * _scale ) * _speed;
			_mesh.vector3.z += _simplexNoiseZ.noise( _mesh.position.x * _scale, _mesh.position.y * _scale ) * _speed;

			//_mesh.vector3.x *= .96;
			_mesh.vector3.y *= .96;
			_mesh.vector3.z *= .96;

			if( _mesh.position.x < - 800 )
			{
				_mesh.position.x += 1600;

				_container.remove( _mesh );
				_mesh.geometry.dispose();
				_mesh.material.dispose();
				_mesh = null;

				_convexlist.splice( len, 1 );
				continue;

			}
			if( _mesh.position.y < -400 || _mesh.position.y > 400 )
			{
				_mesh.vector3.y *= -1;
			}
			if( _mesh.position.z < -300 )
			{
				_mesh.position.z += 600;
			}
		}


		_plane.position.y += ( - _dataList[30] * 200 - _plane.position.y ) * 0.01;


		/*
			particle
		*/
		// var _scale = _dataList[16] * 0.016 + 0.0001;
		// var _speed = _dataList[17] * 5.0 + 0.05;
		// var _grav = _dataList[18] * 0.02 + 0.98;
		// _particle.material.size += ( _dataList[19] * 19 + 1 - _particle.material.size ) * 0.05;
		// var len = _particle.geometry.vertices.length;

		// var _theTime = world.time * _scale;
		// while( len )
		// {
		// 	len --;
		// 	var _vertex = _particle.geometry.vertices[len];
		// 	_vertex.x += _simplexNoiseX.noise( _vertex.y * _scale + _theTime, _vertex.z * _scale ) * _speed;
		// 	_vertex.y += _simplexNoiseY.noise( _vertex.z * _scale + _theTime, _vertex.x * _scale ) * _speed;
		// 	_vertex.z += _simplexNoiseZ.noise( _vertex.x * _scale + _theTime, _vertex.y * _scale ) * _speed;

		// 	//_vertex.y = ( _vertex.y - _grav ) | 0;

		// 	_vertex.x *= _grav;
		// 	_vertex.y = ( _vertex.y - 150.0 ) * _grav + 150;
		// 	_vertex.z *= _grav;


		// 	_vertex.x += 5;


		// 	if( _vertex.x < - 800 )
		// 	{
		// 		_vertex.x += 1600;
		// 	} else if( _vertex.x > 800 )
		// 	{
		// 		_vertex.x -= 1600;

		// 	_vertex.x = -200 + rnd() * 10;
		// 	_vertex.y = 100 + rnd() * 10;
		// 	_vertex.z = rnd() * 10;
		// 	}
		// 	if( _vertex.y < 0 )
		// 	{
		// 		_vertex.y = 400;
		// 	} else if( _vertex.y > 400 )
		// 	{
		// 		_vertex.y = 0;
		// 	}
		// 	if( _vertex.z < -300 )
		// 	{
		// 		_vertex.z = 300;
		// 	} else if( _vertex.z > 300 )
		// 	{
		// 		_vertex.z = - 300;
		// 	}

		// }

		// for( var i = 0; i < 60; i++ )
		// {
		// 	var _hoge = _particle.geometry.vertices.pop();
		// 	_vertex.x = -200 + rnd() * 10;
		// 	_vertex.y = 100 + rnd() * 10;
		// 	_vertex.z = rnd() * 10;
		// 	_particle.geometry.vertices.unshift( _hoge );
		// }


		_particle.geometry.verticesNeedUpdate = true;



		/*
			sphere
		*/
		var _scale = 0.02;
		var len = _sphere.geometry.vertices.length;
		while( len )
		{
			len --;
			var _p = _sphere.geometry.vertices[len];
			var _pow = _dataList[27] + _dataList[28] * _simplexNoiseX.noise3d( _p.x*_scale + world.time*0.05, _p.y*_scale, _p.z*_scale );
			_sphere.geometry.vertices[len].x += ( _sphereBase.vertices[len].x * _pow - _sphere.geometry.vertices[len].x ) * 0.2;
			_sphere.geometry.vertices[len].y += ( _sphereBase.vertices[len].y * _pow - _sphere.geometry.vertices[len].y ) * 0.2;
			_sphere.geometry.vertices[len].z += ( _sphereBase.vertices[len].z * _pow - _sphere.geometry.vertices[len].z ) * 0.2;
		}
		_sphere.geometry.verticesNeedUpdate = true;
		_sphere.geometry.facesNeedUpdate = true;

		/*
			generate convex
		*/
		var _scales = _dataList[26] * 2.0 + 0.1;
		var len = Math.floor( _dataList[24] * 3 );
		for( var i = 0; i < len; i++ )
		{
			var _mesh = createConvex();
			_mesh.scale.set(_scales,_scales,_scales);
			_convexlist.push( _mesh );

			_mesh.position.set( 800, rnd()*400+400, rnd()*600 );
			_mesh.castShadow = true;
			_mesh.vector3 = new THREE.Vector3( - (Math.random()*5+1), rnd()*0.2, rnd()*0.2 );
			_mesh.vectorR3 = new THREE.Vector3(rnd()*Math.PI*2*0.004,rnd()*Math.PI*2*0.004,rnd()*Math.PI*2*0.004 );
			_container.add( _mesh );
		}



		/*
			generate Triangle
		*/
		if( _tfList[1] )
		{
			for (var i = 0; i < 3; i = (i + 1) | 0) {
				var _tr = createTriangle();
				_tr.rotation.set(rnd() * Math.PI, rnd() * Math.PI, rnd() * Math.PI);
				_tr.position.set(rnd() * 800, rnd() * 400, rnd() * 400);
				_trianglelist.push(_tr);
				_container.add(_tr);
			}
		}

		var len = _trianglelist.length;
		while (len)
		{
			len = (len - 1) | 0;
			var _triangle = _trianglelist[len];
			var _opacity = _triangle.material.opacity;
			_triangle.position.x += _triangle.vector.x;
			_triangle.position.y += _triangle.vector.y;
			_triangle.position.z += _triangle.vector.z;
			_triangle.rotation.x += _triangle.vectorR.x;
			_triangle.rotation.y += _triangle.vectorR.y;
			_triangle.rotation.z += _triangle.vectorR.z;
			_opacity += (0.0 - _opacity) * 0.05;
			if (_opacity < 0.02)
			{
				_trianglelist.splice(len, 1);
				_container.remove(_triangle);
				_triangle.geometry.dispose();
				_triangle.material.dispose();
				_triangle = null;
				continue;
			}
			_triangle.material.opacity = _opacity;
			_triangle.material.needsUpdate = true;
		}



		//	pseudo camera rotation
		_container.rotation.y += 0.002;



		/*
			shader arts
		*/
		_glitch.uniforms[ 'amount' ].value = _dataList[0] * 0.01;
		_glitch.uniforms[ 'angle' ].value = _dataList[1];
		_glitch.uniforms[ 'seed_x' ].value = _dataList[2]*2-1;	//	-1 - 1
		_glitch.uniforms[ 'seed_y' ].value = - _glitch.uniforms[ 'seed_x' ].value;
		_glitch.uniforms[ 'distortion_x' ].value = Math.random()*2-1;
		_glitch.uniforms[ 'distortion_y' ].value = Math.random()*2-1;
		//_glitch.uniforms[ 'distortion_x' ].value = 0;
		//_glitch.uniforms[ 'distortion_y' ].value = 0;
		_glitch.uniforms[ 'col_s' ].value = _dataList[3] * Math.random() * 2;
		//_glitch.uniforms[ 'col_s' ].value = _dataList[3] * 2;

		//	film
		_film.uniforms[ 'nIntensity' ].value = _dataList[8];
		_film.uniforms[ 'sIntensity' ].value = _dataList[9];
		_film.uniforms[ 'sCount' ].value += ( _dataList[10] * 4096 - _film.uniforms[ 'sCount' ].value ) * 0.005;
		_film.uniforms[ 'time' ].value = world.time * 0.1;


		//	HUE and SATURARION
		_hueAndSaturetion.uniforms[ 'hue' ].value += ( _dataList[6] * 2 - 1 - _hueAndSaturetion.uniforms[ 'hue' ].value ) * 0.01;
		_hueAndSaturetion.uniforms[ 'saturation' ].value += ( _dataList[7] * 2 - 1 - _hueAndSaturetion.uniforms[ 'saturation' ].value ) * 0.05;

		//	RGB SHIFT
		_rgbShift.uniforms[ 'amount' ].value = _dataList[14] * 0.05 - 0.025;

		//	FOCUS???
		_focus.uniforms[ 'waveFactor' ].value = _dataList[15] * 0.1;


		//	BadTVShader
		_BadTVShader.uniforms[ 'time' ].value += world.time*0.01 * _dataList[16];
		_BadTVShader.uniforms[ 'distortion' ].value = 3.0 * _dataList[17];
		_BadTVShader.uniforms[ 'distortion2' ].value = 5.0 * _dataList[18];
		_BadTVShader.uniforms[ 'speed' ].value = 0.2 * _dataList[19];
		_BadTVShader.uniforms[ 'rollSpeed' ].value = 0.1 * _dataList[20];


		if( _tfList[0] )
		{
			_glitch.uniforms[ 'amount' ].value = Math.random() * 0.01;
			_glitch.uniforms[ 'angle' ].value = Math.random() * Math.PI;
			_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;	//	-1 - 1
			_glitch.uniforms[ 'seed_y' ].value = - _glitch.uniforms[ 'seed_x' ].value;
			_glitch.uniforms[ 'distortion_x' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'distortion_y' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'col_s' ].value = Math.random() * 2;

			_film.uniforms[ 'nIntensity' ].value = Math.random();
			_film.uniforms[ 'sIntensity' ].value = Math.random();
			_film.uniforms[ 'sCount' ].value = Math.floor( Math.random() * 4096 );

			_hueAndSaturetion.uniforms[ 'hue' ].value = Math.random()*2-1;
			_hueAndSaturetion.uniforms[ 'saturation' ].value = Math.random()*2-1;
			
			_rgbShift.uniforms[ 'amount' ].value = Math.random() * 0.05 - 0.025;
		}

		_composer00.render();


	}

	function createConvex()
	{
		var _vertices = [];
		var _size = 24 * Math.random() * Math.random();
		for( var j = 0; j < 12; j++ )
		{
			_vertices[j] = new THREE.Vector3( rnd()*_size, rnd()*_size, rnd()*_size );
		}
		var _geometry = new THREE.ConvexGeometry( _vertices );
		var _material = new THREE.MeshLambertMaterial({
			color: 0xFFFFFF,
			shading: THREE.FlatShading,
			//specular: 0xFF0000,
			//emissive: 0x001833,
			metal: true
		});
		var _mesh = new THREE.Mesh( _geometry, _material );
		return _mesh;
	}

	function createTriangle()
	{
        var _size = Math.random() * 150 + 50;
        var _geometry = new THREE.Geometry();
        _geometry.vertices[0] = new THREE.Vector3(0, Math.sqrt(3) * .5 * _size, 0);
        _geometry.vertices[1] = new THREE.Vector3(_size * .5, -Math.sqrt(3) * .5 * _size, 0);
        _geometry.vertices[2] = new THREE.Vector3(-_size * .5, -Math.sqrt(3) * .5 * _size, 0);
        var _colors = [];
        _colors[0] = new THREE.Color(Math.random(), Math.random(), Math.random());
        _colors[1] = new THREE.Color(Math.random(), Math.random(), Math.random());
        _colors[2] = new THREE.Color(Math.random(), Math.random(), Math.random());
        //_geometry.faces[0] = new THREE.Face3(0,1,2,null,_colors);
        _geometry.faces[0] = new THREE.Face3(0, 1, 2);
        _geometry.computeFaceNormals();
        var _material = new THREE.MeshBasicMaterial({
            //color: 0xFFFFFF,
            //vertexColors: THREE.VertexColors,
            color: _colors[0],
            side: THREE.DoubleSide,
            transparent: true,
            blending: THREE.AdditiveBlending
        });
        var _triangle = new THREE.Mesh(_geometry, _material);
        _triangle.vector = new THREE.Vector3(rnd() * 10, rnd() * 10, rnd() * 10);
        _triangle.vectorR = new THREE.Vector3(rnd() * Math.PI * .01, rnd() * Math.PI * .01, rnd() * Math.PI * .01);
        return _triangle;
    };

	function rnd()
	{
		return Math.random()*2-1;
	}
})();