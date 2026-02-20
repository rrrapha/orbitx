'use strict';

export {circle};

const PI2 = Math.PI * 2;

function circle(context, x, y, r, fillColor, strokeColor) {
  context.beginPath();
  context.arc(x, y, r, 0, PI2, true);
  context.closePath();
  context.fillStyle = fillColor;
  context.fill();
  context.strokeStyle = strokeColor;
  context.stroke();
}
