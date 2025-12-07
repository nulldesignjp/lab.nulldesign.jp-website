/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		this.obj = [];

		//	CUSTOM
		for( var i = 0; i < 36; i++ )
		{
			var _geometry = new THREE.IcosahedronGeometry(3,1);
			var _material = new THREE.MeshBasicMaterial({
				wireframe:true,
				wireframeLinewidth: 1
			});
			var _box = new THREE.Mesh( _geometry,_material);
			this.world.add( _box );

			var _div = $('<div>').css({
				position: 'fixed',
				left: 0,
				top: 0,
				zIndex: 1000,
				width: '100px',
				height: '100px',
				margin: '-50px 0 0 -50px',
				backgroundColor: 'rgba(255,0,0,0.16)',
				border: '1px solid rgba(255,255,255,0.6)'
			});
			var _t = this;
			var _a = $('<a>').attr('href','#').css({
				display: 'block',
				width: '100%',
				height: '100%',
				color: '#FFF',
				fontFamily: 'Arial',
				textDecoration: 'none',
				fontSize: '12px',
				fontWeight: 'bold'
			}).on('click mouseover',function(){
				var _box = $(this).data('hoge');
				_box.material.color = new THREE.Color( Math.random(),Math.random(),Math.random() );
			});

			_a.data('hoge',_box);


			_div.append(_a);
			$('body').append( _div );

			this.obj[i] = {obj: _box, dom: _div};

		}


		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;

			var len = this.obj.length;
			for( var i = 0; i < len; i++ )
			{
				var _box = this.obj[i].obj;
				var _div = this.obj[i].dom;

				var _time = Date.now() * 0.001 + Math.PI * 2 * i / len;
				_box.position.x = Math.cos( _time ) * 30;
				_box.position.y = Math.sin( _time ) * 30;
				_box.position.z = Math.cos( _time * 0.75 ) * 30;

				_box.rotation.x += 0.01;
				_box.rotation.y += 0.01;

				var _pos = _t.world.getWorldToScreen2D( _box );
				_div.css({
					left: _pos.x + 'px',
					top: _pos.y + 'px'
				});

				_div.find('a').text( Math.floor( _pos.x ) + 'px, ' + Math.floor( _pos.y ) + 'px')
			}


			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

