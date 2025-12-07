/*
	THREEURLLoader.js
	1.0.3
*/

var THREEURLLoader = (function(){
	function THREEURLLoader()
	{
		//	blender -> JSON.
	}
	THREEURLLoader.prototype.load = function( url, _success )
	{
		var _t = this;
		var loader = new THREE.JSONLoader();
		loader.load( url, function ( geometry, materials )
		{
			//var material = new THREE.MeshFaceMaterial( materials );
			//var material = new THREE.MeshLambertMaterial();
			var material = materials[0];
			material.opacity = 1.0 + material.opacity;
			material.shading = THREE.FlatShading;

			var meshItem = new THREE.Mesh( geometry, material );
			_success( meshItem );

		});
	}
	return THREEURLLoader;
})();