

var _sampleCode = (function(){
	function main(){}
	main.prototype = {};
	return main;
})();







/*
	easing
*/


function easeNone(t,b,c,d)
{
	return c*t/d + b;
}
//	QUAD
function easeInQuad(t,b,c,d)
{
	return c*(t/=d)*t + b;
}
function easeOutQuad(t,b,c,d)
{
	return -c *(t/=d)*(t-2) + b;
}
function easeInOutQuad(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}
function easeOutInQuad(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuad (t*2, b, c/2, d);
	return this.easeInQuad((t*2)-d, b+c/2, c/2, d);
}
//	CUBIC
function easeInCubic(t,b,c,d)
{
	return c*(t/=d)*t*t + b;
}
function easeOutCubic(t,b,c,d)
{
	return c*((t=t/d-1)*t*t + 1) + b;
}
function easeInOutCubic(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
}
function easeOutInCubic(t,b,c,d)
{
	if (t < d/2) return this.easeOutCubic (t*2, b, c/2, d);
	return this.easeInCubic((t*2)-d, b+c/2, c/2, d);
}
//	QUART
function easeInQuart(t,b,c,d)
{
	return c*(t/=d)*t*t*t + b;
}
function easeOutQuart(t,b,c,d)
{
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
}
function easeInOutQuart(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b
}
function easeOutInQuart(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuart (t*2, b, c/2, d);
	return this.easeInQuart((t*2)-d, b+c/2, c/2, d);
}
//	QUINT
function easeInQuint(t,b,c,d)
{
	return c*(t/=d)*t*t*t*t + b;
}
function easeOutQuint(t,b,c,d)
{
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}
function easeInOutQuint(t,b,c,d)
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
}
function easeOutInQuint(t,b,c,d)
{
	if (t < d/2) return this.easeOutQuint (t*2, b, c/2, d);
	return this.easeInQuint((t*2)-d, b+c/2, c/2, d);
}
//	SINE
function easeInSine(t,b,c,d)
{
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}
function easeOutSine(t,b,c,d)
{
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}
function easeInOutSine(t,b,c,d)
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}
function easeOutInSine(t,b,c,d)
{
	if (t < d/2) return this.easeOutSine (t*2, b, c/2, d);
	return this.easeInSine((t*2)-d, b+c/2, c/2, d);
}
//	EXPO
function easeInExpo(t,b,c,d)
{
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}
function easeOutExpo(t,b,c,d)
{
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}
function easeInOutExpo(t,b,c,d)
{
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
	return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
}
function easeOutInExpo(t,b,c,d)
{
	if (t < d/2) return this.easeOutExpo (t*2, b, c/2, d);
	return this.easeInExpo((t*2)-d, b+c/2, c/2, d);
}
//	CIRC
function easeInCirc(t,b,c,d)
{
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}
function easeOutCirc(t,b,c,d)
{
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}
function easeInOutCirc(t,b,c,d)
{
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}
function easeOutInCirc(t,b,c,d)
{
	if (t < d/2) return this.easeOutCirc (t*2, b, c/2, d);
	return this.easeInCirc((t*2)-d, b+c/2, c/2, d);
}
//	ELASTIC
function easeInElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = d*.3;
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}
function easeOutElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = d*.3;
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}
function easeInOutElastic(t,b,c,d)
{
	if (t==0) return b;
	if ((t/=d/2)==2) return b+c;
	var p = d*(.3*1.5);
	var s;
	var a = 0;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}
function easeOutInElastic(t,b,c,d)
{
	if (t < d/2) return this.easeOutElastic (t*2, b, c/2, d);
	return this.easeInElastic((t*2)-d, b+c/2, c/2, d);
}
//	BACK
function easeInBack(t,b,c,d)
{
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}
function easeOutBack(t,b,c,d)
{
	var s = 1.70158;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}
function easeInOutBack(t,b,c,d)
{
	var s = 1.70158;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}
function easeOutInBack(t,b,c,d)
{
	if (t < d/2) return this.easeOutBack (t*2, b, c/2, d);
	return this.easeInBack((t*2)-d, b+c/2, c/2, d);
}
//	BOUNCE
function easeInBounce(t,b,c,d)
{
	return c - this.easeOutBounce (d-t, 0, c, d) + b;
}
function easeOutBounce(t,b,c,d)
{
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}
function easeInOutBounce(t,b,c,d)
{
	if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
	else return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
}
function easeOutInBounce(t,b,c,d)
{
	if (t < d/2) return this.easeOutBounce (t*2, b, c/2, d);
	return this.easeInBounce((t*2)-d, b+c/2, c/2, d);
}