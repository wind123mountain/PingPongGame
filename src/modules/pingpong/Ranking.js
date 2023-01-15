
var Ranking = cc.Layer.extend({

    ctor:function(){
        this._super();

        var sp = new cc.Sprite("res/loading.png");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = 2;
        this.addChild(sp, 0, 1);

        this.init();
    },

    init:function () {
        winSize = cc.director.getVisibleSize();

        var btnBack = gv.commonButton(100, 64, winSize.width - 70, 52,"Back");
        this.addChild(btnBack);
        btnBack.addClickEventListener(this.onSelectBack.bind(this));

        var lbRanking = new cc.LabelTTF("TOP 10 RANKING", "Arial Bold", 50);
        lbRanking.x = winSize.width/2;
        lbRanking.y = 6*winSize.height/7;
        lbRanking.color = cc.color(255,0,0);
        this.addChild(lbRanking,10);

        let ranking = getRanking();

        for(let i = 0; i < ranking.length; i++){
            lbRanking = new cc.LabelTTF(ranking[i].name, "Arial Bold", 25);
            lbRanking.setAnchorPoint(0, 0.5);
            lbRanking.x = winSize.width/4.5;
            lbRanking.y = 3*winSize.height/4 - 30 - i*37;
            lbRanking.color = cc.color(255,0,0);
            this.addChild(lbRanking,10);

            let lbScore = new cc.LabelTTF(""+ranking[i].bestScore, "Arial Bold", 25);
            lbScore.setAnchorPoint(1, 0.5);
            lbScore.x = 3.5*winSize.width/4.5;
            lbScore.y = 3*winSize.height/4 - 30 - i*37;
            lbScore.color = cc.color(255,0,0);
            this.addChild(lbScore,10);

        }

        return true;
    },

    onSelectBack:function(sender) {
        fr.view(ScreenMenu);
    },

});

