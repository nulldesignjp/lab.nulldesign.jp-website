/*
	jQuery.colorMatrixFilter.js
*/
$(function(){
(function( $ )
{
	var CoreEngine = function(){}
	
	CoreEngine.prototype = 
	{
		_matrix	:	{
			normal	:	[
				1,	0,	0,	0,	0,
				0,	1,	0,	0,	0,
				0,	0,	1,	0,	0,
				0,	0,	0,	1,	0
			],
			gray	:	[
				.3,	.59,	.11,	0,	0,
				.3,	.59,	.11,	0,	0,
				.3,	.59,	.11,	0,	0,
				0,	0,	0,	1,	0
			],
			sepia	:	[
				.9,	0,	0,	0,	0,
				0,	.7,	0,	0,	0,
				0,	0,	.4,	0,	0,
				0,	0,	0,	1,	0
			],
			red	:	[
				1,	0,	0,	0,	0,
				0,	0,	0,	0,	0,
				0,	0,	0,	0,	0,
				0,	0,	0,	1,	0
			],
			green	:	[
				0,	0,	0,	0,	0,
				0,	1,	0,	0,	0,
				0,	0,	0,	0,	0,
				0,	0,	0,	1,	0
			],
			blue	:	[
				0,	0,	0,	0,	0,
				0,	0,	0,	0,	0,
				0,	0,	1,	0,	0,
				0,	0,	0,	1,	0
			],
			invert	:	[
				-1,	0,	0,	0,	255,
				0,	-1,	0,	0,	255,
				0,	0,	-1,	0,	255,
				0,	0,	0,	1,	0
			]
		},
		
		//	static const
		LUM_R	:	0.212671,
		LUM_G	:	0.715160,
		LUM_B	:	0.072169,
			
		/**
		* 色相 (Hue) 彩度 (Saturation) 明度 (Brightness) コントラスト (Contrast)　を一括で変更します。
		* 
		* @param hue -180 <- 0 -> 180 の範囲で変更します。
		* @param saturation 0 以上で変更します。
		* @param brightness -1 <- 0 -> 1 の範囲で変更します。
		* @param contrast -1 <- 0 -> 1 の範囲で変更します。
		*/
		/*
		adjustColor	:	function(hue, saturation, brightness, contrast)
		{
			var _result;
			_result = this.adjustHue(hue);
			_result = this.adjustSaturation(saturation);
			_result = this.adjustBrightness(brightness);
			_result = this.adjustContrast(contrast);
			return _result;
		},
		*/
		/**
		* 色相 (Hue) を変更します。
		* 
		* @param degree -180 <- 0 -> 180 の範囲で指定します。
		*/
		
		adjustHue	:	function( _targetElement, degree )
		{
			var lumR = this.LUM_R;
			var lumG = this.LUM_G;
			var lumB = this.LUM_B;
				
			var radians = degree * Math.PI / 180;
			var cos = Math.cos(radians);
			var sin = Math.sin(radians);
			
			var a = [
				lumR + cos * (1 - lumR) + sin * -lumR      , lumG + cos * -lumG      + sin * -lumG, lumB + cos * -lumB      + sin * (1 - lumB), 0, 0,
				lumR + cos * -lumR      + sin * 0.143      , lumG + cos * (1 - lumG) + sin * 0.140, lumB + cos * -lumB      + sin * -0.283    , 0, 0,
				lumR + cos * -lumR      + sin * -(1 - lumR), lumG + cos * -lumG      + sin * lumG , lumB + cos * (1 - lumB) + sin * lumB      , 0, 0,
				0, 0, 0, 1, 0
			];
			
			return this._doMatrix( _targetElement, a );
			
		},
		
			
		/**
		* 彩度 (Saturation) を変更します。
		* 0 の時にグレースケールになります。
		* 
		* @param value 0 以上を指定します。
		*/
		adjustSaturation	:	function( _targetElement, value )
		{
			var n = 1 - value;
		
			var r = this.LUM_R * n;
			var g = this.LUM_G * n;
			var b = this.LUM_B * n;
			
			var a = [
					r + value, g        , b        , 0, 0,
					r        , g + value, b        , 0, 0,
					r        , g        , b + value, 0, 0,
					0, 0, 0, 1, 0
				];
				
			return this._doMatrix( _targetElement, a );
			
		},
		
		
		/**
		* 明度 (Brightness) を変更します。
		* 
		* @param value -1 <- 0 -> 1 の範囲で指定します。
		*/
		adjustBrightness	:	function( _targetElement, value )
		{
			
			value *= 255;
			var a = [
					1, 0, 0, 0, value,
					0, 1, 0, 0, value,
					0, 0, 1, 0, value,
					0, 0, 0, 1, 0
				];
			return this._doMatrix( _targetElement, a );
		},
		
		
		
		/**
		* コントラスト (Contrast) を変更します。
		* 
		* @param value -1 <- 0 -> 1 の範囲で指定します。
		*/
		adjustContrast	:	function( _targetElement, value )
		{
			var a = [
					value + 1, 0        , 0        , 0, -(128 * value),
					0        , value + 1, 0        , 0, -(128 * value),
					0        ,      0   , value + 1, 0, -(128 * value),
					0, 0, 0, 1, 0
				];
			return this._doMatrix( _targetElement, a );
		},	
		_doMatrix	:	function( _targetElement, a )
		{
			//	alert( _targetElement[0] ) image element
		
			if( IsArray( _targetElement ) )
			{
				var len = _targetElement.length;
				for( var i = 0; i < len; i++ )
				{
					this.__doMatrix( _targetElement[i], a );
				}
				return _targetElement;
			}
			
			return this.__doMatrix( _targetElement.context, a )
			
		},	
		__doMatrix	:	function( _targetElement, a )
		{
			var _this = _targetElement;
			
			if( _this.tagName == 'IMG' || _this.tagName == 'CANVAS' )
			{
				var _canvas = document.createElement('canvas');
				var _ctx = _canvas.getContext('2d');
				var _img = _this;
				
				if( _canvas && _ctx )
				{
					_canvas.width = _img.width;
					_canvas.height = _img.height;
					
					$( _img ).after( _canvas );
					//	$( _img ).parent().append( _canvas );
					
					_ctx.drawImage( _img, 0, 0 );
					
					var _input = _ctx.getImageData( 0, 0, _img.width, _img.height );
					var _output = _ctx.createImageData( _img.width, _img.height );
					
					var _list = _input.data;
					var len = _list.length;
					for( var i = 0; i < len; i += 4 )
					{
						var _r = _list[i];
						var _g = _list[i+1];
						var _b = _list[i+2];
						var _a = _list[i+3];
						
						var _newR = ( a[0]  * _r ) + ( a[1]  * _g ) + ( a[2]  * _b ) + ( a[3]  * _a ) + a[4];
						var _newG = ( a[5]  * _r ) + ( a[6]  * _g ) + ( a[7]  * _b ) + ( a[8]  * _a ) + a[9];
						var _newB = ( a[10] * _r ) + ( a[11] * _g ) + ( a[12] * _b ) + ( a[13] * _a ) + a[14];
						var _newA = ( a[15] * _r ) + ( a[16] * _g ) + ( a[17] * _b ) + ( a[18] * _a ) + a[19];
						
						_output.data[i] = _newR;
						_output.data[i+1] = _newG;
						_output.data[i+2] = _newB;
						_output.data[i+3] = _newA;
					}
					
					_ctx.putImageData( _output, 0, 0 );
					$( _img ).remove();
					
					return $( _canvas );
				
				}
				
				return _this;
			};
			
			return _this;
		},
		
		
		/**
		* 指定のしきい値を元に、範囲内に収まっているものは黒、超えているものは白に区別します。
		* 
		* @param value しきい値です。
		*/
		threshold	:	function( _targetElement, value )
		{
			var lumR = this.LUM_R;
			var lumG = this.LUM_G;
			var lumB = this.LUM_B;
			
			var a = [
					lumR * 256, lumG * 256, lumB * 256, 0, -256 * value, 
					lumR * 256, lumG * 256, lumB * 256, 0, -256 * value, 
					lumR * 256, lumG * 256, lumB * 256, 0, -256 * value, 
					0, 0, 0, 1, 0
				];
			return this._doMatrix( _targetElement, a );	
		},
		matrix	:	function( _targetElement, e )
		{
			var a = this._matrix[e];
			return this._doMatrix( _targetElement, a );
		},
		custom	:	function( _targetElement, e )
		{
			return this._doMatrix( _targetElement, e );
		}

	};
	
	var IsArray = function( array )
	{
		return !(
			!array || 
			(!array.length || array.length == 0) || 
			typeof array !== 'object' || 
			!array.constructor || 
			array.nodeType || 
			array.item 
		);
	}
	
	
	/*
		public api
		http://www.nicovideo.jp/watch/sm13516833
		http://www.nicovideo.jp/watch/sm16309076
		hashiomto, shiraishi
	*/
	_api = new CoreEngine();
	
	$.fn.extend({
		colorMatrix	:	function( param )
		{
			if( typeof param == 'string' )
			{
				//	set
				return _api.matrix( this, param );
			} else if ( IsArray( param) ) {
				return _api.custom( this, param );
			}
			return this;
		},
		adjustColor	:	function( _v0, _v1, _v2, _v3 )
		{
			var _this = _api.adjustHue( this, _v0 );
			_this = _api.adjustSaturation( _this, _v1 );
			_this = _api.adjustBrightness( _this, _v2 );
			_this = _api.adjustContrast( _this, _v3 );			
			return _this;
		},
		adjustHue	:	function( value )
		{
			return _api.adjustHue( this, value );
		},
		adjustSaturation	:	function( value )
		{
			return _api.adjustSaturation( this, value );
		},
		adjustBrightness	:	function( value )
		{
			return _api.adjustBrightness( this, value );
		},
		adjustContrast	:	function( value )
		{
			return _api.adjustContrast( this, value );
		},
		threshold	:	function ( value )
		{
			return _api.threshold( this, value );
		}
	});
})( jQuery );
});

