import { game_data } from "../src/game_data.js";
import { BattleScene, Level } from "../src/ecs/battle_scene.js";

import {default as BattleGui} from '../components/gui.js';
import {default as BattleGui2} from '../components/gui v.2.js';

const game_iface = {
    flags       : Math.floor(Math.random()*10) + 1,
    progress    : 0,
    sun_power   : 0,
    money       : 0,

    triggers    : {
        plants  : {
            /**
            * @typedef {{}} Plant
            * @param {Plant} BASE the type of plant to be planted
            * @param {Number} x the x Coordinate to be planted
            * @param {Number} y the y Coordinate to be planted
            */
            plant   : function(...args){
                this.events.plant && this.events.plant(args)
            },
            /**
            * @param {Number} x the x Coordinate to be planted
            * @param {Number} y the y Coordinate to be planted
            */
            unplant  : function(x, y){
                return (this.events.unplant && this.events.unplant());
            },
        }
    },

    events      : {
    },

    on : function(key, callback){
        this.events[key] = callback;
    }
}

export const scene = new BattleScene('test_scene', {
    component : BattleGui2,
    entities : {
        control : {
            step: (self, scn)=>{
                game_data.keyboard[true ].includes('Enter') && console.log(game_data);
                game_data.keyboard[false].includes(' ') && (game_iface.sun_power += 100);

                //if(game_data.keyboard[true ].includes('Enter')) 
                    //scn.plants.plant( scn.almanac.plants.peashoter, Math.floor(Math.random() * 9), Math.floor(Math.random() * 5));    
            }
        }
    },
    level : new Level({
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
    }),
    DEBUG: false
});
