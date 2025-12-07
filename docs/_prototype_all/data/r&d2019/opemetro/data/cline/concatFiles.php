<?php


$fileName = 'coastLine.js';

// 作成するファイル名を複数配列に格納
$files = array(
'0.js','1.js','2.js','3.js','4.js','5.js','6.js','7.js','8.js','9.js','10.js','11.js','12.js','13.js','14.js','15.js','16.js','17.js','18.js','19.js','20.js','21.js','22.js','23.js','24.js','25.js','26.js','27.js','28.js','29.js','30.js','31.js','32.js','33.js','34.js','35.js','36.js','37.js','38.js');


touch($fileName);

$result = '';

foreach ($files as $file) {


  $filecontent = file_get_contents( $file );
  $result = $result."\n".'['.$filecontent.'],';
 
}


	$result = str_replace( '],],],', "]]],", $result );
	$result = str_replace( '],],', "]],", $result );
  file_put_contents($fileName, $result);


?>