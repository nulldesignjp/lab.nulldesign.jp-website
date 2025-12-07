/*
	imageData.js
*/

//	global name
var imageData = 

(function(){
	//	参考URL
	//	http://blog.drikin.com/2012/04/flickr-1.html
	//	http://blog.drikin.com/2012/03/retinablog.html

	//	class define.
	function ImageData( _apidata )
	{
		this.data;
		this._initialize.apply( this, arguments );
	}

	ImageData.prototype = {
		_initialize	:	function( _apidata )
		{
			this.data = _apidata;
		},
		get date()
		{
			var _date = this.data.datataken;
			_date = _date.replace( new RegExp( '-', 'g' ), '/' );
			return new Date( _date );
		},
		get url()
		{
			return 'http://www.flickr.com/photos/'+this.data.owner+'/'+this.data.id+'/'
		},
		get small()
		{
			//	squareのs
			//	中心部分をトリミングした75x75	
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_s.jpg';
		},
		get thumbnail()
		{
			//	thumbnailのt？
			//	縦横のうち、長い方の辺を100pxにリサイズ
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_t.jpg';
		},
		get middle()
		{
			//	smallのm
			//	縦横のうち、長い方の辺を240pxにリサイズ
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_m.jpg';
		},
		get large()
		{
			//	縦横のうち、長い方の辺を500pxにリサイズ
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'.jpg';
		},
		get medium()
		{
			//	medium(smallでmを使っているから？)
			//	縦横のうち、長い方の辺を640pxにリサイズ
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_z.jpg';
		},
		get big()
		{
			//	bigのb
			//	縦横のうち、長い方の辺を1024pxにリサイズ
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_b.jpg';
		},
		get original()
		{
			//	originalのo
			//	元画像サイズそのまま
			return 'http://static.flickr.com/'+this.data.server+'/'+this.data.id+'_'+this.data.secret+'_b.jpg';
		},
		get tags()
		{
			return this.data.tags;
		},
		get title()
		{
			return this.data.title;
		}
	};

	return ImageData;
})();