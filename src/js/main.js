import { Game } from './game.js';

window.addEventListener('load', function () {
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
  const ctx = /** @type {CanvasRenderingContext2D}*/ (canvas.getContext('2d'));
  //set up inital dimensions
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'black';
  ctx.font = '40px Halvetica';
  ctx.textAlign = 'center';

  //creaet instance of a game
  const game = new Game(canvas);
  game.init();
  console.log(game);
  
  let lastTime = 0;

  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime
    lastTime = timeStamp;
    game.render(ctx, deltaTime);
    requestAnimationFrame(animate);
  }

  animate(0);
});