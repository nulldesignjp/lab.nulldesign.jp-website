/*
	engine.js
*/

window.onload = function(){
	var scene, camera, focus, renderer, controls;
	var light0, light1, light2;
	var earth, particles;
	var box0, box1;
	var _r0 = Math.random() * Math.PI * 2;
	var _r1 = Math.random() * Math.PI * 2;
	var width = window.innerWidth;
	var height = window.innerHeight;

	var _lines = [];
	var _delay = [];
	var _particles = [];
	var _edges = [];
	var _particle;
	var _count = 0;
	var _pNums = 16;
	var _segmentNum = 1024;

	var _length = 50;
	var _pseudoHeight = 10;

	var _vx = 0;
	var _vy = 0;
	var _vz = 0;

	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0x080818, 1600, 3200 );
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 3200 );
	camera.position.set( 0, 0, 0 );
	camera.lookAt( focus );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x080818 );
	renderer.setSize( width, height );
	document.getElementById( 'container' ).appendChild(renderer.domElement);

	light0 = new THREE.AmbientLight( 0x666666 );
	scene.add( light0 );
	light1 = new THREE.DirectionalLight( 0xFFFFFF, 2.0 );
	scene.add( light1 );
	light1.position.set( 1000, 0, 1000 );
	light2 = new THREE.PointLight( 0xFFFFFF, 2.0, 1200 );
	scene.add( light2 );
	light2.position.set( 600, 0, 600 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	//	earth
	var _geometry = new THREE.IcosahedronGeometry( 100, 6 );
	var _material = new THREE.MeshStandardMaterial({
		map: new THREE.TextureLoader().load('world-map-satellite-day-nasa-earth_8192.jpg'),
		roughness: 0.5,
		metalness: 0.1
	});
	earth = new THREE.Mesh( _geometry, _material );
	scene.add( earth );

	//	cloud
	var _geometry = new THREE.IcosahedronGeometry( 100.5, 6 );
	var _material = new THREE.MeshPhongMaterial({
		blending: THREE.AdditiveBlending,
		map: new THREE.TextureLoader().load('earth_clouds_2048.png'),
		transparent: true,
		opacity: 0.5
	});
	var cloud = new THREE.Mesh( _geometry, _material );
	scene.add( cloud );

	//	air
	var _geometry = new THREE.IcosahedronGeometry( 100.5, 6 );
	var _material = new THREE.MeshPhongMaterial({
		blending: THREE.AdditiveBlending,
		//side: THREE.BackSide,
		transparent: true,
		opacity: 0.125,
		color: 0x006699,
		depthWrite: true
	});
	var air = new THREE.Mesh( _geometry, _material );
	scene.add( air );

	//	moon
	// var _r = 1737 * 100 / 6370;	//	半径
	// var _moonR = 384400 * 100 / 6370;	//	半径
	// var _geometry = new THREE.IcosahedronGeometry( _r, 1 );
	// var _material = new THREE.MeshPhongMaterial({
	// 	//map: new THREE.TextureLoader().load('moon_1024.jpg'),
	// 	color: 0xFF0000
	// });
	// var moon = new THREE.Mesh( _geometry, _material );
	// scene.add( moon );
	// moon.position.x = _moonR;


	//	ship
	var _geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var _material = new THREE.MeshBasicMaterial({
		color: 0x000000
	});
	box0 = new THREE.Mesh( _geometry, _material );
	//scene.add( box0 );

	var _loader = new THREE.JSONLoader();
	_loader.load('untitled.json', function( _geometry, _materials){
		//var _material = _materials[0];


		var _material = new THREE.MeshPhongMaterial({
			shading: THREE.FlatShading,
			//vertexColors: THREE.VertexColors,
			color: 0x0d6b76
		});

		box0 = new THREE.Mesh( _geometry, _material );
		scene.add( box0 );

		box0.scale.set( 0.125, 0.125, 0.125 );

		var _eh = new THREE.EdgesHelper( box0, 0xFF6666, 0.8 );
		scene.add( _eh );
	})

	//
	var _geometry = new THREE.Geometry();
	for( var i = 0; i < 10000; i++ )
	{
		_geometry.vertices[i] = new THREE.Vector3((Math.random()-.5) * 1000,(Math.random()-.5) * 1000,(Math.random()-.5) * 1000);
	}
	var _material = new THREE.PointsMaterial({
		map: new THREE.TextureLoader().load('circle1.png'),
		transparent: true,
		size: 1,
		depthWrite: false
	});
	_particle = new THREE.Points( _geometry, _material );
	scene.add( _particle );

	render();
	window.onresize = resize;


	window.addEventListener( 'touchend', _throw );
	window.addEventListener( 'keydown', _throw );
	function _throw( e )
	{
		var _startPos = box0.position;
		var _endPos = new THREE.Vector3();
		
		_resetLines();

		//	create
		for( var j = 0; j < _pNums; j++ )
		{
			var _dvalue = Math.floor( Math.random() * 60 * 3 );

			(function( j, _dvalue ){
				setTimeout(function(){
					_startPos = box0.position;
					//	PARTICLE
					var _geometry = new THREE.IcosahedronGeometry( 0.0125, 1 );
					var _material = new THREE.MeshPhongMaterial({
						transparent: true,
						opacity: 1.0,
						shading: THREE.FlatShading
					});
					var _mesh = new THREE.Mesh( _geometry, _material );
					scene.add( _mesh );
					_particles.push( _mesh )

					//	LINE
					var _rad = Math.random() * Math.PI * 2;
					var _rx = Math.cos( _rad ) * Math.random() * 0.025;
					var _ry = Math.sin( _rad ) * Math.random() * 0.025;
					var _r0 = 3.14 * 0.25 + _rx - 0.16;
					var _r1 = 3.14 * 0.25 + _ry - 0.09;
					var _r = 100 / 6370 * ( 6370 + 550 );

					var _x = Math.cos( _r1 ) * Math.cos( _r0 ) * _r;
					var _y = Math.sin( _r0 ) * _r;
					var _z = Math.sin( _r1 ) * Math.cos( _r0 ) * _r;

					_endPos.x = _x;
					_endPos.y = _y;
					_endPos.z = _z;

					var _max = 100 / 6370 * ( 6370 + 550 );
					var _min = 100 / 6370 * ( 6370 + 60 );
					var _pointlist = getOrbitPoints( _startPos, _endPos, _segmentNum );
					var len =_pointlist.length;
					var _geometry = new THREE.Geometry();
					for( var i = 0; i < len; i++ )
					{
						var _pos = _pointlist[i];
						var _par = easeInExpo( i / ( len - 1 ), _max, _min - _max, 1.0 );

						_pos.normalize().multiplyScalar( _par );

						_geometry.vertices[i] = _pos;
					}

					var _material = new THREE.LineBasicMaterial({
						blending: THREE.AdditiveBlending,
						linewidth: 1,
						color: 0x00FF00,
						transparent: true,
						opacity: .1
					});
					var _line = new THREE.Line( _geometry, _material );
					earth.add( _line );
					_lines.push( _line );
					_delay.push( _dvalue );

				}, 1000 / _dvalue);

			})( j, _dvalue );
		}

		_count = 0;
		_length = 3;
	};　

	function render()
	{
		window.requestAnimationFrame(render);

		_r0 += 0.001;
		//_r1 += 0.0001


		//var _r = 150;
		var _r = 100 / 6370 * ( 6370 + 550 );
		var _x = Math.cos( _r1 ) * Math.cos( _r0 ) * _r;
		var _y = Math.sin( _r0 ) * _r;
		var _z = Math.cos( _r0 ) * Math.sin( _r1 ) * _r;

		box0.position.set( _x, _y, _z );

		var _d = new THREE.Vector3().subVectors( camera.position, box0.position );

		var _dist = _d.normalize().multiplyScalar( _r );
		var _v = new THREE.Vector3().addVectors( box0.position, _dist );

		box0.rotation.x = _r0;
		box0.rotation.y = _r1;

		var _min = 100 / 6370 * ( 6370 + 60 );
		var _max = 100 / 6370 * ( 6370 + 80 );
		var _duration = _max - _min;

		if( _lines.length > 0 )
		{
			var len = _lines.length;
			while( len )
			{
				len --;
				var _index = ( _count + _segmentNum - _delay[len]) % _segmentNum;
				_particles[len].position.copy( _lines[len].geometry.vertices[ _index ] );

				_particles[len].rotation.x += 0.01;
				_particles[len].rotation.y += 0.01;
				_particles[len].rotation.z += 0.01;

				//	banish
				var _start = _segmentNum - 250;
				var _end = _segmentNum - 50;

				var _opacity = 1.0;
				var _scale = 1.0;
				if( _index > _start )
				{
					if( _index > _end )
					{
						_opacity = 0.0;
						scale = 0.0;
					} else {
						_opacity = 1.0 - ( _index - _start ) / ( _end - _start );
						_scale = _opacity;
					}
				}

				_particles[len].scale.set( _scale, _scale, _scale );
				_particles[len].material.opacity = _opacity;


				var _colorR = 1.0;
				var _colorG = easeOutExpo( 1.0 - _scale, 1.0, -0.8, 1.0 );
				var _colorB = easeOutExpo( 1.0 - _scale, 1.0, -1.0, 1.0 );
				_particles[len].material.color = new THREE.Color( _colorR, _colorG, _colorB );

				_pseudoHeight = 5 * _count / _segmentNum + 5.0;
				//_length = 4.0 + ( _count / _segmentNum ) * 10.0;




				//	particle
				for( var k = 0; k < 16; k++ )
				{
					var _p = new THREE.Vector3().copy( _lines[len].geometry.vertices[ _index ] );

					_p.x += ( Math.random() - .5 ) * 0.1;
					_p.y += ( Math.random() - .5 ) * 0.1;
					_p.z += ( Math.random() - .5 ) * 0.1;

					_particle.geometry.vertices.push( _p );
				}

			}

		}
		_particle.geometry.verticesNeedUpdate = true;


		//	FOCUS
		if( _count - _delay[0] > _segmentNum || _lines.length == 0 )
		{
			//	
			focus.copy( box0.position );
			_length = 50;
			_pseudoHeight = 10.0;

			_resetLines();

		} else {
			var _index = _count - _delay[0];
			_index = _index<0?0:_index;
			focus.copy( _lines[0].geometry.vertices[ _index ] );
		}


		var _dist = new THREE.Vector3().subVectors( camera.position, focus );
		_dist.normalize().multiplyScalar( _length );


		//	set camera pos and easeing
		var _newPoistion = new THREE.Vector3().addVectors( focus, _dist );

		var _slow = 1.045000;
		var _accell = 700.0;
		_vx = ( _vx + ( _newPoistion.x - camera.position.x ) / _accell ) / _slow;
		_vy = ( _vy + ( _newPoistion.y - camera.position.y ) / _accell ) / _slow;
		_vz = ( _vz + ( _newPoistion.z - camera.position.z ) / _accell ) / _slow;

		camera.position.x += _vx;
		camera.position.y += _vy;
		camera.position.z += _vz;




		//	dynamic can pos
		var _par = 1.0;
		if( _lines.length )
		{
			_par = _count / _segmentNum;
			_par = _par < 0?0:_par > 1?1:_par;
		}
		_r = 1.0 + ( _r - 1.0 ) * _par;


		var _h = _r + _pseudoHeight;
		if( camera.position.length() < _h )
		{
			camera.position.normalize().multiplyScalar( _h );
		}

		_count ++;

		//	render
		controls.update();
		camera.lookAt( focus );
		renderer.render( scene, camera );
	}

	function _resetLines()
	{
		//	LINE
		var len = _lines.length;
		while( len )
		{
			len --;
			var _l = _lines[len];
			earth.remove( _l );
			_l = null;
		}

		//	PARTICLE
		var len = _particles.length;
		while( len )
		{
			len --;
			var _l = _particles[len];
			scene.remove( _l );
			_l = null;
		}

		//	EDGE
		var len = _edges.length;
		while( len )
		{
			len --;
			var _l = _edges[len];
			scene.remove( _l );
			_l = null;
		}

		//
		_particles = [];
		_edges = [];
		_lines = [];
		_delay = [];
	}



	/**
	 * 緯度経度から位置を算出します
	 * @param {number} latitude 緯度
	 * @param {number} longitude 経度
	 * @param {number} radius 半径
	 * @returns {THREE.Vector3} 位置
	 */
	function translateGeoCoords(latitude, longitude, radius) {
		// 仰角
		var phi = (latitude) * Math.PI / 180;
		// 方位角
		var theta = (longitude - 180) * Math.PI / 180;

		var x = -(radius) * Math.cos(phi) * Math.cos(theta);
		var y = (radius) * Math.sin(phi);
		var z = (radius) * Math.cos(phi) * Math.sin(theta);

		return new THREE.Vector3(x, y, z);
	}

	/**
	* 軌道の座標を配列で返します
	* @param {THREE.Vector3} startPos 開始点
	* @param {THREE.Vector3} endPos 終了点
	* @param {number} segmentNum 頂点の数 (線のなめらかさ)
	* @returns {THREE.Vector3[]} 軌跡座標の配列
	*/
	function getOrbitPoints(startPos, endPos, segmentNum) {

		// 頂点を格納する配列
		var vertices = [];
		var startVec = startPos.clone();
		var endVec = endPos.clone();

		// ２つのベクトルの回転軸
		var axis = startVec.clone().cross(endVec);
		// 軸ベクトルを単位ベクトルに
		axis.normalize();

		// ２つのベクトルのなす角度
		var angle = startVec.angleTo(endVec);

		// ２つの点を結ぶ弧を描くための頂点を打つ
		for (var i = 0; i < segmentNum; i++)
		{
		// axisを軸としたクォータニオンを生成
		var q = new THREE.Quaternion();
		q.setFromAxisAngle(axis, angle / segmentNum * i);
		// ベクトルを回転させる
		var vertex = startVec.clone().applyQuaternion(q);
		vertices.push(vertex);
		}
		// 終了点を追加
		vertices.push(endVec);

		return vertices;
	}
	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize( width, height );
		if( camera.aspect )
		{
			camera.aspect = width / height;
		} else {
			camera.left = - width * 0.5;
			camera.right = width * 0.5;
			camera.bottom = - height * 0.5;
			camera.top = height * 0.5;
		}
		
		camera.updateProjectionMatrix();
	}

	function easeInBack(t,b,c,d)
	{
		var s = 1.70158;
		return c*(t/=d)*t*((s+1)*t - s) + b;
	}
	function easeInExpo(t,b,c,d)
	{
		return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
	}
	function easeOutExpo(t,b,c,d)
	{
		return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
	}
	function easeInQuad(t,b,c,d)
	{
		return c*(t/=d)*t + b;
	}


};