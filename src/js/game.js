import { Obstacle } from './obstacle.js';
import { Player } from './player.js';
import { Egg } from './egg.js';
import { Enemy } from './enemy.js';
import { Larva } from './larva.js';

/**
  * @typedef ICollisional
  * @property {number} collisionX
  * @property {number} collisionY
  * @property {number} collisionRadius
  */

/**
  * @typedef IGameObject
  * @property {(context: CanvasRenderingContext2D) => void} draw
  * @property {(deltaTime: number) => void} update
  */
export class Game {
  /** @param {HTMLCanvasElement} canvas - reference of main canvas*/
  constructor(canvas) {
    this.debug = true; //for debug purposes
    this.frameCount = 0; //for debug purposes
    this.debugFPS = 0; //for debug purposes
    this.debugTimer = 0;//for debug purposes

    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    this.topMargin = 260;
    this.player = new Player(this);
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false
    }
    this.winningScore = 10;
    this.losingScore = 2;
    this.gameOver = false;

    this.numberOfObstacles = 5;
    /** @type {Obstacle[]} */
    this.obstacles = [];
    this.maxEggs = 10; //15
    /**@type {Egg[]} */
    this.eggs = [new Egg(this)];
    this.eggTimer = 0;
    this.eggInterval = 2000; //2000
    /** @type {Larva[]} */
    this.hatchlings = [];
    this.lostHatchlings = 0;
    this.savedHatchlings = 0;
    /**@type {Enemy[]} */
    this.enemies = [];
    /** */
    /**@type {(import('./particles.js').Firefly | import('./particles.js').Spark)[]} */
    this.particles = [];

    /** @type {(IGameObject & ICollisional)[]} */
    this.gameObjects = [];

    //fps
    this.fps = 60;
    this.timer = 0;
    this.interval = 1000 / this.fps;

    //event listeners
    canvas.addEventListener('mousedown', e => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = true;
    });
    canvas.addEventListener('mouseup', e => {
      this.mouse.x = e.offsetX;
      this.mouse.y = e.offsetY;
      this.mouse.pressed = false;
    });
    canvas.addEventListener('mousemove', e => {
      if (this.mouse.pressed) {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      }
    });

    //for debug purposes
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') {
        this.debug = !this.debug;
      } else if (this.gameOver && e.key === 'r') {
        this.restart();
      }
    });
  }
  /**
   * @param {CanvasRenderingContext2D} context 
   * @param {number} deltaTime
  */
  render(context, deltaTime) {
    this.debugTimer += deltaTime; //debug

    // systemise refresh rate
    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);
      this.gameObjects = [...this.particles, ...this.hatchlings, ...this.eggs, ...this.enemies, ...this.obstacles, this.player];
      //sort by vertical position
      this.gameObjects.sort((a, b) => (a.collisionY - b.collisionY));
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update(this.interval);
      });
      this.timer %= this.interval;

      //for debug purposes
      if (this.debug) {
        if (this.debugTimer >= 1000) {
          this.debugFPS = this.frameCount;
          this.frameCount = 0;
          this.debugTimer %= 1000;
        }
        this.frameCount++;
        context.save();
        context.fillStyle = 'red';
        context.textAlign = 'left';
        context.fillText(`fps: ${this.debugFPS}`, 0, 100)
        context.restore();
      }

      //draw status text
      context.save();
      context.textAlign = 'left';
      context.fillText(`score: ${this.savedHatchlings + (this.debug && ` lost: ${this.lostHatchlings}`)}`, 0, 30);
      context.restore();

      //win||lose message
      if (this.savedHatchlings >= this.winningScore || this.lostHatchlings >= this.losingScore) {
        context.save();
        context.fillStyle = 'rgba(0,0,0,0.5)';
        context.fillRect(0, 0, this.width, this.height);
        context.fillStyle = 'white';
        let message1;
        let message2;
        if (this.savedHatchlings >= this.winningScore) {
          message1 = 'Bullseye!!!';
          message2 = 'You bullied the bullies';
        } else {
          message1 = 'Bullocks!';
          message2 = `You lost ${this.lostHatchlings} hatchlings, don't be a pushover`;
        }
        context.font = '130px Helvetica';
        context.fillText(message1, this.width * 0.5, this.height * 0.4);
        context.font = '40px Helvetica';
        context.fillText(message2, this.width * 0.5, this.height * 0.5);
        context.fillText(`Final score ${this.savedHatchlings}. Press 'R' to butt heads again!`, this.width * 0.5, this.height * 0.6);
        context.restore();
        this.gameOver = true;
      }
    }
    this.timer += deltaTime;

    //add eggs periodically
    if (!this.gameOver && this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer %= this.eggInterval;
    }
    this.eggTimer += deltaTime;
  }
  /**
   * takes obj a and obj b and compare them
   * @param {ICollisional} a 
   * @param {ICollisional} b 
   * @returns {Array} array [bool, dist, sumR, dx, dy]
   */
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return [(distance < sumOfRadii), distance, sumOfRadii, dx, dy];
  }

  /**
   * for debug purposes
   * @param {ICollisional} obj
   * @param {CanvasRenderingContext2D} context
   */
  drawDebugCircle(obj, context) {
    context.beginPath();
    context.arc(obj.collisionX, obj.collisionY, obj.collisionRadius, 0, Math.PI * 2);
    context.save(); //saves the entire state onto a stack
    context.globalAlpha = 0.5;
    context.fill();
    context.restore(); //restore most recently saved state
    context.stroke();
  }

  addEgg() {
    this.eggs.push(new Egg(this));
  }
  addEnemy() {
    this.enemies.push(new Enemy(this));
  }
  removeGameObjects() {
    this.eggs = this.eggs.filter((egg) => !egg.markedForDeletion);
    this.hatchlings = this.hatchlings.filter((larva) => !larva.markedForDeletion);
    this.particles = this.particles.filter((particle) => !particle.markedForDeletion);
  }
  init() {
    for (let i = 0; i < 3; i++) {
      this.addEnemy();
      // console.log(this.enemies);
    }
    let attempts = 0;
    //instantiate obstacles
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this);
      let overlap = false; //if false then add to obstacles array
      const distanceBuffer = this.player.collisionRadius * 2 + testObstacle.collisionRadius; // 120 + 1? leave some space between obstacles for player to pass through

      //check obstacle's overlapping with each others
      this.obstacles.forEach(obstacle => {
        //replace with this.checkCollision() method?
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
        if (distance < sumOfRadii + distanceBuffer) {
          overlap = true;
        }
      });
      //check that obstacle doesn't go beyond canvas and doesn't overlapping 
      //TODO❓: remove boundary conditions and rewrite initial collisions
      if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + distanceBuffer && testObstacle.collisionY < this.height - distanceBuffer) {
        this.obstacles.push(testObstacle);
      }
      attempts++;
    }
  }
  restart() {
    this.obstacles = [];
    this.eggs = [new Egg(this)];
    this.eggTimer = 0;
    this.hatchlings = [];
    this.lostHatchlings = 0;
    this.savedHatchlings = 0;
    this.enemies = [];
    this.particles = [];
    this.gameObjects = [];
    this.mouse = {
      x: this.width * 0.5,
      y: this.height * 0.5,
      pressed: false
    }
    
    this.player.reset();
    this.init();
    this.gameOver = false;
  }
}