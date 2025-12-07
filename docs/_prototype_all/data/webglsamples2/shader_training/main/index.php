<!DOCTYPE HTML>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes">
<meta name="robots" content="noindex,nofollow,noarchive">
<meta name="keywords" content="">
<meta name="description" content="">
<title>shader</title>
<style>
body{
	margin: 0;
	padding: 0 32px;
	font-family: Georgia;
	border-top: 3px double #000;
}
h1,h2,h3,h4,h5,h6{
	font-weight: normal;
}
p{
    font-size: 12px;
}
li{
    word-wrap: break-word;
}
a{
    text-decoration: none;
}
a:hover{
	background-color: #00F;
	color: #FFF;
}
a span{
    font-size: 11px;
    font-family: Arial;
}
</style>
</head>
<body>
<h1>Shader</h1>
<p>- 自由研究 -</p>
<ol>
<?php
$fileArray = Array();
if ($dir = opendir("./")) {
    while (($file = readdir($dir)) !== false) {
        if ($file != "." && $file != ".." && $file != "index.html" && $file != "index.php" && $file != "js" && $file != "img" && $file != "secret" && $file != "2015-01" && $file != "sound") {
            $fileArray[] = $file;
        }
    }
    closedir($dir);

    sort($fileArray, SORT_STRING);
    foreach ( $fileArray as $key => $value )
    {
        $meta = get_meta_tags($value.'/index.html');
        #$info['description'] = $meta['description'];
        #$info['description'] = mb_convert_encoding( $info['description'], "UFT8", "auto" );

        #$keywords = str_replace("chrome", "【chrome】", $meta['keywords']);
        #$keywords = str_replace("blender", "<strong>【blender】</strong>", $meta['keywords']);
        $description = $meta['description'];

        echo "<li><a href=\"./".$value."/\" title=\"".$description."\">".$value." - ".$description."</a></li>\n";
    }
}
?>
</ol>
</body>
</html>
