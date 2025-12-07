#include "ofApp.h"

const int N = 128;
const int N2 = 76;
const float l = 10.0;
float friction = 0.98;
float dt = 0.1; //時間間隔
float dd = 1.0; //空間間隔
float v = 4.0;    //速度
float step;
float powerField[3][N2+1][N+1];
ofMesh mesh;
ofCamera camera;
ofLight pointLight;
ofMaterial material;

//  http://openframeworks.cc/documentation/gl/ofLight.html

//--------------------------------------------------------------
void ofApp::setup(){
    ofSetSmoothLighting(true);
    ofSetDepthTest(true);
    ofEnableSmoothing();
    ofEnableDepthTest();
    ofShowCursor();
    
    pointLight.enable();
    //pointLight.setSpotLight();
    pointLight.setPointLight();
    pointLight.setPosition(0, 0, 100);
    
    pointLight.setDiffuseColor(ofColor(255.0, 255.0, 255.0));
    pointLight.setSpecularColor( ofColor( 255.0, 255.0, 255.0 ) );
    pointLight.setPointLight();
    
    
    camera.enableOrtho();
    camera.setPosition( ofVec3f( 0, 0, 1000.0 ) );
    camera.lookAt( ofVec3f(0,0,0), ofVec3f( 0,1,0) );
    camera.setNearClip(1.0);
    camera.setFarClip(10000.0);
    
    step = 0.0;
    
    mesh.usingIndices();
    mesh.usingNormals();
    mesh.usingTextures();
    
    for( int i = 0; i <= N2; i++ )
    {
        for( int j = 0; j <= N; j++ )
        {
            float _x = j - N * 0.5;
            float _y = i - N2 * 0.5;
            _x *= l;
            _y *= l;
            ofVec3f pos = ofVec3f( _x, _y, 0 );
            mesh.addVertex( pos );
            //mesh.addColor(ofFloatColor(0.5,0.5,0.5));
        }
    }
    
    
    mesh.addNormals( mesh.getFaceNormals(TRUE) );
    
    
    material.setShininess(120);
    material.setSpecularColor(ofColor(255, 0, 0, 255));
    material.setEmissiveColor(ofColor(0, 0, 0, 255));
    material.setDiffuseColor(ofColor(255, 255, 255, 255));
    material.setAmbientColor(ofColor(255, 255, 255, 255));
    
    
    
    float _x = N - N * 0.5;
    float _y = N2 - N2 * 0.5;
    _x *= l;
    _y *= l;
    
    
    for( int i = 0; i < N2; i++ )
    {
        for( int j = 0; j < N; j++ )
        {
            powerField[0][i][j] = 0.0;
            powerField[1][i][j] = 0.0;
            powerField[2][i][j] = 0.0;
        }
    }
    
    //  http://qiita.com/Yoshimasa/items/2734ff24e2f6a2e5aafe
    
    int len = mesh.getVertices().size();
    for( int i = 0; i < len - ( N + 1 ); i++ )
    {
        if( i%(N+1) != N )
        {
            mesh.addIndex(i);
            mesh.addIndex(i+1);
            mesh.addIndex(i+N+1);
            mesh.addIndex(i+1);
            mesh.addIndex(i+1+N+1);
            mesh.addIndex(i+N+1);
        }
    }
    
    
    
}

