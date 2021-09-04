import { SpriteSheetSheet, image_index } from "../../sprite.js";

function Fixed(x, y){ this.x = x; this.y = y; }

class Plant extends Fixed{
    constructor(x,y,n,t){
        super(x,y);
        this.name = n;
        this.type = t;
    }
}

class Peashoter extends Plant{
    constructor({
        x = 0, y = 0
    }) {
        super(x,y, 'peashoter','r');

        this.current = null;
        this.sprites.ready.then(arr=>{
            this.current = arr[0];
            this.image_index = Math.floor(Math.random()*this.current.image.n);
        });

        this.count++;
    }
}

Object.assign(Peashoter.prototype, {
    sprites : new SpriteSheetSheet({
        base : ('sebaszwolf.github.io' === window.location.hostname ? '/pvzeng' : '') + '/objects/assets/sprites/coin_gold.png',
        sheets : [
            { name : 'iddle',   image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
            { name : 'run',     image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
            { name : 'walk',    image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } }
        ]
    }),
    step : function( scn ){
        this.image_index += .2;
    },
    draw : function( ctx, { cell } ){
        this.current?.draw( ctx , Math.floor(this.image_index), this.x * cell.x, this.y * cell.y );
    }
});

console.log(Peashoter.prototype);
console.log(Plant.prototype);
console.log(Fixed.prototype);

export default Peashoter;

