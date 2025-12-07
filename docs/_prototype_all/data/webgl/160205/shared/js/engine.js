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
			scale0: { type: 'f', value: 0.1	},
			scale1: { type: 'f', value: 0.01	},
			scale2: { type: 'f', value: 0.001	},
			sphereColor: { type: 'c', value: new THREE.Color( 0.0, 0.6, 0.9 )},
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
			side: THREE.DoubleSide,
			depthTest: false
		});

			var r = 100;
			//var _geometry = new THREE.BoxGeometry(r,r,r,1,1,1);
			var _geometry = new THREE.IcosahedronGeometry(30,5);
			this.box = new THREE.Mesh( _geometry, _material );
			this.world.add( this.box );


		var _t = this;
		setInterval(function(){
			//TweenMax.to(_t.uniform.time, 0.6 , {value: Math.random() * 256 });
			TweenMax.to(_t.uniform.scale0, 0.8 , {value: Math.random() * Math.random() * 0.01, ease: Expo.easeInOut });
			TweenMax.to(_t.uniform.scale1, 0.8 , {value: Math.random() * Math.random() * 0.001, ease: Expo.easeInOut });
			TweenMax.to(_t.uniform.scale2, 0.8 , {value: Math.random() * Math.random() * 0.1, ease: Expo.easeInOut });
			TweenMax.to(_t.uniform.sphereColor.value, 0.8 , {
				r: Math.random()*0.9+0.1,
				g: Math.random()*0.9+0.1,
				b: Math.random()*0.9+0.1,
				ease: Expo.easeInOut
			});
			TweenMax.to(_t.box.rotation, 0.8 , {
				x: _t.box.rotation.x + Math.random()*Math.PI * 2.0 - Math.PI,
				y: _t.box.rotation.y + Math.random()*Math.PI * 2.0 - Math.PI,
				z: _t.box.rotation.z + Math.random()*Math.PI * 2.0 - Math.PI,
				ease: Expo.easeInOut
			});



		},2000);

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

