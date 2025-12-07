/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./scene00.ts" />
/// <reference path="./scene02.ts" />
/// <reference path="./scene04.ts" />
/// <reference path="./scene05.ts" />

//	https://www.youtube.com/watch?v=tq3VsjxING4	

class WorldVJ
{
	public scene:any;
	public scenes:any[] = [scene00,scene02,scene04,scene05];

	private container:any;

	private focus:any;
	private camera:any;
	private renderer:any;

	private sky:any;
	public sceneBG:any;
	private cameraBG:any;
	private skyColor:THREE.Color;
	private skyColorT:THREE.Color;


	private mode:number;

	private rotVector:number = 0;

	public static uniforms:any = {
		time: { 'type': 'f', 'value': 0.0 },
		startTime: { 'type': 'f', 'value': 0.0 },
		sparkMode: { 'type': 'f', 'value': 0.0 },
		resolution: { 'type': 'v2', 'value': new THREE.Vector2() },
		mouse: { 'type': 'v2', 'value': new THREE.Vector2() },
		skyColor: { 'type': 'c', 'value': new THREE.Color( 0x000000 ) },
		skyColor2: { 'type': 'c', 'value': new THREE.Color( 0x000000 ) },
		effect: { 'type': 'f', 'value': 0.0 }
	};

	constructor( _container )
	{
		this.container = _container;
		var _t = this;
		var _width = window.innerWidth;
		var _height = window.innerHeight;

		_t.sceneBG = new THREE.Scene();
		//_t.sceneBG.fog = new THREE.Fog( 0x000000, 800, 1600 );

		//	UNIFORM
		WorldVJ.uniforms.time.value = 0.0;
		WorldVJ.uniforms.startTime.value = 0.0;
		WorldVJ.uniforms.resolution.value.x = window.innerWidth;
		WorldVJ.uniforms.resolution.value.y = window.innerHeight;
		WorldVJ.uniforms.mouse.value.x = 0;
		WorldVJ.uniforms.mouse.value.y = 0;
		WorldVJ.uniforms.effect.value = 0.0;

		//	alert( window.innerWidth + ", " + window.innerHeight );
		//	alert( screen.width + ", " + screen.height );

		_t.skyColor = new THREE.Color(1.0,0.05,0.05);
		_t.skyColorT = new THREE.Color(1.0,0.05,0.05);

		_t.skyColor2 = new THREE.Color(Math.random(),Math.random(),Math.random());
		_t.skyColorT2 = new THREE.Color(Math.random(),Math.random(),Math.random());

		//	FOCUS
		_t.focus = new THREE.Vector3();
		_t.focus.set(0, 0, 0);


		_t.cameraBG = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 30000);
		_t.cameraBG.position.set( 0, 0, 1000 );
		_t.cameraBG.lookAt( _t.focus );

