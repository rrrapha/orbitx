// CONSTANTS
const SCREEN_WIDTH = 500;
const SCREEN_HEIGHT = 500;
const FRAMERATE = 20;
const POSFAC = 2000;
const ZOOM = 1;
const SIZEFAC = 10;
const UNIT_M = 1000000;  // meter
const UNIT_S = 3600;     // sec
const G = ((6.67428 * Math.pow(10, -11) / Math.pow(UNIT_M, 3))) *
    Math.pow(UNIT_S, 2) * 5.974 * Math.pow(10, 24);

// VARS
var timer;
const POS_OFFSET_X = SCREEN_WIDTH / 2;
const POS_OFFSET_Y = SCREEN_HEIGHT / 2;
var numplanets = 0;
var planets = [];
const H = 1;  // integration stepsize (divided later)
var I;
var context;

document.addEventListener('DOMContentLoaded', init);
function init() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('id', 'canvas');
  canvas.setAttribute('width', SCREEN_WIDTH + 'px');
  canvas.setAttribute('height', SCREEN_HEIGHT + 'px');
  document.body.appendChild(canvas);
  context = canvas.getContext('2d');
  planets = [
    new Planet(100000000, [0, 0], [0, 0], 'sun'),
    new Planet(100000, [-300000, -200000], [0, 1000], 'venus'),
    new Planet(100000, [-100000, -100000], [0.1, 1000], 'mars'),
    new Planet(100000, [-100000, 0], [0.1, 1700], 'pluto'),
    new Planet(2000000, [-180000, -100000], [0, 1500], 'saturn')
  ];
  numplanets = planets.length;
  timer = setInterval(updateplanets, 1000 / FRAMERATE);
}

function deriv(t, cond) {
  var a0 = 0;
  var a1 = 0;
  const cond0 = cond[0];
  const cond1 = cond[1];
  var k;
  for (k = 0; k < numplanets; k++) {  // for each other planet
    if (I != k) {
      const p = planets[k];
      const pos = p.pos;
      const dist0 = pos[0] - cond0;
      const dist1 = pos[1] - cond1;
      const dist = dist0 * dist0 + dist1 * dist1;
      const dist_3 = Math.sqrt(dist * dist * dist);
      const F = p.mass / dist_3;
      a0 += F * dist0;
      a1 += F * dist1;
    }
  }
  return [cond[2], cond[3], G * a0, G * a1];
}

function updateplanets() {
  fps();
  if (H == 0) return;
  context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  const res = new Array(numplanets);
  for (I = 0; I < numplanets; ++I) {  // I is global
    const p = planets[I];
    const steps = p.steps;
    res[I] = Ode.ode(deriv, 0, H, [p.pos[0], p.pos[1], p.v[0], p.v[1]], steps);
  }
  for (I = 0; I < numplanets; ++I) {  // I is global
    var p = planets[I];
    p.doMove(res[I]);
  }
}

/////////////////////////////////////////////
const PI2 = Math.PI * 2;

function circle(x, y, r, color) {
  context.beginPath();
  context.arc(x, y, r, 0, PI2, true);
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

function randomcolor() {
  // return non-black html-color
  var colorstr = '#';
  for (var i = 0; i < 3; i++) {
    const ran = Math.round(Math.random() * 200) + 55;
    if (ran < 16) {
      colorstr += '0' + ran.toString(16);
    } else {
      colorstr += ran.toString(16);
    }
  }
  return colorstr;
}

var fps_time = new Date().getTime();
function fps() {
  // calculate current fps
  const t = new Date().getTime();
  const fps = Math.round(1000 / (t - fps_time));
  fps_time = t;
  // console.log(fps);
}
