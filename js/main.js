'use strict';

import {Planet} from './planet.js';
import {Ode} from './ode.js';
import {setContext, getContext, setScreenWidth, getScreenWidth, setScreenHeight, getScreenHeight} from './globals.js';

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
let fpsElement;

function loadPreset(preset) {
  fetch(preset).then((response) => response.json()).then((json) => {
    planets = json.map(
        ({mass, pos, vel, name, color}) =>
            new Planet(mass, pos, vel, name, color));
  });
}

function updateScreenSize() {
  setScreenWidth(window.innerWidth);
  setScreenHeight(window.innerHeight);
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', getScreenWidth());
  canvas.setAttribute('height', getScreenHeight());
}

window.addEventListener('resize', updateScreenSize);

document.addEventListener('DOMContentLoaded', init);
function init() {
  const canvas = document.getElementById('canvas');
  setContext(canvas.getContext('2d'));
  updateScreenSize();
  fpsElement = document.getElementById('fps');
  document.getElementById('presets').addEventListener('change', (event) => {
    loadPreset(event.target.value);
  });
  loadPreset('preset1.json');
  timer = setInterval(updatePlanets, 1000 / FRAMERATE);
}

function updatePlanets() {
  fps();
  if (H === 0) return;
  const context = getContext();
  context.clearRect(0, 0, getScreenWidth(), getScreenHeight());
  const res = new Array(planets.length);
  for (let i = 0; i < planets.length; ++i) {
    function deriv(t, cond) {
      let a0 = 0;
      let a1 = 0;
      const cond0 = cond[0];
      const cond1 = cond[1];
      for (let k = 0; k < planets.length; k++) {  // for each other planet
        if (i !== k) {
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

    const p = planets[i];
    const steps = p.steps;
    res[i] =
        Ode.ode(deriv, 0, H, [p.pos[0], p.pos[1], p.vel[0], p.vel[1]], steps);
  }
  for (let i = 0; i < planets.length; ++i) {
    planets[i].doMove(res[i]);
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
