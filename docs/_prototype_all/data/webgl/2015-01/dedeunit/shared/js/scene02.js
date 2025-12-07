/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./SimplexNoise.ts" />
var scene02 = (function () {
    function scene02(_camera, _focus, _sky) {
        console.log('scene ' + '%cscene02', 'color: #990000;font: bold 12px sans-serif;');
        var _t = this;
        _t.scene = new THREE.Scene();
        _t.scene.fog = new THREE.Fog(0x000000, 800, 6000);
        _t.container = new THREE.Group();
        _t.scene.add(_t.container);
        _t.camera = _camera;
        _t.focus = _focus;
        _t.sky = _sky;
        _t.convexList = [];
        _t.ref = 0.99;
        //
        _t.camera.fov = 35;
        _t.camera.near = 10;
        _t.camera.far = 6000;
        _t.camera.updateProjectionMatrix();
        var _amb = new THREE.AmbientLight(0x333333);
        _t.scene.add(_amb);
        var _pl0 = new THREE.PointLight(0xFFFFFF, 3.0, 1200);
        _t.scene.add(_pl0);
        var _size = 30;
        //	astroid
        var _material = new THREE.MeshLambertMaterial({ shading: THREE.FlatShading });
        var _wire = new THREE.MeshBasicMaterial({ color: 0x9999FF, wireframe: true, linewidth: 2 });
        var _mesh = createConvex();
        _t.container.add(_mesh);
        _t.convexList.push(_mesh);
        _t.initKey = setInterval(function () {
            if (_t.convexList.length > 512) {
                clearInterval(_t.initKey);
                return;
            }
            var _mesh = createConvex();
            _t.container.add(_mesh);
            _t.convexList.push(_mesh);
        }, 100);
        function createConvex() {
            var _vertices = [];
            for (var j = 0; j < 12; j++) {
                _vertices[j] = new THREE.Vector3(rnd() * _size, rnd() * _size, rnd() * _size);
            }
            var _geometry = new THREE.ConvexGeometry(_vertices);
            var _mesh = new THREE.SceneUtils.createMultiMaterialObject(_geometry, [_material, _wire]);
            //var _mesh = new THREE.Mesh( _geometry, _material );
            _mesh.position.set(rnd() * 1280, rnd() * 1280, rnd() * 1280);
            _mesh.accell = new THREE.Vector3(rnd() * 1.0, rnd() * 1.0, rnd() * 1.0);
            _mesh.vector = new THREE.Vector3(rnd() * 5.0, rnd() * 5.0, rnd() * 5.0);
            _mesh.rotationVector = new THREE.Vector3(rnd() * Math.PI * 0.01, rnd() * Math.PI * 0.01, rnd() * Math.PI * 0.01);
            return _mesh;
        }
        _t.min = 1000;
        _t.max = 3000;
        _t.rotVector = 0;
        //
        _t.intervalKey = setInterval(function () {
            var len = _t.container.children.length;
            while (len) {
                len--;
                var _mesh = _t.container.children[len];
                var _v = Math.random() * 16.0 + 4.0;
                _mesh.vector.x += (Math.random() - .5) * _v;
                _mesh.vector.y += (Math.random() - .5) * _v;
                _mesh.vector.z += (Math.random() - .5) * _v;
            }
        }, 10 * 1000);
        //	+-1.0
        function rnd() {
            return Math.random() * 2 - 1;
        }
        //	EFFECT
        setTimeout(function () {
            $('h1#titleHead').addClass('fadeIn');
        }, 3000);
        setTimeout(function () {
            $('h1#titleHead').removeClass();
            $('h1#titleHead').addClass('fadeOut');
            setTimeout(function () {
                $('h1#titleHead').css('display', 'none');
            }, 4000);
        }, 3000 + 8 * 1000);
    }
    scene02.prototype.update = function () {
        var _t = this;
        var len = _t.container.children.length;
        for (var i = 0; i < len - 1; i++) {
            var _mesh0 = _t.container.children[i];
            for (var j = i + 1; j < len; j++) {
                var _mesh1 = _t.container.children[j];
                var _dx = _mesh0.position.x - _mesh1.position.x;
                var _dy = _mesh0.position.y - _mesh1.position.y;
                var _dz = _mesh0.position.z - _mesh1.position.z;
                var _d = Math.sqrt(_dx * _dx + _dy * _dy + _dz * _dz);
                var _dist = _d < _t.min ? _t.min : _d > _t.max ? _t.max : 0;
                var _accell = 0.01 * 1 / len;
                if (_d < _t.min || _d > _t.max) {
                    var _power = (_d - _dist) * 0.5;
                    var _n = new THREE.Vector3(_dx, _dy, _dz).normalize();
                    _mesh0.vector.x -= _n.x * _power * _accell;
                    _mesh0.vector.y -= _n.y * _power * _accell;
                    _mesh0.vector.z -= _n.z * _power * _accell;
                    _mesh1.vector.x += _n.x * _power * _accell;
                    _mesh1.vector.y += _n.y * _power * _accell;
                    _mesh1.vector.z += _n.z * _power * _accell;
                }
            }
        }
        var _ax = 0;
        var _ay = 0;
        var _az = 0;
        for (var i = 0; i < len; i++) {
            var _mesh = _t.container.children[i];
            _ax += _mesh.vector.x;
            _ay += _mesh.vector.y;
            _az += _mesh.vector.z;
        }
        _ax /= len;
        _ay /= len;
        _az /= len;
        while (len) {
            len--;
            var _mesh = _t.container.children[len];
            if (!_mesh) {
                continue;
            }
            _mesh.rotation.x += _mesh.rotationVector.x;
            _mesh.rotation.y += _mesh.rotationVector.y;
            _mesh.rotation.z += _mesh.rotationVector.z;
            _mesh.position.x += _mesh.vector.x - _ax;
            _mesh.position.y += _mesh.vector.y - _ay;
            _mesh.position.z += _mesh.vector.z - _az;
            _mesh.vector.x *= _t.ref;
            _mesh.vector.y *= _t.ref;
            _mesh.vector.z *= _t.ref;
        }
        _t.container.rotation.x += 0.001;
        _t.container.rotation.z += 0.001;
        _t.container.rotation.y += _t.rotVector;
        _t.rotVector *= 0.99;
        var _theTime = Date.now();
        _t.camera.position.x = Math.cos(_theTime * 0.0001) * 160;
        _t.camera.position.y = Math.sin(_theTime * 0.00024) * 320;
        _t.camera.position.z = Math.sin(_theTime * 0.00002) * 600 + 1200;
        var _x = Math.cos(_theTime * 0.00020) * 160;
        var _y = Math.sin(_theTime * 0.00016) * 320;
        var _z = Math.cos(_theTime * 0.00008) * 160;
        _t.focus.set(_x, _y, _z);
        _t.container.position.x = -Math.cos(_theTime * 0.0001) * 160;
        _t.container.position.y = -Math.sin(_theTime * 0.00046) * 160;
        _t.container.position.z = Math.sin(_theTime * 0.000012) * 160;
        //	KILL AND NEW
        var _stone = _t.convexList[0];
        var _stoneLast = _t.convexList[_t.convexList.length - 1];
        var _scale = _stone.scale.x;
        if (_scale <= 0.1) {
            //_stone.scale.set(1.0,1.0,1.0);
            _stone.position.set(rnd() * 640, rnd() * 640, rnd() * 640);
            _stone.accell = new THREE.Vector3(rnd() * 1.0, rnd() * 1.0, rnd() * 1.0);
            _stone.vector = new THREE.Vector3(rnd() * 5.0, rnd() * 5.0, rnd() * 5.0);
            _stone.rotationVector = new THREE.Vector3(rnd() * Math.PI * 0.01, rnd() * Math.PI * 0.01, rnd() * Math.PI * 0.01);
            _t.convexList.push(_t.convexList.shift());
        }
        else {
            _scale += (0.0 - _scale) * 0.2;
            _stone.scale.set(_scale, _scale, _scale);
            _stoneLast.scale.set(1.0 - _scale, 1.0 - _scale, 1.0 - _scale);
        }
        //	+-1.0
        function rnd() {
            return Math.random() * 2 - 1;
        }
    };
    scene02.prototype.interactive = function (_type, _data) {
        var _t = this;
        if (_type == 'kinect') {
            var _isLeft = _data.gestureData.IsSwipeLeft;
            var _isRight = _data.gestureData.IsSwipeRight;
            var _isCharge = _data.gestureData.IsCharge;
            var _v = _isLeft ? 1 : _isRight ? -1 : 0;
            var len = _t.container.children.length;
            while (len) {
                len--;
                var _mesh = _t.container.children[len];
                var __v = _v * (Math.random() * 16.0 + 4.0);
                _mesh.vector.x += Math.random() * __v * 0.5;
                _mesh.vector.y += (Math.random() - .5) * __v;
                _mesh.vector.z += (Math.random() - .5) * __v;
            }
            if (_isLeft) {
                _t.rotVector -= 0.001;
            }
            if (_isRight) {
                _t.rotVector += 0.001;
            }
            if (_isCharge) {
                _t.min = 60;
                _t.max = 600;
                _t.ref = 0.8;
            }
            else {
                _t.min = 1000;
                _t.max = 3000;
                _t.ref = 0.99;
            }
        }
    };
    scene02.prototype.effects = function () {
        var _t = this;
        var len = _t.container.children.length;
        while (len) {
            len--;
            var _mesh = _t.container.children[len];
            var _v = Math.random() * 16.0 + 4.0;
            _mesh.vector.x += (Math.random() - .5) * _v;
            _mesh.vector.y += (Math.random() - .5) * _v;
            _mesh.vector.z += (Math.random() - .5) * _v;
        }
    };
    scene02.prototype.dispose = function () {
        var _t = this;
        kill(_t.scene);
        clearInterval(_t.initKey);
        clearInterval(_t.intervalKey);
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
            _t.convexList = null;
            $('h1#titleHead').removeClass();
            $('h1#titleHead').css('display', 'none');
        }
    };
    return scene02;
})();
