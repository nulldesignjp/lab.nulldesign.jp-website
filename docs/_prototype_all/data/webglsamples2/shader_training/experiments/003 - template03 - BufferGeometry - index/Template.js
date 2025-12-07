/*
	Template.js
*/

var TemplateClass = (function(){
	function main( scene )
	{
		this.isUpdate;
		this.scene;
		this.mesh;

		this.init( scene );
	}

	main.prototype = 
	{
		init : function( scene )
		{
			this.scene = scene;
		},
		update : function()
		{
			var _t = this;
			this.isUpdate = window.requestAnimationFrame( function(){	_t.update(); })
		},
		draw : function(){},
		viewWillAppear : function()
		{
			var _t = this;
			this.mesh.scale.set( 0.01, 0.01, 0.01 );
			TweenMax.to( this.mesh.scale, 1.0, {	x: 1.0, y: 1.0, z: 1.0,
				onComplete: function()
				{
					_t.viewDidAppear();
				}
			})
		},
		viewDidAppear : function(){},
		viewWillDisappear : function()
		{
			this.viewDidDisappear();
		},
		viewDidDisappear : function()
		{
			this.dispose();
		},
		dispose : function()
		{
			window.cancelAnimationFrame( this.isUpdate );

			this.scene.remove( this.mesh );
			this.mesh = null;
			this.scene = null;
			return false;
		}
	};

	return main;
})();