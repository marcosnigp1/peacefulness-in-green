class UI {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.w = w;
    this.h = h;
  }

  show() {
    //Button.
    push();
    stroke(255);
    rect(this.position.x, this.position.y, this.w, this.h, 10);
    restart_icon.resize(60, 0);
    image(restart_icon, this.position.x, this.position.y);
    pop();

    //Text.
    push();
    fill(0);
    stroke(255);
    textSize(20);
    text(
      "I feel happy when CUPS fall of the sky.\nThey bring SEEDS for my HAND and planet's joy.",
      230,
      50
    );
    pop();
  }
}
