var cube_size = 1;     // cubeのサイズ
var cube_count = 10;   // cubeの配置数
var grid_count = 10;   // グリッドの分割数
var interval = 1000;   // 移動アニメーションの間隔
var duration = 500;    // 1回の移動時間
var stop_rate = 0.1;  // 移動しない確率

// 初期設定
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 1000 );
camera.position.set(0, 8, 15);

// マウスで回転できるようにする
var controls = new THREE.OrbitControls(camera);

// 全方向から色が見えるよう4つのライトを向かい合わせで配置
var bright = 0.8
var add_light = (x, y, z) => {
  var directionalLight = new THREE.DirectionalLight('#ffffff', bright);
  directionalLight.position.set(x, y, z);
  scene.add(directionalLight);
}
add_light(10, 10, 10);
add_light(-10, -10, -10);
add_light(-10, 10, 10);
add_light(10, -10, -10);

// グリッド(床部分)
var grid_size = grid_count * cube_size;
var cube_half = cube_size / 2;
var grid = new THREE.GridHelper(grid_size, grid_count);
grid.material.color = new THREE.Color(0xaaaaaa);
scene.add(grid);

// Gridの左奥のマスにcubeを配置する場合の座標(基準点)
var origin = new THREE.Vector3(
  cube_half - grid_size / 2,
  cube_half,
  cube_half - grid_size / 2,
);
// Gridの右手前のマスにcubeを配置する場合の座標
var limit = new THREE.Vector3(
  origin.x + (cube_size * (grid_count - 1)),
  cube_half,
  origin.z + (cube_size * (grid_count - 1)),
);

// 範囲内のランダムpositionを返す
var rand = () => {
  return Math.floor(Math.random() * grid_count) * cube_size;
}

// 回転が見えるようcubeに軸線を付ける
var line_size = cube_size;
var add_line = (obj, end_pos, color) => {
  var start_pos = new THREE.Vector3(0, 0, 0);
  var g = new THREE.Geometry();
	g.vertices.push(start_pos);
	g.vertices.push(end_pos);
	var material = new THREE.LineBasicMaterial({linewidth: 4, color: color});
	var line = new THREE.Line(g, material);
	obj.add(line);
}
var grid_half = grid_size / 2;
add_line(grid, new THREE.Vector3( grid_half, 0, 0 ), "#ff0000");
add_line(grid, new THREE.Vector3( 0, grid_half, 0 ), "#00ff00");
add_line(grid, new THREE.Vector3( 0, 0, grid_half ), "#0000ff");

// cubeを配置
var cubes = [];
var tweens = [];
for(var i = 0; i < cube_count; i ++){
  var geometry = new THREE.BoxGeometry(cube_size, cube_size, cube_size);
  // 6面のmaterialを指定
  var materials = [
    new THREE.MeshLambertMaterial({color: 0xE9546B}), // right
    new THREE.MeshLambertMaterial({color: 0xE9546B}), // left
    new THREE.MeshLambertMaterial({color: 0x00A95F}), // top
    new THREE.MeshLambertMaterial({color: 0x00A95F}), // bottom
    new THREE.MeshLambertMaterial({color: 0x187FC4}), // front
    new THREE.MeshLambertMaterial({color: 0x187FC4}), // back
  ];
  var cube = new THREE.Mesh( geometry, materials );
  // 初期配置はランダム
  cube.position.x = origin.x + rand();
  cube.position.y = origin.y;
  cube.position.z = origin.z + rand();
  cubes.push(cube);  
  scene.add(cube);
  
  add_line(cube, new THREE.Vector3( line_size, 0, 0 ), "#ff0000");
  add_line(cube, new THREE.Vector3( 0, line_size, 0 ), "#00ff00");
  add_line(cube, new THREE.Vector3( 0, 0, line_size ), "#0000ff");
}

