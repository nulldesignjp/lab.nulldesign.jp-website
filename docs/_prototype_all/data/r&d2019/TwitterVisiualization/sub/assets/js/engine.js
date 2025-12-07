/*
	engine.js
*/
window.onload = (function(){

	var _entries = 16;
	var _scale = 0.3;

	var toggle = 0;
	var clock = new THREE.Clock();

	var _mouse, _fcusIndex;
	var _world,_camera,_scene;
	var  _particles, _grid, _line, _points, _masterGeometry;
	var _noise;

	var _domList = [];




	//	Start
	Start();

	//	EventListener
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	document.addEventListener( 'mousedown', onDocumentMouseClick, false );

	//	LOOP	
	(function _loop(){
		window.requestAnimationFrame(_loop);
		Update();
	})();



	/*
		Functions
	*/
	function Start()
	{
		_world = new world('webglView');
		_camera = _world.camera;
		_scene = _world.scene;
		_mouse = {x:0,y:0};
		_noise = new SimplexNoise();

		/*
			GRID
		*/
		_grid = new THREE.GridHelper( 10, 50 );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.2;
		_world.add( _grid );


		/*
			Main
		*/
		_masterGeometry = new THREE.Geometry();
		var _material = new THREE.PointsMaterial({
			map: new THREE.TextureLoader().load('assets/img/spark1.png'),
			color: 0xe55e1b,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent : true,
			opacity: 0.75,
			//size: 0.05,
			size: 0.25
		});
		_particles = new THREE.Points( _masterGeometry, _material );
		_world.add( _particles );

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < _entries; i++ ){
			_geometry.vertices[i] = new THREE.Vector3();
			_geometry.vertices[i].x = ( Math.random() - 0.5 ) * 5;
			_geometry.vertices[i].z = ( Math.random() - 0.5 ) * 5;
			_geometry.vertices[i].y = _noise.noise( _geometry.vertices[i].x * _scale, _geometry.vertices[i].z * _scale ) * 5;
		}
		var _material = new THREE.PointsMaterial({
			map: new THREE.TextureLoader().load('assets/img/circle1.png'),
			color: 0x18d1db,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent : true,
			size: 0.5,
			//opacity: 0.75
		});
		_points = new THREE.Points( _geometry, _material );
		_world.add( _points );

		var _Lmaterial = new THREE.LineBasicMaterial({
			color: 0xFFFFFF,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			transparent : true,
			//size: 1,
			//opacity: 0.5,
			vertexColors: THREE.VertexColors
		});
		_line = new THREE.LineSegments( _geometry, _Lmaterial );
		_world.add( _line );


		//	DOM
		var len = _points.geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _div = $('<div>').addClass('cell');
			var _h2 = $('<h2>');
			var _p = $('<p>');
			var _a= $('<a>').attr('href',"javascript:void(0);");
			_div.append( _a );
			_a.append( _h2 );
			_a.append( _p );

			_h2.text("mention keyword " + i);
			_p.text("1,234,567,890");

			$('body').append( _div );
			_domList.push( _div );
		}
	}
	function Update()
	{
		var _time = new Date().getTime() * 0.0000125;
		var _geometry = _points.geometry;
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i].y = _noise.noise( _geometry.vertices[i].x * _scale + _time, _geometry.vertices[i].z * _scale ) * 0.5
			 + _noise.noise( _geometry.vertices[i].x * _scale * 2.0, _geometry.vertices[i].z * _scale * 2.0 + _time * 3.0 ) * 0.125;

		}
		_geometry.verticesNeedUpdate = true;

		var _power = 0.5;
		var __scale = 4.0;
		var _geometry = _particles.geometry;
		var len = _geometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i].x += _noise.noise( _geometry.vertices[i].y * __scale + _time * 10.0, _geometry.vertices[i].z * __scale ) * 0.0125 * _power;
			_geometry.vertices[i].y += _noise.noise( _geometry.vertices[i].z * __scale + _time * 10.0, _geometry.vertices[i].x * __scale ) * 0.0125 * _power;
			_geometry.vertices[i].z += _noise.noise( _geometry.vertices[i].x * __scale + _time * 10.0, _geometry.vertices[i].y * __scale ) * 0.0125 * _power;
			_geometry.vertices[i].y += 0.008;
		}
		_geometry.verticesNeedUpdate = true;


		var len = _points.geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _vertex = _points.geometry.vertices[i];
			var _div = _domList[i];

			var _pos = _world.getWorldToScreen2DV( _vertex);

			_pos.x = Math.floor( _pos.x );
			_pos.y = Math.floor( _pos.y );

			_div.css({
				'left': _pos.x + 'px',
				'top': _pos.y + 'px'
			});
		}


		generateLineSegments();
	}

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			hitTest();
	}

	function onDocumentMouseClick( event ) {
		event.preventDefault();
		_mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		_mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
		//hitTest();

		var strMime = "image/jpeg";
		var imgData = _world.renderer.domElement.toDataURL(strMime);

	    //	window.open( imgData, null );

    	

	}

	function hitTest()
	{
		var raycaster = new THREE.Raycaster();
		raycaster.params.Points.threshold = 0.025;
		raycaster.setFromCamera( _mouse, _camera );
		var intersections = raycaster.intersectObjects( [_points], true );
		intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;

		if ( toggle > 0.02 && intersection !== null)
		{
			console.log( intersection );
			_fcusIndex = intersection.index;
			toggle = 0;

			generateParticles( intersection.point );


		}
		toggle += clock.getDelta();

	}

	function generateParticles( _p ){
		var _scale = 0.0125;
		var _geometry = new THREE.Geometry();
		var len = _masterGeometry.vertices.length;
		for( var i = 0; i < len; i++ ){
			_geometry.vertices[i] = _masterGeometry.vertices[i];
		}
		for( var i = 0; i < 100; i++ ){
			var _v = new THREE.Vector3();
			var _rad = Math.random() * Math.PI * 2.0;
			var _radius = Math.random() * 8.0;
			_v.x = Math.cos( _rad ) * _radius * _scale;
			_v.y = ( Math.random() - 0.5 ) * 1.0 * _scale;
			_v.z = Math.sin( _rad ) * _radius * _scale;
			_v.x += _p.x;
			_v.y += _p.y;
			_v.z += _p.z;
			_geometry.vertices.push( _v );
		}
		_masterGeometry = _geometry;

		_particles.geometry = _geometry;


	}

	function generateLineSegments(){
		var _max = 1.6;

		var _geometry = new THREE.BufferGeometry();
		var _vList = [];
		var _cList = [];
		var _vertices = _points.geometry.vertices;
		var len = _vertices.length;
		for( var i = 0; i < len - 1; i++ ){
			for( var j = i + 1; j < len; j++ ){
				var _v0 = _vertices[i];
				var _v1 = _vertices[j];
				var _sub = new THREE.Vector3().subVectors( _v0, _v1 );
				var _dist = _sub.length();
				if( _dist < _max ){

					_vList.push( _v0.x, _v0.y, _v0.z );
					_vList.push( _v1.x, _v1.y, _v1.z );

					var _opacity = 1.0 - _dist / _max;
					var _color = new THREE.Color( _opacity,_opacity,_opacity );
					_cList.push( _color.r, _color.g, _color.b );
					_cList.push( _color.r, _color.g, _color.b );

				}
			}
		}

		_geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( _vList, 3 ) );
		_geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( _cList, 3 ) );
		_line.geometry = _geometry;

	}


})();
