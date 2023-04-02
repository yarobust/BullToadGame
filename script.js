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
      this.dx = this.game.mouse.x - this.collisionX;
      this.dy = this.game.mouse.y - this.collisionY;
      const distance = Math.hypot(this.dx, this.dy);
      if(distance > this.speedModifier){
        this.speedX = this.dx/distance || 0;
        this.speedY = this.dy/distance || 0;
      } else {
        this.speedX = 0;
        this.speedY = 0;
      }
      this.collisionX += this.speedX * this.speedModifier;
      this.collisionY += this.speedY * this.speedModifier;
    }
  }

  class Obstacle {
    constructor(game){
      this.game = game;
      this.collisionX = Math.random() * game.width;
      this.collisionY = Math.random() * game.height;
      this.collisionRadius = 60;
    }
    draw(context){
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
      this.obstacles.forEach(obstacle => obstacle.draw(context))
    }
    init(){
      let attempts = 0;
      //instantiate obstacles
      while(this.obstacles.length < this.numberOfObstacles && attempts < 500){
        const testObstacle = new Obstacle(this);
        let overlap = false;
        //check for overlapping 
        this.obstacles.forEach(obstacle => {
          const dx = testObstacle.collisionX - obstacle.collisionX;
          const dy = testObstacle.collisionY - obstacle.collisionY;
          const distance = Math.hypot(dy, dx);
          const sumOfRadii = testObstacle.collisionRadius + obstacle.collisionRadius;
          if(distance < sumOfRadii){
            overlap = true;
          }
        });
        if(!overlap){
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