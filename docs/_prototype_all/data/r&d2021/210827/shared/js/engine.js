4	/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');


		var _f = [];

		for( var i = 0; i < 4; i++ )
		{
			var _uniform = {
				time: { type: 'f', value: 0	},
				scale0: { type: 'f', value: Math.random() * 0.0025	},
				scale1: { type: 'f', value: Math.random() * 0.0025	},
				scale2: { type: 'f', value: Math.random() * 0.0025	},
				sphereColor: { type: 'c', value: new THREE.Color( Math.random() * 0.7 + 0.2,Math.random() * 0.7 + 0.2,Math.random() * 0.7 + 0.2 )},
				mouse: { type: 'v2', value: new THREE.Vector2()	},
				resolution: { type: 'v2', value: new THREE.Vector2()	},
			};

			_uniform.mouse.value.x = 0;
			_uniform.mouse.value.y = 0;
			_uniform.resolution.value.x = window.innerWidth;
			_uniform.resolution.value.y = window.innerHeight;

			var _material = new THREE.ShaderMaterial({
				uniforms: _uniform,
				vertexShader: document.getElementById('vertexshader').textContent,
				fragmentShader: document.getElementById('fragmentshader').textContent,
				transparent: true,
				side: THREE.DoubleSide,
				depthTest: false,
				blending: THREE.AdditiveBlending,
				shading: THREE.SmoothShading
			});

			// var _geometry = new THREE.IcosahedronGeometry(30,4);
			var _geometry = new THREE.SphereGeometry(30,64,32);
			var _box = new THREE.Mesh( _geometry, _material );
			this.world.add( _box );

			_box.rotation.x = Math.random() * Math.PI * 2.0;
			_box.rotation.y = Math.random() * Math.PI * 2.0;
			_box.rotation.z = Math.random() * Math.PI * 2.0;

			_f.push( { uniform: _uniform, mesh: _box} )
		}
		this.list = _f;



		var _t = this;
		setInterval(function(){

			var len = _t.list.length;
			while( len )
			{
				len--;
				var _uniform = _t.list[len].uniform;
				//TweenMax.to(_uniform.time, 0.6 , {value: Math.random() * 256 });
				// TweenMax.to(_uniform.scale0, 0.8 , {value: Math.random() * Math.random() * 0.01, ease: Expo.easeInOut });
				// TweenMax.to(_uniform.scale1, 0.8 , {value: Math.random() * Math.random() * 0.001, ease: Expo.easeInOut });
				// TweenMax.to(_uniform.scale2, 0.8 , {value: Math.random() * Math.random() * 0.1, ease: Expo.easeInOut });
				TweenMax.to(_uniform.scale0, 7.5 , {value: Math.random() * Math.random() * 0.0025, ease: Expo.easeInOut });
				TweenMax.to(_uniform.scale1, 7.5 , {value: Math.random() * Math.random() * 0.0025, ease: Expo.easeInOut });
				TweenMax.to(_uniform.scale2, 7.5 , {value: Math.random() * Math.random() * 0.0025, ease: Expo.easeInOut });
				// TweenMax.to(_uniform.sphereColor.value, 0.8 , {
				// 	r: Math.random()*0.9+0.1,
				// 	g: Math.random()*0.9+0.1,
				// 	b: Math.random()*0.9+0.1,
				// 	ease: Expo.easeInOut
				// });

				// var _box = _t.list[len].mesh;
				// TweenMax.to(_box.rotation, 0.8 , {
				// 	x: _box.rotation.x + Math.random()*Math.PI * 2.0 - Math.PI,
				// 	y: _box.rotation.y + Math.random()*Math.PI * 2.0 - Math.PI,
				// 	z: _box.rotation.z + Math.random()*Math.PI * 2.0 - Math.PI,
				// 	ease: Expo.easeInOut
				// });
			}



		},8000);

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;

			var len = _t.list.length;
			while( len )
			{
				len--;
				_t.list[len].uniform.time.value ++;
			}

			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

