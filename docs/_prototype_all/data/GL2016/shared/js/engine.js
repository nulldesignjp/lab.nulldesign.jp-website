/*
	engine.js
*/


window.onload = function(){
	var width = window.innerWidth;
	var height = window.innerHeight;

	var scene, camera, focus, renderer, composer, controls;
	var light0, light1, light2;
	var _noise;
	var _mesh,_mesh2,_points;
	var _offset;
	var _vector;
	var _color = { h:0.0, s:1.0, l:0.5 };

	var _effectList = {
		'56': { shader: ofxNDShaderEffect.ef08,
			init: function(uniforms_){
				uniforms_.progress.value = Math.random();
			}, 
			update: function(uniforms_){
				uniforms_.progress.value = Math.sin( new Date().getTime() * 0.001 ) * 0.5 + 0.5;
			}
		},
		'57': { shader: THREE.MirrorShader,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'48': { shader: THREE.KaleidoShader,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'81': { shader: ofxNDShaderEffect.convergence,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'87': { shader: ofxNDShaderEffect.crBlueinvert,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'69': { shader: ofxNDShaderEffect.crBlueraise,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'82': { shader: ofxNDShaderEffect.crGreeninvert,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'84': { shader: ofxNDShaderEffect.crGreenraise,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'89': { shader: ofxNDShaderEffect.crRedinvert,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'85': { shader: ofxNDShaderEffect.crRedraise,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'73': { shader: ofxNDShaderEffect.crHighContrast,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'79': { shader: ofxNDShaderEffect.invert,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'80': { shader: ofxNDShaderEffect.ef00,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'65': { shader: ofxNDShaderEffect.cut_slider,
			init: function(uniforms_){},
			update: function(uniforms_){
				uniforms_.rand.value = Math.random() * 4;
			}
		},
		'83': { shader: ofxNDShaderEffect.glow,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'68': { shader: ofxNDShaderEffect.ef00,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'70': { shader: ofxNDShaderEffect.outline,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'71': { shader: ofxNDShaderEffect.shaker,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'72': { shader: ofxNDShaderEffect.slitscan,
			init: function(uniforms_){},
			update: function(uniforms_){
				uniforms_.rand.value = Math.random() * 8.0;
				uniforms_.val1.value = Math.random();
				uniforms_.val2.value = Math.random();
				uniforms_.val3.value = Math.random();
				uniforms_.val4.value = Math.random();
			}
		},
		'74': { shader: ofxNDShaderEffect.swell,
			init: function(uniforms_){},
			update: function(uniforms_){
				uniforms_.rand.value = Math.random() * 6.0;
				uniforms_.timer.value += 1 / 60;
			}
		},
		'75': { shader: ofxNDShaderEffect.twist,
			init: function(uniforms_){
				uniforms_.timer.value = 0;
			},
			update: function(uniforms_){
				uniforms_.rand.value = Math.random() * 0.0016;
				uniforms_.timer.value += 1 / 60;
				uniforms_.val1.value = Math.random() * 0.1;
				uniforms_.val2.value = Math.random() * 0.1;
				uniforms_.val3.value = Math.random() * 2.0;
				uniforms_.val4.value = Math.random() * 4.1;
			}
		},
		'76': { shader: THREE.DotScreenShader,
			init: function(uniforms_){
				var _p = Math.floor( Math.random() * 3 ) + 8;
				var _pow = Math.pow( 2, _p );
				uniforms_.tSize.value = new THREE.Vector2( _pow, _pow );
				uniforms_.angle.value = Math.random() * Math.PI * 2;
				uniforms_.scale.value = Math.random() * 2;
			},
			update: function(uniforms_){}
		},
		'90': { shader: ofxNDShaderEffect.ef01,
			init: function(uniforms_){},
			update: function(uniforms_){
				uniforms_.grid.value = Math.floor( Math.random() * 50 ) + 5;
			}
		},
		'88': { shader: ofxNDShaderEffect.ef02,
			init: function(uniforms_){
				uniforms_.time.value = 0;
			},
			update: function(uniforms_){
				uniforms_.time.value += 1 / 60;
				uniforms_.grid.value = Math.floor( Math.random() * 30 ) + 5;
			}
		},
		'67': { shader: ofxNDShaderEffect.ef03,
			init: function(uniforms_){
				uniforms_.mouse.value.x = Math.random() * window.innerWidth;
				uniforms_.mouse.value.y = Math.random() * window.innerHeight;
				uniforms_.vec.value.x = ( Math.random() - .5 ) * 10;
				uniforms_.vec.value.y = ( Math.random() - .5 ) * 10;
			},
			update: function(uniforms_){
				uniforms_.mouse.value.x += uniforms_.vec.value.x;
				uniforms_.mouse.value.y += uniforms_.vec.value.y;

				var _w = window.innerWidth;
				var _h = window.innerHeight;
				if( uniforms_.mouse.value.x > _w )
				{
					uniforms_.mouse.value.x = _w;
					uniforms_.vec.value.x *= -1;
				} else if( uniforms_.mouse.value.x < 0)
				{
					uniforms_.mouse.value.y = 0;
					uniforms_.vec.value.y *= -1;
				}
				if( uniforms_.mouse.value.y > _h )
				{
					uniforms_.mouse.value.y = _h;
					uniforms_.vec.value.y *= -1;
				} else if( uniforms_.mouse.value.y < 0)
				{
					uniforms_.mouse.value.y = 0;
					uniforms_.vec.value.y *= -1;
				}
			}
		},
		'86': { shader: ofxNDShaderEffect.ef07,
			init: function(uniforms_){
				uniforms_.step.value = Math.floor( Math.random() * 6 ) + 1;
			},
			update: function(uniforms_){}
		},
		'66': { shader: ofxNDShaderEffect.ef12,
			init: function(uniforms_){},
			update: function(uniforms_){}
		},
		'78': { shader: THREE.RGBShiftShader,
			init: function(uniforms_){},
			update: function(uniforms_){
				uniforms_.angle.value = Math.random() * Math.PI * 2;
				uniforms_.amount.value = Math.random() * 0.1;
			}
		},
		'77': { shader: THREE.FilmShader,
			init: function(uniforms_){		
				uniforms_.time.value = 0;
				uniforms_.grayscale.value = 1;
				uniforms_.nIntensity.value = Math.random() * 0.4 + 0.2;
				uniforms_.sIntensity.value = Math.random() * 0.4 + 0.01;
			},
			update: function(uniforms_){
				uniforms_.time.value += 1/60;
			}
		}
	};
	var _effects = {};

	init();
	render();
	window.onresize = resize;
	window.addEventListener( 'keydown', function(e){	_keyDown(e);	} );
	window.addEventListener( 'keyup', function(e){	_keyUp(e);	} );

	function init(){
		scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x000000, 1600, 3200 );
		focus = new THREE.Vector3();

		camera = new THREE.PerspectiveCamera( 35, width / height, 0.1, 3200 );
		camera.position.set( 0, 0, 0 );
		camera.lookAt( focus );
		scene.add( camera );

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor( 0x000000 );
		renderer.setSize( width, height );
		document.getElementById( 'container' ).appendChild(renderer.domElement);

		composer = new THREE.EffectComposer( renderer );
		composer.addPass( new THREE.RenderPass( scene, camera ) );

		var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
		_copySahder.renderToScreen = true;
		composer.addPass( _copySahder );

		//	ライティング
		light0 = new THREE.AmbientLight( 0xCCCCCC );
		scene.add( light0 );
		light1 = new THREE.DirectionalLight( 0xFFFFFF, 0.5 );
		scene.add( light1 );
		light1.position.set( 1000, 0, 1000 );
		// light2 = new THREE.PointLight( 0xFFFFFF, 1.0, 1200 );
		// scene.add( light2 );
		// light2.position.set( 600, 0, 600 );

		_noise = new SimplexNoise();
		_vector = [];

		var r = 200;
		var _geometry = new THREE.BoxGeometry( r,r,r,1,1,1);
		var _material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.0
		});
		_mesh = new THREE.Mesh( _geometry, _material );
		scene.add( _mesh );

		var _eh = new THREE.EdgesHelper( _mesh, 0x181818 );
		scene.add( _eh );
		_mesh2 = new THREE.Mesh( _geometry, _material );
		scene.add( _mesh2 );

		var _eh = new THREE.EdgesHelper( _mesh2, 0x080808 );
		scene.add( _eh );

		var _geometry = new THREE.Geometry();
		for( var i = 0; i < 30000; i++ )
		{
			var _v = new THREE.Vector3();
			_v.x = ( Math.random() - .5 ) * r;
			_v.y = ( Math.random() - .5 ) * r;
			_v.z = ( Math.random() - .5 ) * r;
			_geometry.vertices[i] = _v;

			_vector[i] = new THREE.Vector3();
		}
		var _material = new THREE.PointsMaterial({
			color: 0x003030,
			//size: 1,
			transparent: true,
			depthTest: false,
			depthWrite: false,
			blending: THREE.AdditiveBlending,
			map: new THREE.TextureLoader().load('shared/img/circle1.png')
		});
		_points = new THREE.Points( _geometry, _material );
		_mesh.add( _points );


		_mesh.rotation.x = Math.random() * Math.PI * 2;
		_mesh.rotation.y = Math.random() * Math.PI * 2;
		_mesh.rotation.z = Math.random() * Math.PI * 2;

		camera.position.z = 100;

		_offset = Math.random() * Math.PI * 2;


		_color = new THREE.Color( 0x003030 ).getHSL();

	}


	function render()
	{
		window.requestAnimationFrame(render);

		_mesh2.rotation.x += ( _mesh.rotation.x - _mesh2.rotation.x ) * 0.24;
		_mesh2.rotation.y += ( _mesh.rotation.y - _mesh2.rotation.y ) * 0.24;
		_mesh2.rotation.z += ( _mesh.rotation.z - _mesh2.rotation.z ) * 0.24;

		var _ty = document.body.scrollTop * Math.PI * 0.0025 + _offset;
		_mesh.rotation.x += ( _ty - _mesh.rotation.x ) * 0.01;
		_mesh.rotation.y += ( _ty - _mesh.rotation.y ) * 0.01;
		_mesh.rotation.z += ( _ty - _mesh.rotation.z ) * 0.01;

		_offset += 0.00002;

		camera.position.z = 100 + document.body.scrollTop  * 0.1;

		var _scale = 0.02;
		var _speed = 0.05;
		var __offset = 0;
		var len = _points.geometry.vertices.length;
		while( len )
		{
			len --;
			var _p = _points.geometry.vertices[ len ];
			var _v = _vector[ len ];
			_v.x += _noise.noise( _p.y * _scale + _offset * 10.0, _p.z * _scale ) * _speed;
			_v.y += _noise.noise( _p.z * _scale + _offset * 10.0, _p.x * _scale ) * _speed;
			_v.z += _noise.noise( _p.x * _scale + _offset * 10.0, _p.y * _scale ) * _speed;
			_v.multiplyScalar(0.96);
			_p.x += _v.x;
			_p.y += _v.y;
			_p.z += _v.z;
			_p.multiplyScalar(0.99);
		}
		_points.geometry.verticesNeedUpdate = true;



		_color.h += 0.001;
		_color.h %= 1.0;

		_points.material.color.setHSL( _color.h, _color.s, _color.l );

		//	effect
		for( var i in _effects )
		{
			var id_ = _effects[i].id;
			_effectList[id_].update( _effects[i].shader.uniforms );
		}

		scene.rotation.x += 0.01;
		scene.rotation.y += 0.01;
		scene.rotation.z += 0.01;

		//	render
		camera.lookAt( focus );
		//renderer.render( scene, camera );
		composer.render();
	}

	function resize()
	{
		var width  = window.innerWidth;
		var height = window.innerHeight;
		renderer.setSize( width, height );
		composer.setSize( width, height );
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

	function _keyDown( e ){
		var _keyCode = e.keyCode;
		console.log( _keyCode );

		addEffects( _keyCode );
	}
	function _keyUp( e ){
		var _keyCode = e.keyCode;
		removeEffects( _keyCode );

		//	ZERO
		if( _keyCode == 48 )
		{
			killEffects();
			return;
		}
	}

	function addPass( e ){
		var len = composer.passes.length;
		composer.passes.splice( len - 1, 0, e );
	}

	function removePass( e ){
		var len = composer.passes.length;
		while( len )
		{
			len --;
			var _path = composer.passes[len];
			if( _path == e )
			{
				composer.passes.splice( len, 1 );
				return _path;
			}
		}
	}

	function addEffects( e ){

		//	[Q to P]	81, 87, 69, 82, 84, 89, 85, 73, 79, 80
		//	[A to L]	65, 83, 68, 70, 71, 72, 74, 75, 76
		//	[Z to M]	90, 88, 67, 86, 66, 78, 77, 

		var _shaderChank = _effectList[e];
		if( _shaderChank && !_effects[e] )
		{
			var _copySahder = new THREE.ShaderPass( _shaderChank.shader );
			_copySahder.renderToScreen = false;
			_copySahder.enabled = true;
			addPass( _copySahder );
			_effects[e] = { shader: _copySahder, id: e };
			_effectList[e].init( _effects[e].shader.uniforms );
		}
	}

	function removeEffects( e ){
		if( _effects[e] )
		{
			removePass( _effects[e].shader );
			delete _effects[e];
		}
	}
	function killEffects(){
		var len = composer.passes.length;
		composer.passes.splice( 2, len - 3 );
	}
};
