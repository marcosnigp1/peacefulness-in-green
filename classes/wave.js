class Wave {
  constructor(x, y, r, angle_velocity, direction) {
    //I do not think that vectors will be helpful here.
    this.x = x;
    this.y = y;
    this.r = r;
    this.angles = [];
    this.angleV = []; //Angle velocity
    this.angle_velocity = angle_velocity;
    this.direction = direction;

    let total = floor(width / (this.r * 2));
    for (let i = 0; i < total + 1; i++) {
      this.angles[i] = map(i, 0, total, 0, PI);
      this.angleV[i] = this.angle_velocity + i / 100;
    }
  }

  show() {
    push();
    translate(this.x, this.y);
    noFill();
    stroke(255, 255, 255, 100);
    beginShape();

    if (this.direction == 0) {
      for (let i = 0; i < this.angles.length; i++) {
        let y = map(sin(this.angles[i]), -1, 1, -50, 50);
        strokeWeight(0.5);
        let x = map(i, 0, this.angles.length, -750, 700);
        vertex(x, y);
        this.angles[i] += this.angle_velocity;
      }
    } else if (this.direction == 1) {
      for (let i = 0; i < this.angles.length; i++) {
        let y = map(sin(this.angles[i]), -1, 1, -50, 50);
        strokeWeight(2);
        let x = map(i, 0, this.angles.length, 750, -700);
        vertex(x, y);
        this.angles[i] += this.angle_velocity;
      }
    }

    endShape();
    pop();
  }
}
