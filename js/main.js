'use strict';

import {Planet} from './planet.js';
import {Ui} from './ui.js';
import {Ode} from './ode.js';
import {Globals} from './globals.js';

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
let showLabels = false;
let showAxes = false;

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
    updateCenterHandler();
  });
}

function resizeHandler() {
  Globals.setScreenWidth(window.innerWidth);
  Globals.setScreenHeight(window.innerHeight);
  const canvas = document.getElementById('canvas');
  canvas.setAttribute('width', Globals.getScreenWidth());
  canvas.setAttribute('height', Globals.getScreenHeight());
}

window.addEventListener('resize', resizeHandler);

function updateScaleHandler() {
  const scale = document.getElementById('scale-slider').value;
  document.getElementById('scale-num').textContent = scale;
  Globals.setSizeFac(500 / scale);
}

function updateZoomHandler(event) {
  zoomValue = Number(event.target.value);
  updateZoom();
}

function updateZoom() {
  const zoom = document.getElementById('zoom-slider').value;
  document.getElementById('zoom-num').textContent = zoom;
  Globals.setPosFac(50 / Math.pow(1.1, zoomValue));
}

function updateTimeHandler() {
  const time = document.getElementById('time-slider').value;
  document.getElementById('time-num').textContent = time;
  simulationDelay = 10 / time;
}

function updateTraceHandler() {
  const trace = document.getElementById('trace-slider').value;
  document.getElementById('trace-num').textContent = trace;
  Globals.setTraceLength(parseInt(trace));
}

function updateCenterHandler() {
  const value = document.getElementById('center').value;
  if (value === '') {
    centerPlanet = null;
    Globals.setCenterX(0);
    Globals.setCenterY(0);
  } else {
    centerPlanet = Number(value);
  }
}

function updateTraceStyleHandler() {
  accurateTraces = document.getElementById('accurate-traces').checked;
}

function updateLabelsEnableHandler() {
  showLabels = document.getElementById('labels-checkbox').checked;
}

function updateAxesEnableHandler() {
  showAxes = document.getElementById('axes-checkbox').checked;
}

document.addEventListener('DOMContentLoaded', init);
function init() {
  const canvas = document.getElementById('canvas');
  Globals.setContext(canvas.getContext('2d'));
  resizeHandler();
  fpsElement = document.getElementById('fps');
  const presets = document.getElementById('presets');
  presets.addEventListener('change', (event) => {
    loadPreset(event.target.value);
  });
  document.getElementById('scale-slider')
      .addEventListener('input', updateScaleHandler);
  updateScaleHandler();
  document.getElementById('zoom-slider')
      .addEventListener('input', updateZoomHandler);
  updateZoom();
  document.getElementById('time-slider')
      .addEventListener('input', updateTimeHandler);
  updateTimeHandler();
  document.getElementById('trace-slider')
      .addEventListener('input', updateTraceHandler);
  updateTraceHandler();
  document.getElementById('center').addEventListener(
      'input', updateCenterHandler);
  document.getElementById('accurate-traces')
      .addEventListener('input', updateTraceStyleHandler);
  updateTraceStyleHandler();
  document.getElementById('labels-checkbox')
      .addEventListener('input', updateLabelsEnableHandler);
  updateLabelsEnableHandler();
  document.getElementById('axes-checkbox')
      .addEventListener('input', updateAxesEnableHandler);
  updateAxesEnableHandler();

  Ui.register(canvas, dragCallback, zoomCallback);

  loadPreset(presets.value);
  timer = requestAnimationFrame(update);
}

let zoomValue = 50;

function zoomCallback(delta, offsetX, offsetY, shift) {
  if (shift) {
    const slider = document.getElementById('scale-slider');
    const value = Number(slider.value) * Math.sqrt(1 + delta * -0.002);
    slider.value = value;
    updateScaleHandler();
    return;
  }
  const oldX = (offsetX - Globals.getScreenWidth() / 2) * Globals.getPosFac() +
      Globals.getCenterX();
  const oldY = (offsetY - Globals.getScreenHeight() / 2) * Globals.getPosFac() +
      Globals.getCenterY();
  const slider = document.getElementById('zoom-slider');
  zoomValue -= delta * 0.01;
  if (zoomValue < slider.min) {
    zoomValue = Number(slider.min);
  }
  if (zoomValue > slider.max) {
    zoomValue = Number(slider.max);
  }
  slider.value = zoomValue;
  updateZoom();
  const newX = (offsetX - Globals.getScreenWidth() / 2) * Globals.getPosFac() +
      Globals.getCenterX();
  const newY = (offsetY - Globals.getScreenHeight() / 2) * Globals.getPosFac() +
      Globals.getCenterY();
  Globals.setCenterX(Globals.getCenterX() + oldX - newX);
  Globals.setCenterY(Globals.getCenterY() + oldY - newY);
}

function dragCallback(movementX, movementY) {
  Globals.setCenterX(Globals.getCenterX() - movementX * Globals.getPosFac());
  Globals.setCenterY(Globals.getCenterY() - movementY * Globals.getPosFac());
}

let prevTimestamp;
let accumulator = 0;
function update(timestamp) {
  fps();
  const context = Globals.getContext();
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
    Globals.setCenterTrace(null);
  } else {
    const planet = planets[centerPlanet];
    const pos = planet.pos;
    Globals.setCenterX(pos[0]);
    Globals.setCenterY(pos[1]);
    if (accurateTraces) {
      Globals.setCenterTrace(planet.trace);
    } else {
      Globals.setCenterTrace(null);
    }
  }
  context.clearRect(0, 0, Globals.getScreenWidth(), Globals.getScreenHeight());
  if (showAxes) {
    const originX = Math.round(
        Globals.getScreenWidth() / 2 -
        Globals.getCenterX() / Globals.getPosFac());
    const originY = Math.round(
        Globals.getScreenHeight() / 2 -
        Globals.getCenterY() / Globals.getPosFac());
    context.strokeStyle = '#666666';
    context.beginPath();
    context.moveTo(0, originY);
    context.lineTo(Globals.getScreenWidth(), originY);
    context.moveTo(originX, 0);
    context.lineTo(originX, Globals.getScreenHeight());
    context.stroke();
  }
  for (let i = 0; i < planets.length; ++i) {
    planets[i].draw();
  }
  if (showLabels) {
    for (let i = 0; i < planets.length; ++i) {
      planets[i].drawLabel();
    }
  }
  timer = requestAnimationFrame(update);
}

function updatePlanets() {
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
