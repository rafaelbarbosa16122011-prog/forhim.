
// ========================================
// ROSEDEL — VISUALS
// Image assets, drawing, particles and effects.
// ========================================


// IMAGE LOADER

function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image;
}


// CHARACTER IMAGES

const characterImage = loadImage("assets/character.png");
const secondLoverImage = loadImage("assets/2ndlover.png");

const walkFrames = [
  loadImage("assets/walk1.png"),
  loadImage("assets/walk2.png"),
  loadImage("assets/walk3.png"),
  loadImage("assets/walk4.png")
];

const sprintFrames = [
  loadImage("assets/sprint1.png"),
  loadImage("assets/sprint2.png"),
  loadImage("assets/sprint3.png"),
  loadImage("assets/sprint4.png")
];

const flowerImage = loadImage("assets/flower.png");
const backgroundImage = loadImage("assets/background.png");


// ========================================
// COLLECTION SPARKLES
// ========================================

let sparkles = [];

function createSparkles(x, y) {
  for (let i = 0; i < 18; i++) {
    sparkles.push({
      x: x,
      y: y,
      velocityX: (Math.random() - 0.5) * 150,
      velocityY: (Math.random() - 0.8) * 150,
      size: Math.random() * 4 + 2,
      life: 0.7,
      maxLife: 0.7
    });
  }
}

function updateSparkles(dt) {
  for (let i = sparkles.length - 1; i >= 0; i--) {
    const sparkle = sparkles[i];

    sparkle.x += sparkle.velocityX * dt;
    sparkle.y += sparkle.velocityY * dt;
    sparkle.velocityY += 180 * dt;
    sparkle.life -= dt;

    if (sparkle.life <= 0) {
      sparkles.splice(i, 1);
    }
  }
}

function drawSparkles() {
  for (const sparkle of sparkles) {
    const opacity = Math.max(
      0,
      sparkle.life / sparkle.maxLife
    );

    ctx.globalAlpha = opacity;
    ctx.fillStyle = "#ffd6ec";

    ctx.beginPath();
    ctx.arc(
      sparkle.x - cameraX,
      sparkle.y,
      sparkle.size,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.globalAlpha = 1;
}


// ========================================
// AMBIENT PETALS AND LEAVES
// ========================================

let ambientParticles = [];

function createAmbientParticles() {
  ambientParticles = [];

  for (let i = 0; i < 24; i++) {
    ambientParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 2,
      speedY: Math.random() * 15 + 8,
      sway: Math.random() * 2 + 1,
      phase: Math.random() * Math.PI * 2,
      isPetal: Math.random() < 0.7
    });
  }
}

function updateAmbientParticles(dt) {
  for (const particle of ambientParticles) {
    particle.phase += dt * particle.sway;

    particle.x += Math.sin(particle.phase) * 12 * dt;
    particle.y += particle.speedY * dt;

    if (particle.y > canvas.height + 10) {
      particle.y = -10;
      particle.x = Math.random() * canvas.width;
    }

    if (particle.x < -10) {
      particle.x = canvas.width + 10;
    }

    if (particle.x > canvas.width + 10) {
      particle.x = -10;
    }
  }
}

