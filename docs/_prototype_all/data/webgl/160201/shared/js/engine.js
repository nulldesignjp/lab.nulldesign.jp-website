/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	prop
		this.world;
		this.position;
		this.speed;
		this.direction;
		this.tDirection;
		this.noise;
		this.field;
		this.scale;
		this.scales;
		this.heightScale;

		this.init();
		this.createField();
		this.loop();

		//	resize
		var _t = this;
		window.onresize = function(){
			_t.world.resize();
		};

		var _posX = window.innerWidth * 0.5;
		$( window ).on( 'mousemove', function(e){
			var _mouseX = e.originalEvent.pageX;
			var _value = _mouseX / ( window.innerWidth * 0.5 ) * Math.PI;
			_t.tDirection = _value;
			_posX = _mouseX;
		})
	}

	Practice.prototype = 
	{
		init : function()
		{
			//	three.js
			this.world = new world();
			this.world.camera.position.set( 0, 250, 500 );

			//	sun
			this.sun = new THREE.PointLight( 0xFFFFFF, 1.0, 900 );
			this.sun.position.set( 0, 600, 0 )
			this.world.scene.add( this.sun );

			//	DOM setting
			document.getElementById('webglView').appendChild(this.world.renderer.domElement);

			this.position = {x:0,y:0,z:0};
			this.speed = 0.02;
			this.direction = 0;
			this.tDirection = 0;
			this.noise = new SimplexNoise();
			this.scale = 3.0;
			this.scales = [
				{	key: 0.0001,	value: 0.5 },
				{	key: 0.0005,	value: 1.0 },
				{	key: 0.001,	value: 0.05 },
				{	key: 0.01,	value: 0.01 },
			];
			this.heightScale = 80;
		},
		createField : function()
		{

			var _geometry = new THREE.DelaunayGeometry(600,600,100);
			var _material = new THREE.MeshPhongMaterial({
				//wireframe: true,
				//shading: THREE.SmoothShading,
				shading: THREE.FlatShading,
				metal:true,
				specular: 0xFFFCCC,
				shininess: 10 + Math.random() * 10,
				side: THREE.DoubleSide
			});
			this.field = new THREE.Mesh( _geometry, _material );
			this.world.scene.add( this.field );

			this.field.rotation.y = Math.PI * 0.5;
		},
		loop : function()
		{
			var _t = this;

			function toScreenPosition(obj, camera)
			{
				var vector = new THREE.Vector3();

				var widthHalf = 0.5*_t.world.renderer.context.canvas.width;
				var heightHalf = 0.5*_t.world.renderer.context.canvas.height;

				obj.updateMatrixWorld();
				vector.setFromMatrixPosition(obj.matrixWorld);
				vector.project(camera);

				vector.x = ( vector.x * widthHalf ) + widthHalf;
				vector.y = - ( vector.y * heightHalf ) + heightHalf;

				return { 
				    x: vector.x,
				    y: vector.y
				};
			};

			var len = this.field.geometry.vertices.length;
			var _sin = Math.sin( this.direction );
			var _cos = Math.cos( this.direction );
			for( var i = 0; i < len; i++ )
			{

				var len2 = this.scales.length;
				var _value = 0;
				var _x
				for( var j = 0; j < len2; j++ )
				{

					var _x = this.field.geometry.vertices[i].x * this.scales[j].key * this.scale;
					var _z = this.field.geometry.vertices[i].z * this.scales[j].key * this.scale;
					var __x = _cos * _x - _sin * _z;
					var __y = _sin * _x + _cos * _z;

					__x += this.position.x;
					__y += this.position.y;

					_value += this.noise.noise( __x, __y ) * this.scales[j].value;
				}

				this.field.geometry.vertices[i].y = _value * this.heightScale;
			}

			this.position.x += _cos * this.speed;
			this.position.y += _sin * this.speed;

			this.field.geometry.verticesNeedUpdate = true;
			this.field.geometry.normalsNeedUpdate = true;
			this.field.geometry.computeFaceNormals();
			this.field.geometry.computeVertexNormals();

			this.direction += ( this.tDirection - this.direction ) * 0.02;

			this.world.render();
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

