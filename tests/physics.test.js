const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadSimulation() {
  const context = vm.createContext({ Math });
  for (const file of ['config.js', 'rock.js', 'physics.js', 'particles.js']) {
    const source = fs.readFileSync(path.join(__dirname, '..', 'js', file), 'utf8');
    vm.runInContext(source, context, { filename: file });
  }
  return vm.runInContext(
    '({ PHYSICS, TRAIL, Rock, resolveCollisions, measureSystem, advanceParticles })',
    context,
  );
}

const sim = loadSimulation();
const field = { left: 0, right: 800, top: 100, bottom: 590 };

function momentum(rocks) {
  return rocks.reduce((sum, r) => ({ x: sum.x + r.mass * r.vx, y: sum.y + r.mass * r.vy }), {
    x: 0,
    y: 0,
  });
}

test('friction decays velocity and rocks settle below rest speed', () => {
  const rock = new sim.Rock(400, 300, 20, 1);
  rock.vx = 10;
  rock.step(0.1, field);
  assert.equal(rock.x, 410);
  assert.ok(Math.abs(rock.vx - 9) < 1e-9);

  rock.vx = sim.PHYSICS.restSpeed / 2;
  rock.step(0.01, field);
  assert.equal(rock.vx, 0);
});

test('rocks bounce off field edges with energy loss', () => {
  const rock = new sim.Rock(15, 300, 20, 1);
  rock.vx = -5;
  rock.step(0, field);
  assert.equal(rock.x, 20);
  assert.equal(rock.vx, 5 * sim.PHYSICS.wallBounce);
});

test('head-on collision conserves momentum and separates overlapping rocks', () => {
  const a = new sim.Rock(100, 300, 20, 2);
  const b = new sim.Rock(130, 300, 20, 3);
  a.vx = 4;
  b.vx = -1;
  const before = momentum([a, b]);

  sim.resolveCollisions([a, b], 1);

  const after = momentum([a, b]);
  assert.ok(Math.abs(before.x - after.x) < 1e-9);
  assert.ok(Math.abs(before.y - after.y) < 1e-9);
  assert.ok(Math.hypot(b.x - a.x, b.y - a.y) >= a.radius + b.radius - 1e-9);
  assert.ok(a.vx < b.vx, 'rocks should move apart after impact');
});

test('equal masses swap velocities in a perfectly elastic collision', () => {
  const a = new sim.Rock(100, 300, 20, 1);
  const b = new sim.Rock(139, 300, 20, 1);
  a.vx = 3;

  sim.resolveCollisions([a, b], 1);

  assert.ok(Math.abs(a.vx) < 1e-9);
  assert.ok(Math.abs(b.vx - 3) < 1e-9);
});

test('separating rocks receive no impulse', () => {
  const a = new sim.Rock(100, 300, 20, 1);
  const b = new sim.Rock(139, 300, 20, 1);
  a.vx = -2;
  b.vx = 2;

  sim.resolveCollisions([a, b], 1);

  assert.equal(a.vx, -2);
  assert.equal(b.vx, 2);
});

test('coincident rocks do not produce NaN', () => {
  const a = new sim.Rock(100, 300, 20, 1);
  const b = new sim.Rock(100, 300, 20, 1);

  sim.resolveCollisions([a, b], 1);

  assert.ok(Number.isFinite(a.x) && Number.isFinite(b.vx));
});

test('measureSystem reports max speed, net momentum and count', () => {
  const a = new sim.Rock(0, 0, 10, 2);
  const b = new sim.Rock(0, 0, 10, 1);
  a.vx = 3;
  b.vx = -4;

  const stats = sim.measureSystem([a, b]);

  assert.equal(stats.maxSpeed, 4);
  assert.equal(stats.momentum, 2);
  assert.equal(stats.count, 2);
});

test('expired trail particles are removed', () => {
  const particles = [
    { x: 0, y: 0, vx: 1, vy: 0, life: sim.TRAIL.fadeRate / 2, size: 1 },
    { x: 0, y: 0, vx: 1, vy: 0, life: 1, size: 1 },
  ];

  sim.advanceParticles(particles);

  assert.equal(particles.length, 1);
  assert.equal(particles[0].x, 1);
});
