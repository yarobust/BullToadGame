import {Larva} from './larva.js';

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

    this.hatchTimer = 0;
    this.hatchInterval = 5000;
    this.markedForDeletion = false;
  }

  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, this.spriteX, this.spriteY, this.width, this.height);
    if (this.game.debug) {
      this.game.drawDebugCircle(this, context);
      context.textAlign = 'center';
      context.fillText((this.hatchTimer * 0.001).toFixed(0), this.collisionX, this.collisionY - this.collisionRadius * 3);
    }
  }

  /** @param {number} deltaTime */
  update(deltaTime) {
    //the larva will hatch when the egg has moved to the top edge or when the timer has run out.
    if (this.hatchTimer > this.hatchInterval || this.collisionY < this.game.topMargin) {
        this.game.hatchlings.push(new Larva(this.game, this.collisionX, this.collisionY));
        this.markedForDeletion = true;
        this.game.removeGameObjects();

    } else {
      this.hatchTimer += deltaTime;
    }

    let collisionObjects = [this.game.player, ...this.game.obstacles, ...this.game.enemies];
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
    this.spriteY = this.collisionY - this.height * 0.8;
  }
} 