
// ========================================
// ROSEDEL — GAMEPLAY
// Movement, physics, collection, progression
// ========================================

// SETUP

const canvas = document.getElementById("world");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const playScreen = document.getElementById("play-screen");
const playButton = document.getElementById("play-button");


const flowerCountDisplay = document.getElementById("flower-count");
const bouquetCounter = document.getElementById("bouquet-counter");

const leftButton = document.getElementById("left");
const rightButton = document.getElementById("right");
const jumpButton = document.getElementById("jump");


// GAME SETTINGS

const WORLD_WIDTH = 6000;
const GROUND_Y = 420;

const GRAVITY = 1500;
const JUMP_FORCE = -560;

const WALK_FRAME_DURATION = 0.12;
const SPRINT_FRAME_DURATION = 0.075;

const WALK_SPEED = 240;
const SPRINT_SPEED = 360;

const WALK_ACCELERATION = 1100;
const SPRINT_ACCELERATION = 1600;

let playing = false;
let cutsceneStarted = false;
let lastTime = 0;
let cameraX = 0;
let sprinting = false;


// PLAYER

const player = {
  x: 100,
  y: GROUND_Y - 58,

  width: 32,
  height: 58,

  spriteWidth: 160,
  spriteHeight: 160,

  velocityX: 0,
  velocityY: 0,

  acceleration: WALK_ACCELERATION,
  speed: WALK_SPEED,

  grounded: true,
  direction: 1,

  animationTime: 0,
  currentFrame: 0
};


// SECOND LOVER

const MEETING_X = WORLD_WIDTH - 550;

const secondLover = {
  x: WORLD_WIDTH - 400,
  y: GROUND_Y - 58,

  width: 32,
  height: 58,

  spriteHeight: 160,
  direction: -1,

  // Updated according to camera position.
  visible: false
};


// INPUT

const keys = {
  left: false,
  right: false,
  jump: false
};

function clearKeys() {
  keys.left = false;
  keys.right = false;
  keys.jump = false;
}

window.addEventListener("blur", clearKeys);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) clearKeys();
});


// KEYBOARD CONTROLS

window.addEventListener("keydown", (event) => {
  const code = event.code;

  if (
    code === "ArrowLeft" ||
    code === "ArrowRight" ||
    code === "ArrowUp" ||
    code === "Space"
  ) {
    event.preventDefault();
  }

  // Conversation controls.
  if (isConversationActive()) {
    if (
      (code === "Enter" || code === "Space") &&
      !event.repeat
    ) {
      advanceConversation();
    }

    return;
  }

  // Sprint toggle.
  if (
    code === "ShiftLeft" ||
    code === "ShiftRight"
  ) {
    if (!event.repeat) toggleSprint();
  }

  if (code === "ArrowLeft" || code === "KeyA") {
    keys.left = true;
  }

  if (code === "ArrowRight" || code === "KeyD") {
    keys.right = true;
  }

  if (
    code === "ArrowUp" ||
    code === "Space" ||
    code === "KeyW"
  ) {
    keys.jump = true;
  }
});

window.addEventListener("keyup", (event) => {
  const code = event.code;

  if (code === "ArrowLeft" || code === "KeyA") {
    keys.left = false;
  }

  if (code === "ArrowRight" || code === "KeyD") {
    keys.right = false;
  }

  if (
    code === "ArrowUp" ||
    code === "Space" ||
    code === "KeyW"
  ) {
    keys.jump = false;
  }
});


// SPRINT TOGGLE

function toggleSprint() {
  if (!playing || isConversationActive()) return;

  sprinting = !sprinting;

  player.speed = sprinting
    ? SPRINT_SPEED
    : WALK_SPEED;

  player.acceleration = sprinting
    ? SPRINT_ACCELERATION
    : WALK_ACCELERATION;
}


// TOUCH CONTROLS

function setupTouchButton(button, key) {
  if (!button) return;

  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();

    if (isConversationActive()) return;

    keys[key] = true;

    if (button.setPointerCapture) {
      try {
        button.setPointerCapture(event.pointerId);
      } catch (_) {}
    }
  });

  const release = (event) => {
    event.preventDefault();
    keys[key] = false;
  };

  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);

  button.addEventListener("lostpointercapture", () => {
    keys[key] = false;
  });
}

