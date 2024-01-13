export class Player {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;
    //hitbox|start position
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 35;
    this.speedModifier = 5; //set how fast the playe is (should not be less than zero)

    this.image = /** @type {HTMLImageElement} */ (document.getElementById('bull'));
    this.spriteWidth = 255;
    this.spriteHeight = 256;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.85;
    this.frameX = 0;
    this.frameY = 0;

  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, Math.floor(this.frameX) * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
    if(this.game.debug){
      this.game.drawDebugCircle(this, context);
      //leading line
      context.beginPath();
      context.moveTo(this.collisionX, this.collisionY);
      context.lineTo(this.game.mouse.x, this.game.mouse.y);
      context.stroke();
    }
    
  }
  update() {
    const dx = this.game.mouse.x - this.collisionX;
    const dy = this.game.mouse.y - this.collisionY;
    const distance = Math.hypot(dx, dy);
    if (distance > this.speedModifier) {
      const speedX = dx / distance;
      const speedY = dy / distance;
      this.collisionX += speedX * this.speedModifier; //move to if(distance > this.speedmodifier)
    this.collisionY += speedY * this.speedModifier; //move to if(distance > this.speedmodifier)
    }
    
    //sprite animation|direction
    this.frameX === 58 ? this.frameX = 0 : this.frameX += 0.5;
    const angle = Math.atan2(dy, dx); //move to if(distance > this.speedmodifier)
    if (angle < -2.74 || angle >= 2.74) this.frameY = 6;
    else if (angle < -1.96) this.frameY = 7;
    else if (angle < -1.17) this.frameY = 0;
    else if (angle < -0.39) this.frameY = 1;
    else if (angle < 0.39) this.frameY = 2;
    else if (angle < 1.17) this.frameY = 3;
    else if (angle < 1.96) this.frameY = 4;
    else this.frameY = 5;

    //horizontal and vertical boundaries
    if (this.collisionX < this.collisionRadius) this.collisionX = this.collisionRadius;
    else if (this.collisionX > this.game.width - this.collisionRadius) this.collisionX = this.game.width - this.collisionRadius;
    if (this.collisionY < this.game.topMargin + this.collisionRadius) this.collisionY = this.game.topMargin + this.collisionRadius;
    else if (this.collisionY > this.game.height - this.collisionRadius) this.collisionY = this.game.height - this.collisionRadius;

    //collision player with obstacles
    this.game.obstacles.forEach(obstacle=>{
      const [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);
      if(collision){ //!!!
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        // console.log(unit_x, unit_y);
        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });

    this.spriteX = this.collisionX - this.width * 0.5; //move to if(distance > this.speedmodifier)
    this.spriteY = this.collisionY - this.height * 0.9; //move to if(distance > this.speedmodifier)
  }
  reset() {
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.85;
  }
}