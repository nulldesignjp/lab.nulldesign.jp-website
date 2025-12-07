/*
	libs.js

*/

var Sky = (function(){

	function Sky( v3 ){
		this.mesh;
		this.init( v3 );
	}

	Sky.prototype = {
		init : function( v3 ){

			//	var _g = new THREE.IcosahedronGeometry( 500, 1 );
			var _g = new THREE.SphereGeometry( 500, 18, 12 );
			var _vertexShader = [
				"const int NUM_DATA = 6;",
				"uniform vec3 colors[NUM_DATA];",
				"uniform float intervals[NUM_DATA];",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",
				"void main()	{",
				"	vPosition = position;",
				"	for( int i = 0; i < NUM_DATA; i++ )",
				"	{",
				"		vColors[i] = colors[i];",
				"		vIntervals[i] = intervals[i];",
				"	}",
				"	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}",
			].join( "\n" );
			var _fragmentShader = [
				"const int NUM_DATA = 6;",
				"uniform float time;",
				"uniform vec3 light;",
				"varying vec3 vPosition;",
				"varying vec3 vColors[NUM_DATA];",
				"varying float vIntervals[NUM_DATA];",

				"void main()	{",
				"	vec3 pos = normalize( vPosition );",
				"	pos = ( pos + 1.0 ) * 0.5;",
				"	float _p = pos.y;",

				"	float i0 = vIntervals[0];",
				"	float i1 = vIntervals[1];",
				"	float i2 = vIntervals[2];",
				"	float i3 = vIntervals[3];",
				"	float i4 = vIntervals[4];",
				"	float i5 = vIntervals[5];",

				"	vec4 _c0 = vec4( vColors[0] / 255.0, 1.0 );",
				"	vec4 _c1 = vec4( vColors[1] / 255.0, 1.0 );",
				"	vec4 _c2 = vec4( vColors[2] / 255.0, 1.0 );",
				"	vec4 _c3 = vec4( vColors[3] / 255.0, 1.0 );",
				"	vec4 _c4 = vec4( vColors[4] / 255.0, 1.0 );",
				"	vec4 _c5 = vec4( vColors[5] / 255.0, 1.0 );",

				"	if( _p < i1 ){",
				"		_c0 *= 1.0 - ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c1 *= ( clamp( _p, i0, i1 ) - i0 ) / i1;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i2 && _p > i1 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 1.0 - ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c2 *= ( clamp( _p, i1, i2 ) - i1 ) / ( i2 - i1);",
				"		_c3 *= 0.0;",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i3 && _p > i2 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 1.0 - ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c3 *= ( clamp( _p, i2, i3 ) - i2 ) / ( i3 - i2 );",
				"		_c4 *= 0.0;",
				"		_c5 *= 0.0;",
				"	} else if( _p < i4 && _p > i3 ){",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 1.0 - ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c4 *= ( clamp( _p, i3, i4 ) - i3 ) / ( i4 - i3 );",
				"		_c5 *= 0.0;",
				"	} else {",
				"		_c0 *= 0.0;",
				"		_c1 *= 0.0;",
				"		_c2 *= 0.0;",
				"		_c3 *= 0.0;",
				"		_c4 *= 1.0 - ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"		_c5 *= ( clamp( _p, i4, i5 ) - i4 ) / ( i5 - i4 );",
				"	}",
				"	vec4 color = _c0 + _c1 + _c2 + _c3 + _c4 + _c5;",

				//	THE SUN
				"	float _d = distance( normalize( light ), normalize( vPosition ) )*100.0;",
				"	color += vec4( 1.0,1.0,1.0,0.1) * 3.0/_d;",

				"	gl_FragColor = color;",
				"}",
			].join( "\n" );

			var _colors = [
				new THREE.Color(0,0,0),
				new THREE.Color( 0,	0,	0 ),
				new THREE.Color( 0,	90,	117 ),
				new THREE.Color( 255,	255,	255 ),
				new THREE.Color( 92,	169,	199 ),
				new THREE.Color( 86,	183,	226 )
			];
			var _m = new THREE.ShaderMaterial({
				uniforms: {
					"time": { value: 0.0},
					"light": { value: v3},
					"colors" : {	type: "v4v",	value:  _colors },
					"intervals": {
						value: [
							0.0,
							0.1,
							0.35,
							0.5,
							0.65,
							1.0
						]
					}
				},
				vertexShader: _vertexShader,
				fragmentShader: _fragmentShader,
				transparent: true,
				side: THREE.BackSide
			});

			this.mesh = new THREE.Mesh( _g, _m );
		}
	};
	return Sky;
})();


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
		this.sky;
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

			var _gridHelper = new THREE.GridHelper( 3600, 24 );
			this.world.add( _gridHelper );

			//this.sky = new Sky( this.world.directional.position );
			//this.world.add( this.sky.mesh );

			//	描画 Prop
			this.grid = 3;
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
					__img.onerror = function(e){	_t.onError('Load Image Error, ' + e );	}
					__img.src = _data.src;
				}
				_img.onerror = function(e){	_t.onError('Load Image Error, ' + e );	}
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

			//	Debug
			var _img0 = new Image();
			_img0.src = this.mainCanvas.toDataURL();
			var _img0 = new Image();
			_img0.src = this.subCanvas.toDataURL();
		},
		resizeCanvas : function(){
			var _canvas = document.createElement('canvas');
			_canvas.width = 256;
			_canvas.height = 256;
			var _ctx = _canvas.getContext('2d');
			_ctx.drawImage( this.subCanvas, 0, 0, this.subCanvas.width, this.subCanvas.height, 0, 0, _canvas.width, _canvas.height = 256 );

			var _imagedata0 = this.subCtx.getImageData(0, 0, this.subCanvas.width, this.subCanvas.height);
			var _data0 = _imagedata0.data;

			var _imagedata1 = _ctx.getImageData(0, 0, _canvas.width, _canvas.height);
			var _data1 = _imagedata1.data;

			for( var i = 0; i < 256; i++ ){
				for( var j = 0; j < 256; j++ ){
					var _x = i * 3;
					var _y = j * 3;
					var _index1 = j * 256 * 3 + i * 3;
					var _index0 = j * 256 + i;
					_data1[ _index0 * 4 + 0 ] = _imagedata0[ _index1 * 4 + 0 ];
					_data1[ _index0 * 4 + 1 ] = _imagedata0[ _index1 * 4 + 1 ];
					_data1[ _index0 * 4 + 2 ] = _imagedata0[ _index1 * 4 + 2 ];
					_data1[ _index0 * 4 + 3 ] = _imagedata0[ _index1 * 4 + 3 ];
				}
			}


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

			var _area = 1024 * 2;
			_poslist = [[this.lat, this.lng]];
			for( var i = 0; i < 5; i++ ){
				var _lat = this.lat + ( random5() - 0.5 ) / Math.pow( 2, this.zoom ) * _area;
				var _lng = this.lng + ( random5() - 0.5 ) / Math.pow( 2, this.zoom ) * _area;
				_poslist.push( [ _lat, _lng ] );
			}

			function random5(){
				return ( Math.random() + Math.random() + Math.random() + Math.random() + Math.random() ) / 5;
			}

			this.pins = new TrekTrack.mapbox.Pins( _poslist, _heightTexture, this.scaleHeight, this.subCanvas, this.subCtx, this.grid, this.gridSize, this.zoom, this.tileX, this.tileY );
			this.world.add( this.pins.mesh );

			var _lineWidth = 0.5;
			var _lineDiv = 32;
			this.line = new TrekTrack.mapbox.Line( _poslist, _heightTexture, this.scaleHeight, this.subCanvas, this.subCtx, this.grid, this.gridSize, this.zoom, this.tileX, this.tileY, _lineWidth, _lineDiv );
			this.world.add( this.line.mesh );

			/*
							map offset
			*/
			var _imagedata = this.subCtx.getImageData(0, 0, this.subCanvas.width, this.subCanvas.height);
			var _data = _imagedata.data;
			var _r = _data[ 0 ];
			var _g = _data[ 1 ];
			var _b = _data[ 2 ];
			var _a = _data[ 3 ];
			var _offsetY = - 10000 + ((_r * 256 * 256 + _g * 256 + _b) * 0.1);
			_offsetY *= this.scaleHeight;

			var _vertices = this.field.mesh.geometry.vertices;
			var len = _vertices.length;
			for( var i = 0; i < len; i++ ){
				_vertices[i].y --;
			}
			var _vertices = this.line.mesh.geometry.vertices;
			var len = _vertices.length;
			for( var i = 0; i < len; i++ ){
				_vertices[i].y ++;
			}
			var _vertices = this.pins.mesh.geometry.vertices;
			var len = _vertices.length;
			for( var i = 0; i < len; i++ ){
				_vertices[i].y ++;
			}

			this.field.mesh.position.y = - _offsetY;
			this.pins.mesh.position.y = - _offsetY+ 1;
			this.line.mesh.position.y = - _offsetY + 1;


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
				"	vec4 viewLightPosition = viewMatrix * vec4( lightPosition, 0.0 );",
				"	vec3 N = normalize( vNormal );",
				"	vec3 L = normalize( viewLightPosition.xyz );",
				// "",
				"	float dotNL = dot( N, L );",
				"",
				"	vec3 diffuse = planeColor * lightColor * max( dotNL, 0.0 );",
				"	vec3 ambient = planeColor * ambientColor;",
				// "",
				// "	//  opacity",
				// "	float dist = length( vUv.xy );",
				// "	float _opacity = 1.0 - dist / 120.0;",
				"",
				"	float _opacity = 1.0;",
				"	vec4 _map = texture2D( MAPTexture, vUv );",

				"	vec3 hsv = RGBToHSV( _map.rgb );",
				"	hsv.y *= 1.10;",	//	s
				//"	hsv.z *= 1.20;",	//	v
				"	vec3 rgb = HSVToRGB( hsv );",
				"	_map.rgb = rgb;",

				//	/	HSV
				"	gl_FragColor = _map;",
				"	gl_FragColor *= vec4( diffuse + ambient, _opacity );",
				//"	gl_FragColor *= vec4( diffuse + ambient, _opacity );",
				"",
				"}"
			].join( "\n" );
			
			var _uniforms = {
				MAPTexture: { type: "t", value: _texture },
				DepthTexture: { type: "t", value: _heightTexture },
				scaleHeight: { type: "f", value: _scaleHeight },
				planeColor: {type: "c", value: new THREE.Color() },
				lightPosition: {type: "v3", value: new THREE.Vector3() },
				lightColor: {type: "c", value: new THREE.Color() },
				ambientColor: {type: "c", value: new THREE.Color() }
			};
			// _uniforms.lightPosition.value = _world.directional.position;
			// _uniforms.lightColor.value = _world.directional.color;
			// _uniforms.ambientColor.value = _world.ambient.color;

			_uniforms.lightPosition.value = new THREE.Vector3( 0, 1, 0 );
			_uniforms.lightColor.value = new THREE.Color(1,1,1);
			_uniforms.ambientColor.value = new THREE.Color( 0x454545 );


			var _material = new THREE.ShaderMaterial( {
				uniforms:	_uniforms,
				//attributes:     {},
				//defines: {},
				vertexShader:   _vertex,
				fragmentShader: _fragment,
				side: THREE.DoubleSide,
				transparent: true,
				//	fog: true
			});

			_geometry.computeBoundingBox();
			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

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
				"	vec2 vUv = vec2( position.x, - position.z ) / gridSize + 0.5;",
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
				pointSize: { type: "f", value: 16.0 },
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

			_geometry.computeBoundingBox();
			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

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

				_newGeometry.faces.push( new THREE.Face3( i * 4 + 2, i * 4 + 1, i * 4 + 0 ) );
				_newGeometry.faces.push( new THREE.Face3( i * 4 + 2, i * 4 + 3, i * 4 + 1 ) );
			}

			//	Line Joint	
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

			//	Line Caps
			var _len = 8;
			var _p1 = _newGeometry.vertices[0];
			var _p2 = _newGeometry.vertices[1];
			var _p3 = new THREE.Vector3().subVectors( _p2, _p1 );
			var _p0 = new THREE.Vector3().addVectors( _p1, _p2 ).multiplyScalar( 0.5 );
			var _rad = Math.atan2( _p3.z, _p3.x );
			var _index00 = _newGeometry.vertices.length;
			var _index0 = _newGeometry.vertices.length;
			_newGeometry.vertices[ _index0 ] = new THREE.Vector3( _geometry.vertices[0].x, _geometry.vertices[0].y, _geometry.vertices[0].z );

			for( var i = 0; i < _len; i++ ){

				var _x = Math.cos( _rad ) * _lineWidth * 0.5;
				var _z = Math.sin( _rad ) * _lineWidth * 0.5;
				var _p00 = new THREE.Vector3( _x, 0, _z ).add( _p0 );

				_rad -= 1 / _len * Math.PI;
				var _x = Math.cos( _rad ) * _lineWidth * 0.5;
				var _z = Math.sin( _rad ) * _lineWidth * 0.5;
				var _p01 = new THREE.Vector3( _x, 0, _z ).add( _p0 );


				var _index1 = _newGeometry.vertices.length;
				_newGeometry.vertices[ _index1 ] = new THREE.Vector3( _p00.x, _p00.y, _p00.z );
				var _index2 = _newGeometry.vertices.length;
				_newGeometry.vertices[ _index2 ] = new THREE.Vector3( _p01.x, _p01.y, _p01.z );
				_newGeometry.faces.push( new THREE.Face3( _index0, _index1, _index2 ) );
			}

			var _p1 = _newGeometry.vertices[ _index00 - 2 ];
			var _p2 = _newGeometry.vertices[ _index00 - 1 ];
			var _p3 = new THREE.Vector3().subVectors( _p2, _p1 );
			var _p0 = new THREE.Vector3().addVectors( _p1, _p2 ).multiplyScalar( 0.5 );
			var _rad = Math.atan2( _p3.z, _p3.x );
			var _index0 = _newGeometry.vertices.length;
			var _lastIndex = _geometry.vertices.length - 1;
			_newGeometry.vertices[ _index0 ] = new THREE.Vector3( _geometry.vertices[_lastIndex].x, _geometry.vertices[_lastIndex].y, _geometry.vertices[_lastIndex].z );

			for( var i = 0; i < _len; i++ ){

				var _x = Math.cos( _rad ) * _lineWidth * 0.5;
				var _z = Math.sin( _rad ) * _lineWidth * 0.5;
				var _p00 = new THREE.Vector3( _x, 0, _z ).add( _p0 );

				_rad += 1 / _len * Math.PI;
				var _x = Math.cos( _rad ) * _lineWidth * 0.5;
				var _z = Math.sin( _rad ) * _lineWidth * 0.5;
				var _p01 = new THREE.Vector3( _x, 0, _z ).add( _p0 );


				var _index1 = _newGeometry.vertices.length;
				_newGeometry.vertices[ _index1 ] = new THREE.Vector3( _p00.x, _p00.y, _p00.z );
				var _index2 = _newGeometry.vertices.length;
				_newGeometry.vertices[ _index2 ] = new THREE.Vector3( _p01.x, _p01.y, _p01.z );
				_newGeometry.faces.push( new THREE.Face3( _index2, _index1, _index0 ) );
			}

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


			_geometry.computeBoundingBox();
			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

			this.mesh = new THREE.Mesh( _geometry, _material );
		}
	};

	return TTLine;
})();






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


