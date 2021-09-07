import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'
import './preparation.js';

import { Engine } from './src/engine.js'
import { scene } from './levels/def_battle.js';

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
    almanac : null,
    el : '#game',
});

(await Game.ready)();