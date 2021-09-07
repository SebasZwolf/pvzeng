import { Zombie } from "./zombie.js";
import { SpriteSheetSheet } from "../../sprite.js";
import { baseurl } from '../../route.js';

const def = {
    draw : function( ctx, { cell } ){
        this.image.index = (this.image.index + this.image.speed) % this.image.number;
        this.current.draw( ctx , Math.floor(this.image.index), this.x, this.y );
    },
    step : ()=>{},
    name : (function * plant_name(){ let i = 0; while(true) yield 'plant_' + ++i; })()
}

const baseZombie = function(name = def.name.next().value, { prototype, step, draw, born }){
    const _ = class extends Zombie{ constructor(x,y){ super(x,y); born.call(this); } };
    Object.freeze(Object.assign(_.prototype, prototype, { name, step, draw }));
    return _;
};