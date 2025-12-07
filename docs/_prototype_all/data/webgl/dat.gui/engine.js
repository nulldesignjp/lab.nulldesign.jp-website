/*
	engine.js
*/
var prop01 = 0;
var prop02 = 0;
var prop03 = 0;
var prop04 = 0;
var message01 = 'message01';
var bool01 = false;
var messageList01 = 'pizza';
var messageObj01 = 0.1;

var speed = 0;
var noiseStrength = 0;

var color0 = "#ffae23"; // CSS string
var color1 = [ 0, 128, 255 ]; // RGB array
var color2 = [ 0, 128, 255, 0.3 ]; // RGB with alpha
var color3 = { h: 350, s: 0.9, v: 0.3 }; // Hue, saturation, value

(function(){
	//	http://learningthreejs.com/blog/2011/08/14/dat-gui-simple-ui-for-demos/
	//	http://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
	

	var gui;
	gui = new dat.GUI();
	gui.close();
	gui.open();

	gui.add( window, 'message01');
	gui.add( window, 'prop01', 0, 10 );
	gui.add( window, 'prop02', 0, 10 );
	gui.add( window, 'prop03', 0, 10 ).name('■ PROP03');
	gui.add( window, 'prop04', 0, 10 ).name('■ PROP04');
	gui.add( window, 'bool01' );
	gui.add( window, 'messageList01',[ 'pizza', 'chrome', 'hooray' ] );
	gui.add( window, 'messageObj01',{ Stopped: 0, Slow: 0.1, Fast: 5 } );
	gui.addColor( window, 'color0');
	gui.addColor( window, 'color1');
	gui.addColor( window, 'color2');
	gui.addColor( window, 'color3');

	var f1 = gui.addFolder('Flow Field');
	f1.add( window, 'speed', 0, 100).listen();
	f1.add( window, 'noiseStrength', 0, 100).listen();
	f1.open();

	var Hoge = function()
	{
		this.value01 = 100;
		this.uniforms = {
			time: {	type: 'f', value: 0}
		};
	}

	var _hoge = new Hoge();
	gui.add( _hoge, 'value01', 0, 100 );
	gui.add( _hoge.uniforms.time, 'value', 0, 100 ).name('time');

	//	UPDATE
	(function render(){
		$('#input00').val( message01 );
		$('#input01').val( prop01 );
		$('#input02').val( prop02 );
		$('#input03').val( prop03 );
		$('#input04').val( prop04 );
		$('#input05').val( bool01 );
		$('#input06').val( messageList01 );
		$('#input07').val( messageObj01 );

		$('#input08').val( speed );
		$('#input09').val( noiseStrength );

		$('#input10').val( color0 );
		$('#input11').val( color1 );
		$('#input12').val( color2 );
		$('#input13').val( 'h: ' + color3.h + ' s:' + color3.s + ' v:' + color3.v );

		$('#input14').val( _hoge.value01 );
		$('#input15').val( _hoge.uniforms.time.value );

		//
		speed = Math.sin( Date.now() * 0.001 ) * 40 + 50;
		noiseStrength = Math.cos( Date.now() * 0.00125 ) * 40 + 50;

		window.requestAnimationFrame(render);
	})();
})();