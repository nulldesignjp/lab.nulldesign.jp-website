//	<script src="../js/controls/TrackballControls.js"></script>
(function(istWorld){
	var controls = (function(){
		function main( _camera, _dom )
		{
			this.init(_camera,_dom);
		}

		main.prototype = {
			init	:	function(_camera,_dom)
			{
				this.trackBall = new THREE.TrackballControls( _camera, _dom );
				this.trackBall.screen.width = _dom.clientWidth;
				this.trackBall.screen.height = _dom.clientHeight;
				this.trackBall.screen.offsetLeft = _dom.getBoundingClientRect().left;
				this.trackBall.screen.offsetTop = _dom.getBoundingClientRect().top;
				this.trackBall.noRotate = false;
				this.trackBall.rotateSpeed = 2.0;
				this.trackBall.noZoom = false;
				this.trackBall.zoomSpeed = 1.0;
				this.trackBall.noPan = false;
				this.trackBall.panSpeed = 1.0;
				this.trackBall.target = new THREE.Vector3( 0, 0, 0 );
				this.trackBall.staticMoving = true;
				this.trackBall.dynamicDampingFactor = 0.3;
			},
			update	:	function()
			{
				this.trackBall.update();
			},
			handleResize	:	function()
			{
				this.trackBall.handleResize();
			}
		}

		return main;
	})();
	istWorld.Controls = controls;
})(istWorld||(istWorld={}));
