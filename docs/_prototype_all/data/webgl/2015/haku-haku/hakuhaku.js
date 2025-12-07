/// <reference path="./DefinitelyTyped-master/jquery/jquery.d.ts" />
/// <reference path="./DefinitelyTyped-master/threejs/three.d.ts" />
/// <reference path="./vector3.ts" />
var hakuhaku;
(function (hakuhaku) {
    //	module定数/変数
    hakuhaku.hoge = 'ts';
    hakuhaku.resolution = { x: 0, y: 0 };
    hakuhaku.mouse = { x: 0, y: 0 };
    //	参照可能なクラス
    var main = (function () {
        function main(_dom) {
            var _width = window.innerWidth;
            var _height = window.innerHeight;
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0x000000, 500, 3000);
            this.camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 3000);
            //this.camera = new THREE.OrthographicCamera( _width / - 2, _width / 2, _height / 2, _height / - 2, 1, 1000 );
            this.camera.position.set(0, 0, 900);
            this.focus = new THREE.Vector3();
            this.focus.set(0, 0, 0);
            this.camera.lookAt(this.focus);
            this.renderer = new THREE.WebGLRenderer({ antialias: false });
            this.renderer.setClearColor(this.scene.fog.color, 1);
            this.renderer.setSize(_width, _height);
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            _dom.appendChild(this.renderer.domElement);
            var _this = this;
            window.addEventListener('resize', function (e) {
                var _width = window.innerWidth;
                var _height = window.innerHeight;
                _this.camera.aspect = _width / _height;
                _this.camera.updateProjectionMatrix();
                _this.renderer.setSize(_width, _height);
                hakuhaku.resolution = { x: _width, y: _height };
            }, false);
            window.addEventListener('mousemove', function (e) {
                hakuhaku.mouse.x = e.pageX;
                hakuhaku.mouse.y = e.pageY;
                e.preventDefault();
            }, false);
            window.addEventListener('touchmove', function (e) {
                hakuhaku.mouse.x = e.touches[0].pageX;
                hakuhaku.mouse.y = e.touches[0].pageY;
                e.preventDefault();
            }, false);
            this.lights = {};
            var _alight = new THREE.AmbientLight(0x181818);
            this.scene.add(_alight);
            var _plight = new THREE.PointLight(0xFFFFFF, 0.5, 1200);
            _plight.intensity = 0.75;
            _plight.position.set(0, 0, 400);
            this.scene.add(_plight);
            var _dlight = new THREE.DirectionalLight(0xFFFFFF);
            _dlight.intensity = 0.5;
            _dlight.position.set(1, 1, 1);
            this.scene.add(_dlight);
            var _slight = new THREE.SpotLight(0xFFFFFF);
            _slight.position.set(160, 160, 160);
            _slight.distance = 1600;
            _slight.intensity = 1;
            this.scene.add(_slight);
            //_slight.castShadow = true;
            //_slight.shadowDarkness = 0.5;
            //_slight.shadowMapWidth = 1024;	//default: 512
            //_slight.shadowMapHeight = 1024;
            this.lights['ambient'] = _alight;
            this.lights['point'] = _plight;
            this.lights['directional'] = _dlight;
            this.lights['spot'] = _slight;
            this.count = 0;
            //	横分割数
            var n = 80;
            //	GROUND
            var _material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, wireframe: false, shading: THREE.NoShading, vertexColors: THREE.FaceColors });
            var _geometry = new THREE.PlaneGeometry(3200, 1600, n, n / 2);
            this.ground = new THREE.Mesh(_geometry, _material);
            this.scene.add(this.ground);
            this.createLines(n);
            this.stepTimer();
            this.animate();
        }
        main.prototype.animate = function () {
            //requestAnimationFrame( this.animate );
            //this.render();
            var _this = this;
            setInterval(function () {
                _this.render();
                _this.engine();
            }, 1000 / 60);
        };
        main.prototype.render = function () {
            var _this = this;
            _this.camera.lookAt(_this.focus);
            _this.renderer.render(_this.scene, _this.camera);
        };
        main.prototype.engine = function () {
            var len = this.ground.geometry.vertices.length;
            for (var i = 0; i < len; i++) {
                this.ground.geometry.vertices[i].z += (0 - this.ground.geometry.vertices[i].z) * 0.025;
                if (this.count == 6) {
                    var _this = this;
                    var _size = 80;
                    var _zoom = 0.00125;
                    //_zoom *= 0.5;
                    var simplexNoise = new SimplexNoise();
                    var len = _this.ground.geometry.vertices.length;
                    for (var i = 0; i < len; i++) {
                        var _value = simplexNoise.noise((_this.ground.geometry.vertices[i].x + 10000) * _zoom, (_this.ground.geometry.vertices[i].y + 10000) * _zoom);
                        _value *= _size;
                        _this.ground.geometry.vertices[i].z = _value;
                    }
                }
            }
            //this.ground.geometry.computeVertexNormals();
            this.ground.geometry.computeFaceNormals();
            this.ground.geometry.verticesNeedUpdate = true;
            this.ground.geometry.normalsNeedUpdate = true;
        };
        main.prototype.stepTimer = function () {
            var _this = this;
            setInterval(function () {
                var _size = 160;
                var _zoom = 0.00125;
                //_zoom *= 0.5;
                var simplexNoise = new SimplexNoise();
                var len = _this.ground.geometry.vertices.length;
                for (var i = 0; i < len; i++) {
                    var _value = simplexNoise.noise((_this.ground.geometry.vertices[i].x + 10000) * _zoom, (_this.ground.geometry.vertices[i].y + 10000) * _zoom);
                    _value *= _size;
                    _this.ground.geometry.vertices[i].z += _value;
                }
                _this.count++;
                if (_this.count % 7 == 0) {
                    _this.lights['point'].color.set(new THREE.Color(Math.random(), Math.random(), Math.random()));
                    _this.count = 0;
                }
            }, 1000);
        };
        main.prototype.createLines = function (n) {
            var _blocklist = [
                -1,
                0,
                3,
                11,
                12,
                n * 2 - 3,
                n * 2 - 2,
                n * 2 + 1,
                n * 2 + 2,
                n * 2 + 5,
                n * 2 + 6,
                n * 2 + 9,
                n * 2 + 10,
                n * 2 + 17,
                n * 2 + 18,
                n * 4 - 5,
                n * 4 - 4,
                n * 4 - 1,
                n * 4,
                n * 4 + 3,
                n * 4 + 4,
                n * 4 + 7,
                n * 4 + 8,
                n * 4 + 11,
                n * 4 + 12,
                n * 4 + 15,
                n * 4 + 16
            ];
            var _s = (n * 2) * Math.floor(((n / 2) - 3) * 0.5) + n - 12 * 0.5 - 2;
            for (var i = 0; i < _blocklist.length; i++) {
                this.ground.geometry.faces[_s + _blocklist[i]].color = new THREE.Color(0.25, 0.25, 0.25);
            }
            this.ground.geometry.normalsNeedUpdate = true;
            this.ground.geometry.colorsNeedUpdate = true;
            this.ground.geometry.elementsNeedUpdate = true;
            //	plane to Triangle
            var len = this.ground.geometry.vertices.length;
            for (var i = 0; i < len; i++) {
                this.ground.geometry.vertices[i].x -= this.ground.geometry.vertices[i].y * 0.5;
                this.ground.geometry.vertices[i].y *= 2 / Math.sqrt(5);
            }
            //	lines
            /*
            var _lines = [
                [	this.ground.geometry.faces[	_s + _blocklist[6]	].b,	this.ground.geometry.faces[	_s + _blocklist[7]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[8]	].b,	this.ground.geometry.faces[	_s + _blocklist[9]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[8]	].c,	this.ground.geometry.faces[	_s + _blocklist[9]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[10]	].c,	this.ground.geometry.faces[	_s + _blocklist[11]	].c ],
                [	this.ground.geometry.faces[	_s + _blocklist[20]	].b,	this.ground.geometry.faces[	_s + _blocklist[21]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[22]	].c,	this.ground.geometry.faces[	_s + _blocklist[23]	].c ],
                [	this.ground.geometry.faces[	_s + _blocklist[22]	].c,	this.ground.geometry.faces[	_s + _blocklist[23]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[24]	].b,	this.ground.geometry.faces[	_s + _blocklist[25]	].a ],
                [	this.ground.geometry.faces[	_s + _blocklist[24]	].c,	this.ground.geometry.faces[	_s + _blocklist[25]	].c ],
                [	this.ground.geometry.faces[	_s + _blocklist[24]	].b,	this.ground.geometry.faces[	_s + _blocklist[25]	].c ],
                [	this.ground.geometry.faces[	_s + _blocklist[26]	].c,	this.ground.geometry.faces[	_s + n*2+21-2	].b ],
            ];

            for( var i = 0; i < _lines.length; i++ )
            {
                var _geo = new THREE.Geometry();
                _geo.vertices[0] = this.ground.geometry.vertices[_lines[i][0]];
                _geo.vertices[1] = this.ground.geometry.vertices[_lines[i][1]];
                var _mat = new THREE.LineBasicMaterial({color:0x181818,linewidth:1})
                var _line = new THREE.Line( _geo, _mat );
                this.scene.add( _line );
            }
            */
        };
        main.hoge = 0;
        return main;
    })();
    hakuhaku.main = main;
    //	参照できないクラス
    var sub = (function () {
        function sub() {
            $(window).on('click', function (e) {
                var _x = e.originalEvent.pageX;
                var _y = e.originalEvent.pageY;
                console.log(_x, _y);
            });
        }
        return sub;
    })();
})(hakuhaku || (hakuhaku = {}));
var _t = new hakuhaku.main(document.getElementById('container'));
