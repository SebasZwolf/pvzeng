import { game_data } from "../src/game_data.js";
import { BattleScene } from "../src/ecs/scene.js";

import {almanac as alm} from '../objects/alamanc.js';
import {default as BattleGui} from '../components/gui.js';

const createPlant = (base, x, y) =>({x, y, sprite : base.anims.iddle.img,...base});
const almanac = alm(game_data);

export const scene = new BattleScene('test_scene', {
    component : BattleGui,
    entities : {
        control : {
            step: (self, scn)=>{
                game_data.keyboard.pressed.includes('Enter') && console.log(self)
            }
        }
    },
    level : {
        cname : "def_level",
        image : ('sebaszwolf.github.io' === window.location.hostname ? '/pvzeng' : '') + "/objects/assets/def_map.bmp",
        play_area : {
            origin : { x : 48, y : 27},
            cell_size : { x : 6, y : 9},
            matrix : [
                1,1,1,0,1,0,0,0,0,
                1,1,1,0,1,0,0,0,0,
                0,0,0,0,1,0,0,0,0,
                0,0,0,0,1,0,1,1,1,
                0,0,0,0,1,0,1,1,1, 
            ],
            rows : 5,
            cols : 9,
        }
    },
    almanac,
    DEBUG: true
});
