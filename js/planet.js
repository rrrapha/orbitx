/*
Planet class
*/
function Planet(mass, initpos, initdir, name) {
  var size;
  var mass;
  const ntrace = 64;
  this.steps = 1;               // number of steps
  const PI200 = 200 / Math.PI;  // optimize
  const trace = new Array(ntrace);
  var c = 0;
  var tracepos;
  var lastv = [0, 0];
  this.name = name;
  this.dragged = false;
  this.mass = mass;
  this.size = (Math.pow(mass / ((4 / 3) * Math.PI), 1 / 3)) / SIZEFAC;
  this.pos = initpos;
  this.x = initpos[0] / posfac + posoffsetx;
  this.y = initpos[1] / posfac + posoffsety;
  this.v = initdir;
  this.speed = Math.sqrt(this.v[0] * this.v[0] + this.v[1] * this.v[1]);
  this.color = randomcolor();

  // init traces
  for (var i = 0; i < ntrace; i++) {
    trace[i] = [this.pos[0], this.pos[1]];
  }

  this.domove = function(res) {
    if (!this.dragged) {
      lastv = [this.v[0], this.v[1]];
      this.v = [res[2], res[3]];
      this.pos = [res[0], res[1]];

      // stepsize control TODO!
      var nspeed = Math.sqrt(this.v[0] * this.v[0] + this.v[1] * this.v[1]);
      if (nspeed > 0.1) {  // floating point problem, mathematically not needed!
        const skalarprod = this.v[0] * lastv[0] + this.v[1] * lastv[1];
        const alphadiff = Math.acos(
            skalarprod /
            (nspeed *
             this.speed));  // todo: this is a bad hack! or rewrite min inline
        const s = Math.floor(PI200 * alphadiff);
        this.steps = (1 > s) ? 1. : s;  // Math.max(1., 200*alphadiff/Math.PI)
        this.steps = (18 < this.steps) ? 18 : this.steps;  // Math.min(14,steps)
      } else {
        this.steps = 1;
      }
      this.speed = nspeed;

      this.x = this.pos[0] / posfac + posoffsetx;
      this.y = this.pos[1] / posfac + posoffsety;
    }
    c++;
    if (c % 2 == 0) {
      tracepos = (c / 2) % ntrace;
      trace[tracepos] = [this.pos[0], this.pos[1]];
    }
    circle(this.x, this.y, this.size, this.color);
    drawlines();
  };
  this.move = function(x, y) {
    // move planet to pixel
    this.pos = [(x - posoffsetx) * posfac, (y - posoffsety) * posfac];
    this.v = [0, 0];
    this.x = x;
    this.y = y;
  };

  function drawlines() {
    // draw traces
    const pp1 = (tracepos < ntrace - 1) ? tracepos + 1 : 0;
    context.strokeStyle = '#999999';
    context.beginPath();
    context.moveTo(
        trace[pp1][0] / posfac + posoffsetx,
        trace[pp1][1] / posfac + posoffsety);

    for (var i = pp1 + 1; i < ntrace; i++) {
      context.lineTo(
          trace[i][0] / posfac + posoffsetx, trace[i][1] / posfac + posoffsety);
    }
    for (i = 0; i < pp1; i++) {
      context.lineTo(
          trace[i][0] / posfac + posoffsetx, trace[i][1] / posfac + posoffsety);
    }
    context.stroke();
    context.closePath();
  }

  this.getinfo = function() {
    return this.name + ', ' + this.mass + 'em';
  }
}
