/*
	engine.js
*/

(function(){

	var _jsonlist = [
		{	url: 'cloud.json', position: {x: 0,	y:150,	z:100	},	scale: 3	},
		{	url: 'cloud2.json', position: {x: 0,	y:150,	z:-100	},	scale: 3	},
		{	url: 'tree00.json', position: {x: 0,	y:0,	z:0	},	scale: 10	},
		{	url: 'tree01.json', position: {x: 0,	y:0,	z:0	},	scale: 10	},
		{	url: 'tree02.json', position: {x: 0,	y:0,	z:0	},	scale: 10	},
		{	url: 'floatWorld.json', position: {x: 0,	y:130,	z:0	},	scale: 4	},
		{	url: 'daruma10.json', position: {x: 0,	y:25,	z:100	},	scale: 10	},
		{	url: 'planet00.json', position: {x: 100,	y:100,	z:100	},	scale: 10	},
		{	url: 'twitter.json', position: {x: -100,	y:50,	z:-100	},	scale: 6	},
		{	url: 'food.json', position: {x: 0,	y:10,	z:-100	},	scale: 20	},
		{	url: 'apple.json', position: {x: 100,	y:50,	z:-100	},	scale: 20	},
		{	url: 'potato.json', position: {x: 200,	y:50,	z:-100	},	scale: 20	},
		{	url: 'coffee.json', position: {x: -200,	y:50,	z:-200	},	scale: 20	},
		{	url: 'petbottle.json', position: {x: -100,	y:50,	z:-200	},	scale: 20	}
	];


	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var time = 0;

	//
	var scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x13b0e7, 1600, 3200 );
	var sceneBG = new THREE.Scene();

	var camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 3200);
	camera.position.y = 100;
	camera.position.z = 1000;

	var cameraBG = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 32000);

	var focus = new THREE.Vector3(0,0,0);
	camera.lookAt( focus );


	var amb = new THREE.AmbientLight( 0x666666 );
	scene.add( amb );

	var _dl = new THREE.DirectionalLight( 0x999999, 1.0 );
	_dl.position.set( 1, 1, 1 );
	scene.add( _dl );

	var _sl01 = new THREE.SpotLight( 0xFFFFFF, 0.2 );
	_sl01.position.set( 300, 300, 300 );
	_sl01.angle = Math.PI * 0.35;
	_sl01.castShadow = true;
	_sl01.shadowMapWidth = 1024;
	_sl01.shadowMapHeight = 1024;
	scene.add( _sl01 );

	var renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setClearColor( 0x13b0e7, 1 );
	renderer.setSize(_width, _height);
	renderer.autoClear = false;
	renderer.shadowMapEnabled = true;

	document.getElementById('container').appendChild(renderer.domElement);

	var geometry = new THREE.DelaunayGeometry( 6400, 6400, 3200 );
	var material = new THREE.MeshLambertMaterial({
		color:0x11cf0b,
		shading:THREE.FlatShading,
	});
	var _ground = new THREE.Mesh( geometry, material );
	_ground.receiveShadow = true;
	scene.add( _ground );

			var len = geometry.vertices.length;
			while( len )
			{
				len --;
				var _p = geometry.vertices[len]
				var _value = Math.random() * 16-8;
				_p.y = _value;

				geometry.colors[len] = new THREE.Color( 0x11cf0b );
			}
			geometry.vertecesNeedUpdate = true;
			geometry.computeFaceNormals();
			geometry.computeVertexNormals();


	createskybox();

	loadJson();

	function loadJson()
	{
		if( _jsonlist.length )
		{
			var _data = _jsonlist.pop();
			var _s = new THREEURLLoader();
			_s.load( './json/' + _data.url, function(e){
				scene.add( e );

				if( _data.position.x == 0 && _data.position.y == 0 && _data.position.z == 0 )
				{
					e.position.x = _jsonlist.length * 50
				} else {
					e.position.x = _data.position.x;
					e.position.y = _data.position.y;
					e.position.z = _data.position.z;
				}
				e.scale.set(_data.scale,_data.scale,_data.scale);
				e.castShadow = true;

				loadJson();
			});
		}
	}

	function createskybox()
	{

		//	skybox
		var geometry = new THREE.IcosahedronGeometry( 24000, 2 );
		var material = new THREE.MeshBasicMaterial({
			color: 0x13b0e7,
			side: THREE.BackSide
		});

		var _shader = {
			uniforms: {
				"skyColor": { type: "c", value: new THREE.Color(0x13b0e7) },
				"time":     { type: "f", value: 0.0 }
			},

			vertexShader: [
				"varying vec3 vUv;",
				"void main() {",
				"vUv = position.xyz;",
				"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"

			].join("\n"),

			fragmentShader: [
				"uniform vec3 skyColor;",
				"varying vec3 vUv;",
				"void main() {",
		    	"vec3 _h = normalize( vUv );",
		    	"float _value = abs( sin(0.1) * 0.1 / ( _h.y + 0.05 ) );",
				"gl_FragColor = vec4(skyColor.r, skyColor.g, skyColor.b, 1.0);",
		    	"gl_FragColor += vec4( vec3( _value ), 0.1 );",
				"}"
			].join("\n")

		};
		var material = new THREE.ShaderMaterial({
			uniforms: _shader.uniforms,
			fragmentShader: _shader.fragmentShader,
			vertexShader: _shader.vertexShader,
			side: THREE.BackSide
		});
		var _skyBox = new THREE.Mesh( geometry, material );
		sceneBG.add( _skyBox );
	}



	//	resize
	window.addEventListener('resize',function(){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		//_width = _width<1024?1024:_width;

		renderer.setSize(_width, _height);
		camera.aspect = _width/_height;
		camera.updateProjectionMatrix();
	});

	//	render
	(function render(){

		time ++;
		var _time = time * 0.3;
		var _r = 500;
		camera.position.x = Math.sin( _time * 0.01 ) * _r;
		camera.position.y = Math.sin( _time * 0.01 ) * 100 + 150;
		camera.position.z = Math.cos( _time * 0.01 ) * _r;

		cameraBG.position.x = camera.position.x;
		cameraBG.position.y = camera.position.y;
		cameraBG.position.z = camera.position.z;

		camera.lookAt( focus );
		cameraBG.lookAt( focus );
		renderer.render( sceneBG, cameraBG );
		renderer.render( scene, camera );
		window.requestAnimationFrame(render);
	})();

})();