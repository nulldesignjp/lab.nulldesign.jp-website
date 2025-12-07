/**
    nulldesign
*/

package 
{
    import flash.display.StageAlign;
    import flash.display.StageScaleMode;
    import flash.display.Sprite;
    import flash.events.Event;

    public class idx101201a extends Sprite
    {

        public function idx101201a():void
        {
            // constructor code
            addEventListener( Event.ADDED_TO_STAGE, init );
        }
        
        private function init( e:Event ):void
        {
            removeEventListener( Event.ADDED_TO_STAGE, init );
            addEventListener( Event.REMOVED_FROM_STAGE, remove );
            
            stage.align = StageAlign.TOP_LEFT;
            stage.scaleMode = StageScaleMode.NO_SCALE;
            stage.showDefaultContextMenu = false;
            
            var _w:uint = stage.stageWidth;
            var _h:uint = stage.stageHeight;
            
            for( var i:uint = 0; i < 3; i++ )
            {
                var _c:PhysicsCard = new PhysicsCard();
                _c.x = int( Math.random() * _w );
                _c.y = int( Math.random() * _h );
                addChild( _c );
            }
            
        }
        
        private function remove( e:Event ):void
        {
            removeEventListener( Event.ADDED_TO_STAGE, init );
            removeEventListener( Event.REMOVED_FROM_STAGE, remove );
        }

    }

}


    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.MouseEvent;
    import flash.geom.Point;
    
    class PhysicsCard extends Sprite
    {
        //クリックしてるかどうか
        private var _isPress:Boolean = false;
        
        //カードの半径
        private var _R:Number;
        
        //クリック時の半径
        private var _r:Number;
        
        //前のマウス座標
        private var _preMouse:Point;
        
        //前のカード座標
        private var _preCard:Point;
        
        //カードの速度
        private var _vector:Point;
        
        //カードの質量
        private var _M:Number = 0;
        
        //角速度
        private var _w:Number = 0;
        
        //角加速度
        private var _aw:Number = 0;
        
        //角度
        private var _rotation:Number = 0;
        
        //カードの中身
        private var _point:Sprite;
        private var _core:Sprite;
        private var _width:Number;
        private var _height:Number;
        
        //空気抵抗
        private var _friction:Number = .9600;
        
        
        
        public function PhysicsCard( _w:Number = 180, _h:Number = 60 ):void
        {
            this._width = _w;
            this._height = _h;
            this._R = Math.sqrt( _w * _w + _h * _h );
            this._M = _w * _h * .00098;
            
            //カードのグラフィック
            _core = new Sprite();
            _drawPseudoCard( _core );
            addChild( _core );
            //カードのグラフィックここまで
            
            //プロパティーもろもろ
            _preMouse = new Point();
            _preCard = new Point();
            _vector = new Point();
            
            addEventListener( Event.ADDED_TO_STAGE, _initialize );
        }
        
        private function _drawPseudoCard( e:Sprite ):void
        {
            e.graphics.lineStyle( 0, 0xCCCCCC, 1, false, "none" );
            e.graphics.beginFill( 0xFFFFFF );
            e.graphics.drawRect( -_width * .5, -_height* .5, _width, _height );
            e.graphics.endFill();
        }
        
        private function _initialize( e:Event ):void
        {
            this.buttonMode = true;
            
            //初期化
            _preMouse.x = mouseX;
            _preMouse.y = mouseY;
            _preCard.x = this.x;
            _preCard.y = this.y;
            
            start();
        }
        
        public function start():void
        {
            stop();
            addEventListener( Event.ENTER_FRAME, _update );
            addEventListener( MouseEvent.MOUSE_DOWN, _onDown );
            addEventListener( MouseEvent.MOUSE_UP, _onClick );
            addEventListener( Event.MOUSE_LEAVE, _onClick );
        }
        
        public function stop():void
        {
            removeEventListener( Event.ENTER_FRAME, _update );
            removeEventListener( MouseEvent.MOUSE_DOWN, _onDown );
            removeEventListener( MouseEvent.MOUSE_UP, _onClick );
        }
        
        private function _update( e:Event ):void
        {
            
            //マウスクリックのグローバル座標
            var _curMouse:Point = this.localToGlobal( new Point( this.mouseX, this.mouseY ) );
            if( _isPress )
            {
                
                var _dx:Number = this._core.x;
                var _dy:Number = this._core.y;
                var _d:Number = _r;

                trace( 1, _dx, _dy );
                
                //_coreの傾き
                var _rad:Number = Math.atan2( _dy, _dx );
                
                //本体の傾き
                var _angle:Number = this.rotation / 180* Math.PI;
                
                //マウスのベクトルとか
                var _mouseVector:Point = new Point( _curMouse.x - _preMouse.x, _curMouse.y - _preMouse.y );
                var _sin:Number = Math.sin( - _angle );
                var _cos:Number = Math.cos( - _angle );
                
                
                //回転行列
                var _mvx:Number = _mouseVector.x * _cos - _mouseVector.y * _sin;
                var _mvy:Number = _mouseVector.x * _sin + _mouseVector.y * _cos;
                
                _sin = Math.sin( 1.57 - _rad );
                _cos = Math.cos( 1.57 - _rad );
                _mouseVector.x = _mvx * _cos - _mvy * _sin;
                _mouseVector.y = _mvx * _sin + _mvy * _cos;
                
                var _f:Number = _mouseVector.x;
                
                //角加速度に反映
                _aw = ( _f * 2 ) / ( _M * ( _R - _r ) );
                _w += _aw;
            
                //カード座標をグローバルに変換してカードの速さを出す
                var _cueCard:Point = this.localToGlobal( new Point( _core.x, _core.y ) );
                _vector.x = _cueCard.x - _preCard.x;
                _vector.y = _cueCard.y - _preCard.y;
                _preCard = _cueCard;
                
                //カードの移動
                this.x = _curMouse.x;
                this.y = _curMouse.y;
            }
            
            //空気抵抗で減速処理
            this._w *= _friction;
            this._vector.x *= _friction;
            this._vector.y *= _friction;
            
            //角度に反映　rad2deg
            
            this.rotation += _w * 180 / Math.PI;
            
            
            if( !_isPress )
            {
                //カードに力を加えずに慣性で動かす
                this.x += this._vector.x;
                this.y += this._vector.y;
            }
            
            zoneCheck();
            
            _preMouse = _curMouse;
        }
        
        private function _onDown( e:MouseEvent ):void
        {
            addEventListener(MouseEvent.MOUSE_UP, _onClick);
            stage.addEventListener(MouseEvent.MOUSE_UP, _onClick);

            //クリックされたら一番手前にする
            parent.setChildIndex( this, parent.numChildren -  1 );
            
            //カードの中心とマウスの距離
            var _dx:Number = this.mouseX;
            var _dy:Number = this.mouseY;
                trace( 0, _dx, _dy );
            
            _r = Math.sqrt( _dx * _dx + _dy * _dy );
            
            
            var _curMouse:Point = this.localToGlobal( new Point( this.mouseX, this.mouseY ) );
            this.x = _curMouse.x;
            this.y = _curMouse.y;
            
            this._core.x = - _dx;
            this._core.y = - _dy;
            
            //押してますよ
            _isPress = true;
            
        }
        
        private function _onClick( e:MouseEvent ):void
        {
            removeEventListener(MouseEvent.MOUSE_UP, _onClick);
            stage.removeEventListener(MouseEvent.MOUSE_UP, _onClick);

            var _cueCard:Point = this.localToGlobal( new Point( _core.x, _core.y ) );
            this.x = _cueCard.x;
            this.y = _cueCard.y;
            this._core.x = 0;
            this._core.y = 0;
            
            //角加速度リセット
            _aw = 0;
            
            //離しましたYo!
            _isPress = false;
        }
        
        private function zoneCheck():void
        {
            if( this.x < 0 )
            {
                this.x = 0;
                this._vector.x *= -1;
            }
            if( this.x > stage.stageWidth )
            {
                this.x = stage.stageWidth;
                this._vector.x *= -1;
            }
            
            if( this.y < 0 )
            {
                this.y = 0;
                this._vector.y *= -1;
            }
            if( this.y > stage.stageHeight )
            {
                this.y = stage.stageHeight;
                this._vector.y *= -1;
            }
        }
        
        public function set w( e:Number ):void
        {
            _w = e;
        }
        
        public function get w():Number
        {
            return _w;
        }
        
        public function set vx( e:Number ):void
        {
            _vector.x = e;
        }
        
        public function get vx():Number
        {
            return _vector.x;
        }
        
        public function set vy( e:Number ):void
        {
            _vector.y = e;
        }
        
        public function get vy():Number
        {
            return _vector.y;
        }
    }