/*
	engine.js
*/

(function(){

	var midi;
	var world,_plane;
	var _simplexNoiseX,_simplexNoiseY,_simplexNoiseZ;
	var _convexlist = [];
	var time;

	//	start
	var midi = new midiControl( _midiMessage );

	if( midi )
	{
		console.log( midi );
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
			metal: true
		});
		_plane = new  THREE.Mesh( _geometry, _material );
		_plane.rotation.x = - Math.PI * 0.5;
		_plane.receiveShadow = true;
		world.scene.add( _plane );

		// _plane.material.shininess = 60;
		// _plane.material.specular = 0x9999FF;
		// _plane.material.emissive = 0xFFFFFF;

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
	}

	function createObjects()
	{
		var _geo = new THREE.Geometry();
		for( var i = 0; i < 1000; i++) 
		{
			_geo.vertices.push(new THREE.Vector3(rnd()*200,Math.random()*100,rnd()*40));
		}
		var _mat = new THREE.PointCloudMaterial({
			transparent: true,
			//depthTest: false,
			//map: THREE.ImageUtils.loadTexture( './spark0.png' ),
			color:0xFFFFFF,
			blending:THREE.AdditiveBlending
		});

		_particle = new THREE.PointCloud( _geo, _mat);
		//scene.add( _particle);
	}

	function update()
	{
		var len = _convexlist.length;
		var _scale = midi.getData()[13] * 0.01;
		while( len )
		{
			len = (len-1)|0;
			var _mesh = _convexlist[len];
			var _vertex = _mesh.position;
			_vertex.x = _vertex.x-( (midi.getData()[15]+0.5) * 3);

			var _px = _simplexNoiseX.noise( _vertex.y * _scale, _vertex.z * _scale );
			var _py = _simplexNoiseX.noise( _vertex.x * _scale, _vertex.z * _scale );
			var _pz = _simplexNoiseX.noise( _vertex.x * _scale, _vertex.y * _scale );
			_vertex.x += _px * midi.getData()[16] * 5;
			_vertex.y += _py * midi.getData()[16] * 5 * 2;
			_vertex.z += _pz * midi.getData()[16] * 5 * 2;

			if( _mesh.position.x < -400 )
			{
				world.scene.remove( _mesh );
				_convexlist.splice(len,1);
				_mesh.geometry.dispose();
				_mesh.material.dispose();
			}
		}

		// world._focus.x = Math.sin( time * 0.01 ) * 16;
		// world._focus.y = Math.cos( time * 0.016 ) * 16 + 110;
		// world._focus.z = Math.cos( time * 0.001 ) * 16;

		// world._camera.x = Math.sin( time * 0.01 ) * 90;
		// world._camera.y = Math.cos( time * 0.008 ) * 16 + 100;
		// world._camera.z = Math.cos( time * 0.001 ) * 16+400;

		// world.focus.x += ( world._focus.x - world.focus.x ) * 0.05;
		// world.focus.y += ( world._focus.y - world.focus.y ) * 0.05;
		// world.focus.z += ( world._focus.z - world.focus.z ) * 0.05;
		// world.camera.position.x += ( world._camera.x - world.camera.position.x ) * 0.05;
		// world.camera.position.y += ( world._camera.y - world.camera.position.y ) * 0.05;
		// world.camera.position.z += ( world._camera.z - world.camera.position.z ) * 0.05;

		var _size = 6;
		var len = Math.floor( midi.getData()[13] * 2 );
		for( var i = 0; i < len; i++ )
		{
			var _vertices = [];
			for( var j = 0; j < 12; j = (j+1)|0 )
			{
				_vertices[j] = new THREE.Vector3(rnd()*_size,rnd()*_size,rnd()*_size)
			}
			var _geo = new THREE.ConvexGeometry( _vertices );
			var _mat = new THREE.MeshLambertMaterial({
				ambient: 0x990000,
				shading:THREE.FlatShading
			});
			var _mesh = new THREE.Mesh(_geo,_mat);
			_mesh.castShadow = true;
			world.scene.add( _mesh );
			_mesh.position.set( 400 + Math.random()*200,Math.random()*10+50,rnd()*10);

			_convexlist.push(_mesh);
		}

		// var _color = new THREE.Color(Math.random(),Math.random(),Math.random());
		var _color = new THREE.Color( midi.getData(77), midi.getData(78), midi.getData(79) );
		world.scene.fog.color = _color;
		world.renderer.setClearColor(_color, 1);

		_plane.material.specular = _color;

		_val = midi.getData(84);
		_val = Math.floor( _val * 16 );
		document.getElementById('container').style.webkitFilter = "blur("+_val+"px)";
	}

	function rnd()
	{
		return Math.random()*2-1;
	}
})();