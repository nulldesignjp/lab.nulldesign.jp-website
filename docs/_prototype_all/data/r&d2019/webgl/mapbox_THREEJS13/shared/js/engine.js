/*
	engine.js
	https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/tilequery/
	131.034774,-25.344255.json?radius=50&limit=50&access_token=pk.eyJ1IjoibnVsbGRlc2lnbiIsImEiOiJjamZrcGdtbnowODdlMndzMmE2ZHc5anlrIn0.fsWuly11P-SWfGz9VntnSg
*/

var TrekTrack = TrekTrack || {};
TrekTrack.mapbox = {};
TrekTrack.mapbox.Map = (function(){

	function TTMapbox( _lat, _lng, _zoom, _dom ){

		//	mapbox
		this.api;
		this.accessToken;

		//	緯度経度、ズーム（GoogleMapの値と同様のもの）
		this.zoom;
		this.lat;
		this.lng;

		this.tileX;
		this.tileY;

		//	THREE.js wrapper lib. [ ORIGINAL ].
		this.world;
		this.filed;
		this.pins;
		this.line;

		//	描画 Prop
		this.grid;
		this.gridSize;
		this.scaleHeight;
		this.isLite;

		//	描画ストック
		this.mainCANVAS;
		this.subCanvas;
		this.mainCtx;
		this.subCtx;

		//	管理系
		this.imageList;
		this.dataList;

		//	初期化
		this.init( _lat, _lng, _zoom, _dom );
		this.setData();
		this.load();
	}

	TTMapbox.prototype = {
		init : function( _lat, _lng, _zoom, _dom ){

			//	api
			this.api = 'https://api.mapbox.com';
			this.accessToken = 'pk.eyJ1IjoibnVsbGRlc2lnbiIsImEiOiJjamZrcGdtbnowODdlMndzMmE2ZHc5anlrIn0.fsWuly11P-SWfGz9VntnSg';

			//	geodata
			this.zoom = _zoom;
			this.lat = _lat;
			this.lng = _lng;

			//	map tile
			this.tileX = long2tile( _lng, _zoom );
			this.tileY = lat2tile( _lat, _zoom );

			this.world = new world( _dom );
			this.world.render();

			var _gridHelper = new THREE.GridHelper( 3600, 36 );
			this.world.add( _gridHelper );

			//	描画 Prop
			this.grid = 8;
			this.gridSize = 100;
			this.scaleHeight = 64.0 / Math.pow( 2, 24 - this.zoom ) * this.gridSize / 100;;
			this.isLite = true;

			//	main texture
			this.mainCanvas = document.createElement('canvas');
			this.mainCanvas.width = 512 * this.grid;
			this.mainCanvas.height = 512 * this.grid;
			this.mainCtx = this.mainCanvas.getContext('2d');

			//	rgb(height map)
			this.subCanvas = document.createElement('canvas');
			this.subCanvas.width = 256 * this.grid;
			this.subCanvas.height = 256 * this.grid;
			this.subCtx = this.subCanvas.getContext('2d');

			this.imageList = [];
			this.dataList = [];
		},
		setData : function(){
			this.dataSet = [];
			this.imageList = [];
			for( var i = 0; i < this.grid; i++ ){
				for( var j = 0; j < this.grid; j++ ){
					var _obj = {};
					_obj.x = this.tileX + i - Math.floor( this.grid * 0.5 );
					_obj.y = this.tileY + j - Math.floor( this.grid * 0.5 );

					//	console.log( _obj.x, _obj.y )

					_obj.url = this.api + '/v4/mapbox.terrain-rgb/'+this.zoom+'/'+_obj.x+'/'+_obj.y+'.pngraw?access_token=' + this.accessToken;
					_obj.src = this.api + '/v4/mapbox.satellite/'+this.zoom+'/'+_obj.x+'/'+_obj.y+'@2x.png256?access_token=' + this.accessToken;
					_obj.index = {x:i,y:j};
					_obj.zoom = this.zoom;
					this.dataSet.push( _obj );
				}
			}
		},
		load : function(){
			var _t = this;
			if( this.dataSet.length ){
				var _data = this.dataSet.pop();
				var _img = new Image();
				_img.crossOrigin = 'anonymous';
				_img.onload = function(e){
					var _t0 = this;
					var __img = new Image();
					__img.crossOrigin = 'anonymous';
					__img.onload = function(e){
						var _t1 = this;
						_t.imageList.push({
							x: _data.index.x,
							y: _data.index.y,
							img0: _t0,
							img1: _t1
						});
						setTimeout( function(){	_t.load();	}, 100 );
					}
					__img.onerror = function(e){	_t.onError('Load Image Error, texture.' + e );	}
					__img.src = _data.src;
				}
				_img.onerror = function(e){	_t.onError('Load Image Error, terrain-rgb' + e );	}
				_img.src = _data.url;
			} else {
				_t.start();
			}

		},
		start : function(){
			this.createImage();
			if( this.isLite ){	this.resizeCanvas();	}
			this.createField();
		},
		createImage : function(){
			var len = this.imageList.length;
			for( var i = 0; i < len; i++ ){
				var _data = this.imageList[i];
				this.subCtx.drawImage( _data.img0, _data.x * 256, _data.y * 256 );
				this.mainCtx.drawImage( _data.img1, _data.x * 512, _data.y  * 512 );
			}
			//	console.log( this.mainCanvas.toDataURL() );

			//	check big field
			var _canvas = document.createElement('canvas');
			_canvas.width = _canvas.height = this.grid * 256;
			var _contest = _canvas.getContext('2d');
			for( var i = 0; i < len; i++ ){
				var _data = this.imageList[i];
				_contest.drawImage( _data.img0, _data.x * 256, _data.y * 256 );
			};
			//document.body.appendChild( this.subCanvas );


		},
		resizeCanvas : function(){
			var _canvas = document.createElement('canvas');
			_canvas.width = 256;
			_canvas.height = 256;
			var _ctx = _canvas.getContext('2d');
			_ctx.drawImage( this.subCanvas, 0, 0, this.subCanvas.width, this.subCanvas.height, 0, 0, 256, 256 );
			this.subCanvas = _canvas;
			this.subCtx = _ctx;
		},
		createField : function(){
			var _texture = new THREE.Texture( this.mainCanvas );
	 		_texture.needsUpdate = true; 
			var _heightTexture = new THREE.Texture( this.subCanvas );
	 		_heightTexture.needsUpdate = true; 

			this.field = new TrekTrack.mapbox.Field( _texture, _heightTexture, this.scaleHeight, this.subCanvas, this.subCtx, this.grid, this.gridSize );
			this.world.add( this.field.mesh );

			//	sample
			var _poslist = [
				[this.lat, this.lng],
				[-25.352173, 131.033198],
				[-25.342787, 131.021568],
				[-25.359907, 131.014872],
				[-25.355850, 131.050308],
				[-25.366507, 131.042235],
				[-25.373784, 131.037403],
				[-25.370038, 131.063399]
			];

			this.pins = new TrekTrack.mapbox.Pins( _poslist, _heightTexture, this.scaleHeight, this.subCanvas, this.subCtx, this.grid, this.gridSize, this.zoom, this.tileX, this.tileY );
			this.world.add( this.pins.mesh );

			var _lineWidth = 3.0;
			var _lineDiv = 32;
			this.line = new TrekTrack.mapbox.Line( _poslist, _heightTexture, this.scaleHeight, this.subCanvas, this.subCtx, this.grid, this.gridSize, this.zoom, this.tileX, this.tileY, _lineWidth, _lineDiv );
			this.world.add( this.line.mesh );

		/*
						offset
		*/
		var _imagedata = this.subCtx.getImageData(0, 0, this.subCanvas.width, this.subCanvas.height);
		var _data = _imagedata.data;
		var _r = _data[ 0 ];
		var _g = _data[ 1 ];
		var _b = _data[ 2 ];
		var _a = _data[ 3 ];
		var _offsetY = - 10000 + ((_r * 256 * 256 + _g * 256 + _b) * 0.1);
		this.field.mesh.position.y = - _offsetY * this.scaleHeight;
		this.pins.mesh.position.y = - _offsetY * this.scaleHeight;
		this.line.mesh.position.y = - _offsetY * this.scaleHeight;


			this.onComplete('ok');
		},
		onComplete : function(e){},
		onError : function(e){},

	};

	return TTMapbox;
})();

