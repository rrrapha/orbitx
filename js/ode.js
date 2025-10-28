/*
 *matlab style ode-functions M[row][col]
 */

Ode = {
  algorithm: null,
  // ode:function(func, low, high, initcond, steps){
  //	return Ode.ode_(func, low, high, initcond, steps);
  // },

  ode: function(func, low, high, initcond, steps) {
    const L = initcond.length;
    const h = (high - low) / steps;
    for (let j = 0; j < steps; ++j) {
      Ode.integ_rk4(func, low, h, initcond, L);
      low += h;
    }
    return initcond;
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  integ_euler: function(func, t, h, values, L) {
    const ms = func(t, values);
    for (let i = 0; i < L; i++) {
      values[i] += h * ms[i];
    }
  },
  //
  integ_rk2: function(func, t, h, values, L, dir) {
    let k1 = [];
    let v_ = [];
    let m = func(t, values);
    let hdir = h * dir;
    for (let i = 0; i < L; i++) {
      let k1i = hdir * m[i];
      k1[i] = k1i;
      v_[i] = values[i] + k1i;
    }
    t += hdir;
    m = func(t, v_);
    for (let i = 0; i < L; i++) {
      let k2i = hdir * m[i];
      values[i] += (k1[i] + k2i) / 2;
    }
  },
  integ_rk2_heun: function(func, t, h, values, L, dir) {
    let predict = [];
    let m1 = func(t, values);
    let hdir = h * dir;
    let hdir2 = hdir / 2;
    for (let i = 0; i < L; i++) {
      predict[i] = values[i] + h * m1[i];
    }
    t += hdir;
    let m2 = func(t, predict);
    for (let i = 0; i < L; i++) {
      values[i] += hdir2 * (m1[i] + m2[i]);
    }
  },
  integ_rk4: function(func, t, h, values, L) {
    const k1 = [];
    const k2 = [];
    const k3 = [];
    const k4 = [];
    const k1v = [];
    // var k2v=[];
    // var k3v=[];
    // var k4v=[];
    let m = func(t, values);
    const hdir = h;
    const hdir2 = hdir / 2;
    for (let i = 0; i < L; i++) {
      const k1i = hdir * m[i];
      k1[i] = k1i;
      k1v[i] = values[i] + k1i / 2;
    }
    t += hdir2;
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k2i = hdir * m[i];
      k2[i] = k2i;
      k1v[i] = values[i] + k2i / 2;
    }
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k3i = hdir * m[i];
      k3[i] = k3i;
      k1v[i] = values[i] + k3i;
    }
    t += hdir2;
    m = func(t, k1v);
    for (let i = 0; i < L; i++) {
      const k4i = hdir * m[i];
      k4[i] = k4i;
      // k1v[i]=values[i]+k4i;
    }
    for (let i = 0; i < L; i++) {
      values[i] += (k1[i] + 2 * (k2[i] + k3[i]) + k4[i]) / 6;
    }
  }
}
