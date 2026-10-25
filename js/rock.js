'use strict';

class Rock {
  constructor(x, y, radius, mass) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.mass = mass;
    this.vx = 0;
    this.vy = 0;
  }

  get speed() {
    return Math.hypot(this.vx, this.vy);
  }

  step(friction, bounds) {
    this.x += this.vx;
    this.y += this.vy;

    const damping = 1 - friction;
    this.vx *= damping;
    this.vy *= damping;

    if (this.speed < PHYSICS.restSpeed) {
      this.vx = 0;
      this.vy = 0;
    }

    this.containWithin(bounds);
  }

  containWithin({ left, right, top, bottom }) {
    const r = this.radius;
    const bounce = -PHYSICS.wallBounce;

    if (this.x - r < left) {
      this.x = left + r;
      this.vx *= bounce;
    }
    if (this.x + r > right) {
      this.x = right - r;
      this.vx *= bounce;
    }
    if (this.y - r < top) {
      this.y = top + r;
      this.vy *= bounce;
    }
    if (this.y + r > bottom) {
      this.y = bottom - r;
      this.vy *= bounce;
    }
  }
}
