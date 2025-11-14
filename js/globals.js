'use strict';

let context;
let screenWidth = 500;
let screenHeight = 500;
let sizeFac = 10;
let posFac = 1;

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
  return sizeFac * posFac;
}

export function getPosFac() {
  return posFac * 2000;
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

export function setPosFac(newPosFac) {
  posFac = newPosFac;
}
