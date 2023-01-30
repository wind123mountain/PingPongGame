/**
 * Created by GSN on 7/9/2015.
 */
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
    _preBallPos:null,
    _currBallPos:null,
    _speed: 10,
    _updateTime: 500,
    _deltaUpdateMap:0.85,
    _deltaUpdateBallSpeed:5,
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
    _start:false,
    _leftWall:null,
    _rightWall:null,
    _topWall:null,
    _bottomWall:null,
    _listener:null,
    _user:null,
    _thresholdScore:20,
    _overGame:false,
    _ballList:[],
    _numBall: 1,
    _itemXBall: null,

    ctor:function() {
        this._super();
        this.init();
        this.onCountdown();
    },
    init:function (){
        var sp = new cc.Sprite("res/Capture.PNG");
        sp.anchorX = 0;
        sp.anchorY = 0;
        sp.scale = 2;
        this.addChild(sp, 0, 1);

        winSize = cc.director.getVisibleSize();
        this._bricks = [];//???
        this._ballList = [];
        this._score = 0;
        this._start = false;
        this._overGame = false;

        this._leftBounding = this._passBoungding;
        this._bottomBoungding = 3*this._passBoungding;
        this._rightBounding = winSize.width - this._passBoungding;
        this._topBoungding = winSize.height - this._passBoungding;

        var btnBack = gv.commonButton(100, 50, winSize.width - 70, 52,"Back");
        this.addChild(btnBack);
        btnBack.addClickEventListener(this.onSelectBack.bind(this));

        this.GenerateMap();

        this._user = getUserData();

        this._lbScore = new cc.LabelTTF(this._user.name + " " + "Score: "+this._score,"Arial Bold",21*SCALE);
        this._lbScore.setAnchorPoint(0, 0.5);
        this._lbScore.x = winSize.width/2 - 45;
        this._lbScore.y = 50;
        this._lbScore.color = cc.color(255,0,0);
        this.addChild(this._lbScore,10);

        this._bar = new Bar();
        this.addChild(this._bar, 0);
        this.setPositionThreshold(this._bar);
        this._bar.x = winSize.width/2;
        this._bar.y = this._bar.minPos.y + 25*SCALE;
        this._bar.prePos = this._bar.getPosition();

        this._ball = this.generateBall();
        this._numBall = 1;

        this._itemXBall = new ItemXBall();
        this.addChild(this._itemXBall, 0);
        this.setPositionThreshold(this._itemXBall);
        this._itemXBall.destroy();
        this._rateItem = 0.6;

        this.generateWall();

        return true;
    },

    generateBall:function (){
        let ball = new Ball();
        this.addChild(ball, 0);
        this.setPositionThreshold(ball);
        ball.x = this._bar.x;
        ball.y = this._bar.y + this._bar.passY + ball.passY;
        this._ballList.push(ball);

        return ball;
    },

    onXBall:function (xNum = 3){
        while (this._ballList.length < xNum*this._numBall){
            this.generateBall();
        }

        let pass = xNum - 1;

        for(let i = 0; i < this._numBall; i++){
            for(let j = 0; j < pass; j++) {
                this._ballList[this._numBall + i * pass + j].setPosition(this._ballList[i].getPosition());
                if (!this._ballList[this._numBall + i * pass + j].isActive)
                    this._ballList[this._numBall + i * pass + j].Active();
            }
        }

        this._numBall *= xNum;
    },

    generateWall:function (){
        this._rb = new cc.Sprite("res/verticalBouding.png");
        this.addChild(this._rb, 0);
        this._rb.setAnchorPoint(0, 0);
        this._rb.x = this._rightBounding;
        this._rb.y = this._bottomBoungding;

        this._tb = new cc.Sprite("res/topBouding.png");
        this.addChild(this._tb, 0);
        this._tb.setAnchorPoint(0.5, 0);
        this._tb.x = winSize.width/2;
        this._tb.y = this._topBoungding;

        this._lb = new cc.Sprite("res/verticalBouding.png");
        this.addChild(this._lb, 0);
        this._lb.setAnchorPoint(1, 0);
        this._lb.x = this._leftBounding;
        this._lb.y = this._bottomBoungding;

        this._bb = new cc.Sprite("res/bottomBouding.png");
        this.addChild(this._bb, 0);
        this._bb.setAnchorPoint(0.5, 1);
        this._bb.x = winSize.width/2;
        this._bb.y = this._bottomBoungding;

        let passWallX = (this._rightBounding-this._leftBounding)/2;
        let passWallY = (this._topBoungding-this._bottomBoungding)/2;
        let thick = 0;
        this._leftWall = new Wall();
        this._leftWall.setPosition(this._leftBounding-thick, this._bottomBoungding+passWallY, thick, passWallY-2*this._ball.passY);
        this._rightWall = new Wall();
        this._rightWall.setPosition(this._rightBounding+thick, this._bottomBoungding+passWallY, thick, passWallY-2*this._ball.passY);
        this._topWall = new Wall();
        this._topWall.setPosition(this._leftBounding+passWallX, this._topBoungding+thick, passWallX-2*this._ball.passX, thick);
        this._bottomWall = new Wall();
        this._bottomWall.setPosition(this._leftBounding+passWallX, this._bottomBoungding-thick, passWallX-2*this._ball.passX, thick);
    },

    setPositionThreshold:function (object){
        object.setMinPos(this._leftBounding + object.passX, this._bottomBoungding + object.passY);
        object.setMaxPos(this._rightBounding - object.passX, this._topBoungding - object.passY);
    },

    onCountdown:function (){
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
    },

    GenerateMap:function (rows = 3){
        brick0 = new Brick();
        let pass = 2;
        let leftX = 0;
        let Y = this._topBoungding - pass - brick0.passY - 20;
        let rightX = 0;
        let disX = 2 * brick0.passX + pass;
        let disY = 2 * brick0.passY + pass;

        this._numColumns = Math.floor((this._rightBounding - this._leftBounding)/(brick0.getBoundingBox().width + pass));
        this._numRows = Math.floor((this._topBoungding - this._bottomBoungding)/(brick0.getBoundingBox().height + pass)) - 2;

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

        let threshold = new cc.LabelTTF("- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -",
            "Arial Bold",21*SCALE);
        threshold.x = winSize.width/2;
        threshold.y = this._bricks[this._numRows-1][0].y - this._bricks[this._numRows-1][0].passY;
        threshold.color = cc.color(255,0,0);
        this.addChild(threshold,10);

    },

    GenerateBrick:function (positionX, positionY, active = true){
        let brick = new Brick();
        this.addChild(brick, 10);
        this.setPositionThreshold(brick);
        brick.setPosition(cc.p(positionX, positionY));

        if(active){
            brick.Active(1);
        }
        else {
            brick.inActive();
        }

        return brick;
    },

    startGame:function (){
        this.addTouchListener();
        this.schedule(this.updateMomemtum, 0.3);
        this.schedule(this.update);
    },

    update:function() {
        this._counter++;

        if(this._counter >= this._updateTime){
            this._counter = 0;
            this.updateMap();
        }

        if(this._itemXBall.isActive){
            // this.unschedule(this.update)
            // this._ball.destroy();
            this._ball = this._itemXBall;
            this._currBallPos = this._ball.getPosition();
            this._preBallPos = this._ball.getPosition();
            this._direction_x = this._ball.getDirection().x;
            this._direction_y = this._ball.getDirection().y;

            this._currBallPos = cc.p(this._preBallPos.x + this._direction_x, this._preBallPos.y + this._direction_y);
            this._ball.setPosition(this._currBallPos);

            // kiem tra va cham voi thanh hung bong
            if (this.onHitObject(this._preBallPos, this._currBallPos, this._bar)) {
                this._ball.destroy();
                this.onXBall();
            }
            else if(this.isHitBottom()){
                this._ball.destroy();
            }
        }

        for(let i = 0; i < this._numBall; i++) {
            this._ball = this._ballList[i];

            if(!this._ball.isActive){
                continue;
            }

            this._currBallPos = this._ball.getPosition();
            this._preBallPos = this._ball.getPosition();
            this._direction_x = this._ball.getDirection().x;
            this._direction_y = this._ball.getDirection().y;

            if (!this._overGame) {
                this._preBallPos = this._ball.getPosition();
                let PosX = this._preBallPos.x + this._speed * this._direction_x;
                let PosY = this._preBallPos.y + this._speed * this._direction_y;
                this._currBallPos = cc.p(PosX, PosY);
                this._ball.setPosition(this._currBallPos);

                this.onHitBrick();

                // kiem tra va cham voi thanh hung bong
                if (this.onHitObject(this._preBallPos, this._currBallPos, this._bar)) {
                    this._ball.addMomemtum(this.momentum);
                    this._direction_x = this._ball.getDirectionX();
                    this._direction_y = this._ball.getDirectionY();

                    let nextPosition = cc.pAdd(this._ball.getPosition(), this._ball.getDirection());
                    this._ball.setPosition(nextPosition);

                }

                this.onHitWall();

                this.isGameOver();
            }

            if(!this._ball.isActive){
                this._ballList.splice(i, 1);
                this._ballList.push(this._ball);
            }

            if(this._overGame && this._counter == 3){
                this.gameOver();
                return true;
            }
        }
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
                    this._bricks[i+1][j].Active(this._bricks[i][j].live);
                }
            }
        }

        for(let j = 0; j < this._numColumns; j++){
            if (this._bricks[0][j].isActive){
                this._bricks[1][j].Active(this._bricks[0][j].live);
            }
            let live = Math.floor(Math.random()*3+1)%4;
            this._bricks[0][j].Active(live);

            if (this._bricks[this._numRows-1][j].isActive){
                this._overGame = true;
            }
        }

    },

    onHitBrick:function (){
        let hasBrick = false;

        for(let i = this._numRows - 1; i > -1; i--){
            for(let j = 0; j < this._numColumns; j++) {
                if (this._bricks[i][j].isActive) {
                    hasBrick = true;
                    if (this.onHitObject(this._preBallPos, this._currBallPos, this._bricks[i][j])) {
                        this._bricks[i][j].destroy();
                        this._score++;
                        this._lbScore.setString(this._user.name + " " + "Score: " + this._score);

                        if(!this._itemXBall.isActive && Math.random() < this._rateItem){
                            this._itemXBall.setPosition(this._currBallPos);
                            this._itemXBall.Active();
                        }

                        if(this._score%this._thresholdScore == 0 && this._score > 0){
                            this._speed += this._deltaUpdateBallSpeed;
                            this._updateTime *= this._deltaUpdateMap;
                        }
                    }
                }
            }
        }

        if(!hasBrick){
            this.updateMap();
        }
    },

    // tinh giao cua 2 duong thang
    // a1*x + b1*y = c1 (|a1| > 0, |b1| >= 0)
    // a2*x + b2*y = c2 (a2*b2 = 0, |a2| + |b2| = 1)
    intersect:function (a1, b1, c1, a2, b2, c2){
        let intersectionPoint = cc.p(null, null);
        if(a2 == 0){
            intersectionPoint.y = c2;
            intersectionPoint.x = (c1 - b1*intersectionPoint.y)/a1;
        }
        //b2 == 0
        else {
            intersectionPoint.x = c2;
            if(b1 != 0){
                intersectionPoint.y = (c1 - a1*intersectionPoint.x)/b1;
            }
            // b1 == 0 => vo nghiem hoac vo so nghiem
            else {
                console.log("intersect:function()  :  intersectionPoint is null");
            }
        }

        return intersectionPoint
    },

    onLineSegment:function (point, startPoint, endPoint){
        if((startPoint.x <= point.x && point.x <= endPoint.x) || (endPoint.x <= point.x && point.x <= startPoint.x)
        && (startPoint.y <= point.y && point.y <= endPoint.y) || (endPoint.y <= point.y && point.y <= startPoint.y)){
            return true;
        }

        return false;
    },

    onHitObject:function (currPos, nextPos, object){
        let maxY = object.y + object.passY + this._ball.passY;
        let minY = object.y - object.passY - this._ball.passY;
        let maxX = object.x + object.passX + this._ball.passX;
        let minX = object.x - object.passX - this._ball.passX;

        var horizontalIntersecPoint = cc.p(null, null);
        var verticalIntersecPoint = cc.p(null, null);

        let a1 = -this._direction_y;
        let b1 = this._direction_x;
        let c1 = a1*currPos.x + b1*currPos.y;

        if(this._direction_x >= 0 && this._direction_y >= 0){
            horizontalIntersecPoint = this.intersect(a1, b1, c1, 0, 1, minY);
            verticalIntersecPoint = this.intersect(a1, b1, c1, 1, 0, minX);
        }
        else if(this._direction_x <= 0 && this._direction_y <= 0){
            horizontalIntersecPoint = this.intersect(a1, b1, c1, 0, 1, maxY);
            verticalIntersecPoint = this.intersect(a1, b1, c1, 1, 0, maxX);
        }
        else if(this._direction_x < 0 && this._direction_y > 0){
            horizontalIntersecPoint = this.intersect(a1, b1, c1, 0, 1, minY);
            verticalIntersecPoint = this.intersect(a1, b1, c1, 1, 0, maxX);
        }
        else {
            horizontalIntersecPoint = this.intersect(a1, b1, c1, 0, 1, maxY);
            verticalIntersecPoint = this.intersect(a1, b1, c1, 1, 0, minX);
        }

        let isHit = false;
        if(this.onLineSegment(horizontalIntersecPoint, currPos, nextPos)) {

            if (minX <= horizontalIntersecPoint.x && horizontalIntersecPoint.x <= maxX) {
                isHit = true;
                this._direction_y = -this._direction_y;
                this._ball.setPosition(horizontalIntersecPoint);
                this._currBallPos = horizontalIntersecPoint;
            }
        }

        if(this.onLineSegment(verticalIntersecPoint, currPos, nextPos)) {

            if(verticalIntersecPoint.y != null && minY <= verticalIntersecPoint.y && verticalIntersecPoint.y <= maxY){
                isHit = true;
                this._direction_x = -this._direction_x;
                this._ball.setPosition(verticalIntersecPoint);
                this._currBallPos = verticalIntersecPoint;
            }
        }

        this._ball.setDirection(this._direction_x, this._direction_y);

        return isHit;
    },

    onHitWall:function (){
        this.isHitTop();
        this.isHitLeft();
        this.isHitRight();
        // this.isHitBottom();
    },

    isHitTop:function (){
        if(this._currBallPos.y >= this._ball.maxPos.y){
            if(this.onHitObject(this._preBallPos, this._currBallPos, this._topWall))
                return true;
        }
        return false;
    },

    isHitBottom:function (){
        if(this._currBallPos.y <= this._ball.minPos.y){
            if(this.onHitObject(this._preBallPos, this._currBallPos, this._bottomWall)) {
                return true;
            }
        }
        return false;
    },

    isHitLeft:function (){
        if(this._currBallPos.x <= this._ball.minPos.x){
            if(this.onHitObject(this._preBallPos, this._currBallPos, this._leftWall))
                return true;
        }
        return false;
    },

    isHitRight:function (){
        if(this._currBallPos.x >= this._ball.maxPos.x){
            if(this.onHitObject(this._preBallPos, this._currBallPos, this._rightWall)){
                return true;
            }
        }
        return false;
    },


    addTouchListener:function(){
        var self = this;
        this._listener = cc.eventManager.addListener({
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

    saveAndRanking:function (){
        this._user.bestScore = this._score;
        saveUser(this._user);
        rank(this._user);
    },

    isGameOver:function (){
        if(this._overGame && this._counter == 3){
            this.gameOver();
            return true;
        }
        else if(this.isHitBottom()){
            console.log("num "+this._numBall);
            if(this._numBall == 1){
                this._overGame = true;
                this._counter = 0;
            }
            else {
                this._ball.destroy();
                this._numBall--;
            }
            return true;
        }
        return false;
    },

    gameOver:function (){
        console.log("gameOver");
        this.saveAndRanking();
        // cc.eventManager.removeListener(this._listener);
        this.unschedule(this.update);
        this.unschedule(this.updateMomemtum);
        Score = this._score;
        fr.view(GameOver);
    },

    onSelectBack:function(sender) {
        fr.view(ScreenMenu);
    },
});

// if(this._currBallPos.x >= this._ball.maxPos.x){
//     console.log(this._preBallPos.x + " " + this._preBallPos.y)
//     console.log(this._currBallPos.x + " " + this._currBallPos.y)
//     console.log(horizontalIntersecPoint.x + " " + horizontalIntersecPoint.y)
//     console.log(verticalIntersecPoint.x + " " + verticalIntersecPoint.y)
//     console.log("----------------------------")
//
//     var logo = new cc.Sprite("res/ball.png");
//     logo.attr({
//         x: this._preBallPos.x,
//         y: this._preBallPos.y,
//     });
//     this.addChild(logo,10,1);
//
//
//     this.unschedule(this.update);
// }

// if(this._currBallPos.y > this._ball.maxPos.y || this._currBallPos.y < this._ball.minPos.y
//     || this._currBallPos.x > this._ball.maxPos.x || this._currBallPos.x < this._ball.minPos.x){
//     console.log("verticalIntersecPoint")
//     console.log(this._preBallPos.x + " " + this._preBallPos.y)
//     console.log(this._currBallPos.x + " " + this._currBallPos.y)
//     console.log(currPos.x + " " + currPos.y)
//     console.log(nextPos.x + " " + nextPos.y)
//     console.log(minY + " " + maxY)
//     console.log(horizontalIntersecPoint.x + " " + horizontalIntersecPoint.y)
//     console.log(verticalIntersecPoint.x + " " + verticalIntersecPoint.y)
//     console.log("----------------------------")
//
//     this.unschedule(this.update);
// }