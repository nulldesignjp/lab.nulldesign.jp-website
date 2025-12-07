/*
	config.js
*/


//	背景色
var _spaceColor = 0x333333;
//	星の色
var _starColor = 0xCCCCCC;

//	流星源、燃焼の色
	var _colorSet = {
		red: {
			c0: new THREE.Color( 1.0, 0.3, 0.0 ),
			c1: new THREE.Color( 1.0, 0.3, 0.0 ),
			c2: new THREE.Color( 1.0, 0.8, 0.5 )
		},
		green: {
			c0: new THREE.Color( 0.0, 1.0, 0.3 ),
			c1: new THREE.Color( 0.3, 1.0, 0.0 ),
			c2: new THREE.Color( 0.8, 1.0, 0.5 )
		},
		blue: {
			c0: new THREE.Color( 0.0, 0.3, 1.0 ),
			c1: new THREE.Color( 0.0, 0.3, 1.0 ),
			c2: new THREE.Color( 0.5, 0.8, 1.0 )
		},
	}

//	燃焼後にどれくらい実物の玉を見せるかタイム
var _displayTime = 2000;	//	ミリ秒