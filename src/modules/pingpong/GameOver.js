
var GameOver = cc.Layer.extend({
    _lbScore:0,
    _score:0,

    ctor:function(){
        this._super();
        this._score = Score;
        this.init();
    },

    init:function () {
        var sp = new cc.Sprite("res/loading.png");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = 2;
        this.addChild(sp, 0, 1);

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

        var btnSaveScore = gv.commonButton(200*SCALE, 50*SCALE, 320*SCALE, 380*SCALE,"Menu");
        this.addChild(btnSaveScore);
        btnSaveScore.addClickEventListener(this.onMenu.bind(this));

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

    onMenu:function (){
        fr.view(ScreenMenu);
    },

    setScore:function (score){
        this._score = score;
    }
});

