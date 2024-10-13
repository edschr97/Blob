class Point {
  constructor(x, y, treeID, branchID, parent, isLeave) {
    this.x = x;
    this.y = y;
    this.treeID = treeID;
    this.branchID = branchID;
    this.parent = parent;
    this.isLeave = isLeave;
  }

  getTreeID() {
    return this.treeID;
  }

  getBranchID() {
    return this.branchID;
  }

  getParent() {
    return this.parent;
  }
}

class Rectangle {
  constructor(x, y, w, h ,id, bId) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.id = id;
    this.bId = bId;
  }
  
  contains(point) {
    return (point.x >= this.x - this.w &&
            point.x <= this.x + this.w &&
            point.y >= this.y - this.h &&
            point.y <= this.y + this.h);
  }

  intersects(range) {
    return !(range.x - range.w > this.x + this.w ||
        range.x + range.w < this.x - this.w ||
        range.y - range.h > this.y + this.h ||
        range.y + range.h < this.y - this.h);
  }

  getID() {
    return this.id;
  }

  getBId() {
    return this.bId;
  }
}

// circle class for a circle shaped query
class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = this.r * this.r;
  }

  contains(point) {
    // check if the point is in the circle by checking if the euclidean distance of
    // the point and the center of the circle if smaller or equal to the radius of
    // the circle
    let d = Math.pow((point.x - this.x), 2) + Math.pow((point.y - this.y), 2);
    return d <= this.rSquared;
  }

  intersects(range) {

    var xDist = Math.abs(range.x - this.x);
    var yDist = Math.abs(range.y - this.y);

    // radius of the circle
    var r = this.r;

    var w = range.w;
    var h = range.h;

    var edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

    // no intersection
    if (xDist > (r + w) || yDist > (r + h))
      return false;

    // intersection within the circle
    if (xDist <= w || yDist <= h)
      return true;

    // intersection on the edge of the circle
    return edges <= this.rSquared;
  }
}

class QuadTree {
  constructor(boundary, n) {
    this.boundary = boundary;
    this.capacity = n;
    this.points = [];
    this.divided = false;

    //console.log("Tree was made");
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w;
    let h = this.boundary.h;

    let ne = new Rectangle(x + w / 2, y - h / 2, w / 2, h / 2, null);
    this.northeast = new QuadTree(ne, this.capacity);
    let nw = new Rectangle(x - w / 2, y - h / 2, w / 2, h / 2, null);
    this.northwest = new QuadTree(nw, this.capacity);
    let se = new Rectangle(x + w / 2, y + h / 2, w / 2, h / 2, null);
    this.southeast = new QuadTree(se, this.capacity);
    let sw = new Rectangle(x - w / 2, y + h / 2, w / 2, h / 2, null);
    this.southwest = new QuadTree(sw, this.capacity);
    this.divided = true;
    //console.log("Tree contains point");
  }

  insert(point) {
    
    if(!this.boundary.contains(point)) {
      //console.log("Tree does not contain Point");
      return;
    }
    
    
    if (this.points.length < this.capacity) {
      this.points.push(point);
    } else {
      if (!this.divided) {
        this.subdivide();
      }
      
      this.northeast.insert(point);
      this.northwest.insert(point);
      this.southeast.insert(point);
      this.southwest.insert(point);
      //console.log("Points was inserted");
    }
  }


  query(range, found) {
    if(!found) {
      found = [];
    }
    if(!this.boundary.intersects(range)) {
      // empty array
      return;
    } else {
      for(let p of this.points) {

        //count++;
        if(range.contains(p) && range.getID() != p.getTreeID()) {
          //console.log("hallo");
          found.push(p);
          let t = tree[p.getTreeID()];
          let b = t.getBranches();
          let ct = tree[range.getID()];
          let cbL = ct.getBranches();
          let cb = cbL[range.getBId()];
          //console.log(cb);
          b[p.getBranchID()].saveCollisions(true, cb);
          cb.saveCollisions(true,b[p.getBranchID()]);
          // cb.saveCollisions(true, p);
        }
      }

      if(this.divided) {
        this.northwest.query(range, found);
        this.northeast.query(range, found);
        this.southwest.query(range, found);
        this.southeast.query(range, found);
      }

    }
    return found;
  }

  show() {
    stroke(255);
    strokeWeight(0.1);
    noFill();
    rectMode(CENTER);
    rect(this.boundary.x, this.boundary.y, this.boundary.w*2, this.boundary.h*2);
    if (this.divided) {
      this.northwest.show();
      this.northeast.show();
      this.southwest.show();
      this.southeast.show();
    }

    for(let p of this.points) {
      strokeWeight(2);
      point(p.x, p.y);
    }
  }

  getPoint() {
    return this.points;
  }

}
