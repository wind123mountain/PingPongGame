
var SettingsLayer = cc.Layer.extend({
    ctor:function(){
        this._super();
        this.init();
    },
    init:function () {
        var sp = new cc.Sprite("res/loading.png");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = 2;
        this.addChild(sp, 0, 1);

        var cacheImage = cc.textureCache.addImage("res/menuTitle.png");
        var title = new cc.Sprite(cacheImage, cc.rect(0, 0, 134, 39));
        title.x = cc.winSize.width / 2;
        title.y = cc.winSize.height - 120;
        this.addChild(title);


        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(18);
        var title1 = new cc.MenuItemFont("Sound");
        title1.setEnabled(false);
        title1.setColor(cc.color(MW.FONTCOLOR));

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var item1 = new cc.MenuItemToggle(
            new cc.MenuItemFont("On"),new cc.MenuItemFont("Off"));
        item1.setCallback(this.onSoundControl);
        item1.setColor(cc.color(MW.FONTCOLOR));
        var state = MW.SOUND ? 0 : 1;
        item1.setSelectedIndex(state);

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(18);
        var title2 = new cc.MenuItemFont("Mode");
        title2.setEnabled(false);
        title2.setColor(cc.color(MW.FONTCOLOR));

        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var item2 = new cc.MenuItemToggle(
            new cc.MenuItemFont("Easy"),
            new cc.MenuItemFont("Normal"),
            new cc.MenuItemFont("Hard"));
        item2.setColor(cc.color(MW.FONTCOLOR));
        item2.setCallback(this.onModeControl);


        cc.MenuItemFont.setFontName("Arial");
        cc.MenuItemFont.setFontSize(26);
        var label = new cc.LabelTTF("Go back", "Arial", 20);
        label.setColor(cc.color(MW.FONTCOLOR));
        var back = new cc.MenuItemLabel(label, this.onBackCallback);
        back.scale = 0.8;

        var menu = new cc.Menu(title1, title2, item1, item2, back);
        menu.alignItemsInColumns(2, 2, 1);
        this.addChild(menu);

        back.y -= 50;

        return true;
    },
    onBackCallback:function (pSender) {
        fr.view(ScreenMenu);
    },
    onSoundControl:function(){
        MW.SOUND = !MW.SOUND;
        var audioEngine = cc.audioEngine;
        if(MW.SOUND){
            audioEngine.playMusic("res/Vexento_LonelyDance.mp3", true);
        }
        else{
            audioEngine.end();
        }
    },
    onModeControl:function(){
        MW.MODE_INDEX = (MW.MODE_INDEX + 1) % MW.MODE.length;
        cc.log(MW.MODE_INDEX)
        cc.log(JSON.stringify(MW.MODE[MW.MODE_INDEX]))
        MW.SCORE = MW.MODE[MW.MODE_INDEX].SCORE;
        MW.DROP_ITEM_RATE = MW.MODE[MW.MODE_INDEX].DROP_ITEM_RATE;
        MW.DELTA_UPDATE_MAP = MW.MODE[MW.MODE_INDEX].DELTA_UPDATE_MAP;
        cc.log("" + MW.SCORE + " " + MW.DROP_ITEM_RATE + " " + MW.DELTA_UPDATE_MAP)
    }
});
