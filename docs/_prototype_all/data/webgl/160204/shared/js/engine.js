/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		this.uniform = {
			time: { type: 'f', value: 0	},
			mouse: { type: 'v2', value: new THREE.Vector2()	},
			resolution: { type: 'v2', value: new THREE.Vector2()	},
		};

		this.uniform.mouse.value.x = 0;
		this.uniform.mouse.value.y = 0;
		this.uniform.resolution.value.x = window.innerWidth;
		this.uniform.resolution.value.y = window.innerHeight;

		var _material = new THREE.ShaderMaterial({
			uniforms: this.uniform,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			transparent: true,
			//side: THREE.DoubleSide
		});

			var r = 100;
			//var _geometry = new THREE.BoxGeometry(r,r,r,1,1,1);
			var _geometry = new THREE.IcosahedronGeometry(30,5);
			this.box = new THREE.Mesh( _geometry, _material );
			this.world.add( this.box );


		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			_t.uniform.time.value ++;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

