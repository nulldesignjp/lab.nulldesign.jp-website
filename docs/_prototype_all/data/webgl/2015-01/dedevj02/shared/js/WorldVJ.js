/// <reference path="./jquery/jquery.d.ts" />
/// <reference path="./threejs/three.d.ts" />
/// <reference path="./scene00.ts" />
/// <reference path="./scene02.ts" />
/// <reference path="./scene04.ts" />
/// <reference path="./scene05.ts" />
//	https://www.youtube.com/watch?v=tq3VsjxING4	

var gui = new dat.GUI();
var sceneName = 'scene00';
var customEffects = function(){};
var customEffects2= function(){};

var gestureData = {
    IsSwipeLeft: false,
    IsSwipeRight: false,
    IsCharge: false
};

var WorldVJ = (function () {
    function WorldVJ(_container) {
        this.scenes = [scene00, scene02, scene03, scene04, scene05];
        this.rotVector = 0;
        this.container = _container;
        var _t = this;
        var _width = window.innerWidth;
        var _height = window.innerHeight;
        _t.sceneBG = new THREE.Scene();
        //_t.sceneBG.fog = new THREE.Fog( 0x000000, 800, 1600 );
        //	UNIFORM
        WorldVJ.uniforms.time.value = 0.0;
        WorldVJ.uniforms.startTime.value = 0.0;
        WorldVJ.uniforms.resolution.value.x = window.innerWidth;
        WorldVJ.uniforms.resolution.value.y = window.innerHeight;
        WorldVJ.uniforms.mouse.value.x = 0;
        WorldVJ.uniforms.mouse.value.y = 0;
        WorldVJ.uniforms.effect.value = 0.0;
        //	alert( window.innerWidth + ", " + window.innerHeight );
        //	alert( screen.width + ", " + screen.height );
        _t.skyColor = new THREE.Color(1.0, 0.05, 0.05);
        _t.skyColorT = new THREE.Color(1.0, 0.05, 0.05);
        _t.skyColor2 = new THREE.Color(Math.random(), Math.random(), Math.random());
        _t.skyColorT2 = new THREE.Color(Math.random(), Math.random(), Math.random());
        //	FOCUS
        _t.focus = new THREE.Vector3();
        _t.focus.set(0, 0, 0);
        _t.cameraBG = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 30000);
        _t.cameraBG.position.set(0, 0, 1000);
        _t.cameraBG.lookAt(_t.focus);
        //	CAMERA
        _t.camera = new THREE.PerspectiveCamera(35, _width / _height, 0.1, 1600);
        //	_t.camera = new THREE.OrthographicCamera( - _width * 0.5, _width * 0.5, _height * 0.5, - _height * 0.5, 0.1, 1600 );
        _t.camera.position.set(0, 0, 1000);
        _t.camera.lookAt(_t.focus);
        //	RENDER
        _t.renderer = new THREE.WebGLRenderer({ antialias: true });
        //_t.renderer.setClearColor(_t.scene.fog.color, 1);
        _t.renderer.setClearColor(0x000000, 1);
        _t.renderer.setSize(_width, _height);
        _t.renderer.gammaInput = true;
        _t.renderer.gammaOutput = true;
        _t.renderer.autoClear = false;
        //	APPEND THREE.JS
        _t.container.appendChild(_t.renderer.domElement);
        _t.rotVector = 0;
        _t.mode = 0;
        //	sky
        _t.createSky();
        //	init scene
        _t.changeScene(0);
        //	events....
        _t.addEvents();
        //	start
        _t.update();


        //  GUI
        gui.add( window, 'sceneName',[ 'scene00', 'scene01', 'scene02', 'scene03', 'scene04' ] ).name('SCENE').onFinishChange(function( newValue ){

            switch (newValue) {
            case 'scene00':
                WorldVJ.uniforms.time.value = 0;
                WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
                _t.blackout2(function () {
                    _t.sky.material.vertexShader = document.getElementById('introV').textContent;
                    _t.sky.material.fragmentShader = document.getElementById('introF').textContent;
                    _t.sky.material.needsUpdate = true;
                });
                setTimeout(function () {
                    _t.changeScene(0);
                }, 200);
                break;
            case 'scene01':
                WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
                _t.blackout2(function () {
                    _t.sky.material.vertexShader = document.getElementById('as555V').textContent;
                    _t.sky.material.fragmentShader = document.getElementById('as555F').textContent;
                    _t.sky.material.needsUpdate = true;
                });
                setTimeout(function () {
                    _t.changeScene(1);
                }, 200);
                break;
            case 'scene02':
                WorldVJ.uniforms.time.value = 0;
                WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
                _t.blackout(function () {
                    _t.sky.material.vertexShader = document.getElementById('acidV').textContent;
                    _t.sky.material.fragmentShader = document.getElementById('acidF').textContent;
                    _t.sky.material.needsUpdate = true;
                });
                _t.changeScene(2);
                break;
            case 'scene03':
                WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
                _t.blackout(function () {
                    _t.sky.material.vertexShader = document.getElementById('floatAndFallsV').textContent;
                    _t.sky.material.fragmentShader = document.getElementById('floatAndFallsF').textContent;
                    _t.sky.material.needsUpdate = true;
                });
                _t.changeScene(3);
                break;
            case 'scene04':
                WorldVJ.uniforms.startTime.value = WorldVJ.uniforms.time.value;
                _t.blackout(function () {
                    _t.sky.material.vertexShader = document.getElementById('lightWaveV').textContent;
                    _t.sky.material.fragmentShader = document.getElementById('lightWaveF').textContent;
                    _t.sky.material.needsUpdate = true;
                });
                _t.changeScene(4);
                break;
            }
        });

        gui.add( window, 'customEffects' ).name('効果１').onFinishChange(function(newValue){
            WorldVJ.uniforms.effect.value += 0.1;
            _t.effects();
        });
        gui.add( window, 'customEffects2' ).name('効果２').onFinishChange(function(newValue){
            _t.skyColorT = new THREE.Color(Math.random(), Math.random(), Math.random());
            _t.skyColorT2 = new THREE.Color(Math.random(), Math.random(), Math.random());
            WorldVJ.uniforms.sparkMode.value = Math.floor(Math.random() * 8);
        });



        var f1 = gui.addFolder( 'Kinnect' );
        f1.add( gestureData, 'IsCharge', false ).name('両手を上げる').onChange(function(){
             _t.interactive('kinect', { gestureData: gestureData });
        });
        f1.add( gestureData, 'IsSwipeLeft', false ).name('左手を上げる').onChange(function(){
             _t.interactive('kinect', { gestureData: gestureData });
        });
        f1.add( gestureData, 'IsSwipeRight', false ).name('右手を上げる').onChange(function(){
             _t.interactive('kinect', { gestureData: gestureData });
        });
        f1.open();

        var f2 = gui.addFolder( 'Effect' );
    }
    WorldVJ.prototype.update = function () {
        var _t = this;
        _t.interactive('kinect', { gestureData: gestureData });


        //	UPDATE CONTENTS
        _t.scene.update();
        _t.cameraBG.position.x = _t.camera.position.x;
        _t.cameraBG.position.y = _t.camera.position.y;
        _t.cameraBG.position.z = _t.camera.position.z;
        _t.cameraBG.rotation.x = _t.camera.rotation.x;
        _t.cameraBG.rotation.y = _t.camera.rotation.y;
        _t.cameraBG.rotation.z = _t.camera.rotation.z;
        //	RENDER
        _t.camera.lookAt(_t.focus);
        _t.cameraBG.lookAt(_t.focus);
        _t.renderer.render(_t.sceneBG, _t.cameraBG);
        _t.renderer.render(_t.scene.scene, _t.camera);
        //	SKY
        WorldVJ.uniforms.time.value += 0.05;
        _t.skyColor.r += (_t.skyColorT.r - _t.skyColor.r) * 0.05;
        _t.skyColor.g += (_t.skyColorT.g - _t.skyColor.g) * 0.05;
        _t.skyColor.b += (_t.skyColorT.b - _t.skyColor.b) * 0.05;
        WorldVJ.uniforms.skyColor.value = _t.skyColor;
        _t.skyColor2.r += (_t.skyColorT2.r - _t.skyColor2.r) * 0.02;
        _t.skyColor2.g += (_t.skyColorT2.g - _t.skyColor2.g) * 0.02;
        _t.skyColor2.b += (_t.skyColorT2.b - _t.skyColor2.b) * 0.02;
        WorldVJ.uniforms.skyColor2.value = _t.skyColor;
        _t.sky.rotation.z += _t.rotVector;
        _t.sky.rotation.z += (0 - _t.sky.rotation.z) * 0.08;
        if (_t.mode == 4) {
            _t.sky.rotation.z = 0;
        }
        WorldVJ.uniforms.effect.value *= 0.96;
        _t.rotVector *= 0.01;
        //	REQUEST LOOP METHOD
        window.requestAnimationFrame(function () {
            _t.update();
        });
    };
    WorldVJ.prototype.createSky = function () {
        var _t = this;
        var _skyGeo = new THREE.IcosahedronGeometry(24000, 1);
        var _skyMat = new THREE.ShaderMaterial({
            uniforms: WorldVJ.uniforms,
            vertexShader: document.getElementById('introV').textContent,
            fragmentShader: document.getElementById('introF').textContent,
            side: THREE.DoubleSide,
            transparent: true,
            depthTest: false,
            shading: THREE.SmoothShading
        });
        _t.sky = new THREE.Mesh(_skyGeo, _skyMat);
        _t.sceneBG.add(_t.sky);
    };
    WorldVJ.prototype.changeScene = function (_no) {
        var _t = this;
        console.log('scene ' + '%c' + _no, 'color: #990000;font: bold 12px sans-serif;');
        if (_t.scene) {
            _t.scene.dispose();
        }
        _t.scene = null;
        //	RESET
        _t.focus.set(0, 0, 0);
        _t.camera.position.set(0, 0, 1000);
        _t.camera.fov = 35;
        _t.camera.near = 0.1;
        _t.camera.far = 1600;
        _t.camera.updateProjectionMatrix();
        //	NEW
        _t.scene = new _t.scenes[_no](_t.camera, _t.focus, _t.sky);
        _t.mode = _no;
    };
    WorldVJ.prototype.interactive = function (_type, _data) {
        var _t = this;
        //	String to JSON;
        function is(type, obj) {
            var clas = Object.prototype.toString.call(obj).slice(8, -1);
            return obj !== undefined && obj !== null && clas === type;
        }
        if (is("String", _data)) {
            _data = JSON.parse(_data);
        }
        _t.scene.interactive(_type, _data);
        if (_type == 'kinect') {
            var _isLeft = _data.gestureData.IsSwipeLeft;
            var _isRight = _data.gestureData.IsSwipeRight;
            var _isCharge = _data.gestureData.IsCharge;
            if (_isLeft) {
                _t.rotVector += 0.0005;
            }
            if (_isRight) {
                _t.rotVector -= 0.0005;
            }
        }
    };
    WorldVJ.prototype.effects = function () {
        this.scene.effects();
        //console.log( this.camera, this.cameraBG, this.sky )
    };
    WorldVJ.prototype.dispose = function () {
        this.scene.dispose();
    };
    WorldVJ.prototype.addEvents = function () {
        var _t = this;
        window.addEventListener('resize', function (e) {
            var _width = window.innerWidth;
            var _height = window.innerHeight;
            if (_t.camera.aspect) {
                _t.camera.aspect = _width / _height;
            }
            else {
                _t.camera.left = -_width * 0.5;
                _t.camera.right = _width * 0.5;
                _t.camera.top = _height * 0.5;
                _t.camera.bottom = -_height * 0.5;
            }
            _t.camera.updateProjectionMatrix();
            _t.renderer.setSize(_width, _height);
            if (_t.cameraBG.aspect) {
                _t.cameraBG.aspect = _width / _height;
            }
            else {
                _t.cameraBG.left = -_width * 0.5;
                _t.cameraBG.right = _width * 0.5;
                _t.cameraBG.top = _height * 0.5;
                _t.cameraBG.bottom = -_height * 0.5;
            }
            _t.cameraBG.updateProjectionMatrix();
            WorldVJ.uniforms.resolution.value.x = window.innerWidth;
            WorldVJ.uniforms.resolution.value.y = window.innerHeight;
        }, false);

    //
    };
    WorldVJ.prototype.keyDown = function (_c, _t) {
        
    };
    WorldVJ.prototype.blackout = function (_callback) {
        //document.getElementById('container').style.webkitFilter = "blur(4px)";
        $('#container').removeClass();
        $('#container').addClass('blackOut');
        setTimeout(function () {
            //document.getElementById('container').style.webkitFilter = "blur(0px)";
            _callback();
            $('#container').addClass('blackIn');
        }, 200);
    };
    WorldVJ.prototype.blackout2 = function (_callback) {
        //document.getElementById('container').style.webkitFilter = "blur(4px)";
        $('#container').removeClass();
        $('#container').addClass('blackOut');
        setTimeout(function () {
            //document.getElementById('container').style.webkitFilter = "blur(0px)";
            _callback();
            $('#container').addClass('blackInLong');
        }, 200);
    };
    WorldVJ.uniforms = {
        time: { 'type': 'f', 'value': 0.0 },
        startTime: { 'type': 'f', 'value': 0.0 },
        sparkMode: { 'type': 'f', 'value': 0.0 },
        resolution: { 'type': 'v2', 'value': new THREE.Vector2() },
        mouse: { 'type': 'v2', 'value': new THREE.Vector2() },
        skyColor: { 'type': 'c', 'value': new THREE.Color(0x000000) },
        skyColor2: { 'type': 'c', 'value': new THREE.Color(0x000000) },
        effect: { 'type': 'f', 'value': 0.0 }
    };
    return WorldVJ;
})();
