'use strict';

export {Globals};

class Globals {
    static context;
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

    static getContext() {
      return Globals.context;
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

    static setTraceLength(newTraceLength) {
      Globals.traceLength = newTraceLength;
    }

    static setCenterX(newCenterX) {
      Globals.centerX = newCenterX;
    }

    static setCenterY(newCenterY) {
      Globals.centerY = newCenterY;
    }

    static setCenterTrace(newCenterTrace) {
      Globals.centerTrace = newCenterTrace;
    }

    static setContext(newContext) {
      Globals.context = newContext;
    }

    static setScreenWidth(newScreenWidth) {
      Globals.screenWidth = newScreenWidth;
    }

    static setScreenHeight(newScreenHeight) {
      Globals.screenHeight = newScreenHeight;
    }

    static setSizeFac(newSizeFac) {
      Globals.sizeFac = newSizeFac;
    }

    static setPosFac(newPosFac) {
      Globals.posFac = newPosFac;
    }

}