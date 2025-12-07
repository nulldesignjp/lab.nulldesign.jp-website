/*
	engine.js
*/

var _earthThreeRadius = 100;	//	Three.js での地球半径サイズ（px
var _earthRadius = 6370;		//	地球半径（km
var _satelliteHeight = 550;		//	衛星高度（km

function linePtc( _start, _end, _scene ){

	this.start = _start;
	this.end = _end;
	this.scene = _scene;

	this.dir = Math.floor( Math.random() * 3 ) / 3;
	this.count = 0;
	this.line;
	this.particle;
	this.sprite;
	this.spriteLine;

	this.animationKey;

	this.init();
	this.update();
}

linePtc.segmentNum = _meteorSegment;
linePtc.texture = new THREE.TextureLoader().load('Unknown.png');

linePtc.prototype = {
	init : function(){
		//	流星
		var _geometry = new THREE.IcosahedronGeometry( _meteorSize, 1 );
		var _material = new THREE.MeshPhongMaterial({
			color: _meteorColor,
			//blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 1.0,
			shading: THREE.FlatShading
		});
		this.particle = new THREE.Mesh( _geometry, _material );
		this.scene.add( this.particle );

		//	流星軌道
		var _max = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight );
		var _min = _earthThreeRadius / _earthRadius * ( _earthRadius + 60 );
		var _pointlist = getOrbitPoints( this.start, this.end, linePtc.segmentNum );
		var _randomHeight = - Math.random() * 0.04 + 0.02;
		var len =_pointlist.length;
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < len; i++ )
		{
			var _pos = _pointlist[i];
			var _par = easeInQuad( i / ( len - 1 ), _max, _min - _max, 1.0 );
			_pos.normalize().multiplyScalar( _par );
			_geometry.vertices[i] = _pos;
		}

		var _material = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			linewidth: 1,
			color: _meteorLineColor,
			transparent: true,
			opacity: 0.0
		});
		this.line = new THREE.Line( _geometry, _material );
		this.scene.add( this.line );

		//	intro
		this.particle.scale.set( 0.01, 0.01, 0.01 );
		TweenMax.to( this.line.material, 2.0, {opacity: _meteorLineOpacity});
		TweenMax.to( this.particle.scale, 1.0, {x:1,y:1,z:1});

		//	燃焼表現
		var _material = new THREE.SpriteMaterial({
			blending: THREE.AdditiveBlending,
			map: linePtc.texture,
			transparent: true,
			rotation: Math.random() * Math.PI,
			fog: true
		});
		this.sprite = new THREE.Sprite( _material );
		this.particle.add( this.sprite );

		var _scale = 0.01;
		this.sprite.scale.set( _scale, _scale, _scale );

		// //	流星の尻尾
		// var len = 16;
		// var _geometry = new THREE.Geometry();
		// for( var i = 0; i < len; i++ )
		// {
		// 	_geometry.vertices[i] = new THREE.Vector3();
		// }
		// var _material = new THREE.LineBasicMaterial({
		// 	transparent: true,
		// 	opacity: 0.5,
		// 	linewidth: 1
		// });
		// this.spriteLine = new THREE.Line( _geometry, _material );
		// this.particle.add( this.spriteLine );
	},
	update : function(){
		var _t = this;

		this.animationKey = window.requestAnimationFrame( function(){	_t.update();	} );

		var _index = this.count;
		_index = _index>linePtc.segmentNum?linePtc.segmentNum:_index;

		this.particle.position.copy( this.line.geometry.vertices[ _index ] );

		//	消滅処理
		var _start = linePtc.segmentNum - _meteorElaseStartValue;
		var _end = linePtc.segmentNum - _meteorElaseEndValue;

		var _scale = 1.0;
		if( _index > _start )
		{
			if( _index > _end )
			{
				_scale = 0.0001;
			} else {
				_scale = 1.0 - ( _index - _start ) / ( _end - _start );
			}
		}

		this.particle.scale.set( _scale, _scale, _scale );
		this.particle.geometry.verticesNeedUpdate = true;

		//	空気との摩擦による燃焼表現
		var _colorR = 1.0;
		var _colorG = easeOutExpo( 1.0 - _scale, 1.0, -0.8, 1.0 );
		var _colorB = easeOutExpo( 1.0 - _scale, 1.0, -1.0, 1.0 );
		var _color = new THREE.Color( 1.0 - _colorR, 1.0 - _colorG, 1.0 - _colorB );
		//this.particle.material.color = _color;

		//	燃焼表現
		var _hsl = _color.getHSL()
		_color = _color.setHSL( _hsl.h + this.dir, _hsl.s, _hsl.l );
		this.sprite.material.color = _color;
		var _scale = ( 1.0 - _scale ) * _meteorSparkSize + 0.0001;
		this.sprite.scale.set( _scale, _scale, _scale );

		//	尻尾
		// var len = this.spriteLine.geometry.vertices.length;
		// for( var i = 0; i < len; i++ )
		// {
		// 	var _index = this.count - i;
		// 	_index = _index<0?0:_index;
		// 	this.spriteLine.geometry.vertices[i].subVectors( this.line.geometry.vertices[ _index ], this.line.geometry.vertices[ this.count ] );
		// }
		// this.spriteLine.geometry.verticesNeedUpdate = true;

		this.count ++;

		//	非表示処理
		if( this.count == linePtc.segmentNum - 100 )
		{
			TweenMax.to( this.line.material, 0.5, { opacity: 0 } );
		}
		if( this.count > linePtc.segmentNum )
		{
			this.particle.visible = false;
			this.line.visible = false;
			this.sprite.visible = false;
		}
	},
	kill : function(){

		window.cancelAnimationFrame( this.animationKey );

		this.particle.remove( this.sprite );
		this.sprite = null;

		this.particle.remove( this.spriteLine );
		this.spriteLine = null;

		this.scene.remove( this.particle );
		this.particle = null;

		this.scene.remove( this.line );
		this.line = null;

		this.start = null;
		this.end = null;
		this.scene = null;
	}
}

