/*
	engine.js
*/

window.onload = function(){

	//	FadeIn
	$('#siteBody').addClass('open');
	var _world = new world('webglView');
	// _world.controls.enabled = false;
	// _world.controls.autoRotate = false;
	_world.camera.position.set( 0, 0, 100 );
	generateEffects();

	var _path = '../polyhedrons_obj/';
	var _models = ['a03.obj','a04.obj','a05.obj','a06.obj','a07.obj','a08.obj','a09.obj','a10.obj','n01.obj','n02.obj','n03.obj','n04.obj','n05.obj','n06.obj','n07.obj','n08.obj','n09.obj','n10.obj','n11.obj','n12.obj','n13.obj','n14.obj','n15.obj','n16.obj','n17.obj','n18.obj','n19.obj','n20.obj','n21.obj','n22.obj','n23.obj','n24.obj','n25.obj','n26.obj','n27.obj','n28.obj','n29.obj','n30.obj','n31.obj','n32.obj','n33.obj','n34.obj','n35.obj','n36.obj','n37.obj','n38.obj','n39.obj','n40.obj','n41.obj','n42.obj','n43.obj','n44L.obj','n44R.obj','n45L.obj','n45R.obj','n46L.obj','n46R.obj','n47L.obj','n47R.obj','n48L.obj','n48R.obj','n49.obj','n50.obj','n51.obj','n52.obj','n53.obj','n54.obj','n55.obj','n56.obj','n57.obj','n58.obj','n59.obj','n60.obj','n61.obj','n62.obj','n63.obj','n64.obj','n65.obj','n66.obj','n67.obj','n68.obj','n69.obj','n70.obj','n71.obj','n72.obj','n73.obj','n74.obj','n75.obj','n76.obj','n77.obj','n78.obj','n79.obj','n80.obj','n81.obj','n82.obj','n83.obj','n84.obj','n85.obj','n86.obj','n87.obj','n88.obj','n89.obj','n90.obj','n91.obj','n92.obj','p03.obj','p04.obj','p05.obj','p06.obj','p07.obj','p08.obj','p09.obj','p10.obj','r01.obj','r02.obj','r03.obj','r04.obj','r05.obj','s01.obj','s02.obj','s03.obj','s04.obj','s05.obj','s06.obj','s07.obj','s08.obj','s09.obj','s10.obj','s11.obj','s12L.obj','s12R.obj','s13L.obj','s13R.obj',	];
	var _boxList = [];

	load( _models[0] );

	loop(0);

	load( _models.pop() )

	function load( _fileName ){
		var _loader = new THREE.OBJLoader();
		_loader.load(
		_path + _fileName,
		function(e){
			//	success
			var _core = e.children[0];

			var _geometry = new THREE.BoxGeometry( 5, 5, 5, 1, 1, 1 );
			var _material = new THREE.MeshBasicMaterial({
				wireframe: true,
				transparent: true,
				opacity: 0.6
			});
			var _box0 = new THREE.Mesh( _geometry, _material );
			_world.add( _box0 );

			var _material = new THREE.MeshPhongMaterial({
				transparent: true,
				opacity: 0.2
			});
			var _box1 = new THREE.Mesh( _geometry, _material );
			_box0.add( _box1 );
			_box0.add( _core );

			_box0.position.x = Math.random() * 100 - 50;
			_box0.position.y = Math.random() * 100 - 50;
			_box0.position.z = Math.random() * 100 - 50;

			_boxList.push( _box0 );

			_nextStep();
		},
		function(e){
			//	progress
			console.log(e)
		},
		function(err){
			//	err
			_nextStep();
		});
	}

	function _nextStep(){
		if( _models.length )
		{
			load( _models.pop() );
		}
	}

	/*
		functions
	*/
	function loop( _stepTime ){
		window.requestAnimationFrame( loop );

	}

	function generateEffects(){

		// var _effect = new THREE.ShaderPass( THREE.VignetteShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _effect.uniforms.intensity.value = 1.0;
		// _effect.uniforms.distance.value = 4.0;
		// _world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.NoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _effect.uniforms.time.value = 0;
		// _world.addPass( _effect );

		// var _effect = new THREE.ShaderPass( THREE.LineNoiseShader );
		// _effect.enabled = true;
		// _effect.renderToScreen = false;
		// _world.addPass( _effect );

		var _effect = new THREE.ShaderPass( THREE.BloomShader );
		_effect.enabled = true;
		_effect.renderToScreen = false;
		_world.addPass( _effect );
	}

}
