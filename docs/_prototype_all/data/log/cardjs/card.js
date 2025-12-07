/*
	card.js
*/

var card = function( _imgURL )
{
	//	HTMLElement
	this.view;
	this.core;
	this.img;
	
	//	props
	this.x;
	this.y;
	this._rotation;
	
	this._isPress;
	this._R;
	this._r;
	this._mouse;;
	this._preMouse;
	this._preCard;
	this._vector;
	this._M;
	this._w;
	this._aw;
	this._width;
	this._height;
	this._friction;

	this.clickTime;
	this.isSmartPhone;
	
	this.init.apply( this, arguments );
}

card.mouse = {x:0,y:0};
card.zIndex = 0;

card.prototype = {
	init	:	function( _imgURL )
	{
		
		var _this = this;
		
		this.view = document.createElement('div');
		this.view.className = 'card';
		this.core = document.createElement('div');
		this.core.className = 'cardCore';
		this.img = new Image();

		this.view.appendChild( this.core );
		this.core.appendChild( this.img );
		
		this.x = 0;
		this.y = 0;
		this.rotation = 0;
		
		this.x = Math.floor( $( document ).width() * Math.random() );
		this.y = Math.floor( $( document ).height() * Math.random() );
		this._rotation = Math.random() * Math.PI;
		
		//	props
		this._isPress = false;
		this._preMouse = { x: 0, y: 0 };
		this._preCard = { x: 0, y: 0 };
		this._vector = { x: 0, y: 0 };
		this._w = 0;
		this._aw = 0;
		this._friction = .9600;
		
		this.view.style.cursor = 'pointer';
		
		//	initialize
        this._preMouse.x = 0;
        this._preMouse.y = 0;
        this._preCard.x = this.x;
        this._preCard.y = this.y;
        this._vector.x = Math.random() * 24 - 12;
        this._vector.y = Math.random() * 24 - 12;
        this._w = Math.random() * Math.PI * .06 - Math.PI * .03;

        this.view.style.visibility = 'hidden';

        this.clickTime = 0;

		$( this.img ).load( function(e){
			$( this ).css({
				'top': - parseInt( $( this ).height() * .5 ),
				'left': - parseInt( $( this ).width() * .5 )
			});
			
            _this._width = $( this ).width();
            _this._height = $( this ).height();
            _this._R = Math.sqrt( _this._width * _this._width + _this._height * _this._height );
            _this._M = _this._width * _this._height * .0004;

	        var _ua = navigator.userAgent;
	        if( _ua.indexOf( 'iPhone' ) != -1 || _ua.indexOf('iPad') != -1 || _ua.indexOf('Android') != -1 )
	        {
	        	_this.isSmartPhone = true;
	        }

	        if( _this.isSmartPhone )
	        {
				//	touch event
				$( document ).bind( 'touchmove', function(e){	card.mouse.x = e.originalEvent.touches[0].pageX;	card.mouse.y = e.originalEvent.touches[0].pageY;	e.preventDefault();	});
				$( _this.view ).bind( 'touchstart', function(e){	card.mouse.x = e.originalEvent.touches[0].pageX;	card.mouse.y = e.originalEvent.touches[0].pageY;	_this._onDown( e, _this );	});
				$( document ).bind( 'touchend', function(e){	_this._onUp( e, _this );	});
				//_this.view.addEventListener( 'touchstart', function(e){	card.mouse.x = e.originalEvent.touches[0].pageX;	card.mouse.y = e.originalEvent.touches[0].pageY;	_this._onDown( e, _this );	});
				//document.addEventListener( 'touchend', function(e){	_this._onUp( e, _this );	});
				//$( this.view ).mouseout(function(e){	_this._onUp( e, _this );	});
	        } else {
	        	$( document ).mousemove(function(e){	card.mouse.x = e.pageX;	card.mouse.y = e.pageY;	});
		        $( _this.view ).mousedown(function(e){	_this._onDown( e, _this );	});
		        $( document ).mouseup(function(e){	_this._onUp( e, _this );	});
		        //$( this.view ).mouseout(function(e){	_this._onUp( e, _this );	});
	        }

			_this._update();
			_this.view.style.visibility = 'visible';
			setInterval( function(e){	_this._loop();	}, 1000 / 30 );
		});
		this.img.src = _imgURL;
	},
	_onDown	:	function(e, _path)
	{
        //カードの中心とマウスの距離
        var _dx = $( this.view ).offset().left - card.mouse.x;
        var _dy = $( this.view ).offset().top - card.mouse.y;
        this._r = Math.sqrt( _dx * _dx + _dy * _dy );
        
        var _curMouse = {	x: card.mouse.x, y: card.mouse.y };
        this.x = card.mouse.x;
        this.y = card.mouse.y;
        
		var _prop = {};
		_prop.top = this.y;
		_prop.left = this.x;
		_prop.zIndex = 100;
		$( this.view ).css( _prop );
        
        var _sin = Math.sin( - this._rotation );
        var _cos = Math.cos( - this._rotation );
        
        var __dx = _cos * _dx - _sin * _dy;
        var __dy = _sin * _dx + _cos * _dy;
        $( this.core ).css(	{	'top': __dy,	'left': __dx	} );

		this._isPress = true;
		e.preventDefault();


		//	double click
		var _current = new Date().getTime();

		if( _current - this.clickTime < 400 && this.clickTime > 0 )
		{
			this._doubleClick();
		}

		this.clickTime = _current;

		$( this.img ).addClass('shadow');
		$( this.view ).css({'zIndex':card.zIndex});

		card.zIndex ++;
	},
	_onUp	:	function(e, _path)
	{
		var _cueCard = $( this.core ).offset();
        this.x = _cueCard.left;
        this.y = _cueCard.top;
            
		var _prop = {};
		_prop.top = this.y;
		_prop.left = this.x;
		$( this.view ).css( _prop );
        $( this.core ).css(	{	'top': 0,	'left': 0	} );
            
        //角加速度リセット
        this._aw = 0;
		this._isPress = false;

		$( this.img ).removeClass('shadow');
	},
	_loop	:	function()
	{
        //マウスクリックのグローバル座標
        var _curMouse = { x: card.mouse.x, y: card.mouse.y	};
        if( this._isPress )
        {   
        	var _view = $( this.view ).offset();
        	
        	var _core = $( this.core ).offset();
            var _dx = - parseInt( $( this.core ).css('left') );
            var _dy = - parseInt( $( this.core ).css('top') );
            var _d = this._r;

            //_coreの傾き
            var _rad = Math.atan2( _dy, _dx );
            
            //本体の傾き
            var _angle = this._rotation;
            
            //マウスのベクトルとか
            var _mouseVector = { x: _curMouse.x - this._preMouse.x, y: _curMouse.y - this._preMouse.y };

            //回転行列
            var _sin = Math.sin( - _angle );
            var _cos = Math.cos( - _angle );
            var _mvx = _mouseVector.x * _cos - _mouseVector.y * _sin;
            var _mvy = _mouseVector.x * _sin + _mouseVector.y * _cos;
            
            _sin = Math.sin( 1.57 - _rad );
            _cos = Math.cos( 1.57 - _rad );
            _mouseVector.x = _mvx * _cos - _mvy * _sin;
            _mouseVector.y = _mvx * _sin + _mvy * _cos;
            
            var _f = _mouseVector.x;
            
            //角加速度に反映
            this._aw = ( _f * 2 ) / ( this._M * ( this._R - this._r ) );
            this._w += this._aw;
        
            //カード座標をグローバルに変換してカードの速さを出す
            var _cueCard = {x: _core.left, y:_core.top };
            this._vector.x = _cueCard.x - this._preCard.x;
            this._vector.y = _cueCard.y - this._preCard.y;
            this._preCard.x = _cueCard.x;
            this._preCard.y = _cueCard.y;
            //カードの移動
            this.x = _curMouse.x;
            this.y = _curMouse.y;

        }
        
        
        //空気抵抗で減速処理
        this._w *= this._friction;
        this._vector.x *= this._friction;
        this._vector.y *= this._friction;
        
        //角度に反映　rad2deg
        this._rotation -= this._w;
                
        if( !this._isPress )
        {
            //カードに力を加えずに慣性で動かす
            this.x += this._vector.x;
            this.y += this._vector.y;
        }
        
        //	mouse pos update;
        this._preMouse.x = _curMouse.x;
        this._preMouse.y = _curMouse.y;

        this._zoneCheck();
		this._update();
	},
	_update	:	function()
	{
		var _degree =  this._rotation / Math.PI * 180;
		var _prop = {};
		_prop.top = this.y;
		_prop.left = this.x;
		_prop['-moz-transform'] = 'rotate('+_degree+'deg)';
		_prop['-webkit-transform'] = 'rotate('+_degree+'deg)';
		_prop['-o-transform'] = 'rotate('+_degree+'deg)';
		_prop['-ms-transform'] = 'rotate('+_degree+'deg)';
		
		$( this.view ).css( _prop );
	},
	_zoneCheck	:	function()
	{
		var _w = $( window ).width();
		var _h = $( window ).height();
            if( this.x < 0 )
            {
                this.x = 0;
                this._vector.x *= -1;
            }
            if( this.x > _w )
            {
                this.x = _w;
                this._vector.x *= -1;
            }
            
            if( this.y < 0 )
            {
                this.y = 0;
                this._vector.y *= -1;
            }
            if( this.y > _h )
            {
                this.y = _h;
                this._vector.y *= -1;
            }
	},
	_doubleClick	:	function()
	{
		console.log( this.clickTime, 'double click!' );
	}  
};