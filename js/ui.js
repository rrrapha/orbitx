'use strict';

export {Ui};

class Ui {
  static dragcallback = null;
  static previousTouch = null;

  static registerZoom(elem, callback) {
    //mouse wheel
    elem.addEventListener('wheel', (event) => {
      callback(event.deltaY, event.offsetX, event.offsetY, event.shiftKey);
    }, {passive: true});
    //TODO implement two finger touch zoom here
  }

  static registerDrag(elem, callback) {
    Ui.dragcallback = callback;
    //mouse
    elem.addEventListener('mousedown', (event) => {
      window.addEventListener('mousemove', Ui.mouseMove);
      window.addEventListener('mouseup', (event) => {
        window.removeEventListener('mousemove', Ui.mouseMove);
      });
    });
    //touch
    elem.addEventListener('touchstart', (event) => {
      window.addEventListener('touchmove', Ui.touchMove);
      window.addEventListener('touchend', (event) => {
        window.removeEventListener('touchmove', Ui.touchMove);
        Ui.previousTouch = null;
      });
    });
  }

  static mouseMove(event) {
    Ui.dragcallback(event.movementX, event.movementY);
  }
  static touchMove(event) {
    if (event.touches.length > 1)
      return;
    const touch = event.touches[0];
    if (Ui.previousTouch) {
      Ui.dragcallback(touch.pageX - Ui.previousTouch.pageX, touch.pageY - Ui.previousTouch.pageY);
    };
    Ui.previousTouch = touch;
  }

}
