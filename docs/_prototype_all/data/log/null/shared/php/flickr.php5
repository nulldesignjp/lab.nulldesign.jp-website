<?php
define (APIKEY , "d4eb16f01f273977fbe3972962e1646e");

#	http://www.flickr.com/services/api/misc.urls.html

$url = "http://www.flickr.com/services/rest/?"
	 . "method=flickr.photos.search"
	 . "&format=rest"
	 . "&api_key=".APIKEY
	 . "&per_page=500"
	 . "&user_id=35921197@N04"
	 //. "&sort=date-posted-desc"
	 //. "&license=1,2,3,4,5,6"
	 //. "&extras=owner_name"
	 //. "&text=".urlencode($searchWord);
	 . "&tags=square"
	 . "&cache=".rand(0, 1000);

$xml = @simplexml_load_file($url);
//print_r($xml);


echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
echo "<flickr>";
foreach($xml->photos->photo as $photoValue){
	echo "<entry>";
	$farmId = $photoValue['farm'];
	$serverId = $photoValue['server'];
	$photoId = $photoValue['id'];
	$secret = $photoValue['secret'];
	$owner = $photoValue['owner'];
	$ownername = $photoValue['ownername'];
	$title = $photoValue['title'];
	//改行はレイアウトのため
	echo "<farmId>".$farmId."</farmId>";
	echo "<serverId>".$serverId."</serverId>";
	echo "<photoId>".$photoId."</photoId>";
	echo "<secret>".$secret."</secret>";
	echo "<title>".$title."</title>";
	echo "</entry>";
}
echo "</flickr>";
?>