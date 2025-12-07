/*
	utils.ts
*/


module utils
{
	export class math
	{
		public static PI:number = Math.PI;
		public static hPI:number = Math.PI * 0.5;

		constructor(){}

		round( v:number )		{	return ( v * 2 | 0 ) - ( v | 0 );	}
		max( v1:number, v2:number )	{	return ( v1 > v2 ) ? v1 : v2;	}
		min( v1:number, v2:number )	{	return ( v1 < v2 ) ? v1 : v2;	}
		abs( v:number )		{	return ( v ^ (v >> 31 ) ) - ( v >> 31 );	}
		floor( v:number )		{	return v << 0;	}
		ciel( v:number )		{	return ( v == v >> 0 ) ? v : ( v + 1 ) >> 0;	}
		sin( a:number )		{	return this.round( Math.sin( a ) * 100000 ) * .00001;	}
		cos( a:number )		{	return this.round( Math.cos( a ) * 100000 ) * .00001;	}
		asin( e:number )		{	return Math.asin( e );	}
		scos( e:number )		{	return Math.acos( e );	}
		degree2rad( e:number )	{	return e * Math.PI / 180;	}
		rad2degree( e:number )	{	return e * 180 / Math.PI;	}
		random()		{	return Math.random();	}
		random2()		{	return Math.random() - 0.5;	}
	}
	export class array
	{
		constructor(){}

		shuffle( arr )
		{
			var l = arr.length;
			var newArr = arr;
			while(l){
				var m = Math.floor(Math.random()*l);
				var n = newArr[--l];
				newArr[l] = newArr[m];
				newArr[m] = n;
			}
			return newArr;
		}
	}
	export class easeing
	{
		constructor(){}

