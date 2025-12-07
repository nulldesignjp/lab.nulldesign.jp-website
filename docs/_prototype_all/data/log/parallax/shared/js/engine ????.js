/*
	engine.js
*/

var ND = ND | {};
window.onload = function()
{
	var _ua = getUA();
	var _result;
	var _touchStartValue = 0;
	var _past = $(document).scrollTop();
	var _targetTop = 0;

	(function($){

		//	非対応環境
		if( _ua.msie6 || _ua.msie7 || _ua.msie8 )
		{
			$( '#main' ).load('shared/xml/unusage.html');
			return false;
		}

		//	earth_atmos_2048.jpg

		$('#container').css('height','1000%');
		$('img').css('position','fixed');
		$('p').css('padding','1em 32px');


		function hoge()
		{
			__parallax();
			requestAnimationFrame( hoge )
		}

		hoge();

		$(document).bind('scroll',function(e){
			//__parallax();
		});
		$(document).bind('touchstart',function(e){
			_touchStartValue = e.originalEvent.touches[0].pageY * window.devicePixelRatio*2;
		});
		$(document).bind('touchmove',function(e){

			var _currentFingurs = e.originalEvent.touches[0].pageY * window.devicePixelRatio*2;

			var _top = $(document).scrollTop();
			//$(document).scrollTop( _top + _touchStartValue - _currentFingurs );

			_targetTop = _top + _touchStartValue - _currentFingurs;

			_touchStartValue = _currentFingurs;

			__parallax();

			e.preventDefault();
		});

		function __parallax()
		{
			var _current = $(document).scrollTop();
			_current += ( _targetTop - _current ) * .1;
			$(document).scrollTop( _current );
			var _deg = _current % 360;
			var _rad = _deg / 180 * Math.PI;
			var _sin = Math.sin( _rad ) * 100 + $(window).height() * .5;
			var _cos = Math.cos( _rad ) * 100 + $(window).width() * .5;

			$('img').css({
				'left': _cos + 'px',
				'top': _sin + 'px'
			});
			$('img').css('-webkit-transform','rotate('+_deg+'deg)');

			var _max = $(document).height() - $(window).height();
			var _par = _current / _max;
			var _bg = 255 * ( 1 - _par ) >> 0;
			var _col = 255 * _par >> 0;

			$('body').css({
				'background-color': 'rgba( '+_bg+', '+_bg+', '+_bg+', 1.0)',
				'color': 'rgba( '+_col+', '+_col+', '+_col+', 1.0)'
			});
		}

	})(jQuery);
}

window.requestAnimationFrame = (function(){
	return window.requestAnimationFrame		||
		window.webkitRequestAnimationFrame	||
		window.mozRequestAnimationFrame		||
		window.oRequestAnimationFrame		||
		window.msRequestAnimationFrame		||
		function(callback, element){
			window.setTimeout(callback, 1000 / 60);
		};
})();