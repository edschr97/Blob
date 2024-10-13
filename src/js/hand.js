class Hand {
    constructor(x, y, i) {
        //Start Values
        this.x = x;                                     // X Position Blob
        this.y = y;                                     // Y Position Blob

        //Fixpoint
        this.firstPos = [x, y];                         // Position Fixpoint
        this.counter = 0;                               // Counter
        this.counterMax = 100;                          // Max Value for the counter
        this.counterSpeed = 2;                          // The counter increased by 2 per frame
        this.counterSpeedDefault = this.counterSpeed;   // Default value for the speed
        this.counterSpeedEasing = 0.9818;               // Easying for the counter
        this.fixPointColor = [255, 100];                // Color of the fixpoint

        //Blob Info
        this.nearBlob = false;                          // Hand is near a Blob
        this.nearBlobI = null;
        this.handIndex = i;                             // Index of the Hand
        this.drawn = false;                             // Hand is drawn
    }

    //Draw Hand
    drawHand() {
        fill(255);
        noStroke();
        ellipse(this.x, this.y, 20, 20);
        this.fixedPos(this.x, this.y);
    }

    //Update position of the hand
    updatePos(x, y) {

        //console.log("xpos: " + x + ", ypos: " + y);
        this.x = x;
        this.y = y;
    }


    //Create a Fixpoint for the Hand
    fixedPos(x, y) {

        if(this.counter === 0) {
            // set Fixpoint
            //console.log(this.counterSpeed);
            this.firstPos[0] = x;
            this.firstPos[1] = y;
            this.counterSpeed = this.counterSpeedDefault;

        } else if (this.counter >= this.counterMax) {
            // If Counter reaches Max create Blob
            this.counter = 0;
            this.counterSpeed = this.counterSpeedDefault;
            //blobs.push(new Blo(this.x, this.y, blobs.length, this.handIndex));
            let color = [int(random(colorRange[0][0], colorRange[0][1])),
                         int(random(colorRange[1][0], colorRange[1][1])),
                         int(random(colorRange[2][0], colorRange[2][1]))];
            tree.push(new Tree(this.x, this.y, color, tree.length));
            this.nearBlob = true;
            // this.nearBlobI = blobs.length+1;

        } else if (dist(x , y, this.firstPos[0], this.firstPos[1]) > this.counterMax/2) {
            //Set new Fixpoint if distance between Hand and Fixpoint to much
            //console.log("new Pos");
            this.counter = 0;
            this.counterSpeed = this.counterSpeedDefault;
            this.firstPos[0] = x;
            this.firstPos[1] = y;
        }

        //Counter increases
        if(!this.nearBlob) {
            //console.log('counter +1')
            this.counter += this.counterSpeed;
            if(this.counterSpeed >= 0.005) {
                this.counterSpeed *= this.counterSpeedEasing;
            }

        }


        //console.log(this.firstPos[0]);

        //Draw Fixpoint

        noStroke();
        fill(this.fixPointColor[0], this.fixPointColor[1]);
        ellipse(this.firstPos[0], this.firstPos[1],this.counter, this.counter);
        noFill();
        strokeWeight(0.5);
        stroke(this.fixPointColor[0], this.fixPointColor[1]);
        ellipse(this.firstPos[0], this.firstPos[1], this.counterMax, this.counterMax);
    }

    //Set the Information if the Hand is near a Blob
    setNearBlob(near) {
        this.nearBlob = near;

    }

    //Check if a Blob is near this Hand
    getNearBlob(x, y) {
        //Take a Blob
        if(x.length > 0 || y.length > 0) {
            for(let i = 0; i < x.length; i++) {
                //Check if X of Blob is in the Range of X of Hand
                if(x[i] > this.x - 50 && x[i] < this.x + 50) {
                    //Check if Y of Blob is in the Range of X of Hand
                    if(y[i] > this.y - 50 && y[i] < this.y + 50) {
                        //console.log("Blob near Hand");
                        this.nearBlob = true;
                        break;
                    } else {
                        this.nearBlob = false;
                        //console.log("Not Blob near Hand");
                    }
                } else {

                    //console.log("Not Blob near Hand");
                    this.nearBlob = false;
                }
            }
        } else {
            this.nearBlob = false;
        }
        return this.nearBlob;
    }

    //Get the X position of the hand
    getPosXHand() {
        return this.firstPos[0]
    }

    //Get the Y position of the hand
    getPosYHand() {
        return this.firstPos[1]
    }

    //Get the Information if the Hand gets drawn
    getDraw() {
        return this.drawn;
    }

    //Set the Information if the Hand gets drawn
    setDraw(drawn) {
        this.drawn = drawn;
        if(!drawn) {
            this.nearBlob = false;
        }
    }




}