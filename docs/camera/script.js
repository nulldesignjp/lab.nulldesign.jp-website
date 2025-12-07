/*
	script.js
*/

let _mp4video;   //  mp4
let _webcam;
let _media;

function addArView()
{
    //  AR機能の立ち上げ
    let _scene, _camera, _renderer, _canvas;

    let _resolution = { w: window.innerWidth, h: window.innerHeight };
    _canvas = document.querySelector('canvas#arViewCore');

    _scene = new THREE.Scene();
    _camera = new THREE.OrthographicCamera( - _resolution.w * 0.5, _resolution.w * 0.5, _resolution.h * 0.5, - _resolution.h * 0.5, 1, 100 );
    _camera.position.z = 10;
    _camera.lookAt( new THREE.Vector3() );
    _renderer = new THREE.WebGLRenderer({
        canvas: _canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
    })

    _renderer.setSize( _resolution.w, _resolution.h )
    _renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );

    _mp4video = document.querySelector('video#videoSource');

    const _texture = new THREE.VideoTexture( _mp4video );
    _texture.colorSpace = THREE.SRGBColorSpace;

    let _geometry = new THREE.PlaneGeometry( 1080, 1920 );
    let _material = new THREE.ShaderMaterial({
        uniforms: {
        tDiffuse: { value: _texture },
        difference: { value: 0.75 }
        },
        vertexShader: `
    varying vec2 vUv;

    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
        `,
        fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float difference;
    varying vec2 vUv;

    const vec3 chromaKeyColor = vec3(0.0, 1.0, 0.0);

    void main( void ) {
    vec4 tex = texture2D( tDiffuse, vUv );
    float diff = length(chromaKeyColor.rgb - tex.rgb);
    if(diff < difference){
        discard;
    }else{
        gl_FragColor = tex;
    }
    }

    `,
        transparent: true,
        side: THREE.DoubleSide
    });
    let _mesh = new THREE.Mesh( _geometry, _material );
    _scene.add( _mesh );

    let _scale = _resolution.w / 1080;
    _mesh.scale.set( _scale, _scale, 1 );

        let _h = 1920 * _scale;
        let _dy = ( _h - _resolution.h ) * 0.5;
        _mesh.position.y = _dy;


    (function _loop(){
        window.requestAnimationFrame( _loop )
        _renderer.render( _scene, _camera );
    })();

    window.addEventListener('resize', ()=>{
        _resolution = { w: window.innerWidth, h: window.innerHeight };
        _renderer.setSize( _resolution.w, _resolution.h );
        _renderer.setPixelRatio( Math.min(window.devicePixelRatio, 2) );

        if( _camera.aspect )
        {
            _camera.aspect = _resolution.w / _resolution.h;
        } else {
            _camera.left = - _resolution.w * 0.5;
            _camera.right = _resolution.w * 0.5;
            _camera.bottom = - _resolution.h * 0.5;
            _camera.top = _resolution.h * 0.5;
        }
        _camera.updateProjectionMatrix();


        let _scale = _resolution.w / 1080;
        _mesh.scale.set( _scale, _scale, 1 );

        let _h = 1920 * _scale;
        let _dy = ( _h - _resolution.h ) * 0.5;
        _mesh.position.y = _dy;
    });

}

function addVideo()
{
    _webcam = document.querySelector('video#videoCore');
    _webcam.style.width = window.innerWidth + 'px';
    _webcam.style.height = window.innerHeight + 'px';
    _webcam.autoplay = true;

    //  webカメラの起動プログラム

    let _resolution = { w: window.innerWidth, h: window.innerHeight };

    let _option = {
        audio: false,
        video: {
        facingMode: {
            exact: 'environment'
            // facingMode: "environment" or "user"
        },
        aspectRatio: _resolution.h / _resolution.w,
        // width: { ideal: _resolution.w, min: 750, max: 1080 },
        // height: { ideal: _resolution.h, min: 1334, max: 1920 }
        // width: { ideal: _resolution.w },
        // height: { ideal: _resolution.h }
        }
    }

    //  アウトカメラ起動設定
    _media = navigator.mediaDevices.getUserMedia( _option );

    //  カメラのストリーミング開始
    _media.then( stream => {
        /* ストリームを使用 */

        document.querySelector('#videoSuccess').classList.add('show');

        window.addEventListener('resize', ()=>{
            _resolution = { w: window.innerWidth, h: window.innerHeight };
            _webcam.style.width = _resolution.w + 'px';
            _webcam.style.height = _resolution.h + 'px';
        });

        _webcam.srcObject = stream;
        _webcam.play();

        //  camera close.
        // setTimeout(()=>{
        //     stream.getTracks().forEach(track => track.stop())
        // },10000)

        //  check
        let tracks = stream.getTracks();
        for ( var i = 0; i < tracks.length; i++ )
        {
            // 種類
            console.log('kind: '+tracks[i].kind);

            let constraints = tracks[i].getConstraints();

            // 音声トラックの制約
            if (tracks[i].kind == 'audio') {
                console.log('autoGainControl: '+constraints.autoGainControl)
                console.log('channelCount: '+constraints.channelCount)
                console.log('echoCancellation: '+constraints.echoCancellation)
                console.log('latency: '+constraints.latency)
                console.log('noiseSuppression: '+constraints.noiseSuppression)
                console.log('sampleRate: '+constraints.sampleRate)
                console.log('sampleSize: '+constraints.sampleSize)
                console.log('volume: '+constraints.volume)
            }

            // 動画トラックの制約
            if (tracks[i].kind == 'video') {
                console.log('aspectRatio: '+constraints.aspectRatio)
                console.log('facingMode: '+constraints.facingMode)
                console.log('frameRate: '+constraints.frameRate)
                console.log('height: '+constraints.height)
                console.log('width: '+constraints.width)
                console.log('resizeMode: '+constraints.resizeMode)
            }
        }
    });

    _media.catch( err => {
        /* エラーを処理 */
        // alert('Camera And Video Settimg Error.\nウィンドウ閉じ、再度アクセスしてください。');
        // alert('Camera And Video Settimg Error.\n設定をしてもらってリロードを促す。');
        console.log(JSON.stringify(err));

        //  設定をしてもらってリロードを促す
        let _ua = navigator.userAgent.toLowerCase();
        if( _ua.indexOf('iphone') != -1 )
        {
            document.querySelector('#videoError .ios').classList.add('show');
        } else if( _ua.indexOf('android') != -1 )
        {
            document.querySelector('#videoError .android').classList.add('show');
        } else {
            //  from pc
            document.querySelector('#videoError .pc').classList.add('show');
        }

        document.querySelector('#videoError').classList.add('show');
        document.querySelector('#videoSuccess').classList.add('none');

    });

}


window.addEventListener('load', ()=>{

    let _setup = document.querySelector('#camerasetup').addEventListener('click', ()=>{
        
        //  AR機能のセットアップ
        addArView();

        //  WebCamera機能のセットアップ
        addVideo();

        //  UIの活性、非活性
        document.querySelector('#camerasetup').disabled = 'disabled';
        document.querySelector('#videoplay').disabled = '';

        //  イベントの話
        let _btnPlay = document.querySelector('#videoplay').addEventListener('click', ()=>{
            _mp4video.play();
            document.querySelector('#videoplay').disabled = 'disabled';
            document.querySelector('#videopause').disabled = '';
        });
        let _btnPause = document.querySelector('#videopause').addEventListener('click', ()=>{
            _mp4video.pause();
            document.querySelector('#videoplay').disabled = '';
            document.querySelector('#videopause').disabled = 'disabled';
        });


        //  動画再生準備完了通知
        _mp4video.addEventListener('canplay',()=>{});

        //  動画再生完了通知
        _mp4video.addEventListener('ended',()=>{
            document.querySelector('#videoplay').disabled = '';
            document.querySelector('#videopause').disabled = 'disabled';
        });


    }, {once:true});

})

