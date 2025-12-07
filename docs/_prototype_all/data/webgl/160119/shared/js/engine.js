/*
	engine.js
*/

//	http://stackoverflow.com/questions/27409074/three-js-converting-3d-position-to-2d-screen-position-r69
//	http://www.ambracode.com/index/show/364253

var trektrack = (function(){

	function TrekTrack()
	{
		//	prop
		this.world;
		this.sun;
		this.moon;
		this.list = [];


		//	three.js
		this.world = new world();
		this.world.camera.position.set( 0, 100, 600)

		//	sun
		this.sun = new THREE.DirectionalLight( 0xFFFFFF, 0.4 );
		this.sun.position.set( 100, 100, 100 )
		this.world.scene.add( this.sun );

		//	moon
		this.moon = new THREE.DirectionalLight( 0x9999CC, 0.1 );
		this.moon.position.set( - 100, - 100, 100 )
		this.world.scene.add( this.moon );

		//	DOM setting
		document.getElementById('webglView').appendChild(this.world.renderer.domElement);

		this.loop();

		// var _geometry = new THREE.PlaneGeometry(1638,819,1,1);
		// var _material = new THREE.MeshBasicMaterial({
		// 	transparent: true,
		// 	opacity: 0.0
		// });
		// this.bg = new THREE.Mesh( _geometry, _material );
		// this.world.scene.add( this.bg );
		// this.world.camera.position.z;

		var _geo = new THREE.IcosahedronGeometry(20,3);
		var _mat = new THREE.MeshLambertMaterial({});
		var _mat = new THREE.MeshPhongMaterial({
			shineness: 400
		});
		var _mat = new THREE.MeshPhongMaterial({
			color: 0xFFFFFF,
			shading: THREE.SmoothShading,
			metal:true,
			specular: 0x6699CC,
			shininess: 10
		});
		var _mesh = new THREE.Mesh( _geo, _mat );
		this.world.scene.add( _mesh );

		var _dist = 100;
		for( var i = 0; i < 16; i++ )
		{
			var _size = Math.random() * 10 + 2;
			var _geo = new THREE.IcosahedronGeometry( _size ,3);
			var _mat = new THREE.MeshPhongMaterial({
				color: 0xFFFFFF * Math.random(),
				shading: THREE.SmoothShading,
				//metal:true,
				specular: 0xFFFFFF * Math.random(),
				shininess: 10
			});
			var _mesh = new THREE.Mesh( _geo, _mat );
			this.world.scene.add( _mesh );

			var _obj = {};
			_obj.mesh = _mesh;
			_obj.offset = Math.random() * Math.PI * 2;
			_obj.speed = Math.random() * 0.005 + 0.001;
			_obj.dist = _dist;
			this.list.push( _obj );

			var _geometry = new THREE.Geometry();
			for( var j = 0; j <= 72; j++ )
			{
				var _deg = j * 5;
				var _rad = _deg / 360 * Math.PI * 2.0;
				var _x = Math.cos( _rad ) * _dist;
				var _z = Math.sin( _rad ) * _dist;
				_geometry.vertices.push( new THREE.Vector3( _x, 0, _z ) )
			}
			var _material = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 0.1
			});
			var _line = new THREE.Line( _geometry, _material );
			this.world.scene.add( _line );

			_dist += Math.random() * 20 + 20;
		}


		function rnd()
		{
			return Math.random() *2 - 1;
		}


		//	resize
		var _t = this;
		window.onresize = function(){	_t.world.resize();	};
	}

	TrekTrack.prototype = 
	{
		loop : function()
		{
			var _t = this;

			var time = Math.floor( Date.now() / 1000 );

			time = Date.now() / 1000;
			time %= 86400;
			time *= 3600;

			var len = this.list.length;
			for( var i = 0; i < len; i++ )
			{
				var _obj = this.list[i];

				_obj.offset += _obj.speed;

				var _x = Math.cos( _obj.offset ) * _obj.dist;
				var _z = Math.sin( _obj.offset ) * _obj.dist;
				_obj.mesh.position.set( _x, 0, _z );

			}

			if( _t.list.length )
			{
				_t.list[3].mesh.updateMatrixWorld();
				var _obj = toScreenPosition( _t.list[3].mesh, _t.world.camera );
				console.log( _obj );

				$('#hoge').css({
					left: _obj.x + 5 + 'px',
					top: _obj.y + 5 + 'px'
				}).text( Math.floor( _obj.x ) + ', ' + Math.floor( _obj.y ) );
			}


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
			

			this.world.render();
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return TrekTrack;
})();


//	Execute....
var _tt = new trektrack();

