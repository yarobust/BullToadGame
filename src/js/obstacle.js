export class Obstacle {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * game.width;
    this.collisionY = Math.random() * game.height;
    this.collisionRadius = 40 * this.game.scaleFactor;

    this.image = /**@type {HTMLImageElement} */ (document.getElementById('obstacles'));
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth * this.game.scaleFactor;
    this.height = this.spriteHeight * this.game.scaleFactor;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.8;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);
  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
    }
  }
  update() {
    //todo implement update method
  }
}