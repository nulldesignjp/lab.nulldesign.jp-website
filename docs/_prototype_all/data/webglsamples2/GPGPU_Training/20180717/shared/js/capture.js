/*
	engine.js
*/


var capture = (function(){
	function capture( _canvas )
	{
		this.canvas = _canvas;
	}

	capture.prototype = {
		shoot : function(){
			_url = this.canvas.toDataURL('image/jpeg');
			window.open( _url, null );
		}
	};

	return capture;
})();

