'use strict';

export {Ode};

class Ode {
  static algorithm = Ode.integ_rk4;

  static ode(func, low, high, initcond, steps) {
    const L = initcond.length;
    const h = (high - low) / steps;
    for (let j = 0; j < steps; ++j) {
      Ode.algorithm(func, low, h, initcond, L);
      low += h;
    }
    return initcond;
  }

  static integ_euler(func, t, h, values, L) {
    const ms = func(t, values);
    for (let i = 0; i < L; i++) {
      values[i] += h * ms[i];
    }
  }

  static integ_rk2(func, t, h, values, L) {
    const k1 = [];
    const v_ = [];
    let m = func(t, values);
    for (let i = 0; i < L; i++) {
      const k1i = h * m[i];
      k1[i] = k1i;
      v_[i] = values[i] + k1i;
    }
    t += h;
    m = func(t, v_);
    for (let i = 0; i < L; i++) {
      const k2i = h * m[i];
      values[i] += (k1[i] + k2i) / 2;
    }
  }

  static integ_rk2_heun(func, t, h, values, L) {
    const predict = [];
    const m1 = func(t, values);
    const hdir2 = h / 2;
    for (let i = 0; i < L; i++) {
      predict[i] = values[i] + h * m1[i];
    }
    t += h;
    const m2 = func(t, predict);
    for (let i = 0; i < L; i++) {
      values[i] += hdir2 * (m1[i] + m2[i]);
    }
  }

  static integ_rk4(func, t, h, values, L) {
    const k1 = [];
    const k2 = [];
    const k3 = [];
    const k4 = [];
    const k1v = [];
    let m = func(t, values);
    const h2 = h / 2;
    for (let i = 0; i < L; i++) {
      const k1i = h * m[i];
      k1[i] = k1i;
      k1v[i] = values[i] + k1i / 2;
    }
    t += h2;
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k2i = h * m[i];
      k2[i] = k2i;
      k1v[i] = values[i] + k2i / 2;
    }
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k3i = h * m[i];
      k3[i] = k3i;
      k1v[i] = values[i] + k3i;
    }
    t += h2;
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k4i = h * m[i];
      k4[i] = k4i;
      // k1v[i]=values[i]+k4i;
    }
    for (let i = 0; i < L; i++) {
      values[i] += (k1[i] + 2 * (k2[i] + k3[i]) + k4[i]) / 6;
    }
  }
}
