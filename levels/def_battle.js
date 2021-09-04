import { almanac } from "../objects/alamanc.js";
import { BattleScene, Level, Interface } from "../src/ecs/battle_scene.js";
import { game_data } from "../src/game_data.js";

import Peashoter from "../objects/almanac/plants/peashoter.js";

const create_plant = (plant, x, y)=>new plant({x,y});

export const scene = new BattleScene('test_scene', {
    component : ()=>import('../components/gui v.2.js'),
    entities : {
        control : {
            step: (self, scn, input) =>{
                input.keyboard[true ].includes('Enter') && console.log(game_data);
                input.keyboard[false].includes(' ') && (game_iface.sun_power += 100);
            }
        },
        fixed : [
            create_plant(Peashoter, 0, 0),
            create_plant(Peashoter, 1, 1),
            create_plant(Peashoter, 1, 3),
            create_plant(Peashoter, 3, 4),
            create_plant(Peashoter, 4, 4),
            create_plant(Peashoter, 8, 2),
            create_plant(Peashoter, 6, 3),
            create_plant(Peashoter, 7, 3),
            create_plant(Peashoter, 6, 2),
        ]
    },
    level : new Level({
        cname : "def_level",
        image : ('sebaszwolf.github.io' === window.location.hostname ? '/pvzeng' : '') + "/objects/assets/def_map.bmp",
        play_area : {
            origin : { x : 96, y : 54},
            cell_size : { x : 12, y : 18},
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
    DEBUG: true
});
