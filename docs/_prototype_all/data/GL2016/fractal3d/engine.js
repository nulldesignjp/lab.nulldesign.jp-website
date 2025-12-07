/*
	engine.js
*/

window.onload = function(){
	

	var width = window.innerWidth;
	var height = window.innerHeight;

	var scene, camera, focus, renderer, controls;
	var _drawList = [];
	var _meshList = [];
	var _bodylist = [];
	var _isClick = false;

	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xCCCCCC, 3200, 12800 );
	focus = new THREE.Vector3();

	camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 12800 );
	camera.position.set( 0, 0, 1000 );
	camera.lookAt( focus );
	scene.add( camera );

	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x000000 );
	renderer.setSize( width, height );
	document.getElementById( 'container' ).appendChild(renderer.domElement);

	var light0 = new THREE.AmbientLight( 0xCCCCCC );
	scene.add( light0 );

	var light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.2 );
	scene.add( light1 );
	light1.position.set( 1000, 1000, 1000 );

	var light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 1800 );
	scene.add( light2 );
	light2.position.set( 600, 300, 600 );

	controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.autoRotate = true;
	controls.autoRotateSpeed = 0.5;

	//	ADD

	var cubeCamera = new THREE.CubeCamera( 1, 10000, 128 );
	scene.background = new THREE.CubeTextureLoader()
		.setPath( './img/' )
		.load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );

	var world = new CANNON.World();
	world.quatNormalizeSkip = 0;
	world.quatNormalizeFast = false;

	world.gravity.set(0,0,0);
	world.broadphase = new CANNON.NaiveBroadphase();


		var path = "./img/";
		var format = '.jpg';
		var urls = [
				path + 'px' + format, path + 'nx' + format,
				path + 'py' + format, path + 'ny' + format,
				path + 'pz' + format, path + 'nz' + format
			];

		var reflectionCube = new THREE.CubeTextureLoader().load( urls );
		//var materialPhongCube = new THREE.MeshPhongMaterial( { shininess: 20, color: 0xffffff, specular: 0xCCCCCC, envMap: cubeCamera.renderTarget } );
		var _material = new THREE.MeshPhongMaterial( { shininess: 0, color: 0xFFFFFF, specular: 0xFFFFFF, envMap: reflectionCube } );


	//	セルサイズ
	var _gridSize = 2;
	var _gridJs = 4;

	//	フィールドの大きさ
	var _grid = 32;
	//	スケール
	var _scale = 12;
	//	Box余白
	var _margin = 1;

	//	フィールドの生成
	_drawFractals( - _grid * 0.5, - _grid * 0.5, - _grid * 0.5, _grid, _grid, _grid );

	//
	setTimeout(function(){
		_createCube();
	},100);
	



	function _drawFractals( _x, _y, _z, _w, _h, _d )
	{
		if( _w < _gridSize || _h < _gridSize || _d < _gridSize ) return;

		var _dp = Math.floor( Math.random() * 8 );
		var __gridJs = Math.floor( ( 1.0 - Math.random() * Math.random() * Math.random() ) * _gridJs );
		var _size = _gridSize * Math.pow( 2, __gridJs );
		_size = _size > _w ? _w : _size;
		_size = _size > _h ? _h : _size;
		_size = _size > _d ? _d : _size;
		var _thumb;

		switch( _dp )
		{
			case 0:
				_thumb = new THREE.Vector4( _x, _y, _z, _size );
				//add-bottom
				_drawFractals( _x, _y + _size, _z, _w, _h - _size, _d );
				//add-right
				_drawFractals( _x + _size, _y, _z, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y, _z + _size, _w, _size, _d - _size );
				break;

			case 1:
				_thumb = new THREE.Vector4( _x + _w - _size, _y, _z, _size );
				//add-bottom
				_drawFractals( _x, _y + _size, _z, _w, _h - _size, _d );
				//add-right
				_drawFractals( _x, _y, _z, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y, _z + _size, _w, _size, _d - _size );
				break;

			case 2:
				_thumb = new THREE.Vector4( _x, _y, _z + _d - _size, _size );
				//add-bottom
				_drawFractals( _x, _y + _size, _z, _w, _h - _size, _d );
				//add-right
				_drawFractals( _x + _size, _y, _z + _d - _size, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y, _z, _w, _size, _d - _size );
				break;
			
			case 3:
				//bottom-right
				_thumb = new THREE.Vector4( _x + _w - _size, _y, _z + _d - _size, _size );
				//add-bottom
				_drawFractals( _x, _y + _size, _z, _w, _h - _size, _d );
				//add-right
				_drawFractals( _x, _y, _z + _d - _size, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y, _z, _w, _size, _d - _size );
				break;
			
			case 4:
				_thumb = new THREE.Vector4( _x, _y + _h - _size, _z, _size );
				//add-top
				_drawFractals( _x, _y, _z, _w, _h - _size, _d );
				//add-side
				_drawFractals( _x + _size, _y + _h - _size, _z, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y + _h - _size, _z + _size, _w, _size, _d - _size );
				break;
			
			case 5:
				_thumb = new THREE.Vector4( _x + _w - _size, _y + _h - _size, _z, _size );
				//add-top
				_drawFractals( _x, _y, _z, _w, _h - _size, _d );
				//add-side
				_drawFractals( _x, _y + _h - _size, _z, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y + _h - _size, _z + _size, _w, _size, _d - _size );
				break;
			
			case 6:
				_thumb = new THREE.Vector4( _x, _y + _h - _size, _z + _d - _size, _size );
				//add-top
				_drawFractals( _x, _y, _z, _w, _h - _size, _d );
				//add-side
				_drawFractals( _x + _size, _y + _h - _size, _z + _d - _size, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y + _h - _size, _z, _w, _size, _d - _size );
				break;
			
			default:
				_thumb = new THREE.Vector4( _x + _w - _size, _y + _h - _size, _z + _d - _size, _size );
				//add-top
				_drawFractals( _x, _y, _z, _w, _h - _size, _d );
				//add-side
				_drawFractals( _x, _y + _h - _size, _z + _d - _size, _w - _size, _size, _size );
				//add-depth
				_drawFractals( _x, _y + _h - _size, _z, _w, _size, _d - _size );
		}

		_drawList.push( _thumb );
	}
	function __drawFractals( _x, _y, _z, _w, _h, _d ){}

	function _createCube(){
		var _geometry = new THREE.Geometry();
		var _fieldScale = 0.8;
		var len = _drawList.length;
		while( len )
		{
			len --;
			var _v4 = _drawList[len];

			// var _geometry = new THREE.PlaneGeometry( _v4.z * _scale - _margin, _v4.w * _scale - _margin, 1, 1 );
			// _geometry.rotateX( - Math.PI * 0.5 );
			var _h = _v4.w * _scale - _margin * 2;
			var _geometry = new THREE.BoxGeometry( _h, _h, _h, 1, 1, 1 );
			//_geometry.translate( _h * 0.5, _h * 0.5, _h * 0.5 );
			
			var _mesh = new THREE.Mesh( _geometry, _material );
			scene.add( _mesh );

			_mesh.position.x = _v4.x;
			_mesh.position.y = _v4.y;
			_mesh.position.z = _v4.z;

			_mesh.position.x *= _scale;
			_mesh.position.y *= _scale;
			_mesh.position.z *= _scale;

			_mesh.position.x += _h * 0.5 + _margin;
			_mesh.position.y += _h * 0.5 + _margin;
			_mesh.position.z += _h * 0.5 + _margin;

			_meshList.push( _mesh );

			_mesh.scale.set( 0.01, 0.01, 0.01 );
			TweenMax.to( _mesh.scale, 0.5, {x:1,y:1,z:1,delay:len*0.005 } );

			//	
			var _adj = 1.0;
			var boxShape = new CANNON.Box(new CANNON.Vec3( _h * 0.5 * _adj, _h * 0.5 * _adj, _h * 0.5 * _adj ));
			var mat = new CANNON.Material();
			var boxBody = new CANNON.Body({ mass: 1.0, material: mat });
			//boxBody.angularDamping = 0.01;
			boxBody.addShape(boxShape);
			boxBody.position.set(
				_mesh.position.x,
				_mesh.position.y,
				_mesh.position.z
			);

			boxBody.velocity.set(0,0,0);
			boxBody.angularVelocity.set(0,0,0);

			world.add(boxBody);
			_bodylist.push(boxBody);

		}
	}


	function _killMesh(){
		var len = _meshList.length;
		while( len )
		{
			len --;
			var _mesh = _meshList[len];
			(function(_mesh){
				TweenMax.to( _mesh.scale, 1.0, { x: 0.01, y: 0.01, z: 0.01, onComplete: function(){
					_mesh.visible = false;
				}} )
			})(_mesh);
		};

		setTimeout(function(){
			var len = _meshList.length;
			while( len )
			{
				len --;
				var _mesh = _meshList[len];
				scene.remove( _mesh );
				_mesh = null;
			};
			_meshList = [];

			var len = _bodylist.length;
			while( len )
			{
				len --;
				var _body = _bodylist[len];
				world.removeBody( _body );
				_body = null;
			}
			_bodylist = [];

			_isClick = false;
			TweenMax.to( focus, 0.5, {x:0,y:0,z:0});

			setTimeout(function(){

				_drawList = [];
				_drawFractals( - _grid * 0.5, - _grid * 0.5, - _grid * 0.5, _grid, _grid, _grid );
				_createCube();
			},100);

		}, 1000 )
	}



	window.addEventListener( 'keydown', function(){

		if( !_isClick )
		{
			setTimeout(function(){
				_killMesh();
			},1000 * 15 );
		}

		_createMeteo();
		
	})

	window.addEventListener( 'touchend', function(){

		if( !_isClick )
		{
			setTimeout(function(){
				_killMesh();
			},1000 * 15 );
		}

		_createMeteo();
	})

	function _createMeteo()
	{
		if( _isClick )return;
		_isClick = true;

		var _size = 30;
		var _geometry = new THREE.IcosahedronGeometry(_size*0.5,1);
		var _material = new THREE.MeshPhongMaterial( { shininess: 100, color: 0xFFFFFF, specular: 0xFF0000, envMap: reflectionCube,shading: THREE.FlatShading } );
		var _mesh = new THREE.Mesh( _geometry, _material );
		scene.add( _mesh );
		_meshList.push( _mesh );

		var boxShape = new CANNON.Sphere( _size * 0.5);
		var mat = new CANNON.Material();
		var boxBody = new CANNON.Body({ mass: 100.0, material: mat });
		//boxBody.angularDamping = 0.01;
		boxBody.addShape(boxShape);
		boxBody.position.set(0,1000,0);
		boxBody.velocity.set(0,-250,0);
		if( Math.random() < .4 )
		{
			//	normal
			var _v = new THREE.Vector3();
			_v.x = ( Math.random() - .5 ) * 4;
			_v.y = ( Math.random() - .5 ) * 4;
			_v.z = ( Math.random() - .5 ) * 4;
			_v.normalize().multiplyScalar( 250 );
			var _p = new THREE.Vector3().copy( _v ).multiplyScalar( - 4 );
			boxBody.position.set( _p.x, _p.y, _p.z );
			boxBody.velocity.set( _v.x, _v.y, _v.z );
		}
		boxBody.angularVelocity.set((Math.random()-.5) * Math.PI,(Math.random()-.5) * Math.PI,(Math.random()-.5) * Math.PI);

		world.add(boxBody);
		_bodylist.push(boxBody);
	}


	window.onresize = resize;
	render();


	function render()
	{
		window.requestAnimationFrame(render);

		if( _isClick )
		{
			var _t = _meshList[_meshList.length-1]
			focus.x += ( _t.position.x - focus.x ) * 0.025;
			focus.y += ( _t.position.y - focus.y ) * 0.025;
			focus.z += ( _t.position.z - focus.z ) * 0.025;
		}

		
		world.step( 1 / 60 );
		for(var i=0; i < _meshList.length; i++){
			_meshList[i].position.copy(_bodylist[i].position);
			_meshList[i].quaternion.copy(_bodylist[i].quaternion);
		}


		//cubeCamera.updateCubeMap( renderer, scene );

		//	render
		controls.update();
		camera.lookAt( focus );
		renderer.render( scene, camera );
	}
	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize( width, height );
		if( camera.aspect )
		{
			camera.aspect = width / height;
		} else {
			camera.left = - width * 0.5;
			camera.right = width * 0.5;
			camera.bottom = - height * 0.5;
			camera.top = height * 0.5;
		}
		
		camera.updateProjectionMatrix();
	}
};

function easeInBack(t,b,c,d){
	var s = 1.70158;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}
function easeInExpo(t,b,c,d){
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}
function easeOutExpo(t,b,c,d){
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}
function easeInQuad(t,b,c,d){
	return c*(t/=d)*t + b;
}