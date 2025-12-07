/*
	engine.js
	created by nulldesign.jp
*/

var planet = (function(){

	function PLANet()
	{
		this.world;
		this.sl;
		this.plate;
		this.noise;
		this.direction;
		this.tDirection;
		this.speed;
		this.position;
		this.scale;
		this.heightScale;

		this.schduleWrapper;

		this.init();
		this.loop();
	}

	PLANet.prototype = 
	{
		init : function()
		{
			//	props
			this.noise = new SimplexNoise();
			this.direction = 0;
			this.tDirection = 0;
			this.speed = 0.0125;
			this.position = {x:0,y:0,z:0};
			this.scale = 0.0075;
			this.heightScale = 20.0;

			//	three.js
			var _dom = document.getElementById('webglView');
			this.world = new world( _dom );

			//	camera
			this.world.camera.position.set( 0, 500, 100 );
			this.world.focus.set( 0, 525, 0 );

			//	lighting
			this.sl = new THREE.SpotLight( 0xFFFFFF, 1.0 );
			this.sl.position.set( 1000, 1000, 1000 );
			this.world.add( this.sl );

			//	obj

			//	ground
			var _geometry = new THREE.DelaunayGeometry(500,500,2000,[]);
			var _material = new THREE.MeshPhongMaterial({
				color: 0xFFFFFF,
				specular: 0x999999,
				metal: true,
				shininess: 0,
				//wireframe: true,
				shading: THREE.FlatShading
			});
			this.plate = new THREE.Mesh( _geometry, _material );
			this.world.scene.add( this.plate );

			this.plate.rotation.y = + Math.PI * 0.5;
			this.plate.position.set( 0, 496, 0 );
			this.plate.geometry.verticesNeedUpdate = true;


			//	background star
			var _geometry = new THREE.Geometry();
			for( var i = 0; i < 3000; i++ )
			{
				_geometry.vertices[i] = new THREE.Vector3();
				var _rad0 = Math.random() * Math.PI * 2.0;
				var _dist = 1000;
				_geometry.vertices[i].x  = Math.cos( _rad0 ) * _dist;
				_geometry.vertices[i].y  = Math.random() * _dist * 1.6 + 500;
				_geometry.vertices[i].z  = Math.sin( _rad0 ) * _dist;
			}
			var _material = new THREE.PointsMaterial({
				transparent: true,
				opacity: 0.25,
				size: 5.0
			});
			this.stars = new THREE.Points( _geometry, _material );
			this.world.scene.add( this.stars );



			//	schdule
			this.schduleWrapper = new THREE.Object3D();
			this.world.scene.add( this.schduleWrapper );
			for( var i = 0; i < 7; i++ )
			{
				var _geometry = new THREE.IcosahedronGeometry( 50 + Math.random() * 70, 4 );
				var _material = new THREE.MeshPhongMaterial({
					color: new THREE.Color( Math.random(), Math.random(), Math.random() ),
					specular: 0x6699CC,
					metal: true,
					shininess: Math.floor( Math.random()*10) + 2
				});
				var _plan = new THREE.Mesh( _geometry, _material );
				this.schduleWrapper.add( _plan );

				_plan.position.set( rnd()*100, 550 + rnd()*100 + i * 150, - i * 400 - 300 );
				function rnd()
				{
					return Math.random()-.5;
				}
			}

			var _t = this;
			setInterval(function(){
				_t.tDirection += ( Math.random()-.5 ) * Math.PI * 0.5;
			},5000);

			var _pastX = 0;
			$( window ).on('mousemove',function(e){
				var _sabun = _pastX - e.originalEvent.pageX;
				_t.tDirection += - _sabun / ( window.innerWidth * 0.5 );
				_pastX = e.originalEvent.pageX;
			})
		},
		loop : function()
		{
			var _t = this;
			var _time = Date.now() * 0.001;

			_t.world.camera.position.x = Math.cos( _time ) * 2;
			_t.world.camera.position.y = 500 + Math.sin( _time ) * 2;
			_t.world.focus.x = Math.cos( _time * 0.6 ) * 6;
			_t.world.focus.y = 525 + Math.sin( _time * 0.77 ) * 2;

			//
			this.direction += ( this.tDirection - this.direction ) * 0.02;
			this.tDirection += ( 0 - this.tDirection ) * 0.0125;

			this.position.x += Math.cos( this.direction ) * this.speed;
			this.position.y += Math.sin( this.direction ) * this.speed;


			var _list = this.plate.geometry.vertices;
			var len = _list.length;
			var _cos = Math.cos( this.direction );
			var _sin = Math.sin( this.direction );
			for( var i = 0; i < len; i++ )
			{

				var _x = _list[i].x * this.scale;
				var _y = _list[i].z * this.scale;
				var __x = _x * _cos - _y * _sin;
				var __y = _x * _sin + _y * _cos;

				__x += this.position.x;
				__y += this.position.y

				var _value = this.noise.noise( __x, __y );
				var _z = ( Math.sin( _value * Math.PI - Math.PI * 0.5 ) + 1.0 ) * 0.5 * this.heightScale;
				var _z = _value * _value * _value * this.heightScale;

				_list[i].y = _z;
			}

			var _geometry = this.plate.geometry;
			_geometry.verticesNeedUpdate = true;
			_geometry.normalsNeedUpdate = true;
			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();

			//	camera
			this.position.z = this.noise.noise( this.position.x, this.position.y - 100*this.scale ) * this.heightScale;
			this.world.camera.position.y = this.plate.position.y + this.position.z + this.heightScale * 1.0;

			this.stars.rotation.y = this.direction;
			this.schduleWrapper.rotation.y = this.direction;

			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}
	return PLANet;
})();

//	execute....
var _powerharassment = new planet();
