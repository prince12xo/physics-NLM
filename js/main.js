'use strict';

const OVERLAY_DURATION_MS = 2000;
const OVERLAY_FADE_MS = 500;

const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');

const controls = {
  friction: document.getElementById('friction'),
  restitution: document.getElementById('restitution'),
  frictionValue: document.getElementById('frictionValue'),
  restitutionValue: document.getElementById('restitutionValue'),
  reset: document.getElementById('resetBtn'),
};

const readouts = {
  maxSpeed: document.getElementById('maxSpeed'),
  momentum: document.getElementById('momentum'),
  rockCount: document.getElementById('rockCount'),
};

const settings = {
  friction: parseFloat(controls.friction.value),
  restitution: parseFloat(controls.restitution.value),
};

const viewport = { width: 0, height: 0 };
const sun = { x: 0, y: 0, radius: SUN_LAYOUT.radius };
const particles = [];
let rocks = [];

const slingshot = new Slingshot(canvas, () => rocks);

function hideOrientationOverlay() {
  const overlay = document.getElementById('orientationOverlay');
  setTimeout(() => {
    overlay.classList.add('is-hidden');
    setTimeout(() => (overlay.style.display = 'none'), OVERLAY_FADE_MS);
  }, OVERLAY_DURATION_MS);
}

function resizeCanvas() {
  viewport.width = canvas.width = window.innerWidth;
  viewport.height = canvas.height = window.innerHeight;
}

function resetScene() {
  const { width, height } = viewport;
  sun.x = width * SUN_LAYOUT.x;
  sun.y = height * SUN_LAYOUT.y;
  rocks = ROCK_LAYOUT.map(
    ({ x, y, radius, mass }) => new Rock(width * x, height * y, radius, mass),
  );
  slingshot.cancel();
}

function bindSlider(input, label, key, decimals) {
  input.addEventListener('input', () => {
    settings[key] = parseFloat(input.value);
    label.textContent = settings[key].toFixed(decimals);
  });
}

function fieldBounds() {
  const { width, height } = viewport;
  return {
    left: 0,
    right: width,
    top: height * PHYSICS.horizonRatio,
    bottom: height - PHYSICS.groundMargin,
  };
}

function renderTelemetry() {
  const { maxSpeed, momentum, count } = measureSystem(rocks);
  readouts.maxSpeed.textContent = `${maxSpeed.toFixed(1)} m/s`;
  readouts.momentum.textContent = momentum.toFixed(1);
  readouts.rockCount.textContent = count;
}

function tick() {
  const bounds = fieldBounds();

  for (const rock of rocks) {
    rock.step(settings.friction, bounds);
    emitTrail(particles, rock);
  }
  resolveCollisions(rocks, settings.restitution);
  advanceParticles(particles);
}

function render() {
  ctx.clearRect(0, 0, viewport.width, viewport.height);
  drawScenery(ctx, sun, viewport.width, viewport.height);
  drawParticles(ctx, particles);
  rocks.forEach((rock) => drawRock(ctx, rock));

  if (slingshot.isAiming) {
    drawAimGuide(ctx, slingshot.rock, slingshot.pointer, slingshot.pull);
  }
}

function frame() {
  tick();
  renderTelemetry();
  render();
  requestAnimationFrame(frame);
}

hideOrientationOverlay();
resizeCanvas();
resetScene();

window.addEventListener('resize', resizeCanvas);
bindSlider(controls.friction, controls.frictionValue, 'friction', 3);
bindSlider(controls.restitution, controls.restitutionValue, 'restitution', 2);
controls.reset.addEventListener('click', resetScene);
slingshot.attach();

frame();
