
var Ball = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    direction: null,
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    speed:0,
    isActive: true,

    ctor:function (){
        this._super("res/ball.png");
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;
        this.direction = cc.p(0, 0);
        this.isActive = true;

        this.generateDirection();
    },

    generateDirection:function(){
        // âm thanh hứng trúng bóng vàng bonus x3
        if (MW.SOUND) {
            cc.audioEngine.playEffect("res/bonus.wav", false);
        }
        //sinh goc gau nhieu trong khoang 45 den 135 do
        let angle = (Math.random() * (135 - 45) + 45) * Math.PI / 180;
        // console.log("angle "+angle);
        // let angle = 1.2099794042059493;
        // let angle = 2.2633246370222513;
        // let angle = Math.PI / 4;
        this.direction.x = Math.cos(angle);
        this.direction.y = Math.sin(angle);
    },

    addMomemtum:function (momemtum){
        // âm thanh thanh ngang hứng trúng bóng
        if (MW.SOUND) {
            cc.audioEngine.playEffect("res/ball_bar.wav");
        }
        let x = this.direction.x + momemtum;
        if(Math.abs(x/this.direction.y) > 5.0){
            //chuan hoa |y| = |x|/3
            let direcY = Math.abs(this.direction.x/3);
            if(this.direction.y < 0){
                this.direction.y = -direcY;
            }
        }
        let len = Math.sqrt(x*x + this.direction.y*this.direction.y);
        this.direction.x = x/len;
        this.direction.y = this.direction.y/len;
    },

    destroy:function () {
        this.isActive = false;

        var fade = cc.FadeOut.create(0.1);
        this.runAction(fade);
    },

    Active:function (){
        this.isActive = true;
        this.direction.y = Math.abs(this.direction.y);

        var fade = cc.FadeIn.create(0.000001);
        this.runAction(fade);
    },

    setDirection:function (direcX, direcY){
        this.direction.x = direcX;
        this.direction.y = direcY;
    },

    getDirection:function (){
        return this.direction;
    },

    getDirectionX:function (){
        return this.direction.x;
    },

    getDirectionY:function (){
        return this.direction.y;
    },

    setMinPos:function (thresholdX, thresholdY){
        this.minPos.x = thresholdX;
        this.minPos.y = thresholdY;
    },

    setMaxPos:function (thresholdX, thresholdY){
        this.maxPos.x = thresholdX;
        this.maxPos.y = thresholdY;
    },

})