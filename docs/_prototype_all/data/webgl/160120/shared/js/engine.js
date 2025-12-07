/*
	engine.js
*/

var trektrack = (function(){

	function TrekTrack()
	{
		//	prop
		this.world;
		this.sun;
		this.list = [];

		//	three.js
		this.world = new world();
		this.world.camera.position.set( 0, 1600, 3200);

		//	sun
		this.sun = new THREE.PointLight( 0xFFFFFF, 1.0, 1000000000 );
		this.sun.position.set( 0, 0, 0 )
		this.world.scene.add( this.sun );

		//	DOM setting
		document.getElementById('webglView').appendChild(this.world.renderer.domElement);

		//	data
		//	https://ja.wikipedia.org/wiki/太陽系
		this.starScale = 0.0002;
		this.distanceScale = 0.00000001;
		this.timeScale = 0.00001;
		this.au = 149597870700;//	 メートル;
		this.data = [
			{	name: '太陽',	english: 'Sun',	radius: 1392038,	weight: 0,	deg0: 0.0,	radius2: 0.0 * this.au,	kouten: 1.0,	jiten: 27.275,	mesh:null,	dom: null,	value:null	},
			{	name: '水星',	english: 'Mercury',	radius: 4879.4,	weight: 0,	deg0: 7.004,	radius2: 0.38709927 * this.au,	kouten: 0.241,	jiten: 58.65,	mesh:null,	dom: null,	value:null	},
			{	name: '金星',	english: 'Venus',	radius: 12103.6,	weight: 0,	deg0: 3.39471,	radius2: 0.72333566 * this.au,	kouten: 0.615,	jiten: 243.0187,	mesh:null,	dom: null,	value:null	},
			{	name: '地球',	english: 'Earth',	radius: 12756.3,	weight: 0,	deg0: 0.00005,	radius2: 1.00000261 * this.au,	kouten: 1.0,	jiten: 0.997271,	mesh:null,	dom: null,	value:null	},
			{	name: '火星',	english: 'Mars',	radius: 6794.4,	weight: 0,	deg0: 1.85061,	radius2: 1.52371034 * this.au,	kouten: 1.881,	jiten: 1.02595,	mesh:null,	dom: null,	value:null	},
			{	name: '木星',	english: 'Jupiter',	radius: 142984,	weight: 0,	deg0: 1.30530,	radius2: 5.20288700 * this.au,	kouten: 11.86,	jiten: 0.4135,	mesh:null,	dom: null,	value:null	},
			{	name: '土星',	english: 'Saturnus',	radius: 120536,	weight: 0,	deg0: 2.48446,	radius2: 9.53667594 * this.au,	kouten: 29.46,	jiten: 0.4264,	mesh:null,	dom: null,	value:null	},
			{	name: '天王星',	english: 'Uranus',	radius: 51118,	weight: 0,	deg0: 0.774,	radius2: 19.18916464 * this.au,	kouten: 84.01,	jiten: 0.7181,	mesh:null,	dom: null,	value:null	},
			{	name: '海王星',	english: 'Neptunus',	radius: 49572,	weight: 0,	deg0: 1.76917,	radius2: 30.06992276 * this.au,	kouten: 164.79,	jiten: 0.6712,	mesh:null,	dom: null,	value:null	}
		];

		this.loop();

		var len = this.data.length;
		for( var i = 0; i < len; i++ )
		{
			var _data = this.data[i];
			var _rad1 = _data.radius * this.starScale * 0.5;
			var _rad2 = _data.radius2 * this.distanceScale;

			if( i != 0 )
			{
				_rad1 *= 100;
			}
			

			var _geo = new THREE.IcosahedronGeometry( _rad1 ,3);
			var _mat = new THREE.MeshPhongMaterial({
				color: 0xFFFFFF * Math.random(),
				shading: THREE.SmoothShading,
				metal:true,
				specular: 0xFFFFFF * Math.random(),
				shininess: 10
			});
			var _mesh = new THREE.Mesh( _geo, _mat );
			this.world.scene.add( _mesh );

			_data.mesh = _mesh;
			_data.value = Math.random() * Math.PI * 2.0;;

			var _x = Math.cos( _data.value ) * _rad2;
			var _y = 0;
			var _z = Math.sin( _data.value ) * _rad2;
			_mesh.position.set( _x, _y, _z );

			var _dom = $('<div>').addClass('namePlate');
			$('body').append( _dom );
			_dom.text( _data.name);
			_data.dom = _dom;

			var _geometry = new THREE.Geometry();
			for( var j = 0; j <= 72; j++ )
			{
				var _deg = j * 5;
				var _rad = _deg / 360 * Math.PI * 2.0;
				var _x = Math.cos( _rad ) * _rad2;
				var _z = Math.sin( _rad ) * _rad2;
				_geometry.vertices.push( new THREE.Vector3( _x, 0, _z ) )
			}
			var _material = new THREE.LineBasicMaterial({
				transparent: true,
				opacity: 0.1
			});
			var _line = new THREE.Line( _geometry, _material );
			this.world.scene.add( _line );
		}

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 30000; i++ )
		{
			//	(0 - 35)
			var _d = Math.random() * ( 4.2 - 1.8 ) + 1.8;
			_d *= this.au * this.distanceScale;
			var _rad = Math.random() * Math.PI * 2.0;
			var _x = Math.cos( _rad ) * _d;
			var _y = ( Math.random() - 0.5 ) * 100;
			var _z = Math.sin( _rad ) * _d;
			var _v3 = new THREE.Vector3( _x, _y, _z );
			_geometry.vertices.push( _v3 );
		}
		var _material = new THREE.PointCloudMaterial({
			size: 10,
			color: 0xFFFFFF,
			transparent: true,
			opacity: 0.2
		});
		var _mainBelt = new THREE.PointCloud( _geometry, _material );
		this.world.scene.add( _mainBelt );


		var _gh = new THREE.GridHelper( 100000, 1000 );
		_gh.material.transparent = true;
		_gh.material.opacity = 0.05;
		this.world.scene.add( _gh );

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


			var len = this.data.length;
			for( var i = 0; i < len; i++ )
			{
				var _data = this.data[i];
				if( _data.mesh != null )
				{
					var _rad2 = _data.radius2 * this.distanceScale;
					_data.value += Math.PI * 2.0 * this.timeScale / _data.kouten;
					var _x = Math.cos( _data.value ) * _rad2;
					var _y = 0;
					var _z = Math.sin( _data.value ) * _rad2;
					_data.mesh.position.set( _x, _y, _z );

					//
					_data.mesh.updateMatrixWorld();
					var _obj = toScreenPosition( _data.mesh, _t.world.camera );

					_data.dom.css({
						left: _obj.x + 5 + 'px',
						top: _obj.y + 5 + 'px'
					});

				}
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

