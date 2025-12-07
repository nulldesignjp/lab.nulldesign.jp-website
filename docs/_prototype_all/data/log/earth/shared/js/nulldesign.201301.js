/*
	nulldesign.201301.js
*/

var _ua = getUA();

var _isWebGlEnabled = Detector.webgl;


if( _ua.android || _ua.iphone || !_isWebGlEnabled )
{
	//	mobile
	document.write('<script type="text/javascript" src="shared/js/engineMobile.js"></script>');

} else if( _ua.chrome || _ua.safari || _ua.firefox )
{
	document.write('<script type="text/javascript" src="shared/js/engine.js"></script>');
	
} else if( _ua.msie )
{
	//	ie
	if( /*_ua.msie9 || */_ua.msie10 )
	{
		document.write('<script type="text/javascript" src="shared/js/engine.js"></script>');
	} else {
		//	not support.
		document.write('<script type="text/javascript" src="shared/js/engineMobile.js"></script>');
		
	}
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
		'iphone5'	:	false,
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

	if( ua.iphone )
	{
		var _w = window.innerWidth;
		var _h = window.innerHeight;

		if( _w/_h < 0.75 && _h/_w > 1.350)
		{
			ua.iphone5 = true;
		}
	}

	//	windows mobile
	ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;
	return ua;
}