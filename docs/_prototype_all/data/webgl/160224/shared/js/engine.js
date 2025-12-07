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
		_light.position.set( - 500, - 500, 1000 );
		this.world.add( _light );

		console.log( _light );

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

		for( var i = 0; i < 16; i++ )
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
		/*
	concrete.jpg
IMG_5170.jpg
		*/
		var _loader = new THREE.TextureLoader();
		_loader.load('shared/img/concrete.jpg',function(texture){
			_t.plane.material.normalMap = texture;
			_t.plane.material.bumpMap = texture;
		})

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

