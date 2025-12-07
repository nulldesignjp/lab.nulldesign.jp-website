/*
	dropSphere3d.js
*/

var dropSphere3d = (function(){
	var dropSphere3d = function( _view )
	{
		this.view = _view;
		this.px = this.x;
		this.py = this.y;
		this.pz = this.z;
		this.radius = 100;
	};

	dropSphere3d.grav = 1.0;
	dropSphere3d.prototype = {
		setPosition	:	function( x, y )
		{
			this.x = this.px = x;
			this.y = this.py = y;
		},
		update	:	function()
		{
			var tempX = this.x;
			var tempY = this.y;
			var tempZ = this.z;
			this.x += this.vx;
			this.y += this.vy;
			this.z += this.vz;
			this.px = tempX;
			this.py = tempY;
			this.pz = tempZ;
		},
		constrain	:	function( a, b, c, d )
		{
			this.x = Math.max(a, Math.min(a + c, this.x));
			this.y = Math.max(b, Math.min(b+d, this.y));
		},
		get vx()
		{
			return this.x - this.px;
		},
		set vx( e )
		{
			this.px = this.x - e;
		},
		get vy()
		{
			return this.y - this.py;
		},
		set vy( e )
		{
			this.py = this.y - e;
		},
		get vz()
		{
			return this.z - this.pz;
		},
		set vz( e )
		{
			this.pz = this.z - e;
		},
		get scale()
		{
			return this.view.scale.x;
		},
		set scale( e )
		{
			this.view.scale.x = e;
			this.view.scale.y = e;
			this.view.scale.z = e;
		},
		get x()
		{
			return this.view.position.x;
		},
		set x( e )
		{
			this.view.position.x = e;
		},
		get y()
		{
			return this.view.position.y;
		},
		set y( e )
		{
			this.view.position.y = e;
		},
		get z()
		{
			return this.view.position.z;
		},
		set z( e )
		{
			this.view.position.z = e;
		},
		get rotationX()
		{
			return this.view.rotation.x;
		},
		set rotationX( e )
		{
			this.view.rotation.x = e;
		},
		get rotationY()
		{
			return this.view.rotation.y;
		},
		set rotationY( e )
		{
			this.view.rotation.y = e;
		},
		get rotationZ()
		{
			return this.view.rotation.z;
		},
		set rotationZ( e )
		{
			this.view.rotation.z = e;
		},
	};

	return dropSphere3d;
})();