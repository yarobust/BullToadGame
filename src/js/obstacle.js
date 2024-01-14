export class Obstacle {
  constructor(game) {
    this.game = game;
    this.collisionX = Math.random() * game.width;
    this.collisionY = Math.random() * game.height;
    this.collisionRadius = 60;

    this.image = document.getElementById('obstacles');
    this.spriteWidth = 250;
    this.spriteHeight = 250;
    this.width = this.spriteWidth;
    this.height = this.spriteHeight;
    this.spriteX = this.collisionX - this.width * 0.5;
    this.spriteY = this.collisionY - this.height * 0.8;
    this.frameX = Math.floor(Math.random() * 4);
    this.frameY = Math.floor(Math.random() * 3);
  }
  draw(context) {
    context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
    context.beginPath();
    context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
    context.save(); //saves the entire state onto a stack
    context.globalAlpha = 0.5;
    context.fill();
    context.restore(); //restore most recently saved state
    context.stroke();
  }
}