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

 var paddingX = 0;
 var paddingY = 0;
 
 // Calculate distance between two points
 var distBetween = function (p1, p2) {
    return Math.sqrt(Math.pow((p2.x - p1.x), 2)
        + Math.pow((p2.y - p1.y), 2)
    );
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
      if (mouseDown) {
        currArrow.angle = angleBetween(mousePos, player1.shootingCirc);
        var power = Math.min(player1.shootingCirc.r,
          distBetween(player1.shootingCirc, mousePos)) / 3;
        currArrow.x = (player1.x) + (60 - power) * Math.cos(currArrow.angle);
        currArrow.y = (player1.y - player1.hitbox.hauteur/4) + (60 - power) * Math.sin(currArrow.angle);
      }
}, false);
  // Mouse down //
  addEventListener("mousedown", function (evt) {
    mousePos = getMousePos(canvas, evt); 
    if (mouseUp) {
      addArrow(player1);
      player1.shootingCirc.x = mousePos.x;
      player1.shootingCirc.y = mousePos.y;
      // Le joueur en cours commence à jouer
      player1.isPlaying = true;
    }
    mouseDown = true;
    mouseUp = false;
}, false);
  // Mouse up //
  addEventListener("mouseup", function (evt) {
    mousePos = getMousePos(canvas, evt); 
    if (mouseDown) {
      currArrow.fireArrow(player1);
    }
      mouseUp = true;
      mouseDown = false;
}, false);

var drawSky = function() {
    // sky
    ctx.fillStyle = "rgba(0,0,200,0.2)";
    ctx.fillRect(0,0,cWidth,cHeight);
}
 
 var drawScene = function() {
     var ground = groundPoint + 10;
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

var player1 = new Player('Tresor', 200, groundPoint - 90, 'resources/player.png', 'resources/playerArcher.png', 'resources/arrow.png');
var cible = new Cible(500, groundPoint - 90);

// On définit les oppositions :
player1.setTarget(cible);

  var isFiredArrow = function() {
    if (mousePos && drawnBack && mouseUp) {
      drawnBack = false;
      firedArrow = true;
    }
  }
  
  var isDrawnBack = function() {
    if (mousePos && player1.isInCircle(mousePos)) {
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
    ctx.save();
    drawSky();
    // Problème de défilement lié au viseur contourné en ne dessinant qu'au moment de tirer à l'arc
    if (mouseDown) {
        player1.drawCircles();
    }
    // Défilement vertical pour commencer
    ctx.translate(0, -paddingY);
    drawScene();
    // Défilement horizontal par la suite
    ctx.translate(-paddingX, 0);
    // On dessine le joueur :

      player1.drawPlayer();
      cible.drawCible();
    
    for(i=0; i<arrows.length; i++) {
      arrows[i].drawArrow();
      //arrows[i].drawArrow1();
    }
    if (arrows.length > 0) {
      paddingX += currArrow.velX;
      paddingY += currArrow.velY;
      if (!currArrow.firing && Math.abs(paddingX) > 0) {
        paddingX += ((player1.x - cWidth/2) - paddingX) / 20;
        // paddingY += ((playerList[playerTurn].y - 500) - paddingY) / 20;
        paddingY += ((player1.y - groundPoint + 90) - paddingY) / 20;
      }
    }

    ctx.restore();
    window.requestAnimationFrame(render);
  }
  