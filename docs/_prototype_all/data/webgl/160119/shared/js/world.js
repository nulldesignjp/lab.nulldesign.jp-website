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
		this.scene.fog = new THREE.Fog( 0x080808, 1600, 3200 );

		this.sky = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 3200);
		this.camera.position.set( 0, 0, 100 );

		this.focus = new THREE.Vector3(0,0,0);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( width, height  );
		this.renderer.setClearColor( 0x080808 );

		this.ambient = new THREE.AmbientLight( 0x080808 );
		this.scene.add( this.ambient );

		// // var _sl = new THREE.PointLight( 0xFFFFFF,0.1, 200 )
		// // _sl.position.set( 40, 80, 40 );
		// // this.scene.add( _sl );

		world.renderer = this.renderer;

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
