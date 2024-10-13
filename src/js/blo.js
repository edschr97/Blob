class Blo {
    constructor(x, y ,i, iH) {
        //Start Values
        this.x = x;                 // X position
        this.y = y;                 // Y position
        this.s = 0;                 // Size/2 = radius
        this.growSpeed = 2;         // Grow speed
        this.maxS = width/2;        // Max size
        this.grow = true;           // Is growing
        this.shrink = false;        // Is shrinking
        this.deleteBlob = false;    // Blob need to be deleted
        this.nearHand = true;       // Blob is near a Hand
        this.nearHandI = iH;        // Blob is near "Index" Hand
        this.blobIndex = i;         // Index of the Blob
        this.collision = false;     // Blob is colliding with an other Blob

        console.log("Blob " + this.blobIndex + " was created");
    }

    drawBlob() {

        //Draw Blob in an other if collaid
        if(this.collision) {

            fill(200,255,100, 200);

        } else {

            fill(200,255,100, 100);

        }

        noStroke();
        ellipse(this.x, this.y, this.s, this.s);

        this.blobGrowth();

    }


    blobGrowth() {

        if(this.s >= 0 && this.s <= this.maxS && this.grow) {
            //Grow if Blob is between 0 and max size and this.grow is true

            this.s += this.growSpeed;
            //console.log("Blob is growing!");

        } else if (this.s >= this.maxS && this.grow ) {
            // do Nothing

            this.grow = false;
            //console.log("Blob stop growing!");

        } else if (this.shrink && this.s >= 0 && !this.nearHand) {
            // Shrink if blob is not near a hand

            this.s -= this.growSpeed;
            //console.log("Blob is shrinking!");

            if(this.s <= 0 && !this.nearHand) {
                // if blob is shrinking and size is smaller equals 0,
                // the blob needs to be deleted

                console.log("Delete blob");
                this.shrink = false;
                this.deleteBlob = true;

            }
        }
    }

    //Check if a Hand is near this Blob
    getNearHand(x = [], y = [], handsVisible) {

        for(let i = 0; i < x.length; i++) {

            if(handsVisible[i] && x[i] > this.x - 50 && x[i] < this.x + 50) {
                //Check if X position of hand is in range

                if(y[i] > this.y - 50 && y[i] < this.y + 50) {
                    //Check if Y position of hand is in range

                    this.nearHand = true;
                    break;

                } else {

                    this.nearHand = false;

                }
            } else {

                this.nearHand = false;

            }
        }

        return this.nearHand;
    }


    getSize() {
        return this.s;
    }

    getPosXBlob() {
        return this.x
    }

    getPosYBlob() {
        return this.y
    }

    setNearHand(nearHand) {
        this.nearHand = nearHand;
    }

    getNearHandI() {
        return this.nearHandI;
    }

    setBlobIndex(i) {
        this.blobIndex = i;
    }

    getBlobIndex() {
        return this.blobIndex;
    }

    getDeleteBlob() {
        return this.deleteBlob;
    }

    setGrow(grow) {
        this.grow = grow;
    }

    getGrow() {
        return this.grow;
    }

    setShrink(shrink) {
        this.shrink = shrink;
    }

    getShrink() {
        return this.shrink;
    }

    setColl(coll) {
        this.collision = coll;
    }

    getColl() {
        return this.collision;
    }
}