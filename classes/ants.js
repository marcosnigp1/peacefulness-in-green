class Ant {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();

    this.maxspeed = 2;
    this.maxforce = 0.2;

    this.r = 10; //Temporary variable.
    this.spawn_control = 0;
  }

  follow(flow) {
    let desired = flow.lookup(this.position);
    desired.setMag(this.maxspeed);

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    this.applyForce(steer);
  }

  update() {
    //Move the Vehicle.
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  arrive(target) {
    let desired = p5.Vector.sub(target, this.position);
    let distance = desired.mag();

    let r = 100;

    if (distance < r) {
      let m = map(distance, 0, r, 0, this.maxspeed);
      desired.setMag(m);
    } else {
      desired.setMag(this.maxspeed);
    }

    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    //this.applyForce(steer);

    return steer;
  }

  evade(vehicle) {
    let pursuit = this.arrive(vehicle);
    pursuit.mult(-1);
    return pursuit;
  }

  boundaries(offset) {
    let desired = null;

    if (this.position.x < offset) {
      desired = createVector(this.maxspeed, this.velocity.y);
    } else if (this.position.x > width - offset) {
      desired = createVector(-this.maxspeed, this.velocity.y);
    }
    if (this.position.y < offset) {
      desired = createVector(this.velocity.x, this.maxspeed);
    } else if (this.position.y > height - offset) {
      desired = createVector(this.velocity.x, -this.maxspeed);
    }

    if (desired !== null) {
      desired.normalize();
      desired.mult(this.maxspeed);
      let steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      this.applyForce(steer);
    }
  }

  show() {
    let angle = this.velocity.heading();

    //Temporary graphic.
    push();
    fill(0, 255, 0);
    translate(this.position.x, this.position.y);
    rotate(angle);
    ant_img.resize(30, 30);
    image(ant_img, this.r, 0);
    pop();
  }
}
