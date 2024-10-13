class StartScreen {
    constructor(x, y) {
        this.x = x;                                 //Canvas Width
        this.y = y;                                 //Canvas Height
        this.a = 255;                               //Alpha Value
        this.v = false;                             //Text is visible a = 255
        this.change = false;                        //need Fade
        this.h = false;                             //Hand in the Screen
        this.title =  "PUT YOUR HAND ON THE TABLE"  //Text
        this.texSize = 30;                          //Text Size
        this.f = [255, 255, 255];                   //Text Color
        this.s = 20;                                //Fading speed
        this.r = 0;

        //Border

        this.xPos = [];
        this.yPos = height;
        this.xPos.push(0);
    }

    //Draw the startscreen
    drawStart(handAmount) {
        // textAlign(CENTER, CENTER);
        // fill(this.f[0], this.f[1], this.f[2], this.a);
        // textSize(this.texSize);
        // noStroke();
        // text(this.title, this.x/2, this.y/2);

        //Border
        push();

        translate(width/2, height/2);
        angleMode(DEGREES);
        rotate(this.r);
        scale(1);

        imageMode(CENTER);

        tint(200,255,100, this.a);
        image(startscreen, 0, 0);

        this.r+=0.25;
        if(this.r >= 360) {
            this.r = 0;
        }

        pop();

        // this.checkIfHands(handAmount);
        if(this.needChange() ||  this.checkIfHands(handAmount)) {
            this.fading();
        }
    }

    // Check hands in canvas
    checkIfHands(handamount) {
        if(handamount > 0) {
            this.h = true;      // Hands in Canvas
        } else {
            this.h = false;     // Hands not in Canvas
        }
    }

    //Check change
    needChange() {
        if(this.a > 0 && this.a < 255) { // Alpha is no 0 or 255
            return this.change = true;
        } else if (!this.h && !this.v || this.h && this.v) { //
            return this.change = true;  //Fading is needing
        } else {
            return this.change = false; //Fading is no needing
        }
    }

    // Fading animation
    fading() {
        if(!this.v){ // Fading in
            //console.log("fading in");
            this.a += this.s;
            if(this. a >= 255) {
                this.change = false;
                this.v = true;
            }
        } else if(this.v){ // Fading out
            //console.log("fading out");
            this.a -= this.s;
            if(this.a <= 0) {
                this.change = false;
                this.v = false;
            }
        }
    }

    getV() {
        return this.v;
    }
}
