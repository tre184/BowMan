class Player {
    constructor(nom, posx, posy, joueur, aimer, picture) {
        this.nom = nom;
        this.x = posx;
        this.y = posy;
        this.health = 100;
        this.isPlaying = false;
        this.aimer = new Image();
        this.aimer.src = aimer;
        this.archer = new Image();
        this.archer.src = joueur;
        this.picture = new Image();
        this.picture.src = picture;
        this.shootingCirc = {
            x: 200,
            y: groundPoint-200,
            r: 75
        }
        this.drawBackCirc = {
            x: this.shootingCirc.x,
            y: this.shootingCirc.y,
            r: 10
        }
        // On définit la hitbox :
        this.hitbox = {
            hauteur: 200,
            largeur: 75
        }
        this.collision = false;
          
    }
    setCollision(bool) {
        this.collision = bool;
    }
    playerIsHit(ctx) {
        //console.log(this.collision);
        if (this.collision) {
            this.health -= 20;
            this.setCollision(false);
            
            this.endgame(ctx);
        }

    }

    // On définit un joueur à viser : le joueur adverse
    setTarget(target) {
        this.target = target;
    }

    getPicture() {
        return this.picture;
    }

    drawAimer() {
        ctx.save();
        ctx.translate(this.x, this.y - this.hitbox.hauteur/4);
        if (this.isPlaying) {
            var z = (Math.PI / 2) - Math.atan2(this.shootingCirc.y - mousePos.y,
                this.shootingCirc.x - mousePos.x);
            ctx.rotate(-z);
        }
        ctx.drawImage(this.aimer, -50, 0, 100, 100);
        ctx.restore();
    }
    drawPlayer() {
        //ctx.fillRect(this.x - this.hitbox.largeur/2, this.y - this.hitbox.hauteur/2, this.hitbox.largeur, this.hitbox.hauteur);
        ctx.drawImage(this.archer, this.x - this.hitbox.largeur / 2, this.y - this.hitbox.hauteur / 2, this.hitbox.largeur, this.hitbox.hauteur);
        //gestion niveau vie
        this.playerIsHit(ctx);
        // On dessine l'arc
        this.drawAimer();
    }
    drawCircles () { 

        // Draw circles :
        ctx.beginPath();
        ctx.arc(this.shootingCirc.x, this.shootingCirc.y, this.shootingCirc.r, 0, 2 * Math.PI);
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(this.shootingCirc.x, this.shootingCirc.y, this.drawBackCirc.r, 0, 2 * Math.PI);
        ctx.stroke();
    }
    // checks if the mouse position is within < radius distance to the center
    // of the shooting circle
    isInCircle (mousePos) {
        var distFromCenter = distBetween(this.drawBackCirc, mousePos);
        if (distFromCenter < this.drawBackCirc.r) return true;
        else return false;
    }
    //Return un boolean true si le niveau de vie est nulle
    isPlayerDead() {
        if (this.health <= 0) {
            return true;
        }
        return false;

    }
    // Afficher le point d'impact
    endgame() {
        let isDead = this.isPlayerDead();
        if (isDead) {
            console.log(isDead, 'isDead');
            ctx.font = "30px Comic Sans MS";
            ctx.fillStyle = "Red";
            ctx.textAlign = "center";
            ctx.fillText("Tu as perdu  " + this.nom, this.cWidth / 2, this.cHeight /
                2);

        }
    }
    
}