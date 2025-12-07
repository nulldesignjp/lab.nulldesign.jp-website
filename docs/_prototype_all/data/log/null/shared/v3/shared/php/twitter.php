<?php
if( $_GET['page'] )
{
	$page = $_GET['page'];
} else {
	$page = 1;
}
readfile("http://api.twitter.com/1/statuses/user_timeline.xml?screen_name=nulldesign&count=100&page=".$page);
?>