TrekTrack.mapbox.Field = (function(){
	function TTField( _texture, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize ){
		this.mesh;
		this.init( _texture, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize  );
	}

	TTField.prototype = {
		init : function( _texture, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize  ){
			var _imagedata = _subCtx.getImageData(0, 0, _subCanvas.width, _subCanvas.height);
			var _data = _imagedata.data;
			var _geometry = new THREE.PlaneGeometry( _gridSize * _grid, _gridSize * _grid, _subCanvas.width-1, _subCanvas.height-1 );
			_geometry.rotateX( - Math.PI * 0.5 );

			var _material = new THREE.MeshStandardMaterial({
				map: _texture,
				color: 0xFFFFFF,
				roughness: 1.0,
				metalness: 0.0,
				bumpMap: _heightTexture,
				bumpScale: 16,
				side: THREE.DoubleSide,
				wireframe: false
			});

			var _vertex = [
				"uniform sampler2D DepthTexture;",
				"uniform float scaleHeight;",
				"varying vec2 vUv;",
				"varying vec3 vNormal;",
				"void main()",
				"{",
				"	vUv = uv;",
				"	vNormal = normalMatrix * normal;",
				"	vec4 _map = texture2D( DepthTexture, vUv );",
				"	float _y = - 10000.0 + ( (_map.r * 256.0 * 256.0 + _map.g * 256.0 + _map.b ) * 0.1 * 256.0 );",
				"	vec3 _position = position;",
				"	_position.y = _y * scaleHeight;",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( _position, 1.0 );",
				"}",
			].join('\n');

			var _fragment = [
				"uniform sampler2D MAPTexture;",
				"uniform vec3 lightPosition;",
				"uniform vec3 lightColor;",
				"uniform vec3 planeColor;",
				"uniform vec3 ambientColor;",
				"",
				"varying vec3 vNormal;",
				"varying vec2 vUv;",
				"",

				"vec3 RGBToHSV( vec3 rgb ){",
				"	vec3 hsv;",
				"	float max = max(rgb.r, max(rgb.g, rgb.b));",
				"	float min = min(rgb.r, min(rgb.g, rgb.b));",
				"	float delta = max - min;",
				"	hsv.z = max; // v",
				"",
				"	if (max != 0.0){",
				"		hsv.y = delta / max;//s",
				"	}else{",
				"		hsv.y = 0.0;//s",
				"	}",
				"",
				"	if ( rgb.r == max ){",
				"		hsv.x =     (rgb.g - rgb.b) / delta;// h",
				"	}else if (rgb.g == max){",
				"		hsv.x = 2.0 + (rgb.b - rgb.r) / delta;// h",
				"	}else{",
				"		hsv.x = 4.0 + (rgb.r - rgb.g) / delta;// h",
				"	}",
				"	hsv.x /= 6.0;",
				"	if (hsv.x < 0.0) hsv.x += 1.0;",
				"",
				"	return hsv;",
				"}",
				"",
				"vec3 HSVToRGB( vec3 hsv ){",
				"	vec3 rgb;",
				"	if ( hsv.y == 0.0 ){ /* Grayscale */",
				"		rgb.r = rgb.g = rgb.b = hsv.z;// v",
				"	} else {",
				"		if (1.0 <= hsv.x) hsv.x -= 1.0;",
				"",
				"		hsv.x *= 6.0;",
				"		float i = floor (hsv.x);",
				"		float f = hsv.x - i;",
				"		float aa = hsv.z * (1.0 - hsv.y);",
				"		float bb = hsv.z * (1.0 - (hsv.y * f));",
				"		float cc = hsv.z * (1.0 - (hsv.y * (1.0 - f)));",
				"",
				"		if( i < 1.0 ){",
				"			rgb.r = hsv.z;",
				"			rgb.g = cc;",
				"			rgb.b = aa;",
				"		}else if( i < 2.0 ){",
				"			rgb.r = bb;",
				"			rgb.g = hsv.z;",
				"			rgb.b = aa;",
				"		}else if( i < 3.0 ){",
				"			rgb.r = aa;",
				"			rgb.g = hsv.z;",
				"			rgb.b = cc;",
				"		}else if( i < 4.0 ){",
				"			rgb.r = aa;",
				"			rgb.g = bb;",
				"			rgb.b = hsv.z;",
				"		}else if( i < 5.0 ){",
				"			rgb.r = cc;",
				"			rgb.g = aa;",
				"			rgb.b = hsv.z;",
				"		}else{",
				"			rgb.r = hsv.z;",
				"			rgb.g = aa;",
				"			rgb.b = bb;",
				"		}",
				"	}",
				"	return rgb;",
				"}",

				"void main()",
				"{",
				// "	vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );",
				// "	vec3 N = normalize( vNormal );",
				// "	vec3 L = normalize( viewLightPosition.xyz );",
				// "",
				// "	float dotNL = dot( N, L );",
				// "",
				// "	vec3 diffuse = planeColor * lightColor * max( dotNL, 0.0 );",
				// "	vec3 ambient = planeColor * ambientColor;",
				// "",
				// "	//  opacity",
				// "	float dist = length( vUv.xy );",
				// "	float _opacity = 1.0 - dist / 120.0;",
				"",
				"	vec4 _map = texture2D( MAPTexture, vUv );",

				"	vec3 hsv = RGBToHSV( _map.rgb );",
				"	hsv.y *= 1.10;",	//	s
				"	hsv.z *= 1.20;",	//	v
				"	vec3 rgb = HSVToRGB( hsv );",
				"	_map.rgb = rgb;",

				//	/	HSV
				"	gl_FragColor = _map;",
				//"	gl_FragColor *= vec4( diffuse + ambient, _opacity );",
				"",
				"}"
			].join( "\n" );
			
			var _uniforms = {
				MAPTexture: { type: "t", value: _texture },
				DepthTexture: { type: "t", value: _heightTexture },
				scaleHeight: { type: "f", value: _scaleHeight },
				// planeColor: {type: "c", value: new THREE.Color() },
				// lightPosition: {type: "v3", value: new THREE.Vector3() },
				// lightColor: {type: "c", value: new THREE.Color() },
				// ambientColor: {type: "c", value: new THREE.Color() }
			};
			// _uniforms.lightPosition.value = _world.directional.position;
			// _uniforms.lightColor.value = _world.directional.color;
			// _uniforms.ambientColor.value = _world.ambient.color;

			var _material = new THREE.ShaderMaterial( {
				uniforms:	_uniforms,
				//attributes:     {},
				//defines: {},
				vertexShader:   _vertex,
				fragmentShader: _fragment,
				side: THREE.DoubleSide,
				transparent: true
			});

			this.mesh = new THREE.Mesh( _geometry, _material );
		}
	};

	return TTField;
})();

