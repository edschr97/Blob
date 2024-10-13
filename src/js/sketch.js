// Global Variables ////////////////////////////////////////////////////////////

//UI //////////////////////////
var bg = 52;
var tintStartscreen = 0;
var showQTree = false;
var buttonQT;
var showHB = false;
var buttonHB;

var aBSelection;
var BPSx = [];
var BPSy = [];


// Hands//////////////////////////
var handAmount = 3;                       //Current amount of the Hands in the Screens
var currentHandAmount = 0;
var hands = [];                           //List of the Handsobjects
var handsVisible = [false, false, false, false]; //Information witch Hands a visible

// Blobs ///////////////////

var tree = [];
var max_dist = 100;
var min_dist = 20;
var maxLeaves = 100;
var leaveRadius = 125;
var searchRadius = 10;
var searchSpeed = 10;

// Groups

var group = [];
var groupColor = [];

var blobMaxAmount = 4;
var blobAmount = 0;
var blobs = [];                           //List of the Blobsobjects
let posXh = [0, 0];                       //X Positions of the Hands
let posYh = [0, 0];                       //Y Positions of the Hands

var xPosBlob = []; // List of the X Positions of the Blobs
var yPosBlob = []; // List of the Y Positions of the Blobs

var colorRange = [[0, 250], //R
                  [0, 255], //G
                  [0, 255]];//B

var colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255], [255, 0, 0]];

// Startscreen ///////////////
var startscreen;                          //Variable for the Startscreenobject
var screenFactor = 1.5;
//Tree


// Quadtree

var qtMaxCap = 8;

// Mouse Testing ////////////////////
var mouseIsHolding = null;                //Boolean for Tests with the mouse
var mt = false; // Mouse Test             //Mousetest active


// Load the Startscreen Image ///////////////////////////////////////////////////
function preload() {
    startscreen = loadImage('data/startscreen.png');
    img = loadImage('Input/handKi.jpg')
}

