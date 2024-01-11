export class Enemy {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;

    this.image = /** @type {HTMLImageElement} */ (document.getElementById('toad'));
    this.spriteWidth = 140;
    this.spriteHeight = 260;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;

    this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;;
    this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
    this.collisionRadius = 30;
    this.speedX = Math.random() * 3 + 0.5;

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.9;
  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);

    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
    }
  }
  update() {
    this.collisionX -= this.speedX;

    //if the enemy passes the left edge, move him behind the right edge.
    if (this.spriteX + this.width < 0) {
      this.collisionX = this.game.width + this.width + Math.random() * this.game.width * 0.5;
      this.collisionY = this.game.topMargin + (Math.random() * (this.game.height - this.game.topMargin));
    }

    let collisionObjects = [this.game.player, ...this.game.obstacles,];
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

    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.9;
  }
}