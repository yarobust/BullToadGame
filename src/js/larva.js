import { Firefly, Spark } from './particles.js';

export class Larva {
  /**
   * @param {import("./game.js").Game} game
   * @param {number} x
   * @param {number} y
  */
  constructor(game, x, y) {
    this.game = game;
    this.collisionRadius = 30;
    this.collisionX = x;
    this.collisionY = y;

    this.image = /** @type {HTMLImageElement} */ (document.getElementById('larva'));
    this.spriteWidth = 150;
    this.spriteHeight = 150;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.775;
    this.frameX = 0;
    this.frameY = Math.round(Math.random());
    this.speedY = 1 + Math.random();
  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
    }
  }
  update() {
    this.collisionY -= this.speedY;

    //if reach the safe zone
    if (this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
      !this.game.gameOver && this.game.savedHatchlings++;
      for (let i = 0; i < 3; i++) {
        this.game.particles.push(new Firefly(this.game, this.collisionX, this.collisionY, 'yellow'));
      }
    }

    //collision with enemies 
    this.game.enemies.forEach((enemy) => {
      if (this.game.checkCollision(this, enemy)[0]) {
        this.markedForDeletion = true;
        this.game.removeGameObjects();
        !this.game.gameOver && this.game.lostHatchlings++;
        for (let i = 0; i < 3; i++) {
          this.game.particles.push(new Spark(this.game, this.collisionX, this.collisionY, 'red'));
        }
      }
    });

    let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.eggs];
    //handle collisions with objects
    collisionObjects.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
      if (collision) {
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.775;
  }
}