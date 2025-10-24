//CONSTANTS
var SCREENW=500;
var SCREENH=500;
var FRAMERATE=20;
var posfac=2000;
var zoom=1;
var SIZEFAC=10;
var unit_m=1000000; //meter
var unit_s=3600;	//sec
var G=((6.67428*Math.pow(10,-11)/Math.pow(unit_m,3)))*Math.pow(unit_s,2)*5.974*Math.pow(10,24);

//VARS
var timer;
var posoffsetx=SCREENW/2;
var posoffsety=SCREENH/2;
var numplanets=0;
var planets=[];
var H=1; //integration stepsize (divided later)
var I;
var context;
var canvas;

window.onload=init;
function init(){
	canvas = new Element("canvas", {'id':'canvas','width':(SCREENW+'px'),'height':(SCREENH+'px')});
	canvas.insert(document.body);
	context = canvas.elem.getContext("2d");
	planets = [
		new Planet(100000000, [0,0], [0,0], 'sun'),
		new Planet(100000, [-300000,-200000], [0,1000], 'venus'),
		new Planet(100000, [-100000,-100000], [0.1,1000], 'mars'),
		new Planet(100000, [-100000,0], [0.1,1700], 'pluto'),
		new Planet(2000000, [-180000,-100000], [0,1500], 'saturn')
	];
	numplanets = planets.length;
	timer = setInterval(updateplanets, 1000 / FRAMERATE);
}

function deriv(t, cond){
	var a0=0;
	var a1=0;
	var cond0=cond[0];
	var cond1=cond[1];
	var k;
	for(k=0; k<numplanets; k++){ //for each other planet
		if(I!=k){
			var p=planets[k];
			var pos=p.pos;
			var dist0=pos[0]-cond0;
			var dist1=pos[1]-cond1;
			var dist=dist0*dist0+dist1*dist1;
			var dist_3=Math.sqrt(dist*dist*dist);
			var F=p.mass/dist_3;
			a0+=F*dist0;
			a1+=F*dist1;
		}
	}
	return [cond[2], cond[3], G*a0, G*a1];
}

function updateplanets(){
	fps();
	if(H==0)
		return;
	context.clearRect(0, 0, SCREENW, SCREENH);
	var res=new Array(numplanets);
	for(I=0; I<numplanets; ++I){ //I is global
		var p=planets[I];
		var steps=p.steps;
		res[I]=Ode.ode(deriv, 0, H, [p.pos[0],p.pos[1], p.v[0],p.v[1]], steps);
	}
	for(I=0; I<numplanets; ++I){ //I is global
		var p=planets[I];
		p.domove(res[I]);
	}
}

/////////////////////////////////////////////
var PI2=Math.PI*2;

function circle(x, y, r, color) {
	context.beginPath();
	context.arc(x, y, r, 0, PI2, true);
	context.closePath();
	context.fillStyle = color;
	context.fill();
}

function randomcolor(){
	//return non-black html-color
	var colorstr="#";
	for(var i=0; i<3; i++){
		var ran=Math.round(Math.random()*200)+55;
		if(ran<16) {
			colorstr+="0"+ran.toString(16);
		}
		else{
			colorstr+=ran.toString(16);
		}
	}
	return colorstr;
}

var fps_time=new Date().getTime();
function fps(){
	//calculate current fps
	var t=new Date().getTime();
	var fps=Math.round(1000 / (t - fps_time));
	fps_time=t;
	//console.log(fps);
}
