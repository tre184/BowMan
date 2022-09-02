 // Create the Canvas //
 var canvas = document.createElement("canvas");
 canvas.id = 'canvas';
 var ctx = canvas.getContext("2d");
 canvas.width = window.innerWidth - 15;
 canvas.height = window.innerHeight - 15;
 document.body.appendChild(canvas);
 cWidth = canvas.width;
 cHeight = canvas.height;

 // gravity and stuff //
 var gravity = 0.4;
 var groundPoint = cHeight - (cHeight/4);

 // drawnBack and firedArrow booleans to assert state of currArrow //
 var drawnBack = false;
 var firedArrow = false;
 
 // Calculate distance between two points
 var distBetween = function (p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2)
        + Math.pow((p2.y - p1.y), 2)
    );
}

 // checks if the mouse position is within < radius distance to the center
// of the shooting circle
 var isInCircle = function (mousePos) {
    var distFromCenter = distBetween(drawBackCirc, mousePos);
    if (distFromCenter < drawBackCirc.r) return true;
    else return false;
}

 function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
 
  // Event Listeners //

  var mousePos = {x: 0, y: 0};
  var mouseDown = false;
  var mouseUp = true;

  // Mouse move - whenever mouse moves on canvas
  addEventListener("mousemove", function (evt) {
      mousePos = getMousePos(canvas, evt);
}, false);
  // Mouse down //
  addEventListener("mousedown", function (evt) {
    mousePos = getMousePos(canvas, evt);
    if (mouseUp) {
      addArrow();
    }
    mouseDown = true;
    mouseUp = false;
}, false);
  // Mouse up //
  addEventListener("mouseup", function (evt) {
    mousePos = getMousePos(canvas, evt);
    if (mouseDown) {
      currArrow.fireArrow();
    }
      mouseUp = true;
      mouseDown = false;
}, false);
 
 var drawScene = function() {
     // inscreased groundPoint so arrows stick where they should in the ground
     var ground = groundPoint + 10;
     // sky
     ctx.fillStyle = "rgba(0,0,200,0.2)";
     ctx.fillRect(0,0,cWidth,ground);
     // ground
     ctx.beginPath();
     ctx.moveTo(0, ground);
     ctx.lineTo(cWidth, ground);
     ctx.strokeStyle = "rgba(0,100,50,0.6)";
     ctx.stroke();
     ctx.fillStyle = "rgba(0,200,100,0.6)";
     ctx.fillRect(0, ground, cWidth, cHeight);
 }
 
 // calculate angle between two points
var angleBetween = function (p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
} 

// SHOOTING CIRCLE //
var getAimCoors = function (mousePos) {
    var angle = (Math.PI/2) - Math.atan2(shootingCirc.y-mousePos.y,
        shootingCirc.x-mousePos.x);
    var distance = Math.min(distBetween(shootingCirc, mousePos), shootingCirc.r);
    var x = shootingCirc.x + distance*Math.sin(angle);
    var y = shootingCirc.y + distance*Math.cos(angle);
    return {x:x, y:y};
}

/*var drawAimer1 = function() {
    if (drawnBack) {
      aimCoords = getAimCoords(mousePos);
      ctx.beginPath();
      ctx.moveTo(aimCoords.x, aimCoords.y);
      ctx.lineTo(shootingCirc.x, shootingCirc.y);
      ctx.strokeStyle="rgba(255,0,0,0.2)";
      ctx.stroke();
    }
}*/
var drawAimer = function () { 
     var z = (Math.PI/2) - Math.atan2(shootingCirc.y-mousePos.y,
      shootingCirc.x-mousePos.x);
     var aimer = new Image();
     aimer.src = 'resources/playerArcher.png';
     ctx.save();
     ctx.translate(shootingCirc.x - 10, shootingCirc.y + 60);
   ctx.rotate(-z);
   ctx.drawImage(aimer, -50, 0, 100, 100);//shootingCirc.x - 50, shootingCirc.y + 10, (groundPoint - shootingCirc.y)/3, groundPoint - shootingCirc.y);
   ctx.restore();
   console.log(aimer.height + ", " + aimer.width);
    }
    

 var shootingCirc = {
    x: 200,
    y: groundPoint-200,
    r: 75
  }
  var drawBackCirc = {
    x: shootingCirc.x,
    y: shootingCirc.y,
    r: 10
}
  // Draw the actual circles around the arrow //
  /*var drawCircles = function() {
    ctx.beginPath();
    ctx.arc(shootingCirc.x, shootingCirc.y, shootingCirc.r, 0, 2*Math.PI);
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(drawBackCirc.x, drawBackCirc.y, drawBackCirc.r, 0, 2*Math.PI);
    ctx.stroke();
    drawAimer();
}*/
  var drawCircles = function() { 
    var dimension = groundPoint - shootingCirc.y;
    var archer = new Image();
    archer.src = 'resources/player.png';
    ctx.drawImage(archer, shootingCirc.x - 50, shootingCirc.y + 10, dimension/3, dimension);
    drawAimer();
    /*drawAimer1();*/
  }

  var isFiredArrow = function() {
    if (mousePos && drawnBack && mouseUp) {
      drawnBack = false;
      firedArrow = true;
    }
  }
  
  var isDrawnBack = function() {
    if (mousePos && isInCircle(mousePos)) {
      if (mouseDown) drawnBack = true;
      else if (mouseUp) drawnBack = false;
    }
  }
  
  var writeInfo = function(mousePos) {
    ctx.font = "11px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    if(isInCircle(mousePos) && mouseDown) {
      ctx.fillStyle = "red";
    } else {
      ctx.fillStyle = "black";
    }
    ctx.fillText("Mouse Position: " + mousePos.x + ", " + mousePos.y, 20, 20);
    ctx.fillText("Circle Position: " + shootingCirc.x + ", " + shootingCirc.y, 20, 40);
    ctx.fillText("Angle: " + angleBetween(mousePos, shootingCirc), 20, 60);
  }
  
  
  
  // UPDATE //
  var update = function() {
    isDrawnBack();
    isFiredArrow();
    if (firedArrow) {
      currArrow.fireArrow();
      firedArrow = false;
    }
    // clear the canvas
    ctx.clearRect(0,0,cWidth,cHeight);
  }
  
  // RENDER //
  var render = function() {
    // if(mousePos) writeInfo(mousePos);
    update();
    drawScene();
    drawCircles();
    for(i=0; i<arrows.length; i++) {
      arrows[i].drawArrow();
    }
    window.requestAnimationFrame(render);
  }
  