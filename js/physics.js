'use strict';

function resolveCollision(a, b, restitution) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  const contactDistance = a.radius + b.radius;

  if (distance >= contactDistance || distance === 0) return;

  const nx = dx / distance;
  const ny = dy / distance;

  const halfOverlap = (contactDistance - distance) / 2;
  a.x -= nx * halfOverlap;
  a.y -= ny * halfOverlap;
  b.x += nx * halfOverlap;
  b.y += ny * halfOverlap;

  const closingSpeed = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
  if (closingSpeed <= 0) return;

  const impulse = (2 * closingSpeed * restitution) / (a.mass + b.mass);
  a.vx -= impulse * b.mass * nx;
  a.vy -= impulse * b.mass * ny;
  b.vx += impulse * a.mass * nx;
  b.vy += impulse * a.mass * ny;
}

function resolveCollisions(rocks, restitution) {
  for (let i = 0; i < rocks.length; i++) {
    for (let j = i + 1; j < rocks.length; j++) {
      resolveCollision(rocks[i], rocks[j], restitution);
    }
  }
}

function measureSystem(rocks) {
  let maxSpeed = 0;
  let px = 0;
  let py = 0;

  for (const rock of rocks) {
    maxSpeed = Math.max(maxSpeed, rock.speed);
    px += rock.mass * rock.vx;
    py += rock.mass * rock.vy;
  }

  return { maxSpeed, momentum: Math.hypot(px, py), count: rocks.length };
}
