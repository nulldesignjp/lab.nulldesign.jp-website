/*
	world.js
	ver 1.0.3

	by nulldesign.jp
	http://nulldesign.jp/
*/

var world = (function(){

	function world( _dom )
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		var _minDistance = 0.1;
		var _maxDistance = 3200;
		var _backgroundColor = 0x000000;

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( _backgroundColor, 1600, _maxDistance );

		this.camera = new THREE.PerspectiveCamera(50, width / height, _minDistance, _maxDistance );
		this.camera.position.set( 0, 0, 100 );

		this.focus = new THREE.Vector3(0,0,0);

		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize( width, height  );
		this.renderer.setClearColor( _backgroundColor );

		this.ambient = new THREE.AmbientLight( _backgroundColor );
		this.scene.add( this.ambient );

		//	controls
		// this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
		// this.controls.autoRotate = false;
		// this.controls.autoRotateSpeed = 0.5;
		// this.controls.enableDamping = true;
		// this.controls.dampingFactor = 0.15;
		// this.controls.enableZoom = false;
		// // this.controls.minDistance = 32;
		// // this.controls.maxDistance = 96;
		// this.controls.minPolarAngle = 0; // radians
		// this.controls.maxPolarAngle = Math.PI * 0.5 - Math.PI / 18; // radians

		//	DOM
		_dom.appendChild(this.renderer.domElement);

		//	Resize
		var _t = this;
		window.onresize = function(){	_t.resize();	};

		this.render();
	}

	world.prototype = {
		render : function()
		{
			this.update();
			//this.controls.update();
			this.camera.lookAt( this.focus );
			this.renderer.render( this.scene, this.camera );
			
			var _t = this;
			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		update : function()
		{
			//	
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.renderer.setSize( width, height );
			this.camera.aspect = width / height;
			this.camera.updateProjectionMatrix();
		},
		add : function( e )
		{
			this.scene.add( e );
			return e;
		},
		reomve : function( e )
		{
			this.scene.remove( e );
			return e;
		}
	}
	
	return world;

})();
