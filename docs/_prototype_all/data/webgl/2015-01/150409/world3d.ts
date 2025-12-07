/*
	world3d.ts
	@ nulldesign.jp
	ver	1.0.2
*/
var THREE:any = THREE||{}

module world3d
{
	export var mouse:any = {x:window.innerWidth*0.5,y:window.innerHeight*0.5};
	export var resolution:any = {x:window.innerWidth,y:window.innerHeight};
	export var time:number = 0;
	export var ZERO = new THREE.Vector3(0, 0, 0);

	export var uniforms:any = {
		time: { 'type': 'f', 'value': 1.0 },
		resolution: { 'type': 'v2', 'value': new THREE.Vector2() },
		mouse: { 'type': 'v2', 'value': new THREE.Vector2() },
		//backbuffer: { type: "t", value: THREE.ImageUtils.loadTexture( "../img/UV_Grid_Sm.jpg" ) },
		//video: { type: "t", value: null }
	};

	uniforms.time.value = 0.0;
	uniforms.resolution.value.x = resolution.x;
	uniforms.resolution.value.y = resolution.y;
	uniforms.mouse.value.x = mouse.x;
	uniforms.mouse.value.y = mouse.y;

	export class three
	{
		public scene:THREE.Scene;
		public camera:THREE.PerspectiveCamera;
		//	public camera:THREE.OrthographicCamera;
		public focus:THREE.Vector3;
		public renderer:THREE.WebGLRenderer;

		constructor( container )
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;

			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0x181818, 1000, 1600 );

			this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 2000 );
			//this.camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
			this.camera.position.set( 0, 0, 1000 );

			this.focus = new THREE.Vector3();
			this.focus.set( 0, 0, 0 );
			this.camera.lookAt( this.focus );

			this.renderer = new THREE.WebGLRenderer( { antialias: false } );
			this.renderer.setClearColor( this.scene.fog.color, 1 );
			this.renderer.setSize( _width, _height );
			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;
			this.renderer.autoClear = false;

			container.appendChild( this.renderer.domElement );

			new basicEvents( this.camera, this.renderer );
			this.animate();
		}

		animate()
		{
			var _this = this;
			setInterval(function(){
				_this.render();
				_this.engine();
			},1000/60);
		}

		render()
		{
			var _this = this;
			_this.camera.lookAt( _this.focus );
			_this.renderer.render( _this.scene, _this.camera );
		}

		engine(){}
	}

	export class shader
	{
		scene:THREE.Scene;
		//camera:THREE.PerspectiveCamera;
		camera:THREE.OrthographicCamera;
		focus:THREE.Vector3;
		renderer:THREE.WebGLRenderer;
		vid:any;
		fid:any;

		constructor( _dom, _vid, _fid, _uniforms  )
		{
			_uniforms = _uniforms||uniforms
			uniforms = _uniforms;

			this.vid = _vid;
			this.fid = _fid;

			if( !uniforms.time )
			{
				uniforms.time = { 'type': 'f', 'value': 1.0 }
			}

			var _width = window.innerWidth;
			var _height = window.innerHeight;

			//	カメラ
			//this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 2000 );
			this.camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
			this.camera.position.z = 1000;

			//	カメラフォーカス	
			this.focus = new THREE.Vector3();
			this.focus.set( 0, 0, 0 );
			this.camera.lookAt( focus );

			//	SCENE
			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0x181818, 1000, 1500 );

			//	renderer
			this.renderer = new THREE.WebGLRenderer( { antialias: false } );
			this.renderer.setClearColor( this.scene.fog.color, 1 );
			this.renderer.setSize( window.innerWidth, window.innerHeight );
			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;
			this.renderer.autoClear = false;

			_dom.appendChild( this.renderer.domElement );

			this.createScreen();
			new basicEvents( this.camera, this.renderer );
			this.animate();
		}

		createScreen()
		{
			var _width = screen.width;
			var _height = screen.height;
			var geometry = new THREE.PlaneBufferGeometry( _width, _height );
			var material = new THREE.ShaderMaterial({
				uniforms: uniforms,
				vertexShader: this.vid,
				fragmentShader: this.fid
				//vertexShader: document.getElementById( this.vid ).textContent,
				//fragmentShader: document.getElementById( this.fid ).textContent
			} );

			var mesh = new THREE.Mesh( geometry, material );
			this.scene.add( mesh );
		}

		animate()
		{
			//requestAnimationFrame( this.animate );
			//this.render();
			var _this = this;
			setInterval(function(){
				_this.render();
				_this.engine();
				uniforms.time.value += 0.05;
			},1000/60);
		}

		render()
		{
			var _this = this;
			_this.camera.lookAt( _this.focus );
			_this.renderer.render( _this.scene, _this.camera );
		}

		engine(){}
	}

	class basicEvents
	{
		constructor( _camera, _renderer )
		{
			var _this = this;
			window.addEventListener( 'resize', function(e:any){
				var _width = window.innerWidth;
				var _height = window.innerHeight;

				if( _camera.aspect )
				{
					_camera.aspect = _width / _height;
				} else {
					_camera.left = - _width * 0.5;
					_camera.right = _width * 0.5;
					_camera.top = _height * 0.5;
					_camera.bottom = - _height * 0.5;
				}
				_camera.updateProjectionMatrix();
				_renderer.setSize( _width, _height );

				resolution = {x:_width,y:_height};
				uniforms.resolution.value.x = _width;
				uniforms.resolution.value.y = _width;
			}, false );
			window.addEventListener( 'mousemove', function(e:any){
				mouse.x = e.pageX;
				mouse.y = e.pageY;
				uniforms.mouse.value.x = mouse.x;
				uniforms.mouse.value.y = window.innerHeight - mouse.y;
				e.preventDefault();
			}, false );
			window.addEventListener( 'touchmove', function(e:any){
				mouse.x = e.touches[0].pageX;
				mouse.y = e.touches[0].pageY;
				uniforms.mouse.value.x = mouse.x;
				uniforms.mouse.value.y = window.innerHeight - mouse.y;
				e.preventDefault();
			}, false );
		}
	}
}