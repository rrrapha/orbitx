'use strict';

export {Ui};

const evCache = [];
let prevDiff = -1;

class Ui {
  static dragCallback = null;
  static zoomCallback = null;
  static previousPosition = null;

  static register(elem, dragCallback, zoomCallback) {
    Ui.dragCallback = dragCallback;
    Ui.zoomCallback = zoomCallback;

    // mouse wheel
    elem.addEventListener('wheel', (event) => {
      zoomCallback(event.deltaY, event.offsetX, event.offsetY, event.shiftKey);
    }, {passive: true});

    // pointer
    elem.addEventListener('pointerdown', Ui.pointerDown);
  }

  static pointerDown(event) {
    evCache.push(event);
    window.addEventListener('pointermove', Ui.pointerMove);
    window.addEventListener('pointerup', Ui.pointerUp);
  }

  static pointerUp(event) {
    window.removeEventListener('pointermove', Ui.pointerMove);
    Ui.previousPosition = null;
    Ui.removeEvent(event);
    // If the number of pointers down is less than two then reset diff tracker
    if (evCache.length < 2) {
      prevDiff = -1;
    }
  }

  static pointerMove(event) {
    // Find this event in the cache and update its record with this event
    const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === event.pointerId,
    );
    evCache[index] = event;

    // If two pointers are down, check for pinch gestures
    if (evCache.length === 2) {
      // Calculate the distance between the two pointers
      const diffX = evCache[0].clientX - evCache[1].clientX;
      const diffY = evCache[0].clientY - evCache[1].clientY;
      const curDiff = Math.sqrt(diffX * diffX + diffY * diffY);
      if (prevDiff > 0) {
        const delta = (prevDiff - curDiff) * 10;
        const offsetX = (evCache[0].offsetX + evCache[1].offsetX) / 2;
        const offsetY = (evCache[0].offsetY + evCache[1].offsetY) / 2;
        Ui.zoomCallback(delta, offsetX, offsetY, false);
      }
      // Cache the distance for the next move event
      prevDiff = curDiff;
    } else if (evCache.length === 1) {
      if (Ui.previousPosition) {
        Ui.dragCallback(
            event.clientX - Ui.previousPosition[0],
            event.clientY - Ui.previousPosition[1]);
      }
      Ui.previousPosition = [event.clientX, event.clientY];
    }
  }

  static removeEvent(ev) {
    // Remove this event from the target's cache
    const index = evCache.findIndex(
        (cachedEv) => cachedEv.pointerId === ev.pointerId,
    );
    evCache.splice(index, 1);
  }
}
