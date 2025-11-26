'use strict';

import {getContext} from './globals.js';

export {circle};

const PI2 = Math.PI * 2;

function circle(x, y, r, fillColor, strokeColor) {
  const context = getContext();
  context.beginPath();
  context.arc(x, y, r, 0, PI2, true);
  context.closePath();
  context.fillStyle = fillColor;
  context.fill();
  context.strokeStyle = strokeColor;
  context.stroke();
}
