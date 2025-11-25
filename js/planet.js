'use strict';

import {circle} from './util.js';
import {getTraceLength, getCenterTrace, getCenterX, getCenterY, getPosFac, getSizeFac, getScreenWidth, getScreenHeight, getContext} from './globals.js';

export {Planet};

const TRACE_LENGTH = 512;
const PI200 = 200 / Math.PI;
class Planet {
  mass;
  size;
  trace = new Array(TRACE_LENGTH);
  steps = 1;  // number of steps
  count = 0;
  pos;
  vel;
  speed;
  color;

  constructor(mass, initpos, initdir, name, color) {
    this.mass = mass;
    this.pos = initpos;
    this.vel = initdir;
    this.name = name;
    this.speed = Math.sqrt(initdir[0] * initdir[0] + initdir[1] * initdir[1]);
    this.color = color;
    this.size = Math.pow(mass / ((4 / 3) * Math.PI), 1 / 3);
    for (let i = 0; i < TRACE_LENGTH; i++) {
      this.trace[i] = [initpos[0], initpos[1]];
    }
  }

  getInfo() {
    return this.name + ', ' + this.mass + 'em';
  }

  move(x, y) {
    // move planet to pixel
    this.pos = [
      (x - getScreenWidth() / 2) * getPosFac() + getCenterX(),
      (y - getScreenHeight() / 2) * getPosFac() + getCenterY(),
    ];
    this.vel = [0, 0];
    this.speed = 0;
  }

  doMove([p0, p1, v0, v1]) {
    const lastVel = [...this.vel];
    this.vel = [v0, v1];
    this.pos = [p0, p1];

    // stepsize control TODO!
    const newSpeed = Math.sqrt(v0 * v0 + v1 * v1);
    if (newSpeed > 0.1) {  // floating point problem, mathematically not needed!
      const dotProduct = v0 * lastVel[0] + v1 * lastVel[1];
      const alphaDiff = Math.acos(
          dotProduct /
          (newSpeed *
           this.speed));  // todo: this is a bad hack! or rewrite min inline
      const s = Math.floor(PI200 * alphaDiff);
      this.steps = (s < 1) ? 1 : s;  // Math.max(1, 200*alphaDiff/Math.PI)
      this.steps = (this.steps > 18) ? 18 : this.steps;  // Math.min(18,steps)
    } else {
      this.steps = 1;
    }
    this.speed = newSpeed;
    this.count++;
    if (this.count % 2 === 0) {
      this.trace.pop();
      this.trace.unshift([p0, p1]);
    }
  }

  draw() {
    circle(
        (this.pos[0] - getCenterX()) / getPosFac() + getScreenWidth() / 2,
        (this.pos[1] - getCenterY()) / getPosFac() + getScreenHeight() / 2,
        this.size / getSizeFac(), this.color);
    // draw traces
    const context = getContext();
    context.strokeStyle = '#999999';
    context.beginPath();
    let centerTrace = getCenterTrace();
    if (centerTrace === null) {
      centerTrace = Array(TRACE_LENGTH).fill([getCenterX(), getCenterY()]);
    }
    const traceSlice = this.trace.slice(0, getTraceLength());
    const trace = traceSlice.map(
        ([p0, p1], i) =>
            [(p0 - centerTrace[i][0]) / getPosFac() + getScreenWidth() / 2,
             (p1 - centerTrace[i][1]) / getPosFac() + getScreenHeight() / 2]);
    context.moveTo(trace[0][0], trace[0][1]);
    for (let i = 1; i < trace.length; i++) {
      context.lineTo(trace[i][0], trace[i][1]);
    }
    context.stroke();
    context.closePath();
  }

  drawLabel() {
    const context = getContext();
    context.font = '1em "Courier New", monospace';
    context.fillStyle = '#EEEEEE';
    context.textBaseline = 'hanging';
    const radius = this.size / getSizeFac();
    context.fillText(
        this.name,
        (this.pos[0] - getCenterX()) / getPosFac() + getScreenWidth() / 2 +
            radius,
        (this.pos[1] - getCenterY()) / getPosFac() + getScreenHeight() / 2 +
            radius,
    );
  }
}
