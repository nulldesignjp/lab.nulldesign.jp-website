/*
	engine.js
*/

window.onload = function(){
	//	FadeIn
	$('#container').addClass('open');

	var _ua = window.navigator.userAgent;
	_ua = _ua.toLowerCase();
	//return;
	if( _ua.indexOf('iphone') != -1 || _ua.indexOf('android') != 1 )
	{
	} else {
		//return;
	}


	var _world = new world('webglView');
	var _titleList = [];
	DomLoad( $('#siteHead h1'), _pseudoTitle );
	DomLoad( $('#profile'), _pseudoTitle );
	DomLoad( $('#contents'), _pseudoTitle );
	DomLoad( $('#sns'), _pseudoTitle );
	DomLoad( $('#awards'), _pseudoTitle );
	DomLoad( $('#siteFoot'), _pseudoTitle );


	loop();

	window.addEventListener( 'resize', function(e){

		var len = _titleList.length;
		while( len )
		{
			len --;
			var _mesh = _titleList[len].mesh;
			var _dom = _titleList[len].dom;

			var _w = _mesh.material.uniforms.texture.value.image.width;
			var _h = _mesh.material.uniforms.texture.value.image.height;
			var _x = _dom.offset().left;
			var _y = _dom.offset().top;
			var _rect = {
				x: _x,
				y: _y,
				width: _w,
				height: _h
			};

			_mesh.position.x = _rect.x + _rect.width * 0.5 - window.innerWidth * 0.5;
			_mesh.position.y = - ( _rect.y + _rect.height * 0.5 - window.innerHeight * 0.5 );

		}
	})

	function loop(){
		window.requestAnimationFrame(loop);

		var len = _titleList.length;
		while( len )
		{
			len --;
			var _title = _titleList[len].mesh;
			_title.material.uniforms.time.value += 1.0 / 60.0;
		}
		
	}

	function DomLoad( e, _callback ){
		var _w = getPow2( ~~e.outerWidth( true ) );
		var _h = getPow2( ~~e.outerHeight( true ) );
		var _x = e.offset().left;
		var _y = e.offset().top;
		var _rect = {
			x: _x,
			y: _y,
			width: _w,
			height: _h
		};

		return html2canvas( e[0],{
			backgroundColor: null,
			width: _w,
			height: _h,
			scale: window.devicePixelRatio
		}).then(canvas => {
			// document.body.appendChild(canvas)
			// $(canvas).css({
			// 	'position':'fixed',
			// 	'z-index':'1000',
			// 	'left':'0',
			// 	'top':'0'
			// });

			e.css({
				'color':'rgba(0,0,0,0.0)',
				'border':'none'
			});
			e.find('a').css({
				'color':'rgba(0,0,0,0.0)'
			});

			_callback( canvas, _rect, e );

		});
	}

	function getPow2( e )
	{
		var _pow = 2;
		while( _pow < e )
		{
			_pow *= 2;
		}
		return _pow;
	}

	function _pseudoTitle(canvas, _rect, _dom ){
			var imagetexture = new THREE.CanvasTexture( canvas );

			var _geometry = new THREE.PlaneGeometry( canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio, 1, 1 );
			// var _material = new THREE.MeshBasicMaterial({
			// 	map: imagetexture,
			// 	transparent: true
			// });

			var _material = new THREE.ShaderMaterial({
				uniforms: {
					time: {value:0},
					resolution: {value: new THREE.Vector2( window.innerWidth, window.innerHeight )},
					texture: {value: imagetexture}
				},
				vertexShader:   document.getElementById( 'vertexShader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentShader' ).textContent,
				transparent: true,
				//blending: THREE.AdditiveBlending
			});

			var _mesh = new THREE.Mesh( _geometry, _material );
			_world.add( _mesh );

			_mesh.position.x = _rect.x + _rect.width * 0.5 - window.innerWidth * 0.5;
			_mesh.position.y = - ( _rect.y + _rect.height * 0.5 - window.innerHeight * 0.5 );

			_material.uniforms.time.value = Math.random()*10;

			_titleList.push({
				dom: _dom,
				mesh: _mesh
			});
	}

}
