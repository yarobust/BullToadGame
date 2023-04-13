export class Player {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;
    //hitbox|start position
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.speedX = 0; //remove unused property?
    this.speedY = 0; //remove unused property? 
    //distance between mouse coordinate and player
    this.dx = 0; //remove unused property? 
    this.dy = 0; //remove unused property?
    this.speedModifier = 5; //set how fast the playe is    

    this.image = /** @type {HTMLImageElement} */ (document.getElementById('bull'));
    this.spriteWidth = 255;
    this.spriteHeight = 255;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.9;

  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
    context.drawImage(this.image, 0, 0 + 256 * 3, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    context.save(); //saves the entire state onto a stack
    context.globalAlpha = 0.5;
    context.fill();
    context.restore(); //restore most recently saved state
    context.stroke();
    context.beginPath();
    context.moveTo(this.collisionX, this.collisionY);
    context.lineTo(this.game.mouse.x, this.game.mouse.y);
    context.stroke();

  }
  update() {
    this.dx = this.game.mouse.x - this.collisionX; //make as const 
    this.dy = this.game.mouse.y - this.collisionY; //make as const
    const distance = Math.hypot(this.dx, this.dy);
    if (distance > this.speedModifier) {
      this.speedX = this.dx / distance || 0; //remove 0? distance will never be less then speedModifier
      this.speedY = this.dy / distance || 0; //remove 0?
    } else {
      this.speedX = 0;
      this.speedY = 0;
    }
    this.collisionX += this.speedX * this.speedModifier; // transfer to if block?
    this.collisionY += this.speedY * this.speedModifier; // transfer to if block?
    
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.9;
    //collision player with obstacles
    this.game.obstacles.forEach(obstacle=>{
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);

      if(collision){ //!!!
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        console.log(unit_x, unit_y);
        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}