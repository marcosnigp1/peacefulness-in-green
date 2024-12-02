//The target is the home, and will be represented as so.
class Target extends Ant {
  constructor(x, y) {
    super(x, y);
    this.r = 100;
  }

  show() {
    //Temporary graphic.
    push();

    fill(255, 0, 0);
    rect(this.position.x - 100, this.position.y - 50, this.r, this.r + 10);

    pop();
  }
}
