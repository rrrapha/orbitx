'use strict';

// CONSTANTS
export const POSFAC = 2000;
export const ZOOM = 1;

// VARIABLES
let context;
let screenWidth = 500;
let screenHeight = 500;
let sizeFac = 10;

export function getContext() {
  return context;
}

export function getScreenWidth() {
  return screenWidth;
}

export function getScreenHeight() {
  return screenHeight;
}

export function getSizeFac() {
  return sizeFac;
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

export function setSizeFac(newSizeFac) {
  sizeFac = newSizeFac;
}
