
STATE_PLAYING = 1;
PASS = 32;
var Score = 0;

var ScreenPingpong = cc.Layer.extend({
    _ball:null,
    _bar:null,
    _bricks:[],
    _numColumns:0,
    _numRows:0,
    _direction_x:0,
    _direction_y:0,
    _speed:5,
    _interval:0.005,
    momentum:0,
    _state: STATE_PLAYING,
    _leftBounding:0,
    _rightBounding:0,
    _topBoungding:0,
    _bottomBoungding:0,
    _passBoungding:PASS,
    _score:0,
    _lbScore:null,
    _counter: 0,
    _updateTime: 5000,
    _start:false,


    ctor:function() {
        this._super();
        this.init();

    },
    init:function (){
        winSize = cc.director.getVisibleSize();
        this._bricks = [];//???
        this._score = 0;
        this._start = false;

        this._leftBounding = this._passBoungding;
        this._bottomBoungding = 3*this._passBoungding;
        this._rightBounding = winSize.width - this._passBoungding;
        this._topBoungding = winSize.height - this._passBoungding;

        var btnBack = gv.commonButton(100, 64, winSize.width - 70, 52,"Back");
        this.addChild(btnBack);
        btnBack.addClickEventListener(this.onSelectBack.bind(this));

        this.GenerateMap();

        this._lbScore = new cc.LabelTTF("Score: "+this._score,"Arial Bold",21*SCALE);
        this._lbScore.setAnchorPoint(0, 0.5);
        this._lbScore.x = winSize.width/2 - 45;
        this._lbScore.y = 50;
        this._lbScore.color = cc.color(255,0,0);
        this.addChild(this._lbScore,10);

        this._bar = new Bar();
        this.addChild(this._bar, 0);
        this.setPositionThreshold(this._bar);
        this._bar.x = winSize.width/2;
        this._bar.y = this._bar.minPos.y + 3*SCALE;
        this._bar.prePos = this._bar.getPosition();

        this._ball = new Ball();
        this.addChild(this._ball, 0);
        this.setPositionThreshold(this._ball);
        this._ball.x = this._bar.x;
        this._ball.y = this._bar.y + this._bar.passY + this._ball.passY;

        this._direction_x = this._ball.getDirection().x;
        this._direction_y = this._ball.getDirection().y;

        this.addTouchListener();

        // this.schedule(this.updateMomemtum, 0.3);
        // this.schedule(this.update);

        let countdown = 3;
        this._lbCountdown = new cc.LabelTTF(countdown,"Arial Bold",60*SCALE);
        this._lbCountdown.x = winSize.width/2;
        this._lbCountdown.y = 3*winSize.height/4;
        this._lbCountdown.color = cc.color(255,0,0);
        this.addChild(this._lbCountdown,10);

        this.schedule(function() {
            console.log(countdown)

            if(countdown == 0){
                this._lbCountdown.removeFromParent();
                this.startGame();
            }
            else if (countdown > 1) {
                countdown--;
                this._lbCountdown.setString(countdown);
            }
            else if(countdown == 1){
                countdown--;
                this._lbCountdown.setString("GO!");
            }

        }, 0.75, 3, 1.25);

        return true;
    },

    setPositionThreshold:function (object){
        object.setMinPos(this._leftBounding + object.passX, this._bottomBoungding + object.passY);
        object.setMaxPos(this._rightBounding - object.passX, this._topBoungding - object.passY);
    },

    GenerateMap:function (rows = 3){
        brick0 = new Brick();
        let pass = 2;
        let leftX = 0;
        // let Y = this._topBoungding - 25*SCALE;
        let Y = this._topBoungding - pass;
        let rightX = 0;
        let disX = 2 * brick0.passX + pass;
        let disY = 2 * brick0.passY + pass;

        this._numColumns = Math.floor((this._rightBounding - this._leftBounding)/(brick0.getBoundingBox().width + pass));
        this._numRows = Math.floor((this._topBoungding - this._bottomBoungding)/(brick0.getBoundingBox().height + pass)) - 1;

        if (this._numColumns % 2 == 0){
            rightX = winSize.width/2 + brick0.passX + pass/2;
            leftX = winSize.width/2 - brick0.passX - pass/2;
        }
        else{
            rightX = winSize.width/2 + 2*brick0.passX + pass;
            leftX = winSize.width/2 - 2*brick0.passX - pass;
        }

        let active = true;
        for(let r = 0; r < this._numRows; r++) {
            var row_i = [];
            if(r == rows){
                active = false;
            }

            if(this._numColumns % 2 == 1){
                row_i.push(this.GenerateBrick(winSize.width / 2, Y - r * disY, active));
            }

            for (let i = 0; i < Math.floor(this._numColumns / 2); i++) {
                row_i.push(this.GenerateBrick(leftX - i * disX, Y - r * disY, active));

                row_i.push(this.GenerateBrick(rightX + i * disX, Y - r * disY, active));
            }

            this._bricks.push(row_i);
        }

    },

    GenerateBrick:function (positionX, positionY, active = true){
        let brick = new Brick();
        this.addChild(brick, 0);
        this.setPositionThreshold(brick);
        brick.setPosition(cc.p(positionX, positionY));

        if(active){
            brick.Active();
        }
        else {
            brick.inActive();
        }

        return brick;
    },

    startGame:function (){
        this.schedule(this.updateMomemtum, 0.3);
        this.schedule(this.update);
        // this.schedule(this.updateMap, 5);
    },

    update:function(){
       let currPos = this._ball.getPosition();

        currPos = cc.p(currPos.x + this._speed*this._direction_x, currPos.y + this._speed*this._direction_y);
        currPos = cc.pClamp(currPos, this._ball.minPos, this._ball.maxPos);
        this._ball.setPosition(currPos);

        this.onHitWall(currPos);

        this.onHitBrick(currPos);

        if(this.onHitBar(currPos)){
            this._ball.addMomemtum(this.momentum);
            this._direction_x = this._ball.getDirectionX();
            this._direction_y = this._ball.getDirectionY();

            let nextPos = cc.p(currPos.x + this._direction_x, currPos.y + this._direction_y);
            let posMin = cc.p(this._ball.passX, this._bar.y + this._bar.passY + this._ball.passY);
            nextPos = cc.pClamp(nextPos, posMin, this._ball.maxPos);
            this._ball.setPosition(nextPos);
        };

        if(this.gameOver(currPos)){
            console.log("gameOver")
            this.unschedule(this.update);
            this.unschedule(this.updateMomemtum);
            Score = this._score;
            fr.view(GameOver);
        };

    },

    updateMomemtum:function (){
        let deltaX = this._bar.x - this._bar.prePos.x;
        this.momentum = 5*deltaX/winSize.width;
        this._bar.prePos = this._bar.getPosition();
    },

    updateMap:function (){
        for(let i = this._numRows - 2; i > 0; i--){
            for(let j = 0; j < this._numColumns; j++){
                if (this._bricks[i][j].isActive){
                    this._bricks[i][j].inActive();
                    this._bricks[i+1][j].Active();
                }
            }
        }

        for(let j = 0; j < this._numColumns; j++){
            console.log("update 0")
            if (this._bricks[0][j].isActive){
                this._bricks[1][j].Active();
            }
            else {
                this._bricks[0][j].Active();
            }
        }

    },

    onHitBrick:function (ballPos){
        for(let i = 0; i < this._numRows; i++){
            for(let j = 0; j < this._numColumns; j++) {
                if (this._bricks[i][j].isActive) {
                    if (this.onHitObject(ballPos, this._bricks[i][j])) {
                        this._bricks[i][j].destroy();
                        this._score++;
                        this._lbScore.setString("Score: " + this._score);
                        // delete this._bricks[i];
                    }
                }
            }
        }
    },

    updateDirection:function (currPos, minY, maxY, thresholdX){
        let tempY = currPos.y - (currPos.x - thresholdX)*this._direction_y/this._direction_x;

        if(tempY > maxY || tempY < minY){
            this._direction_y = - this._direction_y;
        }
        else if(tempY == maxY || tempY == minY){
            this._direction_x = - this._direction_x;
            this._direction_y = - this._direction_y;
        }
        else {
            this._direction_x = - this._direction_x;
        }
    },

    onHitObject:function (currPos, object){
        let maxY = object.y + object.passY + this._ball.passY;
        let minY = object.y - object.passY - this._ball.passY;
        let maxX = object.x + object.passX + this._ball.passX;
        let minX = object.x - object.passX - this._ball.passX;

        if(currPos.y <= maxY && currPos.y >= minY && currPos.x <= maxX && currPos.x >= minX){
            if(this._direction_x >= 0){
                this.updateDirection(currPos, minY, maxY, minX);
            }
            else {
                this.updateDirection(currPos, minY, maxY, maxX);
            }

            this._ball.setDirection(this._direction_x, this._direction_y);

            return true;
        }

        return false;
    },

    onHitBar:function (currPos){
        if(currPos.y - this._ball.passY <= this._bar.passY + this._bar.y
            && currPos.y + this._ball.passY >= this._bar.passY + this._bar.y
            && currPos.x - this._ball.passX <= this._bar.x + this._bar.passX
            && currPos.x + this._ball.passX >= this._bar.x - this._bar.passX){

            this._direction_y = -this._direction_y;
            this._ball.setDirection(this._direction_x, this._direction_y);

            return true;
        }

        return false;
    },

    onHitWall:function (currPos){
        if(this.isHitTop(currPos)){
            this._direction_y = -this._direction_y;
            this._ball.setDirection(this._direction_x, this._direction_y);
        };

        if(this.isHitRight(currPos) || this.isHitLeft(currPos)){
            this._direction_x = -this._direction_x;
            this._ball.setDirection(this._direction_x, this._direction_y);
        };
    },

    isHitTop:function (currPos){
        if(currPos.y + this._ball.passY >= this._topBoungding){
            return true;
        }
        return false;
    },

    isHitBottom:function (currPos){
        if(currPos.y - this._ball.passY <= this._bottomBoungding){
            return true;
        }
        return false;
    },

    isHitLeft:function (currPos){
        if(currPos.x - this._ball.passX <= this._leftBounding){
            return true;
        }
        return false;
    },

    isHitRight:function (currPos){
        if(currPos.x + this._ball.passX >= this._rightBounding){
            return true;
        }
        return false
    },


    addTouchListener:function(){
        var self = this;
        cc.eventManager.addListener({
            preTouchId: -1,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesMoved:function (touches, event){
                var touch = touches[0];
                if(self.preTouchId != touch.getID()){
                    self.preTouchId = touch.getID();
                }
                else {
                    if(self._state === STATE_PLAYING){
                        var delta = touch.getDelta();
                        var currPos = cc.p(self._bar.x, self._bar.y);
                        currPos = cc.pAdd(currPos, delta);
                        self._bar.x = cc.clampf(currPos.x, self._bar.minPos.x, self._bar.maxPos.x);
                        currPos = null;
                    }
                }
            }
        }, this);
    },

    gameOver:function (currPos){
        if(this.isHitBottom(currPos)){
            return true;
        }
        return false;
    },

    onSelectBack:function(sender) {
        fr.view(ScreenMenu);
    },
});