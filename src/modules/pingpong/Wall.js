
var Wall = cc.Class.extend({
    x: 0,
    y: 0,
    passX:0,
    passY:0,

    setPosition:function (x, y, passX, passY){
        this.x = x;
        this.y = y;
        this.passY = passY;
        this.passX = passX;
    }

});

