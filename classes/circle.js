class Circle {
  constructor(x, y, r) {
    let options = {
      friction: 1.2,
      restitution: 0.5,
    };
    this.col = 255;
    this.walker_spawned = 0; //Avoids spawning multiple walkers on one circle.
    this.r = r; //p5js expects a diameter, not a radius.
    this.body = Bodies.circle(x, y, this.r, options);
    let angle = random(TWO_PI);
    let vel = Vector.create(2 * cos(angle), 2 * sin(angle));
    Body.setVelocity(this.body, vel);

    this.body.plugin.particle = this; //Associated with collisions events.
    Composite.add(engine.world, this.body); //Without this, it will not render.
  }

  isOffScreen() {
    let pos = this.body.position;
    if (pos.y > height * 1.1) {
      return true;
    } else {
      return false;
    }
  }

  isOnDirt() {
    let pos = this.body.position;
    if (pos.y > height * 0.92) {
      Body.setStatic(this.body, true);
      return true;
    } else {
      return false;
    }
  }

  spawnPerlinWalker() {
    if (this.walker_spawned == 0) {
      this.body.angle = 10;
      this.walker_spawned = 1;
      walker.push(
        new Walker(
          this.body.position.x,
          this.body.position.y,
          10,
          this.body.angle
        )
      );
    }
  }

  applyForce(force) {
    //Calling Body's applyForce() function
    Body.applyForce(this.body, this.body.position, force);
  }

  removeFromWorld() {
    Composite.remove(engine.world, this.body);
  }

  change() {
    this.col = random(200, 255);
  }

  show() {
    let pos = this.body.position;
    let angle = this.body.angle;

    push();
    stroke(this.col);
    noStroke();
    fill(255, 150, 200, this.col);
    translate(pos.x, pos.y);
    rotate(angle);
    rectMode(CENTER);
    circle(0, 0, this.r * 2); //this.r*2 helps in visualizing correctly the circles.
    pop();
  }
}
