import { BattleScene, Level, Interface } from "../src/ecs/battle_scene.js";
import { game_data } from "../src/game_data.js";

import { Peashoter, Wallnut, IcePeashoter } from "../objects/almanac/plants/alamanc.js";
import { baseurl } from "../objects/route.js";

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
            new Peashoter(0, 0),
            new Wallnut(3, 4),
            new Wallnut(4, 4),
            new Wallnut(0, 0),
            new Peashoter(8, 2),
            new IcePeashoter(6, 3),
            new Wallnut(7, 3),
        ]
    },
    level : new Level({
        cname : "def_level",
        image : baseurl + "/objects/assets/def_map.bmp",
        play_area : {
            origin :    { x : 96, y : 54 },
            cell_size : { x : 12, y : 18 },
            matrix : [
                1,1,1,0,1,0,0,0,0,
                1,1,1,0,1,0,0,0,0,
                0,0,0,0,1,0,0,0,0,
                0,0,0,0,1,0,1,1,1,
                0,0,0,0,1,0,1,1,1, 
            ],
            rows : 5, cols : 9,
        }
    }),
    DEBUG: true
});
