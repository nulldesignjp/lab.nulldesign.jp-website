/*
	STANDERD 07_55 CAPS
	you need(not) CANVAS.
*/


var Standard0755 = function(e,s)
{
	this.srcFile = e?e:'shared/js/standars0755.gif';
	this.initialize.apply( this );
	this.isInitialize = false;
	this.typo = {};
	this.stocList = [];
	this.height = 300;
	this.scale = s?s:1;
};

Standard0755.version = '1.0.0';
Standard0755.typo = {
	' ': [47,10,2,7],
	'a': [0,0,4,7],
	'b': [5,0,4,7],
	'c': [10,0,4,7],
	'd': [15,0,4,7],
	'e': [20,0,4,7],
	'f': [25,0,4,7],
	'g': [30,0,4,7],
	'h': [35,0,4,7],
	'i': [40,0,1,7],
	'j': [42,0,4,7],
	'k': [47,0,4,7],
	'l': [52,0,3,7],
	'm': [56,0,5,7],
	'n': [62,0,4,7],
	'o': [67,0,4,7],
	'p': [72,0,4,8],
	'q': [77,0,4,7],
	'r': [82,0,4,7],
	's': [87,0,4,7],
	't': [92,0,3,7],
	'u': [96,0,4,7],
	'v': [101,0,5,7],
	'w': [107,0,7,7],
	'x': [115,0,4,7],
	'y': [120,0,5,7],
	'z': [126,0,4,7],
	'0': [0,9,4,8],
	'1': [5,9,2,8],
	'2': [8,9,4,8],
	'3': [13,9,4,8],
	'4': [18,9,4,8],
	'5': [23,9,4,8],
	'6': [28,9,4,8],
	'7': [33,9,4,8],
	'8': [38,9,4,8],
	'9': [43,9,4,8],
	'!': [49,9,1,8],
	'@': [51,9,7,9],
	'#': [59,9,5,8],
	'$': [65,9,5,8],
	'%': [71,9,7,8],
	'^': [79,9,5,4],
	'&': [85,9,5,8],
	'*': [91,9,3,7],
	'(': [95,9,3,9],
	')': [99,9,3,9],
	'_': [103,9,5,8],
	'+': [109,9,5,7],
	'-': [115,9,3,5],
	'=': [119,9,4,6],
	'{': [124,9,3,9],
	'}': [124,9,3,9],
	'{': [128,9,3,9],
	'[': [132,9,2,9],
	']': [135,9,2,9],
	':': [138,9,1,7],
	'"': [140,9,4,4],
	';': [145,9,2,10],
	'\'': [148,9,2,5],
	',': [151,9,2,10],
	'.': [154,9,1,8],
	'/': [156,9,4,8],
	'<': [161,9,3,8],
	'>': [165,9,3,8],
	'?': [169,9,4,8],
	'\\': [174,9,4,8],
	'|': [180,9,1,9]
}

Standard0755.lineHeight = 10;
Standard0755.letterSpacing = 1;

Standard0755.prototype = {
	initialize	:	function()
	{
		var _this = this;
		var _txtPlate = new Image();
		_txtPlate.onload = function()
		{
			for( var i in Standard0755.typo )
			{
				var _c = document.createElement('canvas');
				var _ctx = _c.getContext('2d');
				var _t = Standard0755.typo[i];
				var _x = _t[0];
				var _y = _t[1];
				var _w = _t[2];
				var _h = _t[3];

				_c.width = _w;
				_c.height = _h;
				_ctx.drawImage( _txtPlate, _x, _y, _w, _h,0,0, _w, _h );

				_this.typo[i] = _c;
			}
			_this.isInitialize = true;

			if( _this.stocList )
			{
				var _list = _this.stocList;
				var len = _list.length;
				for( var i = 0; i < len; i++ )
				{
					_this.drawTypo( _list[i][0], _list[i][1] );
				}
			}
		}
		_txtPlate.src = this.srcFile;
	},
	drawTypo	:	function( _canvas, _text )
	{
		if( !this.isInitialize )
		{
			this.stocList.push( [_canvas, _text] );
			return false;
		}

		_text = _text.toLowerCase();

		var _ctx = _canvas.getContext('2d');
		_ctx.beginPath();

		var len = _text.length;
		var _pointerX = 0;
		var _pointerY = 0;
		for( var i = 0; i < len; i++ )
		{
			var _t = _text.substr( i, 1 );
			var _c = this.typo[_t];

			if( _t == '\n' )
			{
				_pointerX = 0;
				_pointerY += Standard0755.lineHeight;
				continue;
			} else if( _t == '\t' )
			{
				_pointerX = Math.floor( _pointerX / 4 ) + 1;
				_pointerX *= 4;
				continue;
			}

			if( _pointerX + _c.width + Standard0755.letterSpacing > _canvas.width ){
				_pointerX = 0;
				_pointerY += Standard0755.lineHeight;
			}

			//	誤差の補正
			var _str = '0123456789!@#$%^&*()_+-=[]{}\\|;\':"<>?,./';
			var _adjust = ( _str.indexOf( _t ) != -1 )? -1:0;

			_ctx.drawImage( _c, _pointerX, _pointerY+_adjust, _c.width, _c.height );
			_pointerX += _c.width + Standard0755.letterSpacing;
		}

		_ctx.fill();

		this.height = _pointerY + Standard0755.lineHeight;
	},
	clearTypo	:	function( _canvas )
	{
		var _ctx = _canvas.getContext('2d');
		_ctx.clearRect( 0, 0, _canvas.width, _canvas.height );
	}
};

