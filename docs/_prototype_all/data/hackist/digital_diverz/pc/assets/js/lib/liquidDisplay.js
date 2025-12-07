/*
	liquidDisplay.js
*/

function changeMikaChan( _mode )
{
	$( window ).trigger( 'changeBackgroundImage', [ _mode ] );
}

(function(){
	var CanvasDetector = {
	    canCanvas: function () {
	        return !!window.CanvasRenderingContext2D
	    },
	    canWebGL: function () {
	        try {
	            return !!window.WebGLRenderingContext && !!document.createElement( 'canvas' ).getContext( 'experimental-webgl' );
	        } catch( e ) {
	            return false;
	        }
	    }
	};
	if( !CanvasDetector.canWebGL() )
	{
		return false;
	}

	var _ua = navigator.userAgent.toLowerCase();
	_ua = _ua.replace(/ /g, "");
	if(
		_ua.indexOf('iphone')	!= -1 ||
		_ua.indexOf('ipod')		!= -1 ||
		_ua.indexOf('ipad')		!= -1 ||
		_ua.indexOf('android')	!= -1
	)
	{
		location.href = '../sp/';
		return false;
	}

	var _loadedCount = 0;
	var _scenes = [0,0,0,0,0];
	var _current = 0;
	var _images = [
		new THREE.TextureLoader().load( 'assets/img/01.png', _nextStep ),
		new THREE.TextureLoader().load( 'assets/img/02.png', _nextStep ),
		new THREE.TextureLoader().load( 'assets/img/03.png', _nextStep ),
		new THREE.TextureLoader().load( 'assets/img/04.png', _nextStep ),
		new THREE.TextureLoader().load( 'assets/img/05.png', _nextStep )
	];

	function _nextStep( e )
	{
		_loadedCount ++;
		if( _loadedCount >= _images.length )
		{
			_isImageLoaded = true;
			DigitalDiverZ();
		}
	}

	function DigitalDiverZ()
	{
		var renderer,scene,camera,focus,directionalLight,ambientLight,liquidPlane;
		var raycaster,mouse,focusPoint,isClick;
		var friction = 0.99;
		var step = 0;
		var N = 128;
		var N2 = 76;
		var l = 10.0;
		var dt = 0.1;
		var dd = 1.0;
		var v = 4;
		var _resizeKey, _intervalKey;
		N = Math.floor( window.innerWidth / l ) + 4;
		N2 = Math.floor( window.innerHeight / l ) + 4;

		if( !_isImageLoaded ){	l *= 2.0;	}

		var peakPosition = { x: 0, y: 0, z: 0, sigma2: N };
		var restartFlag = false;
		var stopFlag = false;
		var Tn = 3;
		var f = new Array(Tn);

		//	------------------------------------------------
		initialCondition(peakPosition);
		init();
		initObject();
		initRaycast();
		loop();

		//	------------------------------------------------
		function initialCondition(parameter)
		{
			var x0 = parameter.x;
			var y0 = parameter.y;
			var z0 = parameter.z;
			var sigma2 = parameter.sigma2;
			for (var t = 0; t < Tn; t++) {
				f[t] = new Array(N2);
				for (i = 0; i <= N2; i++) {
					f[t][i] = new Array(N);
					for (j = 0; j <= N; j++) {
						var x = (-N2 / 2 + j) * l;
						var y = (-N / 2 + i) * l;
						var z = z0 * Math.exp(-(Math.pow(x-x0, 2) + Math.pow(y-y0, 2)) / (2*sigma2));
						f[0][i][j] = z;
					}
				}
			}
			for (var i = 1; i <= N2 - 1; i++) {
				for (var j = 1; j <= N - 1; j++) {
					f[1][i][j] = f[0][i][j] + v * v / 2.0 * dt * dt / (dd * dd) * (f[0][i + 1][j] + f[0][i - 1][j] + f[0][i][j + 1] + f[0][i][j - 1] - 4.0 * f[0][i][j]);
				}
			}
			for (var i = 1; i <= N2-1; i++) {
				f[1][i][0] = f[1][i][1];
				f[1][i][N] = f[1][i][N - 1];
			}
			for (var i = 1; i <= N-1; i++) {
				f[1][0][i] = f[1][1][i];
				f[1][N2][i] = f[1][N2 - 1][i];
			}
			f[1][0][0] = (f[1][0][1] + f[1][1][0]) / 2;
			f[1][0][N] = (f[1][0][N-1] + f[1][1][N]) / 2;
			f[1][N2][0] = (f[1][N2-1][0] + f[1][N2][1]) / 2;
			f[1][N2][N] = (f[1][N2-1][N] + f[1][N2][N-1]) / 2;
		}

		function init() {
			var width = window.innerWidth;
			var height = window.innerHeight;
			renderer = new THREE.WebGLRenderer({ antialias: true });
			renderer.setClearColor(0x000000);
			renderer.setSize( width, height);
			document.getElementById('container').appendChild(renderer.domElement);

			scene = new THREE.Scene();
			camera = new THREE.OrthographicCamera( - width * .5, width * .5, height * .5, - height * .5, 1, 1600 );
			camera.position.set(0, 0, 100);
			focus = new THREE.Vector3(0,0,0);
			camera.lookAt(focus);
			directionalLight = new THREE.DirectionalLight(0xDDDDDD, 1.0, 0);
			directionalLight.position.set(30, 30, 100);
			ambientLight = new THREE.AmbientLight(0x000000);
			scene.add( ambientLight );
			scene.add( directionalLight );
		}
		function initObject()
		{
			var _geometry = new THREE.PlaneGeometry(N*l,N2*l,N,N2);
			_geometry.computeFaceNormals();
			_geometry.computeVertexNormals();
			var _material;
			if( _isImageLoaded )
			{
				_material = new THREE.ShaderMaterial({
					uniforms: {
						scene: {type:'float',value:_scenes},
						texture: { type: 't', value: _images },
						img: {type:'v2',value: new THREE.Vector2(1024,1024) },
						resolution: { type: 'v2', value: new THREE.Vector2( window.innerWidth, window.innerHeight ) }
					},
					vertexShader: document.getElementById('vertexshader').textContent,
					fragmentShader: document.getElementById('fragmentshader').textContent,
					transparent: true
				});
			} else {
				_material = new THREE.MeshBasicMaterial({
					color: 0x333333,
					wireframe: true
				});
			}
			liquidPlane = new THREE.Mesh( _geometry, _material );
			liquidPlane.castShadow = true;
			liquidPlane.receiveShadow = true;
			scene.add( liquidPlane );

			//	受け
			$( window ).on( 'changeBackgroundImage', function(e, value){
				_current = value;
			})
		}
		function initRaycast()
		{
			raycaster = new THREE.Raycaster();
			mouse = {x:0,y:0};
			focusPoint = null;
			isClick = false;
			window.addEventListener( 'mousedown', onDocumentMouseDown );
			window.addEventListener( 'mouseup', onDocumentMouseUp );
			window.addEventListener( 'mousemove', onDocumentMouseMove );
			window.addEventListener( 'touchstart', onTouchStart );
			window.addEventListener( 'touchmove', onTouchMove );
			window.addEventListener( 'touchend', onTouchEnd );
		}
		function loop() {
			var time = step * dt;
			if (stopFlag == false) {
				step++;
				time = step * dt;
				for (var i = 1; i <= N2 - 1; i++) {
					for (var j = 1; j <= N - 1; j++) {
						f[2][i][j] = 2.0 * f[1][i][j] - f[0][i][j] + v * v * dt * dt / (dd * dd) * (f[1][i + 1][j] + f[1][i - 1][j] + f[1][i][j + 1] + f[1][i][j - 1] - 4.0 * f[1][i][j]);
					}
				}
				for (var i = 1; i <= N2-1; i++) {
					f[2][i][0] = f[2][i][1];
					f[2][i][N] = f[2][i][N - 1];
				}
				for (var i = 1; i <= N-1; i++) {
					f[2][0][i] = f[2][1][i];
					f[2][N2][i] = f[2][N2 - 1][i];
				}
				f[2][0][0] = (f[2][0][1] + f[2][1][0]) / 2;
				f[2][0][N] = (f[2][0][N - 1] + f[2][1][N]) / 2;
				f[2][N2][0] = (f[2][N2 - 1][0] + f[2][N2][1]) / 2;
				f[2][N2][N] = (f[2][N2 - 1][N] + f[2][N2][N - 1]) / 2;

				for (var i = 0; i <= N2; i++) {
					for (var j = 0; j <= N; j++) {
						f[0][i][j] = f[1][i][j];
						f[1][i][j] = f[2][i][j];
						f[1][i][j] *= friction;
					}
				}
			}
			var a =0;
			for (i = 0; i <= N2; i++) {
				for (j = 0; j <= N; j++) {
					var z = f[1][i][j];
					liquidPlane.geometry.vertices[a].z = z;
					a++;
				}
			}

			liquidPlane.geometry.normalsNeedUpdate = true;
			liquidPlane.geometry.verticesNeedUpdate = true;
			liquidPlane.geometry.computeFaceNormals();
			liquidPlane.geometry.computeVertexNormals();

			var len = _scenes.length;
			for( var i = 0; i < len; i++ )
			{
				var _targetOpacity = 0;
				if( i == _current )
				{
					_targetOpacity = 1;
				}
				_scenes[i] += ( _targetOpacity - _scenes[i] ) * 0.1;

			}

			camera.lookAt(focus);
			renderer.render( scene, camera );
			window.requestAnimationFrame(loop);
		}
		function onDocumentMouseDown(e)
		{
			isClick = true;
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
			addFieldPower(16);
		}
		function onDocumentMouseUp(e)
		{
			isClick = false;
		}
		function onDocumentMouseMove(e)
		{
			mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
			addFieldPower(4);
			e.preventDefault();
		}
		function onTouchStart(e)
		{
			isClick = true;
			mouse.x = ( e.touches[0].pageX / window.innerWidth ) * 2 - 1;
			mouse.y = - ( e.touches[0].pageY / window.innerHeight ) * 2 + 1;
			e.preventDefault();
			addFieldPower(16);
		}
		function onTouchMove(e)
		{
			if( isClick )
			{
				mouse.x = ( e.touches[0].pageX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( e.touches[0].pageY / window.innerHeight ) * 2 + 1;
				addFieldPower(4);
			}
			e.preventDefault();
		}
		function onTouchEnd(e)
		{
			if( isClick )
			{
				mouse.x = ( e.touches[0].pageX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( e.touches[0].pageY / window.innerHeight ) * 2 + 1;
				addFieldPower(4);
			}
			e.preventDefault();
		}
		function addFieldPower( _power )
		{
			_power = _power==undefined?1:_power;
			raycaster.setFromCamera( mouse, camera );
			var intersections = raycaster.intersectObjects( [liquidPlane] );
			var intersection = ( intersections.length ) > 0 ? intersections[ 0 ] : null;
			if( intersection !== null )
			{
				focusPoint = intersection.point;
				var _x = Math.floor( focusPoint.x );
				var _y = Math.floor( - focusPoint.y );
				var parameter = { x: _x, y: _y, z: _power, sigma2: 100 };
				var x0 = parameter.x;
				var y0 = parameter.y;
				var z0 = parameter.z;
				var sigma2 = parameter.sigma2;
				for (i = 0; i <= N2; i++) {
					for (j = 0; j <= N; j++) {
						var x = ( - N / 2 + j ) * l;
						var y = ( - N2 / 2 + i ) * l;
						var z = z0 * Math.exp(-(Math.pow(x-x0, 2) + Math.pow(y-y0, 2)) / (2*sigma2));
						f[0][i][j] += z * 1.0;
					}
				}
			}
		}
		window.onresize = function()
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

			if( liquidPlane )
			{
				scene.remove( liquidPlane );
			}

			_scenes = [0,0,0,0,0];

			clearTimeout( _resizeKey );
			_resizeKey = setTimeout( function(){
				l = 10.0;
				N = Math.floor( window.innerWidth / l );
				N2 = Math.floor( window.innerHeight / l );
				var peakPosition = { x: 0, y: 0, z: 0, sigma2: N };

				if( !_isImageLoaded ){	l *= 2.0;	}

				scene.remove( liquidPlane );
				liquidPlane = null;

				initialCondition( peakPosition );
				initObject();

				liquidPlane.material.transparent = true;
				liquidPlane.material.opacity = 0;
				_intervalKey = setInterval(function(){
					liquidPlane.material.opacity += ( 1.0 - liquidPlane.material.opacity ) * 0.03	;
					if( liquidPlane.material.opacity > 0.99 )
					{
						clearInterval( _intervalKey );
						liquidPlane.material.opacity = 1.0;
					}
				},16 );

			}, 400 );
		}
	}
})();


