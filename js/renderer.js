'use strict';

const FULL_CIRCLE = Math.PI * 2;
const ARROW_HEAD_LENGTH = 7;

function addColorStops(gradient, offsets, colors) {
  offsets.forEach((offset, i) => gradient.addColorStop(offset, colors[i]));
  return gradient;
}

function drawArrow(ctx, from, to, color, label) {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(to.x, to.y);
  ctx.lineTo(
    to.x - ARROW_HEAD_LENGTH * Math.cos(angle - Math.PI / 6),
    to.y - ARROW_HEAD_LENGTH * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    to.x - ARROW_HEAD_LENGTH * Math.cos(angle + Math.PI / 6),
    to.y - ARROW_HEAD_LENGTH * Math.sin(angle + Math.PI / 6),
  );
  ctx.fill();

  if (label) {
    ctx.font = '9px monospace';
    ctx.fillStyle = PALETTE.label;
    ctx.fillText(label, to.x + 6, to.y - 3);
  }
  ctx.restore();
}

function drawScenery(ctx, sun, width, height) {
  const glowRadius = sun.radius * 2;
  ctx.fillStyle = addColorStops(
    ctx.createRadialGradient(sun.x, sun.y, 10, sun.x, sun.y, glowRadius),
    [0, 0.3, 1],
    PALETTE.sunGradient,
  );
  ctx.beginPath();
  ctx.arc(sun.x, sun.y, glowRadius, 0, FULL_CIRCLE);
  ctx.fill();

  ctx.fillStyle = addColorStops(
    ctx.createLinearGradient(0, height * 0.4, 0, height),
    [0, 0.2, 1],
    PALETTE.groundGradient,
  );
  ctx.fillRect(0, height * 0.35, width, height * 0.65);
}

function drawParticles(ctx, particles) {
  for (const particle of particles) {
    ctx.fillStyle = `rgba(${PALETTE.trailRgb}, ${particle.life * 0.6})`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, FULL_CIRCLE);
    ctx.fill();
  }
}

function drawRock(ctx, rock) {
  const { x, y, radius } = rock;

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y + radius * 0.7, radius, radius * 0.3, 0, 0, FULL_CIRCLE);
  ctx.fillStyle = PALETTE.rockShadow;
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x, y, radius, 0, FULL_CIRCLE);
  ctx.fillStyle = addColorStops(
    ctx.createRadialGradient(x - radius * 0.3, y - radius * 0.3, radius * 0.1, x, y, radius),
    [0, 0.7, 1],
    PALETTE.rockGradient,
  );
  ctx.fill();
  ctx.strokeStyle = PALETTE.rockOutline;
  ctx.lineWidth = 1.2;
  ctx.stroke();
  ctx.restore();

  const speed = rock.speed;
  if (speed <= VECTOR_DISPLAY.minSpeed) return;

  const tip = {
    x: x + rock.vx * VECTOR_DISPLAY.velocityScale,
    y: y + rock.vy * VECTOR_DISPLAY.velocityScale,
  };
  drawArrow(ctx, rock, tip, PALETTE.velocity, `${speed.toFixed(1)}v`);
}

function drawAimGuide(ctx, rock, pointer, pull) {
  ctx.beginPath();
  ctx.moveTo(rock.x, rock.y);
  ctx.lineTo(pointer.x, pointer.y);
  ctx.strokeStyle = PALETTE.slingBand;
  ctx.lineWidth = 2;
  ctx.stroke();

  const tip = {
    x: rock.x + pull.x * VECTOR_DISPLAY.aimScale,
    y: rock.y + pull.y * VECTOR_DISPLAY.aimScale,
  };
  drawArrow(ctx, rock, tip, PALETTE.aim, 'Aim v');
}
