/*
	engine.js
*/
var ND = ND || {};
ND.ua = getUA();

//alert(window.devicePixelRatio);

ND.preload = function()
{
	this.intervalKey;
	this.loaded = 0;
	this.view = $( '<div>' ).addClass('preload');

	this.paragraph = $('<p>').text('Loading....').addClass('bringLoading');
	this.view.append( this.paragraph );

	this.canvas = document.createElement('canvas');
	this.ctx = this.canvas.getContext('2d');
	this.canvas.width = 198;
	this.canvas.height = 8;

	if( ND.ua.iphone )
	{
		this.canvas.width = 398;
		this.canvas.height = 18;
	}

	this.view.append( this.canvas );

	$( 'body' ).append( this.view );

	var _this = this;
	this.intervalKey = setInterval(function(){
		var _ctx = _this.ctx;
		var _w = _this.canvas.width;
		var _h = _this.canvas.height;
		_ctx.clearRect( 0, 0, _w, _h );
		_ctx.beginPath();
		_ctx.fillStyle = '#333333';
		_ctx.rect( 0, 0, _w * _this.loaded, _h );
		_ctx.fill();
	}, 1000/60>>0);
}
ND.preload.prototype =
{
	complete	:	function( _callBack )
	{
		var _this = this;
		this.view.delay( 500 ).animate({
			'opacity': 0
		}, 500, function(){
			_callBack();
			$(this).remove();
			clearInterval( _this.intervalKey );
		} );
	}
}

ND.fullScreenViewer = function(){}
ND.fullScreenViewer.prototype = 
{
	initialize	: function(){},
	setData	: function(){},
	inHandler	: function(){},
	outHandler	: function(){},
	kill	: function(){}
}

