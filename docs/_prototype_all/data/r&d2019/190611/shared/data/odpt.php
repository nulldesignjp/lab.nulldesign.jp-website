<?php

$toDay = $_GET['toDay'];
$operator = $_GET['Operator'];

//	曜日指定がなければ日曜日でやろう！
if( $toDay == '' ){	$toDay = 'Sunday';	}
if( $operator == '' ){	$operator = 'ANA';	}
if( $operator != 'ANA' &&  $operator != 'JAL' )
{
	$operator = 'ANA';
}

$domain = 'https://api-tokyochallenge.odpt.org';
$access_token = '087a30246b2ff6af6f7199b7dc6c46d49e923067cc4b80969da7fffa886042cc';

//	https://ckan-tokyochallenge.odpt.org/organization/ana
$flightSchedule = $domain.'/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:'.$operator.'&odpt:calendar=odpt.Calendar:'.$toDay.'&acl:consumerKey='.$access_token;

/*
	var _url = 'https://api-tokyochallenge.odpt.org';
	var _access_token = '087a30246b2ff6af6f7199b7dc6c46d49e923067cc4b80969da7fffa886042cc';

	//	https://ckan-tokyochallenge.odpt.org/organization/jal
	//	日本航空 フライト時刻表 (Flight timetable of Japan Airlines)
	//	https://ckan-tokyochallenge.odpt.org/dataset/a-flightschedule-jal
	//	var _jal = _url + '/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:JAL&odpt:calendar=odpt.Calendar:'+_toDay+'&acl:consumerKey=' + _access_token;

	//	https://ckan-tokyochallenge.odpt.org/organization/ana	
	//	全日空 フライト時刻表 (Flight timetable of All Nippon Airways)
	//	https://ckan-tokyochallenge.odpt.org/dataset/a-flightschedule-ana
	//	var _ana = _url + '/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:ANA&odpt:calendar=odpt.Calendar:'+_toDay+'&acl:consumerKey=' + _access_token;
	
	//	var _ana = _url + '/api/v4/odpt:FlightInformationDeparture?odpt:operator=odpt.Operator:ANA&acl:consumerKey=' + _access_token;
	//	var _ana = _url + '/api/v4/odpt:FlightInformationArrival?odpt:operator=odpt.Operator:ANA&acl:consumerKey=' + _access_token;

	//	https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:ANA&acl:consumerKey=087a30246b2ff6af6f7199b7dc6c46d49e923067cc4b80969da7fffa886042cc
	//	https://api-tokyochallenge.odpt.org/api/v4/odpt:FlightSchedule?odpt:operator=odpt.Operator:ANA&odpt:calendar=odpt.Calendar:Friday&acl:consumerKey=087a30246b2ff6af6f7199b7dc6c46d49e923067cc4b80969da7fffa886042cc

*/
	

$filename = $operator.'_'.$toDay.'.json';

if ( file_exists( $filename ) ) {
	$dt1_1 = filemtime($filename);
 	$dt1 = date("Y/m/d H:i",$dt1_1);
 	$dt2 =date("Y-m-d H:i");
 	$d1=strtotime($dt1);
 	$d2=strtotime($dt2);
 	$diff = $d2 - $d1;//現在からファイル作成時の日時を引く
 	$diffDay = $diff / 86400;//1日は86400秒
 	if(intval($diffDay)>0){
 		//	前回更新時から1日以上経過している場合
 		$json = file_get_contents( $flightSchedule );

 		//	書き込みモードでオープン
		$fp = fopen($filename, 'w');
		
		// fwriteで文字列を書き込む
		fwrite($fp, $json );

		// ファイルを閉じる
		fclose($fp);
	 
		// ファイルを出力する
		readfile($filename);

 	 }else{//前回更新時から1日未満の場合

		readfile( $filename );
 	 }
} else {
	//	ファイルを読み込む
	$json = file_get_contents( $flightSchedule );

	//	ファイルの新規作成
	touch( $filename );

	//	書き込みモードでオープン
	$fp = fopen($filename, 'w');
	
	// fwriteで文字列を書き込む
	fwrite($fp, $json );

	// ファイルを閉じる
	fclose($fp);
 
	// ファイルを出力する
	readfile($filename);
}



?>