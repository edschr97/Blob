function Branch(parent, pos, dir, size, color, id , treeID) {
  this.pos = pos;
  this.parent = parent;
  this.hasChild = false;
  this.current = true;
  this.dir = dir;
  this.origDir = this.dir.copy();
  this.count = 0;
  this.len = searchSpeed;
  this.size = size;
  this.s = 0;
  this.pulse = id;
  this.color = color;
  this.mixedColor = this.color;
  this.id = id;
  this.treeID = treeID;
  this.inRange = false;
  this.colWith = [];
  this.shrink = false
  this.delete = false;


  
  this.reset = function() {
    this.dir = this.origDir.copy();
    this.count = 0;
  }
  
  this.next = function() {
    var nextDir = p5.Vector.mult(this.dir, this.len);
    var nextPos = p5.Vector.add(this.pos, nextDir);
    if(this.size > 5) {
      this.size *= 0.96;
    }
    var nextID = this.id + 1;
    var nextBranch = new Branch(this, nextPos, this.dir.copy(), this.size, this.color, nextID, this.treeID);
    this.hasChild = true;
    this.current = false;
    return nextBranch;
  }
  
  this.show = function(last, color) {
    this.color = color;

    stroke(51);
    // strokeWeight(5);
    if(parent != null) {
      //line(this.pos.x, this.pos.y, this.parent.pos.x, this.parent.pos.y);
      noStroke();

      noStroke();
      if(!this.inRange) {
        // fill(color[0], color[1], color[2], this.size*5+sin(this.pulse)*this.size*2);
        fill(color[0], color[1], color[2], 255);
      } else {
        for(let i = 0; i < this.colWith.length; i++) {
          //console.log(this.colWith[i]);
          //console.log(this.colWith[i].treeID);
          //console.log(tree[this.colWith[i].treeID]);
          // if(this.treeID === 0) {
          //   console.log(tree[this.colWith[i].treeID]);
          // }

          if (this.colWith[i].treeID != null && tree[this.colWith[i].treeID].getBranches()[this.colWith[i].id] == null) {
            //console.log("hallo");
            this.inRange = false;
            this.colWith.splice(i, 1);
            //console.log(this.colWith);
          }
          // let cb = tree[this.colWith[i].treeID].getBranches()[this.colWith[i].id];
          // cb.setInRange(true);
        }
        fill(color[0], color[1], color[2], this.size*5+sin(this.pulse)*this.size*2);
        //fill(255, 255);
      }
      ellipse(this.pos.x, this.pos.y, this.s + sin(this.pulse)*this.size/5, this.s+sin(this.pulse)*this.size/5);

      if(!this.shrink) {
        if(this.s < this.size) {
          this.s+=this.size/20;
        }
      }


      this.pulse+=1;
      if(this.pulse>=360) {
        this.pulse = 0;
      }

    }
  }

  this.getPos = function () {
    return this.pos;
  }

  this.setID = function (id) {
    this.id = id;
  }

  this.getID = function () {
    return this.id;
  }

  this.getTreeID = function () {
    return this.treeID;
  }

  this.getChild = function () {
    return this.hasChild;
  }

  this.getColor = function () {
    return this.color;
  }

  this.setInRange = function (inRange) {
    this.inRange = inRange;
  }

  this.saveCollisions = function (inRange, colB) {
    this.inRange = inRange;
    // if(this.colTree.indexOf(colB.getTreeID()) == -1) {
    //   this.colTree.push(colB.getTreeID());
    // }
    // console.log(this.inRange);
    if(this.colWith.indexOf(colB) === -1) {
      // console.log("hallo");

      this.colWith.push(colB);
      if(tree[this.treeID].colTree.indexOf(tree[colB.getTreeID()]) === 1) {
        // console.log("hallo");
        // let branches = tree[colB.getTreeID()].getBranches();
        // tree[this.treeID].newLeaves(branches);
      } else {

        tree[this.treeID].setColTree(tree[colB.getTreeID()]);
        tree[this.treeID].newMixedColor();
      }
      //console.log("Push colB");
    }
  }
}