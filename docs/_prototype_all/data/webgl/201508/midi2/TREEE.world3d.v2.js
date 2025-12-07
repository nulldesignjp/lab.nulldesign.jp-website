/*
	TREEE.world3d.v2.js
*/

var world3d = (function(){
	function world3d( _dom )
	{
		var _width = window.innerWidth;
		var _height = window.innerHeight;
		var _t = this;

		_t.time = 0.0;
		_t.skyColor = 0x1b222c;

		_t.scene = new THREE.Scene();
		_t.scene.fog = new THREE.Fog( _t.skyColor, 400, 1600 );

		_t.focus = new THREE.Vector3( 0, 0, 0 );

		_t.camera = new THREE.PerspectiveCamera( 45, _width / _height, 0.1, 1600);
		_t.camera.position.set(0, 50, 400);
		_t.camera.lookAt(focus);

		_t._camera = new THREE.Vector3( _t.camera.position.x, _t.camera.position.y, _t.camera.position.z );
		_t._focus = new THREE.Vector3( _t.focus.x, _t.focus.y, _t.focus.z );

		_t.renderer = new THREE.WebGLRenderer({ antialias: false });
		_t.renderer.setClearColor( _t.skyColor, 1);
		_t.renderer.setSize(_width, _height);
		_t.renderer.gammaInput = true;
		_t.renderer.gammaOutput = true;
		_t.renderer.autoClear = true;
		_t.renderer.shadowMapEnabled = true;

		//document.getElementById('container')
		_dom.appendChild(_t.renderer.domElement);


		//	event
		window.addEventListener( 'resize', function(e){
			var _width = window.innerWidth;
			var _height = window.innerHeight;
			_t.camera.aspect = _width / _height;
			_t.camera.updateProjectionMatrix();
			_t.renderer.setSize( _width, _height );
		}, false );

		_t.render();
	}

	world3d.prototype.render = function()
	{
		var _t = this;
		_t.time = ( _t.time + 1 )|0;
		_t.camera.lookAt( _t.focus );
		_t.renderer.render( _t.scene, _t.camera );
		_t.update();
		window.requestAnimationFrame( function(){	_t.render();	});
	}

	world3d.prototype.update = function()
	{

	}

	return world3d;
})();