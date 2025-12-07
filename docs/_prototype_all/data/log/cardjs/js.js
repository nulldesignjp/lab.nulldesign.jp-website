/*
	js.js
*/

$(function(){
	(function($){
		var _fList = [
			'img01.jpg',
			'img02.jpg',
			'img03.jpg',
			'img04.jpg',
			'img05.jpg'
		];
		var _imgs = [
			'imgs/tumblr_m64pfoELfA1r6y3u1o1_500.jpg',
			'imgs/tumblr_m9dik3u4ON1qf15uko1_500.jpg',
			'imgs/tumblr_ljir8hqk0N1qb230qo1_500-1.png',
			'imgs/tumblr_m0d6bsqBtJ1qm6onko1_500.jpg',
			'imgs/tumblr_m19rzboAls1qaqpi4o1_500.jpg'
		];
		var len = _fList.length;
		for( var i = 0; i < len; i++ )
		{
			var _c = new card( _fList[i] );
			$( '#container' ).append( _c.view );
			//$( _c.view ).colorbox({href:_imgs[i]});
		}
	})(jQuery);
})