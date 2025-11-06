const nTrace = 64;
const PI200 = 200 / Math.PI;
class Planet {
  mass;
  size;
  trace = new Array(nTrace);
  steps = 1;  // number of steps
  count = 0;
  tracePos = 0;
  pos;
  vel;
  speed;
  color;

  constructor(mass, initpos, initdir, name) {
    this.mass = mass;
    this.pos = initpos;
    this.vel = initdir;
    this.name = name;
    this.speed = Math.sqrt(initdir[0] * initdir[0] + initdir[1] * initdir[1]);
    this.color = randomColor();
    this.size = (Math.pow(mass / ((4 / 3) * Math.PI), 1 / 3)) / SIZEFAC;
    for (let i = 0; i < nTrace; i++) {
      this.trace[i] = [
        initpos[0] / POSFAC + POS_OFFSET_X, initpos[1] / POSFAC + POS_OFFSET_Y
      ];
    }
  }

  getInfo() {
    return this.name + ', ' + this.mass + 'em';
  }

  move(x, y) {
    // move planet to pixel
    this.pos = [(x - POS_OFFSET_X) * POSFAC, (y - POS_OFFSET_Y) * POSFAC];
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
      this.tracePos = (this.tracePos + 1) % nTrace;
      this.trace[this.tracePos] =
          [p0 / POSFAC + POS_OFFSET_X, p1 / POSFAC + POS_OFFSET_Y];
    }
    circle(
        p0 / POSFAC + POS_OFFSET_X, p1 / POSFAC + POS_OFFSET_Y, this.size,
        this.color);
    // draw traces
    const pp1 = (this.tracePos < nTrace - 1) ? this.tracePos + 1 : 0;
    context.strokeStyle = '#999999';
    context.beginPath();
    context.moveTo(this.trace[pp1][0], this.trace[pp1][1]);
    for (let i = pp1 + 1; i < nTrace; i++) {
      context.lineTo(this.trace[i][0], this.trace[i][1]);
    }
    for (let i = 0; i < pp1; i++) {
      context.lineTo(this.trace[i][0], this.trace[i][1]);
    }
    context.stroke();
    context.closePath();
  }
}
