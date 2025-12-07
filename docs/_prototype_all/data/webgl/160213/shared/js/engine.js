/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 1000;
		this.world.controls.autoRotate = false;

		var _dl = new THREE.DirectionalLight( 0xFFFFFF );
		_dl.position.set(1,1,1);
		this.world.add( _dl );

		var _uniform = {
			time: {type:'f',value:0},
			resolution: {type:'v2',value:new THREE.Vector2()},
			focus: {type:'f',value:0.0}
		};

		_uniform.resolution.value.x = window.innerWidth;
		_uniform.resolution.value.y = window.innerHeight;

		var _geometry = new THREE.BufferGeometry();

		var len = 100;
		var _pos = new Float32Array( len * 3 );
		for( var i = 0; i < len; i++ )
		{
			_pos[ i * 3 + 0 ] = i % 10 * 10 - 50;
			_pos[ i * 3 + 1 ] = i % 10 * 10 - 50;
			_pos[ i * 3 + 2 ] = i % 10 * 10 - 50;
		}

		//	_pos.addAttribute( 'position', new)


		var _textures = [
			{key: 'a',	value: 'shared/img/CbLCj25UsAARKmV.jpg'},
			{key: 'b',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'c',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'd',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'e',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'f',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'g',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'h',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'i',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'j',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'k',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'l',	value: 'shared/img/IMG_5690.jpg'},
			{key: 'm',	value: 'shared/img/IMG_0612.jpg'},
			{key: 'n',	value: 'shared/img/IMG_5690.jpg'},
		];
		var _loader = new THREE.PreloadTextures( _textures );
		$( _loader ).on( THREE.PreloadTextures.PROGRESS, function(){	console.log( 'PROGRESS', this.loaded, this.total )})
		$( _loader ).on( THREE.PreloadTextures.COMPLETE, function(){	console.log( 'COMPLETE' )})
		$( _loader ).on( THREE.PreloadTextures.ERROR, function(){	console.log( 'ERROR' )})
		_loader.load();



		var _t = this;
		$( _loader ).on( THREE.PreloadTextures.COMPLETE, function(){


		var _geometry = new THREE.PlaneBufferGeometry( _loader.data['a'].image.width, _loader.data['a'].image.height );
		var _material = new THREE.ShaderMaterial({
			uniforms: _uniform,
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			//wireframe: true
		});

		_t.plate = new THREE.Mesh( _geometry, _material );
		_t.world.add( _t.plate );
		
		_uniform.texture = {type:'t',value: _loader.data['a']}
		console.log(_loader.data['a']);

		})

		$('#webglView').addClass('fadeIn');

		this.loop();

	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();

var _pr = new Practice();

