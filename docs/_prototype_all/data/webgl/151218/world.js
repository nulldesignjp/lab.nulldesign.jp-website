/*
	TrecTrack
	ver 1.0.1
*/

var world = (function(){

	function world()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x181818, 1600, 3200 );

		this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 3200);
		this.camera.position.set( 0, 0, 1000 );

		this.focus = new THREE.Vector3(0,0,0);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( width, height  );
		this.renderer.setClearColor( 0x181818 );

		var _amb = new THREE.AmbientLight( 0x080808 );
		this.scene.add( _amb );

		var _sl = new THREE.PointLight( 0xFFFFFF,1.0, 200 )
		_sl.position.set( 40, 80, 40 );
		this.scene.add( _sl );

		var _sl02 = new THREE.PointLight( 0xFFFFFF, 0.2, 600 )
		_sl02.position.set( -40, 150, -20 );
		this.scene.add( _sl02 );
	}

	world.prototype = {
		render : function()
		{
			this.camera.lookAt( this.focus );
			this.renderer.render( this.scene, this.camera );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.renderer.setSize( width, height );
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		}
	}
	
	return world;

})();
