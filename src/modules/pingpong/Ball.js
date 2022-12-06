
var Ball = cc.Sprite.extend({
    zOrder:300,
    passX:0,
    passY:0,
    direction: cc.p(0, 0),
    minPos: cc.p(0, 0),
    maxPos: cc.p(0, 0),
    speed:0,

    ctor:function (){
        this._super("res/ball.png");
        this.tag = this.zOrder;
        this.scale = SCALE;
        this.passX = this.getBoundingBox().width/2;
        this.passY = this.getBoundingBox().height/2;

        this.generateDirection();
    },

    generateDirection:function(){
        let angle = (Math.random() * (80 - 45) + 45) * Math.PI / 180;
        this.direction.x = Math.cos(angle);
        this.direction.y = Math.sin(angle);
    },

    addMomemtum:function (momemtum){
        let x = this.direction.x + momemtum;
        if(Math.abs(x/this.direction.y) > 50.0){
            //chuan hoa y ~= x/50
            this.direction.y = this.direction.y*(1 + x/(100*Math.abs(this.direction.y)));
        }
        let len = Math.sqrt(x*x + this.direction.y*this.direction.y);
        this.direction.x = x/len;
        this.direction.y = this.direction.y/len;
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
    }
})