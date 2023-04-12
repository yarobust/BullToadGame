export class Player {
  /**@param {import("./game.js").Game} game*/
  constructor(game) {
    this.game = game;
    //hitbox|start position
    this.collisionX = this.game.width * 0.5;
    this.collisionY = this.game.height * 0.5;
    this.collisionRadius = 30;
    this.speedX = 0;
    this.speedY = 0;
    //distance between mouse coordinate and player
    this.dx = 0;
    this.dy = 0;
    this.speedModifier = 5; //sets how fast the playe is    
  }
  /** @param {CanvasRenderingContext2D} context */
  draw(context) {
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

    //collision player with obstacles
    this.game.obstacles.forEach(obstacle=>{
      let [collision, distance, sumOfRadii, dx, dy] = this.game.checkCollision(this, obstacle);

      if(collision){
        const unit_x = dx / distance;
        const unit_y = dy / distance;
        console.log(unit_x, unit_y);
        this.collisionX = obstacle.collisionX + (sumOfRadii + 1) * unit_x;
        this.collisionY = obstacle.collisionY + (sumOfRadii + 1) * unit_y;
      }
    });
  }
}