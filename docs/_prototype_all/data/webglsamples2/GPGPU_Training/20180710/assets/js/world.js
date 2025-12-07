/*
	world.js
	auth: nulldesign.jp
	url: http://nulldesign.jp/
*/

var world = (function(){

	var _backgroundColor	=	0xFFFFFF;
	var _ambientLight		=	0x454545;
	var _directionalLight	=	0xFFFFFF;
	var _pastTime = 0;

	function world( e )
	{
		this.scene;
		this.camera;
		this.focus;
		this.renderer;
		this.ambient;
		this.directional;
		this.controls;

		this.init( e );

		var _t = this;
		window.onresize = function(){
			_t.resize();
		};

		_pastTime = new Date().getTime() * 0.001;

		this.render();
	}

	world.prototype = {
		init : function( e )
		{

			var width  = window.innerWidth;
			var height = window.innerHeight;
			this.scene = new THREE.Scene();
			this.scene.background = new THREE.Color( _backgroundColor );
			this.scene.fog = new THREE.Fog( _backgroundColor, 800, 1000 );

			this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000 );
			//this.camera = new THREE.OrthographicCamera( - width * 0.5, width * 0.5, height * 0.5, - height * 0.5, 1, 1000 );
			this.camera.position.set( 0, 0, 500 );
			this.focus = new THREE.Vector3(0,0,0);

			this.renderer = new THREE.WebGLRenderer({ antialias: true });
			this.renderer.setPixelRatio( window.devicePixelRatio );
			this.renderer.setSize( width, height  );
			this.renderer.setClearColor( _backgroundColor );

			document.getElementById( e ).appendChild(this.renderer.domElement);

			this.ambient = new THREE.AmbientLight( _ambientLight );
			this.scene.add( this.ambient );

			this.directional = new THREE.DirectionalLight( _directionalLight, 1.0);
			this.directional.position.set( 45, 35, 105 ).normalize().addScalar( 800 );

			this.scene.add( this.directional );

		},
		render : function()
		{
			var _t = this;
			_t.camera.lookAt( _t.focus );

			//	update duration
			var _currentTime = new Date().getTime() * 0.001;
			var _delta = _currentTime - _pastTime;
			_pastTime = _currentTime;

			_t.renderer.render( _t.scene, _t.camera );
			window.requestAnimationFrame( function(){	_t.render();	} );
		},
		resize : function()
		{
			var width  = window.innerWidth;
			var height = window.innerHeight;

			this.renderer.setSize( width, height );
			if( this.camera.aspect )
			{
				this.camera.aspect = width / height;
			} else {
				this.camera.left = - width * 0.5;
				this.camera.right = width * 0.5;
				this.camera.bottom = - height * 0.5;
				this.camera.top = height * 0.5;
			}
			this.camera.updateProjectionMatrix();

			//	update view
			this.camera.lookAt( this.focus );
			this.renderer.render( this.scene, this.camera );
		},
		getWorldToScreen2D : function( _mesh )
		{
			var vector = new THREE.Vector3();
			var widthHalf = 0.5 * this.renderer.context.canvas.width;
			var heightHalf = 0.5 * this.renderer.context.canvas.height;
			_mesh.updateMatrixWorld();
			vector.setFromMatrixPosition(_mesh.matrixWorld);
			vector.project(this.camera);
			vector.x = ( vector.x * widthHalf ) + widthHalf;
			vector.y = - ( vector.y * heightHalf ) + heightHalf;
			//	前後判定
			var _dir0 = new THREE.Vector3().subVectors( this.focus, this.camera.position );
			var _dir1 = new THREE.Vector3().subVectors( _mesh.position, this.camera.position );
			var _d = _dir0.dot( _dir1 );
			if( _d <= 0 ){
				vector.x = -9999;
				vector.y = -9999;
			}

			return { 
			    x: vector.x,
			    y: vector.y
			};
		},
		add : function( e )
		{
			this.scene.add( e );
		},
		remove : function( e )
		{
			this.scene.remove( e );
		}
	}
	return world;
})();