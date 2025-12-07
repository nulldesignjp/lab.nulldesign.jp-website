var map = (function(){
	function map(){
		this.world;
		this.field;
		this.lat;
		this.lng;
		this.zoom;

		this.grid;
		this.gridSize

		this._mainCanvas;
		this._subCanvas;
		this._mainCtx;
		this._subCtx;
		this._imageList;

		this.dataSet;

		this.api = 'https://api.mapbox.com';;
		this.accessToken = 'pk.eyJ1IjoibnVsbGRlc2lnbiIsImEiOiJjamZrcGdtbnowODdlMndzMmE2ZHc5anlrIn0.fsWuly11P-SWfGz9VntnSg';

		this.isLite;

	}
	map.prototype = {

		init : function(){},
		load : function(){},
		addMaker : function(){},
		removeMaker : function(){},
		addLine : function(){},
		removeLine : function(){}
	};

	return map;
})();


/*
	note:

	var _tt = new TrekTrack();
	_tt.onComplete = function( e ){	console.log('onComplete.execute.', e);	}
	_tt.onError = function( e ){		console.log('onError.execute.', e);	}

	_tt.load( _mountainData, _json, TrekTrack.DisplayMode.MultiView, TrekTrack.SeasonMode.Spring );
*/