/// <reference path="./jquery.d.ts" />
var metalGear;
(function (metalGear) {
    //	module定数/変数
    metalGear.hoge = 'ts';
    //	参照可能なクラス
    var main = (function () {
        function main() {
            new sub();
        }
        main.hoge = 0;
        return main;
    })();
    metalGear.main = main;
    //	参照できないクラス
    var sub = (function () {
        function sub() {
            $(window).on('click', function (e) {
                var _x = e.originalEvent.pageX;
                var _y = e.originalEvent.pageY;
                console.log(_x, _y);
            });
        }
        return sub;
    })();
})(metalGear || (metalGear = {}));
var _t = new metalGear.main();
console.log(_t);
console.log(metalGear.main.hoge);
console.log(metalGear.hoge);
