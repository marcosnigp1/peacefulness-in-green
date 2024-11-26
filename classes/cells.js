class CelularSpawner {
  constructor(ruleValue, w, y, direction) {
    this.cells = [];
    this.ruleValue = ruleValue; ///Preferably 30.
    this.ruleSet;
    this.w = w;
    this.y = y;
    this.direction = direction;
    this.transparency = 0;

    this.history = [];

    this.repetitions = 0; //Amount of repetition to generate patterns.
  }

  prepare() {
    this.ruleSet = this.ruleValue.toString(2).padStart(8, "0");

    let total = width / this.w;
    for (let i = 0; i < total; i++) {
      this.cells[i] = 0;
    }
    this.cells[floor(total / 2)] = 1;
  }

  draw() {
    push();
    for (let i = 0; i < this.cells.length; i++) {
      noStroke();
      fill(255 - this.cells[i] * random(255), 4);
      square(i * this.w, this.y, this.w); //Rect() causes graphical issues.
    }

    this.y += this.w;

    let nextCells = [];
    let len = this.cells.length;

    for (let i = 0; i < this.cells.length; i++) {
      let left = this.cells[(i - 1 + len) % len];
      let right = this.cells[(i + 1 + len) % len];
      let state = this.cells[i]; //This is basically the middle one.
      let newState = this.calculateState(left, state, right);
      nextCells[i] = newState;
    }

    this.cells = nextCells;
    pop();
  }

  calculateState(a, b, c) {
    let ruleset_length = this.ruleSet.length;

    let neighborhood = "" + a + b + c;
    let value = ruleset_length - 1 - parseInt(neighborhood, 2);
    return parseInt(this.ruleSet[value]);
  }
}
