'use strict';

import {getContext} from './globals.js';

export {circle, randomColor};

const PI2 = Math.PI * 2;

function circle(x, y, r, color) {
  const context = getContext();
  context.beginPath();
  context.arc(x, y, r, 0, PI2, true);
  context.closePath();
  context.fillStyle = color;
  context.fill();
}

function randomColor() {
  // return non-black html-color
  let colorstr = '#';
  for (let i = 0; i < 3; i++) {
    const ran = Math.round(Math.random() * 200) + 55;
    colorstr += ran.toString(16);
  }
  return colorstr;
}
