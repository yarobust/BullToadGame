export class Larva{
  /**
   * @param {import("./game.js").Game} game
   * @param {number} x
   * @param {number} y
  */
  constructor(game, x, y){
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
    this.frameY = Math.round(Math.random());
    this.speedY = 1 + Math.random();
  }
    /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, 0, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
    }
  }
  update() {
    this.collisionY -= this.speedY;

    //if reach the safe zone
    if(this.collisionY < this.game.topMargin) {
      this.markedForDeletion = true;
      this.game.removeGameObjects();
    }
    
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.775;
  }
}