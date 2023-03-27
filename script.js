window.addEventListener('load', function(){
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
      //event listeners
      canvas.addEventListener('mousedown', (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = true;
        console.log(this.mouse);
      });
      canvas.addEventListener('mouseup', (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
        this.mouse.pressed = false;
        console.log(this.mouse);
      });
      canvas.addEventListener('mousemove', (e) => {
        this.mouse.x = e.offsetX;
        this.mouse.y = e.offsetY;
      });
      
    }
    render(context){
      this.player.draw(context);
    }
  }


  //creaet instance of a game
  const game = new Game(canvas);
  game.render(ctx);
  console.log(game);

  function animate(){

  }

});