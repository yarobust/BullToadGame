import {Game} from './game.js'

window.addEventListener('load', function () {
  //for debug purposes
  let startDebugging = false;
  this.addEventListener('keydown', function (e) {
    if (e.key == "Control") {
      startDebugging = !startDebugging;
      setTimeout(function () { startDebugging = false }, 1000)
    }
  });

  /* ------------------------------------------------ */
  
  const canvas = /** @type {HTMLCanvasElement} */ (document.getElementById('canvas1'));
  const ctx = /** @type {CanvasRenderingContext2D}*/ (canvas.getContext('2d'));
  //set up inital dimensions
  canvas.width = 1280;
  canvas.height = 720;

  ctx.fillStyle = 'white';
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'white';

  //creaet instance of a game
  const game = new Game(canvas);
  game.init();
  console.log(game);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(ctx);

    requestAnimationFrame(animate);
  }

  animate();
});