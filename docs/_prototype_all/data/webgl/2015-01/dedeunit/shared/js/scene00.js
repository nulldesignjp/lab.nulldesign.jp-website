/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
var scene00 = (function () {
    function scene00(_camera, _focus, _sky) {
        console.log('scene ' + '%cscene00', 'color: #990000;font: bold 12px sans-serif;');
        var _t = this;
        _t.scene = new THREE.Scene();
        _t.scene.fog = new THREE.Fog(0x000000, 800, 1600);
        _t.container = new THREE.Group();
        _t.scene.add(_t.container);
        _t.camera = _camera;
        _t.focus = _focus;
        _t.sky = _sky;
        var _amb = new THREE.AmbientLight(0x666666);
        _t.container.add(_amb);
        var _p0 = new THREE.PointLight(0x4fe3e3, 2.0, 200);
        _t.container.add(_p0);
        _p0.position.set(-80, -20, 300);
        var _p1 = new THREE.PointLight(0xf659f1, 2.0, 200);
        _t.container.add(_p1);
        _p1.position.set(80, 20, 300);
        var _openmaterial01 = THREE.ImageUtils.loadTexture("shared/img/logo_hackist.png");
        var _geometry = new THREE.PlaneGeometry(360, 360, 1, 1);
        var _material0 = new THREE.MeshLambertMaterial({
            map: _openmaterial01,
            transparent: true,
            side: THREE.DoubleSide,
            color: 0xFFFFFF
        });
        var _openPlane = new THREE.Mesh(_geometry, _material0);
        _t.container.add(_openPlane);
        //	LIGHT
        _t.openRed = new THREE.PointLight(0xCC0000, 3, 1600);
        _t.openGreen = new THREE.PointLight(0x00CC00, 3, 1600);
        _t.openBlue = new THREE.PointLight(0x0000CC, 3, 1600);
        _t.openYellow = new THREE.PointLight(0xFFF000, 3, 1600);
        _t.container.add(_t.openRed);
        _t.container.add(_t.openGreen);
        _t.container.add(_t.openBlue);
        _t.container.add(_t.openYellow);
        _t.createParticles();
    }
    scene00.prototype.createParticles = function () {
        var _t = this;
        var geometry = new THREE.Geometry();
        for (var i = 0; i < 30000; i++) {
            geometry.vertices[i] = new THREE.Vector3(rnd() * 3200, rnd() * 3200, rnd() * 3200);
        }
        var material = new THREE.PointCloudMaterial({
            size: 8.0,
            color: 0xFFFFFF,
            //map: e,
            transparent: true,
            // depthTest:      false,
            // blending:THREE.AdditiveBlending,
            opacity: 0.8
        });
        _t.particle = new THREE.PointCloud(geometry, material);
        _t.container.add(_t.particle);
        function rnd() {
            return Math.random() * 2 - 1;
        }
    };
    scene00.prototype.update = function () {
        var _t = this;
        var _time = Date.now() * 0.0001;
        _t.openRed.position.set(Math.cos(_time) * 1280, Math.cos(_time * 1.5) * 384, 128);
        _t.openGreen.position.set(Math.cos(_time * 1.1) * 1280, -Math.cos(_time * 2.5) * 384, 128);
        _t.openBlue.position.set(-Math.cos(_time * 1.2) * 1280, Math.cos(_time * 3.5) * 384, 128);
        _t.openYellow.position.set(-Math.cos(_time * 0.9) * 1280, -Math.cos(_time * 4.5) * 384, 128);
        _t.particle.rotation.x -= 0.0005;
    };
    scene00.prototype.interactive = function (_type, _data) {
    };
    scene00.prototype.effects = function () {
    };
    scene00.prototype.dispose = function () {
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
        }
    };
    return scene00;
})();
