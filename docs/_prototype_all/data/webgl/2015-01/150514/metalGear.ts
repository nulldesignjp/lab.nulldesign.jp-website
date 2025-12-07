/// <reference path="./jquery.d.ts" />
module metalGear
{
	export class main
	{
		construcotr()
		{
			new sub();
		}
	}

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