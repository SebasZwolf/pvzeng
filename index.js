import './preparation.js';

import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'

import {Engine} from './src/engine.js'

import { Scene, BattleScene } from './src/ecs/scene.js';

import guiComponent from './components/gui.js'
import { almanac as alm} from './objects/alamanc.js';

import { game_data } from './src/game_data.js';

const almanac = alm(game_data);

const draw =  function(ctx){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - 20, this.y - 20, 40, 40);
};

const step = function(scn, {brakes}){
    if(game_data.mouse.button.pressed.includes(0)){
        
        let mouse = game_data.mouse;

        const dx = (mouse.x - this.x);
        const dy = (mouse.y - this.y);

        const a = Math.atan2(dy, dx);

        const dist = (40000 - Math.min((dx)**2 + (dy)**2, 40000))/2000;

        this.vx -= dist * Math.cos(a);
        this.vy -= dist * Math.sin(a);
    }
};

const elements =(n)=>{
    const element = (x,y)=>({
        x, y, color : ['green','lime','blue','gold'].choose(), draw, step, vx : 0, vy : 0,
    });
    
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(element(Math.random() * 1600, Math.random() * 900 ))

    return arr;
}

const createPlant = (base, x, y) =>({
    x, y, sprite : base.anims.iddle.img,
    ...base
});

Object.entries(createPlant(almanac.plants.peashoter, 0, 0)).forEach(([key, value])=>console.log(`${key}:\t`, almanac.plants.peashoter[key] ? almanac.plants.peashoter[key] === value : value ));

const scene = new BattleScene('test_scene', {
    entities : {
        fixed : [
            createPlant(almanac.plants.peashoter, 0, 1),
            createPlant(almanac.plants.peashoter, 0, 2),
            createPlant(almanac.plants.peashoter, 0, 3),
        ],
        freed : elements(10),
        projc : [],
        control : {
            step: (self, scn)=>{
                game_data.keyboard.pressed.includes('Enter') && console.log(scn.quadtree.getTree())
            }
        }
    },
    level : {
        cname : "def_level",
        image : ('sebaszwolf.github.io' === window.location.hostname ? '/pvzeng' : '') + "/objects/assets/def_map.bmp",
        play_area : {
            origin : { x : 48, y : 27},
            matrix : [
                1,1,1,0,1,0,0,0,0,
                1,1,1,0,1,0,0,0,0,
                0,0,0,0,1,0,0,0,0,
                0,0,0,0,1,0,1,1,1,
                0,0,0,0,1,0,1,1,1, 
            ],
            rows : 5,
            cols : 9,
            cell_size : { x : 6, y : 9}
        }
    },
    almanac,
    DEBUG: true
});

const Game = new Engine({
    canvas: {
        w : 1600,
        h : 900
    },
    guiComponent,
    css : './index.css',
    store : {
        state: ()=>({}),
        mutations:  {},
        actions:    {},
        getters:    {},
    },
    scene,
});

Game.ready.then(i => i());

Game.App.$children[0].money++;

console.log(Game.App.$children[0].money);