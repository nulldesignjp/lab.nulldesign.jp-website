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
			var material = new THREE.MeshLambertMaterial();
			var meshItem = new THREE.Mesh( geometry, material );
				material.shading = THREE.FlatShading;
				material.blending = THREE.NoBlending;
				material.vertexColors = THREE.VertexColors;

			console.log(meshItem)

			// var len = materials.length;
			// for( var i = 0; i < len; i++ )
			// {
			// 	var _material = materials[i];
			// 	_material.shading = THREE.FlatShading;
			// 	_material.blending = THREE.NoBlending;
			// 	_material.vertexColors = THREE.VertexColors;
			// }
			_success( meshItem );

		});
	}
	return THREEURLLoader;
})();