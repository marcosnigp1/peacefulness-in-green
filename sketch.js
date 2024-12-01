//Peacefulness in green - By Marcos Hernández

//Some material used:
//Mouse constraints: https://www.youtube.com/watch?v=W-ou_sVlTWk
//Compound bodies code from: https://www.youtube.com/watch?v=DR-iMDhUa-0
//Show trails: https://www.youtube.com/watch?v=vqE8DMfOajk
//Sine wave: https://thecodingtrain.com/tracks/the-nature-of-code-2/noc/3-angles/6-graphing-sine-wave

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
let cups = [];

//Bench.
let bench;

//Grass (or floor).
let grass;

// -----------------------------------------

// ------ Perlin Movement related variables ---------

let walker = [];
let random_number;
let seed1 = 30; //Helps in choosing the color pattern
let seed2 = 30; //Helps in choosing the color pattern

// -----------------------------------------------------

// ---- Celular Automata related variables ------

let cells = [];

// ----------------------------------------------

// ----------- Media related variables ----------
let img_bg;
// ----------------------------------------------

// ------ Sine wave related variables ------
let waves = [];

// ----------------------------------------------

function preload() {
  img_bg = loadImage("media/bliss.jpg");
  audio_bg = loadSound("media/audio_bg.mp3"); //Source: https://pixabay.com/sound-effects/highland-winds-fx-56245/
}

function setup() {
  frameRate(60); //A stable frame rate is better than one that is unpredictable.
  let canvas = createCanvas(800, 600); //Not sure if it will have fixed values or it will be responsive.
  audio_bg.loop();
  engine = Engine.create();
  engine.gravity = Vector.create(0, 1);

  runner = Runner.create();

  //Celular automata
  cells.push(new CelularSpawner(int(random(255)), 35, 0, 0));

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
  cups.push(new Cup(360, 50, 5, 60));

  //---------------------------------

  //--------- The circles ---------------

  for (let i = 0; i < 5; i++) {
    circles.push(new Circle(400, 60, 5, 60));
  }

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

  //--------- Sine wave ---------------
  //Parameters: (position X, position Y, R, Angle Velocity, Direction).
  waves.push(new Wave(150, 50, 2, 0.05, 0));
  waves.push(new Wave(650, 80, 2, 0.05, 0));
  waves.push(new Wave(550, 100, 2, 0.05, 1));
  waves.push(new Wave(550, 250, 2, 0.05, 0));
  waves.push(new Wave(550, 150, 2, 0.05, 1));
  waves.push(new Wave(550, 350, 2, 0.05, 1));
}

function draw() {
  push();
  background(img_bg);
  pop();

  // -------------- Matter.js bodies. -------------------------

  Engine.update(engine); //Avoid items clipping through boundaries.

  //The cup
  for (let i = 0; i < cups.length; i++) {
    if (cups[i].body.position.y < 500) {
      let force = createVector(0.001, 0.001);
      cups[i].applyForce(force);
    }
    cups[i].show();
  }

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

    if (circles[i].isOnDirt()) {
      circles[i].change();
      circles[i].spawnPerlinWalker();
    }

    //Check if the circles are in the wind area.
    if (circles[i].body.position.y < 500) {
      let force = createVector(0.00005, 0.00005);
      circles[i].applyForce(force);
    }
  }

  // ------------------------------------------------------------

  // ------------------- Perlin walkers ----------------

  //Draw a new number to check if the walkers should expand or narrow.
  random_number = int(random(0, 100));
  seed1 += 0.01;
  seed2 += 0.02;

  for (let i = 0; i < walker.length; i++) {
    //Show walker first.
    walker[i].show();

    //Move walker upwards until it reaches its Y limit.
    if (walker[i].position.y > walker[i].y_limit) {
      walker[i].position.y -= 1;
      walker[i].move();
    }

    //Increase walker.
    walker[i].lastposition = walker[i].position.y;
  }

  // -------------------------------------------------------------

  ///----------- Celular automata ----------------------

  //Draw celular automata.
  for (let i = 0; i < cells.length; i++) {
    cells[i].draw();

    //Check if it reaches a maximum of 6 repetitions.
    if (cells[i].y > height && cells[i].repetitions != 6) {
      GeneratePattern(); ///Simulate scanlines.
    }
  }

  //---------------------------------------------------------------

  // -------------- Sine wave. -------------------------
  for (let i = 0; i < waves.length; i++) {
    waves[i].show();
  }

  //---------------------------------------------------------------
}

function keyPressed() {
  if (key == "c" || key == "C") {
    //--------- The Cup ---------------
    //Create cup with the pieces together.
    cups.push(new Cup(0, 0, 5, 60));
    //---------------------------------

    //--------- The circles ---------------
    for (let i = 0; i < 5; i++) {
      circles.push(new Circle(0, 0, 5, 60));
    }
    //---------------------------------
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

//For testing purposes.
function keyPressed() {
  if (key == "c" || key == "C") {
    //--------- The Cup ---------------

    //Create cup with the pieces together.
    cups.push(new Cup(360, 50, 5, 60));

    //---------------------------------

    //--------- The circles ---------------

    for (let i = 0; i < 3; i++) {
      circles.push(new Circle(400, 60, 5, 60));
    }

    //---------------------------------
  }
}

//For celular automata.
function GeneratePattern() {
  ///background(0);
  for (let i = 0; i < cells.length; i++) {
    cells[i].ruleValue = int(random(255));
    cells[i].direction = 0;
    cells[i].prepare();
    cells[i].y = 0;
    cells[i].repetitions += 0;
  }
}
