/*
	engine.js
*/

window.onload = function(){

	//	FadeIn
	$('#siteBody').addClass('open');

	//	Ayersrock/
	var _zoom = 14;
	var _lng = 131.034774;
	var _lat = -25.344255;

	//	Mt. Fuji
	_zoom = 13;
	_lng =　138.727778;
	_lat = 35.360556;

	// _zoom = 14;
	// _lng =　-68.184945;
	// _lat = -19.977621;

	// _zoom = 15;
	// _lng =　54.945207;
	// _lat = 17.34466;


	
	var _tt = new TrekTrack.mapbox.Map( _lat, _lng, _zoom, 'webglView' );
	_tt.onComplete = function( e ){	console.log('onComplete.execute.', e);	}
	_tt.onError = function( e ){		console.log('onError.execute.', e);	}


	//	check
	_tt.onComplete = function(){
		var _geometry = _tt.line.mesh.geometry;
		var _material = new THREE.MeshBasicMaterial({color: 0xFF0000, wireframe: true});
		var _mesh = new THREE.Mesh( _geometry, _material );
		_tt.world.add( _mesh );


		console.log( _tt.field.mesh.position.y )
	}
}





