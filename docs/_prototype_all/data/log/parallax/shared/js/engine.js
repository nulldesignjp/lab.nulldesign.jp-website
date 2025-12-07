/*
	engine.js
*/

var ND = ND | {};
window.onload = function()
{
	var _version = 0;
	var _ua = getUA();
	var _vartualTop = $(window).scrollTop();

	(function($){

		//	非対応端末処理
		if( _ua.msie6 || _ua.msie7 || _ua.msie8 )
		{
			$( '#main' ).load('shared/xml/unusage.html?v=' + _version );
			return false;
		}

		var _pval = [
			{
				element: '.section img',
				start: $(window).height(),
				end: 0,
				startProperties: {
					'margin-left': $(window).width() - 82,
					'opacity': 0.4
				},
				endProperties: {
					'margin-left': 0,
					'opacity': 1
				},
				easeing: 'easeInOutElastic'
			}
		];
		var _mover = new parallaxData( _pval );
		var _p = new parallax( render );
		_p.start();

		function render()
		{
			//	easeing value.
			_vartualTop += ( $(window).scrollTop() - _vartualTop ) * .2;

			$( '.section' ).each(function(i,e){
				var _top = $(this).offset().top;
				var _par = ( _top - _vartualTop ) / 100;
				_par = _par * (200 + i * 30 );


				var _par = _top - _vartualTop;

				_par = _par * ( .4 + i * .02 ) - 100;

				_par = i%2==0? _par * -1:_par;

				$(this).css('background-position', '0 ' + _par + 'px');
			});

			_mover.update( _vartualTop );

		}

	})(jQuery);
}