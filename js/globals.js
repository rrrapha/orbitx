'use strict';

// CONSTANTS
export const POSFAC = 2000;
export const ZOOM = 1;
export const SIZEFAC = 10;

// VARIABLES
let context;
let screenWidth = 500;
let screenHeight = 500;

export function getContext() {
  return context;
}

export function getScreenWidth() {
  return screenWidth;
}

export function getScreenHeight() {
  return screenHeight;
}

export function setContext(newContext) {
  context = newContext;
}

export function setScreenWidth(newScreenWidth) {
  screenWidth = newScreenWidth;
}

export function setScreenHeight(newScreenHeight) {
  screenHeight = newScreenHeight;
}
