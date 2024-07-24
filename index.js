const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// this is the background object
const background = new Sprite({ 
  position: {
    x: 0, y: 0,
  },

  imageSrc: './img/background.png'
});

// this is the shop object
const shop = new Sprite({
  position: {
    x: 600, y: 128
  },

  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
});

// this is the player1 object
const player = new Fighter({
  position: { x: 0, y: 0 }, 
  velocity: { x: 0, y: 0 },
  offset: { x: 0, y: 0 },

  imageSrc: './img/samuraiMack/idle.png',
  framesMax: 8,
  scale: 2.5,

  offset: {
    x: 215,
    y: 157
  },

  sprites: {
    idle: {
      imageSrc: './img/samuraiMack/Idle.png',
      framesMax: 8
    },

    run: {
      imageSrc: './img/samuraiMack/Run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './img/samuraiMack/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './img/samuraiMack/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './img/samuraiMack/Attack1.png',
      framesMax: 6
    },

    takehit: {
      imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
      framesMax: 4
    },

    death: {
      imageSrc: './img/samuraiMack/Death.png',
      framesMax: 6
    }
  },

  attackBox: {
    offset: {
      x: 100,
      y: 50
    },

    width: 160,
    height: 50
  }
});

// this is the player2 object
const enemy = new Fighter({
  position: { x: 400, y: 45 }, 
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },

  imageSrc: './img/kenji/idle.png',
  framesMax: 4,
  scale: 2.5,

  offset: {
    x: 215,
    y: 167
  },

  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },

    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './img/kenji/Attack2.png',
      framesMax: 4
    },

    takehit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },

    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },

    attackBox: {
    offset: {
      x: -165,
      y: 50
    },

    width: 165,
    height: 50
  }
});

// this variable is the tracker
// that checks that which key is pressed
const keys = {
  w: { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  ArrowRight: { pressed: false },
  ArrowLeft: { pressed: false },
  ArrowUp: { pressed: false },
};

decreaseTimer();

// This function controls the
// animation of everyhthing
function Animate() {
  window.requestAnimationFrame(Animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // enabling the run sprite using the last
  // key pressed
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // enabling the jump and fall sprite
  // based on their y velocity
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }
  
  // enabling the run for the player 2 
  // key pressed sprite using the last
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // checking the collision between sprites
  if (
    rectangularCollision({
    rectangle1: player, rectangle2: enemy
    }) && player.isAttacking && 
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    });
  }

  // stoping the sprites attack format based on their
  // sprites frames
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  // checking the collision between sprites
  if (rectangularCollision({
    rectangle1: enemy, rectangle2: player
  }) && enemy.isAttacking && enemy.framesCurrent === 2) {
    player.takeHit();
    enemy.isAttacking = false;
    gsap.to('#playerHealth', {
      width: player.health + '%'
    });
  }

  // stoping the sprites attack format based on their
  // sprites frames
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // checking if any players health is 0
  // and then if its 0 end the game
  if (enemy.health <= 0 || player.health <= 0 && timer >= 0) {
    determineWinner({ player, enemy, timerId });
    document.querySelectorAll('input, button').forEach(element => element.disabled = false);
  }
}

Animate();


window.addEventListener("keydown", (e) => {
  if (!player.dead) {
    switch(e.key) {
      case "d" : keys.d.pressed = true;
        player.lastKey = "d"
      break
      case "a" : keys.a.pressed = true;
        player.lastKey = "a"
      break
      case "w" : keys.w.pressed = true;
        player.velocity.y = -20
      break

      case " " : 
        player.attack();
      break
    }
  }

  if (!enemy.dead) {
    switch(e.key) {
      case "ArrowRight" : keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
      break
      case "ArrowLeft" : keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
      break
      case "ArrowUp" : keys.ArrowUp.pressed = true;
        enemy.velocity.y = -20
      break

      case "ArrowDown" : 
        enemy.attack();
      break
    }
  }
});

window.addEventListener("keyup", (e) => {
  switch(e.key) {
    case "d" : keys.d.pressed = false;
    break
    case "a" : keys.a.pressed = false;
    break
  }

  switch(e.key) {
    case "ArrowRight" : keys.ArrowRight.pressed = false;
    break
    case "ArrowLeft" : keys.ArrowLeft.pressed = false;
    break
  }
});

//play.porkchopsmp.xyz
//6630829182495574173