window.onload = function(){
	var width = window.innerWidth;
	var height = window.innerHeight;

	var scene, camera, focus, renderer, controls;
	var light0, light1, light2;
	var earth,cloud,air,course,_particle,box0;
	var _earthTexture,_cloudTexture;
	var _r0 = Math.random() * Math.PI * 2;
	var _r1 = Math.random() * Math.PI * 2;

	var _lines = [];
	var _pNums = _meteorNums;	//	射出流星源数
	var _sec = _meteorDuration;		//	流星滞空時間
	var _length = 20;	//	カメラと焦点の距離
	var _angleSpeed = 0.05;	//	カメラの回転スピード（謎
	var _cameraPosTop = 200;	//	衛星からカメラまでの高度
	var _cameraPosTopTarget = 200;

	/*
		_phase:
			0 ->	俯瞰モード
			1 ->	流星源射出開始
			2 ->	特定流星源追跡
	*/
	var _phase = 0;


	//	カメラ移動速度	
	var _vx = 0;
	var _vy = 0;
	var _vz = 0;

	//	contents start
	start();

	console.log( location.hash )
	if( location.hash == '#fromScene02' )
	{
		var _evt = {};
		_evt.keyCode = 50;

		_throw( _evt );
	}


	function start(){
		//	preload and start
		var _ldr = new THREE.TextureLoader();
		_ldr.load('world-map-satellite-day-nasa-earth_8192.jpg', function(texture){

			_earthTexture = texture;

			var _ldrCloud = new THREE.TextureLoader();
			_ldrCloud.load('earth_clouds_2048.png', function(texture){

				_cloudTexture = texture;

				//	コンテンツスタート
				init();
				setUp();
				render();
				window.onresize = resize;
				window.addEventListener( 'keydown', _throw );

				document.getElementById('preload').className = '';

				setTimeout( function(){
					document.getElementById('preload').className = 'hide';
				}, 1000 );
				setTimeout( function(){
					document.getElementById('container').className = 'show';
				}, 2000 );
			});
		});
	}

	function init(){
		//	基本設定と初期化
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( _spaceColor, 1600, 3200 );
		focus = new THREE.Vector3();

		camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 3200 );
		camera.position.set( 0, 0, 0 );
		camera.lookAt( focus );
		scene.add( camera );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor( _spaceColor );
		renderer.setSize( width, height );
		document.getElementById( 'container' ).appendChild(renderer.domElement);

		//	ライティング
		light0 = new THREE.AmbientLight( 0xCCCCCC );
		scene.add( light0 );
		light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
		scene.add( light1 );
		light1.position.set( 1000, 0, 1000 );
		// light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		// scene.add( light2 );
		// light2.position.set( 600, 0, 600 );

		//	コントロール
		controls = new THREE.OrbitControls( camera, renderer.domElement );
	}

	function setUp(){
		//	earth
		var _geometry = new THREE.IcosahedronGeometry( _earthThreeRadius, 6 );
		var _material = new THREE.MeshStandardMaterial({
			blending: THREE.AdditiveBlending,
			map: _earthTexture,
			roughness: 0.5,
			metalness: 0.1
		});
		earth = new THREE.Mesh( _geometry, _material );
		scene.add( earth );

		//	cloud
		var _geometry = new THREE.IcosahedronGeometry( _earthThreeRadius + 0.5, 6 );
		var _material = new THREE.MeshPhongMaterial({
			blending: THREE.AdditiveBlending,
			map: _cloudTexture,
			transparent: true,
			opacity: 0.5
		});
		cloud = new THREE.Mesh( _geometry, _material );
		scene.add( cloud );

		//	air
		var _geometry = new THREE.IcosahedronGeometry( _earthThreeRadius + 0.5, 6 );
		var _material = new THREE.MeshPhongMaterial({
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0.125,
			color: 0x006699,
			depthWrite: true
		});
		air = new THREE.Mesh( _geometry, _material );
		scene.add( air );

		//	ship
		var _geometry = new THREE.BoxGeometry( 0.01, 0.01, 0.01 );
		var _material = new THREE.MeshBasicMaterial({
			color: 0x000000
		});
		box0 = new THREE.Mesh( _geometry, _material );

		//	ship course
		var _r = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight );
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 720; i++ )
		{
			var _rad = i / 720 * Math.PI * 2;
			var _x = 0;
			var _y = Math.sin( _rad ) * _r;
			var _z = Math.cos( _rad ) * _r;
			_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
		}
		_geometry.vertices.push( _geometry.vertices[0].clone() );

		_geometry.rotateY( Math.PI * 0.5 );

		var _material = new THREE.LineBasicMaterial({
			blending: THREE.AdditiveBlending,
			transparent: true,
			opacity: 0.6,
			color: _satelliteOrbitColor
		});
		course = new THREE.Line( _geometry, _material );
		scene.add( course );

		var _loader = new THREE.JSONLoader();
		_loader.load('untitled.json', function( _geometry, _materials){
			var _material = new THREE.MeshPhongMaterial({
				shading: THREE.FlatShading,
				color: _satelliteColor
			});
			_geometry.rotateY( - Math.PI * 0.5 );

			box0 = new THREE.Mesh( _geometry, _material );
			scene.add( box0 );
			box0.scale.set( _satelliteSize, _satelliteSize, _satelliteSize );

			var _eh = new THREE.EdgesHelper( box0, _satelliteEdgeColor, 0.8 );
			scene.add( _eh );
		})

		//	star
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 10000; i++ )
		{
			var _r = Math.random() * 400 + 118;
			var __r0 = Math.random() * Math.PI * 2;
			var __r1 = Math.random() * Math.PI * 2;
			var _x = Math.cos( __r1 ) * Math.cos( __r0 ) * _r;
			var _y = Math.sin( __r0 ) * _r;
			var _z = Math.cos( __r0 ) * Math.sin( __r1 ) * _r;
			_geometry.vertices[i] = new THREE.Vector3( _x, _y, _z );
		}
		var _material = new THREE.PointsMaterial({
			map: new THREE.TextureLoader().load('circle1.png'),
			color: _starColor,
			transparent: true,
			size: 1,
			depthWrite: false
		});
		_particle = new THREE.Points( _geometry, _material );
		scene.add( _particle );
	}

	function _throw( e )
	{
		console.log( e.keyCode );
		if( e.keyCode == 49 )
		{
			//	goto scene01
			location.href = "../scene02/index.html";
		} else if( e.keyCode == 51 )
		{
			//	goto scene02
			location.href = "../scene01/index.html";
		} else if( e.keyCode == 50 ){
			var _endPos = new THREE.Vector3();
			_resetLines();

			//	line
			for( var j = 0; j < _pNums; j++ )
			{
				var _delay = Math.floor( Math.random() * 60 * _sec ) + 12;
				(function(){
					setTimeout(function(){
						var __r0 = _r0 - 0.001;
						var _r = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight );
						var _x = Math.cos( _r1 ) * Math.cos( __r0 ) * _r;
						var _y = Math.sin( __r0 ) * _r;
						var _z = Math.cos( __r0 ) * Math.sin( _r1 ) * _r;
						var _startPos = new THREE.Vector3( _x, _y, _z );

						var _r = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight );
						var __r0 = _r0;
						var __r1 = _r1;
						__r0 = _r0 + _rotationSpeed * linePtc.segmentNum * 0.96 + ( Math.random() - .5 ) * 0.0005;
						__r1 = _r1 + ( Math.random() - .5 ) * 0.01; 

						var _x = Math.cos( __r1 ) * Math.cos( __r0 ) * _r;
						var _y = Math.sin( __r0 ) * _r;
						var _z = Math.sin( __r1 ) * Math.cos( __r0 ) * _r;

						_endPos.x = _x;
						_endPos.y = _y;
						_endPos.z = _z;

						var lp = new linePtc( _startPos, _endPos, scene );
						_lines.push( lp );

					}, _delay / 60 * 1000 );
				})(j, _delay );
			}

			//	流星源射出モードに切り替え
			_phase = 1;
		}
	};

	function render()
	{
		window.requestAnimationFrame(render);

		//	自転処理（擬似）
		earth.rotation.y += 0.0001;
		cloud.rotation.y = earth.rotation.y;
		air.rotation.y = earth.rotation.y;

		_particle.rotation.x += 0.0001;
		_particle.rotation.y += 0.0001;
		_particle.rotation.z += 0.0001;

		//	カメラ上方の設定
		camera.up = new THREE.Vector3().copy( box0.position ).normalize();

		//	極座標運動のため、緯度に相当する _r0 だけ値を増減させる。
		_r0 += _rotationSpeed;
		_r1 = 0;

		//	衛星軌道の高さと座標関係。
		//	衛星は高度 _satelliteHeight kmの高さで周回する。地球の半径を _earthRadius km、3D上の地球の半径を _earthThreeRadius とする。
		var _r = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight );
		var _x = Math.cos( _r1 ) * Math.cos( _r0 ) * _r;
		var _y = Math.sin( _r0 ) * _r;
		var _z = Math.cos( _r0 ) * Math.sin( _r1 ) * _r;

		//	衛星の位置はここで決まる。	
		box0.position.set( _x, _y, _z );

		//	回転角度あわせ
		var _up = new THREE.Vector3( 0, 1, 0 );
		var normalAxis = new THREE.Vector3().copy( box0.position ).normalize();
		var dir = new THREE.Vector3();
		dir = dir.crossVectors( _up, normalAxis ).normalize();
		var dot = _up.dot( normalAxis );
		var rad = Math.acos( dot );
		var q = new THREE.Quaternion();
		q.setFromAxisAngle( dir, rad );
		box0.rotation.setFromQuaternion( q );


		//	流星源が射出され、最後の一つが出てきたら追跡モードに切り替え
		if( _lines[ _pNums-1 ] ){
			_phase = 2;

			if( _lines[ _pNums-1 ].count > linePtc.segmentNum )
			{
				_phase = 0;
				_resetLines();

			}

			if( _lines[ _pNums-1 ] && _lines[ _pNums-1 ].count == linePtc.segmentNum - 60 )
			{
				//	流星の表現終了。画面状態を初期に戻す
				document.getElementById('container').className = 'restView';
				setTimeout( function(){
					document.getElementById('container').className = 'show';
				}, 1000 );
			}
			
		}

		//	_phase ごとのステータス調整
		if( _phase == 0 )
		{
			//	通常モード
			_length = 20;
			_angleSpeed = 0.05;
			_cameraPosTopTarget = 200;

			//	フォーカスを衛星座標に設定	
			focus.copy( box0.position );
		} else if( _phase == 1 )
		{
			//	射出開始
			_length = 3;
			_angleSpeed = 0.1;
			_cameraPosTopTarget = 100;

			//	フォーカスを衛星座標に設定	
			focus.copy( box0.position );
		} else if( _phase == 2 )
		{
			//	追跡モード
			_length = 8;
			_angleSpeed = 0.1;
			_cameraPosTopTarget = 0;
			//focus.copy( _lines[ _pNums-1 ].particle.position );

			focus.x += ( _lines[ _pNums-1 ].particle.position.x - focus.x ) * 0.025;
			focus.y += ( _lines[ _pNums-1 ].particle.position.y - focus.y ) * 0.025;
			focus.z += ( _lines[ _pNums-1 ].particle.position.z - focus.z ) * 0.025;
		}

		_cameraPosTop += ( _cameraPosTopTarget - _cameraPosTop ) * 0.05;

		//	カメラと焦点の距離を算出(vec3)
		var _dist = new THREE.Vector3().subVectors( camera.position, focus );

		//	カメラと焦点の距離を _length になるように _dist を調整。(vec3)
		_dist.normalize().multiplyScalar( _length );

		//	カメラの理想的な位置を設定。
		var _newPoistion = new THREE.Vector3().addVectors( focus, _dist );

		//	カメラが衛星軌道から少し高い位置に来るように再調整。
		var _r = _earthThreeRadius / _earthRadius * ( _earthRadius + _satelliteHeight + _cameraPosTop );
		if( _newPoistion.length() < _r )
		{
			_newPoistion = _newPoistion.normalize().multiplyScalar( _r );
		}

			//	カメラを横からをとるアングル設定
			//	回転の力は無限だ
			var quat = new THREE.Quaternion();

			//	回転軸のベクトル
			var axis = new THREE.Vector3().copy( focus ).normalize();

			//	回転
			var angle = _angleSpeed;

			//	回転軸 axis と角度 angle からクゥオータニオンを計算
			quat.setFromAxisAngle( axis, angle );

			//	新しい座標に回転座標を反映
			_newPoistion = _newPoistion.clone().applyQuaternion( quat );

		//	イージングをかけてカメラ位置を移動
		var _slow = 1.045000;
		var _accell = 700.0;
		_vx = ( _vx + ( _newPoistion.x - camera.position.x ) / _accell ) / _slow;
		_vy = ( _vy + ( _newPoistion.y - camera.position.y ) / _accell ) / _slow;
		_vz = ( _vz + ( _newPoistion.z - camera.position.z ) / _accell ) / _slow;

		camera.position.x += _vx;
		camera.position.y += _vy;
		camera.position.z += _vz;


		//	render
		controls.update();
		camera.lookAt( focus );
		renderer.render( scene, camera );
	}

	function _resetLines()
	{
		var len = _lines.length;
		while( len )
		{
			len --;
			var _l = _lines[len];
			_l.kill();
			_l = null;
		}
		_lines = [];
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
};

/**
 * 緯度経度から位置を算出します
 * @param {number} latitude 緯度
 * @param {number} longitude 経度
 * @param {number} radius 半径
 * @returns {THREE.Vector3} 位置
 */
function translateGeoCoords(latitude, longitude, radius){
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
function getOrbitPoints(startPos, endPos, segmentNum){

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

function easeInBack(t,b,c,d){
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}
function easeInExpo(t,b,c,d){
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}
function easeOutExpo(t,b,c,d){
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}
function easeInQuad(t,b,c,d){
	return c*(t/=d)*t + b;
}