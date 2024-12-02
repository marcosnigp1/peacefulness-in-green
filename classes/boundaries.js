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
    /* fill(150, 75, 0); */
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    image(top_img, -150, -10);
    /* rect(0, 0, this.w, this.h); */
    pop();

    //Draw not interactable left leg
    push();
    noStroke();
    image(leg_1_img, 360, 460);
    pop();

    //Draw not interactable right leg
    push();
    noStroke();
    image(leg_2_img, 615, 460);
    pop();
  }
}
