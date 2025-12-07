/*
	BeltGramField.js
*/

var BeltGramField = (function(){
	function BeltGramField()
	{
		this.field;
		this.ground;
		this.scale = 0.001;
		this.posList = [];

		//	mountain
		this.mHeight = 640;
		this.mRange = 800;
		this.mCenterX = 2400;
		this.mCenterY = 0;

		this._n;
		this._t;

		this.init();

	}

	BeltGramField.prototype = {
		init: function()
		{
			this.field = new THREE.Object3D();
			this.createField();
			return this.field;
		},
		createField : function()
		{
			var _ambient = new THREE.AmbientLight( 0x999999 );
			this.field.add( _ambient );

			var _dl = new THREE.DirectionalLight( 0x666666, 1.0 );
			_dl.position.set( 1, 1, 1 );
			this.field.add( _dl );

			var _dl_ = new THREE.DirectionalLight( 0x666666, 0.5 );
			_dl_.position.set( -1, -1, -1 );
			this.field.add( _dl_ );

			var _pl = new THREE.PointLight( 0xFFFFFF,0.6,2400)
			_pl.position.set( 400, 800, 100 );
			this.field.add( _pl );

			//
			this._n = new SimplexNoise();
			this._t = new SimplexNoise();

			//	create
			var _t = this;
			this._createTrees( function(){
				_t._createGround();
				_t._createMountain();
				_t._createClouds();
			});
		},
		_createTrees : function( _callback )
		{
			var _t = this;
			var loader = new THREE.JSONLoader();
			loader.load( 'tree.json', function ( geometry, materials ) {
				var material = new THREE.MeshFaceMaterial( materials );
				var meshItem = new THREE.Mesh( geometry, material );

				//	共通設定があればここで
				var len = materials.length;
				for( var i = 0; i < len; i++ )
				{
					var _material = materials[i];
					_material.shading = THREE.FlatShading;
				}

				//
				var _m = 100;
				var len = _m * _m;
				var _scaleT = 0.0020;
				var _geometry = new THREE.Geometry();
				while( len )
				{
					len --;

					var _x = -3200 + ( len % _m ) * 64 + ( Math.random()-.5)*64;
					var _z = -3200 + Math.floor( len / _m ) * 64;
					var _value = _t._t.noise( _x * _scaleT, _z * _scaleT );


					var _cx = _t.mCenterX;
					var _cz = _t.mCenterY;
					var _r = _t.mRange;
					var _dx = _x - _cx;
					var _dz = _z - _cz;
					var _d = Math.sqrt( _dx * _dx + _dz * _dz );
					if( _value > 0.4 && _d > _r )
					{
						var _scales = ( _value - 0.3 ) / 7 * 10 * 2;
						meshItem.position.x = _x + _t.rnd()*32;
						meshItem.position.y = _t._n.noise( _x * _t.scale, _z * _t.scale ) * 80;
						meshItem.position.z = _z + _t.rnd()*32;
						meshItem.rotation.x = 0;
						meshItem.rotation.y = Math.random() * Math.PI * 2.0;
						meshItem.rotation.z = 0;
						meshItem.scale.x = _scales;
						meshItem.scale.y = _scales;
						meshItem.scale.z = _scales;
						meshItem.updateMatrix();
						_geometry.merge( meshItem.geometry, meshItem.matrix );

						_t.posList.push([meshItem.position.x,meshItem.position.z]);
					}
				}

				var mesh = new THREE.Mesh(_geometry, material);
				_t.field.add(mesh);

				_callback();

			} );
		},
		_createMountain : function()
		{
			this.ground.material.vertexColors = THREE.VertexColors;
			this.ground.material.color.r = 1.0;
			this.ground.material.color.g = 1.0;
			this.ground.material.color.b = 1.0;

			var _vertices = this.ground.geometry.vertices;
			var len = _vertices.length;
			while( len )
			{
				len --;
				var _h = this.mHeight;
				var _r = this.mRange;
				var _cx = this.mCenterX;
				var _cz = this.mCenterY;
				var _dx = _vertices[len].x - _cx;
				var _dz = _vertices[len].z - _cz;
				var _d = Math.sqrt( _dx * _dx + _dz * _dz );
				if( _d < _r )
				{
					_vertices[len].y = ( this._n.noise( _vertices[len].x * this.scale, _vertices[len].z * this.scale ) + 1.0 ) * _h * ( ( _r - _d ) / _r );
					this.ground.geometry.colors[len] = new THREE.Color( 0x046d19 );

					// if( ( _r - _d ) / _r > 0.8 )
					// {
					// 	this.ground.geometry.colors[len] = new THREE.Color( 0xFFFFFF );
					// }

				} else {
					this.ground.geometry.colors[len] = new THREE.Color( 0x11cf0b );
				}
			}

			var _faces = this.ground.geometry.faces;
			var len = _faces.length;
			while( len )
			{
				len --;
				var _face = _faces[len];
				var _color0 = this.ground.geometry.colors[ _face.a ];
				var _color1 = this.ground.geometry.colors[ _face.b ];
				var _color2 = this.ground.geometry.colors[ _face.c ];
				_faces[len] = new THREE.Face3( _face.a, _face.b, _face.c, null, [ _color0, _color1, _color2 ] );
			}

			this.ground.geometry.colorsNeedUpdate = true;
			this.ground.geometry.facesNeedUpdate = true;
			this.ground.geometry.verticesNeedUpdate = true;
			this.ground.geometry.computeFaceNormals();
			this.ground.geometry.computeVertexNormals();
		},
		_createGround : function()
		{
			var geometry = new THREE.DelaunayGeometry(9600,9600,3200,this.posList);	//	nulldesign.jp
			var material = new THREE.MeshLambertMaterial({
				color:0x11cf0b,
				shading:THREE.FlatShading,
				wireframe:false
			});
			this.ground = new THREE.Mesh(geometry,material);
			this.field.add( this.ground );

			var len = geometry.vertices.length;
			while( len )
			{
				len --;
				var _p = geometry.vertices[len]
				var _value = this._n.noise( _p.x * this.scale, _p.z * this.scale );
				_p.y = _value * 80;

				geometry.colors[len] = new THREE.Color( 0x11cf0b );
			}

			geometry.computeFaceNormals();
			geometry.computeVertexNormals();
		},
		_createClouds : function()
		{
			var _t = this;
			var loader = new THREE.JSONLoader();
			loader.load( 'cloud2.json', function ( geometry, materials ) {
				var material = new THREE.MeshFaceMaterial( materials );
				var meshItem = new THREE.Mesh( geometry, material );

				var len = materials.length;
				for( var i = 0; i < len; i++ )
				{
					var _material = materials[i];
					_material.shading = THREE.FlatShading;
				}

				//	
				var len = 24;
				var _geometry = new THREE.Geometry();
				while( len )
				{
					len --;

					meshItem.position.x = ( Math.random()-.5 ) * 9600;
					meshItem.position.y = Math.random() * 40 + 200;
					meshItem.position.z = ( Math.random()-.5 ) * 9600;
					meshItem.scale.set(80,80 * ( Math.random() * 0.4 + 0.6 ),80);
					meshItem.updateMatrix();
					_geometry.merge( meshItem.geometry, meshItem.matrix );
					
				}

				var mesh = new THREE.Mesh(_geometry, material);
				_t.field.add(mesh);

			} );
		},
		rnd: function()
		{
			return Math.random()*2-1;
		}
	};

	return BeltGramField;
})();