setupTouchButton(leftButton, "left");
setupTouchButton(rightButton, "right");
setupTouchButton(jumpButton, "jump");


// FLOWERS

const flowers = [
  {
    x: 520,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Ceibo",
    meaning: "A little flower growing near the garden entrance."
  },
  {
    x: 820,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Garden Flower",
    meaning: "A little flower growing near the garden entrance.",
    color: "#e9a6c5",
    petals: 5
  },
  {
    x: 1500,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Garden Flower",
    meaning: "A flower growing among the garden bushes.",
    color: "#e9c66b",
    petals: 8
  },
  {
    x: 2000,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Garden Flower",
    meaning: "A flower growing among the garden bushes.",
    color: "#b99adf",
    petals: 6
  },
  {
    x: 2700,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Meadow Flower",
    meaning: "A flower growing in the open meadow."
  },
  {
    x: 2850,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Meadow Flower",
    meaning: "A flower growing in the open meadow."
  },
  {
    x: 3000,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Meadow Flower",
    meaning: "A flower growing in the open meadow."
  },
  {
    x: 3900,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Special Flower",
    meaning: "A flower growing near the old tree."
  },
  {
    x: 4650,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Garden Flower",
    meaning: "One of the last flowers along the garden path."
  },
  {
    x: 5100,
    y: GROUND_Y - 64,
    width: 64,
    height: 64,
    collected: false,
    name: "Garden Flower",
    meaning: "One of the last flowers along the garden path."
  }
];


// FALLEN BRANCHES

const branches = [
  { x: 1100, width: 85, height: 20 },
  { x: 2300, width: 100, height: 22 },
  { x: 3500, width: 75, height: 18 },
  { x: 4300, width: 95, height: 22 },
  { x: 5500, width: 85, height: 20 }
];

let flowerCount = 0;


// OPENING JOURNEY MESSAGE

const openingJourneyMessage =
  "Im so late right now.. i should pick some flowers for them-";

let openingMessageStarted = false;


// BOUQUET COUNTER

function animateBouquetCounter() {
  if (!bouquetCounter) return;

  bouquetCounter.classList.remove("collecting");
  void bouquetCounter.offsetWidth;
  bouquetCounter.classList.add("collecting");

  setTimeout(() => {
    bouquetCounter.classList.remove("collecting");
  }, 450);
}

function updateFlowerCounter() {
  if (flowerCountDisplay) {
    flowerCountDisplay.textContent = flowerCount;
  }

  animateBouquetCounter();
}


// ENDING SCREEN

function showEndingScreen() {
  playScreen.classList.add("hidden");

  const endingScreen =
    document.getElementById("ending-screen");

  const endingMessage =
    document.getElementById("ending-message");

  const endingSignature =
    document.getElementById("ending-signature");

  const letter = [
    "Happy birthday, my sweetheart.",
    "",
    "I'm was very excited to show you this little project i made, it took quite the effort, but its worth it since its for you. Im happy youre here, reading this, Im happy that you finally completed 15 years.. wow, youre old.",
    "youve been more than enough my entire life, really, i wrote this to express how important you are to me like no one; and i mean NOOO ONEEE in my life had so much damn impact on me.",
    "",
    "The upcominh year will be much better than this one.. we have learned, grown, and overcome many things side by side, so.. i dont think 2027 will be  a hard year, will it?",
    "You deserve so much happiness.",
    "",
    "please, never forget that someone out there will always love you, and theyll ALWAYS be me, or.. someone else that wants u, idk, ill kill them"
    
  ].join("\n");

  const signature = "With all my love, ♡";

  endingMessage.textContent = "";
  endingSignature.textContent = "";

  endingScreen.classList.remove("hidden");

  requestAnimationFrame(() => {
    endingScreen.classList.add("visible");

    let i = 0;
    let readerIsAtBottom = true;

    endingMessage.onscroll = () => {
      const distanceFromBottom =
        endingMessage.scrollHeight -
        endingMessage.scrollTop -
        endingMessage.clientHeight;

      readerIsAtBottom = distanceFromBottom < 35;
    };

    function typeLetter() {
      if (i < letter.length) {
        endingMessage.textContent += letter[i];
        i++;

        if (readerIsAtBottom) {
          endingMessage.scrollTop =
            endingMessage.scrollHeight;
        }

        setTimeout(
          typeLetter,
          letter[i - 1] === "\n" ? 300 : 38
        );
      } else {
        setTimeout(() => {
          endingSignature.textContent = signature;
        }, 900);
      }
    }

    setTimeout(typeLetter, 1200);
  });
}


