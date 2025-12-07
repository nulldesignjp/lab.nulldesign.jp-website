/// <reference path="./jquery.d.ts" />
module metalGear
{
	//	module定数/変数
	export var hoge:string = 'ts';

	//	参照可能なクラス
	export class main
	{
		public static hoge:number = 0;

		constructor()
		{
			new sub();
		}
	}

	//	参照できないクラス
	class sub
	{
		constructor()
		{
			$( window ).on( 'click', function(e:any){
				var _x:number = e.originalEvent.pageX;
				var _y:number = e.originalEvent.pageY;
				console.log( _x, _y );
			});
		}
	}
}

var _t = new metalGear.main();

console.log( _t );
console.log( metalGear.main.hoge );
console.log( metalGear.hoge );