class SpawnPoint {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.r = 3;
  }

  display() {
    push();
    fill(0, 0, 255);
    circle(this.position.x, this.position.y, this.r);
    pop();
  }
}