//--------------------------------------------------------------
void ofApp::update(){
    
    float time = step * dt;
    step++;
    
    for (int i = 1; i <= N2 - 1; i++)
    {
        for (int j = 1; j <= N - 1; j++)
        {
            powerField[2][i][j] = 2.0 * powerField[1][i][j] - powerField[0][i][j] + v * v * dt * dt / (dd * dd) * (powerField[1][i + 1][j] + powerField[1][i - 1][j] + powerField[1][i][j + 1] + powerField[1][i][j - 1] - 4.0 * powerField[1][i][j]);
        }
    }
    
    //ノイマン境界条件
    for (int i = 1; i <= N2-1; i++)
    {
        powerField[2][i][0] = powerField[2][i][1];
        powerField[2][i][N] = powerField[2][i][N - 1];
    }
    for (int i = 1; i <= N-1; i++)
    {
        powerField[2][0][i] = powerField[2][1][i];
        powerField[2][N2][i] = powerField[2][N2 - 1][i];
    }
    //角の処理
    powerField[2][0][0] = (powerField[2][0][1] + powerField[2][1][0]) / 2.0;
    powerField[2][0][N] = (powerField[2][0][N - 1] + powerField[2][1][N]) / 2.0;
    powerField[2][N2][0] = (powerField[2][N2 - 1][0] + powerField[2][N2][1]) / 2.0;
    powerField[2][N2][N] = (powerField[2][N2 - 1][N] + powerField[2][N2][N - 1]) / 2.0;
    
    //次の計算のために配列の数値を入れかえる。ここで過去の情報は失われる。
    for (int i = 0; i <= N2; i++)
    {
        for (int j = 0; j <= N; j++)
        {
            powerField[0][i][j] = powerField[1][i][j];
            powerField[1][i][j] = powerField[2][i][j];
            
            //	add
            powerField[1][i][j] *= friction;
        }
    }
    
    //	DRAW
    int a = 0;
    for ( int i = 0; i <= N2; i++) {
        for ( int j = 0; j <= N; j++) {
            mesh.getVertices()[a].z = powerField[1][i][j];
            a++;
        }
    }
}

//--------------------------------------------------------------
void ofApp::draw(){
    
    ofFill();
    ofBackgroundGradient(ofColor::white, ofColor::gray);
    
    
    camera.begin();
    ofPushMatrix();
    ofTranslate( ofGetWidth()*0.5,ofGetHeight()*0.5);
    pointLight.enable();
    material.begin();
    mesh.draw();
    material.end();
    pointLight.disable();
    ofPopMatrix();
    camera.end();
    
    //
}

//--------------------------------------------------------------
void ofApp::keyPressed(int key){
    
}

//--------------------------------------------------------------
void ofApp::keyReleased(int key){
    
}

//--------------------------------------------------------------
void ofApp::mouseMoved(int x, int y ){
    
}

//--------------------------------------------------------------
void ofApp::mouseDragged(int x, int y, int button){
    
    float _x = x - ofGetWidth() * 0.5;
    float _y = y - ofGetHeight() * 0.5;
    _y = - _y;
    
    float x0 = _x;
    float y0 = _y;
    float z0 = 4.0;
    float sigma2 = 80.0;
    
    for (int i = 0; i <= N2; i++) {
        for (int j = 0; j <= N; j++) {
            float x = ( - N / 2 + j ) * l;
            float y = ( - N2 / 2 + i ) * l;
            //初期条件を与える
            float z = z0 * exp(-(pow(x-x0, 2) + pow(y-y0, 2)) / (2*sigma2));
            powerField[1][i][j] += sqrt(z);
        }
    }
}

//--------------------------------------------------------------
void ofApp::mousePressed(int x, int y, int button){
    
    float _x = x - ofGetWidth() * 0.5;
    float _y = y - ofGetHeight() * 0.5;
    _y = - _y;
    
    float x0 = _x;
    float y0 = _y;
    float z0 = 16.0;
    float sigma2 = 80.0;
    
    for (int i = 0; i <= N2; i++) {
        for (int j = 0; j <= N; j++) {
            float x = ( - N / 2 + j ) * l;
            float y = ( - N2 / 2 + i ) * l;
            //初期条件を与える
            float z = z0 * exp(-(pow(x-x0, 2) + pow(y-y0, 2)) / (2*sigma2));
            powerField[1][i][j] += sqrt(z);
        }
    }
}

//--------------------------------------------------------------
void ofApp::mouseReleased(int x, int y, int button){
    
}

//--------------------------------------------------------------
void ofApp::windowResized(int w, int h){
    
}

//--------------------------------------------------------------
void ofApp::gotMessage(ofMessage msg){
    
}

//--------------------------------------------------------------
void ofApp::dragEvent(ofDragInfo dragInfo){
    
}
