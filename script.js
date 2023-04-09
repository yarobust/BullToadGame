window.addEventListener('load', function(){
  //for debug purposes
  let startDebugging = false;
  this.addEventListener('keydown', function(e){
    if(e.key == "Control"){
      startDebugging = !startDebugging;
      setTimeout(function(){startDebugging = false},1000)
    }
  });
  
 /* ------------------------------------------------ */
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  //set up inital dimensions
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'white';

  class Player {
    constructor(game){
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
    draw(context){
      context.beginPath();
      context.arc(this.collisionX,this.collisionY, this.collisionRadius, 0,Math.PI * 2);
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
    update(){
      this.dx = this.game.mouse.x - this.collisionX; //make as const 
      this.dy = this.game.mouse.y - this.collisionY; //make as const
      const distance = Math.hypot(this.dx, this.dy);
      if(distance > this.speedModifier){
        this.speedX = this.dx/distance || 0; //remove 0?
        this.speedY = this.dy/distance || 0; //remove 0?
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier; // transfer to if block?
      this.collisionY += this.speedY * this.speedModifier; // transfer to if block?
    }
  }

  class Obstacle {
    constructor(game){
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
    draw(context){
      context.drawImage(this.image, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.spriteX, this.spriteY, this.width, this.height);
      context.beginPath();
      context.arc(this.collisionX,this.collisionY, this.collisionRadius, 0,Math.PI * 2);
      context.save(); //saves the entire state onto a stack
      context.globalAlpha = 0.5;
      context.fill();
      context.restore(); //restore most recently saved state
      context.stroke();
    }
  }
  class Game {
    //passing reference of main canvas
    constructor(canvas){
      this.canvas = canvas;
      this.width = canvas.width;
      this.height = canvas.height;
      this.topMargin = 260;
      this.player = new Player(this);
      this.mouse = {
        x: this.width * 0.5,
        y: this.height * 0.5,
        pressed: false
      }
      this.numberOfObstacles = 50;
      this.obstacles = [];
      //event listeners
      canvas.addEventListener('mousedown', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
      });
      canvas.addEventListener('mouseup', e => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
      });
      canvas.addEventListener('mousemove', e => {
        if(this.mouse.pressed){
          this.mouse.x = e.offsetX;
          this.mouse.y = e.offsetY;
        }
      });
      
    }
    render(context){
      this.player.draw(context);
      this.player.update();
      this.obstacles.forEach(obstacle => obstacle.draw(context));
    }
    init(){
      let attempts = 0;
      //instantiate obstacles
      while(this.obstacles.length < this.numberOfObstacles && attempts < 500){
        const testObstacle = new Obstacle(this);
        let overlap = false;
        const distanceBuffer = this.player.collisionRadius * 2 + testObstacle.collisionRadius; // 120 + 1?
        //check for overlapping 
        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius; 
          if(distance < sumOfRadii + distanceBuffer){ 
            overlap = true;
          }
        });
        //check overlapping and that obstacle doesn't go beyond canvas
        if(!overlap && testObstacle.spriteX > 0 && testObstacle.spriteX < this.width - testObstacle.width && 
          testObstacle.collisionY > this.topMargin + distanceBuffer && testObstacle.collisionY < this.height - distanceBuffer){
          this.obstacles.push(testObstacle);
        }
        attempts++;
      }
    }
  }


  //creaet instance of a game
  const game = new Game(canvas);
  game.init();
  console.log(game);
  
  function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);

    requestAnimationFrame(animate);
  }

  animate();
});