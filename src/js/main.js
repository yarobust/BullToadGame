import {Game} from './game.js';

//for debug purposes
globalThis.startDebugging = false;
addEventListener('keydown', function (e) {
  if (e.key == "Control") {
    globalThis.startDebugging = true;
    setTimeout(function () { globalThis.startDebugging = false }, 500);
  }
});

window.addEventListener('load', function () {
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