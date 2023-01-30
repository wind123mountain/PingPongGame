
var ItemXBall = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    direction: null,
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    speed:0,
    isActive: true,

    ctor:function (){
        if (MW.SOUND) {
            cc.audioEngine.playEffect("res/start_game.wav", false);
        }
        this._super("res/x3Item.png");
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;
        this.direction = cc.p(0.0001, -5);
        this.isActive = true;
    },

    destroy:function () {
        this.isActive = false;

        var fade = cc.FadeOut.create(0.1);
        this.runAction(fade);
    },

    Active:function (){
        this.isActive = true;
        this.direction.y = -Math.abs(this.direction.y)

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