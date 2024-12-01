class Walker {
  constructor(x, y, w, angle) {
    this.position = createVector(x, y);
    this.angle = angle;

    this.w = w;

    //Stop growing it in the Y axis.
    this.y_limit = int(random(400, 500));

    //Shows the trail. Made with the following help: https://www.youtube.com/watch?v=vqE8DMfOajk
    this.history = [];

    //Variables for the perlin movement.
    this.tx = this.position.x;
    this.ty = this.position.y;

    this.last_position = 0; //Tracks the last position for reference. This avoids that the Perlin movement moves everywhere.
    this.rise = 0; //Controls the map to allow the plant to grow.

    this.free_x = 0; //Frees X space
    this.free_y = 0; //Frees Y space.  Both of them helps to create the illusion of grow.
  }

  show() {
    //Show trail.
    push();
    for (let i = 0; i < this.history.length; i++) {
      let pos = this.history[i];
      ellipse(pos.x, pos.y, this.w);
      noStroke();
      fill(0, 200, 0);
      /* fill(
        map(noise(seed1), 0, 1, 0, width),
        map(noise(seed2), 0, 1, 0, height),
        map(noise(seed1 + seed2), 0, 1, 0, seed1 + seed2)) Commented since it is not required at the moment. It also looks wrong. */
    }
    pop();
  }

  move() {
    this.history.push(createVector(this.position.x, this.position.y));
    this.position.x = map(
      noise(this.tx),
      -30,
      30,
      this.position.x - 10,
      this.position.x + 10
    );
    /* this.position.y = map(noise(this.ty), 0, 1, this.lastposition, 0); */
    this.tx += 0.1;
  }
}
