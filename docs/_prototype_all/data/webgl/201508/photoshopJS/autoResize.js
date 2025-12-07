//for PhotoshopCS3
preferences.rulerUnits = Units.PIXELS;

//サムネイルの最大サイズ max pixels
maxpx = 960;
//サムネイルを保存するフォルダ名。このスクリプト実行時に聞かれるフォルダの下に作成する。
thumbDir = 'img';

//特定のフォルダ以下のすべてのJPGを開く
var dirObj = Folder.selectDialog("フォルダを選択せよ");
var files = dirObj.getFiles("*.jpg");
var len = files.length
for(var i=0; i<len; i++){
    //ファイル開く
    var theDoc = app.open(files[i]);
    theDoc.changeMode(ChangeMode.RGB);

    //リサイズする
    var w = theDoc.width.value;
    var h = theDoc.height.value;
    if(w > h && w > maxpx){
        theDoc.resizeImage(maxpx, h*(maxpx/w), 72, ResampleMethod.BICUBICSHARPER);
    }else if(h >= w && h > maxpx){
        theDoc.resizeImage(w*(maxpx/h), maxpx, 72, ResampleMethod.BICUBICSHARPER);
    }
    
    
　　//	web用に保存
　　expOpt = new ExportOptionsSaveForWeb();
　　expOpt.format = SaveDocumentType.JPEG;//　画像形式
　　expOpt.includeProfile = false;//　プロファイルの埋め込み
　　expOpt.interlaced　= false;//　インタートレース
　　expOpt.lossy　= 0;
　　expOpt.optimized= true;//　最適化
　　expOpt.quality = 90;//　画質
　　expOpt.matteColor = new RGBColor();//　マットカラー
　　expOpt.matteColor.red = 255;
　　expOpt.matteColor.green = 255;
　　expOpt.matteColor.blue = 255;

   var newDir = new Folder(theDoc.path +'/'+ thumbDir);
   if(! newDir.exists){ newDir.create();}
　　var newFile = new File(theDoc.path +'/'+ thumbDir +'/'+ theDoc.name);
　　
　　activeDocument.exportDocument(newFile, ExportType.SAVEFORWEB, expOpt);
　　activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
