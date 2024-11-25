//Peacefulness in green - By Marcos Hernández

//Some material used:
//Mouse constraints: https://www.youtube.com/watch?v=W-ou_sVlTWk

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

//Compound bodies code from: https://www.youtube.com/watch?v=DR-iMDhUa-0

//Cup and its walls.
let cup;
let left_wall;
let right_wall;

let wall_options = {
  isStatic: false,
  render: {
    fillStyle: "black",
    strokeStyle: "black",
    lineWidth: 10,
    angle: 0,
  },
};

//Floor.
let floor;
let floor_options = {
  isStatic: false,
  render: {
    fillStyle: "black",
    strokeStyle: "black",
    lineWidth: 10,
    angle: 0,
  },
};

//Bench.
let bench;
let bench_options = {
  isStatic: true,
  render: {
    fillStyle: "orange",
    strokeStyle: "orange",
    lineWidth: 30,
  },
};

//Grass.
let grass;
let grass_options = {
  isStatic: true,
  render: {
    fillStyle: "green",
    strokeStyle: "green",
    lineWidth: 30,
  },
};

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
  left_wall = Bodies.rectangle(370, 50, 5, 100, wall_options);
  right_wall = Bodies.rectangle(410, 50, 5, 100, wall_options);
  floor = Bodies.rectangle(390, 100, 55, 5, floor_options);

  //Put cup pieces together into one body.
  cup = Body.create({
    parts: [floor, left_wall, right_wall],
    friction: 0.2,
    frictionAir: 0.1,
    render: {
      fillStyle: "black",
    },
  });
  //---------------------------------

  //----- The bench ---------
  bench = Bodies.rectangle(500, 450, 300, 20, bench_options);
  //-------------------------

  //----- The floor ---------
  grass = Bodies.rectangle(300, 585, 1000, 40, grass_options);
  //-------------------------

  //Add everything created so far into the engine, and run it.
  Composite.add(engine.world, [cup, bench, grass, mConstraint]);
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
  push();
  fill(0);
  rotate(left_wall.angle);
  rectMode(CENTER);
  rect(left_wall.position.x, left_wall.position.y, 5, 100);
  pop();

  push();
  fill(0);
  rotate(right_wall.angle);
  rectMode(CENTER);
  rect(right_wall.position.x, right_wall.position.y, 5, 100);
  pop();

  push();
  fill(0);
  rotate(floor.angle);
  rectMode(CENTER);
  rect(floor.position.x, floor.position.y, 55, 5);
  pop();

  //Draw bench
  push();
  noStroke();
  fill(255, 165, 0);
  rectMode(CENTER);
  rect(bench.position.x, bench.position.y, 300, 20);
  pop();

  //Draw left leg
  push();
  noStroke();
  fill(225, 135, 0);
  rect(360, 460, 20, 110);
  pop();

  //Draw right leg
  push();
  noStroke();
  fill(225, 135, 0);
  rect(615, 460, 20, 110);
  pop();

  //Floor
  push();
  noStroke();
  fill(50, 165, 0);
  rectMode(CENTER);
  rect(grass.position.x, grass.position.y, 1000, 40);
  pop();

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
