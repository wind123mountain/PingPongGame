var EnterName = cc.Layer.extend({
    sprite:null,
    textField: null,
    ctor:function () {

        this._super();

        var size = cc.director.getVisibleSize();

        textField = new ccui.TextField();
        textField.setTouchEnabled(true);
        textField.fontName = "Arial Bold";
        textField.placeHolder = "Enter name here";
        textField.fontSize = 30;
        textField.x = size.width/2;
        textField.y = 2*size.height/3;
        textField.addEventListener(this.textFieldEvent, this);
        this.addChild(textField);

        var btnOK = gv.commonButton(100, 64, size.width/2, 2*size.height/3 - 100,"OK");
        this.addChild(btnOK);
        btnOK.addClickEventListener(this.onSelectOK.bind(this));

        return true;
    },

    textFieldEvent: function(sender, type) {
        switch (type)
        {
            case ccui.TextField.EVENT_ATTACH_WITH_IME:
                cc.log("Activate");

                break;

            case ccui.TextField.EVENT_DETACH_WITH_IME:
                cc.log("Deactivate");

                break;

            case ccui.TextField.EVENT_INSERT_TEXT:
                cc.log("Insert character");
                cc.log(textField.string);

                break;

            case ccui.TextField.EVENT_DELETE_BACKWARD:
                cc.log("Delect character");
                cc.log(textField.string);

                break;
        }
    },

    onSelectOK:function (){
        user = {
            name: textField.string,
            bestScore: 0
        };
        saveUser(user);
        fr.view(ScreenMenu);
    }
});

