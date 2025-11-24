'use strict';

import {Planet} from './planet.js';
import {Ode} from './ode.js';
import {setTraceLength, setCenterTrace, setCenterX, setCenterY, setContext, getContext, setScreenWidth, getScreenWidth, setScreenHeight, getScreenHeight, setSizeFac, setPosFac} from './globals.js';

// CONSTANTS
const UNIT_M = 1000000;  // meter
const UNIT_S = 3600;     // sec
const G = ((6.67428 * Math.pow(10, -11) / Math.pow(UNIT_M, 3))) *
    Math.pow(UNIT_S, 2) * 5.974 * Math.pow(10, 24);

// VARS
let timer;
let planets = [];
let simulationDelay;
let fpsElement;
let centerPlanet = null;
let accurateTraces = false;

function loadPreset(preset) {
  fetch(preset).then((response) => response.json()).then((json) => {
    planets = json.map(
        ({mass, pos, vel, name, color}) =>
            new Planet(mass, pos, vel, name, color));
    const center = document.getElementById('center');
    while (center.childElementCount > 1) {
      center.removeChild(center.lastElementChild);
    }
    for (let i = 0; i < planets.length; i++) {
      const planet = document.createElement('option');
      planet.value = i;
      planet.textContent = planets[i].name;
      center.appendChild(planet);
    }
    updateCenter();
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

function updateScale() {
  const scale = document.getElementById('scale-slider').value;
  document.getElementById('scale-num').textContent = scale;
  setSizeFac((101 - scale) / 5);
}

function updateZoom() {
  const zoom = document.getElementById('zoom-slider').value;
  document.getElementById('zoom-num').textContent = zoom;
  setPosFac(50 / zoom);
}

function updateTime() {
  const time = document.getElementById('time-slider').value;
  document.getElementById('time-num').textContent = time;
  simulationDelay = 11 - time;
}

function updateTrace() {
  const trace = document.getElementById('trace-slider').value;
  document.getElementById('trace-num').textContent = trace;
  setTraceLength(trace);
}

function updateCenter() {
  const value = document.getElementById('center').value;
  if (value === '') {
    centerPlanet = null;
  } else {
    centerPlanet = parseInt(value);
  }
}

function updateTraceStyle() {
  accurateTraces = document.getElementById('accurate-traces').checked;
}

document.addEventListener('DOMContentLoaded', init);
function init() {
  const canvas = document.getElementById('canvas');
  setContext(canvas.getContext('2d'));
  updateScreenSize();
  fpsElement = document.getElementById('fps');
  const presets = document.getElementById('presets');
  presets.addEventListener('change', (event) => {
    loadPreset(event.target.value);
  });
  document.getElementById('scale-slider')
      .addEventListener('input', updateScale);
  updateScale();
  document.getElementById('zoom-slider').addEventListener('input', updateZoom);
  updateZoom();
  document.getElementById('time-slider').addEventListener('input', updateTime);
  updateTime();
  document.getElementById('trace-slider')
      .addEventListener('input', updateTrace);
  updateTrace();
  document.getElementById('center').addEventListener('input', updateCenter);
  document.getElementById('accurate-traces')
      .addEventListener('input', updateTraceStyle);
  updateTraceStyle();
  loadPreset(presets.value);
  timer = requestAnimationFrame(update);
}

let prevTimestamp;
let accumulator = 0;
function update(timestamp) {
  fps();
  if (prevTimestamp === undefined) {
    prevTimestamp = timestamp;
  }
  accumulator += timestamp - prevTimestamp;
  prevTimestamp = timestamp;
  while (accumulator >= simulationDelay) {
    accumulator -= simulationDelay;
    updatePlanets();
  }
  if (centerPlanet === null) {
    setCenterX(0);
    setCenterY(0);
    setCenterTrace(null);
  } else {
    const planet = planets[centerPlanet];
    const pos = planet.pos;
    setCenterX(pos[0]);
    setCenterY(pos[1]);
    if (accurateTraces) {
      setCenterTrace(planet.trace);
    } else {
      setCenterTrace(null);
    }
  }
  for (let i = 0; i < planets.length; ++i) {
    planets[i].draw();
  }
  timer = requestAnimationFrame(update);
}

function updatePlanets() {
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
        Ode.ode(deriv, 0, 1, [p.pos[0], p.pos[1], p.vel[0], p.vel[1]], steps);
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
