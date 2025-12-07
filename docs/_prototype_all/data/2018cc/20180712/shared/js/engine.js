/*
	engine.js
*/

window.onload = function(){

	var _world,_plane;
	
	$('#siteBody').addClass('open');

	init();
	start();

	function init(){
		_world = new world('webglView');
		_world.controls.autoRotate = false;
		_world.controls.enabled = false;


		var _uniforms = {
			'time': {value:0},
			'mouse': {value: new THREE.Vector2()	},
			'resolution': {value: new THREE.Vector2( window.innerWidth, window.innerHeight )	},
			"image00": { value: new THREE.TextureLoader().load('bg.png')	},
			"image01": { value: undefined	}
		};

		var _material = new THREE.ShaderMaterial({
			uniforms: _uniforms,
			vertexShader:   document.getElementById( 'vertexshader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
			transparent: true
		});

		var _geometry = new THREE.PlaneGeometry(1,1,1,1);

		var _plane = new THREE.Mesh(_geometry,_material);
		_plane.scale.x = window.innerWidth;
		_plane.scale.y = window.innerHeight;
		_world.add( _plane );

		window.addEventListener( 'resize', function(){
			_plane.scale.x = window.innerWidth;
			_plane.scale.y = window.innerHeight;

			_plane.material.uniforms.resolution.value.x = window.innerWidth;
			_plane.material.uniforms.resolution.value.y = window.innerHeight;
		})

		window.addEventListener( 'mousemove', function( e ){
			_plane.material.uniforms.mouse.value.x = e.pageX / window.innerWidth;
			_plane.material.uniforms.mouse.value.y = ( window.innerHeight - e.pageY ) / window.innerHeight;
		});


	}

	function start(){
		loop( 0 );
	}

	function loop( _stepTime ){
		window.requestAnimationFrame( loop );
		_plane.material.uniforms.time.value = _stepTime * 0.001;
	}


}
