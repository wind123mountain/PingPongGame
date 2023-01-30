
var Brick = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    direction: cc.p(0, 0),
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    speed:0,
    isActive: true,
    state:{
        1:"res/brick2.png",
        2:"res/brick1.png",
        3:"res/brick0.png"
    },
    live:3,

    ctor:function (){
        this._super(this.state[1]);
        this.live = 1;
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;
        this.isActive = true;
    },

    destroy:function () {
        // Âm thanh bóng phá gạch
        if (MW.SOUND) {
            cc.audioEngine.playEffect("res/ball_brick.mp3");
        }
        this.live--;
        if(this.live == 0) {
            this.isActive = false;

            var fade = cc.FadeOut.create(0.2);
            var scale1 = cc.ScaleTo.create(0.2, 0.5);
            var spawn = cc.Spawn.create(scale1, fade);
            var scale2 = cc.ScaleTo.create(0.0000001, 1.0);
            var sep = cc.Sequence.create(spawn, scale2);
            this.runAction(sep);
        }
        else {
            this.setTexture(this.state[this.live]);
        }
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

        var fade = cc.FadeOut.create(0.000001);
        this.runAction(fade);

    },

    Active:function (live){
        this.isActive = true;
        this.live = live;
        this.setTexture(this.state[this.live]);
        var fade = cc.FadeIn.create(0.000001);

        this.runAction(fade);
    }

})