// MOVEMENT AND PHYSICS

function updatePlayer(dt) {
  if (isConversationActive()) return;

  const oldX = player.x;

  let direction = 0;

  if (keys.left) direction -= 1;
  if (keys.right) direction += 1;

  if (direction !== 0) {
    player.direction = direction;

    player.velocityX +=
      direction * player.acceleration * dt;

    player.velocityX = Math.max(
      -player.speed,
      Math.min(player.speed, player.velocityX)
    );
  } else {
    const braking = player.acceleration * dt;

    if (player.velocityX > 0) {
      player.velocityX = Math.max(
        0,
        player.velocityX - braking
      );
    } else if (player.velocityX < 0) {
      player.velocityX = Math.min(
        0,
        player.velocityX + braking
      );
    }
  }

  player.x += player.velocityX * dt;

  player.x = Math.max(
    0,
    Math.min(WORLD_WIDTH - player.width, player.x)
  );


  // BRANCH COLLISION

  for (const branch of branches) {
    const branchTop = GROUND_Y - branch.height;

    const overlapsHorizontally =
      player.x < branch.x + branch.width &&
      player.x + player.width > branch.x;

    const overlapsVertically =
      player.y + player.height > branchTop;

    if (overlapsHorizontally && overlapsVertically) {
      if (player.velocityX > 0) {
        player.x = branch.x - player.width;
      } else if (player.velocityX < 0) {
        player.x = branch.x + branch.width;
      }

      player.velocityX = 0;
    }
  }


  // JUMP

  if (keys.jump && player.grounded) {
    player.velocityY = JUMP_FORCE;
    player.grounded = false;
  }


  // GRAVITY

  player.velocityY += GRAVITY * dt;
  player.y += player.velocityY * dt;


  // GROUND COLLISION

  if (player.y + player.height >= GROUND_Y) {
    player.y = GROUND_Y - player.height;
    player.velocityY = 0;
    player.grounded = true;
  }


  // ANIMATION TIMING

  const actuallyMoving =
    Math.abs(player.x - oldX) > 0.1;

  if (actuallyMoving && player.grounded) {
    player.animationTime += dt;

    const frameDuration = sprinting
      ? SPRINT_FRAME_DURATION
      : WALK_FRAME_DURATION;

    if (player.animationTime >= frameDuration) {
      player.animationTime -= frameDuration;

      player.currentFrame =
        (player.currentFrame + 1) % 4;
    }
  } else {
    player.animationTime = 0;
    player.currentFrame = 0;
  }
}


// CAMERA

function updateCamera() {
  cameraX =
    player.x + player.width / 2 - canvas.width / 2;

  cameraX = Math.max(
    0,
    Math.min(WORLD_WIDTH - canvas.width, cameraX)
  );

  // The second lover becomes visible as they enter
  // the camera's view, even before the conversation.
  const visibilityMargin = 180;

  secondLover.visible =
    secondLover.x + secondLover.width >
      cameraX - visibilityMargin &&
    secondLover.x <
      cameraX + canvas.width + visibilityMargin;
}


// FLOWER COLLECTION

