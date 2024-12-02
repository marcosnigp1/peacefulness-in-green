class Grass {
  constructor(x, y, w, h) {
    this.options = {
      isStatic: true,
    };
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(x, y, w, h, this.options);
    this.body.plugin.particle = this; //Associated with collisions events.
    Composite.add(engine.world, this.body);
  }

  show() {
    push();
    noStroke();
    fill(0, 200, 0, 0);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();
  }
}

class Bench extends Grass {
  constructor(x, y, w, h) {
    super(x, y, w, h);
  }

  show() {
    //Draw main base.
    push();
    noStroke();
    fill(150, 75, 0);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);
    pop();

    //Draw not interactable left leg
    push();
    noStroke();
    fill(225, 135, 0);
    rect(360, 460, 20, 80);
    pop();

    //Draw not interactable right leg
    push();
    noStroke();
    fill(225, 135, 0);
    rect(615, 460, 20, 80);
    pop();
  }
}
