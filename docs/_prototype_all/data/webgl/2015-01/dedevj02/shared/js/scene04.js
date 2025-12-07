/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./SimplexNoise.ts" />
var scene04 = (function () {
    function scene04(_camera, _focus, _sky) {
        console.log('scene ' + '%cscene04', 'color: #990000;font: bold 12px sans-serif;');
        var _t = this;
        _t.scene = new THREE.Scene();
        _t.scene.fog = new THREE.Fog(0x000000, 800, 3200);
        _t.container = new THREE.Group();
        _t.scene.add(_t.container);
        _t.camera = _camera;
        _t.focus = _focus;
        _t.sky = _sky;
        //
        // _t.sky.material.vertexShader = document.getElementById( 'floatAndFallsV' ).textContent;
        // _t.sky.material.fragmentShader = document.getElementById( 'floatAndFallsF' ).textContent;
        // _t.sky.material.needsUpdate = true;
        _t.camera.fov = 35;
        _t.camera.near = 0.1;
        _t.camera.far = 6400;
        _t.camera.updateProjectionMatrix();
        _t.rotVector = 0.0;
        _t.count = 0;
        _t.spherelist = [];
        //	FIELD
        var _geom = new THREE.PlaneGeometry(3200 * 5, 3200 * 5, 32, 32);
        var _mate = new THREE.MeshBasicMaterial({
            wireframe: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            opacity: 0.6
        });
        _t.field = new THREE.Mesh(_geom, _mate);
        _t.field.rotation.x = Math.PI * 0.5;
        _t.container.add(_t.field);
        var _moveSpeed = 6;
        var _div = 200;
        var len = 8;
        var _pointList = [];
        for (var i = 0; i < len; i++) {
            _pointList.push(new THREE.Vector3((Math.random() * 2 - 1) * 3200, (Math.random() * 2 - 1) * 6400 + 3200, (Math.random() * 2 - 1) * 3200));
        }
        var curve = new THREE.ClosedSplineCurve3(_pointList);
        var geometry = new THREE.TubeGeometry(curve, _div * len, 20, 8, true, false);
        var material = new THREE.MeshNormalMaterial({
            wireframeLinewidth: 1,
            wireframe: true,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            transparent: true
        });
        _t.mesh = new THREE.Mesh(geometry, material);
        _t.container.add(_t.mesh);
        _t.pointList = curve.getPoints(_div * len * _moveSpeed);
        //	LINES
        _pointList = [];
        for (var j = 0; j < 5; j++) {
            for (var i = 0; i < len; i++) {
                _pointList.push(new THREE.Vector3((Math.random() * 2 - 1) * 6400, (Math.random() * 2 - 1) * 6400 + 3200, (Math.random() * 2 - 1) * 5300));
            }
            var curve = new THREE.ClosedSplineCurve3(_pointList);
            var geometry = new THREE.Geometry();
            geometry.vertices = curve.getPoints(_div * len);
            var material = new THREE.LineBasicMaterial({ linewidth: 2, transparent: true, opacity: 0.5 });
            _t.mesh = new THREE.Line(geometry, material);
            _t.container.add(_t.mesh);
        }
        //	particles
        var _geometry = new THREE.Geometry();
        for (var i = 0; i < 6000; i++) {
            _geometry.vertices[i] = new THREE.Vector3((Math.random() * 2 - 1) * 6400, (Math.random() * 2 - 1) * 3200 + 3200, (Math.random() * 2 - 1) * 6400);
        }
        var _material = new THREE.PointCloudMaterial({
            size: 180,
            transparent: true,
            depthTest: false,
            map: THREE.ImageUtils.loadTexture('./shared/img/spark0.png')
        });
        _t.particle = new THREE.PointCloud(_geometry, _material);
        _t.container.add(_t.particle);
        var _amb = new THREE.AmbientLight(0x333333);
        _t.container.add(_amb);
        var _pl01 = new THREE.PointLight(0xFFFFFF, 3.0, 1600);
        _t.container.add(_pl01);
        _pl01.position.set(0, 800, 0);
        for (var i = 0; i < 4; i++) {
            var _pl00 = new THREE.PointLight(0xFFFFFF, 3.0, 1600);
            _t.container.add(_pl00);
            _pl00.position.set((Math.random() * 2 - 1) * 1600, 600, (Math.random() * 2 - 1) * 1600);
        }
        //	buildings
        // for( var i = 0; i < 600; i++ )
        // {
        // 	var _x = Math.floor( Math.random() * 200 + 1 - 100 ) * 100;
        // 	var _z = Math.floor( Math.random() * 200 + 1 - 100 ) * 100;
        // 	var _s = Math.floor( Math.random() * 3 + 1 ) * 100 - 10;
        // 	var _h = Math.floor( Math.random() * 10 + 1 ) * 300;
        // 	var _geo = new THREE.BoxGeometry( _s, _h, _s, 1, 1, 1 );
        // 	//var _mat = new THREE.MeshBasicMaterial({wireframe:true});
        // 	var _mat = new THREE.MeshLambertMaterial();
        // 	var _box = new THREE.Mesh( _geo, _mat );
        // 	_box.position.set( _x, _h * 0.5, _z );
        // 	_t.container.add( _box );
        // }
        //	buildings
        // for( var i = 0; i < 300; i++ )
        // {
        // 	var _x = Math.floor( Math.random() * 200 + 1 - 100 ) * 100;
        // 	var _z = Math.floor( Math.random() * 200 + 1 - 100 ) * 100;
        // 	var _s = Math.floor( Math.random() * 3 + 1 ) * 100 - 10;
        // 	var _h = Math.floor( Math.random() * 10 + 1 ) * 300;
        // 	var _geo = new THREE.IcosahedronGeometry( _s, 1 );
        // 	//var _mat = new THREE.MeshBasicMaterial({wireframe:true});
        // 	var _mat = new THREE.MeshLambertMaterial({
        // 		shading: THREE.FlatShading
        // 	});
        // 	var _box = new THREE.Mesh( _geo, _mat );
        // 	_box.position.set( _x, _h * 0.5, _z );
        // 	_t.container.add( _box );
        // }
        //	+-1.0
        function rnd() {
            return Math.random() * 2 - 1;
        }
    }
    scene04.prototype.update = function () {
        var _t = this;
        var _len = _t.pointList.length;
        var _current = _t.count;
        var _next = (_current + 1) % _len;
        var _prev = (_current - 1 + _len) % _len;
        var _focus = _t.pointList[_next];
        var _camera = _t.pointList[_prev];
        _t.camera.position.set(_camera.x, _camera.y, _camera.z);
        _t.focus.set(_focus.x, _focus.y, _focus.z);
        _t.mesh.material.opacity = 1.0 - (_t.camera.position.y + 3200) / 6400;
        _t.mesh.material.opacity = _t.mesh.material.opacity < 0.05 ? 0.05 : _t.mesh.material.opacity;
        _t.mesh.material.needsUpdate = true;
        _t.particle.rotation.y += 0.0025;
        _t.count++;
        var len = _t.spherelist.length;
        while (len) {
            len--;
            var _sphere = _t.spherelist[len];
            var _scale = _sphere.scale.x;
            _scale += (1.1 - _scale) * 0.1;
            if (_scale >= 1.0) {
                _t.spherelist.splice(len, 1);
                _t.container.remove(_sphere);
                _sphere.geometry.dispose();
                _sphere.material.dispose();
                _sphere = null;
                continue;
            }
            _sphere.scale.set(_scale, _scale, _scale);
            _sphere.material.opacity = 1.0 - _scale;
        }
    };
    scene04.prototype.interactive = function (_type, _data) {
        var _t = this;
        if (_type == 'kinect') {
            var _isLeft = _data.gestureData.IsSwipeLeft;
            var _isRight = _data.gestureData.IsSwipeRight;
            var _isCharge = _data.gestureData.IsCharge;
            if (_isLeft) {
                _t.rotVector += 0.01;
            }
            if (_isRight) {
                _t.rotVector -= 0.01;
            }
            if (_isCharge) {
            }
        }
    };
    scene04.prototype.effects = function () {
        var _t = this;
        var _s = createSphere();
        _t.container.add(_s);
        _t.spherelist.push(_s);
        _s.position.x = _t.camera.position.x + (Math.random() - .5) * 3200;
        _s.position.y = _t.camera.position.y + (Math.random() - .5) * 3200;
        _s.position.z = _t.camera.position.z + (Math.random() - .5) * 3200;
        function createSphere() {
            var _geo = new THREE.IcosahedronGeometry(3000, 1);
            var _mat = new THREE.MeshBasicMaterial({
                wireframeLinewidth: 5,
                wireframe: true,
                shading: THREE.FlatShading,
                transparent: true,
                side: THREE.DoubleSide
            });
            var _box = new THREE.Mesh(_geo, _mat);
            _box.scale.set(0, 0, 0);
            return _box;
        }
    };
    scene04.prototype.dispose = function () {
        var _t = this;
        kill(_t.scene);
        function kill(e) {
            var len = e.children.length;
            while (len) {
                len--;
                var _target = e.children[len];
                //	再起kill
                if (_target.length) {
                    kill(_target);
                }
                //	mesh kill
                if (_target.geometry) {
                    _target.geometry.dispose();
                }
                ;
                if (_target.material) {
                    _target.material.dispose();
                }
                ;
                if (_target.texture) {
                    _target.texture.dispose();
                }
                ;
                _target.parent.remove(_target);
                _target = null;
            }
            _t.camera = null;
            _t.focus = null;
            _t.sky = null;
            _t.spherelist = null;
        }
    };
    return scene04;
})();