		//	CAMERA
		_t.camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 1600);
		//	_t.camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 1600 );
		_t.camera.position.set( 0, 0, 1000 );
		_t.camera.lookAt( _t.focus );

		//	RENDER
		_t.renderer = new THREE.WebGLRenderer({ antialias: true });
		//_t.renderer.setClearColor(_t.scene.fog.color, 1);
		_t.renderer.setClearColor(0x000000, 1);
		_t.renderer.setSize(_width, _height);
		_t.renderer.gammaInput = true;
		_t.renderer.gammaOutput = true;
		_t.renderer.autoClear = false;

		//	APPEND THREE.JS
		_t.container.appendChild(_t.renderer.domElement);

		_t.rotVector = 0;

		_t.mode = 0;

		//	sky
		_t.createSky();

		//	init scene
		_t.changeScene( 0 );

		//	events....
		_t.addEvents();

		//	start
		_t.update();
	}

	public update()
	{
		var _t = this;

		//	UPDATE CONTENTS
		_t.scene.update();
		_t.cameraBG.position.x = _t.camera.position.x;
		_t.cameraBG.position.y = _t.camera.position.y;
		_t.cameraBG.position.z = _t.camera.position.z;
		_t.cameraBG.rotation.x = _t.camera.rotation.x;
		_t.cameraBG.rotation.y = _t.camera.rotation.y;
		_t.cameraBG.rotation.z = _t.camera.rotation.z;

		//	RENDER
		_t.camera.lookAt(_t.focus);
		_t.cameraBG.lookAt(_t.focus);
		_t.renderer.render(_t.sceneBG, _t.cameraBG);
		_t.renderer.render(_t.scene.scene, _t.camera);

		//	SKY
		WorldVJ.uniforms.time.value += 0.05;

		_t.skyColor.r += ( _t.skyColorT.r - _t.skyColor.r ) * 0.05;
		_t.skyColor.g += ( _t.skyColorT.g - _t.skyColor.g ) * 0.05;
		_t.skyColor.b += ( _t.skyColorT.b - _t.skyColor.b ) * 0.05;
		WorldVJ.uniforms.skyColor.value = _t.skyColor;

		_t.skyColor2.r += ( _t.skyColorT2.r - _t.skyColor2.r ) * 0.02;
		_t.skyColor2.g += ( _t.skyColorT2.g - _t.skyColor2.g ) * 0.02;
		_t.skyColor2.b += ( _t.skyColorT2.b - _t.skyColor2.b ) * 0.02;
		WorldVJ.uniforms.skyColor2.value = _t.skyColor;

		_t.sky.rotation.z += _t.rotVector;
		_t.sky.rotation.z += ( 0 - _t.sky.rotation.z ) * 0.08;

		if( _t.mode == 4 )
		{
			_t.sky.rotation.z = 0;
		}

		WorldVJ.uniforms.effect.value *= 0.96;
		_t.rotVector *= 0.99;


		//	REQUEST LOOP METHOD
		window.requestAnimationFrame(function(){_t.update()});
	}

	public createSky()
	{
		var _t = this;
		var _skyGeo = new THREE.IcosahedronGeometry(24000,1);
		var _skyMat = new THREE.ShaderMaterial({
			uniforms: WorldVJ.uniforms,
			vertexShader: document.getElementById( 'introV' ).textContent,
			fragmentShader: document.getElementById( 'introF' ).textContent,
			side: THREE.DoubleSide,
			transparent: true,
			depthTest: false,
			shading: THREE.SmoothShading
		});
		_t.sky = new THREE.Mesh( _skyGeo, _skyMat );
		_t.sceneBG.add( _t.sky );
	}

	public changeScene( _no )
	{
		var _t = this;
		console.log( 'scene ' + '%c' + _no,  'color: #990000;font: bold 12px sans-serif;' );

		if( _t.scene ){	_t.scene.dispose();	}
		_t.scene = null;

		//	RESET
		_t.focus.set(0, 0, 0);
		_t.camera.position.set( 0, 0, 1000 );
		_t.camera.fov = 35;
		_t.camera.near = 0.1;
		_t.camera.far = 1600;
		_t.camera.updateProjectionMatrix();

		//	NEW
		_t.scene = new _t.scenes[_no]( _t.camera, _t.focus, _t.sky );
		_t.mode = _no;
	}

	public interactive( _type, _data )
	{
		var _t = this;

		//	String to JSON;
		function is(type, obj) {
		    var clas = Object.prototype.toString.call(obj).slice(8, -1);
		    return obj !== undefined && obj !== null && clas === type;
		}
		if( is( "String", _data ) )
		{
			_data = JSON.parse( _data );
		}

		_t.scene.interactive( _type, _data );

		if( _type == 'kinect' )
		{
			var _isLeft = _data.gestureData.IsSwipeLeft;
			var _isRight = _data.gestureData.IsSwipeRight;
			var _isCharge = _data.gestureData.IsCharge;

			if( _isLeft )
			{
				_t.rotVector += 0.05;
			}
			if( _isRight )
			{
				_t.rotVector -= 0.05;
			}
		}
	}

	public effects()
	{
		this.scene.effects();
		//console.log( this.camera, this.cameraBG, this.sky )
	}

	public dispose()
	{
		this.scene.dispose();
	}

	private addEvents()
	{
		var _t = this;

		window.addEventListener( 'resize', function(e:any){
			var _width = window.innerWidth;
			var _height = window.innerHeight;

			if( _t.camera.aspect )
			{
				_t.camera.aspect = _width / _height;
			} else {
				_t.camera.left = - _width * 0.5;
				_t.camera.right = _width * 0.5;
				_t.camera.top = _height * 0.5;
				_t.camera.bottom = - _height * 0.5;
			}
			_t.camera.updateProjectionMatrix();
			_t.renderer.setSize( _width, _height );

			if( _t.cameraBG.aspect )
			{
				_t.cameraBG.aspect = _width / _height;
			} else {
				_t.cameraBG.left = - _width * 0.5;
				_t.cameraBG.right = _width * 0.5;
				_t.cameraBG.top = _height * 0.5;
				_t.cameraBG.bottom = - _height * 0.5;
			}
			_t.cameraBG.updateProjectionMatrix();

			WorldVJ.uniforms.resolution.value.x = window.innerWidth;
			WorldVJ.uniforms.resolution.value.y = window.innerHeight;

		}, false );




		//	PC
		window.addEventListener( 'keydown', function(e:any)
		{
			var _keyCode = e.keyCode;
			console.log( 'keyCode ' + _keyCode );
			_t.keyDown( _keyCode, _t );
			
		}, false );
		window.addEventListener('keyup', function(e){
			_t.interactive( 'kinect', {gestureData:{
				IsSwipeLeft: false,
				IsSwipeRight: false,
				IsCharge: false
			}} );
		});


		//	iPhone / iPad / iPod / Android ....
		$(window).on('touchmove', function(e){
			e.preventDefault();
		});

		$('#scene01').on('mousedown touchend', function(e){
			WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
			_t.blackout2(function(){
				_t.sky.material.vertexShader = document.getElementById( 'as555V' ).textContent;
				_t.sky.material.fragmentShader = document.getElementById( 'as555F' ).textContent;
				_t.sky.material.needsUpdate = true;
			});
			setTimeout( function(){	_t.changeScene(1);	}, 200);
		});

		$('#scene02').on('mousedown touchend', function(e){
			WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
			_t.blackout2(function(){
				_t.sky.material.vertexShader = document.getElementById( 'floatAndFallsV' ).textContent;
				_t.sky.material.fragmentShader = document.getElementById( 'floatAndFallsF' ).textContent;
				_t.sky.material.needsUpdate = true;
			});
			_t.changeScene(2);
		});

		$('#scene03').on('mousedown touchend', function(e){
			WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
			_t.blackout2(function(){
				_t.sky.material.vertexShader = document.getElementById( 'lightWaveV' ).textContent;
				_t.sky.material.fragmentShader = document.getElementById( 'lightWaveF' ).textContent;
				_t.sky.material.needsUpdate = true;
			});
			_t.changeScene(3);
		});

		$('#effect1').on('mousedown touchend', function(e){
			WorldVJ.uniforms.effect.value += 0.1;
			_t.effects();
		});

		$('#effect2').on('mousedown touchend', function(e){
			_t.skyColorT = new THREE.Color(Math.random(),Math.random(),Math.random());
			_t.skyColorT2 = new THREE.Color(Math.random(),Math.random(),Math.random());
			WorldVJ.uniforms.sparkMode.value = Math.floor( Math.random() * 8 );
		});

		$('#kinect01').on('mousedown touchstart', function(e){
			_t.interactive( 'kinect', {gestureData:{
				IsSwipeLeft: true,
				IsSwipeRight: false,
				IsCharge: false
			}} );
		});

		$('#kinect02').on('mousedown touchstart', function(e){
			_t.interactive( 'kinect', {gestureData:{
				IsSwipeLeft: false,
				IsSwipeRight: true,
				IsCharge: false
			}} );
		});

		$('#kinect03').on('mousedown touchstart', function(e){
			_t.interactive( 'kinect', {gestureData:{
				IsSwipeLeft: false,
				IsSwipeRight: false,
				IsCharge: true
			}} );
		});

		$( document ).on( 'touchstart', 'button', function( e ){
			$('#controll button').removeClass();
			$( this ).addClass('touch');
		});
		$( document ).on( 'touchend', 'button', function( e ){
			$('#controll button').removeClass();
		});

		$('#kinect01, #kinect02, #kinect03').on('mouseup touchend', function(e){
			_t.interactive( 'kinect', {gestureData:{
				IsSwipeLeft: false,
				IsSwipeRight: false,
				IsCharge: false
			}} );
		});
	}


	private keyDown( _c:number, _t:any )
	{

		//	kinect
		switch( _c )
		{
			case 37:
				_t.interactive( 'kinect', {gestureData:{
					IsSwipeLeft: true,
					IsSwipeRight: false,
					IsCharge: false
				}} );
				break;
			case 38:
				_t.interactive( 'kinect', {gestureData:{
					IsSwipeLeft: false,
					IsSwipeRight: false,
					IsCharge: true
				}} );
				break;
			case 39:
				_t.interactive( 'kinect', {gestureData:{
					IsSwipeLeft: false,
					IsSwipeRight: true,
					IsCharge: false
				}} );
			case 39:
				_t.interactive( 'kinect', {gestureData:{
					IsSwipeLeft: false,
					IsSwipeRight: false,
					IsCharge: false
				}} );
				break;
		}

		//	EFFECT
		switch( _c )
		{
			case 13:
				_t.skyColorT = new THREE.Color(Math.random(),Math.random(),Math.random());
				_t.skyColorT2 = new THREE.Color(Math.random(),Math.random(),Math.random());
				//	CC
				WorldVJ.uniforms.sparkMode.value = Math.floor( Math.random() * 8 );

				break;
			case 32:
				WorldVJ.uniforms.effect.value += 0.1;
				_t.effects();
				break;
		}
		switch( _c )
		{
			case 49:
				WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
				_t.blackout2(function(){
					_t.sky.material.vertexShader = document.getElementById( 'as555V' ).textContent;
					_t.sky.material.fragmentShader = document.getElementById( 'as555F' ).textContent;
					_t.sky.material.needsUpdate = true;
				});
				setTimeout( function(){	_t.changeScene(1);	}, 200)
				break;
			case 50:
				WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
				_t.blackout(function(){
					_t.sky.material.vertexShader = document.getElementById( 'floatAndFallsV' ).textContent;
					_t.sky.material.fragmentShader = document.getElementById( 'floatAndFallsF' ).textContent;
					_t.sky.material.needsUpdate = true;
				});
				_t.changeScene(2);
				break;
			case 51:
				WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
				_t.blackout(function(){
					_t.sky.material.vertexShader = document.getElementById( 'lightWaveV' ).textContent;
					_t.sky.material.fragmentShader = document.getElementById( 'lightWaveF' ).textContent;
					_t.sky.material.needsUpdate = true;
				});
				_t.changeScene(3);
				break;
		}

	}

	private blackout( _callback )
	{
		//document.getElementById('container').style.webkitFilter = "blur(4px)";
		$('#container').removeClass();
		$('#container').addClass('blackOut');
		setTimeout(function(){
			//document.getElementById('container').style.webkitFilter = "blur(0px)";
			_callback();
			$('#container').addClass('blackIn');
		},200);
	}

	private blackout2( _callback )
	{
		//document.getElementById('container').style.webkitFilter = "blur(4px)";
		$('#container').removeClass();
		$('#container').addClass('blackOut');
		setTimeout(function(){
			//document.getElementById('container').style.webkitFilter = "blur(0px)";
			_callback();
			$('#container').addClass('blackInLong');
		},200);
	}
}