window.onload = function()
{
	(function( $ )
	{
		var _preload;
		var _data;
		var _soundEnable = true;
		var _postList = [];
		var _ua = ND.ua;
		var _se;

		var _w = $( window ).width();
		var _h = $( window ).height();

		var _body = $('body');
		var _container = $( '#container' );
		var _siteHead = $( '#siteHead' );
		var _siteBody = $( '#siteBody' );
		var _siteFoot = $( '#siteFoot' );
		var _isDetail = false;
		var _typoB;
		var _typoW;
		var _typoR;

		var _toTopKey;
		var _toTopCount = 0;

		//	未対応ブラウザ処理。
		if( _ua.msie6 || _ua.msie7 || _ua.msie8 )
		{
			_siteBody.load( 'shared/xml/unusage.html');
			return false;
		}

		// if( _ua.iphone && _ua.isRetina )
		// {
		// 	//ホーム画面から起動してウェブアプリにアクセスがあった場合の処理
		// 	if(window.navigator.standalone)
		// 	{
		// 		//	<!-- app mode -->
		// 		//$('head').append('<meta name="viewport" content="initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">');
		// 		$('head meta[name|="viewport"]').attr('content','initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no')
		// 	}
		// }


		//	preloading
		var _loadingBar = new ND.preload();
		var _realLoadPar = 0;
		var _loadingBarKey;
		_loadingBarKey = setInterval(function(){
			_loadingBar.loaded += ( _realLoadPar - _loadingBar.loaded ) * .2;

			if( _realLoadPar == 1 && _loadingBar.loaded > 0.99 )
			{
				_loadingBar.loaded = 1.0;
				setTimeout(function(){
					_loadingBar.complete( _fillInAll );
					clearInterval( _loadingBarKey );
				},200);
			}
		}, 1000/60>>0);

		//	load main xml
		var _cache = '?cache='+new Date().getTime();
		$.ajax({
			url: 'shared/xml/data.xml' + _cache,
			data: 'GET',
			dataType: 'xml',
			success: _success,
			error: _error
		});
		$(window).scroll(function(e){});




		/*
			method
		*/
		function _success( xml )
		{
			_data = xml;
			var _imgList = [];

			$( xml ).find( 'post' ).each(function(i,e){
				var _this = $(this);
				_imgList.push( _this.find('img').attr('src') );
			});

			_preload = new createjs.LoadQueue( false );
			_preload.installPlugin(createjs.Sound);
			_preload.addEventListener("fileload", handleFileComplete);
			_preload.addEventListener("complete", handleComplete);
			_preload.addEventListener("progress", handleProgress);
			_preload.addEventListener("error", handleError);

			var len = _imgList.length;
			for( var i =0; i < len; i++ )
			{
				_preload.loadFile( _imgList.pop() );
			}
			_preload.loadFile( 'shared/xml/detail.html' );
			_preload.loadFile( 'shared/js/standars0755.gif' );
			_preload.loadFile( 'shared/js/standars0755w.gif' );
			_preload.loadFile( 'shared/js/standars0755r.gif' );

			var _extends = ( _ua.opera || _ua.firefoX )? 'mp3':'mp3';

			_preload.loadFile({id: "se00", src: "shared/sound/hover."+_extends});
			_preload.loadFile({id: "se01", src: "shared/sound/sound_01."+_extends});
			_preload.loadFile({id: "se02", src: "shared/sound/sound_02."+_extends});
			_preload.loadFile({id: "se03", src: "shared/sound/sound_03."+_extends});
			_preload.loadFile({id: "se04", src: "shared/sound/sound_04."+_extends});
			_preload.loadFile({id: "se05", src: "shared/sound/sound_05."+_extends});
			_preload.loadFile({id: "se06", src: "shared/sound/sound_06."+_extends});

			_preload.load();
		}
		function _error( e ){	console.log( e );	}

		function handleFileComplete( event )
		{
			var item = event.item; // A reference to the item that was passed in
			var type = item.type;

			// Add any images to the page body.
			// if ( type == createjs.LoadQueue.IMAGE )
			// {
			// 	//document.body.appendChild(event.result);
			// 	$( '#note' ).append( event.result );
			// }

			// //	var image = queue.getResult("image");
			// //	document.body.appendChild(image);
		}
		function handleProgress( e )
		{
			_realLoadPar = e.loaded;
		}
		function handleComplete( e )
		{
			// $( 'img#btnSound' ).css({
			// 	'display':'block'
			// }).click(function(){
			// 	_soundEnable = !_soundEnable;

			// 	var _src = _soundEnable ? 'shared/img/btn_sound02.gif' : 'shared/img/btn_sound01.gif';
			// 	$(this).attr( 'src', _src );
			// }).mouseenter(function(){
			// 	_seSound();
			// });
			_se = createjs.Sound.play('se01');
			_se.stop();
			
		}
		function handleError( e ){}

		function _fillInAll()
		{
			_typoB = new Standard0755();
			_typoW = new Standard0755('shared/js/standars0755w.gif');
			_typoR = new Standard0755('shared/js/standars0755r.gif');

			$( _data ).find('post').each(function(i,e){

				//
				var _canvas = document.createElement('canvas');
				_canvas.width = 280;
				_canvas.height = 102;

				if( _ua.isRetina )
				{
					_canvas.width = 560;
					_canvas.height = 204;
				} else if( _ua.android && window.devicePixelRatio != 1 )
				{
					//_canvas.width = 280 * window.devicePixelRatio;
					//_canvas.height = 102 * window.devicePixelRatio;
					//$( _canvas ).css('zoom', window.devicePixelRatio);
					$( _canvas ).css('zoom', 1);
				}

				

				//
				var _post = $('<div>').addClass('post').attr('postID',i);
				var _impression = $('<div>').addClass('impression');
				var _postmeta = $('<div>').addClass('postmeta');
				var _title = $(this).find('title').text();
				var _publish = $(this).find('publish').text();
				var _description = $(this).find('description').text();
				var _img = new Image();
				_img.src = $(this).find('impression').eq(0).attr('src');
				_img.onload = function(){}
				var _anchor = $(this).find('a').attr('href');
				var _target = $(this).find('a').attr('target');
				var _bro = $(this).find('browser').text();
				var _tag = $(this).find('tags').text();
				var _note = $(this).find('note').text();

				_bro = _bro!=''? '\n'+'BROWSER: '+_bro:'';
				_tag = _tag!=''? '\n'+'TAGS: '+_tag:'';
				_note = _note!=''? '\n'+'NOTE: '+_note:'';

				_post.append( _impression );
				_impression.append( _img );
				_post.append( _postmeta );
				_postmeta.append( _canvas )

				$( _postmeta ).append( _canvas );
				_typoB.drawTypo( _canvas, _title + '\n\n' + _publish + '\n' + _description + '\n' + _bro + _tag + _note );

				setTimeout( function(){ _post.addClass('fadeIn');_siteBody.append( _post );	setTimeout(function(){_post.removeClass('fadeIn');},500)}, 50 * i + 100 );
				_postList.push( _post );

				_post.click(function(){
					_showDetail( $(this).attr('postID') );
					_seClick();
				}).mouseenter(function(){
					_seHover();
				});
			});

			if( _ua.iphone )
			{
				$('#gototop01').attr('src','shared/img/btn_gototop01@2x.gif').addClass('retina');
			}
			//_siteBody.append( $('#gototop01') );

			$('#gototop01').click(function(){
				_seClick();
				var _top = $(window).scrollTop();
				clearInterval( _toTopKey );
				_toTopCount = 0;
				_toTopKey = setInterval( function(){
					_toTopCount++;

					var _par = _toTopCount / 30;
					var _current = easeOutExpo( _toTopCount, _top, - _top, 30 );
					$(window).scrollTop( _current );

					if( _toTopCount == 30 )
					{
						clearInterval( _toTopKey );
						_toTopCount = 0;
						$(window).scrollTop(0);
					}

				}, 1000/60>>0)
			}).mouseenter(function(){
				_seHover();
			}).css('display','inline');

			setTimeout(function(){
				$( '#SNSBlock' ).css('display','block');
			},1000);
		}

		function _showDetail( e )
		{
			if( _isDetail ) return;
			_isDetail = !_isDetail;

			var _div = $( '<div>' ).attr('id','detailWrapper');
			_div.load( 'shared/xml/detail.html?v=0', function(){
				var _stockScrollTop = _body.scrollTop();
				var _ScrollTop = _container.offset().top - _body.scrollTop();
				var _ScrollLeft = _container.offset().left - _body.scrollLeft();
				_body.append( this );
				_container.css({'position':'fixed', 'top': _ScrollTop + 'px', 'left': _ScrollLeft + 'px'});
				//_container.css('display','none');
				_body.scrollTop(0);

				//	create detail data
				var _post = $( _data ).find( 'post' ).eq(e);
				var _title = _post.find('title').text();
				var _publish = _post.find('publish').text();
				var _description = _post.find('description').text();
				var _impressionSrc = _post.find('impression');
				var _thumbSrc = _post.find('thumb');

				//	descriptions
				var _bro = _post.find('browser').text();
				var _tag = _post.find('tags').text();
				var _note = _post.find('note').text();

				_bro = _bro!=''? '\n'+'BROWSER: '+_bro:'';
				_tag = _tag!=''? '\n'+'TAGS: '+_tag:'';
				_note = _note!=''? '\n'+'NOTE: '+_note:'';

				//	page info
				var _canvas = document.createElement( 'canvas' );
				_canvas.width = 280;
				_canvas.height = 150;

				if( _ua.isRetina )
				{
					_canvas.width = 560;
					_canvas.height = 300;
				} else if( _ua.android && window.devicePixelRatio != 1 )
				{
					//_canvas.width = 280 * window.devicePixelRatio;
					//_canvas.height = 102 * window.devicePixelRatio;
					//$( _canvas ).css('zoom', window.devicePixelRatio);
					$( _canvas ).css('zoom', 1);
				}

				$( '#infoDetailBlock' ).append( _canvas );
				_typoW.drawTypo( _canvas, _title + '\n\n' + _publish + '\n' + _description + '\n' + _bro + _tag + _note );

				var _setHeight = _ua.retina? Math.floor( _typoW.height * .5 )+10: _typoW.height + 20;
				$( '#infoDetailBlock' ).css('height', _setHeight + 'px' );


				//	anchor
				var len = _post.find('a').length;
				for( var i = 0; i < len; i++ )
				{
					var _a = _post.find('a').eq(i);
					var _anchor = _a.attr('href');
					var _target = _a.attr('target');
					var __a = $('<a>');
					__a.attr('href', _anchor);
					__a.attr('target', '_null');

					var _canvas = document.createElement( 'canvas' );
					_canvas.width = 280;
					_canvas.height = 10;

					if( _ua.isRetina )
					{
						_canvas.width = 560;
						_canvas.height = 20;
					} else if( _ua.android && window.devicePixelRatio != 1 )
					{
						//_canvas.width = 280 * window.devicePixelRatio;
						//_canvas.height = 102 * window.devicePixelRatio;
						//$( _canvas ).css('zoom', window.devicePixelRatio);
						$( _canvas ).css('zoom', 1);
					}

					__a.append( _canvas );

					$( '#postAnchor' ).append( __a );
					var _txt = _target == '_blank'? _anchor : location.href.replace( 'index.html','') + _anchor;
					
					_typoR.drawTypo( _canvas, _txt );

					__a.attr('url', _txt );

					$( __a ).hover(
						function(){
							_typoW.drawTypo( $(this).find('canvas')[0], $(this).attr('url') );
						},
						function(){
							_typoR.drawTypo( $(this).find('canvas')[0], $(this).attr('url') );
						});
				}

				


				//	main
				var _imageBlock = $('#impressionBlock ul');
				var len = _impressionSrc.length;
				for( var i = 0; i < len; i++ )
				{
					var _img = new Image();
					_img.src = _impressionSrc.eq(i).attr('src');
					var _li = $('<li>');
					_li.append( _img );
					_imageBlock.append( _li );
				}

				//	carouFredSel
				if( _impressionSrc.length > 1 )
				{
					$("#impressionBlock ul").carouFredSel({
						direction: 'up',
						auto: true,
						//responsive	:	true,
						scroll	:	{
							easeing	:	'easeout',
							duration	:	800 
						}
					});
				}


				//	sub
				var len = _thumbSrc.length;
				var _subBlock = $('#thumbBlock')
				for( var i = 0; i < len; i++ )
				{
					var _img = new Image();
					_img.src = _thumbSrc.eq(i).attr('src');
					_subBlock.append( _img );
				}



				//	btn close
				$('#close').bind('click', function(){
					_seClick();
					$('#close').unbind('click');
					$('#gototop02').unbind('click');
					_container.css('position','static');
					//_container.css('display','block');
					_body.scrollTop(_stockScrollTop);
					$( '#detailWrapper' ).remove();
					_isDetail = false;
				}).mouseenter(function(){
					_seHover();
				});

				//	btn toTop
				$('#gototop02').bind('click', function(){
					//
					_seClick();
					var _top = $(window).scrollTop();

					clearInterval( _toTopKey );
					_toTopCount = 0;
					_toTopKey = setInterval( function(){
						_toTopCount++;

						var _par = _toTopCount / 30;
						var _current = easeOutExpo( _toTopCount, _top, - _top, 30 );
						$(window).scrollTop( _current );

						if( _toTopCount == 30 )
						{
							clearInterval( _toTopKey );
							_toTopCount = 0;
							$(window).scrollTop(0);
						}

					}, 1000/60>>0)
				}).mouseenter(function(){
					_seHover();
				});

				if( _ua.iphone )
				{
					$('#close').attr('src','shared/img/btn_close01@2x.gif').addClass('retina');
					$('#gototop02').attr('src','shared/img/btn_gototop02@2x.gif').addClass('retina');
				}


			});
		}

		function _seHover()
		{
			if( !_soundEnable ) return;

			_se.stop();

			var _no = Math.floor( Math.random() * 6 ) + 1;
			_se = createjs.Sound.play('se0' + _no);
			//console.log( _no );
			//console.log( _se, Math.floor( Math.random() * 3 ) );
		}
		function _seClick()
		{
			if( !_soundEnable ) return;
			
			_se.stop();
			_se = createjs.Sound.play('se00');
		}

	})( jQuery );
}

