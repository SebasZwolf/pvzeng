import {Engine} from './src/engine.js'
import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'
import { Scene, BattleScene } from './src/ecs/scene.js';
import guiComponent from '/components/gui.js'
import { almanac } from './objects/alamanc.js';
import { game_data } from './src/game_data.js';

!Array.prototype.choose && Object.defineProperty(Array.prototype, 'choose', {
    value: function() { return this[Math.floor(Math.random()*this.length)]; }
});

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

    game_data.mouse.button.released.includes(0) && console.log('released');
};

const elements =(n)=>{
    const element = (x,y)=>({
        x, y, color : ['green','lime','blue','gold'].choose(), draw, step, vx : 0, vy : 0,
    });
    
    const arr = [];
    for (let i = 0; i < n; i++) arr.push(element(Math.random() * 1600, Math.random() * 900 ))

    return arr;
}

const scene = new BattleScene('test_scene', {
    entities : {
        fixed : [],
        freed : [{
            x:0, y:0, draw: ()=>{}, step:(scn)=>{
                game_data.keyboard.pressed.includes('Enter') && console.log(scn.quadtree.getTree())
            }
        },...elements(10)]
    },
    background : {
        cname : "def_level",
        image : "/objects/assets/def_map.bmp",
        play_area : {
            origin : { x : 24, y : 9},
            matrix : [
                1,1,1,0,1,0,0,0,0,
                1,1,1,0,1,0,0,0,0,
                0,0,0,0,1,0,0,0,0,
                0,0,0,0,1,0,1,1,1,
                0,0,0,0,1,0,1,1,1, 
            ],
            rows : 5,
            cell_size : { x : 3, y : 3}
        }
    }
});

const Game = new Engine({
    canvas: {
        w : 1600,
        h : 900
    },
    guiComponent,
    css : '/index.css',
    store : {
        state: ()=>({}),
        mutations:  {},
        actions:    {},
        getters:    {},
    },
    scene,
});

Game.ready.then(i => i());