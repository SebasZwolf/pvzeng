import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'
import './preparation.js';

import { Engine } from './src/engine.js'
import { scene } from './levels/def_battle.js';
import { almanac } from './objects/alamanc.js';
import { game_data } from './src/game_data.js';


//console.log('confirmation: ', Object.entries(createPlant(almanac.plants.peashoter, 0, 0)).reduce((pre, [key, value])=>{if(almanac.plants.peashoter[key]) pre[key] = value === almanac.plants.peashoter[key]; return pre;}, {}));

const Game = new Engine({
    window : {
        canvas: { w : 1600, h : 900 },
        css : './index.css',
    },
    store : {
        state: ()=>({}),
        mutations:  {},
        actions:    {},
        getters:    {},
    },
    scene,
    almanac : almanac(game_data),
    el : '#game',
});

//(await Game.ready())();

(await Game.ready)();