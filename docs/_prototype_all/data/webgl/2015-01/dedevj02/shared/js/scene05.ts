/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./SimplexNoise.ts" />
/// <reference path="./WorldVJ.ts" />

class scene05
{
	public scene:any;

	private camera:any;
	private focus:any;
	private sky:any;
	private container:any;

	private sn:any;
	private sn0:any;
	private particle:THREE.PointCloud;
	private IsCharge:boolean;
	private IsSwipeLeft:boolean;
	private IsSwipeRight:boolean;
	private rotationAccell:number;
	private currentPoint:THREE.Vector3;
	private currentDirection:number;
	private currentTargetDirection:number;
	private currentSpeed:number;
	private mapScale:number;
	private offsetY:number;
	private offsetHeight:number;
	private rotationSpeed:number;
	private targetSize:number;

	constructor( _camera, _focus, _sky )
	{
		console.log( 'scene ' + '%cscene05',  'color: #990000;font: bold 12px sans-serif;' );

		var _t = this;
		_t.scene = new THREE.Scene();
		_t.scene.fog = new THREE.Fog( 0x000000, 800, 1600 );

		_t.container = new THREE.Group();
		_t.scene.add( _t.container );

		_t.camera = _camera;
		_t.focus = _focus;
		_t.sky = _sky;

		_t.sn = new SimplexNoise();
		_t.sn0 = new SimplexNoise();
		_t.IsCharge = false;
		_t.IsSwipeLeft = false;
		_t.IsSwipeRight = false;

		_t.rotationAccell = 0.0;
		_t.currentPoint = new THREE.Vector3(0,0,0);
		_t.currentTargetDirection = 0;
		_t.currentDirection = 0;
		_t.currentSpeed = 9.0;
		_t.mapScale = 0.003;
		_t.offsetY = - 50;
		_t.offsetHeight = 50;
		_t.rotationSpeed = 0;
		_t.targetSize = 24;


		var _grid = 64;
		var _scale = 24.0;
		var _geometry = new THREE.Geometry();
		for( var i = 0; i < _grid; i=(i+1)|0 )
		{
			for( var j = 0; j < _grid; j=(j+1)|0 )
			{
				var _vertex = new THREE.Vector3( ( i - _grid * .5 ) * _scale, + _t.offsetY, ( j - _grid * .5 ) * _scale );
				_geometry.vertices.push( _vertex );
				_geometry.colors.push( new THREE.Color(Math.random(),Math.random(),Math.random()));
			}
		}

		var _material = new THREE.PointCloudMaterial({
			size: 24.0,
			transparent: true,
			opacity: 0.8,
			blending: THREE.AdditiveBlending,
			vertexColors:THREE.VertexColors,
			depthTest:      false,
			map: THREE.ImageUtils.loadTexture( './shared/img/sphere04.png' )
		});
		_t.particle = new THREE.PointCloud( _geometry, _material );
		_t.container.add( _t.particle );

		_t.particle.position.z = _t.camera.position.z;


		//	確認用
		var _geo = new THREE.SphereGeometry(1000,32,16);
		var _mat = new THREE.MeshBasicMaterial({color:0xFF0000,wireframe:true});
		var _mes = new THREE.Mesh( _geo, _mat );
		//_t.particle.add( _mes );


		//	+-1.0
		function rnd()
		{
			return Math.random()*2-1;
		}
	}

	public update()
	{
		var _t = this;
		var _rad = _t.currentDirection;
		var _sin = Math.sin( _rad );
		var _cos = Math.cos( _rad );
		_t.currentPoint.x += _cos * _t.currentSpeed * _t.mapScale;
		_t.currentPoint.y += _sin * _t.currentSpeed * _t.mapScale;

		var _list = _t.particle.geometry.vertices;
		var len = _list.length;
		while( len )
		{
			len = (len-1)|0;
			var _x = _list[len].x;
			var _z = _list[len].z;
			var __x = _sin * _x - _cos * _z;
			var __z = _cos * _x + _sin * _z;
			var _value = _t.sn.noise( __x * _t.mapScale + _t.currentPoint.x, __z * _t.mapScale + _t.currentPoint.y);
			var _value0 = _t.sn0.noise( _x * _t.mapScale * 0.01 + _t.currentPoint.x + 1000, _z * _t.mapScale * 0.01 + _t.currentPoint.y + 3000);
			var _value1 = _t.sn0.noise( _x * _t.mapScale * 2.0 + _t.currentPoint.x + 1000, _z * _t.mapScale * 2.0 + _t.currentPoint.y + 3000);

			//_value = _value + _value0;

			_value1 = _value1 * 0.6 + 0.7;
			_value /= _value1;

			_list[len].y = _value * _t.offsetHeight + _t.offsetY;
		}

		_t.particle.geometry.verticesNeedUpdate = true;

		//_t.container.rotation.x += 0.001;
		//_t.container.rotation.y += 0.001;


		_t.particle.rotation.y = _rad;

		if( _t.IsSwipeLeft )
		{
			_t.rotationSpeed -= 0.0025;
		} else if( _t.IsSwipeRight )
		{
			_t.rotationSpeed += 0.0025;
		}
		_t.currentTargetDirection += _t.rotationSpeed;
		_t.rotationSpeed *= 0.96;

		_t.particle.material.size += ( _t.targetSize - _t.particle.material.size ) * 0.06;

		_t.currentDirection += ( _t.currentTargetDirection - _t.currentDirection ) * 0.25;
		_t.currentTargetDirection += ( 0 - _t.currentTargetDirection ) * 0.01;

		_t.container.rotation.z = ( _t.currentTargetDirection - _t.currentDirection ) * 1.25;
		_t.camera.position.y = _t.particle.geometry.vertices[Math.floor(_t.particle.geometry.vertices.length*0.5)].y - _t.offsetY;


	}

	public interactive( _type, _data )
	{
		var _t = this;
		if( _type == 'kinect' )
		{
			var _isLeft = _data.gestureData.IsSwipeLeft;
			var _isRight = _data.gestureData.IsSwipeRight;
			var _isCharge = _data.gestureData.IsCharge;

			_t.IsSwipeLeft = _isLeft;
			_t.IsSwipeRight = _isRight;
			_t.IsCharge = _isCharge;

			if( _isCharge )
			{
				_t.particle.material.size = 128;
				_t.targetSize = 128
			} else {
				_t.targetSize = 24;
			}

			//	
			_t.IsSwipeLeft = _isLeft;
			_t.IsSwipeRight = _isRight;
			_t.IsCharge = _isCharge;

			_t.particle.material.needsUpdate = true;


		}
	}

	public effects()
	{
		var _t = this;
		WorldVJ.uniforms.sparkMode.value = Math.floor( Math.random() * 8 );

		
	}
	
	public dispose()
	{
		var _t = this;
		kill( _t.scene );

		function kill( e )
		{
			var len = e.children.length;
			while( len )
			{
				len --;
				var _target = e.children[len];
				
				//	再起kill
				if( _target.length )
				{
					kill( _target );
				}

				//	mesh kill
				if( _target.geometry ){	_target.geometry.dispose();	};
				if( _target.material ){	_target.material.dispose();	};
				if( _target.texture ){	_target.texture.dispose();	};

				_target.parent.remove( _target );
				_target = null;
			}
			
			_t.camera = null;
			_t.focus = null;
			_t.sky = null;
			_t.sn = null;
			_t.sn0 = null;
			_t.particle = null;
			_t.currentPoint = null;
		}
	}
}