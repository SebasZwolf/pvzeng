import { Plant }  from './plant.js'
import { SpriteSheetSheet } from "../../sprite.js";
import { baseurl } from '../../route.js';

const def = {
    draw : function( ctx, { cell } ){
        this.image.index = (this.image.index + this.image.speed) % this.image.number;
        this.current.draw( ctx , Math.floor(this.image.index), this.x * cell.x, this.y * cell.y );
    },
    step : ()=>{},
    name : (function * plant_name(){ let i = 0; while(true) yield 'plant_' + ++i; })()
}

const basePlant = function(name = def.name.next().value, { prototype, step, draw, born }){
    const _ = class extends Plant{ constructor(x,y){ super(x,y); born.call(this); } };
    Object.freeze(Object.assign(_.prototype, prototype, { name, step, draw }));
    return _;
}   

const spritePlant = function(name, { 
        source, sprites, image,
        born,
        prototype,
        step,
    }){
    const nclass = basePlant(name, {
        prototype : {
            ...prototype,
            sprites : new SpriteSheetSheet( source, sprites ),
        },
        born : function(){
            this.image = { index : image.index, speed : image.speed }
            Object.defineProperty(this.image, 'number', { get : ()=>this.current.image.n });
            
            this.sprites.ready.then(arr=>{
                this.current = arr[0];
                this.image_index = Math.floor(Math.random()*this.current.image.n);
            });
            
            born?.call(this);
        },
        step : step ?? def.step,
        draw : def.draw
    });

    return nclass;
}


const IcePeashoter = spritePlant('ice peashoter',{
    source : baseurl + '/objects/assets/sprites/coin_silver.png',
    sprites : [
        { name : 'iddle',   image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'run',     image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'walk',    image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } }
    ],
    image : {
        speed : .2,
        index : 1,
    },
});

const Wallnut = spritePlant('wallnut',{
    source : baseurl + '/objects/assets/sprites/coin_copper.png',
    sprites : [
        { name : 'iddle',   image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'run',     image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'walk',    image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } }
    ],
    image : {
        speed : .2,
        index : 2,
    },
});

const Peashoter = spritePlant('peashoter',{
    source : baseurl + '/objects/assets/sprites/coin_gold.png',
    sprites : [
        { name : 'iddle',   image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'run',     image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
        { name : 'walk',    image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } }
    ],
    image : {
        speed : .2,
        index : 0,
    },
    prototype : {
        maxhealth : 100
    }
});

export { Peashoter, Wallnut, IcePeashoter }