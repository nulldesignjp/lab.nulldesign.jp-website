/// <reference path="./DefinitelyTyped-master/jquery/jquery.d.ts" />
/// <reference path="./DefinitelyTyped-master/threejs/three.d.ts" />
/// <reference path="./vector3.ts" />

module metalGearApp
{
	//	module定数/変数
	export var hoge:string = 'ts';
	export var resolution:any = {x:0,y:0};
	export var mouse:any = {x:0,y:0};

	//	参照可能なクラス
	export class main
	{
		public static hoge:number = 0;

		public scene:THREE.Scene;
		public camera:THREE.PerspectiveCamera;
		public focus:THREE.Vector3;
		public renderer:THREE.WebGLRenderer;

		private ground:THREE.Mesh;
		private slist:THREE.Mesh[] = [];

		constructor( _dom )
		{
			var _width = window.innerWidth;
			var _height = window.innerHeight;

			this.scene = new THREE.Scene();
			this.scene.fog = new THREE.Fog( 0xFFFFFF, 150, 1000 );

			this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 1000 );
			//this.camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1000 );
			this.camera.position.set( 0, 1000, 0 );

			this.focus = new THREE.Vector3();
			this.focus.set( 0, 0, 0 );
			this.camera.lookAt( this.focus );

			this.renderer = new THREE.WebGLRenderer( { antialias: false } );
			this.renderer.setClearColor( this.scene.fog.color, 1 );
			this.renderer.setSize( _width, _height );
			this.renderer.gammaInput = true;
			this.renderer.gammaOutput = true;

			_dom.appendChild( this.renderer.domElement );

			this.animate();


			var _this = this;
			window.addEventListener( 'resize', function(e:any){
				var _width = window.innerWidth;
				var _height = window.innerHeight;
				_this.camera.aspect = _width / _height;
				_this.camera.updateProjectionMatrix();
				_this.renderer.setSize( _width, _height );

				metalGearApp.resolution = {x:_width,y:_height};
			}, false );
			window.addEventListener( 'mousemove', function(e:any){
				metalGearApp.mouse.x = e.pageX;
				metalGearApp.mouse.y = e.pageY;
				e.preventDefault();
			}, false );
			window.addEventListener( 'touchmove', function(e:any){
				metalGearApp.mouse.x = e.touches[0].pageX;
				metalGearApp.mouse.y = e.touches[0].pageY;
				e.preventDefault();
			}, false );

			var _alight = new THREE.AmbientLight( 0x999999 );
			this.scene.add( _alight );

			var _light = new THREE.PointLight( 0xFFFFFF, 2, 300 );
			_light.position.set( 0, 100, 0 );
			this.scene.add( _light );


			var _material = new THREE.MeshLambertMaterial({color:0x999999,wireframe:false,shading:THREE.NoShading});
			var _geometry = new THREE.PlaneGeometry( 1600, 1600, 16, 16 );
			this.ground = new THREE.Mesh( _geometry, _material );

			this.ground.rotation.x = - Math.PI * 0.5;

			this.scene.add( this.ground );
			this.camera.position.set( 0, 120, 720 );
			this.camera.lookAt( _this.focus );

			//console.log(this.ground.geometry.vertices);

			var len:number = 32;
			for( var i = 0; i < len; i++ )
			{
				var _geom = new THREE.SphereGeometry(10,3,2);
				var _sphere = new THREE.Mesh( _geom, _material );
				_sphere.position.set( ( i - len * 0.5 ) * 15, 120, 0 );
				this.slist.push( _sphere );
				this.scene.add( _sphere );
			}


			var _size = 2048;

			//	新規要素の作成
			var _audio = new Audio();
			var context = new webkitAudioContext();
			var analyser = context.createAnalyser();
			analyser.fftSize = _size;

			var source = context.createMediaElementSource(_audio);
			source.connect(analyser);
			analyser.connect(context.destination);
			freqAnalyser();

			setInterval(freqAnalyser,1000/60)

			function freqAnalyser()
			{
				//window.requestAnimFrame(freqAnalyser);
				var sum:number;
				var average;
				var bar_width;
				var scaled_average;
				var num_bars = 60;
				var data = new Uint8Array(_size);
				analyser.getByteFrequencyData(data);

				// clear canvas
				var bin_size:number = Math.floor(data.length / num_bars);
				for (var i = 0; i < num_bars; i++ )
				{
					sum = 0;
					for (var j = 0; j < bin_size; j++ )
					{
						sum += data[(i * bin_size) + j];
					}
					average = sum / bin_size;
					scaled_average = (average / 256) * 1.0;

					if( _this.slist[i] )
					{
						var _scale = 2.0;
						_this.slist[i].scale.x = scaled_average * _scale + 0.1;
						_this.slist[i].scale.y = scaled_average * _scale + 0.1;
						_this.slist[i].scale.z = scaled_average * _scale + 0.1;
					}
					
				}


				var spectrums = new Uint8Array(analyser.frequencyBinCount);  // Array size is 1024 (half of FFT size)
		    	analyser.getByteFrequencyData(spectrums);

				for (var i = 0, len = spectrums.length; i < len; i++)
				{
					var x = (i / len) * 1.0;
					var y = (1 - (spectrums[i] / 255)) * 1.0 * 60;

					if( _this.ground.geometry.vertices[i])
					{
			            _this.ground.geometry.vertices[i].z = y;
			        }

				}
				_this.ground.geometry.verticesNeedUpdate = true;
				//_audio.playbackRate = 0.2;
			}


			_audio.addEventListener('ended',function (e:any){
				_audio.currentTime = 0;
				_audio.play();
			},false);

			_audio.addEventListener('canplaythrough',function (e:any){
				_audio.play();
				_audio.volume = 0.1;
			},false);

			_audio.src = '02 名前のない怪物.mp3';
			//_audio.play();
		}

		public animate()
		{
			//requestAnimationFrame( this.animate );
			//this.render();

			var _this = this;
			setInterval(function(){
				_this.render();
				_this.engine();
			},1000/60);
		}
		public render()
		{
			var _this = this;
			_this.camera.lookAt( _this.focus );
			_this.renderer.render( _this.scene, _this.camera );
		}
		public engine()
		{
		}
	}

	//	参照できないクラス
	class sub
	{
		constructor()
		{
			$( window ).on( 'click', function(e:any){
				var _x:number = e.originalEvent.pageX;
				var _y:number = e.originalEvent.pageY;
				console.log( _x, _y );
			});
		}
	}
}

var _t = new metalGearApp.main( document.getElementById('container') );