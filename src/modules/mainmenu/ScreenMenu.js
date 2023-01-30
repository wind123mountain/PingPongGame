/**
 * Created by GSN on 7/6/2015.
 */

var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();

        var sp = new cc.Sprite("res/loading.png");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = 2;
        this.addChild(sp, 0, 1);

        var size = cc.director.getVisibleSize();

        var yBtn = 3*size.height/5;

        var _lbScore = new cc.LabelTTF("User: "+getUsername(),"Arial Bold",35);
        _lbScore.x = cc.winSize.width/2;
        _lbScore.y = yBtn + 100;
        _lbScore.color = cc.color(255,0,0);
        this.addChild(_lbScore,10);

        var btnPlay = gv.commonButton(200*SCALE, 64*SCALE, cc.winSize.width/2, yBtn,"Play");
        this.addChild(btnPlay);
        btnPlay.addClickEventListener(this.onSelectPlay.bind(this));

        var btnRename = gv.commonButton(200*SCALE, 64*SCALE, cc.winSize.width/2, yBtn - 80,"Rename");
        this.addChild(btnRename)
        btnRename.addClickEventListener(this.onSelectRename.bind(this));

        var btnRanking =  gv.commonButton(200*SCALE, 64*SCALE, cc.winSize.width/2, yBtn - 160,"Ranking");
        this.addChild(btnRanking);
        btnRanking.addClickEventListener(this.onSelectRanking.bind(this));

        var btnRanking =  gv.commonButton(200*SCALE, 64*SCALE, cc.winSize.width/2, yBtn - 240,"Option");
        this.addChild(btnRanking);
        btnRanking.addClickEventListener(this.onSelectOption.bind(this));

        if(MW.SOUND){
            cc.audioEngine.playMusic("res/Vexento_LonelyDance.mp3", true);
        }

    },
    onEnter:function(){
        this._super();
    },

    onSelectPlay:function (sender){
        fr.view(ScreenPingpong);
    },

    onSelectRename:function (sender){
        fr.view(EnterName);
    },

    onSelectRanking:function (sender){
        fr.view(Ranking);
    },

    onSelectOption:function (sender){
        fr.view(SettingsLayer);
    }

});