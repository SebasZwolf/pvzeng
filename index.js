import './preparation.js';

import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'

import { Engine } from './src/engine.js'
import { scene } from './levels/def_battle.js';

//console.log('confirmation: ', Object.entries(createPlant(almanac.plants.peashoter, 0, 0)).reduce((pre, [key, value])=>{if(almanac.plants.peashoter[key]) pre[key] = value === almanac.plants.peashoter[key]; return pre;}, {}));

const Game = new Engine({
    canvas: {
        w : 1600,
        h : 900
    },
    css : './index.css',
    store : {
        state: ()=>({}),
        mutations:  {},
        actions:    {},
        getters:    {},
    },
    scene,
});

(await Game.ready)();

//Game.App.$children[0].money++;
console.log(Game);