		easeNone(t:number,b:number,c:number,d:number)
		{
			return c*t/d + b;
		}
		easeInQuad(t:number,b:number,c:number,d:number)
		{
			return c*(t/=d)*t + b;
		}
		easeOutQuad(t:number,b:number,c:number,d:number)
		{
			return -c *(t/=d)*(t-2) + b;
		}
		easeInOutQuad(t:number,b:number,c:number,d:number)
		{
			if ((t/=d/2) < 1) return c/2*t*t + b;
			return -c/2 * ((--t)*(t-2) - 1) + b;
		}
		easeOutInQuad(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutQuad (t*2, b, c/2, d);
			return this.easeInQuad((t*2)-d, b+c/2, c/2, d);
		}
		easeInCubic(t:number,b:number,c:number,d:number)
		{
			return c*(t/=d)*t*t + b;
		}
		easeOutCubic(t:number,b:number,c:number,d:number)
		{
			return c*((t=t/d-1)*t*t + 1) + b;
		}
		easeInOutCubic(t:number,b:number,c:number,d:number)
		{
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		}
		easeOutInCubic(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutCubic (t*2, b, c/2, d);
			return this.easeInCubic((t*2)-d, b+c/2, c/2, d);
		}
		easeInQuart(t:number,b:number,c:number,d:number)
		{
			return c*(t/=d)*t*t*t + b;
		}
		easeOutQuart(t:number,b:number,c:number,d:number)
		{
			return -c * ((t=t/d-1)*t*t*t - 1) + b;
		}
		easeInOutQuart(t:number,b:number,c:number,d:number)
		{
			if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
			return -c/2 * ((t-=2)*t*t*t - 2) + b
		}
		easeOutInQuart(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutQuart (t*2, b, c/2, d);
			return this.easeInQuart((t*2)-d, b+c/2, c/2, d);
		}
		easeInQuint(t:number,b:number,c:number,d:number)
		{
			return c*(t/=d)*t*t*t*t + b;
		}
		easeOutQuint(t:number,b:number,c:number,d:number)
		{
			return c*((t=t/d-1)*t*t*t*t + 1) + b;
		}
		easeInOutQuint(t:number,b:number,c:number,d:number)
		{
			if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
			return c/2*((t-=2)*t*t*t*t + 2) + b;
		}
		easeOutInQuint(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutQuint (t*2, b, c/2, d);
			return this.easeInQuint((t*2)-d, b+c/2, c/2, d);
		}
		easeInSine(t:number,b:number,c:number,d:number)
		{
			return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
		}
		easeOutSine(t:number,b:number,c:number,d:number)
		{
			return c * Math.sin(t/d * (Math.PI/2)) + b;
		}
		easeInOutSine(t:number,b:number,c:number,d:number)
		{
			return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
		}
		easeOutInSine(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutSine (t*2, b, c/2, d);
			return this.easeInSine((t*2)-d, b+c/2, c/2, d);
		}
		easeInExpo(t:number,b:number,c:number,d:number)
		{
			return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
		}
		easeOutExpo(t:number,b:number,c:number,d:number)
		{
			return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
		}
		easeInOutExpo(t:number,b:number,c:number,d:number)
		{
			if (t==0) return b;
			if (t==d) return b+c;
			if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
			return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
		}
		easeOutInExpo(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutExpo (t*2, b, c/2, d);
			return this.easeInExpo((t*2)-d, b+c/2, c/2, d);
		}
		easeInCirc(t:number,b:number,c:number,d:number)
		{
			return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
		}
		easeOutCirc(t:number,b:number,c:number,d:number)
		{
			return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
		}
		easeInOutCirc(t:number,b:number,c:number,d:number)
		{
			if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
			return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
		}
		easeOutInCirc(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutCirc (t*2, b, c/2, d);
			return this.easeInCirc((t*2)-d, b+c/2, c/2, d);
		}
		easeInElastic(t:number,b:number,c:number,d:number)
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
		easeOutElastic(t:number,b:number,c:number,d:number)
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
		easeInOutElastic(t:number,b:number,c:number,d:number)
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
		easeOutInElastic(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutElastic (t*2, b, c/2, d);
			return this.easeInElastic((t*2)-d, b+c/2, c/2, d);
		}
		easeInBack(t:number,b:number,c:number,d:number)
		{
			var s = 1.70158;
			return c*(t/=d)*t*((s+1)*t - s) + b;
		}
		easeOutBack(t:number,b:number,c:number,d:number)
		{
			var s = 1.70158;
			return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
		}
		easeInOutBack(t:number,b:number,c:number,d:number)
		{
			var s = 1.70158;
			if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
			return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
		}
		easeOutInBack(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutBack (t*2, b, c/2, d);
			return this.easeInBack((t*2)-d, b+c/2, c/2, d);
		}
		easeInBounce(t:number,b:number,c:number,d:number)
		{
			return c - this.easeOutBounce (d-t, 0, c, d) + b;
		}
		easeOutBounce(t:number,b:number,c:number,d:number)
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
		easeInOutBounce(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
			else return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
		}
		easeOutInBounce(t:number,b:number,c:number,d:number)
		{
			if (t < d/2) return this.easeOutBounce (t*2, b, c/2, d);
			return this.easeInBounce((t*2)-d, b+c/2, c/2, d);
		}
	}
	export class getUA
	{
		constructor()
		{
			var ua =
			{
				'msie'	:	false,
				'msie6'	:	false,
				'msie7'	:	false,
				'msie8'	:	false,
				'msie9'	:	false,
				'msie10'	:	false,
				'msie11'	:	false,
				'safari'	:	false,
				'firefox'	:	false,
				'chrome'	:	false,
				'opera'	:	false,

				'android'	:	false,
				'androidTablet'	:	false,

				'iphone'	:	false,
				'iphone4'	:	false,
				'iphone5'	:	false,
				'iphone6'	:	false,
				'ipad'	:	false,
				'ipod'	:	false,
				'iphoneos5'	:	false,
				'iphoneos6'	:	false,
				'iphoneos7'	:	false,
				'iphoneos8'	:	false,
				'android2.2'	:	false,
				'android2.3'	:	false,
				'android4.0'	:	false,
				'android4.1'	:	false,
				'android4.2'	:	false,
				'android4.3'	:	false,
				'android4.4'	:	false,

				'blackberry'	:	false,
				'windowsMobile'	:	false
			};
			var _ua = navigator.userAgent.toLowerCase();
			_ua = _ua.replace(/ /g, "");
			for( var i in ua )
			{
				if( _ua.indexOf( i ) != -1 )
				{
					ua[i] = true;
				}

				//	msie11
				if( i == 'msie11' )
				{
					if( _ua.indexOf( 'rv:11.0' ) != -1 )
					{
						ua[i] = true;
					}
				}
			}

			//	DEVICE
			if( ua.iphone && screen.height == 568 )
			{
				ua.iphone5 = true;
			} else {
				ua.iphone4 = true;
			}

			//	another ua....
			if( ua.android )
			{
				//	android
				ua.android = ( ( _ua.indexOf( 'android' ) != -1 && _ua.indexOf( 'mobile' ) != -1 ) && _ua.indexOf( 'sc-01c' ) == -1 )?	true:false;

				//	androidTablet:SC-01C
				ua.androidTablet = ( _ua.indexOf( 'android' ) != -1 && ( _ua.indexOf( 'mobile' ) == -1 || _ua.indexOf( 'sc-01c' ) != -1 ) )?	true:false;
			}

			//	Nexus7
			ua['isNexus7'] = ( _ua.indexOf( 'nexus7' ) != -1 && ua.android );

			//	SOL23 Xperia Z1
			ua['sol23'] = ( _ua.indexOf( 'sol23' ) != -1 && ua.android );

			//	SO-04D Xperia GX
			ua['so04d'] = ( _ua.indexOf( 'so-04d' ) != -1 && ua.android );

			//	SO-03D Xperia GX
			ua['so03d'] = ( _ua.indexOf( 'so-03d' ) != -1 && ua.android );


			//	windows mobile
			ua.windowsMobile = ( _ua.indexOf( 'IEMobile' ) != -1 )?	true:false;

			ua.toString = function()
			{
				return navigator.userAgent;
			}

			return ua;
		}
	}
}
var _ = new utils.math();
var round = _.round;