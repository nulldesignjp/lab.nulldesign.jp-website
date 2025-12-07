/*
	engine.js
*/

var Practice = (function(){

	function Practice()
	{
		//	PROP
		this.world = new world('webglView');

		this.vector00 = new THREE.Vector3(rnd()*100,rnd()*100,rnd()*100);
		this.vector01 = new THREE.Vector3(rnd()*100,rnd()*100,rnd()*100);
		this.vector02 = new THREE.Vector3();

		var _material = new THREE.LineBasicMaterial({color:0xCC0000});
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3();
		_geometry.vertices[1] = this.vector00;
		this.vector0 = new THREE.Line( _geometry, _material );

		var _material = new THREE.LineBasicMaterial({color:0x00CC00});
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3();
		_geometry.vertices[1] = this.vector01;
		this.vector1 = new THREE.Line( _geometry, _material );

		var _material = new THREE.LineBasicMaterial({color:0x0000CC});
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3();
		_geometry.vertices[1] = this.vector02;
		this.vector2 = new THREE.Line( _geometry, _material );

		this.world.add( this.vector0 );
		this.world.add( this.vector1 );
		this.world.add( this.vector2 );

		var _gh = new THREE.GridHelper( 100, 10 );
		this.world.add( _gh )


		//	Dot A.B = a1b1+a2b2+a3b3 
		var _dot = 
			this.vector00.x * this.vector01.x + 
			this.vector00.y * this.vector01.y + 
			this.vector00.z * this.vector01.z;

		//	|A|, |B|
		var _length00 = Math.sqrt( this.vector00.x * this.vector00.x + this.vector00.y * this.vector00.y + this.vector00.z * this.vector00.z );
		var _length01 = Math.sqrt( this.vector01.x * this.vector01.x + this.vector01.y * this.vector01.y + this.vector01.z * this.vector01.z );

		//
		//	A.B = a1b1+a2b2+a3b3 = |A||B|cos;
		//	cos = ( a1b1+a2b2+a3b3 ) / |A||B|

		var _cos = _dot / ( _length00 * _length01 );
		var _theta =  Math.acos( _cos ) / Math.PI * 180


		//	CROSS
		this.vector02.x = this.vector00.y * this.vector01.z - this.vector00.z * this.vector01.y;
		this.vector02.y = this.vector00.z * this.vector01.x - this.vector00.x * this.vector01.z;
		this.vector02.z = this.vector00.x * this.vector01.y - this.vector00.y * this.vector01.x;


		//	|A||B|sin = |AxB|
		//	_length00 * _length01 * sin = _length02;
		//	sin = _length02 / ( _length00 * _length01 );
		//	

		var _length02 = Math.sqrt( this.vector02.x * this.vector02.x + this.vector02.y * this.vector02.y + this.vector02.z * this.vector02.z );

		console.log( 'DOT: ', _dot );
		console.log( 'LEN_A: ', _length00 );
		console.log( 'LEN_B: ', _length01 );
		console.log( 'COS: ', _cos );
		console.log( 'THETA: ', _theta );
		console.log( 'THETA to COS: ', Math.cos( _theta / 180 * Math.PI ) );
		console.log( 'CROSS Vec: ', this.vector02.x / _length02, this.vector02.y / _length02, this.vector02.z / _length02 );

		this.loop();
	}

	Practice.prototype = 
	{
		loop : function()
		{
			var _t = this;
			window.requestAnimationFrame( function(){	_t.loop();	} );



		}
	}

	function rnd()
	{
		return Math.random()-.5;
	}

	return Practice;
})();



var _pr = new Practice();

