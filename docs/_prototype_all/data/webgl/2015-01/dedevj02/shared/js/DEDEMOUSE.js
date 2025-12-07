/// <reference path="WorldVJ.ts" />
var DEDEMOUSE = (function () {
    function DEDEMOUSE(_container) {
        console.log('%cDE DE MOUSE x HACKist.', 'color: #003366;font: bold 16px sans-serif;', DEDEMOUSE.version);
        this.world = new WorldVJ(_container);
    }
    DEDEMOUSE.version = '2.1.3';
    return DEDEMOUSE;
})();

var _ua = getUA();
if( _ua.iphone || _ua.android || _ua.ipad )
{
	$('#controllPC').css('display','none');
	$('#controll').css('display','block');
} else {
	$('#controllPC').css('display','block');
	$('#controll').css('display','none');
}

new DEDEMOUSE(document.getElementById('container'));
setTimeout(function () {
    $('#container').addClass('fadeIn');
}, 1000);
