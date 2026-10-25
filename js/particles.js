'use strict';

function emitTrail(particles, rock) {
  if (rock.speed <= TRAIL.minSpeed || Math.random() >= TRAIL.spawnChance) return;

  particles.push({
    x: rock.x,
    y: rock.y + rock.radius * 0.5,
    vx: (Math.random() - 0.5) * 0.5,
    vy: -Math.random() * 0.5,
    life: 1.0,
    size: Math.random() * 3 + 1.5,
  });
}

function advanceParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i];
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life -= TRAIL.fadeRate;

    if (particle.life <= 0) particles.splice(i, 1);
  }
}