function drawAmbientParticles() {
  for (const particle of ambientParticles) {
    ctx.globalAlpha = 0.75;

    ctx.fillStyle = particle.isPetal
      ? "#f5b8d5"
      : "#648e67";

    ctx.beginPath();

    ctx.ellipse(
      particle.x,
      particle.y,
      particle.size,
      particle.size * 0.65,
      particle.phase,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  ctx.globalAlpha = 1;
}


// ========================================
// BACKGROUND
// ========================================

function drawBackground() {
  ctx.fillStyle = "#d9e9d4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (
    backgroundImage.complete &&
    backgroundImage.naturalWidth > 0
  ) {
    const tileWidth = canvas.width;
    const tileHeight = GROUND_Y;

    const offset =
      ((cameraX * 0.25) % tileWidth + tileWidth) % tileWidth;

    for (let x = -offset; x < canvas.width; x += tileWidth) {
      ctx.drawImage(
        backgroundImage,
        x,
        0,
        tileWidth,
        tileHeight
      );
    }
  }

  ctx.fillStyle = "#78996d";

  ctx.fillRect(
    0,
    GROUND_Y,
    canvas.width,
    canvas.height - GROUND_Y
  );
}


// ========================================
// BUSHES
// ========================================

function drawBush(x, size = 1) {
  const screenX = x - cameraX;
  const ground = GROUND_Y;

  if (screenX < -180 || screenX > canvas.width + 180) return;

  ctx.save();
  ctx.translate(screenX, ground);
  ctx.scale(size, size);

  ctx.fillStyle = "#526D50";
  ctx.beginPath();
  ctx.ellipse(0, -5, 75, 13, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#66875F";
  ctx.beginPath();
  ctx.arc(-35, -35, 35, 0, Math.PI * 2);
  ctx.arc(0, -48, 42, 0, Math.PI * 2);
  ctx.arc(38, -30, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#89A879";
  ctx.beginPath();
  ctx.arc(-18, -55, 17, 0, Math.PI * 2);
  ctx.arc(25, -47, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#D99AAF";

  for (const [fx, fy] of [
    [-35, -45],
    [12, -65],
    [43, -25]
  ]) {
    ctx.beginPath();
    ctx.arc(fx, fy, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}


// ========================================
// TREE
// ========================================

function drawGardenTree(x) {
  const screenX = x - cameraX;
  const ground = GROUND_Y;

  if (screenX < -250 || screenX > canvas.width + 250) return;

  ctx.save();
  ctx.translate(screenX, ground);

  ctx.fillStyle = "#765744";
  ctx.fillRect(-17, -190, 34, 190);

  ctx.strokeStyle = "#765744";
  ctx.lineWidth = 15;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(0, -125);
  ctx.lineTo(-55, -190);
  ctx.moveTo(0, -145);
  ctx.lineTo(55, -205);
  ctx.stroke();

  ctx.fillStyle = "#547653";

  ctx.beginPath();
  ctx.arc(-55, -205, 65, 0, Math.PI * 2);
  ctx.arc(0, -250, 75, 0, Math.PI * 2);
  ctx.arc(60, -205, 65, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#78966D";

  ctx.beginPath();
  ctx.arc(-30, -260, 28, 0, Math.PI * 2);
  ctx.arc(45, -230, 25, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}


// ========================================
// FLOWER FIELD
// ========================================

function drawFlowerField(x, count = 12) {
  const screenX = x - cameraX;
  const ground = GROUND_Y;

  if (screenX < -250 || screenX > canvas.width + 250) return;

  const colors = [
    "#D99AAF",
    "#F0C3D4",
    "#E9D6A5",
    "#BF8298"
  ];

  for (let i = 0; i < count; i++) {
    const flowerX = screenX + i * 24 - count * 12;
    const flowerHeight = 18 + (i % 3) * 8;

    ctx.strokeStyle = "#52734E";
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(flowerX, ground);
    ctx.lineTo(flowerX, ground - flowerHeight);
    ctx.stroke();

    ctx.fillStyle = colors[i % colors.length];

    ctx.beginPath();
    ctx.arc(
      flowerX,
      ground - flowerHeight,
      7,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#E9D6A5";
    ctx.beginPath();
    ctx.arc(
      flowerX,
      ground - flowerHeight,
      2.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}


// ========================================
// GRASS TUFTS
// ========================================

function drawGrassTuft(x, size = 1) {
  const screenX = x - cameraX;

  if (screenX < -30 || screenX > canvas.width + 30) return;

  ctx.save();
  ctx.translate(screenX, GROUND_Y);
  ctx.scale(size, size);

  ctx.strokeStyle = "#52734E";
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(-8, 0);
  ctx.quadraticCurveTo(-13, -12, -17, -19);

  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-2, -17, 2, -25);

  ctx.moveTo(7, 0);
  ctx.quadraticCurveTo(14, -12, 18, -18);
  ctx.stroke();

  ctx.strokeStyle = "#89A879";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-2, -8);
  ctx.lineTo(2, -19);
  ctx.stroke();

  ctx.restore();
}


// ========================================
// FALLEN PETALS
// ========================================

function drawFallenPetals(x, count = 5) {
  const screenX = x - cameraX;

  if (screenX < -100 || screenX > canvas.width + 100) return;

  const petals = [
    [-18, -3, 0.4],
    [-7, -5, -0.5],
    [5, -2, 0.8],
    [16, -4, -0.2],
    [0, -8, 0.2]
  ];

  ctx.save();

  for (let i = 0; i < count; i++) {
    const [offsetX, offsetY, rotation] =
      petals[i % petals.length];

    ctx.fillStyle = i % 2 === 0
      ? "#E9A6C5"
      : "#F4C6D9";

    ctx.beginPath();
    ctx.ellipse(
      screenX + offsetX,
      GROUND_Y + offsetY,
      5,
      2.5,
      rotation,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  ctx.restore();
}


// ========================================
// SMALL PATH ROCKS
// ========================================

function drawRock(x, size = 1) {
  const screenX = x - cameraX;

  if (screenX < -40 || screenX > canvas.width + 40) return;

  ctx.save();
  ctx.translate(screenX, GROUND_Y);
  ctx.scale(size, size);

  ctx.fillStyle = "#52634f";
  ctx.beginPath();
  ctx.ellipse(2, -2, 17, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#8b927f";
  ctx.beginPath();
  ctx.moveTo(-15, -3);
  ctx.lineTo(-11, -13);
  ctx.lineTo(-3, -18);
  ctx.lineTo(9, -15);
  ctx.lineTo(16, -6);
  ctx.lineTo(13, -2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#b4b9a5";
  ctx.beginPath();
  ctx.moveTo(-9, -11);
  ctx.lineTo(-3, -16);
  ctx.lineTo(5, -14);
  ctx.lineTo(-2, -10);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}


// ========================================
// POND
// ========================================

function drawPond(x, width = 420) {
  const screenX = x - cameraX;

  if (screenX < -width || screenX > canvas.width + width) return;

  const surfaceY = GROUND_Y;
  const pondDepth = 65;

  ctx.save();

  ctx.fillStyle = "#594B3D";
  ctx.beginPath();
  ctx.moveTo(screenX - width / 2 - 12, surfaceY);
  ctx.quadraticCurveTo(
    screenX - width / 2,
    surfaceY + pondDepth,
    screenX,
    surfaceY + pondDepth
  );
  ctx.quadraticCurveTo(
    screenX + width / 2,
    surfaceY + pondDepth,
    screenX + width / 2 + 12,
    surfaceY
  );
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#78AEB0";
  ctx.beginPath();
  ctx.moveTo(screenX - width / 2, surfaceY + 5);
  ctx.quadraticCurveTo(
    screenX,
    surfaceY + 22,
    screenX + width / 2,
    surfaceY + 5
  );
  ctx.lineTo(screenX + width / 2 - 15, surfaceY + pondDepth - 8);
  ctx.quadraticCurveTo(
    screenX,
    surfaceY + pondDepth + 5,
    screenX - width / 2 + 15,
    surfaceY + pondDepth - 8
  );
  ctx.closePath();
  ctx.fill();

  ctx.strokeStyle = "#B5D9D0";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(screenX - 130, surfaceY + 17);
  ctx.lineTo(screenX - 80, surfaceY + 17);

  ctx.moveTo(screenX + 35, surfaceY + 22);
  ctx.lineTo(screenX + 100, surfaceY + 22);
  ctx.stroke();

  ctx.fillStyle = "#527F59";

  for (const [offsetX, offsetY, size] of [
    [-100, 12, 18],
    [30, 18, 22],
    [115, 10, 15]
  ]) {
    ctx.beginPath();
    ctx.arc(
      screenX + offsetX,
      surfaceY + offsetY,
      size,
      0.3,
      Math.PI * 1.85
    );
    ctx.lineTo(screenX + offsetX, surfaceY + offsetY);
    ctx.fill();
  }

  ctx.strokeStyle = "#668653";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";

  ctx.beginPath();
  ctx.moveTo(screenX - width / 2 - 8, surfaceY);
  ctx.quadraticCurveTo(
    screenX - width / 2,
    surfaceY + 8,
    screenX - width / 2 + 25,
    surfaceY + 9
  );

  ctx.moveTo(screenX + width / 2 + 8, surfaceY);
  ctx.quadraticCurveTo(
    screenX + width / 2,
    surfaceY + 8,
    screenX + width / 2 - 25,
    surfaceY + 9
  );

  ctx.stroke();

  ctx.restore();
}


// ========================================
// GARDEN SCENERY
// ========================================

function drawGardenScenery() {
  drawBush(550, 1);
  drawBush(850, 0.8);
  drawBush(1550, 1.1);
  drawBush(2050, 0.9);
  drawBush(4650, 1);
  drawBush(5100, 0.85);

  drawFlowerField(2850, 16);

  drawGardenTree(3900);

  drawGrassTuft(300, 0.8);
  drawGrassTuft(700, 1);
  drawGrassTuft(1200, 1.2);
  drawGrassTuft(1750, 0.8);
  drawGrassTuft(2450, 1);
  drawGrassTuft(3200, 1.1);
  drawGrassTuft(3600, 0.8);
  drawGrassTuft(4200, 1);
  drawGrassTuft(4850, 1.2);
  drawGrassTuft(5550, 0.9);

  drawFallenPetals(600, 4);
  drawFallenPetals(1350, 5);
  drawFallenPetals(2150, 3);
  drawFallenPetals(3000, 5);
  drawFallenPetals(3750, 4);
  drawFallenPetals(4500, 5);
  drawFallenPetals(5250, 3);

  drawRock(950, 0.8);
  drawRock(1800, 1);
  drawRock(2600, 0.7);
  drawRock(3350, 0.9);
  drawRock(4050, 1.1);
  drawRock(4950, 0.8);
  drawRock(5700, 1);

  drawPond(3050, 420);
}


// ========================================
// COLLECTIBLE FLOWERS
// ========================================

function drawPlaceholderFlower(screenX, flower) {
  const centerX = screenX + flower.width / 2;
  const topY = flower.y + 18;
  const bottomY = flower.y + flower.height;

  const petalColor = flower.color || "#e9a6c5";
  const petalCount = flower.petals || 5;
  const radius = 5;

  ctx.strokeStyle = "#477b50";
  ctx.lineWidth = 3;

  ctx.beginPath();
  ctx.moveTo(centerX, topY + 5);
  ctx.lineTo(centerX, bottomY);
  ctx.stroke();

  ctx.fillStyle = "#6b9b65";

  ctx.beginPath();
  ctx.ellipse(
    centerX - 6,
    bottomY - 12,
    7,
    3,
    -0.5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(
    centerX + 6,
    bottomY - 20,
    7,
    3,
    0.5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.fillStyle = petalColor;

  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount;
    const petalX = centerX + Math.cos(angle) * 7;
    const petalY = topY + Math.sin(angle) * 7;

    ctx.beginPath();
    ctx.arc(petalX, petalY, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#e8c66b";

  ctx.beginPath();
  ctx.arc(centerX, topY, 4, 0, Math.PI * 2);
  ctx.fill();
}


function drawFlowers() {
  for (const flower of flowers) {
    if (flower.collected) continue;

    const screenX = flower.x - cameraX;

    if (
      screenX < -flower.width ||
      screenX > canvas.width + flower.width
    ) continue;

    if (
      flower.name === "Ceibo" &&
      flowerImage.complete &&
      flowerImage.naturalWidth > 0
    ) {
      ctx.drawImage(
        flowerImage,
        screenX,
        flower.y,
        flower.width,
        flower.height
      );
    } else {
      drawPlaceholderFlower(screenX, flower);
    }
  }
}


// ========================================
// PLAYER
// ========================================

function drawPlayer() {
  const moving =
    !isConversationActive() &&
    (keys.left || keys.right);

  let image = characterImage;

  if (moving) {
    const selectedFrames = sprinting
      ? sprintFrames
      : walkFrames;

    const selectedFrame = selectedFrames[player.currentFrame];

    if (
      selectedFrame &&
      selectedFrame.complete &&
      selectedFrame.naturalWidth > 0
    ) {
      image = selectedFrame;
    } else if (
      walkFrames[player.currentFrame] &&
      walkFrames[player.currentFrame].complete &&
      walkFrames[player.currentFrame].naturalWidth > 0
    ) {
      image = walkFrames[player.currentFrame];
    }
  }

  const screenX = player.x - cameraX;

  const spriteX =
    screenX - (player.spriteWidth - player.width) / 2;

  const spriteY =
    player.y + player.height - player.spriteHeight + 10;

  if (image.complete && image.naturalWidth > 0) {
    ctx.save();

    if (player.direction === -1) {
      ctx.translate(spriteX + player.spriteWidth, 0);
      ctx.scale(-1, 1);

      ctx.drawImage(
        image,
        0,
        spriteY,
        player.spriteWidth,
        player.spriteHeight
      );
    } else {
      ctx.drawImage(
        image,
        spriteX,
        spriteY,
        player.spriteWidth,
        player.spriteHeight
      );
    }

    ctx.restore();
  } else {
    ctx.fillStyle = "#444";
    ctx.fillRect(screenX, player.y, player.width, player.height);
  }
}


// ========================================
// SECOND LOVER
// ========================================

function drawSecondLover() {
  if (!secondLover.visible) return;

  if (
    !secondLoverImage.complete ||
    secondLoverImage.naturalWidth === 0
  ) {
    return;
  }

  const screenX = secondLover.x - cameraX;

  const aspectRatio =
    secondLoverImage.naturalWidth /
    secondLoverImage.naturalHeight;

  const spriteHeight = secondLover.spriteHeight;
  const spriteWidth = spriteHeight * aspectRatio;

  const spriteX =
    screenX -
    (secondLover.width / 2) -
    (spriteWidth / 2);

  const spriteY =
    secondLover.y +
    secondLover.height -
    spriteHeight +
    10;

  ctx.save();

  if (secondLover.direction === -1) {
    ctx.translate(spriteX + spriteWidth, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(spriteX, 0);
  }

  ctx.drawImage(
    secondLoverImage,
    0,
    spriteY,
    spriteWidth,
    spriteHeight
  );

  ctx.restore();
}


// ========================================
// FALLEN BRANCHES
// ========================================

function drawBranches() {
  for (const branch of branches) {
    const x = branch.x - cameraX;
    const y = GROUND_Y;

    if (
      x < -branch.width ||
      x > canvas.width + branch.width
    ) continue;

    ctx.save();

    ctx.fillStyle = "#493326";

    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x + 5, y - 19);
    ctx.lineTo(x + branch.width * 0.35, y - 22);
    ctx.lineTo(x + branch.width * 0.65, y - 13);
    ctx.lineTo(x + branch.width + 5, y - 17);
    ctx.lineTo(x + branch.width + 3, y - 2);
    ctx.lineTo(x, y - 1);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#895b3d";

    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + 7, y - 17);
    ctx.lineTo(x + branch.width * 0.35, y - 18);
    ctx.lineTo(x + branch.width * 0.7, y - 10);
    ctx.lineTo(x + branch.width, y - 14);
    ctx.lineTo(x + branch.width - 4, y - 3);
    ctx.lineTo(x + 4, y - 2);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#b9855b";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(x + 12, y - 12);
    ctx.lineTo(x + branch.width * 0.4, y - 14);
    ctx.stroke();

    ctx.strokeStyle = "#60402e";
    ctx.lineWidth = 6;

    ctx.beginPath();
    ctx.moveTo(x + branch.width * 0.3, y - 12);
    ctx.lineTo(x + branch.width * 0.22, y - 31);
    ctx.lineTo(x + branch.width * 0.13, y - 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + branch.width * 0.72, y - 9);
    ctx.lineTo(x + branch.width * 0.8, y - 26);
    ctx.stroke();

    ctx.fillStyle = "#d0a078";

    ctx.beginPath();
    ctx.ellipse(
      x + branch.width - 3,
      y - 8,
      5,
      6,
      0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.restore();
  }
}


// ========================================
// MAIN DRAW
// ========================================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();
  drawGardenScenery();
  drawBranches();
  drawFlowers();
  drawSparkles();
  drawSecondLover();
  drawPlayer();
  drawAmbientParticles();
}
