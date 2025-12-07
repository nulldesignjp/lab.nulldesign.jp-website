/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		this.list = [];

		//	PROP
		this.world = new world('webglView', true);
		this.world.camera.position.z = 1000;
		this.world.controls.autoRotate = false;

		var _dl = new THREE.DirectionalLight( 0xFFFFFF );
		_dl.position.set(1,1,1);
		this.world.add( _dl );

		//
		var _RGBShiftShader =
		{
			uniforms: {
				"tDiffuse": { type: "t", value: null },
				"amount":   { type: "f", value: 0.005 },
				"angle":    { type: "f", value: 0.0 }
			},
			vertexShader: [
				"varying vec2 vUv;",
				"void main() {",
					"vUv = uv;",
					"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
				"}"
			].join("\n"),
			fragmentShader: [
				"uniform sampler2D tDiffuse;",
				"uniform float amount;",
				"uniform float angle;",
				"varying vec2 vUv;",
				"void main() {",
					"vec2 offset = amount * vec2( cos(angle), sin(angle));",
					"vec4 cr = texture2D(tDiffuse, vUv + offset);",
					"vec4 cga = texture2D(tDiffuse, vUv);",
					"vec4 cb = texture2D(tDiffuse, vUv - offset);",
					"gl_FragColor = vec4(cr.r, cga.g, cb.b, cga.a);",
				"}"
			].join("\n")
		};


		var _effect = new THREE.ShaderPass( _RGBShiftShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		this.world.addPass( _effect );

		_effect.uniforms.amount.value = 0.01;

		var _material = new THREE.ShaderMaterial( {
			uniforms: {
				time: {type:'f',value:0}
			},
			vertexShader: document.getElementById('vertexshader').textContent,
			fragmentShader: document.getElementById('fragmentshader').textContent,
			wireframe: true
   		});

		for( var i = 0; i < 16; i++ )
		{
			var _arr = [];
			for( var j = 0; j < 16; j++ )
			{
				var _x = (Math.random()-.5)*100;
				var _y = (Math.random()-.5)*100;
				var _z = (Math.random()-.5)*100;
				_arr.push( new THREE.Vector3( _x, _y, _z ) );
			}
			var _geometry = new THREE.ConvexGeometry( _arr );
			// var _material = new THREE.MeshPhongMaterial({
			// 	shading: THREE.FlatShading
			// });
			var _mesh = new THREE.Mesh( _geometry, _material );
			_mesh.position.x = (Math.random()-.5)*500;
			_mesh.position.y = (Math.random()-.5)*500;
			_mesh.position.z = (Math.random()-.5)*500;

			this.world.add( _mesh );

		}

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

