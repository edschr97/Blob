function Leaf(x, y) {
  // this.pos = createVector(randomGaussian(x,40), randomGaussian(y,40));
  this.pos = createVector(x, y);
  this.reached = false;
  
  this.show = function() {
    fill(0,255,0);
    noStroke();
    ellipse(this.pos.x, this.pos.y, 4, 4);
  }
  
  this.updateLeaves = function(index) {
    this.leaves.splice(i, 1);
  }

  this.getPos = function() {
    return this.pos;
  }
}