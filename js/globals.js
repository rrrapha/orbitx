'use strict';

export {Globals};

class Globals {
  static screenWidth = 500;
  static screenHeight = 500;
  static sizeFac = 10;
  static posFac = 1;
  static centerX = 0;
  static centerY = 0;
  static centerTrace = null;
  static traceLength = 64;

  static getTraceLength() {
    return Globals.traceLength;
  }

  static getCenterX() {
    return Globals.centerX;
  }

  static getCenterY() {
    return Globals.centerY;
  }

  static getCenterTrace() {
    return Globals.centerTrace;
  }

  static getScreenWidth() {
    return Globals.screenWidth;
  }

  static getScreenHeight() {
    return Globals.screenHeight;
  }

  static getSizeFac() {
    return Globals.sizeFac * Globals.posFac;
  }

  static getPosFac() {
    return Globals.posFac * 2000;
  }

  static setTraceLength(traceLength) {
    Globals.traceLength = traceLength;
  }

  static setCenterX(centerX) {
    Globals.centerX = centerX;
  }

  static setCenterY(centerY) {
    Globals.centerY = centerY;
  }

  static setCenterTrace(centerTrace) {
    Globals.centerTrace = centerTrace;
  }

  static setScreenWidth(screenWidth) {
    Globals.screenWidth = screenWidth;
  }

  static setScreenHeight(screenHeight) {
    Globals.screenHeight = screenHeight;
  }

  static setSizeFac(sizeFac) {
    Globals.sizeFac = sizeFac;
  }

  static setPosFac(posFac) {
    Globals.posFac = posFac;
  }
}