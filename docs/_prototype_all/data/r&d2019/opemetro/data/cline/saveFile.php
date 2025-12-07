<?php


$fileName = $_POST['name'].'.js';
$contents = $_POST['cont'];


if(file_exists($fileName)) {
 
    // ファイルはすでにあると通知
    //echo $file.'はすでにあります。';
  } else {
 
    // touchでファイル作成
    //touch( $fileName.'.js');

    $fp = fopen($fileName, 'w');
 
// fwriteで文字列を書き込む
	fwrite($fp, $contents);
 
// ファイルを閉じる
	fclose($fp);
 
	// ファイルを出力する
	readfile($filename);
 
    // ファイルを作成したと通知
    //echo $file.'作成しました。<br>';
  }



?>