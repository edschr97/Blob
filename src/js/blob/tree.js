
function Tree(x, y, color, id) {
  console.log("new Tree");
  this.x = x;
  this.y = y;
  this.start =
  xPosBlob.push(this.x);
  yPosBlob.push(this.y);
  this.leaves = [];
  this.branches = [];
  this.size = 40;
  this.color = color;
  this.mixedColor = [0, 0, 0];
  this.currentColor = [color[0], color[1], color[2]];
  this.switchColor = false;
  this.switchSpeed = 2;
  this.c1 = false;
  this.c2 = false;
  this.c3 = false;
  this.nearHand = true;
  this.id = id;
  this.shrink = false;


  this.colTree = [];
  this.indTree = [];
  this.checkTimer = 0;

  for(var i = 0; i < maxLeaves; i++) {
    this.leaves.push(new Leaf(randomGaussian(this.x, leaveRadius), randomGaussian(this.y, leaveRadius)));
  }
  var pos = createVector(this.x, this.y);
  var dir = createVector(0, -1);
  var root = new Branch(null, pos, dir, this.size, this.currentColor, 0, this.id);
  
  this.branches.push(root);
  
  current = root;
  
  var found = false;
  while(!found) {
    
    for(var i = 0; i < this.leaves.length; i++) {
      var d = p5.Vector.dist(current.pos, this.leaves[i].pos);
      if(d < max_dist) {
        found = true;
      }
    }
    
    if(!found) {
      var branch = current.next();
      current = branch;
      this.branches.push(current);
    }
  }
  
 
  this.grow = function() {

    for(var i = 0; i < this.leaves.length; i++) {
      let leaf = this.leaves[i];
      let closestBranch = null;
      let record = 100;
      
      for(var j = 0; j < this.branches.length; j++) {
        var branch = this.branches[j];
        var d = p5.Vector.dist(leaf.pos, branch.pos);
        if(d < min_dist) {
          leaf.reached = true;
          closestBranch = null;
          break;
        } else if (d > max_dist) {
          
        } else if (closestBranch == null || d < record) {
          closestBranch = branch;
          record = d;
        } 
      }
      
      if(closestBranch != null) {
        let newDir = p5.Vector.sub(leaf.pos, closestBranch.pos);
        newDir.normalize();
        closestBranch.dir.add(newDir);
        closestBranch.count++;
      }
    }
    
    
    for(var i = this.leaves.length - 1 ; i >= 0; i--) {
      if(this.leaves[i].reached) {
        this.leaves.splice(i, 1);
      }
    }
    
    for(var i = this.branches.length - 1 ; i >= 0; i--) {
      let branch = this.branches[i];
      if(branch.count > 0) {
        branch.dir.div(branch.count + 1);
        let newPos = p5.Vector.add(branch.pos, branch.dir);
        this.branches.push(branch.next());
       
      }
      branch.reset();
    }
  }

  this.shrink = function() {
    //console.log("shrink");
    this.branches.splice(this.branches.length - 5, 5);
    if(this.branches.length <= 0) {
      this.leaves.splice(0, this.leaves.length);
    }
  }
  
  this.show = function() {
    // if(this.id == 0) {
    //   console.log(this.colTree);
    // }
    this.checkTimer++;
    if(this.checkTimer >= 1) {
      //console.log("check");
      this.checkTimer = 0;
      this.ceckCol();
    }

    // for(var i = 0; i < this.leaves.length; i++) {
    //   this.leaves[i].show();
    // }
    
    
    for(var i = 0; i < this.branches.length; i++) {
      if(i >= this.branches.length - 1) {
        this.branches[i].show(true, this.currentColor);
      } else {
        this.branches[i].show(false, this.currentColor);
      }
    }
    //console.log(this.branches.length);

    //  color
    if(this.switchColor === true) {
      this.colorFaid();
    }

    fill(this.currentColor[0], this.currentColor[1], this.currentColor[2]);
    ellipse(this.x, this.y, 20, 20);

  }

  this.getBranches = function () {
    return this.branches;
  }

  this.getLeaves = function () {
    return this.leaves;
  }

  this.getNearHand = function(x = [], y = [], handsVisible) {

    for(let i = 0; i < x.length; i++) {

      if(handsVisible[i] && x[i] > this.x - 50 && x[i] < this.x + 50) {
        //Check if X position of hand is in range

        if(y[i] > this.y - 50 && y[i] < this.y + 50) {
          //Check if Y position of hand is in range
          //console.log("Hand near Tree");
          this.nearHand = true;
          break;

        } else {
          //console.log("Hand not near Tree");
          this.nearHand = false;

        }
      } else {
        //console.log("Hand not Tree");
        this.nearHand = false;

      }
    }

    return this.nearHand;
  }

  this.getPosXTree = function () {
    return this.x;
  }

  this.getPosYTree = function () {
    return this.y;
  }

  this.getID = function () {
    return this.id;
  }
  this.updateID = function (id) {
    this.id = id;
    for(let b of this.branches) {
      b.treeID = this.id;
    }
  }

  this.getColTree = function () {
    return this.colTree;
  }

  this.getIndTree = function () {
    return this.indTree;
  }

  this.setColTree = function (treeID) {
    if(this.colTree.indexOf(treeID) === -1) {
      // console.log(treeID.getID());
      // console.log("colide with " + treeID.getID());
      // console.log(this.colTree);
      this.colTree.push(treeID);
      let branches = treeID.getBranches();
      this.newLeaves(branches);
      // console.log("Colide with: " + tree);
      // console.log(this.colTree);
    }
  }

  this.getColor = function () {
    return [this.color[0], this.color[1], this.color[2]]
  }

  this.getCurrentColor = function () {
    return this.currentColor;
  }

  this.getMixedColor = function () {
    return this.mixedColor;
  }


  // Check if an branch still collaiding with a tree in the colWith list
  this.ceckCol = function () {
    // if(this.id === 0) {
    //   console.log(this.colTree);
    // }
    this.newMixedColor();
    let foundTrees = [];
    for(let t of this.colTree) { // Loop trees
      let found = true;

      if(tree.indexOf(t) === -1) {
        //console.log(tree);
        this.colTree.splice(this.colTree.indexOf(t), 1);
        // if(this.id === 0) {console.log(this.colTree) };
        // foundTrees.push(t);
        found = false;
      } else {
        found = true;
      }

      // if(!found) {
      //   foundTrees.push(t);
      //   console.log(t);
      // }
    }

    // if(foundTrees.length > 0) {
    //   for(let fT of foundTrees) {
    //     if(this.colTree.indexOf(fT) === -1) {
    //       //console.log("tree not here");
    //       this.colTree.splice(this.colTree.indexOf(fT), 1);
    //       this.newMixedColor();
    //     } else {
    //       //console.log("tree here");
    //     }
    //   }
    // }
  }


  // Create new color with collisions trees
  this.newMixedColor = function () {
    this.mixedColor = [0, 0, 0]; // reset mixed colo
    //console.log(this.mixedColor);
    let defaultColorR = this.getColor()[0];
    let defaultColorG = this.getColor()[1];
    let defaultColorB = this.getColor()[2];
    //console.log(this.color);
    this.mixedColor[0] += defaultColorR; // Default R value
    this.mixedColor[1] += defaultColorG; // Default G value
    this.mixedColor[2] += defaultColorB; // Default B value
    let amount = 0;
    let otherCol = [];
    for (let i = 0; i < this.colTree.length; i++) {
      let nextColor = this.colTree[i].getColor();
      this.mixedColor[0] += nextColor[0]; // Add R from other tree
      this.mixedColor[1] += nextColor[1]; // Add G from other tree
      this.mixedColor[2] += nextColor[2]; // Add B from other tree

      let colTreeL = this.colTree[i].getColTree();
      let inTreeL = this.colTree[i].getIndTree();

      // for(let iT of this.indTree) {
      //   if(iT === this || colTreeL.indexOf(iT) === -1) {
      //     this.indTree.splice(this.indTree.indexOf(iT), 1);
      //   } else {
      //     this.indTree
      //   }
      // }

      // for(let iT of this.indTree) {
      //   if(iT === this.colTree[i] || iT === this || colTreeL.indexOf(iT) === -1) {
      //     this.indTree.splice(this.indTree.indexOf(iT), 1);
      //   }
      // }

      for(let cT of colTreeL) {
        if(this !== cT) {
          if(this.colTree.indexOf(cT) === -1) {
            // console.log("hallo");
            // if(this.indTree.indexOf((cT)=== -1)) {
            //   this.indTree.push(cT);
            // }
            amount++;
            let oterColor = cT.getColor();
            //console.log(oterColor);
            this.mixedColor[0] += oterColor[0]; // Add R from other tree
            this.mixedColor[1] += oterColor[1]; // Add G from other tree
            this.mixedColor[2] += oterColor[2]; // Add B from other tree
            //if(this.id === 0) { console.log("not"); }
          } else {
            //if(this.id === 0) { console.log("yes"); }
          }
        }
      }
    }



    this.mixedColor[0] = this.mixedColor[0] / (this.colTree.length + amount + 1); // average value of R
    this.mixedColor[1] = this.mixedColor[1] / (this.colTree.length + amount + 1); // average value of G
    this.mixedColor[2] = this.mixedColor[2] / (this.colTree.length + amount + 1); // average value of B
    // if(this.id === 0) {
    //   console.log("Default color: R(" + this.color[0] + ") G(" + this.color[1] + ") B("+ this.color[2] + ")");
    //   console.log("Current color: R(" + this.currentColor[0] + ") G(" + this.currentColor[1] + ") B("+ this.currentColor[2] + ")");
    //   console.log("Mixed   color: R(" + this.mixedColor[0] + ") G(" + this.mixedColor[1] + ") B("+ this.mixedColor[2] + ")");
    // }
    this.switchColor = true;
    this.c1 = false;
    this.c2 = false;
    this.c3 = false;
  }


    //console.log(this.mixedColor);


  this.colorFaid = function () {
    let newC = this.getMixedColor();
    let curC = this.getCurrentColor();
    //console.log("faid color");

    // Color 1 //////////////////
    if(newC[0] < curC[0] && !this.c1) {
      this.currentColor[0] -= this.switchSpeed;
      if(newC[0]>= curC[0]) {
        this.c1 = true;
      }
    } else if(newC[0] >= curC[0] && !this.c1) {
      this.currentColor[0] += this.switchSpeed;
      if(newC[0] <= curC[0]) {
        this.c1 = true;
      }
    }
    // Color 2 //////////////////
    if(newC[1] < curC[1] && !this.c2) {
      //console.log("- Red");
      this.currentColor[1] -= this.switchSpeed;
      if(newC[1]>= curC[1]) {
        this.c2 = true;
      }
    } else if(newC[1] >= curC[1] && !this.c2) {
      //console.log("+ Red");
      this.currentColor[1] += this.switchSpeed;
      if(newC[1] <= curC[1]) {
        this.c2 = true;
      }
    }
    // Color 3 //////////////////
    if(newC[2] < curC[2] && !this.c3) {
      this.currentColor[2] -= this.switchSpeed;
      if(newC[2] >= curC[2]) {
        this.c3 = true;
      }
    } else if(newC[2] >= curC[2] && !this.c3) {
      this.currentColor[2] += this.switchSpeed;
      if(newC[2] <= curC[2]) {
        this.c3 = true;
      }
    }

    if(this.c1 && this.c2 && this.c3) {
      this.switchColor = false;
    }
  }


  this.newLeaves = function (b) {
    for(let i = 0; i < b.length; i+=3) {
      let x = randomGaussian(b[i].pos.x,10);
      let y = randomGaussian(b[i].pos.y,10);
      this.leaves.push(new Leaf(x, y));
    }
  }

  this.newRandomLeave = function () {
    let randomI = int(random(1, this.branches.length -1 ));
    console.log(randomI);
    let x = randomGaussian(this.branches[randomI].pos.x,20);
    let y = randomGaussian(this.branches[randomI].pos.y,20);
    this.leaves.push(new Leaf(x, y));
  }
}

