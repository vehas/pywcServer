'use strict';
import io from './socket.io';
// import OCRAD from './ocrad';
// import gid from './gid'
// import responsiveVoice from './responsivevoice';

var socket = io('http://192.168.1.38:4000');
// console.log(socket);
socket.emit('line',  {x :[10], y: [2]});

var $=function(t,e,n,i,o,r,s,u,c,f,l,h){return h=function(t,e){return new h.i(t,e)},h.i=function(i,o){n.push.apply(this,i?i.nodeType||i==t?[i]:""+i===i?/</.test(i)?((u=e.createElement(o||"q")).innerHTML=i,u.children):(o&&h(o)[0]||e).querySelectorAll(i):/f/.test(typeof i)?/c/.test(e.readyState)?i():h(e).on("DOMContentLoaded",i):i:n)},h.i[l="prototype"]=(h.extend=function(t){for(f=arguments,u=1;u<f.length;u++)if(l=f[u])for(c in l)t[c]=l[c];return t})(h.fn=h[l]=n,{on:function(t,e){return t=t.split(i),this.map(function(n){(i[u=t[0]+(n.b$=n.b$||++o)]=i[u]||[]).push([e,t[1]]),n["add"+r](t[0],e)}),this},off:function(t,e){return t=t.split(i),l="remove"+r,this.map(function(n){if(f=i[t[0]+n.b$],u=f&&f.length)for(;c=f[--u];)e&&e!=c[0]||t[1]&&t[1]!=c[1]||(n[l](t[0],c[0]),f.splice(u,1));else!t[1]&&n[l](t[0],e)}),this},is:function(t){return u=this[0],(u.matches||u["webkit"+s]||u["moz"+s]||u["ms"+s]).call(u,t)}}),h}(window,document,[],/\.(.+)/,0,"EventListener","MatchesSelector");
var worker = new Worker('worker.js');
worker.onmessage = function(e){

  console.log('worker OCR : ',e.data);
  responsiveVoice.speak("hello "+ e.data);
}
export default function addCanvas(tags) {

  // console.log('add C ');
  $(tags)[0].innerHTML = '';
  $(tags)[0].innerHTML = `<canvas id='canvas' width=${window.innerWidth} height=${window.innerHeight-10}>
  abc
  </canvas>
  `;
  const can = $('#canvas')[0];
  console.log(can.height, can.width);
  var ctx = can.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, can.width, can.height);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 5;
  //  ctx.font = "95px serif";
  //  ctx.fillText("W", 10, 100);
  drawTouch(ctx);
  drawPointer(ctx);
  drawMouse(ctx,can);
  Ctrlplus(ctx,can);
  drawdrawTouchline(ctx);
  // console.log('455');
  socket.on('clear', (m) =>{
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, can.width, can.height);
    ctx.fillStyle = 'black';
  });
};
function drawdrawTouchline(ctx) {
    socket.on('drawTouchline',(line) => {
      console.log('drawTouchline : ',line);
    	ctx.beginPath();
      ctx.moveTo(line.x[0],line.y[0]);
      for(var i in line.x){
        if(i !== 0 )
        ctx.lineTo(line.x[i],line.y[i]);
      }
        ctx.stroke();
      console.log('drawed');
    });

}

// add cTrl plus
var Ctrlplus = function(ctx,can) {
  var fontsize = 20;
  document.onkeydown = (e) => {
    // console.log('key down ');
    if(e.keyCode === 68){
      ctx.fillStyle = 'white';
  		ctx.fillRect(0, 0, can.width, can.height);
  		ctx.fillStyle = 'black';
      console.log(responsiveVoice);
      // responsiveVoice.speak("hello MOshi");
      socket.emit('clear',  'all');
    }
    disabledEventPropagation(e);
    console.log(e.keyCode);
    if (e.ctrlKey) {
      // console.log(e.keyCode);
      if(e.keyCode === 187){ // '+' sign
        console.log("+");
        ctx.fillStyle = 'white';
    		ctx.fillRect(0, 0, can.width, can.height);
        //clear text
        // ctx.fillStyle = '#fff';
        // ctx.fillText(`วายดับเบิ้ลยูซี`, 10+fontsize, 50+fontsize);
        // draw new text
        ctx.fillStyle = '#000';
        fontsize += 20;
        ctx.font = `${fontsize}px serif`;
        ctx.fillText(`วายดับเบิ้ลยูซี`, 10+fontsize, 50+fontsize);
      }
    }
  }
}

