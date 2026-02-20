'use strict';

export {Settings};

class Settings {
  static screenWidth = 500;
  static screenHeight = 500;
  static sizeFac = 10;
  static posFac = 1;
  static centerX = 0;
  static centerY = 0;
  static centerTrace = null;
  static traceLength = 64;

  static getTraceLength() {
    return Settings.traceLength;
  }

  static getCenterX() {
    return Settings.centerX;
  }

  static getCenterY() {
    return Settings.centerY;
  }

  static getCenterTrace() {
    return Settings.centerTrace;
  }

  static getScreenWidth() {
    return Settings.screenWidth;
  }

  static getScreenHeight() {
    return Settings.screenHeight;
  }

  static getSizeFac() {
    return Settings.sizeFac * Settings.posFac;
  }

  static getPosFac() {
    return Settings.posFac * 2000;
  }

  static setTraceLength(traceLength) {
    Settings.traceLength = traceLength;
  }

  static setCenterX(centerX) {
    Settings.centerX = centerX;
  }

  static setCenterY(centerY) {
    Settings.centerY = centerY;
  }

  static setCenterTrace(centerTrace) {
    Settings.centerTrace = centerTrace;
  }

  static setScreenWidth(screenWidth) {
    Settings.screenWidth = screenWidth;
  }

  static setScreenHeight(screenHeight) {
    Settings.screenHeight = screenHeight;
  }

  static setSizeFac(sizeFac) {
    Settings.sizeFac = sizeFac;
  }

  static setPosFac(posFac) {
    Settings.posFac = posFac;
  }
}