'use strict';

import {circle} from './util.js';
import {Settings} from './settings.js';

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

  constructor(context, mass, initpos, initdir, name, color) {
    this.mass = mass;
    this.pos = initpos;
    this.vel = initdir;
    this.name = name;
    this.speed = Math.sqrt(initdir[0] * initdir[0] + initdir[1] * initdir[1]);
    this.color = color;
    this.size = Math.pow(mass / ((4 / 3) * Math.PI), 1 / 3);
    this.context = context;
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
      (x - Settings.getScreenWidth() / 2) * Settings.getPosFac() +
          Settings.getCenterX(),
      (y - Settings.getScreenHeight() / 2) * Settings.getPosFac() +
          Settings.getCenterY(),
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
        this.context,
        (this.pos[0] - Settings.getCenterX()) / Settings.getPosFac() +
            Settings.getScreenWidth() / 2,
        (this.pos[1] - Settings.getCenterY()) / Settings.getPosFac() +
            Settings.getScreenHeight() / 2,
        this.size / Settings.getSizeFac(), this.color + 'C0', this.color);
    if (Settings.getTraceLength() < 1) {
      return;
    }
    // draw traces
    this.context.strokeStyle = this.color;
    this.context.beginPath();
    let centerTrace = Settings.getCenterTrace();
    if (centerTrace === null) {
      centerTrace = Array(TRACE_LENGTH).fill([
        Settings.getCenterX(), Settings.getCenterY()
      ]);
    }
    const traceSlice = this.trace.slice(0, Settings.getTraceLength());
    const trace = traceSlice.map(
        ([p0, p1], i) =>
            [(p0 - centerTrace[i][0]) / Settings.getPosFac() +
                 Settings.getScreenWidth() / 2,
             (p1 - centerTrace[i][1]) / Settings.getPosFac() +
                 Settings.getScreenHeight() / 2]);
    this.context.moveTo(trace[0][0], trace[0][1]);
    for (let i = 1; i < trace.length; i++) {
      this.context.lineTo(trace[i][0], trace[i][1]);
    }
    this.context.stroke();
    this.context.closePath();
  }

  drawLabel() {
    this.context.font = '1em "Courier New", monospace';
    this.context.fillStyle = '#EEEEEE';
    this.context.textBaseline = 'hanging';
    const radius = this.size / Settings.getSizeFac();
    this.context.fillText(
        this.name,
        (this.pos[0] - Settings.getCenterX()) / Settings.getPosFac() +
            Settings.getScreenWidth() / 2 + radius,
        (this.pos[1] - Settings.getCenterY()) / Settings.getPosFac() +
            Settings.getScreenHeight() / 2 + radius,
    );
  }
}
