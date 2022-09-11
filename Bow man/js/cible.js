class Cible {
    constructor(posx, posy) {
        this.x = posx;
        this.y = posy;
        this.cible = new Image();
        this.cible.src = "resources/board.png";
        // On définit la hitbox :
        this.hitbox = {
            hauteur: 200,
            largeur: 75
        }
        this.collision = false;
          
    }

    // On définit un joueur à viser : le joueur adverse
    setTarget(target) {
        this.target = target;
    }

    drawCible() {
        //ctx.fillRect(this.x - this.hitbox.largeur/2, this.y - this.hitbox.hauteur/2, this.hitbox.largeur, this.hitbox.hauteur);
        ctx.drawImage(this.cible, this.x - this.hitbox.largeur / 2, this.y - this.hitbox.hauteur / 2, this.hitbox.largeur, this.hitbox.hauteur);
    }
}