window.cubes = cubes
var animating = [];
var animate_cube = () => {
  if(stopped) return;
  $.each(cubes, (i, cube) => {
    if(Math.random() < stop_rate) return; // 一定確率で動かず終わり
    if(animating[i]) return;
    var origin_pos = cube.position.clone();
    var origin_quaternion = cube.quaternion.clone();
    var from_param = {x: 0};
    var to_param = {x: 1};
    // 次に進む方向を計算
    var move_axis = Math.random() > 0.5 ? 'x' : 'z';
    var move_offset = Math.random() > 0.5 ? -1 : 1;
    var new_pos = origin_pos[move_axis] + move_offset;
    // Gridからはみ出す場合は移動方向を反転
    if((new_pos <= origin[move_axis]) || (new_pos >= limit[move_axis])){
      move_offset = -move_offset
    }

    // 移動方向に対する回転軸(worldの方向)
    var normal_unit = 1
    var rot_axis = move_axis == 'x' ? 'z' : 'x';
    var rot_axis_v = new THREE.Vector3()
    rot_axis_v[rot_axis] = normal_unit
    var nextr = origin_pos.clone().add(rot_axis_v)
    // worldから見た回転軸をlocalの軸に変換
    // * worldToLocalが正常に動かない(?)ため、normalizeは必須
    var rot_vec = cube.worldToLocal(nextr.clone()).normalize();
    // rot_vecからlocal軸(x, y, z)を取得
    // 本来なら(1, 0, 0)や(0, 0, -1)のような値が出てくる想定だが、
    // 何度も回転させるとなぜか(1, 0.49999999, 0)のような値になるので
    // 絶対値がnormal_unitと同じ方向を正として扱う
    var local_rot_axis;
    if(Math.abs(rot_vec.x) == normal_unit) local_rot_axis = 'x';
    if(Math.abs(rot_vec.y) == normal_unit) local_rot_axis = 'y';
    if(Math.abs(rot_vec.z) == normal_unit) local_rot_axis = 'z';
    if(!local_rot_axis){
      // windowフォーカスを別画面に移した後など、
      // worldToLocalの結果がおかしい場合は今回のアニメーションを停止
      console.log('err', rot_vec.x, rot_vec.y, rot_vec.z)
      return;
    }
    var axis = new THREE.Vector3()
    axis[local_rot_axis] = normal_unit;
    
    // 回転軸の方向と移動方向から、回転方向(時計回り, 半時計回り)を判定
    var axis_dir = rot_vec[local_rot_axis];
    var rot_dir = 1;
    if((move_axis == 'x' &&
         ((axis_dir > 0 && move_offset > 0) ||
          (axis_dir < 0 && move_offset < 0))
       ) ||
       (move_axis == 'z' &&
         ((axis_dir > 0 && move_offset < 0) ||
          (axis_dir < 0 && move_offset > 0))
       )
      ) {
      rot_dir = -rot_dir;
    }
    var canceled = false;
    var tween = new TWEEN.Tween(from_param)
      .to(to_param, duration)
      .easing(TWEEN.Easing.Linear)
      .on('start', () => {
        if(animating[i]){
          canceled = true;
          // ここでtween.stopしたらエラー起きる事があるので注意
        }
        animating[i] = true;
        //console.log('st')
      })
      .on('update', ({x}) => {
        if(canceled) return;
        //console.log('upd', x)
        var r = cube_half * Math.sqrt(2); // 中心の回転半径
        var center_angle = 45 + (90 * x); // 現在の中心位置の角度（移動開始時は45°）
        var center_rad = center_angle * Math.PI / 180; // 角度をラジアンに変換
        // 移動中のcube中心の高さ (sinθ * r)
        // cubeサイズの半分を引くことで、移動開始時点からの増加分だけを取得する
        var current_height = Math.sin(center_rad) * r - cube_half;
        // 移動中のcube中心の位置 (α - (cosθ * r))
        // 移動方向の逆転を考慮してmove_offset(1 or -1)を掛け合わせる
        var current_move = (cube_half - (Math.cos(center_rad) * r)) * move_offset;

        // 移動前のpositionを基準に計算
        cube.position[move_axis] = origin_pos[move_axis] + current_move;
        cube.position.y = origin_pos.y + current_height;
        
        // 回転軸方向に回転を加える
        // rotationだと三軸で回転した時に
        // 予期せぬ方向を向くためquaternionを使う
        var new_q = origin_quaternion.clone()
        var target = new THREE.Quaternion();
        var rad90 = Math.PI / 2; // ラジアン90°
        var rad = rad90 * x * rot_dir;
        target.setFromAxisAngle(axis, rad);
        new_q.multiply(target);
        cube.quaternion.copy(new_q)
        cube.quaternion.normalize()
      })
      .on('complete', () => {
        animating[i] = false;
        //console.log('end', cube.quaternion._w)
      })
    tween.start();
  })
};
setInterval(animate_cube, interval);

// レンダリング
var stopped = false;
function render() {
    //if(stopped) return;
    requestAnimationFrame(render);
    controls.update();
    renderer.render(scene, camera);
}
render();

TWEEN.autoPlay(true);