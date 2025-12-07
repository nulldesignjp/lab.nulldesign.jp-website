/*
	config.js
*/



//	背景色
var _spaceColor = 0x000000;
//	星の色
var _starColor = 0xFFFFFF;


//	衛星周回速度
var _rotationSpeed = 0.0005;


//	衛星の色
var _satelliteColor = 0x0d6b76;
//	衛星のエッジの色
var _satelliteEdgeColor = 0xFF6666;
//	衛星軌道表現色
var _satelliteOrbitColor = 0x00FF00;
//	衛星サイズ
var _satelliteSize = 0.125;


//	射出流星源数
var _meteorNums = 16;
//	流星源射出時間（秒
var _meteorDuration = 3.0;
//	流星軌道分割数。（60fpsで処理しているので、にかかる時間は _meteorSegment / 60 となります
var _meteorSegment = 512;
//	流星源の色
var _meteorColor = 0xCCCCCC;
//	流星軌道表現色
var _meteorLineColor = 0x009933;
//	流星軌道表現色
var _meteorLineOpacity = 0.6;
//	流星燃焼色
var _meteorSparkColor = [];
//	流星源半径
var _meteorSize = 0.0125;
//	流星燃焼エフェクトサイズ
var _meteorSparkSize = 8.0;
//	流星燃焼開始位置	（最大値は _meteorSegment と同じ。 _meteorSegmentで分割した軌道の燃焼開始位置と終了位置を設定
var _meteorElaseStartValue = 200;
//	流星燃焼終了位置
var _meteorElaseEndValue = 100;