TrekTrack.mapbox.Pins = (function(){
	function TTPins( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY ){
		this.mesh;
		this.Offset;
		this.init( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY );
	}

	TTPins.prototype = {
		init : function( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY ){

			this.offset = 1.0;

			var _geometry = new THREE.Geometry();
			var len = _poslist.length;
			for( var i = 0; i < len; i++ ){
				var _pos = fromLatLngToPoint( _poslist[i][0], _poslist[i][1], _zoom);
				var _localX = ( _pos.x - ( _tileX * 256 ) );
				var _localY = ( _pos.y - ( _tileY * 256 ) );
				var _parX = _localX / 256;
				var _parY = _localY / 256;
				var _offset = _grid%2==0?0.5:0;
				var _pos = {x:0,y:0,z:0};
				_pos.x = _parX * _gridSize - Math.floor( _gridSize * 0.5 ) + _gridSize * _offset;
				_pos.y = 0;
				_pos.z = _parY * _gridSize - Math.floor( _gridSize * 0.5 ) + _gridSize * _offset;

				_geometry.vertices[i] = _pos;
			}

			var _pinVertex = [
				"uniform sampler2D DepthTexture;",
				"uniform float scaleHeight;",
				"uniform float pointSize;",
				"uniform float gridSize;",
				"uniform float offset;",
				"void main()",
				"{",
				"	gl_PointSize = pointSize;",
				"	vec2 vUv = - position.xz / gridSize + 0.5;",
				"	vec4 _map = texture2D( DepthTexture, vUv );",
				"	float _y = - 10000.0 + ( (_map.r * 256.0 * 256.0 + _map.g * 256.0 + _map.b ) * 0.1 * 256.0 );",
				"	vec3 _position = position;",
				"	_position.y = _y * scaleHeight + offset;",
				"    gl_Position = projectionMatrix * modelViewMatrix * vec4( _position, 1.0 );",
				"}",
			].join('\n');

			var _material = new THREE.PointsMaterial({color: 0xFF0000, size:10});
			var _pinFragment = [
				"void main()",
				"{",
				"	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );",
				"",
				"}"
			].join( "\n" );

			var _uniforms = {
				DepthTexture: { type: "t", value: _heightTexture },
				scaleHeight: { type: "f", value: _scaleHeight },
				pointSize: { type: "f", value: 8.0 },
				gridSize: { type: "f", value: _grid * _gridSize },
				offset : { type: "f", value: this.offset }
			};

			var _material = new THREE.ShaderMaterial( {
				uniforms:	_uniforms,
				//attributes:     {},
				//defines: {},
				vertexShader:   _pinVertex,
				fragmentShader: _pinFragment,
				transparent: true
			});

			this.mesh = new THREE.Points( _geometry, _material );
		}
	};

	return TTPins;
})();

