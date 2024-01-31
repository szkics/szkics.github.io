

let flock;

function setup() {
  createCanvas(windowWidth, windowHeight);
  const letters = ['Б','Г', 'Д', 'Ж', 'И','Л', 'П', 'Ф', 'Ѡ',  'Ц', 'Ч',  'Ш', 'Щ',  'Ъ',  'Ь',  'Ѣ',  'Ꙗ',  'Ѥ',  'Ю', 'Ѫ',  'Ѭ',  'Ѧ',  'Ѩ',  'Ѯ',  'Ѱ',  'Ѳ',  'Ѵ',  'Ҁ',
                  'a','á','b','c','cs','d','dz','dzs','e','é','f','g','gy','h','i','í','j','k','l','ly','m','n','ny','o','ó','ö','ő','p','q','r','s','sz','t','ty','u','ú','ü','ű',
                  'v','w','x','y','z','zs','ă','â','î','ș','ț','α','β','γ','Δ', 'δ','ε','ζ','η','Θ', 'θ','Λ', 'λ','μ','ν','Ξ', 'ξ','Π', 'π','ρ','σ','τ','υ','Φ', 'φ','Ψ', 'ψ','Ω', 'ω','æ', 'ø', 
                  'å','Æ' , 'Ø', 'Å']
  flock = new Flock(letters);

  divident = 1;
  for (let i = 0; i < 60; i++) {
    const random_index= Math.floor(Math.random() * letters.length);
    if (i%10 === 0) {
      ++divident;
    }
    let b = new Boid(width/divident+width/4, height/divident+height/4, letters[random_index]);
    flock.addBoid(b);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(51);
  flock.run();
}

// Add a new boid into the System
function mouseClicked() {
  const random_index= Math.floor(Math.random() * flock.letters.length);
  flock.addBoid(new Boid(mouseX, mouseY, flock.letters[random_index]));
}

function mouseDragged() {
  const random_index= Math.floor(Math.random() * flock.letters.length);
  flock.addBoid(new Boid(mouseX, mouseY, flock.letters[random_index]));
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Flock object
// Does very little, simply manages the array of all the boids

function Flock(letters) {
  // An array for all the boids
  this.boids = []; // Initialize the array
  this.letters = letters;
}

Flock.prototype.run = function() {
  for (let i = 0; i < this.boids.length; i++) {
    this.boids[i].run(this.boids);  // Passing the entire list of boids to each boid individually
  }
}

Flock.prototype.addBoid = function(b) {
  this.boids.push(b);
}

// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Boid class
// Methods for Separation, Cohesion, Alignment added

function Boid(x, y, letter) {
  this.acceleration = createVector(0, 0);
  this.velocity = createVector(random(-1, 1), random(-1, 1));
  this.position = createVector(x, y);
  this.r = 3.0;
  this.maxspeed = 3;    // Maximum speed
  this.maxforce = 0.05; // Maximum steering force
  this.letter = letter;
}

Boid.prototype.run = function(boids) {
  this.flock(boids);
  this.update();
  this.borders();
  this.render();
}

Boid.prototype.applyForce = function(force) {
  // We could add mass here if we want A = F / M
  this.acceleration.add(force);
}

// We accumulate a new acceleration each time based on three rules
Boid.prototype.flock = function(boids) {
  let sep = this.separate(boids);   // Separation
  let ali = this.align(boids);      // Alignment
  let coh = this.cohesion(boids);   // Cohesion
  // Arbitrarily weight these forces
  sep.mult(1.5);
  ali.mult(1.0);
  coh.mult(1.0);
  // Add the force vectors to acceleration
  this.applyForce(sep);
  this.applyForce(ali);
  this.applyForce(coh);
}

// Method to update location
Boid.prototype.update = function() {
  // Update velocity
  this.velocity.add(this.acceleration);
  // Limit speed
  this.velocity.limit(this.maxspeed);
  this.position.add(this.velocity);
  // Reset accelertion to 0 each cycle
  this.acceleration.mult(0);
}

// A method that calculates and applies a steering force towards a target
// STEER = DESIRED MINUS VELOCITY
Boid.prototype.seek = function(target) {
  let desired = p5.Vector.sub(target,this.position);  // A vector pointing from the location to the target
  // Normalize desired and scale to maximum speed
  desired.normalize();
  desired.mult(this.maxspeed);
  // Steering = Desired minus Velocity
  let steer = p5.Vector.sub(desired,this.velocity);
  steer.limit(this.maxforce);  // Limit to maximum steering force
  return steer;
}

Boid.prototype.render = function() {
  // Draw a triangle rotated in the direction of velocity
  let theta = this.velocity.heading() + radians(90);
  fill(0,0,0);
  stroke(0,0,0);  
  // fill(127);
  // stroke(200);
  push();
  translate(this.position.x, this.position.y);
  rotate(theta);
  // beginShape();
  // vertex(0, -this.r * 6);
  // vertex(-this.r * 2, this.r * 4);
  // vertex(this.r * 2, this.r * 4);
  // endShape(CLOSE);
  fill(256, 256, 256);
  textSize(22)
  text(this.letter, -this.r, this.r*1.5);

  // vertex(0, -this.r * 8);
  // vertex(-this.r*4, this.r * 4);
  // vertex(this.r*4, this.r * 4);
  // endShape(CLOSE);
  // fill(256, 256, 256);
  // text(this.letter, -this.r*2, this.r*3);

  pop();
}

// Wraparound
Boid.prototype.borders = function() {
  if (this.position.x < -this.r)  this.position.x = width + this.r;
  if (this.position.y < -this.r)  this.position.y = height + this.r;
  if (this.position.x > width + this.r) this.position.x = -this.r;
  if (this.position.y > height + this.r) this.position.y = -this.r;
}

// Separation
// Method checks for nearby boids and steers away
Boid.prototype.separate = function(boids) {
  let desiredseparation = 25.0;
  let steer = createVector(0, 0);
  let count = 0;
  // For every boid in the system, check if it's too close
  for (const boid of boids) {
    let d = p5.Vector.dist(this.position,boid.position);
    // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
    if ((d > 0) && (d < desiredseparation)) {
      // Calculate vector pointing away from neighbor
      let diff = p5.Vector.sub(this.position, boid.position);
      diff.normalize();
      diff.div(d)// Weight by distance
      steer.add(diff);
      count++    // Keep track of how many
    }
  }
  // Average -- divide by how many
  if (count > 0) {
    steer.div(count);
  }

  // As long as the vector is greater than 0
  if (steer.mag() > 0) {
    // Implement Reynolds: Steering = Desired - Velocity
    steer.normalize();
    steer.mult(this.maxspeed);
    steer.sub(this.velocity);
    steer.limit(this.maxforce);
  }
  return steer;
}

// Alignment
// For every nearby boid in the system, calculate the average velocity
Boid.prototype.align = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0,0);
  let count = 0;
  for (const boid of boids) {
    let d = p5.Vector.dist(this.position,boid.position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boid.velocity);
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    sum.normalize();
    sum.mult(this.maxspeed);
    let steer = p5.Vector.sub(sum, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  } else {
    return createVector(0, 0);
  }
}

// Cohesion
// For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
Boid.prototype.cohesion = function(boids) {
  let neighbordist = 50;
  let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
  let count = 0;
  for (const boid of boids) {
    let d = p5.Vector.dist(this.position,boid.position);
    if ((d > 0) && (d < neighbordist)) {
      sum.add(boid.position); // Add location
      count++;
    }
  }
  if (count > 0) {
    sum.div(count);
    return this.seek(sum);  // Steer towards the location
  } else {
    return createVector(0, 0);
  }
}


