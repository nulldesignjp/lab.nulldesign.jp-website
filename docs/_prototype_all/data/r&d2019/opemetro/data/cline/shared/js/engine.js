/*
	engine.js
*/

window.onload = function(){

	var style="color:white;background-color:#484848;padding: 3px 6px;";
	window.console.log("%cSkyNet - v1.0.0" , style);

	//window.console.log = function(){/* NOP */};
	window.console.debug = function(){/* NOP */};
	window.console.info = function(){/* NOP */};
	// window.console.warn = function(){/* NOP */};
	// window.console.error = function(){/* NOP */};
	window.console.timeEnd = function(){/* NOP */};
	window.console.time = function(){/* NOP */};


	//	Props
	var _world, _center;

	var _hVector = 200;
	var _vVector = 1.0;
	var _scale = 100.0;
	var _stats;

	var _cList = [
		'C23-06_01-g.xml','C23-06_02-g.xml','C23-06_03-g.xml','C23-06_04-g.xml','C23-06_05-g.xml','C23-06_06-g.xml','C23-06_07-g.xml','C23-06_08-g.xml','C23-06_12-g.xml','C23-06_13-g.xml','C23-06_14-g.xml','C23-06_15-g.xml','C23-06_16-g.xml','C23-06_17-g.xml','C23-06_18-g.xml','C23-06_22-g.xml','C23-06_23-g.xml','C23-06_24-g.xml','C23-06_26-g.xml','C23-06_27-g.xml','C23-06_28-g.xml','C23-06_30-g.xml','C23-06_31-g.xml','C23-06_32-g.xml','C23-06_33-g.xml','C23-06_34-g.xml','C23-06_35-g.xml','C23-06_36-g.xml','C23-06_37-g.xml','C23-06_38-g.xml','C23-06_39-g.xml','C23-06_40-g.xml','C23-06_41-g.xml','C23-06_42-g.xml','C23-06_43-g.xml','C23-06_44-g.xml','C23-06_45-g.xml','C23-06_46-g.xml','C23-06_47-g.xml'
	];
	var _count = 0;

	//	stats
	_stats = new Stats();
	$('#container').append( _stats.dom );


	init();
	start();

	//	fadein
	$('#siteBody').addClass('open');

	function init(){
		_world = new world('webglView');
		//_world.controls.autoRotate = true;
		_world.controls.enabled = true;

		_center = {};
		_center.lat = 34.55635591546394;
		_center.lng = 134.69499546597936;

		//	pseudo map
		createCoastLine();

		window.addEventListener( 'resize', function(){})
		window.addEventListener( 'mousemove', function( e ){});
	}

	function start(){
		loop( Math.random() * 100000 );
	}

	function loop( _stepTime ){
		_stats.update();
		window.requestAnimationFrame( loop );
	}

	var _lineCount = 0;
	function createCoastLine()
	{
		if( _cList.length )
		{
			var _url = _cList.pop();
			$.ajax({
				url: './coast/' + _url,
				type: 'GET',
				dataType:'XML'
			}).
			then(
				function( _xml ){
					var _geometry = new THREE.Geometry();
					var _index = 0;
					var _lat, _lng;

					var _str = '';

					$( _xml ).find('gml\\:LineStringSegment').each(function(i,e0){

						_str += '[';

						var _first = $( this ).find('gml\\:posList')[0];
						var _list = $( _first ).text().split('\n');
						var _geo = _list[1].split(' ');
						var _lat = _geo[0] - _center.lat;
						var _lng = _geo[1] - _center.lng;
						_lat *= _scale;
						_lng *= _scale;
						_geometry.vertices[_index] = new THREE.Vector3( _lng, 1.0, - _lat);
						_index++

						_str += '['+ Math.floor( _geo[0] * 1000000 ) / 1000000+','+Math.floor( _geo[1] * 1000000 ) / 1000000 +'],';

						$( this ).find('gml\\:posList').each(function(j,e1){

							var _list = $( this ).text().split('\n');
							for( var k = 2; k < _list.length-1; k+=50 )	//	1: Full, 5: Normal, 50: Light
							{
								var _geo = _list[k].split(' ');

								_lat = _geo[0] - _center.lat;
								_lng = _geo[1] - _center.lng;
								_lat *= _scale;
								_lng *= _scale;

								_geometry.vertices[_index] = new THREE.Vector3( _lng, 1.0, - _lat);
								_index++;
								_geometry.vertices[_index] = new THREE.Vector3( _lng, 1.0, - _lat);
								_index++;


								_str += '['+ Math.floor( _geo[0] * 1000000 ) / 1000000+','+Math.floor( _geo[1] * 1000000 ) / 1000000 +'],';
								//_str += '['+ Math.floor( _geo[0] * 1000000 ) / 1000000+','+Math.floor( _geo[1] * 1000000 ) / 1000000 +'],';
							}
						});

						//	調整
						var _geo = _list[_list.length-2].split(' ');
						_lat = _geo[0] - _center.lat;
						_lng = _geo[1] - _center.lng;
						_lat *= _scale;
						_lng *= _scale;

						_geometry.vertices[_index] = new THREE.Vector3( _lng, 1.0, - _lat);
						_index++;


						_str += '['+ Math.floor( _geo[0] * 1000000 ) / 1000000+','+Math.floor( _geo[1] * 1000000 ) / 1000000 +'],';

						_str += '],'

					});


					var _material = new THREE.LineBasicMaterial();
					var _line = new THREE.LineSegments( _geometry, _material);
					_world.add( _line );

					$.ajax({
						url: "https://nulldesign.jp/cline/saveFile.php",
						type: 'POST',
						dataType: 'TEXT',
						data : {'name' : _count, 'cont' : _str },
					}).done(function(data) {
						_xml = null;
						
						setTimeout( createCoastLine, 500 );
						_count++;

			        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
			            alert("error");
			        })


				},
				function(){
					console.log( 'error')
				}
			)
		} else {
			alert('complete....');

			window.open('https://nulldesign.jp/coastline/concatFiles.php','new')
		}

	}

}
