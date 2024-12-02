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

// ----------- media related variables ----------

//Images
let img_bg;
let ant_img;
let audio_bg;
let leg_1_img;
let leg_2_img;
let top_img;

//Sounds
let glasshit_1; //Different glass hit sound variations, since heavier objects would sound louder.
let glasshit_2;
let dirt;
let pebbleonpebble;
let wood_1; //Different wood sound variations, since heavier objects would sound louder.
let wood_2;
// ----------------------------------------------

// ------ Sine wave related variables ------
let waves = [];
// ----------------------------------------------

// ------ Ant related variables --------------
let ants_1 = [];
let ants_2 = [];
let offset = 30; //Avoids the ants from going off screen.
let target_1;
let target_2;
let spawn_1;
let spawn_2;
// ----------------------------------------------

function preload() {
  //Images
  ant_img = loadImage("media/ant.png");
  img_bg = loadImage("media/bliss.jpg");
  leg_1_img = loadImage("media/leg.png");
  leg_2_img = loadImage("media/leg2.png");
  top_img = loadImage("media/top.png");

  //Sounds
  audio_bg = loadSound("media/audio_bg.mp3"); //Source: https://pixabay.com/sound-effects/highland-winds-fx-56245/
  glasshit_1 = loadSound("media/glasshit.mp3"); //Source: https://pixabay.com/sound-effects/glass-knock-1-189096/
  glasshit_2 = loadSound("media/glasshit.mp3"); //Source: https://pixabay.com/sound-effects/glass-knock-1-189096/
  dirt = loadSound("media/dirt.mp3"); //Source: https://pixabay.com/sound-effects/single-rock-hit-dirt-2-83898/
  wood_1 = loadSound("media/wood.mp3"); //Source: https://pixabay.com/sound-effects/wood-step-sample-1-47664/
  wood_2 = loadSound("media/wood.mp3"); //Source: https://pixabay.com/sound-effects/wood-step-sample-1-47664/
  pebbleonpebble = loadSound("media/pebbleonpebble.mp3"); //Source: https://pixabay.com/sound-effects/single-rock-hitting-wood-4-103705/
}

function setup() {
  frameRate(60); //A stable frame rate is better than one that is unpredictable.
  let canvas = createCanvas(800, 600); //Not sure if it will have fixed values or it will be responsive.
  audio_bg.loop();
  engine = Engine.create();
  engine.gravity = Vector.create(0, 1);

  runner = Runner.create();

  //-- Autonomous agents ----

  //Preparing the ants variable.
  ants_1.push(new Ant(2, 520));
  ants_2.push(new Ant(600, 520));
  spawn_1 = new SpawnPoint(0, height / 2);
  spawn_2 = new SpawnPoint(800, 600);

  //Targets for ants.
  target_1 = new Target(890, 550);
  target_2 = new Target(-90, 550);

  //-----------------------

  //Celular automata
  cells.push(new CelularSpawner(int(random(255)), 35, 0, 0));

  //----- Mouse interaction -------
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
  Matter.Events.on(engine, "collisionStart", handleCollisions);

  //--------- Sine wave ---------------
  //Parameters: (position X, position Y, R, Angle Velocity, Direction).
  waves.push(new Wave(150, 50, 2, 0.05, 0));
  waves.push(new Wave(650, 80, 2, 0.05, 0));
  waves.push(new Wave(550, 100, 2, 0.05, 1));
  waves.push(new Wave(550, 250, 2, 0.05, 0));
  waves.push(new Wave(550, 150, 2, 0.05, 1));
  waves.push(new Wave(550, 350, 2, 0.05, 1));
  //----------------------------------
}

function draw() {
  push();
  background(img_bg);
  pop();

  // ----- Autonomous agents -----------

  //First set of ants.
  for (let i = 0; i < ants_1.length; i++) {
    ants_1[i].show();

    //Follow grid

    //Avoid going offscreen.
    ants_1[i].boundaries(offset);
    ants_1[i].applyForce(ants_1[i].arrive(target_1.position));

    let d_spawn = p5.Vector.dist(ants_1[i].position, spawn_1.position);

    if (d_spawn > 300 && ants_1[i].spawn_control == 0) {
      ants_1[i].spawn_control = 1;
      ants_1.push(new Ant(-60, 550));
    }

    let d_target = p5.Vector.dist(ants_1[i].position, target_1.position);

    if (d_target < ants_1[i].r + target_1.r) {
      //This part was done with help of the following material: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
      let index = ants_1.indexOf(ants_1[i]);
      if (index > -1) {
        // only splice array when item is found
        ants_1.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    ants_1[i].update();
  }

  //Second set of ants.
  for (let i = 0; i < ants_2.length; i++) {
    ants_2[i].show();

    //Follow grid

    //Avoid going offscreen.
    ants_2[i].boundaries(offset);
    ants_2[i].applyForce(ants_2[i].arrive(target_2.position));

    let d_spawn = p5.Vector.dist(ants_2[i].position, spawn_2.position);

    if (d_spawn > 300 && ants_2[i].spawn_control == 0) {
      ants_2[i].spawn_control = 1;
      ants_2.push(new Ant(870, 600));
    }

    let d_target = p5.Vector.dist(ants_2[i].position, target_2.position);

    if (d_target < ants_2[i].r + target_2.r) {
      //This part was done with help of the following material: https://stackoverflow.com/questions/5767325/how-can-i-remove-a-specific-item-from-an-array-in-javascript
      let index = ants_2.indexOf(ants_2[i]);
      if (index > -1) {
        // only splice array when item is found
        ants_2.splice(index, 1); // 2nd parameter means remove one item only
      }
    }

    ants_2[i].update();
  }

  //This displays the targets for the ants. It is disabled in case someone wants to see the code and enable it, for their own testing.
  /*   target_1.show();
  target_2.show(); */

  // ------------------------------

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
  for (let pair of event.pairs) {
    let bodyA = pair.bodyA;
    let bodyB = pair.bodyB;

    //Retrieve the particles associated with the colliding bodies via the plugin.
    let particleA = bodyA.plugin.particle;
    let particleB = bodyB.plugin.particle;

    if (particleA instanceof Cup && particleB instanceof Cup) {
      glasshit_1.play();
    }

    if (particleA instanceof Cup && particleB instanceof Circle) {
      glasshit_2.play();
      glasshit_2.setVolume(0.1);
    }

    if (particleA instanceof Circle && particleB instanceof Circle) {
      pebbleonpebble.play();
    }

    if (particleA instanceof Cup && particleB instanceof Bench) {
      wood_1.play();
    }

    if (particleA instanceof Circle && particleB instanceof Bench) {
      wood_2.play();
      wood_2.setVolume(0.2);
    }

    if (particleA instanceof Cup && particleB instanceof Grass) {
      dirt.play();
    }

    if (particleA instanceof Circle && particleB instanceof Grass) {
      dirt.play();
    }
  }
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
