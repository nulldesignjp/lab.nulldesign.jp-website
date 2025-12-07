/*
	THREEURLLoader.js
*/

var THREEURLLoader = (function(){
	function THREEURLLoader()
	{

	}
	THREEURLLoader.prototype.load = function( url, _success )
	{
		var _t = this;
		var loader = new THREE.JSONLoader();
		loader.load( url, function ( geometry, materials )
		{
			var material = new THREE.MeshFaceMaterial( materials );
			var meshItem = new THREE.Mesh( geometry, material );

			var len = materials.length;
			for( var i = 0; i < len; i++ )
			{
				var _material = materials[i];
				_material.shading = THREE.FlatShading;
				_material.blending = THREE.NoBlending;
			}
			_success( meshItem );

		});
	}
	return THREEURLLoader;
})();