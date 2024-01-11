import { Obstacle } from './obstacle.js';
import { Player } from './player.js';
import { Egg } from './egg.js';
import { Enemy } from './enemy.js';

export class Game {
  /** @param {HTMLCanvasElement} canvas - reference of main canvas*/
  constructor(canvas) {
    this.debug = false; //for debug purposes
    this.frameCount = 0;
    this.debugTimer = 0;

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

    this.numberOfObstacles = 5;
    /** @type {Obstacle[]} */
    this.obstacles = [];
    this.maxEggs = 15;
    /**@type {Egg[]} */
    this.eggs = [];
    this.eggTimer = 0;
    this.eggInterval = 1000;
    /**@type {Enemy[]} */
    this.enemies = [];
    /** @type {(Egg | Obstacle | Enemy | Player )[]} */
    this.gameObjects = []


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
      if (e.key == "Control") {
        this.debug = !this.debug;
      }
    });
  }
  /**
   * @param {CanvasRenderingContext2D} context 
   * @param {number} deltaTime
  */
  render(context, deltaTime) {
    // systemise refresh rate
    this.debugTimer += deltaTime;

    if (this.timer > this.interval) {
      context.clearRect(0, 0, this.width, this.height);
      this.gameObjects = [...this.eggs, ...this.enemies, ...this.obstacles, this.player];
      //sort by vertical position
      this.gameObjects.sort((a, b) => (a.collisionY - b.collisionY));
      this.gameObjects.forEach((object) => {
        object.draw(context);
        object.update();
      });
      
      if(this.debug) {
        this.frameCount++;
        if(this.debugTimer >= 1000) {
          console.log(this.frameCount);
          this.frameCount = 0;
          this.debugTimer %= 1000
        }
      }

      this.timer %= this.interval;
      // console.log(this.timer);
    }
    this.timer += deltaTime;

    //add eggs periodically
    if (this.eggTimer > this.eggInterval && this.eggs.length < this.maxEggs) {
      this.addEgg();
      this.eggTimer %= this.eggInterval;
      // console.log(this.eggs);
    }
    this.eggTimer += deltaTime;

  }
  /**
   * @typedef ICollisional
   * @property {number} collisionX
   * @property {number} collisionY
   * @property {number} collisionRadius
   */
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
  addEnemy(){
    this.enemies.push(new Enemy(this));
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
}