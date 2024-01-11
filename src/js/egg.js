export class Egg {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;
    this.collisionRadius = 40;
    this.margin = this.collisionRadius * 2.5;
    this.collisionX = this.margin + (Math.random() * (game.width - this.margin * 2));
    this.collisionY = this.game.topMargin + this.margin + (Math.random() * (game.height - this.game.topMargin - this.margin * 2));

    this.image = /** @type {HTMLImageElement} */ (document.getElementById('egg'));
    this.spriteWidth = 110;
    this.spriteHeight = 135;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;//subtract?
    this.spriteY = this.collisionY - this.height * 0.8;//subtract?
  }

  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);
    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
    }
  }

  update() {
    
    // console.log('egg update');
    let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
    collisionObjects.forEach((object) => {
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, object);
      if (collision) {
        // console.log('player and egg collision');
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        this.collisionX = object.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = object.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
    this.spriteX = this.collisionX - this.width * 0.5;//subtract?
    this.spriteY = this.collisionY - this.height * 0.8;//subtract?
  }
} 