function getUA()
{
	var ua =
	{
		'msie'	:	false,
		'msie6'	:	false,
		'msie7'	:	false,
		'msie8'	:	false,
		'msie9'	:	false,
		'msie10'	:	false,
		'iphone'	:	false,
		'ipad'	:	false,
		'ipod'	:	false,
		'safari'	:	false,
		'firefox'	:	false,
		'chrome'	:	false,
		'opera'	:	false,
		'android'	:	false,
		'androidTablet'	:	false,
		'blackberry'	:	false,
		'windowsMobile'	:	false
	};
	var _ua = navigator.userAgent.toLowerCase();
	_ua = _ua.replace(/ /g, "");
	for( var i in ua )
	{
		if( _ua.indexOf( i ) != -1 )
		{
			ua[i] = true;
		}
	}

	//	another ua....
	if( ua.android )
	{
		//	android
		ua.android = ( ( _ua.indexOf( 'android' ) != -1 && _ua.indexOf( 'mobile' ) != -1 ) && _ua.indexOf( 'sc-01c' ) == -1 )?	true:false;

		//	androidTablet:SC-01C
		ua.androidTablet = ( _ua.indexOf( 'android' ) != -1 && ( _ua.indexOf( 'mobile' ) == -1 || _ua.indexOf( 'sc-01c' ) != -1 ) )?	true:false;
	}

	//	windows mobile
	ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;

	//	retina
	ua.isRetina = ( window.devicePixelRatio>1 && ua.iphone )? true:false;

	return ua;
}

function easeOutExpo(t,b,c,d)
{
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}

function easeInOutExpo(t,b,c,d)
{
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
	return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
}
