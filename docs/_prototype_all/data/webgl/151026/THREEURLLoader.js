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
			materials[0].morphTargets = true;
			
			var material = new THREE.MeshLambertMaterial();
			// var meshItem = new THREE.Mesh( geometry, material );
			// 	material.shading = THREE.FlatShading;
			// 	material.blending = THREE.NoBlending;
			// 	material.vertexColors = THREE.VertexColors;
			_success( geometry, materials );
		});
	}
	return THREEURLLoader;
})();