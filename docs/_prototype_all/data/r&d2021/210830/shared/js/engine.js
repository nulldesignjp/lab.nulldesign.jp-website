4	/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		function getRandom()
		{
			return Math.random() * 0.8 + 0.2;
		}

		var _uniform = {
			time: { type: 'f', value: 0.0	},
			colors: {	value: [
					new THREE.Color( getRandom(), getRandom(), getRandom() ),
					new THREE.Color( getRandom(), getRandom(), getRandom() ),
					new THREE.Color( getRandom(), getRandom(), getRandom() ),
					new THREE.Color( getRandom(), getRandom(), getRandom() )
				]},
			scale0: { type: 'f', value: Math.random() * 0.0025	},
			scale1: { type: 'f', value: Math.random() * 0.0025	},
			scale2: { type: 'f', value: Math.random() * 0.0025	},

			scale3: { type: 'f', value: Math.random() * 0.0025	},
			scale4: { type: 'f', value: Math.random() * 0.0025	},
			scale5: { type: 'f', value: Math.random() * 0.0025	},

			scale6: { type: 'f', value: Math.random() * 0.0025	},
			scale7: { type: 'f', value: Math.random() * 0.0025	},
			scale8: { type: 'f', value: Math.random() * 0.0025	},

			scale9: { type: 'f', value: Math.random() * 0.0025	},
			scale10: { type: 'f', value: Math.random() * 0.0025	},
			scale11: { type: 'f', value: Math.random() * 0.0025	},

			timeScale: { type: 'f', value: 1.0	},

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
			// shading: THREE.SmoothShading
		});

		// var _geometry = new THREE.IcosahedronGeometry(30,4);
		var _geometry = new THREE.SphereGeometry(30,64,32);
		var _box = new THREE.Mesh( _geometry, _material );
		this.world.add( _box );

		_box.rotation.x = Math.random() * Math.PI * 2.0;
		_box.rotation.y = Math.random() * Math.PI * 2.0;
		_box.rotation.z = Math.random() * Math.PI * 2.0;

		this.uniform = _uniform;




		var _t = this;
		document.addEventListener('keydown', function(e){

			if( e.keyCode != 32 )
			{
				return;
			}

			var _duration = 0.8;
			var _range = 0.0025;
			TweenMax.to(_uniform.scale0, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale1, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale2, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale3, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale4, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale5, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale6, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale7, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale8, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale9, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale10, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
			TweenMax.to(_uniform.scale11, _duration , {value: Math.random() * Math.random() * _range, ease: Expo.easeInOut });
		
		})

		var _cols = {
			'color0': _box.material.uniforms.colors.value[0].clone().multiplyScalar(255),
			'color1': _box.material.uniforms.colors.value[1].clone().multiplyScalar(255),
			'color2': _box.material.uniforms.colors.value[2].clone().multiplyScalar(255),
			'color3': _box.material.uniforms.colors.value[3].clone().multiplyScalar(255)
		}
		var _noise = {
			'scale00': _box.material.uniforms.scale0.value,
			'scale01': _box.material.uniforms.scale1.value,
			'scale02': _box.material.uniforms.scale2.value,
			'scale03': _box.material.uniforms.scale3.value,
			'scale04': _box.material.uniforms.scale4.value,
			'scale05': _box.material.uniforms.scale5.value,
			'scale06': _box.material.uniforms.scale6.value,
			'scale07': _box.material.uniforms.scale7.value,
			'scale08': _box.material.uniforms.scale8.value,
			'scale09': _box.material.uniforms.scale9.value,
			'scale10': _box.material.uniforms.scale10.value,
			'scale11': _box.material.uniforms.scale11.value
		}

		const gui = new dat.GUI();
		const _props0 = gui.addFolder('Color01');
		const _props1 = gui.addFolder('Color02');
		const _props2 = gui.addFolder('Color03');
		const _props3 = gui.addFolder('Color04');

		_props0.addColor( _cols , 'color0' ).onChange(setColor).listen();
		_props1.addColor( _cols , 'color1' ).onChange(setColor).listen();
		_props2.addColor( _cols , 'color2' ).onChange(setColor).listen();
		_props3.addColor( _cols , 'color3' ).onChange(setColor).listen();

		var _range = 0.0025;
		_props0.add(_box.material.uniforms.scale0, 'value', 0.0, _range).name('scale00').listen();
		_props0.add(_box.material.uniforms.scale1, 'value', 0.0, _range).name('scale01').listen();
		_props0.add(_box.material.uniforms.scale2, 'value', 0.0, _range).name('scale02').listen();
		_props1.add(_box.material.uniforms.scale3, 'value', 0.0, _range).name('scale03').listen();
		_props1.add(_box.material.uniforms.scale4, 'value', 0.0, _range).name('scale04').listen();
		_props1.add(_box.material.uniforms.scale5, 'value', 0.0, _range).name('scale05').listen();
		_props2.add(_box.material.uniforms.scale6, 'value', 0.0, _range).name('scale06').listen();
		_props2.add(_box.material.uniforms.scale7, 'value', 0.0, _range).name('scale07').listen();
		_props2.add(_box.material.uniforms.scale8, 'value', 0.0, _range).name('scale08').listen();
		_props3.add(_box.material.uniforms.scale9, 'value', 0.0, _range).name('scale09').listen();
		_props3.add(_box.material.uniforms.scale10, 'value', 0.0, _range).name('scale10').listen();
		_props3.add(_box.material.uniforms.scale11, 'value', 0.0, _range).name('scale11').listen();


		const _propsOther = gui.addFolder('Ather')
		_propsOther.add(_box.material.uniforms.timeScale, 'value', -10.0, 10.0 ).name('timeScale').listen();
		_propsOther.add(_box.material.uniforms.time, 'value', 0.0, 10000.0, 0.1).name('time').listen();

		_props0.open()
		_props1.open()
		_props2.open()
		_props3.open()
		_propsOther.open()


		function setColor()
		{

			_box.material.uniforms.colors.value[0] = new THREE.Color( _cols.color0.r / 255, _cols.color0.g / 255, _cols.color0.b / 255 );
			_box.material.uniforms.colors.value[1] = new THREE.Color( _cols.color1.r / 255, _cols.color1.g / 255, _cols.color1.b / 255 );
			_box.material.uniforms.colors.value[2] = new THREE.Color( _cols.color2.r / 255, _cols.color2.g / 255, _cols.color2.b / 255 );
			_box.material.uniforms.colors.value[3] = new THREE.Color( _cols.color3.r / 255, _cols.color3.g / 255, _cols.color3.b / 255 );
			_box.material.uniformsNeedUpdate = true;
		}

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			this.uniform.time.value += 1.0 * this.uniform.timeScale.value;

			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

