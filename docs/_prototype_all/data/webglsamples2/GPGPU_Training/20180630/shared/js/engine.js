/*
	engine.js
*/

window.onload = function(){

	//	prop
	var _eList = [];
	
	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	_world.camera.position.set( 0, 0, 500 );

	generateEffects();



	loop(0);


	var _main = $('#main');
	// console.log( _main.html() )
	// console.log( _main.width() )
	// console.log( _main.height() )

	var _w = window.innerWidth;
	var _h = window.innerHeight;
	var L = Math.max( _w, _h );

	var _v = [];
	var _c = [];

	for( var i = 0; i < 6; i++ )
	{
		var _rad = i / 6 * Math.PI * 2.0;
		var _x0 = Math.cos( _rad ) * L;
		var _y0 = Math.sin( _rad ) * L;
		var _rad = ( i + 1 ) / 6 * Math.PI * 2.0;
		var _x1 = Math.cos( _rad ) * L;
		var _y1 = Math.sin( _rad ) * L;

		_v.push( 0, 0, 0 );
		_v.push( _x0, _y0, 0 );
		_v.push( _x1, _y1, 0 );

		_c.push( 0, 0, Math.random() * 0.7 + 0.1,  );
		_c.push( 0, 0, Math.random() * 0.7 + 0.1,  );
		_c.push( 0, 0, Math.random() * 0.7 + 0.1,  );
	}

	var _geometry = new THREE.BufferGeometry();
	_geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( _v, 3 ) );
	_geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( _c, 3 ) );

	var _material = new THREE.MeshBasicMaterial({
		vertexColors: THREE.VertexColors
	});
	var _mesh = new THREE.Mesh( _geometry, _material );
	_world.add( _mesh )




	

	// domTextToCanvas(_main.html(), function( _canvas){
	// 	var imagetexture = new THREE.Texture( _canvas );
	// 	imagetexture.needsUpdate = true; 
	// 	var _geometry = new THREE.PlaneGeometry( _canvas.width, _canvas.height, 1, 1 );
	// 	var _material = new THREE.MeshPhongMaterial({
	// 		map: imagetexture,
	// 		transparent: true
	// 	});
	// 	var _mesh = new THREE.Mesh( _geometry, _material );
	// 	_world.add( _mesh );
	// 	console.log('static.')
	// }, {width: 600, height: 600})





	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

	}

	function generateEffects(){
		var _effect = new THREE.ShaderPass( THREE.VignetteShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.intensity.value = 1.0;
		_effect.uniforms.distance.value = 4.0;
		_world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.NoiseShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_effect.uniforms.time.value = 0;
		// _world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.MonoShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		// _world.addPass( _effect );

	}

	function domTextToCanvas( e, _callback, _size )
	{
		var canvas = document.createElement('canvas');
		canvas.width = _size.width;
		canvas.height = _size.height;
		var ctx = canvas.getContext('2d');

		if (!HTMLCanvasElement.prototype.toBlob) {
		   Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
		     value: function (callback, type, quality) {
		       var canvas = this;
		       setTimeout(function() {
		         var binStr = atob( canvas.toDataURL(type, quality).split(',')[1] ),
		         len = binStr.length,
		         arr = new Uint8Array(len);

		         for (var i = 0; i < len; i++ ) {
		            arr[i] = binStr.charCodeAt(i);
		         }

		         callback( new Blob( [arr], {type: type || 'image/png'} ) );
		       });
		     }
		  });
		}

		var data = '<svg xmlns="http://www.w3.org/2000/svg" width="'+_size.width+'" height="'+_size.height+'">' +
		           '<foreignObject width="100%" height="100%">' +
		           '<div xmlns="http://www.w3.org/1999/xhtml" style="font-family: Georgia; color: #FFF;">' +
		             e + 
		           '</div>' +
		           '</foreignObject>' +
		           '</svg>';
		    
		data = encodeURIComponent(data);

		 
		var img = new Image();

		img.onload = function() {
		  ctx.drawImage(img, 0, 0);
		  //console.log(canvas.toDataURL());
		   _callback( canvas );
		 
		  canvas.toBlob(function(blob) {
		     var newImg = document.createElement('img'),
		     url = URL.createObjectURL(blob);

		     newImg.onload = function() {
		     // no longer need to read the blob so it's revoked
		     URL.revokeObjectURL(url);
		     _callback( canvas );
		   	};

		   // newImg.src = url;
		   // document.body.appendChild(newImg);

		   
		});
		}

		img.src = "data:image/svg+xml," + data;
	}
}