//Peacefulness in green - By Marcos Hernández

//Some material used:
//Mouse constraints: https://www.youtube.com/watch?v=W-ou_sVlTWk
//Compound bodies code from: https://www.youtube.com/watch?v=DR-iMDhUa-0

// MOVE MOST THINGS FROM HERE TO CLASSES.

// ------ Physics related variables ------

let Engine = Matter.Engine,
  //Render = Matter.Render,
  Body = Matter.Body,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composite = Matter.Composite,
  Vector = Matter.Vector,
  Constraint = Matter.Constraint,
  Mouse = Matter.Mouse,
  MouseConstraint = Matter.MouseConstraint;

let mConstraint;

//Inside the physics engine there is a world, where all the bodies are.
let ground;
let engine;
let runner;

//The bodies of Matter.js
let circles = [];

//Cup.
let the_cup;

//Bench.
let bench;

//Grass (or floor).
let grass;

// -----------------------------------------

// ----------- Media related variables ----------
let img_bg;
// ----------------------------------------------

function preload() {
  img_bg = loadImage("media/bliss.jpg");
}

function setup() {
  frameRate(60); //A stable frame rate is better than one that is unpredictable.
  let canvas = createCanvas(800, 600); //Not sure if it will have fixed values or it will be responsive.
  engine = Engine.create();
  engine.gravity = Vector.create(0, 1);

  runner = Runner.create();

  //Logic...

  //--- Mouse interaction ---.
  let canvas_mouse = Mouse.create(canvas.elt);
  canvas_mouse.pixelRatio = pixelDensity(); //Make comfortable when selecting items on the canvas.

  let mouse_options = {
    mouse: canvas_mouse,
  };

  mConstraint = MouseConstraint.create(engine, mouse_options);
  //------------------------------

  //Prepare bodies to show here...

  //--------- The Cup ---------------

  //Create cup with the pieces together.
  the_cup = new Cup(50, 50, 5, 60);

  //---------------------------------

  //----- The bench ---------
  bench = new Bench(500, 450, 300, 20);
  //-------------------------

  //----- The floor ---------
  grass = new Grass(0, 580, 3000, 40);
  //-------------------------

  //Add everything created so far into the engine, and run it.
  Composite.add(engine.world, [mConstraint]);
  Runner.run(runner, engine);

  //This is for the events on collision.
  //Matter.Events.on(engine, "collisionStart", handleCollisions);
}

function draw() {
  push();
  background(255);
  pop();

  Engine.update(engine); //Avoid items clipping through boundaries.

  //Draw cup.
  the_cup.show();

  //Draw grass
  grass.show();

  //Draw bench.
  bench.show();

  //Draw circles.
  for (let i = 0; i < circles.length; i++) {
    //Attract to attractor and then display.
    circles[i].show();
    //Check if there is any geometry outside the canvas.
    if (circles[i].isOffScreen()) {
      circles[i].removeFromWorld();
      circles.splice(i, 1);
      i--; //This fixes the flickering in the code.
    }
  }
}

function keyPressed() {
  if (key == "c" || key == "C") {
    //Parameters (x, y, r).
    circles.push(new Circle(mouseX, mouseY, 5));
  }
}

function handleCollisions(event) {
  //Not yet used.
  /*   for (let pair of event.pairs) {
    let bodyA = pair.bodyA;
    let bodyB = pair.bodyB;

    //Retrieve the particles associated with the colliding bodies via the plugin.
    let particleA = bodyA.plugin.particle;
    let particleB = bodyB.plugin.particle;

    if (particleA instanceof Circle && particleB instanceof Circle) {
      particleA.change();
      particleB.change();
    }

    if (particleA instanceof Boundary && particleB instanceof Circle) {
      particleA.change();
      particleB.change();
      bell.play();
    }
  } */
}
