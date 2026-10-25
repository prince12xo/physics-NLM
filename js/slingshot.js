'use strict';

class Slingshot {
  constructor(canvas, getRocks) {
    this.canvas = canvas;
    this.getRocks = getRocks;
    this.rock = null;
    this.anchor = { x: 0, y: 0 };
    this.pointer = { x: 0, y: 0 };
  }

  get isAiming() {
    return this.rock !== null;
  }

  get pull() {
    return { x: this.anchor.x - this.pointer.x, y: this.anchor.y - this.pointer.y };
  }

  attach() {
    const grab = (evt) => this.grab(evt);
    const move = (evt) => this.move(evt);
    const release = () => this.release();

    this.canvas.addEventListener('mousedown', grab);
    this.canvas.addEventListener('touchstart', grab, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
    window.addEventListener('mouseup', release);
    window.addEventListener('touchend', release);
  }

  pointerPosition(evt) {
    const rect = this.canvas.getBoundingClientRect();
    const source = evt.touches ? evt.touches[0] : evt;
    return { x: source.clientX - rect.left, y: source.clientY - rect.top };
  }

  grab(evt) {
    const pos = this.pointerPosition(evt);
    const rock = this.getRocks().find(
      (r) => Math.hypot(pos.x - r.x, pos.y - r.y) < r.radius * PHYSICS.grabRadiusScale,
    );
    if (!rock) return;

    this.rock = rock;
    this.anchor = { x: rock.x, y: rock.y };
    this.pointer = pos;
  }

  move(evt) {
    if (!this.isAiming) return;
    this.pointer = this.pointerPosition(evt);
  }

  release() {
    if (!this.isAiming) return;

    const { x, y } = this.pull;
    this.rock.vx = x * PHYSICS.launchScale;
    this.rock.vy = y * PHYSICS.launchScale;
    this.rock = null;
  }

  cancel() {
    this.rock = null;
  }
}
