/*
	world3d.js
	ver 1.0.1
	@ nulldesign.jp
*/

var world3d = world3d||{};
(function(){

	world3d.isSp = false;
	world3d.mouse = {x:window.innerWidth*0.5,y:window.innerHeight*0.5};;
	world3d.resolution = {x:window.innerWidth,y:window.innerHeight};

	world3d.ZERO = new THREE.Vector3(0, 0, 0);
	world3d.time = 0;

	world3d.uniforms = {
		time: { type: "f", value: 1.0 },
		resolution: { type: "v2", value: new THREE.Vector2() },
		mouse: { type: "v2", value: new THREE.Vector2() },
		//backbuffer: { type: "t", value: THREE.ImageUtils.loadTexture( "../img/UV_Grid_Sm.jpg" ) },
		//video: { type: "t", value: null }
	};
	world3d.uniforms.time.value = 0.0;
	world3d.uniforms.resolution.value.x = world3d.resolution.x;
	world3d.uniforms.resolution.value.y = world3d.resolution.y;
	world3d.uniforms.mouse.value.x = world3d.mouse.x;
	world3d.uniforms.mouse.value.y = world3d.mouse.y;

	var three = (function(){
		function three( container )
		{
			this._init( container );
		}

		three.prototype = 
		{
			_init	:	function( container )
			{
				var _width = window.innerWidth;
				var _height = window.innerHeight;

				this.fog = 0x000000;

				this.scene = new THREE.Scene();
				this.scene.fog = new THREE.Fog( this.fog, 1000, 1800 );

				this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 1800 );
				this.camera.position.set( 0, 0, 1000 );

				this.focus = new THREE.Vector3();
				this.focus.set( 0, 0, 0 );
				this.camera.lookAt( this.focus );

				this.renderer = new THREE.WebGLRenderer( { antialias: false } );
				this.renderer.setClearColor( this.scene.fog.color, 1 );
				this.renderer.setSize( _width, _height );
				this.renderer.gammaInput = true;
				this.renderer.gammaOutput = true;

				container.appendChild( this.renderer.domElement );

				this.addEvents();

				this.animate();

			},
			fog	:	function( e )
			{
				this.scene.fog.color = e;
				this.renderer.setClearColor( this.scene.fog.color, 1 );
			},
			addEvents	:	function()
			{
				var _this = this;
				window.addEventListener( 'resize', function(e){
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
					world3d.uniforms.resolution.value.x = _width;
					world3d.uniforms.resolution.value.y = _width;
				}, false );
				window.addEventListener( 'mousemove', function(e){
					world3d.mouse.x = e.pageX;
					world3d.mouse.y = e.pageY;
					world3d.uniforms.mouse.value.x = world3d.mouse.x;
					world3d.uniforms.mouse.value.y = window.innerHeight - world3d.mouse.y;
					e.preventDefault();
				}, false );
				window.addEventListener( 'touchmove', function(e){
					world3d.mouse.x = e.touches[0].pageX;
					world3d.mouse.y = e.touches[0].pageY;
					world3d.uniforms.mouse.value.x = world3d.mouse.x;
					world3d.uniforms.mouse.value.y = window.innerHeight - world3d.mouse.y;
					e.preventDefault();
				}, false );
			},
			animate	:	function()
			{
				//requestAnimationFrame( this.animate );
				//this.render();

				var _this = this;
				world3d.time += 1;
				world3d.uniforms.time.value += 1.0;
				_this.render();
				_this.engine();
				
				window.requestAnimationFrame( function(){	_this.animate();	});


			},
			render	:	function()
			{
				var _this = this;
				_this.camera.lookAt( _this.focus );
				_this.renderer.render( _this.scene, _this.camera );
			},
			engine	:	function()
			{

			},
			relayout	:	function()
			{
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
		}
		return three;
	})();
	world3d.three = three;
	
})();