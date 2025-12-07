/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./SimplexNoise.ts" />

class scene03
{
	public scene:any;

	private camera:any;
	private focus:any;
	private sky:any;
	private container:any;
	
	private spherelist:Array<THREE.Mesh>;
	private linelist:Array<THREE.Line>;
	private trianglelist:Array<THREE.Mesh>;

	private rotVector:number;


	private count:number;


	constructor( _camera, _focus, _sky )
	{
		console.log( 'scene ' + '%cscene03',  'color: #990000;font: bold 12px sans-serif;' );

		var _t = this;
		_t.scene = new THREE.Scene();
		_t.scene.fog = new THREE.Fog( 0x000000, 800, 1600 );

		_t.container = new THREE.Group();
		_t.scene.add( _t.container );

		_t.camera = _camera;
		_t.focus = _focus;
		_t.sky = _sky;

		_t.camera.fov = 24;
		_t.camera.near = 0.1;
		_t.camera.far = 6400;
		_t.camera.updateProjectionMatrix();

		_t.spherelist = [];
		_t.linelist = [];
		_t.trianglelist = [];

		_t.count = 0;

		//
		// _t.sky.material.vertexShader = document.getElementById( 'acidV' ).textContent;
		// _t.sky.material.fragmentShader = document.getElementById( 'acidF' ).textContent;
		// _t.sky.material.needsUpdate = true;

		_t.rotVector = 0;
	}

	private createSphere()
	{
		var _t = this;
		var _g = new THREE.IcosahedronGeometry(Math.random()*1000+100,1);
		var _m = new THREE.MeshNormalMaterial({wireframe:true,wireframeLinewidth:2,transparent:true});
		var _me = new THREE.Mesh( _g, _m );
		_me.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
		_me.scale.set(0,0,0);
		_me.position.set(_t.rnd()*1600,_t.rnd()*384,_t.rnd()*400);
		return _me;
	}

	private createLine()
	{
		var _t = this;
		var _color = new THREE.Color(Math.random(),Math.random(),Math.random());
		var _g = new THREE.Geometry();
		for( var i = 0; i < 100; i++ )
		{
			_g.vertices[i] = new THREE.Vector3(_t.rnd()*3200,_t.rnd()*3200,_t.rnd()*3200);
		}
		var _m = new THREE.LineBasicMaterial({
			linewidth:Math.floor(Math.random()*20+10),
			transparent:true,
			opacity:1.0,
			color:_color,
			blending:THREE.AdditiveBlending});
		var _me = new THREE.Line( _g, _m );
		return _me;
	}

	private rnd()
	{
		return Math.random()*2-1;
	}

	private createTriangle()
	{
		var _size = Math.random()*300+150;
		var _t = this;
		var _geometry = new THREE.Geometry();
		_geometry.vertices[0] = new THREE.Vector3(0,Math.sqrt(3)*.5*_size,0);
		_geometry.vertices[1] = new THREE.Vector3(_size*.5,-Math.sqrt(3)*.5*_size,0);
		_geometry.vertices[2] = new THREE.Vector3(-_size*.5,-Math.sqrt(3)*.5*_size,0);
		var _colors = [];
		_colors[0] = new THREE.Color(Math.random(),Math.random(),Math.random());
		_colors[1] = new THREE.Color(Math.random(),Math.random(),Math.random());
		_colors[2] = new THREE.Color(Math.random(),Math.random(),Math.random());
		//_geometry.faces[0] = new THREE.Face3(0,1,2,null,_colors);
		_geometry.faces[0] = new THREE.Face3(0,1,2);
		_geometry.computeFaceNormals();
		var _material = new THREE.MeshBasicMaterial({
			//color: 0xFFFFFF,
			//vertexColors: THREE.VertexColors,
			color: _colors[0],
			side: THREE.DoubleSide,
			transparent: true,
			blending: THREE.AdditiveBlending
		});
		var _triangle = new THREE.Mesh( _geometry, _material );
		_triangle.vector = new THREE.Vector3(_t.rnd()*10,_t.rnd()*10,_t.rnd()*10);
		_triangle.vectorR = new THREE.Vector3(_t.rnd()*Math.PI*.01,_t.rnd()*Math.PI*.01,_t.rnd()*Math.PI*.01);
		return _triangle;
	}

