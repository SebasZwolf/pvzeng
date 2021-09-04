import { SpriteSheetSheet } from "./sprite.js";

export const almanac = ({game_data})=>({
    plants : {
        peashoter : {
            type : 'r',
            create : (self, scene) =>{

            },
            step : (self, scene) =>{

            },
            sprites : new SpriteSheetSheet({
                base : '/objects/assets/sprites/coin_gold.png',
                sheets : [
                    { name : 'iddle',   image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
                    { name : 'run',     image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } },
                    { name : 'walk',    image : { dx : 0, dy : 0, w : 32, h : 32, n : 8, x : 16, y : 32 } }
                ]
            }),
        }
    }
});
