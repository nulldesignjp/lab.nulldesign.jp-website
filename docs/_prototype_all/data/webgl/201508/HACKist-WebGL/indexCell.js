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
	}

	indexCell.prototype = 
	{
		init:function()
		{
			var geometry = new THREE.BoxGeometry( this.size, this.size, this.size, 1, 1, 1 );
			var material = new THREE.MeshBasicMaterial({
				color: 0xCCCCCC,
				wireframe:true,
				side: THREE.DoubleSide
			});
			var mesh = new THREE.Mesh(geometry,material);
			
			var _this = this;
			setTimeout(function(){
				var _map = THREE.ImageUtils.loadTexture( _this.images[0], null, function(e){
					mesh.material.map = e;
					mesh.material.wireframe = false;
					mesh.material.needsUpdate = true;

					mesh.scale.set(0,0,0);

					_this.mesh = mesh;

					_this.toOne();
				});
			},Math.random()*500);

	
			//	DOM
			var _html = '<h1>'+this.title+'</h1><p>'+this.description+'</p><time>'+this.date+'</time>';
			var _a = $('<a>').attr('href',this.href);
			var _post = $('<article>').addClass('post');
			_a.html(_html);
			_post.html(_a);

			return {mesh:mesh,dom:_post};
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
				return;
			}

			_t.mesh.scale.set(_scale,_scale,_scale);
			window.requestAnimationFrame(function(){_t.toOne();});
		}
	};

	return indexCell;
})();