	public update()
	{
		var _t = this;
		var len = _t.spherelist.length;
		while( len )
		{
			len = (len-1)|0;
			var _sphere = _t.spherelist[len];
			var _scale = _sphere.scale.x;

			_scale += (1.1 - _scale)*0.1;

			if( _scale >= 1.0 )
			{
				_t.spherelist.splice(len,1);
				_t.container.remove( _sphere );
				_sphere.geometry.dispose();
				_sphere.material.dispose();
				_sphere = null;
				continue;
			}

			_sphere.scale.set(_scale,_scale,_scale);
			_sphere.material.opacity = 1.0 - _scale;
			_sphere.material.needsUpdate = true;
		}


		var len = _t.linelist.length;
		while( len )
		{
			len = (len-1)|0;
			var _line = _t.linelist[len];
			var _opacity = _line.material.opacity;

			_opacity += (0.0 - _opacity)*0.05;

			if( _opacity < 0.02 )
			{
				_t.linelist.splice(len,1);
				_t.container.remove( _line );
				_line.geometry.dispose();
				_line.material.dispose();
				_line = null;
				continue;
			}

			_line.material.opacity =  _opacity;
			_line.material.needsUpdate = true;
		}


		var len = _t.trianglelist.length;
		while( len )
		{
			len = (len-1)|0;
			var _triangle = _t.trianglelist[len];
			var _opacity = _triangle.material.opacity;

			_triangle.position.x += _triangle.vector.x;
			_triangle.position.y += _triangle.vector.y;
			_triangle.position.z += _triangle.vector.z;
			_triangle.rotation.x += _triangle.vectorR.x;
			_triangle.rotation.y += _triangle.vectorR.y;
			_triangle.rotation.z += _triangle.vectorR.z;

			_opacity += (0.0 - _opacity)*0.05;

			if( _opacity < 0.02 )
			{
				_t.trianglelist.splice(len,1);
				_t.container.remove( _triangle );
				_triangle.geometry.dispose();
				_triangle.material.dispose();
				_triangle = null;
				continue;
			}

			_triangle.material.opacity =  _opacity;
			_triangle.material.needsUpdate = true;
		}


		_t.container.rotation.y += _t.rotVector;
		_t.rotVector *= 0.99;

		_t.count ++;
	}

	public interactive( _type, _data )
	{
		var _t = this;
		if( _type == 'kinect' )
		{
			var _isLeft = _data.gestureData.IsSwipeLeft;
			var _isRight = _data.gestureData.IsSwipeRight;
			var _isCharge = _data.gestureData.IsCharge;

			if( _isLeft )
			{
				_t.rotVector += 0.01;
			}
			if( _isRight )
			{
				_t.rotVector -= 0.01;
			}
			if( _isCharge && Math.random()<.1 )
			{
				_t.effects();
			}
		}
	}

	public effects()
	{
		var _t = this;
		// var _mesh = _t.createSphere();
		// _t.spherelist.push( _mesh );
		// _t.container.add( _mesh );

		var _line = _t.createLine();
		_t.linelist.push( _line );
		_t.container.add( _line );


		for( var i = 0; i < 3; i = (i+1)|0 )
		{
			var _tr = _t.createTriangle();
			_tr.rotation.set(_t.rnd()*Math.PI,_t.rnd()*Math.PI,_t.rnd()*Math.PI);
			_tr.position.set(_t.rnd()*1600,_t.rnd()*384,_t.rnd()*400);
			_t.trianglelist.push( _tr );
			_t.container.add( _tr );

		}

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

			_t.spherelist = null;
			_t.linelist = null;
			_t.trianglelist = null;
		}
	}
}