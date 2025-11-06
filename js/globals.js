'use strict';

// CONSTANTS
export const SCREEN_WIDTH = 500;
export const SCREEN_HEIGHT = 500;
export const POSFAC = 2000;
export const ZOOM = 1;
export const SIZEFAC = 10;
export const POS_OFFSET_X = SCREEN_WIDTH / 2;
export const POS_OFFSET_Y = SCREEN_HEIGHT / 2;

// VARIABLES
let context;

export function getContext() {
  return context;
}

export function setContext(newContext) {
  context = newContext;
}