function disabledEventPropagation(e){
  if(e){
    if(e.stopPropagation){
      e.stopPropagation();
    } else if(window.event){
      window.event.cancelBubble = true;
    }
  }
   e.preventDefault();
}
 // prototype to	start drawing on pointer(microsoft ie) using canvas moveTo and lineTo
var drawPointer = function(ctx) {
	var start = function(e) {
    e = e.originalEvent;
		ctx.beginPath();
	  var	x = e.pageX;
	  var 	y = e.pageY-44;
	  ctx.moveTo(x,y);
    console.log("pointer : ",x);
  };
	var move = function(e) {
		e.preventDefault();
    e = e.originalEvent;
		var x = e.pageX;
		var y = e.pageY-44;
		ctx.lineTo(x,y);
		ctx.stroke();
    };
    document.getElementById("canvas").addEventListener("MSPointerDown", start, false);
	 document.getElementById("canvas").addEventListener("MSPointerMove", move, false);
};

// prototype to	start drawing on mouse using canvas moveTo and lineTo
var drawMouse = function(ctx,can) {
	var clicked = 0;
  const offset = 60;
  var pointx  = [];
  var pointy = [];
	var start = function(e) {
    // console.log(e.pageX);
		clicked = 1;
		ctx.beginPath();
		var x = e.pageX;
    pointx.push(x);
  	var y = e.pageY;
    pointy.push(y);
    console.log("mouse w : ", x);
		ctx.moveTo(x,y);
    // console.log(x,y);
	};
	var move = function(e) {
		if(clicked){
			var x = e.pageX;
      pointx.push(x);
			var y = e.pageY;
      pointy.push(y);
			ctx.lineTo(x,y);
    // console.log(x,y);
			ctx.stroke();
		}
	};
	var stop = function(e) {
		clicked = 0;
    // console.log(pointx);
    // console.log(pointy);
    ///draw
    // ctx.moveTo(pointx[0],pointy[0]);
    // for(var i in pointx){
    //   if(i!==0){
    //     ctx.lineTo(pointx[i],pointy[i]);
    //   }
    //   ctx.stroke();
    // }
    //clear point
    socket.emit('line', {x: pointx, y:pointy});
    pointx =[];
    pointy = [];
    var img = ctx.getImageData(0, 0,400,200);
    worker.postMessage(img);
    // ctx.putImageData(img,400, 0);
  //  var img2 = ctx.getImageData(400, 0,200,200);
    // console.log(img);
    // var word = OCRAD(img);
    // console.log("word : ",typeof word, word);
    // ctx.fillStyle = 'white';
		// ctx.fillRect(0, 0, can.width, can.height);
		// ctx.fillStyle = 'black';
    // console.log("OCRAD.version() ",OCRAD.version());
	};
    document.getElementById("canvas").addEventListener("mousedown", start, false);
	document.getElementById("canvas").addEventListener("mousemove", move, false);
	document.addEventListener("mouseup", stop, false);
};

// prototype to	start drawing on touch using canvas moveTo and lineTo
var drawTouch = function(ctx) {
  console.log('add touch event');
  var pointx  = [];
  var pointy  = [];
	var start = function(e) {
		ctx.beginPath();
		var x = e.changedTouches[0].pageX | 0;
    pointx.push(x);
		var y = e.changedTouches[0].pageY | 0;
    pointy.push(y);
    console.log("touch : ",x);
		ctx.moveTo(x,y);
	};
	var move = function(e) {
		e.preventDefault();
		var x = e.changedTouches[0].pageX | 0;
    pointx.push(x);
		var y = e.changedTouches[0].pageY | 0;
    pointy.push(y);
		ctx.lineTo(x,y);
		ctx.stroke();

	};
  var stop = function (e) {
    socket.emit('line', {x: pointx, y:pointy});
    pointx =[];
    pointy = [];
    console.log('sended');
    var img = ctx.getImageData(0, 0,400,200);
    worker.postMessage(img);
  }
    document.getElementById("canvas").addEventListener("touchstart", start, false);
	document.getElementById("canvas").addEventListener("touchmove", move, false);
	document.getElementById("canvas").addEventListener("touchcancel", stop, false);
	document.getElementById("canvas").addEventListener("touchend", stop, false);
};
