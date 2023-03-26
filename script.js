window.addEventListener('load', function(){
  const canvas = document.getElementById('canvas1');
  const ctx = canvas.getContext('2d');
  canvas.width = 1200;
  canvas.height = 720;

  class Player {
    constructor(game){
      this.game = game;

    }
  }
  class Game {
    //passing reference of main canvas
    constructor(canvas){
      this.canvas = canvas;
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player = new Player(this);
    }
  }


  //creaet instance of a game
  const game = new Game(canvas);
  console.log(game);

  function animate(){

  }

});