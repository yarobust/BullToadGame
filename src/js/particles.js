class Particle {
  /**
 * @param {import("./game.js").Game} game
 * @param {number} x
 * @param {number} y
 * @param {string} color
*/
  constructor(game, x, y, color) {
    this.game = game;
    this.collisionX = x;
    this.collisionY = y;
    this.collisionRadius = Math.floor(Math.random() * 10 + 5) * this.game.scaleFactor;

    this.speedX = (Math.random() * 6 - 3) * this.game.speedFactor;
    this.speedY = (Math.random() * 2 + 0.5) * this.game.speedFactor;
    this.angle = 0;
    //angle velocity
    this.va = (Math.random() * this.game.speedFactor * 0.1 + 0.01);
    this.markedForDeletion = false;
    this.color = color;
  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.save();
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
    context.restore();
  }
}

export class Firefly extends Particle {
  update() {
    this.angle += this.va;
    this.collisionX += Math.cos(this.angle) * this.speedX;
    this.collisionY -= this.speedY;
    if (this.collisionY < 0 - this.collisionRadius) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
  }
}
export class Spark extends Particle {
  update() {
    this.angle += this.va * 0.5;
    this.collisionX -= Math.cos(this.angle) * this.speedX;
    this.collisionY -= Math.sin(this.angle) * this.speedY;

    if (this.collisionRadius > 3) {
      this.collisionRadius -= 0.05;
    } else {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
  }
}