// array of all arrows
var arrows = [];

// adjusts arrow speed
var speedMod = 2;

var addArrow = function(player) {
  arrows.unshift(new Arrow(player));  // unshift adds to FRONT of arrows array
  currArrow = arrows[0];
}

// Arrow prototype
class Arrow {
  constructor(player) {
    this.x = player.x;
    this.y = player.y - player.hitbox.hauteur/4;
    this.angle = 0;
    this.player = player;
    


    this.velX = 0;
    this.velY = 0;
    this.speed = 0;
    this.firing = false;
  }
  fireArrow(player) {
    if (mousePos && !this.firing) {
      this.speed = Math.min(player.shootingCirc.r,
        distBetween(player.shootingCirc, mousePos)) / speedMod;
      this.velX = Math.cos(angleBetween(mousePos, player.shootingCirc)) * this.speed;
      this.velY = Math.sin(angleBetween(mousePos, player.shootingCirc)) * this.speed;
      this.firing = true;
    }
  }
  calcTrajectory() {
    // On ajoute le cas où le joueur adverse a été touché
    if (this.y <= groundPoint && !this.detectCollision() && this.firing) {
      this.velY += gravity;
      this.x += this.velX;
      this.y += this.velY;
      let collision = this.detectCollision();
      this.player.setCollision(collision);
    } else {
      this.velX = 0;
      this.velY = 0;
      this.firing = false;
    }
  }
  calcArrowHead() {
    if (this.firing) {
      this.angle = Math.atan2(this.velY, this.velX);
    }
  }

  setPicture(picture) {
    this.picture.src = picture;
  }

  drawArrow() {
    this.calcTrajectory();
    this.calcArrowHead();


    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.drawImage(this.player.getPicture(), 0, -5, 50, 10);
    ctx.restore();
  }

  // Permet de détecter si la flèche touche le joueur adverse
  detectCollision() {
    if (Math.abs(this.x - this.player.target.x) < this.player.target.hitbox.largeur/2
        && Math.abs(this.y - this.player.target.y) < this.player.target.hitbox.hauteur/2
        && this.firing) {
      // On renvoie true s'il y a collision (condition supplémentaire sur le fait que la flèche soit lancée,
      // on ne la prend plus en compte une fois qu'elle s'est plantée sur le joueur adverse)
      // TODO : appeler une méthode via l'objet this.player.target pour que ce dernier perde de la vie
      //console.log("Collision détectée");
      return true;
    }
    return false;
  }

}


