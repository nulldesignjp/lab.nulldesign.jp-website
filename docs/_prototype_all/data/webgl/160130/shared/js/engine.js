/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		//	CUSTOM
		var _geometry = new THREE.BoxGeometry(10,10,10,1,1,1);
		var _material = new THREE.MeshBasicMaterial({
			wireframe:true,
			wireframeLinewidth: 2
		});
		this.box = new THREE.Mesh( _geometry,_material);
		this.world.add( this.box );

		this.div = $('<div>').css({
			position: 'fixed',
			left: 0,
			top: 0,
			zIndex: 1000,
			width: '200px',
			height: '200px',
			margin: '-100px 0 0 -100px',
			backgroundColor: 'rgba(255,0,0,0.16)',
			border: '1px solid rgba(255,255,255,0.6)'
		});
		var _t = this;
		var _a = $('<a>').attr('href','#').css({
			display: 'block',
			width: '100%',
			height: '100%',
			color: '#FFF',
			fontFamily: 'Arial'
		}).on('click',function(){
			_t.box.material.color = new THREE.Color( Math.random(),Math.random(),Math.random() );
		});
		this.div.append(_a);

		$('body').append( this.div );



		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;

			var _time = Date.now() * 0.001;
			this.box.position.x = Math.cos( _time ) * 30;
			this.box.position.y = Math.sin( _time ) * 30;
			this.box.position.z = Math.cos( _time * 0.75 ) * 30;

			this.box.rotation.x += 0.01;
			this.box.rotation.y += 0.01;


			var _pos = _t.world.getWorldToScreen2D( _t.box );
			this.div.css({
				left: _pos.x + 'px',
				top: _pos.y + 'px'
			});

			this.div.find('a').text( Math.floor( _pos.x ) + 'px, ' + Math.floor( _pos.y ) + 'px')

			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}



	return Practice;
})();

var _pr = new Practice();

