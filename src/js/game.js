import {Obstacle} from './obstacle.js';
import {Player} from './player.js';
 
 export class Game {
  /** @param {HTMLCanvasElement} canvas - reference of main canvas*/
  constructor(canvas) {
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
    this.numberOfObstacles = 50;
    /** @type {Obstacle[]} */
    this.obstacles = [];
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
  }
  /**
   * @param {CanvasRenderingContext2D} context
   */
  render(context) {
    this.player.draw(context);
    this.player.update();
    this.obstacles.forEach(obstacle => obstacle.draw(context));
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
   * @returns {boolean}
   */
  checkCollision(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dy, dx);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return (distance < sumOfRadii);
  }
  init() {
    let attempts = 0;
    //instantiate obstacles
    while (this.obstacles.length < this.numberOfObstacles && attempts < 500) {
      const testObstacle = new Obstacle(this);
      let overlap = false;
      const distanceBuffer = this.player.collisionRadius * 2 + testObstacle.collisionRadius; // 120 + 1?
      //check for overlapping 
      this.obstacles.forEach(obstacle => {
        //replace with this.checkCollision() method
        const dx = testObstacle.collisionX - obstacle.collisionX;
        const dy = testObstacle.collisionY - obstacle.collisionY;
        const distance = Math.hypot(dy, dx);
        const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
        if (distance < sumOfRadii + distanceBuffer) {
          overlap = true;
        }
      });
      //check overlapping and that obstacle doesn't go beyond canvas
      if (!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width &&
        testObstacle.collisionY > this.topMargin + distanceBuffer && testObstacle.collisionY < this.height - distanceBuffer) {
        this.obstacles.push(testObstacle);
      }
      attempts++;
    }
  }
}