let data = {"amount": 3, "xPos": [150, 255, 290, "yPos": [200, 123, 300]}

function getData() {
  
    
    console.log(data.amount)
    handAmount = data.amount;
    
    if(handAmount > 0) {
        for(let i = 0; i < data.xPos.length; i++) {
            posXh[i] = map(data.xPos[i],0 , 640, 0, width, true);
            posYh[i] = map(data.yPos[i],0 , 480, 0, height, true);;
        }

        for(let i = 0; i < handAmount; i++) {
            hands[i].updatePos(posXh[i],posYh[i]);
        }
    }


}

// Setup /////////////////////////////////////////////////////////////////////////
function setup() {
    const canvas = [
        640,
        480
    ]

    const canvasS = [
        640*screenFactor,
        480*screenFactor
    ]

    createCanvas(canvasS[0], canvasS[1]);
    /* video = createCapture(VIDEO);

    video.size(640, 480);

    video.hide() */
    // Buttons
    buttonHB = createButton("show HB");
    buttonHB.position(10, 10);
    buttonHB.mousePressed(changeHB);

    buttonQT = createButton('show QTree');
    buttonQT.position(80, 10);
    buttonQT.mousePressed(changeQT);

    // DrowpDown

    amountBlob = createSelect("Amount")
    amountBlob.position(10, 50);

    amountBlob.option(0);

    amountBlob.option(1);
    BPSx.push(createSlider(0, canvas[0],  100, 0));
    BPSx[0].position(10,80)
    BPSy.push(createSlider(0, canvas[1], canvas[1]/2, 0));
    BPSy[0].position(155,80)

    amountBlob.option(2);
    BPSx.push(createSlider(0, canvas[0], 250, 0));
    BPSx[1].position(10,100)
    BPSy.push(createSlider(0, canvas[1], canvas[1]/2, 0));
    BPSy[1].position(155,100)

    amountBlob.option(3);
    BPSx.push(createSlider(0, canvas[0], 450, 0));
    BPSx[2].position(10,120)
    BPSy.push(createSlider(0, canvas[1], canvas[1]/2, 0));
    BPSy[2].position(155,120)

    // amountBlob.option(4);
    // BPSx.push(createSlider(0, canvas[0], 600, 0));
    // BPSx[3].position(10,140)
    // BPSy.push(createSlider(0, canvas[1], canvas[1]/2, 0));
    // BPSy[3].position(155,140)
    
    

    //if(!mt){getData();} // if MouseTest

    


    //Creates Handobjects
    for(let i = 0; i < blobMaxAmount; i++) {
        //console.log("new Hand");
        if(mt) {
            hands.push(new Hand(random(50, width - 50),random(50, height - 50), i));
        } else {
            hands.push(new Hand(0,0, i));
        }
    }

    //Create Startscreen Object
    start = new StartScreen(width, height);
}


// Update the Handinformation from the JSON File /////////////////////////////////////

/*
async function getData() {
  
    const response = await fetch('Output/hands.json');
    const data = await response.json();
    handAmount = data.amount;
    
    if(handAmount > 0) {
        for(let i = 0; i < data.xPos.length; i++) {
            posXh[i] = map(data.xPos[i],0 , 640, 0, width, true);
            posYh[i] = map(data.yPos[i],0 , 480, 0, height, true);;
        }

        for(let i = 0; i < handAmount; i++) {
            hands[i].updatePos(posXh[i],posYh[i]);
        }
    }


}
*/


//Every second Load new Data
//if(!mt) {setInterval(function () {getData();}, 1);}




// Draw ///////////////////////////////////////////////////////////////////////////
function draw() {
    getData();
    

    data.amount = amountBlob.value()

    for(let i = 0; i < data.amount; i++) {
        data.xPos[i] = BPSx[i].value()
        data.yPos[i] = BPSy[i].value()
    }
  

    //console.log(frameRate());
    background(bg);
    //image(video, 0, 0, 640*screenFactor, 480*screenFactor)
    background(bg, 250);
    //rectMode(CENTER);
    textSize(20);
    noStroke();
    fill(255, 255);
    text(int(frameRate()), 10, 25);
    noFill();
    strokeWeight(10);
    stroke(200,255,100);
    rectMode(CENTER);
    rect(width/2, height/2, width, height);
    //console.log(blobs.length);
    if(start.getV()) {
        resetBlobs();
    }

    for(let i = 0; i < hands.length; i++) {
        if(i < handAmount) {
            hands[i].drawHand();
            hands[i].setDraw(true);
            hands[i].fixedPos(posXh[i], posYh[i]);
            hands[i].getNearBlob(xPosBlob, yPosBlob);
            handsVisible[i] = true;
        } else {
            hands[i].setDraw(false);
            hands[i].getNearBlob(xPosBlob, yPosBlob);
            handsVisible[i] = false;
        }

    }

    //Trees //////////
    if(tree.length > 0) {
        for(var i = 0; i < tree.length; i++) {
            xPosBlob[i] = tree[i].getPosXTree(); // List of the X Positions of the Blobs
            yPosBlob[i] = tree[i].getPosYTree(); // List of the Y Positions of the Blobs
            tree[i].show();
            if(tree[i].getNearHand(posXh, posYh, handsVisible)) {
                tree[i].grow();
            } else if (tree[i].getBranches().length > 0){
                //console.log("shirnk");
                tree[i].shrink();
            } else if (tree[i].getBranches().length <= 0) {
                deleteTree(i);
            }
        }
    }

    if(handAmount <= 0 && tree.length > 0) {
        for(let i = 0; i < tree.length; i++) {
            if(tree[i].getBranches().length > 0) {
                tree[i].shrink();
            } else {
                deleteTree(i);
            }
        }
    }

    //Quadtree //////////////
    if(tree.length > 0) {
        let boundary = new Rectangle(width/2, height/2, width, height, null);
        let qtree = new QuadTree(boundary, qtMaxCap);
        let childs = [];

        for(let t of tree) {
            let br = t.getBranches();
            var amount = 0;
            for(let b of br) {
                b.setID(amount);
                //console.log("new Point");
                let point = new Point(b.getPos().x, b.getPos().y, t.getID(), amount, b.getChild(), false);
                //console.log(point);
                qtree.insert(point);
                amount++;
                if(!b.getChild()) {
                    //console.log("child");
                    childs.push(point);
                }
            }
            amount = 0;
        }

        if(showQTree) { qtree.show() };

        noFill();
        stroke(255);
        strokeWeight(0.1);
        rectMode(CENTER);

        let points = [];
        let range = [];
        for(let i = 0; i < childs.length; i++) {
            range.push(new Rectangle(childs[i].x, childs[i].y, searchRadius, searchRadius, childs[i].getTreeID(), childs[i].getBranchID()));
            if(showHB) { rect(range[i].x, range[i].y, range[i].w * 2, range[i].h * 2) };
            points.push(qtree.query(range[i]));

            qtree.query(range[i], points[i]);
        }

    }

    start.drawStart(handAmount);
}


//Reset Update Blobs//////////////////////////////////////////////////////////////////////

//If no Hand is visibale, delete all Blobs
function resetBlobs() {
    // blobs.splice(0, blobs.length);
    // tree.splice(0, tree.length);
    // for(let i = 0; i < hands.length; i++) {
    //     hands[i].setNearBlob(false);
    // }
}

//Update the Index from all Blobs if a Blob is deleted
function deleteTree(index) {
    tree.splice(index, 1);
    //console.log(tree.length);
    xPosBlob.splice(index, 1);
    yPosBlob.splice(index, 1);
    // console.log("Tree was deleted");
    // console.log(tree.length);
    for(let i = 0; i < tree.length; i++) {
        tree[i].updateID(i);
        //console.log("Blob new Index: " + tree[i].getID());
        //tree[i].ceckCol();
    }
}


// Setting Buttons ///////////////////

function changeHB() {
    console.log("change");
    showHB = !showHB;
}

function changeQT() {
    console.log("change");
    showQTree = !showQTree;
}

// New Leaves ////////

function mousePressed() {
    for(let t of tree) {
        for(let t2 of tree) {
            if(t !== t2) {
                let branches = t.getBranches();
                t2.newLeaves(branches);
            }
        }
    }
}