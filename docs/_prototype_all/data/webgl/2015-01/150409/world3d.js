/*
    world3d.ts
    @ nulldesign.jp
    ver	1.0.2
*/
var THREE = THREE || {};
var world3d;
(function (world3d) {
    world3d.mouse = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };
    world3d.resolution = { x: window.innerWidth, y: window.innerHeight };
    world3d.time = 0;
    world3d.ZERO = new THREE.Vector3(0, 0, 0);
    world3d.uniforms = {
        time: { 'type': 'f', 'value': 1.0 },
        resolution: { 'type': 'v2', 'value': new THREE.Vector2() },
        mouse: { 'type': 'v2', 'value': new THREE.Vector2() }
    };
    world3d.uniforms.time.value = 0.0;
    world3d.uniforms.resolution.value.x = world3d.resolution.x;
    world3d.uniforms.resolution.value.y = world3d.resolution.y;
    world3d.uniforms.mouse.value.x = world3d.mouse.x;
    world3d.uniforms.mouse.value.y = world3d.mouse.y;
    var three = (function () {
        function three(container) {
            var _width = window.innerWidth;
            var _height = window.innerHeight;
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0x181818, 1000, 1600);
            this.camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 2000);
            //this.camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 2000 );
            this.camera.position.set(0, 0, 1000);
            this.focus = new THREE.Vector3();
            this.focus.set(0, 0, 0);
            this.camera.lookAt(this.focus);
            this.renderer = new THREE.WebGLRenderer({ antialias: false });
            this.renderer.setClearColor(this.scene.fog.color, 1);
            this.renderer.setSize(_width, _height);
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            this.renderer.autoClear = false;
            container.appendChild(this.renderer.domElement);
            new basicEvents(this.camera, this.renderer);
            this.animate();
        }
        three.prototype.animate = function () {
            var _this = this;
            setInterval(function () {
                _this.render();
                _this.engine();
            }, 1000 / 60);
        };
        three.prototype.render = function () {
            var _this = this;
            _this.camera.lookAt(_this.focus);
            _this.renderer.render(_this.scene, _this.camera);
        };
        three.prototype.engine = function () {
        };
        return three;
    })();
    world3d.three = three;
    var shader = (function () {
        function shader(_dom, _vid, _fid, _uniforms) {
            _uniforms = _uniforms || world3d.uniforms;
            world3d.uniforms = _uniforms;
            this.vid = _vid;
            this.fid = _fid;
            if (!world3d.uniforms.time) {
                world3d.uniforms.time = { 'type': 'f', 'value': 1.0 };
            }
            var _width = window.innerWidth;
            var _height = window.innerHeight;
            //	カメラ
            //this.camera = new THREE.PerspectiveCamera( 35, _width / _height, 0.1, 2000 );
            this.camera = new THREE.OrthographicCamera(-_width * 0.5, _width * 0.5, _height * 0.5, -_height * 0.5, 0.1, 2000);
            this.camera.position.z = 1000;
            //	カメラフォーカス	
            this.focus = new THREE.Vector3();
            this.focus.set(0, 0, 0);
            this.camera.lookAt(focus);
            //	SCENE
            this.scene = new THREE.Scene();
            this.scene.fog = new THREE.Fog(0x181818, 1000, 1500);
            //	renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: false });
            this.renderer.setClearColor(this.scene.fog.color, 1);
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            this.renderer.gammaInput = true;
            this.renderer.gammaOutput = true;
            this.renderer.autoClear = false;
            _dom.appendChild(this.renderer.domElement);
            this.createScreen();
            new basicEvents(this.camera, this.renderer);
            this.animate();
        }
        shader.prototype.createScreen = function () {
            var _width = screen.width;
            var _height = screen.height;
            var geometry = new THREE.PlaneBufferGeometry(_width, _height);
            var material = new THREE.ShaderMaterial({
                uniforms: world3d.uniforms,
                vertexShader: this.vid,
                fragmentShader: this.fid
            });
            var mesh = new THREE.Mesh(geometry, material);
            this.scene.add(mesh);
        };
        shader.prototype.animate = function () {
            //requestAnimationFrame( this.animate );
            //this.render();
            var _this = this;
            setInterval(function () {
                _this.render();
                _this.engine();
                world3d.uniforms.time.value += 0.05;
            }, 1000 / 60);
        };
        shader.prototype.render = function () {
            var _this = this;
            _this.camera.lookAt(_this.focus);
            _this.renderer.render(_this.scene, _this.camera);
        };
        shader.prototype.engine = function () {
        };
        return shader;
    })();
    world3d.shader = shader;
    var basicEvents = (function () {
        function basicEvents(_camera, _renderer) {
            var _this = this;
            window.addEventListener('resize', function (e) {
                var _width = window.innerWidth;
                var _height = window.innerHeight;
                if (_camera.aspect) {
                    _camera.aspect = _width / _height;
                }
                else {
                    _camera.left = -_width * 0.5;
                    _camera.right = _width * 0.5;
                    _camera.top = _height * 0.5;
                    _camera.bottom = -_height * 0.5;
                }
                _camera.updateProjectionMatrix();
                _renderer.setSize(_width, _height);
                world3d.resolution = { x: _width, y: _height };
                world3d.uniforms.resolution.value.x = _width;
                world3d.uniforms.resolution.value.y = _width;
            }, false);
            window.addEventListener('mousemove', function (e) {
                world3d.mouse.x = e.pageX;
                world3d.mouse.y = e.pageY;
                world3d.uniforms.mouse.value.x = world3d.mouse.x;
                world3d.uniforms.mouse.value.y = window.innerHeight - world3d.mouse.y;
                e.preventDefault();
            }, false);
            window.addEventListener('touchmove', function (e) {
                world3d.mouse.x = e.touches[0].pageX;
                world3d.mouse.y = e.touches[0].pageY;
                world3d.uniforms.mouse.value.x = world3d.mouse.x;
                world3d.uniforms.mouse.value.y = window.innerHeight - world3d.mouse.y;
                e.preventDefault();
            }, false);
        }
        return basicEvents;
    })();
})(world3d || (world3d = {}));
