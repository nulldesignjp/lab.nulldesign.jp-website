var ProgressBar = (function(){
	function ProgressBar()
	{
		this.total;
		this.current;
		this.value;
		this.callBack;

		this.dom;
		this.canvas;
		this.ctx;

		this.animationKey;

		this.init();
	}

	ProgressBar.prototype = {
		init : function(){

			this.total = 0;
			this.current = 0;
			this.value = 0;

			this.dom = $('<div>').css({
				'position': 'fixed',
				'left': '50%',
				'top': '50%',
				'margin':' -12px 0 0 -100px',
				'width': '200px',
				'height': '8px',
				'text-align': 'left',
				'size': '8px',
				'line-height': '0',
				'color': '0xFFFFFF',
				'font-weight': 'bold',
				'z-index': '10000',
				'border':'1px solid #999'
			});
			$('body').append( this.dom );

			this.canvas = document.createElement('canvas');
			this.canvas.width = 200;
			this.canvas.height = 8;
			this.ctx = this.canvas.getContext('2d');

			$( this.canvas ).css({
				'position':'relative',
				'display':'block'
			});


			$( this.dom ).append( this.canvas );
		},
		start : function(){
			this.update();
		},
		close : function(){
			this.kill();
		},
		update : function(){
			var _t = this;
			if( this.total != 0 )
			{
				var _par = this.current / this.total;
				this.value += ( _par - this.value ) * 0.04;

				this.ctx.beginPath();
				//this.ctx.fillStyle = 0xFFFFFF;
				//this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height );

				var _grad  = this.ctx.createLinearGradient(0,0, this.canvas.width,0);
				_grad.addColorStop(0,'rgb(0, 51, 51)');    // 赤
				_grad.addColorStop(1.0,'rgb(51, 204, 204)'); // 緑
				this.ctx.fillStyle = _grad;
				this.ctx.rect(0, 0, ( this.canvas.width - 2 ) * this.value, this.canvas.height - 2 );
				this.ctx.fill();
			}


			//$( _t.dom ).text( Math.floor( _t.value * 100 ) + '%');
			_t.draw();
			_t.animationKey = window.requestAnimationFrame( function(){	_t.update();	} );

			if( _par >= 1 && this.value > 0.999 )
			{
				window.cancelAnimationFrame( _t.animationKey );
				this.callBack();
			}
		},
		draw : function(){},
		kill : function(){
			var _t = this;
			$( _t.dom ).remove();
		}
	}

	return ProgressBar;
})();