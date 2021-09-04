import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'
import './preparation.js';

import { Engine } from './src/engine.js'
import { scene } from './levels/def_battle.js';
import { almanac } from './objects/alamanc.js';
import { game_data } from './src/game_data.js';

const Game = new Engine({
    window : {
        canvas: { w : 1600, h : 900 },
        css : './index.css',
    },
    scene,
    store : {
        state: ()=>({}),
        mutations:  {},
        actions:    {},
        getters:    {},
    },
    almanac : almanac(game_data),
    el : '#game',
});

//(await Game.ready())();

(await Game.ready)();