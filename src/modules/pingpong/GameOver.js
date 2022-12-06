
var GameOver = cc.Layer.extend({
    _ship:null,
    _lbScore:0,
    _score:0,

    ctor:function(){
        this._super();
        this._score = Score;
        this.init();
    },

    init:function () {
        var logo = new cc.Sprite("res/gameOver.png");
        logo.attr({
            x: 320*SCALE,
            y: 700*SCALE,
            scale: SCALE
        });
        this.addChild(logo,10,1);

        var btnPlayAgain = gv.commonButton(200*SCALE, 50*SCALE, 320*SCALE, 450*SCALE,"Play Again");
        this.addChild(btnPlayAgain);
        btnPlayAgain.addClickEventListener(this.onPlayAgain.bind(this));

        var btnSaveScore = gv.commonButton(200*SCALE, 50*SCALE, 320*SCALE, 380*SCALE,"Save Score");
        this.addChild(btnSaveScore);
        btnSaveScore.addClickEventListener(this.onSaveScore.bind(this));

        var lbScore = new cc.LabelTTF("Your Score : "+this._score, "Arial Bold", 25*SCALE);
        lbScore.x = 320*SCALE;
        lbScore.y = 550*SCALE;
        lbScore.color = cc.color(255,0,0);
        this.addChild(lbScore,10);

        return true;
    },

    onPlayAgain:function () {
        console.log("rePlay");
        fr.view(ScreenPingpong);
    },

    onSaveScore:function (){

    },

    setScore:function (score){
        this._score = score;
    }
});

