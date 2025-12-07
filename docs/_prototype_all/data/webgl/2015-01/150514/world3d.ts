/// <reference path="./DefinitelyTyped-master/jquery/jquery.d.ts" />
/// <reference path="./DefinitelyTyped-master/threejs/three.d.ts" />

module world3d{

	export class main{

		public static isSP:boolean = false;
		public static mouse:Object = {x:window.innerWidth/2,y:window.innerHeight/2};
		public static resolution:Object = {x:window.innerWidth,y:window.innerHeight};

		public camera	:	THREE.PerspectiveCamera;
		//public camera	:	THREE.OrthographicCamera;
		public scene	:	THREE.Scene;
		public focus	:	THREE.Vector3;
		public renderer	:	THREE.WebGLRenderer;

		constructor( _dom )
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;

			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0, 1500, 2000 );

			this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 2000 );
			//this.camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1000 );
			this.camera.position.set( 0, 1000, 0 );

			this.focus = new THREE.Vector3();
			this.focus.set( 0, 0, 0 );
			this.camera.lookAt( this.focus );

			this.renderer = new THREE.WebGLRenderer( { antialias: false } );
			this.renderer.setClearColor( this.scene.fog.color, 1 );
			this.renderer.setSize( _width, _height );
			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;

			_dom.appendChild( this.renderer.domElement );

			this.animate();


			var _this = this;
			window.addEventListener( 'resize', function(e:any){
				var _width = window.innerWidth;
				var _height = window.innerHeight;
				if( world3d.isSP )
				{
					_width *= 2;
					_height *= 2;
				}
				_this.camera.aspect = _width / _height;
				_this.camera.updateProjectionMatrix();
				_this.renderer.setSize( _width, _height );

				world3d.resolution = {x:_width,y:_height};
			}, false );
			window.addEventListener( 'mousemove', function(e:any){
				world3d.mouse.x = e.pageX;
				world3d.mouse.y = e.pageY;
				e.preventDefault();
			}, false );
			window.addEventListener( 'touchmove', function(e:any){
				world3d.mouse.x = e.touches[0].pageX;
				world3d.mouse.y = e.touches[0].pageY;
				e.preventDefault();
			}, false );
		}

		public animate()
		{
			//requestAnimationFrame( this.animate );
			//this.render();

			var _this = this;
			setInterval(function(){
				_this.render();
				_this.engine();
			},1000/60);
		}
		public render()
		{
			var _this = this;
			_this.camera.lookAt( _this.focus );
			_this.renderer.render( _this.scene, _this.camera );
		}
		public engine(){}
	}
}