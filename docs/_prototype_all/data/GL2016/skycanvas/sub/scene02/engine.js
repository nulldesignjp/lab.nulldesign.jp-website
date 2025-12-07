/*
	engine.js
*/

window.onload = function(){
	var scene, camera, focus, renderer, controls;
	var light0, light1, light2;
	var _mesh,_fire;
	var _count;
	var width = window.innerWidth;
	var height = window.innerHeight;

	var _accell = 360;
	var _slow = 1.12500;
	var _vx = 0;
	var _vy = 0;
	var _vz = 0;

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( _spaceColor, 1600, 3200 );
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 3200 );
	camera.position.set( 0, 0, 0.25 );
	camera.lookAt( focus );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( _spaceColor );
	renderer.setSize( width, height );
	document.getElementById( 'container' ).appendChild(renderer.domElement);

	light0 = new THREE.AmbientLight( 0x666666 );
	scene.add( light0 );
	light1 = new THREE.DirectionalLight( 0xFFFFFF, 2.0 );
	scene.add( light1 );
	light1.position.set( 1000, 100, 1000 );
	light2 = new THREE.PointLight( 0xFFFFFF, 2.0, 1200 );
	scene.add( light2 );
	light2.position.set( 600, 600, 600 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );

	_count = 0;
	var _colorSet = _colorSet||{
		red: {
			c0: new THREE.Color( 1.0, 0.3, 0.0 ),
			c1: new THREE.Color( 1.0, 0.3, 0.0 ),
			c2: new THREE.Color( 1.0, 0.8, 0.5 )
		},
		green: {
			c0: new THREE.Color( 0.0, 1.0, 0.3 ),
			c1: new THREE.Color( 0.3, 1.0, 0.0 ),
			c2: new THREE.Color( 0.8, 1.0, 0.5 )
		},
		blue: {
			c0: new THREE.Color( 0.0, 0.3, 1.0 ),
			c1: new THREE.Color( 0.0, 0.3, 1.0 ),
			c2: new THREE.Color( 0.5, 0.8, 1.0 )
		},
	}

	var _color = _colorSet.red;
	var _val = Math.random();

	if( _val < 0.33 )
	{
		_color = _colorSet.green;
	} else if( _val > 0.66 )
	{
		_color = _colorSet.blue;
	}



	//
	var _geometry = new THREE.IcosahedronGeometry(  0.0125, 3 );
	var _material = new THREE.MeshStandardMaterial({
		blending: THREE.AdditiveBlending,
		transparent: true,
		roughness: 0.5,
		metalness: 0.5,
		//shading: THREE.FlatShading,
		color: new THREE.Color(0.6, 0.6, 0.6)
	});
	_mesh = new THREE.Mesh( _geometry, _material );
	scene.add( _mesh );

	//	Fire
	var _num = 800;
	var _position = new Float32Array( _num * 3 );
	var _delay = new Float32Array( _num );
	var _geometry = new THREE.BufferGeometry();
	for( var i = 0; i < _num; i++ )
	{
		var _r0 = Math.random() * Math.PI * 2;
		var _r1 = Math.random() * Math.PI * 2;
		var _r =  0.0125;

		var _x = Math.cos( _r1 ) * Math.cos( _r0 ) * _r;
		var _y = Math.sin( _r0 ) * _r;
		var _z = Math.sin( _r1 ) * Math.cos( _r0 ) * _r;

		_position[ i * 3 + 0 ] = _x;
		_position[ i * 3 + 1 ] = _y;
		_position[ i * 3 + 2 ] = _z;

		_delay[i] = Math.random();

	}

	_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );
	_geometry.addAttribute( 'delay', new THREE.BufferAttribute( _delay, 1 ) );

	var _material = new THREE.ShaderMaterial({
		uniforms: {
			"tDiffuse": { type: "t", value: new THREE.TextureLoader().load('circle1.png') },
			"color1": {type: "c", value: _color.c1 },
			"color2": {type: "c", value: _color.c2 },
			"time": { type: "f", value: 0 },
			"scale": { type: "f",value:0.0},
			"scale2": { type: "f",value:1.0}
		},
		vertexShader: [
			"uniform float time;",
			"uniform float scale;",
			"uniform float scale2;",
			"attribute float delay;",
			"varying float vDelay;",
			"void main() {",
				"vDelay = delay;",
				"vec3 pos = position;",
				"float t = mod( vDelay + time, 1.0 );",
				"pos.x *= ( 1.0 - t ) * scale2;",
				"pos.z *= ( 1.0 - t ) * scale2;",
				"pos.y += 0.4 * t * t * scale;",
				//"pos.y *= scale2;",
      			"vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
      			"gl_PointSize = 0.4 * (1.0 - t) * (100.0 / length(mvPosition.xyz)) * scale * scale2;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
			"}"
		].join("\n"),
		fragmentShader: [
			"uniform sampler2D tDiffuse;",
			"uniform vec2 resolution;",
			"uniform vec3 color1;",
			"uniform vec3 color2;",
			"uniform float time;",
			"varying float vDelay;",
			"void main() {",
				"float t = mod( vDelay + time, 1.0 );",
				"vec3 color = color1 + color2 * t;",
				"vec4 img = texture2D( tDiffuse, gl_PointCoord.xy);",
				"gl_FragColor = img * vec4( color, 0.1 );",
			"}"
		].join("\n"),
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	});
	_fire = new THREE.Points( _geometry, _material );
	scene.add( _fire );


	var _material = new THREE.SpriteMaterial({
		blending: THREE.AdditiveBlending,
		transparent: true,
		map: new THREE.TextureLoader().load('Unknown.png')
	});
	var _core = new THREE.Sprite( _material );
	_core.scale.set( 0.01, 0.01, 0.01 )
	scene.add( _core );


	//

	var _num = 1000;
	var _position = new Float32Array( _num * 3 );
	var _delay = new Float32Array( _num );
	var _geometry = new THREE.BufferGeometry();
	for( var i = 0; i < _num; i++ )
	{
		var _x = (Math.random()-.5) * 2;
		var _y = (Math.random()-.5) * 40;
		var _z = (Math.random()-.5) * 2;

		_position[ i * 3 + 0 ] = _x;
		_position[ i * 3 + 1 ] = _y;
		_position[ i * 3 + 2 ] = _z;

	}

	_geometry.addAttribute( 'position', new THREE.BufferAttribute( _position, 3 ) );

	var _material = new THREE.ShaderMaterial({
		uniforms: {
			"tDiffuse": { type: "t", value: new THREE.TextureLoader().load('circle1.png') },
			"color1": {type: "c", value: _color.c1 },
			"color2": {type: "c", value: _color.c2 },
			"time": { type: "f", value: 0 },
			"size": { type: "f", value: 0.0 },
		},
		vertexShader: [
			"uniform float time;",
			"uniform float size;",
			"void main() {",
				"vec3 pos = position;",
				"pos.y += time * 2.0;",
				"pos.y = pos.y>10.0?pos.y-10.0:pos.y;",
      			"vec4 mvPosition = modelViewMatrix * vec4( pos, 1.0 );",
      			"gl_PointSize = 0.05 * (100.0 / length(mvPosition.xyz)) * size;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
			"}"
		].join("\n"),
		fragmentShader: [
			"uniform sampler2D tDiffuse;",
			"uniform float time;",
			"void main() {",
				"vec4 img = texture2D( tDiffuse, gl_PointCoord.xy);",
				"gl_FragColor = img;",
			"}"
		].join("\n"),
		blending: THREE.AdditiveBlending,
		transparent: true,
		depthWrite: false
	});
	var _particles = new THREE.Points( _geometry, _material );
	scene.add( _particles );

	_mesh.rotation.z = Math.PI * 0.375;
	_fire.rotation.z = Math.PI * 0.375;
	_particles.rotation.z = Math.PI * 0.375;



	//	STAR
	var _geometry = new THREE.Geometry();
	for( var i = 0; i < 10000; i++ )
	{
		_geometry.vertices[i] = new THREE.Vector3((Math.random()-.5) * 500,(Math.random()-.5) * 500,(Math.random()-.5) * 500);
	}
	var _material = new THREE.PointsMaterial({
		map: new THREE.TextureLoader().load('circle1.png'),
		transparent: true,
		size: 1,
		depthWrite: false
	});
	_particle = new THREE.Points( _geometry, _material );
	scene.add( _particle );


	intro();
	render();
	window.onresize = resize;


	window.addEventListener( 'keydown', _throw );
	function _throw( e ){

		console.log( e.keyCode );
		if( e.keyCode == 51 )
		{
			//	goto scene01
			location.href = "../scene01/index.html";
		} else if( e.keyCode == 50 )
		{
			//	goto scene01
			location.href = "../scene01/index.html#fromScene02";
		} else if( e.keyCode == 49 ){
			//	goto scene02
			location.href = "../scene02/index.html";
		}
	}

	document.getElementById('container').className = 'show';

	function intro()
	{
		//	演出のより	4s
		camera.position.set( 100, 1000, 100 );
		setTimeout( function(){
			//	加熱開始
			//	2S
			TweenMax.to( _mesh.material.color, 2.0, {
				r: _color.c0.r,
				g: _color.c0.g,
				b: _color.c0.b
			});
			TweenMax.to( _core.material.color, 2.0, {
				r: _color.c0.r,
				g: _color.c0.g,
				b: _color.c0.b
			});


			TweenMax.to( _fire.material.uniforms.scale, 2.0, { value:1.0, delay: 0.5 });


			TweenMax.to( _particles.material.uniforms.size, 2.0, { value: 1.0 } );

			TweenMax.to( _core.scale, 5.0, { x:0.36, y:0.36,z:0.36 });
			//	燃焼開始/縮小開始
			//	5s
			setTimeout( function(){
				//	キラりんこ
				_core.material.map = new THREE.TextureLoader().load('Unknown1.png',function(){
					_core.scale.set(0.01, 0.01, 0.01 );
					TweenMax.to( _core.scale, 1.0, { x:0.36, y:0.36,z:0.36 });
				});
				TweenMax.to( _mesh.material.color, 2.0, {r: 1,g: 1,b: 1});

			},2000);

			setTimeout( function(){

				//	1s で流星源は消滅
				_core.material.color = new THREE.Color(1,1,1)
				_core.scale.set(0.5,0.5,0.5);

				var _duration = 0.8;
				TweenMax.to( _core.scale, _duration, { x:0.01, y:0.01,z:0.01,onComplete:function(){
					_core.visible = false;
				}});
				TweenMax.to( _mesh.scale, _duration, { x:0.01, y:0.01,z:0.01,onComplete:function(){
					_mesh.visible = false;
				}});

				TweenMax.to( _fire.material.uniforms.scale2, _duration, { value:0.00});

				//???
				TweenMax.to( _core.position, _duration, { x: -0.01, y: 0.005 });
				TweenMax.to( _mesh.position, _duration, { x: -0.01, y: 0.005 });
				TweenMax.to( _fire.position, _duration, { x: -0.01, y: 0.005 });


				TweenMax.to( _particles.material.uniforms.size, _duration * 3, { value: 0.0 } );


				setTimeout(function(){

					//	流星の表現終了。画面状態を初期に戻す
					document.getElementById('container').className = 'restView';
					setTimeout( function(){
						location.href = "../scene01/index.html";
					}, 1000 + _displayTime );
				},3000)

			},4000);

		}, 6000);
	}

	function render()
	{
		window.requestAnimationFrame(render);
		_count += 1 / 60;	
		_fire.material.uniforms.time.value = _count;

		_particles.material.uniforms.time.value += 1/60;


		var _tp = new THREE.Vector3( 100, 1000, 100 );
		if( _count > 1 )
		{
			_tp.x = 0;
			_tp.y = 0;
			_tp.z = 0.25;
		}

		if( _count > 8 )
		{
			_tp.x = _count - 8;
			_tp.x *= 0.1;
			_tp.x = _tp.x>0.25?0.25:_tp.x;
		}

		_vx = ( _vx + ( _tp.x - camera.position.x ) / _accell ) / _slow;
		_vy = ( _vy + ( _tp.y - camera.position.y ) / _accell ) / _slow;
		_vz = ( _vz + ( _tp.z - camera.position.z ) / _accell ) / _slow;

		camera.position.x += _vx;
		camera.position.y += _vy;
		camera.position.z += _vz;


		_particle.rotation.x += 0.00025;
		_particle.rotation.y += 0.00025;
		_particle.rotation.z += 0.00025;



		//	render
		controls.update();
		camera.lookAt( focus );
		renderer.render( scene, camera );
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