TrekTrack.mapbox.Line = (function(){
	function TTLine( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY, _lineWidth, _lineDiv ){
		this.mesh;
		this.offset = 1.0;
		this.init( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY, _lineWidth, _lineDiv );
	}

	TTLine.prototype = {
		init : function( _poslist, _heightTexture, _scaleHeight, _subCanvas, _subCtx, _grid, _gridSize, _zoom, _tileX, _tileY, _lineWidth, _lineDiv ){
			var _geometry = new THREE.Geometry();
			var len = _poslist.length;
			for( var i = 0; i < len; i++ ){
				var _pos = fromLatLngToPoint( _poslist[i][0], _poslist[i][1], _zoom);
				var _localX = ( _pos.x - ( _tileX * 256 ) );
				var _localY = ( _pos.y - ( _tileY * 256 ) );
				var _parX = _localX / 256;
				var _parY = _localY / 256;
				var _offset = _grid%2==0?0.5:0;
				var _pos = {x:0,y:0,z:0};
				_pos.x = _parX * _gridSize - Math.floor( _gridSize * 0.5 ) + _gridSize * _offset;
				_pos.y = 0;
				_pos.z = _parY * _gridSize - Math.floor( _gridSize * 0.5 ) + _gridSize * _offset;

				_geometry.vertices[i] = new THREE.Vector3( _pos.x, 0, _pos.z );

			}

			_geometry.vertices = SplineCurve3D( _geometry.vertices, _lineDiv );


			var len = _geometry.vertices.length;
			var _newGeometry = new THREE.Geometry();
			for( var i = 0; i < len - 1; i++ ){
				var _v0 = _geometry.vertices[ i + 0 ];
				var _v1 = _geometry.vertices[ i + 1 ];
				var _v = new THREE.Vector3().subVectors( _v1, _v0 );
				var _n = new THREE.Vector3( - _v.z, 0, _v.x ).normalize().multiplyScalar( _lineWidth * 0.5);

				_newGeometry.vertices[ i * 4 + 0 ] = new THREE.Vector3().addVectors( _v0, _n );
				_newGeometry.vertices[ i * 4 + 1 ] = new THREE.Vector3().subVectors( _v0, _n );
				_newGeometry.vertices[ i * 4 + 2 ] = new THREE.Vector3().addVectors( _v1, _n );
				_newGeometry.vertices[ i * 4 + 3 ] = new THREE.Vector3().subVectors( _v1, _n );

				_newGeometry.faces.push( new THREE.Face3( i * 4 + 0, i * 4 + 1, i * 4 + 2 ) );
				_newGeometry.faces.push( new THREE.Face3( i * 4 + 1, i * 4 + 3, i * 4 + 2 ) );
			}

			for( var i = 0; i < len - 2; i++ ){
				var _p0 = _newGeometry.vertices[ i * 4 + 0 ];
				var _p1 = _newGeometry.vertices[ i * 4 + 1 ];
				var _p2 = _newGeometry.vertices[ i * 4 + 2 ];
				var _p3 = _newGeometry.vertices[ i * 4 + 3 ];

				var _p4 = _newGeometry.vertices[ ( i + 1 ) * 4 + 0 ];
				var _p5 = _newGeometry.vertices[ ( i + 1 ) * 4 + 1 ];
				var _p6 = _newGeometry.vertices[ ( i + 1 ) * 4 + 2 ];
				var _p7 = _newGeometry.vertices[ ( i + 1 ) * 4 + 3 ];

				var _p00 = getCrossVector( _p0, _p2, _p4, _p6 );
				var _p01 = getCrossVector( _p1, _p3, _p5, _p7 );

				//	_p2
				_newGeometry.vertices[ i * 4 + 2 ].x = _p00[0].x;
				_newGeometry.vertices[ i * 4 + 2 ].z = _p00[0].z;
				//	_p4
				_newGeometry.vertices[ ( i + 1 ) * 4 + 0 ].x = _p00[1].x;
				_newGeometry.vertices[ ( i + 1 ) * 4 + 0 ].z = _p00[1].z;

				//	_p3
				_newGeometry.vertices[ i * 4 + 3 ].x = _p01[0].x;
				_newGeometry.vertices[ i * 4 + 3 ].z = _p01[0].z;
				//	_p5
				_newGeometry.vertices[ ( i + 1 ) * 4 + 1 ].x = _p01[1].x;
				_newGeometry.vertices[ ( i + 1 ) * 4 + 1 ].z = _p01[1].z;


			}

			_newGeometry.computeBoundingBox();
			_newGeometry.computeFaceNormals();
			_newGeometry.computeVertexNormals();

			_geometry = _newGeometry;

			var _lineVertex = [
				"uniform sampler2D DepthTexture;",
				"uniform float scaleHeight;",
				"uniform float lineWidth;",
				"uniform float gridSize;",
				"uniform float offset;",
				"void main()",
				"{",
				"	vec2 vUv = vec2( position.x, - position.z ) / gridSize + 0.5;",
				"	vec4 _map = texture2D( DepthTexture, vUv );",
				"	float _y = - 10000.0 + ( (_map.r * 256.0 * 256.0 + _map.g * 256.0 + _map.b ) * 0.1 * 256.0 );",
				"	vec3 _position = position;",
				"	_position.y = _y * scaleHeight + offset;",
				"    gl_Position = projectionMatrix * modelViewMatrix * vec4( _position, 1.0 );",
				"}",
			].join('\n');

			var _material = new THREE.PointsMaterial({color: 0xFF0000, size:10});
			var _lineFragment = [
				"void main()",
				"{",
				"	gl_FragColor = vec4( 1.0, 1.0, 0.0, 1.0 );",
				"",
				"}"
			].join( "\n" );

			var _uniforms = {
				DepthTexture: { type: "t", value: _heightTexture },
				scaleHeight: { type: "f", value: _scaleHeight },
				lineWidth: { type: "f", value: 4.0 },
				gridSize: { type: "f", value: _grid * _gridSize },
				offset: { type: "f", value: this.offset },
			};

			var _material = new THREE.ShaderMaterial( {
				uniforms:	_uniforms,
				//attributes:     {},
				//defines: {},
				vertexShader:   _lineVertex,
				fragmentShader: _lineFragment,
				transparent: true,
				side: THREE.DoubleSide
			});
			this.mesh = new THREE.Mesh( _geometry, _material );
		}
	};

	return TTLine;
})();




