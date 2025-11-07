'use strict';

import {Planet} from './planet.js';
import {Ode} from './ode.js';
import {SCREEN_WIDTH, SCREEN_HEIGHT, setContext, getContext} from './globals.js';

// CONSTANTS
const FRAMERATE = 20;
const UNIT_M = 1000000;  // meter
const UNIT_S = 3600;     // sec
const G = ((6.67428 * Math.pow(10, -11) / Math.pow(UNIT_M, 3))) *
    Math.pow(UNIT_S, 2) * 5.974 * Math.pow(10, 24);

// VARS
let timer;
let planets = [];
const H = 1;  // integration stepsize (divided later)
let I;
let fpsElement;

document.addEventListener('DOMContentLoaded', init);
function init() {
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', SCREEN_WIDTH + 'px');
  canvas.setAttribute('height', SCREEN_HEIGHT + 'px');
  setContext(canvas.getContext('2d'));
  fpsElement = document.getElementById('fps');
  document.getElementById('presets').addEventListener('change', (event) => {
    fetch(event.target.value)
        .then((response) => response.json())
        .then((json) => {
          planets = json.map(
              ({mass, pos, vel, name}) => new Planet(mass, pos, vel, name));
        });
  });
  planets = [
    new Planet(100000000, [0, 0], [0, 0], 'sun'),
    new Planet(100000, [-300000, -200000], [0, 1000], 'venus'),
    new Planet(100000, [-100000, -100000], [0.1, 1000], 'mars'),
    new Planet(100000, [-100000, 0], [0.1, 1700], 'pluto'),
    new Planet(2000000, [-180000, -100000], [0, 1500], 'saturn')
  ];
  timer = setInterval(updatePlanets, 1000 / FRAMERATE);
}

function deriv(t, cond) {
  let a0 = 0;
  let a1 = 0;
  const cond0 = cond[0];
  const cond1 = cond[1];
  for (let k = 0; k < planets.length; k++) {  // for each other planet
    if (I !== k) {
      const p = planets[k];
      const pos = p.pos;
      const dist0 = pos[0] - cond0;
      const dist1 = pos[1] - cond1;
      const dist = dist0 * dist0 + dist1 * dist1;
      const dist3 = Math.sqrt(dist * dist * dist);
      const F = p.mass / dist3;
      a0 += F * dist0;
      a1 += F * dist1;
    }
  }
  return [cond[2], cond[3], G * a0, G * a1];
}

function updatePlanets() {
  fps();
  if (H === 0) return;
  const context = getContext();
  context.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  const res = new Array(planets.length);
  for (I = 0; I < planets.length; ++I) {  // I is global
    const p = planets[I];
    const steps = p.steps;
    res[I] =
        Ode.ode(deriv, 0, H, [p.pos[0], p.pos[1], p.vel[0], p.vel[1]], steps);
  }
  for (I = 0; I < planets.length; ++I) {  // I is global
    planets[I].doMove(res[I]);
  }
}

let fpsTime = new Date().getTime();
function fps() {
  // calculate current fps
  const t = new Date().getTime();
  const fps = Math.round(1000 / (t - fpsTime));
  fpsTime = t;
  fpsElement.textContent = fps;
  // console.log(fps);
}
