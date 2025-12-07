var postEffect = (function(){
		var _effectList = {
		'81': { shader: THREE.DotScreenShader, init: function(uniforms_){
			var _p = Math.floor( Math.random() * 3 ) + 8;
			var _pow = Math.pow( 2, _p );
			uniforms_.tSize.value = new THREE.Vector2( _pow, _pow );
			uniforms_.angle.value = Math.random() * Math.PI * 2;
			uniforms_.scale.value = Math.random() * 2;
		}, update: function(uniforms_){
		} },
		'87': { shader: THREE.RGBShiftShader, init: function(uniforms_){
			uniforms_.angle.value = Math.random() * Math.PI * 2;
			uniforms_.amount.value = Math.random() * 0.1;
		}, update: function(uniforms_){
			uniforms_.angle.value = Math.random() * Math.PI * 2;
			uniforms_.amount.value = Math.random() * 0.1;
		} },
		'69': { shader: THREE.FilmShader, init: function(uniforms_){
			uniforms_.time.value = 0;
			uniforms_.grayscale.value = 1;
			uniforms_.nIntensity.value = Math.random() * 0.4 + 0.2;
			uniforms_.sIntensity.value = Math.random() * 0.4 + 0.01;

		}, update: function(uniforms_){
			uniforms_.time.value += 1/60;
		} },
		'82': { shader: THREE.HorizontalTiltShiftShader, init: function(uniforms_){}, update: function(uniforms_){} },
		'84': { shader: THREE.VerticalTiltShiftShader, init: function(uniforms_){}, update: function(uniforms_){} },
		'89': { shader: THREE.KaleidoShader, init: function(uniforms_){}, update: function(uniforms_){} },
		'85': { shader: THREE.VignetteShader, init: function(uniforms_){
			uniforms_.offset.value = Math.random();
			uniforms_.darkness.value = Math.random() * 0.4 + 0.6;
		}, update: function(uniforms_){} },
		'73': undefined,
		'79': { shader: THREE.BleachBypassShader, init: function(uniforms_){}, update: function(uniforms_){} },
		'80': { shader: THREE.MirrorShader, init: function(uniforms_){}, update: function(uniforms_){} },

		'65': { shader: ofxNDShaderEffect.convergence, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
			uniforms_.range.value = Math.random();
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random();
			uniforms_.range.value = Math.random();
		} },
		'83': { shader: ofxNDShaderEffect.crHighContrast, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random() * 1;
		} },
		'68': { shader: ofxNDShaderEffect.cut_slider, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random() * 8.0;
			//uniforms_.range.value = Math.random();
		} },
		'70': { shader: ofxNDShaderEffect.glow, init: function(uniforms_){}, update: function(uniforms_){} },
		'71': { shader: ofxNDShaderEffect.invert, init: function(uniforms_){}, update: function(uniforms_){} },
		'72': undefined,
		'74': { shader: ofxNDShaderEffect.outline, init: function(uniforms_){}, update: function(uniforms_){} },
		'75': { shader: ofxNDShaderEffect.shaker, init: function(uniforms_){}, update: function(uniforms_){} },
		'76': { shader: ofxNDShaderEffect.slitscan, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random() * 8.0;
			uniforms_.val1.value = Math.random();
			uniforms_.val2.value = Math.random();
			uniforms_.val3.value = Math.random();
			uniforms_.val4.value = Math.random();
		} },

		'90': { shader: ofxNDShaderEffect.swell, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
			uniforms_.timer.value = 0;
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random() * 30.0;
			uniforms_.timer.value += 1 / 60;
		} },
		'88': { shader: ofxNDShaderEffect.twist, init: function(uniforms_){
			uniforms_.rand.value = Math.random();
			uniforms_.timer.value = 0;
		}, update: function(uniforms_){
			uniforms_.rand.value = Math.random() * 0.0016;
			uniforms_.timer.value += 1 / 60;
			uniforms_.val1.value = Math.random() * 10;
			uniforms_.val2.value = Math.random() * 10;
			uniforms_.val3.value = Math.random() * 10;
			uniforms_.val4.value = Math.random() * 10;
		} },
		'67': { shader: ofxNDShaderEffect.ef01, init: function(uniforms_){
			uniforms_.grid.value = Math.floor( Math.random() * 50 ) + 5;
		}, update: function(uniforms_){
			uniforms_.grid.value = Math.floor( Math.random() * 50 ) + 5;
		} },
		'86': { shader: ofxNDShaderEffect.ef02, init: function(uniforms_){
			uniforms_.time.value = 0;
		}, update: function(uniforms_){
			uniforms_.time.value += 1 / 60;
			uniforms_.grid.value = Math.floor( Math.random() * 30 ) + 5;
		} },
		'66': { shader: ofxNDShaderEffect.ef03, init: function(uniforms_){
			uniforms_.mouse.value.x = Math.random() * window.innerWidth;
			uniforms_.mouse.value.y = Math.random() * window.innerHeight;
			uniforms_.vec.value.x = ( Math.random() - .5 ) * 10;
			uniforms_.vec.value.y = ( Math.random() - .5 ) * 10;
		}, update: function(uniforms_){
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

		} },
		'78': { shader: ofxNDShaderEffect.ef04, init: function(uniforms_){
			uniforms_.mouse.value.x = Math.random() * window.innerWidth;
			uniforms_.mouse.value.y = Math.random() * window.innerHeight;
			uniforms_.vec.value.x = ( Math.random() - .5 ) * 10;
			uniforms_.vec.value.y = ( Math.random() - .5 ) * 10;
		}, update: function(uniforms_){
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

		} },
		'77': { shader: ofxNDShaderEffect.ef07, init: function(uniforms_){
			uniforms_.step.value = Math.floor( Math.random() * 6 ) + 1;
		}, update: function(uniforms_){} },
		'66': { shader: ofxNDShaderEffect.ef08, init: function(uniforms_){
			uniforms_.progress.value = Math.random();
		}, update: function(uniforms_){
			uniforms_.progress.value = Math.sin( new Date().getTime() * 0.001 ) * 0.5 + 0.5;
		} },

		//	chk
		'32': { shader: ofxNDShaderEffect.ef10, init: function(uniforms_){
			uniforms_.time.value = 0.0;
		}, update: function(uniforms_){
			uniforms_.time.value += 1 / 60;
		} }
	};
})();