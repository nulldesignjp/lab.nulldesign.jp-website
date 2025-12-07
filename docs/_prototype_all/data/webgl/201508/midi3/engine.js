/*
	engine.js
*/

(function(){
	var scene,camera,focus,renderer;
	var composer;
	var midiList = {
		speed: 1.0,
		rgb: 0,
		hue: 0,
		sat: 0,
		d3: 0,
		sphere: 0,
		opacity: 0,

		color: 0,
		mode: 0,
		gliltch: 0
	};

	var _width = window.innerWidth;
	var _height = window.innerHeight;
	var skyColor = 0x000000;

	var _r0 = 0;
	var _g0 = 0;
	var _b0 = 0;
	var _r1 = 0;
	var _g1 = 0;
	var _b1 = 0;

	var _tr0 = Math.random();
	var _tg0 = Math.random();
	var _tb0 = Math.random();
	var _tr1 = Math.random();
	var _tg1 = Math.random();
	var _tb1 = Math.random();


	var sn = new SimplexNoise();
	var sn0 = new SimplexNoise();

	var rotationAccell = 0.0;
	var currentPoint = new THREE.Vector3(0,0,0);
	var currentTargetDirection = 0;
	var currentDirection = 0;
	var currentSpeed = 9.0;
	var currentTargetSpeed = 9.0;
	var mapScale = 0.003;
	var offsetY = - 50;
	var offsetHeight = 50;
	var rotationSpeed = 0;
	var targetSize = 24;

	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( skyColor, 400, 16000 );

	focus = new THREE.Vector3( 0, 0, 0 );

	camera = new THREE.PerspectiveCamera( 45, _width / _height, 0.1, 32000);
	camera.position.set(0, 0, 400);
	camera.lookAt(focus);

	_camera = new THREE.Vector3( camera.position.x, camera.position.y, camera.position.z );
	_focus = new THREE.Vector3( focus.x, focus.y, focus.z );

	renderer = new THREE.WebGLRenderer({ antialias: false });
	renderer.setClearColor( skyColor, 1);
	renderer.setSize(_width, _height);

	//	composer
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );

	var _rgbShift = new THREE.ShaderPass( THREE.RGBShiftShader );
	_rgbShift.uniforms[ 'amount' ].value = 0.0015;
	//_rgbShift.renderToScreen = true;
	composer.addPass( _rgbShift );

	var _hueAndSaturetion = new THREE.ShaderPass( THREE.HueSaturationShader );
	_hueAndSaturetion.uniforms[ 'hue' ].value = 0.0;
	_hueAndSaturetion.uniforms[ 'saturation' ].value = 0.0;
	composer.addPass( _hueAndSaturetion );

	var _focus = new THREE.ShaderPass( THREE.FocusShader );
	_focus.uniforms[ 'screenWidth' ].value = window.innerWidth;
	_focus.uniforms[ 'screenHeight' ].value = window.innerHeight;
	_focus.uniforms[ 'waveFactor' ].value = 0.005;	//	0.00125
	composer.addPass( _focus );

	var _invert = new THREE.ShaderPass( THREE.InvertShader );
	_invert.enabled = false;
	composer.addPass( _invert );

	var _3d = new THREE.ShaderPass( THREE.D3Shader );
	_3d.uniforms[ 'screenWidth' ].value = window.innerWidth;
	_3d.uniforms[ 'screenHeight' ].value = window.innerHeight;
	_3d.uniforms[ 'left' ].value = 0;
	_3d.uniforms[ 'top' ].value = 0;
	_3d.enabled = false;
	composer.addPass( _3d );

	var _glitch = new THREE.ShaderPass( THREE.DigitalGlitch );
	//_glitch.uniforms[ 'byp' ].value = 1;
	_glitch.uniforms[ 'amount' ].value = Math.random()*0.01;
	_glitch.uniforms[ 'angle' ].value = Math.random();
	_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;
	_glitch.uniforms[ 'seed_y' ].value = Math.random()*2-1;
	_glitch.uniforms[ 'distortion_x' ].value = Math.random()*10;
	_glitch.uniforms[ 'distortion_y' ].value = Math.random()*10;
	_glitch.enabled = false;
	composer.addPass( _glitch );


	var _copySahder = new THREE.ShaderPass( THREE.CopyShader );
	_copySahder.renderToScreen = true;
	composer.addPass( _copySahder );


	
	document.getElementById('container').appendChild(renderer.domElement);

	//	
	var uniforms = THREE.DeDeShader.uniforms;
		uniforms.time.value = Math.random() * 1000;
		uniforms.skyColor.value = new THREE.Color( 1.0, 0.0, 0.0 );
		uniforms.skyColor2.value = new THREE.Color( 1.0, 1.0, 0.0 );
    	uniforms.resolution.value.x = window.innerWidth;
    	uniforms.resolution.value.y = window.innerHeight;

	var geometry = new THREE.IcosahedronGeometry( 24000, 1 );
	var material = new THREE.ShaderMaterial({
		uniforms: uniforms,
        vertexShader: THREE.DeDeShader.vertexShader,
        fragmentShader: THREE.DeDeShader.fragmentShader,
        side: THREE.DoubleSide,
        transparent: true,
        depthTest: false,
        shading: THREE.SmoothShading
	});
	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	var _geometry = new THREE.Geometry();
	for( var i = 0; i < _grid; i=(i+1)|0 )
	{
		for( var j = 0; j < _grid; j=(j+1)|0 )
		{
			var _vertex = new THREE.Vector3( ( i - _grid * .5 ) * _scale, + offsetY, ( j - _grid * .5 ) * _scale );
			_geometry.vertices.push( _vertex );
			_geometry.colors.push( new THREE.Color(Math.random(),Math.random(),Math.random()));
		}
	}

	//
		var _grid = 64;
		var _scale = 24.0;
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < _grid; i=(i+1)|0 )
		{
			for( var j = 0; j < _grid; j=(j+1)|0 )
			{
				var _vertex = new THREE.Vector3( ( i - _grid * .5 ) * _scale, + offsetY, ( j - _grid * .5 ) * _scale );
				_geometry.vertices.push( _vertex );
				_geometry.colors.push( new THREE.Color(Math.random(),Math.random(),Math.random()));
			}
		}

		var _material = new THREE.PointCloudMaterial({
			size: 24.0,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
			vertexColors:THREE.VertexColors,
			depthTest:      false,
			map: THREE.ImageUtils.loadTexture( 'sphere04.png' )
		});
		particle = new THREE.PointCloud( _geometry, _material );
		scene.add( particle );

		particle.position.z = camera.position.z;














	//	event
	window.addEventListener( 'resize', function(e){
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		camera.aspect = _width / _height;
		camera.updateProjectionMatrix();
		renderer.setSize( _width, _height );
	}, false );

	(function render(){
		camera.lookAt( focus );
		//	renderer.render( scene, camera );
		composer.render();
		update();
		window.requestAnimationFrame( render );
	})();

	var _midi = new midiControl( _midiMessage );

	function _midiMessage(e)
	{
		//console.log(e, e.note, e.velocity)

		var _index = e.note - 1;
		if( e.note > 35 )
		{
			//	pad up
			if( e.type == 128 )
			{
				e.velocity = 0;
			}
			_index = e.note - 27 - 1;
		}

		//	
		if( e.note == 13 ){	midiList.speed = e.velocity / 127 * 0.05 + 1.0;	}
		if( e.note == 14 ){	midiList.rgb = e.velocity / 127 * 2.0 - 1.0;	}
		if( e.note == 15 ){	midiList.hue = e.velocity / 127 * 2.0 - 1.0;	}
		if( e.note == 16 ){	midiList.sat = e.velocity / 127 * 2.0 - 1.0;	}
		//if( e.note == 16 ){	midiList.d3 = e.velocity / 127 * 2.0 - 1.0;	}



		if( e.note == 77 ){	currentTargetSpeed = 18 * e.velocity + 3;	}


		//	PAD

		if( e.note == 41 ){	changeColors();	}
		if( e.note == 42 ){ particle.material.size *= 3;	}



		if( e.note == 60 ){	_invert.enabled = e.type == 144;	}

		if( e.note == 73 ){	uniforms.sparkMode.value = 1;	}
		if( e.note == 74 ){	uniforms.sparkMode.value = 2;	}
		if( e.note == 75 ){	uniforms.sparkMode.value = 3;	}
		if( e.note == 76 ){	uniforms.sparkMode.value = 4;	}
		if( e.note == 89 ){	uniforms.sparkMode.value = 5;	}
		if( e.note == 90 ){	uniforms.sparkMode.value = 6;	}
		if( e.note == 91 ){	uniforms.sparkMode.value = 7;	}

		if( e.note == 92 )
		{
			if( e.type == 128 )
			{
				midiList.gliltch = 0;
				_glitch.enabled = false;
			} else {
				midiList.gliltch = 1;
				_glitch.enabled = true;
			}

		}


		if( e.note == 84 )
		{
			var _opacity = e.velocity / 127;

			$( '#container' ).css('opacity', _opacity );
		}


	}

	setInterval(function(){
		changeColors();
	},7000);

	

	function changeColors()
	{
		_tr0 = Math.random();
		_tg0 = Math.random();
		_tb0 = Math.random();
		_tr1 = Math.random();
		_tg1 = Math.random();
		_tb1 = Math.random();
	}

	function update()
	{
		uniforms.time.value += 0.1;
		uniforms.speed.value += ( midiList.speed - uniforms.speed.value ) * 0.01;

		_rgbShift.uniforms[ 'amount' ].value += ( midiList.rgb - _rgbShift.uniforms[ 'amount' ].value ) * 0.05;

		_hueAndSaturetion.uniforms[ 'hue' ].value += ( midiList.hue - _hueAndSaturetion.uniforms[ 'hue' ].value ) * 0.05;
		_hueAndSaturetion.uniforms[ 'saturation' ].value += ( midiList.sat - _hueAndSaturetion.uniforms[ 'saturation' ].value ) * 0.05;


		if( midiList.gliltch )
		{
			_glitch.uniforms[ 'amount' ].value = Math.random() * 0.01;
			_glitch.uniforms[ 'angle' ].value = Math.random() * Math.PI;
			_glitch.uniforms[ 'seed_x' ].value = Math.random()*2-1;	//	-1 - 1
			_glitch.uniforms[ 'seed_y' ].value = - _glitch.uniforms[ 'seed_x' ].value;
			_glitch.uniforms[ 'distortion_x' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'distortion_y' ].value = Math.random()*2-1;
			_glitch.uniforms[ 'col_s' ].value = Math.random() * 2;	
		}

		//uniforms.sparkMode.value = Math.floor(Math.random()*7);

		_r0 += ( _tr0 - _r0 ) * 0.05;
		_g0 += ( _tg0 - _g0 ) * 0.05;
		_b0 += ( _tb0 - _b0 ) * 0.05;
		_r1 += ( _tr1 - _r1 ) * 0.05;
		_g1 += ( _tg1 - _g1 ) * 0.05;
		_b1 += ( _tb1 - _b1 ) * 0.05;

		uniforms.skyColor.value = new THREE.Color( _r0, _g0, _b0 );
		uniforms.skyColor2.value = new THREE.Color( _r1, _g1, _b1 );

		updateParticle();



	
	}


	function updateParticle()
	{
		var _rad = currentDirection;
		var _sin = Math.sin( _rad );
		var _cos = Math.cos( _rad );

		currentSpeed += ( currentTargetSpeed - currentSpeed ) * 0.1;
		
		currentPoint.x += _cos * currentSpeed * mapScale;
		currentPoint.y += _sin * currentSpeed * mapScale;

		var _list = particle.geometry.vertices;
		var len = _list.length;
		while( len )
		{
			len = (len-1)|0;
			var _x = _list[len].x;
			var _z = _list[len].z;
			var __x = _sin * _x - _cos * _z;
			var __z = _cos * _x + _sin * _z;
			var _value = sn.noise( __x * mapScale + currentPoint.x, __z * mapScale + currentPoint.y);
			var _value0 = sn0.noise( _x * mapScale * 0.01 + currentPoint.x + 1000, _z * mapScale * 0.01 + currentPoint.y + 3000);
			var _value1 = sn0.noise( _x * mapScale * 2.0 + currentPoint.x + 1000, _z * mapScale * 2.0 + currentPoint.y + 3000);

			//_value = _value + _value0;

			_value1 = _value1 * 0.6 + 0.7;
			_value /= _value1;

			_list[len].y = _value * offsetHeight + offsetY;
		}

		particle.geometry.verticesNeedUpdate = true;

		//container.rotation.x += 0.001;
		//container.rotation.y += 0.001;

		particle.material.size += ( 24 - particle.material.size ) * 0.2;


		particle.rotation.y = _rad;

		// if( IsSwipeLeft )
		// {
		// 	rotationSpeed -= 0.0025;
		// } else if( IsSwipeRight )
		// {
		// 	rotationSpeed += 0.0025;
		// }

		rotationSpeed += Math.sin( uniforms.time.value * 0.1 ) * 0.0002

		currentTargetDirection += rotationSpeed;
		rotationSpeed *= 0.96;

		particle.material.size += ( targetSize - particle.material.size ) * 0.06;

		currentDirection += ( currentTargetDirection - currentDirection ) * 0.25;
		currentTargetDirection += ( 0 - currentTargetDirection ) * 0.01;


	}
})();