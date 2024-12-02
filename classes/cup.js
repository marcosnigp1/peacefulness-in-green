class Cup {
  constructor(x, y, w, h) {
    this.wall_options = {
      isStatic: false,
    };

    this.floor_options = {
      isStatic: false,
    };

    this.w = w;
    this.h = h;

    //Prepare cup elements.
    this.left_wall = Bodies.rectangle(
      x * 1.02,
      y * 0.7,
      w,
      h * 1.5,
      this.wall_options
    );

    this.right_wall = Bodies.rectangle(
      x * 1.18,
      y * 0.7,
      w,
      h * 1.5,
      this.wall_options
    );

    this.floor = Bodies.rectangle(
      x * 1.1,
      y * 1.55,
      w * 11,
      h * 0.1,
      this.floor_options
    );

    ///Put cup pieces together into one body.

    this.body = Body.create({
      parts: [this.floor, this.left_wall, this.right_wall],
      friction: 1,
      frictionAir: 0.1,
    });

    this.floor.plugin.particle = this; //Associated with collisions events.
    this.left_wall.plugin.particle = this; //Associated with collisions events.
    this.right_wall.plugin.particle = this; //Associated with collisions events.

    Composite.add(engine.world, this.body);
  }

  applyForce(force) {
    //Calling Body's applyForce() function
    Body.applyForce(this.body, this.body.position, force);
  }

  removeFromWorld() {
    Composite.remove(engine.world, this.body);
  }

  show() {
    //Get current pos and angles.
    //Left wall.
    push();
    noStroke();
    fill(0, 0, 0, 200);
    translate(this.left_wall.position.x, this.left_wall.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h * 1.5); //The X and Y positions need to be zero.
    pop();

    //Right wall.
    push();
    noStroke();
    fill(0, 0, 0, 200);
    translate(this.right_wall.position.x, this.right_wall.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.w, this.h * 1.5);
    pop();

    //Floor
    push();
    noStroke();
    fill(0, 0, 0, 200);
    translate(this.floor.position.x, this.floor.position.y);
    rotate(this.body.angle);
    rectMode(CENTER);
    rect(0, 0, this.w * 11, this.h * 0.1); //The X and Y positions need to be zero.
    pop();

    //Cup background
    push();
    noStroke();
    fill(0, 0, 0, 100);
    translate(this.body.position.x, this.body.position.y);
    rotate(this.body.angle);
    rect(-30, -45, this.w + 55, this.h * 1.3);
    pop();
  }
}
