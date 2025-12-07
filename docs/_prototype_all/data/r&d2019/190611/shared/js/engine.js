/*
	engine.js
*/

window.onload = function(){

	var style="color:white;background-color:#484848;padding: 3px 6px;";
	window.console.log("%cSkyNet - v1.0.0" , style);
	window.console.log("%ccreated by nulldesign.jp" , style);

	if( location.href.indexOf('https://') != -1 )
	{
		window.console.log = function(){/* NOP */};
		window.console.debug = function(){/* NOP */};
		window.console.info = function(){/* NOP */};
		window.console.warn = function(){/* NOP */};
		window.console.error = function(){/* NOP */};
		window.console.timeEnd = function(){/* NOP */};
		window.console.time = function(){/* NOP */};
	}

	// window.console.log = function(){/* NOP */};
	// window.console.debug = function(){/* NOP */};
	// window.console.info = function(){/* NOP */};
	window.console.warn = function(){/* NOP */};
	// window.console.error = function(){/* NOP */};
	window.console.timeEnd = function(){/* NOP */};
	window.console.time = function(){/* NOP */};

	var _icons = ['ico00.svg','ico01.svg','ico02.svg','ico03.svg','ico04.svg','ico05.svg','ico06.svg','ico07.svg','ico08.svg','ico09.svg','ico10.svg','ico11.svg','ico12.svg','ico13.svg','ico14.svg','ico15.svg','ico16.svg','ico17.svg','ico18.svg','ico19.svg','ico20.svg','ico21.svg','ico22.svg','ico23.svg','ico24.svg','ico25.svg','ico26.svg','ico27.svg','ico28.svg','ico29.svg','ico30.svg','ico31.svg','ico32.svg','ico33.svg','ico34.svg','ico35.svg','ico36.svg','ico37.svg','ico38.svg','ico39.svg','ico40.svg','ico41.svg','ico42.svg','ico43.svg','ico45.svg','ico46.svg','ico47.svg','ico48.svg','ico49.svg','ico50.svg','ico51.svg','ico52.svg','ico53.svg','ico54.svg','ico55.svg','ico56.svg','ico57.svg','ico58.svg','ico59.svg','ico60.svg','ico61.svg','ico62.svg','ico63.svg','ico64.svg','ico65.svg','ico66.svg','ico67.svg','ico68.svg','ico69.svg','ico70.svg','ico71.svg','ico72.svg','ico73.svg','ico74.svg','ico75.svg','ico76.svg','ico77.svg','ico78.svg','ico79.svg','ico80.svg','ico81.svg','ico82.svg','ico83.svg','ico84.svg','ico85.svg'];
	var _toDay = new Date().getDay();
	_toDay = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][_toDay];

	//	test
	var _domain = 'http://lab.nulldesign.jp/skynet_v6/main/';
	var _ana = _domain + 'shared/data/odpt.php?Operator=ANA&toDay=' + _toDay;
	var _jal = _domain + 'shared/data/odpt.php?Operator=JAL&toDay=' + _toDay;

	//	Props
	var _world, _particle, _sea, _sun, _cloud, _grid, _clock;
	var _center;	//	国内空港の中心座興
	var _xml,_data;	//	_xmlはairport.xml生データ。_dataはパースしたもの
	var PI = Math.PI;

	//	地図系パラメータ
	var _hVector = 200;
	var _vVector = 0.5;
	var _scale = 100.0;

	//	データ群
	var _lines = {};
	var _updateTimeList = [];

	//	空港オブジェクト
	var _airportList = [];
	var _pos = {};
	var _airportObjects;

	//	flight
	//	飛行ルート系
	var _div = 3200;	//	空路の曲線分割数
	var _maxAirPlanes = 600;	//	計算上の最大飛行中航空機数
	var _airRuteLength = 60;	//	飛行機雲の長さ
	var _airDynamicLine;	//	飛行機雲
	var _airStaticLine;		//	空路
	var _inAirList = [];	//	フライト中の航空機リスト

	var _masterTime = 0;	//	グローバルタイム
	var _masterTimeNature = 0;	//時間系更新リストへ渡す（日付でのリセット無し
	var _timeScale = 1.0;	//	タイムラプス係数
		var _date = new Date();
		var _h = _date.getHours();
		var _m = _date.getMinutes();
		var _s = _date.getSeconds();
	_masterTime = _h * 60 * 60 + _m * 60 + _s;
	_masterTimeNature = 0;

	//	DOM
	var _currentTime = document.getElementById('currentTime');
	var _message = document.getElementById('loadingMessage');
	var _vartualDom = $('<div>').addClass('vDom');

	var _letter = document.getElementById('letter');
	var _letter_ja = document.getElementById('letter_ja');
	var _letter_en = document.getElementById('letter_en');

	var _changeCameraViewKey, _restartChangeCamerakey;

	//	テスト
	var _stats;

	//	配色関係
	var TC = THREE.Color;
	var _colors = [
		{	start: 0,	end: 1,		name:'深夜',	skyColor: new TC( 8, 25, 32 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 3, 3, 9 ).multiplyScalar( 1 / 255 )	},
		{	start: 1,	end: 5,		name:'深夜',	skyColor: new TC( 16, 16, 16 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 3, 3, 9 ).multiplyScalar( 1 / 255 )	},
		{	start: 5,	end: 6,		name:'--',	skyColor: new TC( 8, 25, 45 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 3, 3, 9 ).multiplyScalar( 1 / 255 )	},
		{	start: 6,	end: 8,		name:'早朝',	skyColor: new TC( 63, 99, 168 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 51, 51, 75 ).multiplyScalar( 1 / 255 )	},
		{	start: 8,	end: 11,	name:'朝',	skyColor: new TC( 187, 200, 230 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 75, 104, 75 ).multiplyScalar( 1 / 255 )	},
		{	start: 11,	end: 17,	name:'午後',	skyColor: new TC( 165, 222, 228 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 75, 104, 75 ).multiplyScalar( 1 / 255 )	},
		{	start: 17,	end: 19,	name:'夕方',	skyColor: new TC( 249,94,28 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 153, 51, 51 ).multiplyScalar( 1 / 255 )	},
		{	start: 19,	end: 23,	name:'夜',	skyColor: new TC( 15, 37,	36 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 51, 51, 51 ).multiplyScalar( 1 / 255 )	},
		{	start: 23,	end: 24,	name:'深夜',	skyColor: new TC( 8, 25, 32 ).multiplyScalar( 1 / 255 ),	seaColor: new TC( 3, 3, 9 ).multiplyScalar( 1 / 255 )	}
	];

	//	スマホ系への対応
	var _ua = window.navigator.userAgent;
	var isSp = false;
	_ua = _ua.toLowerCase();
	if( _ua.indexOf('iphone') != -1 || _ua.indexOf('android') != -1 )
	{
		$('body').addClass('sp');
		isSp = true;
	}


	//	stats
	//_stats = new Stats();
	//$('#container').append( _stats.dom );
	// $( _stats.dom ).css({
	// 	'left':'inherit',
	// 	'right':'0px'
	// });


	var _dataBase = {};
	var _flightSchduleData = [];
	var _fileList = [
		{
			name: 'airport',
			url: 'shared/data/airport.xml',
			type: 'GET',
			dataType: 'XML',
			data: null
		},
		{
			name: 'ana',
			url: _ana,
			type: 'GET',
			dataType: 'JSON',
			data: null
		},
		{
			name: 'jal',
			url: _jal,
			type: 'GET',
			dataType: 'JSON',
			data: null
		}
	];

	var _runway;
	var _svgs = [];

	var _total = _icons.length;

	//	
	_message.innerHTML = 'Loading World Data....';

	var _minWidth = Math.min( window.innerWidth, window.innerHeight );
	var _weight = _minWidth <= 320? 'light':'normal';
	$.ajax({
		url: "shared/js/coastLine."+_weight+".js",
		type: "GET",
		dataType: "script",
		success: function( _script )
		{
			setTimeout( preloadData, 10 );
		}
	});
	//	start!!!
	//preloadData();

	function preloadData()
	{
		if( _icons.length )
		{
			var _file = _icons.pop();
			var guiData = {
				currentURL: 'shared/img/icons/' + _file,
				drawFillShapes: true,
				drawStrokes: true,
				fillShapesWireframe: false,
				strokesWireframe: false
			}

			loadSVG( guiData, function( _mesh ){
				_svgs.push( _mesh );
				_message.innerHTML = 'Loading Site Data.... ' + _svgs.length + ' / ' + _total;
				setTimeout( preloadData, 1 );
			});



		} else {
			var guiData = {
				currentURL: 'shared/img/icons/runway01.svg',
				drawFillShapes: true,
				drawStrokes: true,
				fillShapesWireframe: false,
				strokesWireframe: false
			}
			loadSVG( guiData, function( _mesh ){
				_runway = _mesh;
				_runway.scale.set( 0.25, 0.25, 0.25 );
				setTimeout( loadAPI, 1 );
			});
		}
	}

	function loadAPI()
	{
		if( _fileList.length )
		{
			var _obj = _fileList.pop();

			_message.innerHTML = 'Loading ' + _obj.name + ' DATA....';

			//	geo data.
			$.ajax({
				url: _obj.url,
				type: _obj.type,
				dataType: _obj.dataType
			}).
			then(
				function ( _data )
				{
					_dataBase[ _obj.name ] = {};
					_dataBase[ _obj.name ].src = _obj;
					_dataBase[ _obj.name ].data = _data;

					setTimeout( loadAPI, 10 );
					//	loadAPI()
				},
				function ()
				{
					console.log( _obj.url + ' load error.' );
				}
			);
		} else {

			_message.innerHTML = 'Parse FlightSchdule DATA....';

			//	
			_xml = _dataBase.airport.data;

			_allAirPlaneList = [];

			//	ANA + JAL
			_flightSchduleData = _dataBase.ana.data.concat( _dataBase.jal.data );	//	4.91sec

			var _list = _flightSchduleData;
			var len = _list.length;
			for( var i = 0; i < len; i++ )
			{
				//	飛行予定を抜き出す
				var _target = _list[i];
				var _operator = _target['odpt:operator'];
				var _destinationAirport = _target['odpt:destinationAirport'];
				var _originAirport = _target['odpt:originAirport'];

				var _l = _target['odpt:flightScheduleObject'];
				var _len = _l.length;
				for( var j = 0; j < _len; j++ )
				{
					var _departure = _l[j]['odpt:originTime'];
					var _arrival = _l[j]['odpt:destinationTime'];
					//var _originDayDifference = _l[j]['odpt:originDayDifference'];
					//var _destinationDayDifference = _l[j]['odpt:destinationDayDifference'];

					var _val = _departure.split(':');
					_departure = parseInt( _val[0] ) * 60 + parseInt( _val[1] );

					var _val = _arrival.split(':');
					_arrival = parseInt( _val[0] ) * 60 + parseInt( _val[1] );

					// min to sec	
					_departure	*=	60;
					_arrival	*=	60;

					//	出発時間が日付変更前であれば補正
					if( _departure > _arrival )
					{
						_departure -= 86400;
					}

					//	フライト時間
					var _duration = _arrival - _departure;

					//	public
					_l[j].operator = _operator;
					_l[j].destinationAirport = _destinationAirport.replace('odpt.Airport:','');
					_l[j].originAirport = _originAirport.replace('odpt.Airport:','');

					//	private
					_l[j].departure	=	_departure;
					_l[j].arrival	=	_arrival;
					_l[j].duration	=	_duration;
					//_l[j].originDayDifference	=	_originDayDifference;
					//_l[j].destinationDayDifference	=	_destinationDayDifference;
					_l[j].isInAir	=	false;

					_allAirPlaneList.push( _l[j] );

					//	出発時間が日付変更前であれば補正	
					if( _departure < 0 )
					{
						var _obj = JSON.parse(JSON.stringify(_l[j]));
						_obj.departure += 86400;
						_obj.arrival += 86400;
						_allAirPlaneList.push( _obj );
					}
				}
			}

			//	出発時刻で並べ替え
			_allAirPlaneList.sort( compare );

			_message.innerHTML = 'Generate World....';
			setTimeout( init, 10 );
			//	init();
		}
	}

	function init(){
		_world = new world('webglView');
		_world.controls.autoRotate = true;
		_world.controls.enabled = true;
		_clock = new THREE.Clock();

		//	sky
		// var _sky = new Sky( _world.directional.position );
		// _world.camera.add( _sky.mesh );

		//	SEA
		_sea = createSea();
		_world.add( _sea );

		//	CLOUD
		_cloud = createCloud();
		_world.add( _cloud );
		_updateTimeList.push( _cloud );	//	時間更新リストに追加

		//	GRID
		_grid = createGrid();
		_world.add( _grid );

		//	airplane route line
		_airDynamicLine = createAirDynamicLine();
		_world.add( _airDynamicLine );

		_sun = _world.directional;
		//	position.set( 45, 35, 105 );

		//	
		// var _bgColor = new THREE.Color( Math.random(), Math.random(), Math.random() );
		// _world.scene.fog.color = _bgColor;
		// _world.renderer.setClearColor( _bgColor );
		//	_sea.material.color = new THREE.Color(1,1,1).multiplyScalar(0.35);


		//	parse _xml to _data array.
		var _lat = 0;
		var _lng = 0;
		var _domesticCount = 0;
		_data = [];
		$( _xml ).find('airport').each(function(i,e){

			var _airport = {};
			_airport.id = $( this ).attr('idt');
			_airport.idf = $( this ).attr('idf');
			_airport.name = $( this ).find('name').text();
			_airport.english = $( this ).find('english').text();
			_airport.lat = parseFloat( $( this ).find('lat').text() );
			_airport.lng = parseFloat( $( this ).find('lng').text() );
			_airport.runway = $( this ).find('runway').text();
			_airport.service = $( this ).find('service').text();
			_airport.belong = $( this ).find('belong').text();
			_airport.area = $( this ).find('area').text();
			_airport.mesh = null;

			//	
			if( _airport.service == 'domestic' )
			{
				_lat += _airport.lat;
				_lng += _airport.lng;
				_domesticCount++;
			} else {
				//	日本の反対側を境に補正を入れる
				var _j = 139.753315 - 180.0;	//	ÓðÌï¤Î·´Œ‚È¤ò»ùœÊ¤Ë...

				if( _airport.lng < _j )
				{
				// 	console.log( _airport.name )
					_airport.lng += 360.0;
				}
			}
			
			_data.push( _airport );
		});

		_domesticCount = _domesticCount==0?1:_domesticCount;
		_lat /= _domesticCount;
		_lng /= _domesticCount;

		//	random
		//var _no = Math.floor( Math.random() * _data.length );
		//_lat = _data[ _no ].lat;
		//_lng = _data[ _no ].lng;

		// HND
		_lat = 35.557755;
		_lng = 139.753315;

		_center = {};
		_center.lat = _lat;
		_center.lng = _lng;


		//	pseudo map
		var _cline = createCoastLine();
		_world.add( _cline );




		//	https://medium.com/@jonas_duri/enable-dark-mode-with-css-variables-and-javascript-today-66cedd3d7845
		/*
		if(matchMedia('(prefers-color-scheme: dark)').matches) {
		 // your dark mode code
		}
		*/


		_message.innerHTML = 'Generate Airport and FlightData....';
		setTimeout( _initialize, 10 );
		//	_initialize();
	}

	function _initialize()
	{
		//	空港と滑走路の配置
		var _geometry = new THREE.Geometry();
		var len = _data.length;
		for( var i = 0; i < len; i++ )
		{
			var _lat = _data[i].lat - _center.lat;
			var _lng = _data[i].lng - _center.lng;
			_lat *= _scale;
			_lng *= _scale;

			var _index = ~~( _svgs.length * Math.random() );
			var _circle = _svgs[_index].clone();
			var _aPos = new THREE.Vector3( _lng, 0.25, - _lat );
			_data[i].mesh = _aPos.clone();

			var len0 = _circle.children.length;
			for( var j = 0; j < len0; j++ )
			{
				var _matrix40 = new THREE.Matrix4();
				_matrix40.makeRotationY( _circle.rotation.y );
				var _matrix41 = new THREE.Matrix4();
				_matrix41.makeTranslation(
					_aPos.x,
					_aPos.y,
					_aPos.z
				);
				var _matrix4 = new THREE.Matrix4().multiplyMatrices( _matrix41, _matrix40 );
				var _bg = new THREE.Geometry().fromBufferGeometry( _circle.children[j].geometry );
				_geometry.merge( _bg, _matrix4 );
			}

			//	RUNWAY	
			var _rw = eval( _data[i].runway );
			var _rLen = _rw.length;
			var _past = undefined;
			for( var j = 0; j < _rLen; j++ )
			{
				if( _past != _rw[j][1] )
				{
					_past = _rw[j][1];
					var __runway = _runway.clone();
					var len0 = __runway.children.length;
					for( var k = 0; k < len0; k++ )
					{
						var _matrix40 = new THREE.Matrix4();
						_matrix40.makeRotationY( ( - _rw[j][1] * 10.0 - 0 ) / 180.0 * PI );
						var _matrix41 = new THREE.Matrix4();
						_matrix41.makeTranslation(
							_aPos.x,
							0,
							_aPos.z
						);
						var _matrix4 = new THREE.Matrix4().multiplyMatrices( _matrix41, _matrix40 );
						var _bg = new THREE.Geometry().fromBufferGeometry( __runway.children[k].geometry );
						_geometry.merge( _bg, _matrix4 );
					}

				}
			}
		}

		var _material = _svgs[0].children[0].material;
		_airportObjects = new THREE.Mesh( _geometry, _material );
		_world.add( _airportObjects );





		//	空港の座標の保持と、空港間のルートリストを生成
		var _checkStr = '';
		//var _pos = {};
		//var _airportList = [];
		var _ana = _flightSchduleData;
		for( var i = 0; i < len; i++ )
		{
			_pos[ _data[i].id ] = _data[i].mesh;
		}

		//	データの調整
		for( var i = 0; i < _ana.length; i++ )
		{
			//	空港の３レターコードを取得
			var _origin = _ana[i]['odpt:originAirport'].split(':')[1];
			var _destination = _ana[i]['odpt:destinationAirport'].split(':')[1];

			//	登録済み空路の確認
			var _chk0 = _checkStr.indexOf( _origin + _destination ) != -1;
			var _chk1 = _checkStr.indexOf( _destination + _origin ) != -1;

			//	３レターコードがあって、未登録空路であれば新たに空路を描く
			if( 
				_pos[ _origin ] != undefined &&
				_pos[ _destination ] != undefined &&
				!_chk0 && !_chk1
			)
			{
				//	XMLからごりっと持ってくる。美しくない。
				var _db = $( _dataBase.airport.data );

				var _r0 = [[]];
				var _r1 = [[]];

				var _d0 = false;
				var _d1 = false;
				_db.find("airport[idt="+_origin+"]").each(function() {
					_r0 = eval( $(this).find('runway').text() );
				});
				_db.find("airport[idt="+_destination+"]").each(function() {
					_r1 = eval( $(this).find('runway').text() );
				});

				_db.find("airport[idt="+_origin+"]").each(function() {
					_d0 = $(this).find('service').text() == 'domestic';
				});
				_db.find("airport[idt="+_destination+"]").each(function() {
					_d1 = $(this).find('service').text() == 'domestic';
				});
				_airportList.push({
					originAirport: _origin,
					destinationAirport: _destination,
					origin: _pos[ _origin ],
					destination: _pos[ _destination ],
					runway0: _r0,
					runway1: _r1,
					isDomestic: _d0 && _d1
				});
			}

			//	描画済み空路リストに登録
			_checkStr += _origin;
			_checkStr += _destination;
			_checkStr += _origin;
		}

		//	エアライン生成（静的な方
		var _plist = [];
		var _clist = [];
		var len = _airportList.length;

		concatAirLineData( 0, len );

		function concatAirLineData( i, len )
		{
			if( i >= len )
			{
				_message.innerHTML = 'Generate Airport and FlightData.... 100%';
				//	execute
				//	エアライン生成（動的な方
				_airStaticLine = createAirStaticLines( _plist, _clist );
				_world.add( _airStaticLine );
				
				//	パーティクル生成
				_particle = createParticles();
				_world.add( _particle );

				

				//	初期カメラ
				if( location.hash != '' )
				{
					var _hash = location.hash.replace('#','');
					var _p = _pos[_hash];
					_world.camera.position.x =  _p.x;
					_world.camera.position.z =  _p.z;
					_world.focus.x =  _p.x;
					_world.focus.z =  _p.z;
					_world.camera.position.y =  Math.random() * 100 + 32;
				}

				//	カメラコントロール機能
				changeCameraView();	



				//	events
				addEvents();

				//	初期化終了。コンテンツスタート（長かった
				start();
				return;
			} else {
				_message.innerHTML = 'Generate Airport and FlightData.... ' + Math.floor( i / len * 100 ) + '%';

				var _originAirport = _airportList[i].originAirport;
				var _destinationAirport = _airportList[i].destinationAirport;
				var _circle0 = _airportList[i].origin;
				var _circle1 = _airportList[i].destination;
				var _runway0 = _airportList[i].runway0;
				var _runway1 = _airportList[i].runway1;
				var _isDomestic = _airportList[i].isDomestic;

				//	in out	runway
				var _adj = 90;
				var _index = ~~( Math.random() * _runway0.length );
				var _rad0 = ( _runway0[_index][0] * 10.0 - _adj ) / 180.0 * PI;

				var _index = ~~( Math.random() * _runway1.length );
				var _rad1 = ( _runway1[_index][1] * 10.0 - _adj ) / 180.0 * PI;

				var _dist = new THREE.Vector3().subVectors( _circle0, _circle1 ).length() * 0.5;
				var _r = _dist>_hVector?_hVector:_dist;

				//	 ３次元ペジェ曲線の生成箇所の負荷は注意すること（重たい
				var curve = new THREE.CubicBezierCurve3(
					_circle0,
					new THREE.Vector3().addVectors( _circle0, new THREE.Vector3( Math.cos( _rad0 ) * _r, 0, Math.sin( _rad0 ) * _r ) ),
					new THREE.Vector3().addVectors( _circle1, new THREE.Vector3( Math.cos( _rad1 ) * _r, 0, Math.sin( _rad1 ) * _r ) ),
					_circle1
				);
				var points = curve.getPoints( _div );
				var geometry = new THREE.BufferGeometry().setFromPoints( points );


				var _skyScale = _dist / 200 * 0.2 * _vVector;	//	½}µÄ¤ÊÑaÕý
				_skyScale = _skyScale > 0.5?0.5:_skyScale;	//	international line
				var _height = 200 * _skyScale + Math.random() * 20.0;

				var _dat = [];
				var _array = geometry.attributes.position.array;
				var len0 = _array.length;
				for( var k = 0; k < len0; k+= 3 )
				{
					var _max = _array.length;
					var _rad = k / _max * PI * 2.0 - PI * 0.5;
					var _sin = Math.sin( _rad ) * 0.5 + 0.5;
					var _value = _sin * _height;
					_array[ k + 1 ] = _value;

					_dat.push( new THREE.Vector3( _array[k], _array[k+1], _array[k+2] ) )
				}

				_lines[ _originAirport + _destinationAirport ] = _dat;
				_lines[ _destinationAirport + _originAirport ] = _dat.reverse();


				var __plist = [];
				var __clist = [];
				var _array = geometry.attributes.position.array;
				var lenAttr = geometry.attributes.position.count;

				//	POSITION
				__plist.push( new THREE.Vector3( _array[0],_array[1],_array[2] ));
				for( var j = 1; j < lenAttr - 1; j++ )
				{
					var _index = j * 3;
					__plist.push( new THREE.Vector3( _array[_index+0],_array[_index+1],_array[_index+2] ));
					__plist.push( new THREE.Vector3( _array[_index+0],_array[_index+1],_array[_index+2] ));
				}

				__plist.push( new THREE.Vector3( _array[lenAttr * 3 - 3],_array[lenAttr * 3 - 2],_array[lenAttr * 3 - 1] ));



				//	OPACITY
				__clist.push( 1.0 - Math.sin( 0 / lenAttr * 3.1416 ) );
				for( k = 1; k < lenAttr-1; k++ )
				{
					var _opacity = 1.0 - Math.sin( k / lenAttr * 3.1416 );
					_opacity = _opacity * _opacity;
					__clist.push( _opacity );
					__clist.push( _opacity );
				}

				var _opacity = 1.0 - Math.sin( (lenAttr-1) / lenAttr * 3.1416 );
				_opacity = _opacity * _opacity;
				__clist.push( _opacity );


				// Create the final object to add to the scene
				if( _isDomestic )
				{
					_plist = _plist.concat( __plist );
					_clist = _clist.concat( __clist );
				}

				i++;
				setTimeout(function(){
					concatAirLineData( i, len );
				},1)
			}

		}

	}

	function start()
	{
		setTimeout( function(){
			//	メッセージ更新
			_message.innerHTML = 'Initialize Complete....';

			$('#currentTime').css({'display':'none'});
			$('#currentDate').css({'display':'none'});
			$('#letterInfo').css({'display':'none'});
			_start();
			setTimeout( function(){
				var _date = new Date();
				var _y = _date.getFullYear();
				var _m = _date.getMonth() + 1;
				var _d = _date.getDate();
				var _day = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][_date.getDay()];

				_m = new String( _m + 100 ).substr( 1, 2 );
				_d = new String( _d + 100 ).substr( 1, 2 );

				$('#currentDate').text( _y + '.' + _m + '.' + _d + ' [ ' + _day + ' ]' );

				//start();

				$('#currentTime').css({'display':'block'});
				$('#currentDate').css({'display':'block'});
				$('#letterInfo').css({'display':'block'});

				$('#siteBody').addClass('open');
				$('#currentTime').addClass('fadeIn');
				$('#currentDate').addClass('fadeIn');
				$('#letterInfo').addClass('fadeIn');
				$('#menuButton').addClass('fadeIn');

				//	release
				setTimeout(function(){
					$('#loading').remove();
					$('#loadingMessage').remove();
					_message = null;
				},3000);

				//	console.log( 'All Object:', _world.scene.children );
			}, 500 );
		}, 1000 );

	}

	function _start(){
		loop( Math.random() * 100000 );

	}

	function loop( _stepTime ){

		window.requestAnimationFrame( loop );

		//	時間の更新
		var _deltaTime = _clock.getDelta();
		_masterTime = _masterTime + _deltaTime * _timeScale;
		_masterTimeNature = _masterTimeNature + _deltaTime * _timeScale

		//	日付を超えたかの確認
		if( _masterTime > 86400 )
		{
			_masterTime = 0;
			var len = _allAirPlaneList.length;
			while( len )
			{
				len--;
				_allAirPlaneList[len].isInAir = false;
			}

			//	念のためリセット
			_inAirList = [];
		}

		//	現在時刻の更新
		var _jclock = getTimeView( _masterTime );
		_currentTime.innerHTML = _jclock;

		//	到着したかどうかの確認
		var len = _inAirList.length;
		while( len )
		{
			len--;
			var _plane = _inAirList[len];
			if( _plane.arrival < _masterTime )
			{
				_inAirList.splice( len, 1 );
			}
		}

		//	出発したかどうかの確認
		var len = _allAirPlaneList.length;
		for( var i = 0; i < len; i++ )
		{
			var _plane = _allAirPlaneList[i];
			if( _plane.departure <= _masterTime && !_plane.isInAir )
			{
				_plane.isInAir = true;
				_inAirList.push( _plane );
			}
		}

		//	reset
		//	他の手法 drawAble とかで代用できない？
		var _vertices = _airDynamicLine.geometry.vertices;
		var len = _vertices.length;
		while( len )
		{
			len--;
			_vertices[len].x = 0;
			_vertices[len].y = 10000;
			_vertices[len].z = 0;
		}

		var _vertices = _particle.geometry.vertices;
		var len = _vertices.length;
		while( len )
		{
			len--;
			_vertices[len].x = 0;
			_vertices[len].y = 10000;
			_vertices[len].z = 0;
		}

		var _useIndexCount = 0;
		var len = _inAirList.length;

		for( var i = 0; i < len; i++ )
		{
			var _departure = _inAirList[i].departure;
			var _arrival = _inAirList[i].arrival;
			var _duration = _inAirList[i].duration;
			var _origin = _inAirList[i].originAirport;
			var _destination = _inAirList[i].destinationAirport;

			//	運行が終わった機はスキップ
			if( _masterTime > _arrival || !_inAirList[i].isInAir )
			{
				continue;
			}

			if( _lines[ _origin + _destination ] != undefined )
			{
				var _line = _lines[ _origin + _destination ];
				var _par = ( _masterTime - _departure ) / _duration;
				var _index = ~~( ( _line.length - 1 ) * _par );
				var _p = _line[ _index ];

				//	lineSegments処理
				var _vertices = _particle.geometry.vertices;
				_vertices[_useIndexCount].x = _p.x;
				_vertices[_useIndexCount].y = _p.y;
				_vertices[_useIndexCount].z = _p.z;

				var _lineIndex = _useIndexCount * _airRuteLength;

				//	draw start
				_airDynamicLine.geometry.vertices[_lineIndex].x = _p.x;
				_airDynamicLine.geometry.vertices[_lineIndex].y = _p.y;
				_airDynamicLine.geometry.vertices[_lineIndex].z = _p.z;
				_lineIndex++;

				for( var j = 1; j < _airRuteLength; j++ )
				{
					_index--;
					_index = _index>0?_index:0;
					_p = _line[ _index ];

					//	draw end
					_airDynamicLine.geometry.vertices[_lineIndex].x = _p.x;
					_airDynamicLine.geometry.vertices[_lineIndex].y = _p.y;
					_airDynamicLine.geometry.vertices[_lineIndex].z = _p.z;
					_lineIndex++;

					//	draw start
					_airDynamicLine.geometry.vertices[_lineIndex].x = _p.x;
					_airDynamicLine.geometry.vertices[_lineIndex].y = _p.y;
					_airDynamicLine.geometry.vertices[_lineIndex].z = _p.z;
					_lineIndex++;
				}

				_index--;
				_index = _index>0?_index:0;
				_p = _line[ _index ];

				//	draw end
				_airDynamicLine.geometry.vertices[_lineIndex].x = _p.x;
				_airDynamicLine.geometry.vertices[_lineIndex].y = _p.y;
				_airDynamicLine.geometry.vertices[_lineIndex].z = _p.z;
				_lineIndex++;

				_useIndexCount++;
			}
		}

		_particle.geometry.verticesNeedUpdate = true;
		_airDynamicLine.geometry.verticesNeedUpdate = true;

		_particle.geometry.computeBoundingSphere();
		_airDynamicLine.geometry.computeBoundingSphere();

		var len = _updateTimeList.length;
		while( len )
		{
			len --;
			_updateTimeList[len].material.uniforms.time.value = _masterTimeNature;
		}

		_cloud.material.uniforms.time.value = _masterTimeNature * 0.02;



		//if( !isSp )
		{
			var _checkTime = _masterTime / 3600;
			var _par = 1;
			var _index = 0;
			if( _checkTime >= _colors[0].start && _checkTime < _colors[0].end )
			{
				_par = ( _checkTime - _colors[0].start ) / ( _colors[0].end - _colors[0].start );
				_index = 0;
			} else if( _checkTime >= _colors[1].start && _checkTime < _colors[1].end )
			{
				_par = ( _checkTime - _colors[1].start ) / ( _colors[1].end - _colors[1].start );
				_index = 1;
			} else if( _checkTime >= _colors[2].start && _checkTime < _colors[2].end )
			{
				_par = ( _checkTime - _colors[2].start ) / ( _colors[2].end - _colors[2].start );
				_index = 2;
			} else if( _checkTime >= _colors[3].start && _checkTime < _colors[3].end )
			{
				_par = ( _checkTime - _colors[3].start ) / ( _colors[3].end - _colors[3].start );
				_index = 3
			} else if( _checkTime >= _colors[4].start && _checkTime < _colors[4].end )
			{
				_par = ( _checkTime - _colors[4].start ) / ( _colors[4].end - _colors[4].start );
				_index = 4
			} else if( _checkTime >= _colors[5].start && _checkTime < _colors[5].end )
			{
				_par = ( _checkTime - _colors[5].start ) / ( _colors[5].end - _colors[5].start );
				_index = 5;
			} else 
			{
				_par = ( _checkTime - _colors[6].start ) / ( _colors[6].end - _colors[6].start );
				_index = 6;
			}
			var len = _colors.length;
			var _colorA = _colors[ ( _index - 1 + len ) % len ].skyColor.clone();
			var _colorB = _colors[ _index ].skyColor.clone();
			var _colorC = _colors[ ( _index + 1 ) % len ].skyColor.clone();
			var _skyColor;

			var _colorD = _colors[ ( _index - 1 + len ) % len ].seaColor.clone();
			var _colorE = _colors[ _index ].seaColor.clone();
			var _colorF = _colors[ ( _index + 1 ) % len ].seaColor.clone();
			var _seaColor;
			if( _par <= 0.5 )
			{
				_skyColor = _colorA.lerp( _colorB, _par + 0.5 );
				_seaColor = _colorD.lerp( _colorE, _par + 0.5 );
			} else {
				_skyColor = _colorB.lerp( _colorC, _par - 0.5 );
				_seaColor = _colorE.lerp( _colorF, _par - 0.5 );
			}

			_world.scene.fog.color = _skyColor;
			_world.renderer.setClearColor( _skyColor );
			_sea.material.color = _seaColor;

			
		}
		//	update sun
		//	_sun = _world.directional;
		//	position.set( 45, 35, 105 );

		var _x = Math.cos( _masterTime / 86400 * PI * 2.0 - PI * 0.5 ) * 100;
		var _y = Math.sin( _masterTime / 86400 * PI * 2.0 - PI * 0.5 ) * 100;
		_sun.position.set( _x, _y, _sun.position.z );
		_sun.lookAt( _sea.position );


		_cloud.material.uniforms.distOpacity.value = 1.0;
		if( _world.camera.position.y < 60 )
		{
			var _dist = _world.camera.position.y - 50;

			var _opacity = _dist / 10;
			_opacity = _opacity < 0.0?0.0:_opacity;
			_cloud.material.uniforms.distOpacity.value = _opacity;
		}


		//_stats.update();

	}

	function createCloud()
	{
		var _g = new THREE.PlaneGeometry( 10000, 10000, 1, 1)
		_g.rotateX( - PI * 0.5 )
		_g.translate( 0, 50, 0 );

		var _shader = THREE.CustomCloudShader;
		_shader.uniforms.fogColor = {}
		_shader.uniforms.fogColor.value = _world.scene.fog.color;
		_shader.uniforms.fogNear = {}
		_shader.uniforms.fogNear.value = _world.scene.fog.near;
		_shader.uniforms.fogFar = {}
		_shader.uniforms.fogFar.value = _world.scene.fog.far;

		var _m = new THREE.ShaderMaterial({
			uniforms: _shader.uniforms,
			vertexShader:   _shader.vertexShader,
			fragmentShader: _shader.fragmentShader,
			transparent: true,
			side: THREE.DoubleSide,
			depthTest: false,
			fog: true,
			//lights: false
		});
		var _mesh = new THREE.Mesh( _g, _m );
		return _mesh;
	}

	function createSea()
	{
		var _g = new THREE.PlaneGeometry( 10000, 10000, 1, 1)
		_g.rotateX( - PI * 0.5 )
		_g.translate( 0, -5, 0 )
		//var _m = new THREE.MeshBasicMaterial({
		var _m = new THREE.MeshLambertMaterial({
			color: new THREE.Color(3,3,9).multiplyScalar(1/255),
			// map: new THREE.TextureLoader().load('shared/img/spark1.png'),
			// transparent: true,
			//depthTest: true
		});

		var _mesh = new THREE.Mesh( _g, _m );
		return _mesh;
	}

	function createGrid()
	{
		var _size = 5000;
		var _grid = new THREE.GridHelper( _size, _size / _scale );
		_grid.material.transparent = true;
		_grid.material.opacity = 0.2;
		return _grid;
	}

	function createCoastLine()
	{
		var _geometry = new THREE.Geometry();
		var _lat, _lng;
		var _index = 0;
		var _lineList, _geo;
				
		var len = _coastLine.length;
		for( var i = 0; i < len; i++ )
		{
			var _lines = _coastLine[i];
			var len1 = _lines.length;

			for( var j = 0; j < len1; j++ )
			{
				_lineList = _lines[j];

				_geo = _lineList[0];
				_lat = _geo[0] - _center.lat;
				_lng = _geo[1] - _center.lng;
				_lat *= _scale;
				_lng *= _scale;

				_geometry.vertices[_index] = new THREE.Vector3( _lng, 0.0, - _lat);
				_index++;

				var len2 = _lineList.length;
				for( var k = 1; k < len2 - 1; k++ )
				{
					_geo = _lineList[k];
					_lat = _geo[0] - _center.lat;
					_lng = _geo[1] - _center.lng;
					_lat *= _scale;
					_lng *= _scale;

					_geometry.vertices[_index] = new THREE.Vector3( _lng, 0.0, - _lat);	//	draw
					_index++;
					_geometry.vertices[_index] = new THREE.Vector3( _lng, 0.0, - _lat);	//	not draw
					_index++;
				}

				//	Õ{Õû
				_geo = _lineList[ len2 - 1 ];
				_lat = _geo[0] - _center.lat;
				_lng = _geo[1] - _center.lng;
				_lat *= _scale;
				_lng *= _scale;

				_geometry.vertices[_index] = new THREE.Vector3( _lng, 0.0, - _lat);
				_index++;

			}

		}

		_coastLine = null;

		var _h = _geometry.vertices.length;
		var _hh = ~~( Math.sqrt( _geometry.vertices.length ) );

		var _material = new THREE.LineBasicMaterial({
			depthTest: false,
			blending: THREE.AdditiveBlending,
			linewidth: 1,
			opacity: 0.6,
			fog: true
		});
		var _mesh = new THREE.LineSegments( _geometry, _material);
		return _mesh;
	}

	function createAirDynamicLine()
	{
		var _geometry = new THREE.Geometry(); 
		var _colors = [];
		for( var i = 0; i < _maxAirPlanes * _airRuteLength * 2; i++ )
		{
			_geometry.vertices[i] = new THREE.Vector3();
			var _c = 1.0 - 1.0 * ( i % _airRuteLength / _airRuteLength );
			_colors[i] = new THREE.Color( _c, _c, _c );
		}
		_geometry.colors = _colors;

		var _material = new THREE.LineBasicMaterial({
			transparent: true,
			blending: THREE.AdditiveBlending,
			depthTest: false,
			alphaTest: false,
			opacity: 0.6,
			vertexColors: THREE.VertexColors
		});
		var _mesh = new THREE.LineSegments( _geometry, _material );
		return _mesh;
	}

	function createAirStaticLines( _plist, _clist )
	{
		//	Arrat to Float32Array
		var _positionList = new Float32Array( _plist.length * 3 );
		var _opacityList = new Float32Array( _clist.length );

		for( var i = 0; i < _plist.length; i++ )
		{
			_positionList[i*3+0] = _plist[i].x;
			_positionList[i*3+1] = _plist[i].y;
			_positionList[i*3+2] = _plist[i].z;
		}
		for( var i = 0; i < _clist.length; i++ )
		{
			_opacityList[i] = _clist[i];
		}

		//	geometry
		var _geometry = new THREE.BufferGeometry();
		_geometry.addAttribute( 'opacities', new THREE.Float32BufferAttribute( _opacityList, 1 ).onUpload( disposeArray ) );
		_geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( _positionList, 3 ).onUpload( disposeArray ) );
		function disposeArray(){}

		//	material
		var _shader = THREE.CustomAirLineShader;
		_shader.uniforms.color.value = new THREE.Color( 0xCC3333 );
		_shader.uniforms.fogColor.value = _world.scene.fog.color;
		_shader.uniforms.fogNear.value = _world.scene.fog.near;
		_shader.uniforms.fogFar.value = _world.scene.fog.far;

		var _material = new THREE.ShaderMaterial({
			uniforms: _shader.uniforms,
			vertexShader:   _shader.vertexShader,
			fragmentShader: _shader.fragmentShader,
			transparent: true,
			//side: THREE.DoubleSide,
			depthTest: false,
			fog: true,
			//lights: false
			blending: THREE.AdditiveBlending,
			linewidth: 1
		});

		//	mesh
		var _mesh = new THREE.LineSegments( _geometry, _material );
		return _mesh;
	}

	function createParticles()
	{
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < _maxAirPlanes; i++ ){
			_geometry.vertices[i] = new THREE.Vector3();
		}

		var _material = new THREE.PointsMaterial({
			size: 4,
			map: new THREE.TextureLoader().load('shared/img/spark1.png'),
			transparent: true,
			depthTest: false,
			alphaTest: false,
			blending: THREE.AdditiveBlending
		});
		var _mesh = new THREE.Points( _geometry, _material );
		return _mesh;
	}

	function compare(a, b){
		if( a.departure > b.departure ){
		  return 1;
		}
		return -1;
	}

	function getTimeView( _sec )
	{
		var _h = ~~( _sec / 3600 );
		var _m = ~~( ( _sec - _h * 3600 ) / 60 ) % 60;
		var _s = ~~( _sec % 60 );
		_h = new String( _h + 100 ).substr( 1,2 );
		_m = new String( _m + 100 ).substr( 1,2 );
		_s = new String( _s + 100 ).substr( 1,2 );
		return _h + ':' + _m + ':' + _s;
	}

	function resetAll()
	{
		//	時間をリアルタイムに設定
		var _date = new Date();
		var _h = _date.getHours();
		var _m = _date.getMinutes();
		var _s = _date.getSeconds();
		_masterTime = _h * 60 * 60 + _m * 60 + _s;

		//	フライトリストのリセット
		var len = _allAirPlaneList.length;
		while( len )
		{
			len--;
			_allAirPlaneList[len].isInAir = false;
		}

		//	初期化
		_inAirList = [];

		//	頂点のリセット
		var len = _particle.geometry.vertices.length;
		for( var i = 0; i < len; i++ )
		{
			var _vertices = _particle.geometry.vertices;
			_vertices[i].x = 0;
			_vertices[i].y = 10000;
			_vertices[i].z = 0;
		}

		_particle.geometry.verticesNeedUpdate = true;

		_world.controls.reset();
	}

	function addEvents()
	{
		window.addEventListener( 'resize', function(){});
		// window.addEventListener( 'click', function(){

		// 	clearTimeout( _changeCameraViewKey );
		// 	window.cancelAnimationFrame( _restartChangeCamerakey );
		// 	_changeCameraViewKey = setTimeout( changeCameraView, 20 * 1000 );
		// });
		// window.addEventListener( 'touchend', function(){
		// 	clearTimeout( _changeCameraViewKey );
		// 	window.cancelAnimationFrame( _restartChangeCamerakey );
		// 	_changeCameraViewKey = setTimeout( changeCameraView, 20 * 1000 );
		// });
		window.addEventListener('dblclick',function() {
		    changeCameraView();
		}, false);



		var _slider = $('#slider01');
		var _timeScaleView = $('#timeScaleView');
		var _toggle = $('#toggle1')

		_timeScale = 288;
		_timeScaleView.text( _timeScale );

		_slider.val( _timeScale );
		_slider.change( function (e) {
			var _val = $( this ).val();
			_timeScale = _val;
			_timeScaleView.text( _timeScale );
		});
		_slider.on('input', function () {
			var _val = $( this ).val();
			_timeScale = _val;
			_timeScaleView.text( _timeScale );
		});

		_toggle.on('change', function(){
			//	alert('hoge');
			var _flag = $( this ).prop('checked');
			if( _flag )
			{
				viewChangeOn();
			} else {
				viewChangeOff();
			}
			console.log( _flag )
		})

		var _isOpen = true;
		var _nav = $('#nav');
		$('#menuButton').on('click', function(e){
			if( _isOpen )
			{
				$('a.menu-trigger').addClass('active');
				_nav.removeClass();
				_nav.addClass('open');

			} else {
				$('a.menu-trigger').removeClass('active');
				_nav.removeClass();
				_nav.addClass('close');
			}
			_isOpen = !_isOpen;
		});

		$('#resetButton').on('click',function(){
			_timeScale = 1.0;
			_timeScaleView.text( _timeScale );
			_slider.val( _timeScale );
			resetAll();
		});
	}

	var _pastViewMode = 0;
	function changeCameraView()
	{
		//	アニメーション関係のリセット(念のため)
		clearTimeout( _changeCameraViewKey );
		window.cancelAnimationFrame( _restartChangeCamerakey );

		//	topview
		var _viewMode = ~~( Math.random() * 4 );

		if( _pastViewMode == _viewMode )
		{
			if( _viewMode == 2 && _timeScale == 1 )
			{
				changeCameraView()
				return;
			}
			changeCameraView();
			return;
		}


		_pastViewMode = _viewMode;

		switch( _viewMode )
		{
			case 0:
				_viewMode01();
				break;
			case 1:
				_viewMode02();
				break;
			case 2:
				_viewMode03();
				break;
			default:
				_viewMode00();
		}

		//_changeCameraViewKey = setTimeout( changeCameraView, 10 * 1000 );
	}

	//	全国を俯瞰
	function _viewMode00()
	{
		setLetterInfo( 'JPN', 'SkyNet', 'Created by nulldesign' );

		var _airport = getAirport();

			location.hash = _airport.originAirport;

			var _p = _airport.origin;
			_world.camera.position.x = 120;
			_world.camera.position.y = 1000;
			_world.camera.position.z = 1000;

			//	focus update.
			_world.controls.target.x =  0;
			_world.controls.target.z = 0;
			_world.focus.x = 0;
			_world.focus.z = 0;
			_world.controls.target.y = _world.focus.y = 0;

		_changeCameraViewKey = setTimeout( changeCameraView, 15 * 1000 );
	}

	//	特定の空港を真上から
	function _viewMode01()
	{
		var _airport = getAirport();

		location.hash = _airport.originAirport;

		var _db = $( _dataBase.airport.data );
		_db.find("airport[idt="+_airport.originAirport+"]").each(function() {
			setLetterInfo( _airport.originAirport, $(this).find('name').text(), $(this).find('english').text() );
		});

		var _min = ~~( Math.random() * 20 ) + 50;
		var _ySpeed = Math.random() - 0.5;
		_ySpeed *= 0.4;


		var _p = _airport.origin;
		_world.camera.position.x =  _p.x;
		_world.camera.position.z =  _p.z;

		//	focus update.
		_world.controls.target.x = _p.x;
		_world.controls.target.z = _p.z;
		_world.focus.x = _p.x;
		_world.focus.z = _p.z;
		_world.controls.target.y = _world.focus.y = 0;

		_world.camera.position.y =  Math.random() * 128 + 64;


		loop();
		function loop()
		{
			_restartChangeCamerakey = window.requestAnimationFrame( loop );

			//	focus update.
			_world.camera.position.y += _ySpeed;

		    if( _world.camera.position.y < _min )
		    {
		    	_world.camera.position.y += ( _min - _world.camera.position.y ) * 0.1;	
		    }
		}


	
		_changeCameraViewKey = setTimeout(function(){
			window.cancelAnimationFrame( _restartChangeCamerakey );
			changeCameraView();
		}, 10 * 1000 );
	}

	function _viewMode02()
	{
		var _airport = getAirport();
		var _p = new THREE.Vector3();
		var _accell = new THREE.Vector3();
		var _startTime = new Date().getTime();
		var _dir = Math.random() * 2.0 - 1.0;
		_dir *= 2.0;
		var _min = ~~( Math.random() * 20 ) + 50;

		location.hash = _airport.originAirport;
		var _p = _airport.origin;

		loop();

		var _db = $( _dataBase.airport.data );
		_db.find("airport[idt="+_airport.originAirport+"]").each(function() {
			setLetterInfo( _airport.originAirport, $(this).find('name').text(), $(this).find('english').text() );
		});

		function loop()
		{
			_restartChangeCamerakey = window.requestAnimationFrame( loop );

			//	focus update.
			_world.controls.target.x += ( _p.x - _world.controls.target.x ) * 0.05;
			_world.controls.target.z += ( _p.z - _world.controls.target.z ) * 0.05;
			_world.focus.x = _world.controls.target.x;
			_world.focus.z = _world.controls.target.z;
			_world.controls.target.y = _world.focus.y = 0;

			//	_world.controls.panLeft( 0.25 );


			var _dist = 40;
			var _direction = new THREE.Vector3().subVectors( _world.camera.position, _world.focus );
			var _radius = _direction.length();
			_direction.normalize().multiplyScalar( _dist - _radius );
			var _targetPosition = new THREE.Vector3().addVectors( _world.camera.position, _direction );
			_accell = _accell.add( _targetPosition.sub( _world.camera.position ).multiplyScalar( 1/40 ) ).multiplyScalar( 1/1.750);
			_world.camera.position.add( _accell );


			var _duration = new Date().getTime() - _startTime;
			var _value = Math.sin( _duration / 10000 * PI + PI * 0.5 ) * 0.5 + 0.5;


		    //  回転だ
		    _world.controls.panLeft( _dir *  _value );

		    if( _world.camera.position.y < _min )
		    {
		    	_world.camera.position.y += ( _min - _world.camera.position.y ) * 0.1;	
		    }
		}
		

		_changeCameraViewKey = setTimeout(function(){
			window.cancelAnimationFrame( _restartChangeCamerakey );
			changeCameraView();
		}, 10 * 1000 );
	}

	function _viewMode03()
	{
		if( _inAirList.length <= 0 )
		{
			_changeCameraViewKey = setTimeout(function(){
				window.cancelAnimationFrame( _restartChangeCamerakey );
				changeCameraView();
			}, 1 * 1000 );
			return;
		}

		var _a = _inAirList[ _inAirList.length - 1 ];
		//	console.log( _a );

		var _departure = _a.departure;
		var _arrival = _a.arrival;
		var _duration = _a.duration;
		var _origin = _a.originAirport;
		var _destination = _a.destinationAirport;
		var _stockTimeScale = _timeScale;
		var _accell = new THREE.Vector3();
		var _startTime = new Date().getTime();
		var _timeScaleView = $('#timeScaleView');

		var _d0 = false;
		var _d1 = false;
		var _db = $( _dataBase.airport.data );
		_db.find("airport[idt="+_origin+"]").each(function() {
			_d0 = $(this).find('service').text() == 'domestic';
		});
		_db.find("airport[idt="+_destination+"]").each(function() {
			_d1 = $(this).find('service').text() == 'domestic';
		});

		if( _lines[ _origin + _destination ] != undefined && _d0 && _d1 )
		{
			_timeScale = 144;
			_timeScaleView.text( _timeScale );

			setLetterInfo( _a['odpt:flightNumber'][0], _origin + ' - ' + _destination, getTimeView(_departure).substr(0,5) + ' - ' + getTimeView(_arrival).substr(0,5) );
			loop();
			return;

		} else {
			//_viewMode03();
			_changeCameraViewKey = setTimeout(function(){
				window.cancelAnimationFrame( _restartChangeCamerakey );
				_timeScale = _stockTimeScale;
				_timeScaleView.text( _timeScale );
				changeCameraView();
			}, 1 * 1000 );
			return;
		}


		function loop()
		{
			var _line = _lines[ _origin + _destination ];
			var _par = ( _masterTime - _departure ) / _duration;

			_restartChangeCamerakey = window.requestAnimationFrame( loop );
			if( _par > 1.0 )
			{
				window.cancelAnimationFrame( _restartChangeCamerakey );
				setTimeout(function(){
					changeCameraView();
					_world.controls.target.y = _world.focus.y = 0;
				}, 1 );
				return;
			}

			var _index = ~~( ( _line.length - 1 ) * _par );
			var _p = _line[ _index ];

			//	focus update.
			_world.controls.target.x += ( _p.x - _world.controls.target.x ) * 0.025;
			_world.controls.target.y += ( _p.y - _world.controls.target.y ) * 0.025;
			_world.controls.target.z += ( _p.z - _world.controls.target.z ) * 0.025;
			_world.focus.x = _world.controls.target.x;
			_world.focus.y = _world.controls.target.y;
			_world.focus.z = _world.controls.target.z;

			var _dist = 20;
			var _direction = new THREE.Vector3().subVectors( _world.camera.position, _world.focus );
			var _radius = _direction.length();
			_direction.normalize().multiplyScalar( _dist - _radius );
			var _targetPosition = new THREE.Vector3().addVectors( _world.camera.position, _direction );
			_accell = _accell.add( _targetPosition.sub( _world.camera.position ).multiplyScalar( 1/40 ) ).multiplyScalar( 1/1.750);
			_world.camera.position.add( _accell );

			var _min = 50;
			// var _duration = new Date().getTime() - _startTime;
			// var _value = Math.sin( _duration / 10000 * PI + PI * 0.5 ) * 0.5 + 0.5;

		    // if( _world.camera.position.y < _min )
		    // {
		    // 	_world.camera.position.y += ( _min - _world.camera.position.y ) * 0.1;	
		    // }


		}




	}

	var _pastAirport = 'NULLDESIGN';
	function getAirport()
	{
		var len = _airportList.length;
		var _index = ~~( Math.random() * len );
		var _airport = _airportList[ _index ];

		if( _airport.isDomestic && _airport.originAirport != _pastAirport )
		{
			_pastAirport = _airport.originAirport;
			return _airport;
		}

		return getAirport();
	}

	function viewChangeOn()
	{
		changeCameraView();
	}

	function viewChangeOff()
	{
		clearTimeout( _changeCameraViewKey );
		window.cancelAnimationFrame( _restartChangeCamerakey );
	}

	function setLetterInfo( a, b, c )
	{
		_letter.innerHTML = a;
		_letter_ja.innerHTML = b;
		_letter_en.innerHTML = c;

		var _w = _letter.offsetWidth + 12;
		$( _letter_ja ).css({	'margin-left': _w + 'px'	});
		$( _letter_en ).css({	'margin-left': _w + 'px'	});
	}

	
}
