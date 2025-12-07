/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');
		this.world.camera.position.z = 500;

		var _geometry = new THREE.IcosahedronGeometry( 100, 1 );
		var _material = new THREE.MeshBasicMaterial({color: 0x666666,wireframe:true});
		var _mesh = new THREE.Mesh( _geometry, _material );
		this.world.add( _mesh );



		var root = new THREE.Bone();
		var child = new THREE.Bone();
		var child2 = new THREE.Bone();

		root.add( child );
		child.add( child2 );
		child.position.y = 50;
		child2.position.y = 50;

		this.world.add( root );

		var _t = this;
		var map = new THREE.TextureLoader().load( "shared/img/sample.png", function( texture ){
			for( var i = 0; i < 100; i++ )
			{
                var material = new THREE.SpriteMaterial( { map: texture, color: 0xFFFFFF, fog: true } );
                var sprite = new THREE.Sprite( material );
                _t.world.add( sprite );
                sprite.scale.set(50,50,50);

                var _x = ( Math.random()-.5)*1000;
                var _y = ( Math.random()-.5)*1000;
                var _z = ( Math.random()-.5)*1000;
                sprite.position.set( _x, _y, _z );
			}
		} );


	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );
		}
	}

	return Practice;
})();

var _pr = new Practice();

