
var Brick = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    direction: cc.p(0, 0),
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    speed:0,
    isActive: true,

    ctor:function (){
        this._super("res/brick.png");
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;
        this.isActive = true;
    },

    destroy:function () {
        this.isActive = false;

        var fade = cc.FadeOut.create(0.3);
        var scale1 = cc.ScaleTo.create(0.3, 0.5);
        var spawn = cc.Spawn.create(scale1, fade);
        var scale2 = cc.ScaleTo.create(0.1, 1.0);
        var  sep = cc.Sequence.create(spawn, scale2);
        this.runAction(sep);
        // setTimeout(this.removeFromParent(), 750);

    },

    setMinPos:function (thresholdX, thresholdY){
        this.minPos.x = thresholdX;
        this.minPos.y = thresholdY;
    },

    setMaxPos:function (thresholdX, thresholdY){
        this.maxPos.x = thresholdX;
        this.maxPos.y = thresholdY;
    },

    inActive:function (){
        this.isActive = false;

        var fade = cc.FadeOut.create(0.0);
        this.runAction(fade);

    },

    Active:function (){
        this.isActive = true;

        var fade = cc.FadeIn.create(0.0);
        this.runAction(fade);
    }

})