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
		//this.scene.fog = new THREE.Fog( 0x080808, 1600, 3200 );

		this.camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 1000000000 );
		this.camera.position.set( 0, 0, 100 );

		this.focus = new THREE.Vector3(0,0,0);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( width, height  );
		this.renderer.setClearColor( 0x000000 );

		this.ambient = new THREE.AmbientLight( 0x080808 );
		this.scene.add( this.ambient );

		// // var _sl = new THREE.PointLight( 0xFFFFFF,0.1, 200 )
		// // _sl.position.set( 40, 80, 40 );
		// // this.scene.add( _sl );

		//	controls
		// this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		// //this.controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
		// this.controls.autoRotate = true;
		// this.controls.autoRotateSpeed = 0.1;
		
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.15;
		// this.controls.enableZoom = false;

		// this.controls.minDistance = 480;
		//this.controls.maxDistance = 960;

		// this.controls.minPolarAngle = 0; // radians
		// this.controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians


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
