/*
	THREE.PreloadTextures.js
*/

/*
	arr: [
		{	key: 'name', value: 'url'}
	]
*/


THREE.PreloadTextures = (function(){

	var _stockData = [];
	var _loadedData = [];

	function loader( _array )
	{
		_stockData = _stockData.concat( _array );
		this.data = {};
		this.loaded = 0;
		this.total = _stockData.length;
	}

	loader.PROGRESS = 'THREEPreloadTexturesPROGRESS';
	loader.COMPLETE = 'THREEPreloadTexturesCOMPLETE';
	loader.ERROR = 'THREEPreloadTexturesERROR';

	loader.prototype = 
	{
		load : function()
		{
			this.loaded = 0;
			this.total = _stockData.length;
			this._load();
		},
		_load : function()
		{
			if( _stockData.length )
			{
				var _t = this;
				var _data = _stockData.pop();
				var _loader = new THREE.TextureLoader();
				_loader.load( _data.value,
					function(texture)
					{
						_data.texture = texture;
						_t.data[ _data.key ] = _data.texture;

						_loadedData.push( _data );

						_t.loaded ++;

						if( _stockData.length )
						{
							//	loaded / total
							$( _t ).trigger(loader.PROGRESS);
							_t._load();
							return;
						}

						if( _stockData.length == 0 )
						{
							//	data
							_t.loaded = _t.total;
							$( _t ).trigger(loader.COMPLETE);
							return;
						}
					},
					function()
					{
						//	progress....

					},
					function()
					{
						//	error....
						$( _t ).trigger(loader.ERROR);

						_t.loaded++;

						if( _stockData.length )
						{
							//$( _t ).trigger(loader.PROGRESS);
							_t._load();
							return;
						}

						if( _stockData.length == 0 )
						{
							_t.loaded = _t.total;
							$( _t ).trigger(loader.COMPLETE);
							return;
						}
					}
				)
			}
		}
	}

	//THREE.PreloadTextures.prototype.constructor = loader;

	return loader;
})();

//THREE.PreloadTextures.prototype = Object.create( THREE.Geometry.prototype );
THREE.PreloadTextures.prototype.constructor = THREE.PreloadTextures;