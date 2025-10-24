/*
*matlab style ode-functions M[row][col]
*/

Ode={
	algorithm:null,
	//ode:function(func, low, high, initcond, steps){
	//	return Ode.ode_(func, low, high, initcond, steps);
	//},
	
	ode:function(func, low, high, initcond, steps){
		var L=initcond.length;
		var h=(high-low)/steps;
		var j;
		
		for (j = 0; j<steps; ++j) {
			Ode.integ_rk4(func, low, h, initcond, L);
			low += h;
		}
		return initcond;
	},
	
	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
	//
	integ_euler:function(func, t, h, values, L) {
		var ms=func(t,values);
		var i;
		for (i=0; i<L; i++) {
			values[i]+=h*ms[i];
		}
	},
	// 
	integ_rk2:function(func, t, h, values, L, dir) {
		var k1=[];
		var v_=[];
		var k1i;
		var k2i;
		var i;
	    var m=func(t,values);
		var hdir=h*dir;
		for (i=0; i<L; i++) {
			k1i=hdir*m[i];
			k1[i]=k1i;
			v_[i]=values[i]+k1i;
	    }
		t+=hdir;
		m=func(t,v_);
		for (i=0; i<L; i++) {
		   k2i=hdir*m[i];
		   values[i]+=(k1[i]+k2i)/2;
	    }
	},
	integ_rk2_heun:function(func, t, h, values, L, dir){
		var predict=[];
		var m1=func(t,values);
		var i;
		var hdir=h*dir;
		var hdir2=hdir/2;
		for (i=0; i<L; i++) {
			predict[i]=values[i]+h*m1[i];
		}
		t+=hdir;
		var m2=func(t,predict);
		for (i=0; i<L; i++) {
			values[i]+=hdir2*(m1[i]+m2[i]);
		}
	},
	integ_rk4:function(func, t, h, values, L) {
		var k1=[];
		var k2=[];
		var k3=[];
		var k4=[];
		var k1v=[];
		//var k2v=[];
		//var k3v=[];
		//var k4v=[];
		var i;
		var m=func(t,values);
		var hdir=h;
		var hdir2=hdir/2;
		for (i=0; i<L; i++) {
			var k1i=hdir*m[i];
			k1[i]=k1i;
			k1v[i]=values[i]+k1i/2;
		}
		t+=hdir2;
		m=func(t,k1v);
		for (i=0; i<L; i++) {
			var k2i=hdir*m[i];
			k2[i]=k2i;
			k1v[i]=values[i]+k2i/2;
		}
		m=func(t,k1v);
		for (i=0; i<L; i++) {
			var k3i=hdir*m[i];
			k3[i]=k3i;
			k1v[i]=values[i]+k3i;
		}
		t+=hdir2;
		m=func(t,k1v);
		for (i=0; i<L; i++) {
			var k4i=hdir*m[i];
			k4[i]=k4i;
			//k1v[i]=values[i]+k4i;
		}
		for (i=0; i<L; i++) {
		   values[i]+=(k1[i]+2*(k2[i]+k3[i])+k4[i])/6;
		}
	}
}