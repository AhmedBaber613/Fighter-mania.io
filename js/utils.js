// all the minor functions
function rectangularCollision({
  rectangle1,
  rectangle2
}) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
    rectangle2.position.x && rectangle1.attackBox.position.x <= 
    rectangle2.position.x + rectangle2.width && rectangle1.attackBox.position.y
    + rectangle1.attackBox.height >= rectangle2.position.y && 
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }){
  clearTimeout(timerId);
  document.querySelector('#displayText').style.display = 'flex';
  document.querySelector('#displayText').style.zIndex = 1;
  if (player.health === enemy.health) {
    document.querySelector('#displayText').innerHTML = 'tie';
    document.querySelectorAll('input, button').forEach(element => element.disabled = false);
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player1 wins!';
    document.querySelectorAll('input, button').forEach(element => element.disabled = false);
  } else if (player.health < enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player2 wins!';
    document.querySelectorAll('input, button').forEach(element => element.disabled = false);
  }

  document.querySelectorAll('input, button').forEach(element => element.disabled = false);
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector('#timer').innerHTML = timer;
  }

  if (timer === 0) {
    document.querySelector('#displayText').style.display = 'flex';
    determineWinner({ player, enemy });
  }
}