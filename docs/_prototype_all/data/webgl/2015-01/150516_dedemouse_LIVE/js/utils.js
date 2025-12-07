/*
    utils.ts
*/
var utils;
(function (utils) {
    var math = (function () {
        function math() {
        }
        math.prototype.round = function (v) {
            return (v * 2 | 0) - (v | 0);
        };
        math.prototype.max = function (v1, v2) {
            return (v1 > v2) ? v1 : v2;
        };
        math.prototype.min = function (v1, v2) {
            return (v1 < v2) ? v1 : v2;
        };
        math.prototype.abs = function (v) {
            return (v ^ (v >> 31)) - (v >> 31);
        };
        math.prototype.floor = function (v) {
            return v << 0;
        };
        math.prototype.ciel = function (v) {
            return (v == v >> 0) ? v : (v + 1) >> 0;
        };
        math.prototype.sin = function (a) {
            return this.round(Math.sin(a) * 100000) * .00001;
        };
        math.prototype.cos = function (a) {
            return this.round(Math.cos(a) * 100000) * .00001;
        };
        math.prototype.asin = function (e) {
            return Math.asin(e);
        };
        math.prototype.scos = function (e) {
            return Math.acos(e);
        };
        math.prototype.degree2rad = function (e) {
            return e * Math.PI / 180;
        };
        math.prototype.rad2degree = function (e) {
            return e * 180 / Math.PI;
        };
        math.prototype.random = function () {
            return Math.random();
        };
        math.prototype.random2 = function () {
            return Math.random() - 0.5;
        };
        math.PI = Math.PI;
        math.hPI = Math.PI * 0.5;
        return math;
    })();
    utils.math = math;
    var array = (function () {
        function array() {
        }
        array.prototype.shuffle = function (arr) {
            var l = arr.length;
            var newArr = arr;
            while (l) {
                var m = Math.floor(Math.random() * l);
                var n = newArr[--l];
                newArr[l] = newArr[m];
                newArr[m] = n;
            }
            return newArr;
        };
        return array;
    })();
    utils.array = array;
    var easeing = (function () {
        function easeing() {
        }
        easeing.prototype.easeNone = function (t, b, c, d) {
            return c * t / d + b;
        };
        easeing.prototype.easeInQuad = function (t, b, c, d) {
            return c * (t /= d) * t + b;
        };
        easeing.prototype.easeOutQuad = function (t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        };
        easeing.prototype.easeInOutQuad = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t + b;
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        };
        easeing.prototype.easeOutInQuad = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutQuad(t * 2, b, c / 2, d);
            return this.easeInQuad((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInCubic = function (t, b, c, d) {
            return c * (t /= d) * t * t + b;
        };
        easeing.prototype.easeOutCubic = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t + 1) + b;
        };
        easeing.prototype.easeInOutCubic = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t + 2) + b;
        };
        easeing.prototype.easeOutInCubic = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutCubic(t * 2, b, c / 2, d);
            return this.easeInCubic((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInQuart = function (t, b, c, d) {
            return c * (t /= d) * t * t * t + b;
        };
        easeing.prototype.easeOutQuart = function (t, b, c, d) {
            return -c * ((t = t / d - 1) * t * t * t - 1) + b;
        };
        easeing.prototype.easeInOutQuart = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t + b;
            return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
        };
        easeing.prototype.easeOutInQuart = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutQuart(t * 2, b, c / 2, d);
            return this.easeInQuart((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInQuint = function (t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        };
        easeing.prototype.easeOutQuint = function (t, b, c, d) {
            return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
        };
        easeing.prototype.easeInOutQuint = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return c / 2 * t * t * t * t * t + b;
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        };
        easeing.prototype.easeOutInQuint = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutQuint(t * 2, b, c / 2, d);
            return this.easeInQuint((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInSine = function (t, b, c, d) {
            return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
        };
        easeing.prototype.easeOutSine = function (t, b, c, d) {
            return c * Math.sin(t / d * (Math.PI / 2)) + b;
        };
        easeing.prototype.easeInOutSine = function (t, b, c, d) {
            return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
        };
        easeing.prototype.easeOutInSine = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutSine(t * 2, b, c / 2, d);
            return this.easeInSine((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInExpo = function (t, b, c, d) {
            return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b - c * 0.001;
        };
        easeing.prototype.easeOutExpo = function (t, b, c, d) {
            return (t == d) ? b + c : c * 1.001 * (-Math.pow(2, -10 * t / d) + 1) + b;
        };
        easeing.prototype.easeInOutExpo = function (t, b, c, d) {
            if (t == 0)
                return b;
            if (t == d)
                return b + c;
            if ((t /= d / 2) < 1)
                return c / 2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
            return c / 2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
        };
        easeing.prototype.easeOutInExpo = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutExpo(t * 2, b, c / 2, d);
            return this.easeInExpo((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInCirc = function (t, b, c, d) {
            return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
        };
        easeing.prototype.easeOutCirc = function (t, b, c, d) {
            return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
        };
        easeing.prototype.easeInOutCirc = function (t, b, c, d) {
            if ((t /= d / 2) < 1)
                return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
            return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
        };
        easeing.prototype.easeOutInCirc = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutCirc(t * 2, b, c / 2, d);
            return this.easeInCirc((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInElastic = function (t, b, c, d) {
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            var p = d * .3;
            var s;
            var a = 0;
            if (!Boolean(a) || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        };
        easeing.prototype.easeOutElastic = function (t, b, c, d) {
            if (t == 0)
                return b;
            if ((t /= d) == 1)
                return b + c;
            var p = d * .3;
            var s;
            var a = 0;
            if (!Boolean(a) || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        };
        easeing.prototype.easeInOutElastic = function (t, b, c, d) {
            if (t == 0)
                return b;
            if ((t /= d / 2) == 2)
                return b + c;
            var p = d * (.3 * 1.5);
            var s;
            var a = 0;
            if (!Boolean(a) || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if (t < 1)
                return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
        };
        easeing.prototype.easeOutInElastic = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutElastic(t * 2, b, c / 2, d);
            return this.easeInElastic((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInBack = function (t, b, c, d) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        };
        easeing.prototype.easeOutBack = function (t, b, c, d) {
            var s = 1.70158;
            return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        };
        easeing.prototype.easeInOutBack = function (t, b, c, d) {
            var s = 1.70158;
            if ((t /= d / 2) < 1)
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        };
        easeing.prototype.easeOutInBack = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutBack(t * 2, b, c / 2, d);
            return this.easeInBack((t * 2) - d, b + c / 2, c / 2, d);
        };
        easeing.prototype.easeInBounce = function (t, b, c, d) {
            return c - this.easeOutBounce(d - t, 0, c, d) + b;
        };
        easeing.prototype.easeOutBounce = function (t, b, c, d) {
            if ((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if (t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
            }
            else if (t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
            }
        };
        easeing.prototype.easeInOutBounce = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeInBounce(t * 2, 0, c, d) * .5 + b;
            else
                return this.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
        };
        easeing.prototype.easeOutInBounce = function (t, b, c, d) {
            if (t < d / 2)
                return this.easeOutBounce(t * 2, b, c / 2, d);
            return this.easeInBounce((t * 2) - d, b + c / 2, c / 2, d);
        };
        return easeing;
    })();
    utils.easeing = easeing;
    var getUA = (function () {
        function getUA() {
            var ua = {
                'msie': false,
                'msie6': false,
                'msie7': false,
                'msie8': false,
                'msie9': false,
                'msie10': false,
                'msie11': false,
                'safari': false,
                'firefox': false,
                'chrome': false,
                'opera': false,
                'android': false,
                'androidTablet': false,
                'iphone': false,
                'iphone4': false,
                'iphone5': false,
                'iphone6': false,
                'ipad': false,
                'ipod': false,
                'iphoneos5': false,
                'iphoneos6': false,
                'iphoneos7': false,
                'iphoneos8': false,
                'android2.2': false,
                'android2.3': false,
                'android4.0': false,
                'android4.1': false,
                'android4.2': false,
                'android4.3': false,
                'android4.4': false,
                'blackberry': false,
                'windowsMobile': false
            };
            var _ua = navigator.userAgent.toLowerCase();
            _ua = _ua.replace(/ /g, "");
            for (var i in ua) {
                if (_ua.indexOf(i) != -1) {
                    ua[i] = true;
                }
                //	msie11
                if (i == 'msie11') {
                    if (_ua.indexOf('rv:11.0') != -1) {
                        ua[i] = true;
                    }
                }
            }
            //	DEVICE
            if (ua.iphone && screen.height == 568) {
                ua.iphone5 = true;
            }
            else {
                ua.iphone4 = true;
            }
            //	another ua....
            if (ua.android) {
                //	android
                ua.android = ((_ua.indexOf('android') != -1 && _ua.indexOf('mobile') != -1) && _ua.indexOf('sc-01c') == -1) ? true : false;
                //	androidTablet:SC-01C
                ua.androidTablet = (_ua.indexOf('android') != -1 && (_ua.indexOf('mobile') == -1 || _ua.indexOf('sc-01c') != -1)) ? true : false;
            }
            //	Nexus7
            ua['isNexus7'] = (_ua.indexOf('nexus7') != -1 && ua.android);
            //	SOL23 Xperia Z1
            ua['sol23'] = (_ua.indexOf('sol23') != -1 && ua.android);
            //	SO-04D Xperia GX
            ua['so04d'] = (_ua.indexOf('so-04d') != -1 && ua.android);
            //	SO-03D Xperia GX
            ua['so03d'] = (_ua.indexOf('so-03d') != -1 && ua.android);
            //	windows mobile
            ua.windowsMobile = (_ua.indexOf('IEMobile') != -1) ? true : false;
            ua.toString = function () {
                return navigator.userAgent;
            };
            return ua;
        }
        return getUA;
    })();
    utils.getUA = getUA;
})(utils || (utils = {}));
var _ = new utils.math();
var round = _.round;
