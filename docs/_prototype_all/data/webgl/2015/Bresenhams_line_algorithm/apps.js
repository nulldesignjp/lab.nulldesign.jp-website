(function(){
    var grid = 20;
    var _canvas,_ctx;
    _canvas = document.createElement('canvas');
    _ctx = _canvas.getContext('2d');
    //$('#container').appned( _canvas );
    document.getElementById('container').appendChild(_canvas);

    var mouse = {x:0,y:0}



    $( window ).on( 'touchmove', function(e){
        mouse.x = e.originalEvent.touches[0].pageX;
        mouse.y = e.originalEvent.touches[0].pageY;
        e.preventDefault();
    });
    $( window ).on( 'touchstart', function(e){
        mouse.x = e.originalEvent.touches[0].pageX;
        mouse.y = e.originalEvent.touches[0].pageY;
        e.preventDefault();
    });


    setInterval(function(){
        var _w = $(window).width();
        var _h = $(window).height();

        var x0 = Math.floor( mouse.x / grid );
        var x1 = Math.floor( _w * .5 / grid );
        var y0 = Math.floor( mouse.y / grid );
        var y1 = Math.floor( _h * .5 / grid );


        var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
        var temp;
        if (steep)
        {
            temp = x0;
            x0 = y0;
            y0 = temp;
     
            temp = x1;
            x1 = y1;
            y1 = temp;
        }
     
        if (x0 > x1)
        {
            temp = x0;
            x0 = x1;
            x1 = temp;
     
            temp = y0;
            y0 = y1;
            y1 = temp;
        }
     
        var dx = x1 - x0;
        var dy = Math.abs(y1 - y0);
        var error = 0.5 * dx;
        var yStep = (y0 < y1) ? 1 : -1;
     
        _ctx.clearRect( 0, 0, _w, _h );
        _ctx.beginPath();
        for (var ty = y0, tx = x0; tx <= x1; tx++)
        {
            if ( steep )
            {
                _ctx.rect(ty * grid,tx * grid,grid-1,grid-1);
            } else {
                _ctx.rect(tx * grid,ty * grid,grid-1,grid-1);
            }
     
            error += dy; 
     
            if (error >= dx)
            {
                error -= dx;
                ty += yStep;
            }
        }
        _ctx.fill();








        //  CIRCLE
        _ctx.beginPath();
        var radius = Math.sin( Date.now() * 0.0025) * 60 + 80;
        var lineWidth = grid - 1;
        var d   = 1 - radius;
        var dH  = 3;
        var dD  = 5 - 2 * radius;
        var cy  = radius;

        var _mx = Math.floor( mouse.x / grid ) * grid;
        var _my = Math.floor( mouse.y / grid ) * grid;

        for (var cx = 0; cx <= cy; cx++) {
            if (d < 0) {
                d   += dH;
                dH  += 2;
                dD  += 2;
            }
            else{
                d   += dD;
                dH  += 2;
                dD  += 4;
                --cy;
            }

            var _cx = Math.floor( cx / grid ) * grid;
            var _cy = Math.floor( cy / grid ) * grid;

            _ctx.rect(_cy + _mx, _cx + _my, lineWidth, lineWidth);
            _ctx.rect(_cx + _mx, _cy + _my, lineWidth, lineWidth);
            _ctx.rect(-_cy + _mx, _cx + _my, lineWidth, lineWidth);
            _ctx.rect(-_cx + _mx, _cy + _my, lineWidth, lineWidth);
            _ctx.rect(-_cy + _mx, -_cx + _my, lineWidth, lineWidth);
            _ctx.rect(-_cx + _mx, -_cy + _my, lineWidth, lineWidth);
            _ctx.rect(_cy + _mx, -_cx + _my, lineWidth, lineWidth);
            _ctx.rect(_cx + _mx, -_cy + _my, lineWidth, lineWidth);
        }
        _ctx.fill();

    },1000/60);

    $( window ).on( 'mousemove',function(e){
        mouse.x = e.originalEvent.pageX;
        mouse.y = e.originalEvent.pageY;
    })


    $( window ).on('resize',function(){ resize();   });
    function resize()
    {
        var _w = $(window).width();
        var _h = $(window).height();

        _canvas.width = _w;
        _canvas.height = _h;


    }
    resize();

// function drawLine( x0, y0, x1, y1 )
// {
//     var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
//     var temp;
//     if (steep)
//     {
//         temp = x0;
//         x0 = y0;
//         y0 = temp;
 
//         temp = x1;
//         x1 = y1;
//         y1 = temp;
//     }
 
//     if (x0 > x1)
//     {
//         temp = x0;
//         x0 = x1;
//         x1 = temp;
 
//         temp = y0;
//         y0 = y1;
//         y1 = temp;
//     }
 
//     var dx = x1 - x0;
//     var dy = Math.abs(y1 - y0);
//     var error = 0.5 * dx;
//     var yStep = (y0 < y1) ? 1 : -1;
 
//     for (var ty = y0, tx = x0; tx <= x1; tx++)
//     {
//         if ( steep )
//         {
//             bd.setPixel(ty, tx, 0x0);
//         } else {
//             bd.setPixel(tx, ty, 0x0);
//         }
 
//         error += dy; 
 
//         if (error >= dx)
//         {
//             error -= dx;
//             ty += yStep;
//         }
//     }
// }

})();