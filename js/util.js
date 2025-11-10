'use strict';

import {getContext} from './globals.js';

export {circle};

const PI2 = Math.PI * 2;

function circle(x, y, r, color) {
  const context = getContext();
  context.beginPath();
  context.arc(x, y, r, 0, PI2, true);
  context.closePath();
  context.fillStyle = color;
  context.fill();
}
