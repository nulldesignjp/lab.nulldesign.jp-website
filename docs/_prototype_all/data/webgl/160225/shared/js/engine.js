/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.renderer.shadowMap.enabled = true;
		this.world.renderer.shadowMapSoft = true;

		this.world.camera.position.z = 1000;
		this.world.controls.minDistance = 100;
		this.world.controls.maxDistance = 1600;

		this.world.controls.autoRotate = false;

		var _t = this;
		var _light = new THREE.PointLight( 0xFFFFFF, 1.0, 1600 );
		_light.position.set( 0, 0, 1200 );
		this.world.add( _light );

		var _light = new THREE.DirectionalLight( 0xFFFFFF, 0.8 );
		_light.castShadow = true;
		_light.shadow.mapSize.width = 1024 * 2;
		_light.shadow.mapSize.height = 1024 * 2;
		_light.shadow.camera.near = 500;
		_light.shadow.camera.far = 4000;
		_light.shadow.camera.left = -1000;
		_light.shadow.camera.right = 1000;
		_light.shadow.camera.top = 1000;
		_light.shadow.camera.bottom = -1000;
		_light.shadow.camera.fov = 30;
		_light.position.set( - 300, - 700, 1000 );
		this.world.add( _light );

		// var spotLight = new THREE.SpotLight( 0xffffff );
		// spotLight.position.set( - 1000, - 1000, 1000 );
		// spotLight.castShadow = true;
		// spotLight.shadow.mapSize.width = 1024;
		// spotLight.shadow.mapSize.Height = 1024;
		// spotLight.shadow.camera.near = 500;
		// spotLight.shadow.camera.far = 4000;
		// spotLight.shadow.camera.fov = 50;
		// this.world.scene.add( spotLight );

		this.clock = new THREE.Clock( true );
		this.clock.start();

		this.count = 0;

		var _t = this;
		var _geometry = new THREE.PlaneGeometry(1000,1000,1,1);
		var _geometry = new THREE.BoxGeometry(1000,1000,10,1,1,1);
		var _material = new THREE.MeshPhongMaterial();
		var _material = new THREE.MeshStandardMaterial({
			metalness: 0
		});	//	metal
		this.plane= new THREE.Mesh( _geometry, _material );
		this.plane.receiveShadow = true;
		this.world.add( this.plane );

		this.boxs = [];

		for( var i = 0; i < 64; i++ )
		{
			var _geometry = new THREE.BoxGeometry(50, 50, 50, 1, 1, 1);
			var _material = new THREE.MeshPhongMaterial();
			var _material = new THREE.MeshStandardMaterial({
				metalness: 0
			});	//	metal
			this.box= new THREE.Mesh( _geometry, _material );
			this.world.add( this.box );
			this.box.castShadow = true;
			this.box.receiveShadow = true;
			this.box.position.set( Math.floor( Math.random() * 17-8 ) * 55, Math.floor( Math.random() * 17-8 ) * 55, 25 );
			this.boxs.push( this.box );

			this.box.scale.set( 0.01, 0.01, 0.01 );
			this.box.rotation.set( Math.random()*2*Math.PI-Math.PI, Math.random()*2*Math.PI-Math.PI, Math.random()*2*Math.PI-Math.PI );
			TweenMax.to( this.box.scale, 0.5, {x:1.0,y:1.0,z:1.0,delay: i * 0.1 + 1.0} );
			TweenMax.to( this.box.rotation, 0.5, {x:0.0,y:0.0,z:0.0,delay: i * 0.1 + 1.0} );
		}

		this.loop();

		//	CHECK
		console.log( 'THREE.MeshBasicMaterial', new THREE.MeshBasicMaterial() )
		console.log( 'THREE.MeshLambertMaterial', new THREE.MeshLambertMaterial() )
		console.log( 'THREE.MeshPhongMaterial', new THREE.MeshPhongMaterial() )
		console.log( 'THREE.MeshStandardMaterial', new THREE.MeshStandardMaterial() )

		var _t = this;
		// var _loader = new THREE.TextureLoader();
		// _loader.load('shared/img/concrete.jpg',function(texture){
		// 	_t.plane.material.normalMap = texture;
		// 	_t.plane.material.bumpMap = texture;
		// })

		setInterval(function(){
			_t.count ++;
			var len = _t.boxs.length;
			_t.count %= len;
			var _box = _t.boxs[ _t.count ];

			var _targetX = Math.floor( Math.random() * 17-8 ) * 55;
			var _targetY = Math.floor( Math.random() * 17-8 ) * 55;
			var _targetZ = 25;
			var _offsetZ = 100;

			var __dx = ( _targetX + _box.position.x ) * 0.5;
			var __dy = ( _targetY + _box.position.y ) * 0.5;
			var _dx = ( _targetX - _box.position.x );
			var _dy = ( _targetY - _box.position.y );
			var _d = Math.sqrt( _dx * _dx + _dy * _dy );

			TweenMax.to( _box.position, 1.0, {x:_box.position.x,y:_box.position.y,z:_box.position.z + 50,delay: 0.5, ease: Sine.easeIn} );
			TweenMax.to( _box.position, 2.0, {x:__dx,y:__dy,z:_d * 0.5 + _offsetZ,delay: 1.5, ease: Sine.easeInOut} );
			TweenMax.to( _box.position, 2.0, {x:_targetX,y:_targetY,z:_targetZ + _offsetZ,delay: 3.5, ease: Sine.easeInOut} );
			TweenMax.to( _box.position, 1.0, {x:_targetX,y:_targetY,z:_targetZ,delay: 5.5, ease: Sine.easeOut} );

			TweenMax.to( _box.rotation, 4.0, {x:Math.floor( Math.random()*8)*Math.PI * 0.5 - Math.PI*2,y:Math.floor( Math.random()*8)*Math.PI * 0.5 - Math.PI*2,z:Math.floor( Math.random()*8)*Math.PI * 0.5 - Math.PI*2,delay: 1.5,ease: Sine.easeInOut} );
			//TweenMax.to( _box.position, 0.5, {x:_box1.position.x,y:_box1.position.y,z:_box1.position.z,delay: 1.0} );

		},1000);

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );

			var _duration = this.clock.getElapsedTime();
			var len = this.boxs.length;
			for( var i = 0; i < len; i++ )
			{
				var _rad = ( i + _duration * 4 ) / len * Math.PI * 2;
				//	this.boxs[i].position.z = Math.sin( _rad ) * 50;
			}

			//	console.log( this.clock.getDelta() )
			//	console.log( this.clock.oldTime, this.clock.startTime, this.clock.startTime - this.clock.oldTime );

		}
	}

	return Practice;
})();



var _pr = new Practice();

