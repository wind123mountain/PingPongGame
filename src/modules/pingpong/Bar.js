var Bar = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    prePos:cc.p(0,0),

    ctor:function (){
        this._super("res/bar.png");
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;
    },

    getPrePos:function (){
        return this.prePos;
    },

    setPrePos:function (posX, posY){
        this.prePos.x = posX;
        this.prePos.y= posY;
    },

    setMinPos:function (thresholdX, thresholdY){
        this.minPos.x = thresholdX;
        this.minPos.y = thresholdY;
    },

    setMaxPos:function (thresholdX, thresholdY){
        this.maxPos.x = thresholdX;
        this.maxPos.y = thresholdY;
    }

})