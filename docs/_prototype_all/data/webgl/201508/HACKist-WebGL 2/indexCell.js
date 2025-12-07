/*
	indexCell.js
*/


var indexCell = (function(){
	function indexCell( _obj )
	{
		this.title = _obj.title;
		this.description = _obj.description;
		this.date = _obj.date;
		this.images = _obj.images;	//	Array
		this.href = _obj.href;
		this.size = _obj.size;

		this.mesh;

		this.init();
	}

	indexCell.prototype = 
	{
		init:function()
		{
			var geometry = new THREE.BoxGeometry( this.size, 4, this.size, 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial({
				color: 0xCCCCCC,
				wireframe:true,
				side: THREE.DoubleSide
			});
			this.mesh = new THREE.Mesh(geometry,material);
			this.mesh.rotation.y = Math.PI * 0.5;
			
			var _t = this;
			setTimeout(function(){
				var _map = THREE.ImageUtils.loadTexture( _t.images[0], null, function(e){
					_t.mesh.material.map = e;
					_t.mesh.material.wireframe = false;
					_t.mesh.material.needsUpdate = true;

					_t.mesh.scale.set(0,0,0);
					_t.toOne();
				});
			},Math.random()*1000);
		},
		toOne:function()
		{
			var _t = this;

			var _scale = _t.mesh.scale.x;

			_scale += ( 1.0 - _scale ) * 0.2;

			if( _scale > 0.996 )
			{
				_scale = 1.0;
				_t.mesh.scale.set(_scale,_scale,_scale);

				// var _scale = Math.floor( Math.random() * 2 ) + 1;
				// _t.mesh.scale.set( _scale, 1.0, _scale );
				// _t.mesh.position.x -= 50 * ( _scale - 1 );
				// _t.mesh.position.z -= 50 * ( _scale - 1 );

				return;
			}

			_t.mesh.scale.set(_scale,_scale,_scale);
			window.requestAnimationFrame(function(){_t.toOne();});
		}
	};

	return indexCell;
})();