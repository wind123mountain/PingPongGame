
var ScreenMenu = cc.Layer.extend({
    _itemMenu:null,
    _beginPos:0,
    isMouseDown:false,

    ctor:function() {
        this._super();
        var size = cc.director.getVisibleSize();

        var yBtn = 3*size.height/5;

        var btnPlay = gv.commonButton(200*SCALE, 64*SCALE, cc.winSize.width/2, yBtn,"Play");
        this.addChild(btnPlay);
        btnPlay.addClickEventListener(this.onSelectPlay.bind(this));

    },
    onEnter:function(){
        this._super();
    },

    onSelectPlay:function (sender){
        fr.view(ScreenPingpong);
    }

});