function checkFlowerCollection() {
  for (const flower of flowers) {
    if (flower.collected) continue;

    const playerCenterX =
      player.x + player.width / 2;

    const flowerCenterX =
      flower.x + flower.width / 2;

    const playerCenterY =
      player.y + player.height / 2;

    const flowerCenterY =
      flower.y + flower.height / 2;

    const distanceX = Math.abs(
      playerCenterX - flowerCenterX
    );

    const distanceY = Math.abs(
      playerCenterY - flowerCenterY
    );

    if (distanceX < 42 && distanceY < 55) {
      flower.collected = true;
      flowerCount++;

      updateFlowerCounter();

      createSparkles(
        flowerCenterX,
        flowerCenterY
      );

      // Categorized continuous message.
      // This does not pause gameplay.
      queueJourneyMessage({
        category: "flower",
        title: flower.name,
        text: flower.meaning
      });
    }
  }
}


// MEETING CONVERSATION

function startMeetingCutscene() {
  if (cutsceneStarted) return;

  cutsceneStarted = true;

  player.velocityX = 0;
  player.velocityY = 0;
  player.grounded = true;

  player.direction = 1;
  secondLover.direction = -1;

  clearKeys();

  const controls =
    document.getElementById("controls");

  if (controls) {
    controls.style.display = "none";
  }

  // The conversation system handles the dialogue,
  // typewriter effect, speaker names and progression.
  startConversation("birthdayMeeting");
}


// MAIN UPDATE

function update(dt) {
  updateAmbientParticles(dt);

  // Conversation system updates independently.
  updateDialogue(dt);

  if (isConversationActive()) {
    updateSparkles(dt);
    return;
  }

  // Opening thought appears on the first movement.
  if (
    !openingMessageStarted &&
    (keys.left || keys.right)
  ) {
    openingMessageStarted = true;

    showJourneyMessage({
      category: "thought",
      title: "",
      text: openingJourneyMessage,
      duration: 4,
      typewriter: true
    });
  }

  updatePlayer(dt);
  updateCamera();

  checkFlowerCollection();

  if (
    !cutsceneStarted &&
    player.x + player.width >= MEETING_X
  ) {
    startMeetingCutscene();
  }

  updateSparkles(dt);
}


// GAME LOOP

function gameLoop(timestamp) {
  if (!playing) return;

  let dt = (timestamp - lastTime) / 1000;

  lastTime = timestamp;
  dt = Math.min(dt, 0.033);

  update(dt);
  draw();

  requestAnimationFrame(gameLoop);
}


// START GAME

async function startGame() {
  if (playing) return;

  playing = true;
  clearKeys();

  sprinting = false;

  player.speed = WALK_SPEED;
  player.acceleration = WALK_ACCELERATION;

  startScreen.classList.add("hidden");
  playScreen.classList.remove("hidden");

  // RESET DIALOGUE

  resetDialogue();

  openingMessageStarted = false;

  cutsceneStarted = false;

  const controls =
    document.getElementById("controls");

  if (controls) {
    controls.style.display = "";
  }


  // RESET PLAYER

  player.x = 100;
  player.y = GROUND_Y - player.height;

  player.velocityX = 0;
  player.velocityY = 0;

  player.grounded = true;
  player.direction = 1;

  player.animationTime = 0;
  player.currentFrame = 0;


  // RESET SECOND LOVER

  secondLover.x = WORLD_WIDTH - 400;
  secondLover.y = GROUND_Y - secondLover.height;
  secondLover.direction = -1;
  secondLover.visible = false;


  // RESET FLOWERS

  flowerCount = 0;

  for (const flower of flowers) {
    flower.collected = false;
  }

  updateFlowerCounter();


  // RESET VISUAL EFFECTS

  sparkles = [];
  cameraX = 0;

  createAmbientParticles();


  // FULLSCREEN

  try {
    if (
      document.documentElement.requestFullscreen &&
      !document.fullscreenElement
    ) {
      await document.documentElement.requestFullscreen();
    }
  } catch (_) {
    // Fullscreen may be blocked by the browser.
  }

  lastTime = performance.now();

  requestAnimationFrame(gameLoop);
}


// START BUTTON

document.getElementById("play-button").addEventListener("click", () => {
  console.log("BUTTON WORKS");
  startGame();
});

// INITIALIZE VISUALS

createAmbientParticles();
draw();