$('#siteBody').addClass('open');

var _zoom = 5;
var _lng = 139.753315;
var _lat = 35.557755;

var _tt = new TrekTrack.mapbox.Map( _lat, _lng, _zoom, 'webglView' );
_tt.onComplete = function( e ){	console.log('onComplete.execute.', e);	}
_tt.onError = function( e ){		console.log('onError.execute.', e);	}







/*
	method
*/
	function long2tile(lon,zoom) { return (Math.floor((lon+180)/360*Math.pow(2,zoom))); }
 	function lat2tile(lat,zoom)  { return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom))); }
	function tile2long(x,z) {
		return (x/Math.pow(2,z)*360-180);
	}
	function tile2lat(y,z) {
		var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
		return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
	}
	function fromLatLngToPoint( _lat, _lng, z ){
		var L = 85.0511287798066;
		var PI = Math.PI;
		var _x = Math.pow( 2, z + 7 ) * ( _lng / 180 + 1 );
		var _sinLat = Math.sin( PI / 180 * _lat );
		var _sinL = Math.sin( PI / 180 * L );
		var _y = Math.pow( 2, z + 7 ) / PI * 
		(
			- 1/2 * Math.log( (1.0 + _sinLat)/(1.0 - _sinLat ) )
		+
			1/2 * Math.log( (1.0 + _sinL)/(1.0 - _sinL ) )
		);
		return {x:_x>>0,y:_y>>0};
	}


	function getCrossVector( A, B, C, D )
	{
		var result = [];
		result[0] = new THREE.Vector3();
		result[1] = new THREE.Vector3();
		result[2] = true;

		var AB = new THREE.Vector3().subVectors( B, A );
		var CD = new THREE.Vector3().subVectors( D, C );

		var n1 = new THREE.Vector3().subVectors( B, A ).normalize();
		var n2 = new THREE.Vector3().subVectors( D, C ).normalize();

		var work1 = n1.dot( n2 );
		var work2 = 1.0 - work1 * work1;

		//直線が平行な場合は計算できない 平行だとwork2が0になる
    	if( work2 == 0 ) {
    		result[2] = false;
    		return result;
    	}

    	var AC = new THREE.Vector3().subVectors( C, A );
    	var d1 = ( AC.dot( n1 ) - work1 * AC.dot( n2 ) ) / work2;
    	var d2 = ( work1 * AC.dot( n1 ) - AC.dot( n2 ) ) / work2;

		//AB上の最近点
		result[0].x = A.x + d1 * n1.x;
		result[0].y = A.y + d1 * n1.y;
		result[0].z = A.z + d1 * n1.z;
		//BC上の最近点
		result[1].x = C.x + d2 * n2.x;
		result[1].y = C.y + d2 * n2.y;
		result[1].z = C.z + d2 * n2.z;

		return result;
	}
	/*
		参考URL
		https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames
		http://www.trail-note.net/tech/coordinate/
		http://hosohashi.blog59.fc2.com/blog-entry-5.html
		https://ja.wikipedia.org/wiki/逆三角関数
		https://mathtrain.jp/invhyp
		https://www.mapbox.com/blog/tags/terrain/

		http://www.sousakuba.com/Programming/gs_two_lines_intersect.html
	*/


