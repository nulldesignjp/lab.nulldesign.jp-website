/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 500;

		var _geometry = new THREE.IcosahedronGeometry( 100, 2 );
		var _material = new THREE.MeshBasicMaterial({color: 0x333333,wireframe:true});
		var _mesh = new THREE.Mesh( _geometry, _material );
		this.world.add( _mesh );



			var _startPos = new THREE.Vector3();
			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			_startPos.x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * 110;
			_startPos.y = Math.sin( _rad0 ) * 110;
			_startPos.z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * 110;

				var _geometry = new THREE.IcosahedronGeometry( 6, 1 );
				var _material = new THREE.MeshBasicMaterial({color: 0xCC0000});
				var _mesh = new THREE.Mesh( _geometry, _material );
				this.world.add( _mesh );
				_mesh.position.copy( _startPos );

		for( var j = 0; j <5; j++ )
		{
			var _endPos = new THREE.Vector3();
			var _segmentNum = 32;

			var _rad0 = Math.random() * Math.PI * 2;
			var _rad1 = Math.random() * Math.PI * 2;
			_endPos.x = Math.cos( _rad1 ) * Math.cos( _rad0 ) * 110;
			_endPos.y = Math.sin( _rad0 ) * 110;
			_endPos.z = Math.sin( _rad1 ) * Math.cos( _rad0 ) * 110;

			var _pointlist = getOrbitPoints( _startPos, _endPos, _segmentNum );
			for( var i = 0; i < _pointlist.length; i++ )
			{
				var _size = i == ( _pointlist.length-1)?6:1.5;
				var _geometry = new THREE.IcosahedronGeometry( _size, 1 );
				var _material = new THREE.MeshBasicMaterial({color: 0xCC0000});
				var _mesh = new THREE.Mesh( _geometry, _material );
				this.world.add( _mesh );
				_mesh.position.copy( _pointlist[i] );
			}
		}
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
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
	return Practice;
})();

var _pr = new Practice();

