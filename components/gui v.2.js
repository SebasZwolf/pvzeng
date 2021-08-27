//import {back_data} from '../src/game_data.js'

import plantCard,  { css as c1_css } from './plant-card.js';
import usableItem, { css as c2_css } from './usable-item.js';
import powerMeter, { css as c3_css } from './power-meter.js';

const src =     '/objects/assets/chrome-icon.png';

const template = /*html*/`
<div class="gui-window">
    <div class="top-deck">
        <div class="ind"><div class="icon sun " style="width: 24px;"></div><span>1200</span></div>
        <div class="ind"><div class="icon moon" style="width: 24px;"></div><span>1200</span></div>
        <div class="ind"><img style="border-radius: 50%; " src="${src}"/>  <span>1200</span></div>
        <progress-bar :value="progress" flags="5"/>
        <button class="btn sq"><span>l l</span></button>
        <button class="btn sq"><span>&#10148;</span></button>
    </div>

    <div class="side-deck">
        <div class="plant-deck">
            <button class="scroll up"   @click="scrl($event, -1)"></button>
            <div class="content" @wheel="({path, deltaY : dy})=>path.find(e => e.className === 'content').scrollBy({ top : Math.sign(dy) * 144, behavior : 'smooth'})">
                <plant-card v-for="_ in 25" :plant="{ img : '${src}', cost : _ }" @click="()=>console.log('clicked!')" @dragstart="drag" @dragend="drag"/>
            </div>
            <button class="scroll down" @click="scrl($event, +1)"> </button>
        </div>
    </div>
    
    <div class="bottom-deck">
        <power-meter value="2" maxvalue="5"/>
        <div style="flex: 1"></div>
        <div class="usables">
            <usable-item v-for="(item, i) in consumables" :item="item" v-on:click="console.log(i)"></usable-item>
        </div>
        <button class="btn rd"><span>⛏️</span></button>
    </div>


</div>`;

const css = /*css*/`
    .gui-window{
        ---bcol : #7b9;
        ---gcol : #fd1;
    }
    .top-deck{
        display: flex; align-items : center; justify-content : space-between;
        min-height: 48px;
    }
    .side-deck{
        flex: 1; justify-content : space-around;
        align-self: stretch; overflow-y: hidden;

        display: flex; flex-direction: column;
    }
    .bottom-deck{
        display: flex; align-items : center; justify-content : flex-end;
        min-height: 48px;
    }
    button{ pointer-events: initial; cursor: pointer; }
`+/*css */`
    .plant-deck{
        max-width: 200px; width: 12%; min-width: 100px;
        flex: 1;

        align-self: stretch;
        aspect-ratio: 4/5;

        display: flex; flex-direction: column; align-content: stretch;
        padding: 2px;
    }
    .plant-deck >.content{
        flex: 1; overflow-y: hidden;
        margin: 4px 0; padding: 2px;
    }
    .plant-deck>.scroll{
        text-align: center; width: fit-content; align-self: center; padding: 0;
        padding: 6px;
        border-radius: 50%;
        aspect-ratio: 1/1;

        border: 2px solid #fff;
        background-color: var(---bcol);
        box-shadow: 0 2px 2px -1px #0008, 0 0 4px 0 inset #0004;
    }
    .plant-deck>.scroll:active{
        transform: translateY(1px);
        box-shadow: 0 0px 2px 0px #0008, 0 0 4px 0 inset #0004;
    }
    .plant-deck>.scroll:after{
        content: '';
        display: block;
        border: 8px solid #0000;
        box-shadow: 0 0 0 2px inset #942;
    }
    .plant-deck > .scroll.down:after{ margin-top: +3px; border-top: 12px solid var(---gcol); border-bottom:  0px; }
    .plant-deck > .scroll.up:after{   margin-top: -3px; border-top: 0px; border-bottom: 12px solid var(---gcol); }
    .plant-deck > .content > *:not(:last-child) { margin-bottom : 4px; }
`+/*css*/`
    button.btn{
        position: relative;
        aspect-ratio: 1;
        box-sizing: border-box;
        
        ---btnc : #7b9;
        padding : 0;

        border: none;
        padding : 4px;
        box-shadow: 0px 2px 2px -1px #0008, 0 0 4px 0 inset #0006;
    }
    button.btn + button.btn{
        margin-left: 4px;
    }
    button.btn:active{
        transform: translateY(1px);
        box-shadow: 0px 0px 2px  0px #0008, 0 0 4px 0 inset #0006;
    }
    button.btn > span{
        font-size: 20px; font-weight: 600; min-width: 24px;
        text-align: center; 
        line-height: 0;
        display: block;
    }
`+/*css*/`
    .btn.sq{
        background-image: linear-gradient(to bottom right, #fff -10%, var(---btnc) 20%, var(---btnc) 42%, #245 52%);
        padding : 3px; border-radius : 6px; display: flex;
    }
    .btn.sq > span{
        padding: 8px; padding-top: 20px;
        align-self: stretch; color: #fe2;

        border: 1px solid var(---btnc);
        border-top: 1px solid #9db;
        border-left: 1px solid #9db;

        border-radius : 4px; background-color : var(---btnc);
        
        box-shadow: 0px 0px 3px 0px inset #0004;
        text-shadow: 1px 0px 0px #942, 0px 1px 0px #942, -1px 0px 0px #942, 0px -1px 0px #942;
    }
`+/*css*/`
    .btn.rd{
        background-color: var(---btnc);
        padding: 6px; border-radius : 50%;
        border: 2px solid #225; box-sizing: border-box;
        box-shadow: 0px 1px 1px 2px inset #fff8, 0px -1px 1px 1px inset #245;
    }
    .btn.rd > span{
        padding: 12px; aspect-ratio: 1;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #113; border-radius: 50%;

        background-color : #5c6; color: #fe2;
        box-shadow: 0px 1px 2px 3px inset #394, 1px 2px 4px 3px inset #fffa, 0px -15px 10px -4px inset #af8;
        /*text-shadow: 1px 0px 0px #942, 0px 1px 0px #942, -1px 0px 0px #942, 0px -1px 0px #942, 1px 2px 3px #000;*/
    }
`+/*css*/`
    .ind{
        color: #fff; background-color: #0006; border: solid 2px #fff; box-sizing: border-box;
        display: block; border-radius: 8px;
        filter: drop-shadow(0px 1px 0px #000a);
    }
    .ind + .ind{ margin-left : 4px; }
    .ind > *{display: inline-block;}
    .ind > img{
        width: 24px; transform: scale(1.5,1.5);
        vertical-align: bottom; margin: 0 4px;
        /*filter: drop-shadow(0px 1px 0px #000a);*/
        box-shadow : 0 1px 1px 0 #0008;
    }
    .ind > span{
        line-height: 1.1; font-size: 20px; min-width: 56px;
        text-align: right; padding: 0 8px; vertical-align: bottom;
    }
`+/*css*/`
    .icon{
        aspect-ratio : 1 / 1;
        box-sizing: border-box;
        display : inline-block; vertical-align: bottom; text-align: center;

        ---sc : 1;

        transform : scale(var(---sc), var(---sc));
        margin: 0 calc((var(---sc) - 1) * 8px);
    }
    .icon.sun{
        border-radius : 50%;
        background-image: radial-gradient(circle at 50% 45%, #fff 2%, #fd1 50%, #f83 90%);
        border : 1px solid #f83; border-top-width: 0px;
        
        box-shadow : 0 1px 1px 0 #0008, 0 0 4px 1px #fe8;

        ---sc: 1.4;
    }
    .icon.moon{
        border-radius : 50%;
        background-color: #225;
        border : 1px solid #225;
        
        background-image: radial-gradient(circle at 35% 35%, #000, #0000 35%);
        box-shadow : 0 1px 4px 0 #2256, 0 0 4px 1px #234,  0px -2px 4px 1px inset #fff8, -3px -3px 0px 4px inset #aef;
        
        ---sc: 1.35;
    }
`+/*css*/`
    .usables{
        display: flex; align-items: center; padding: 0 8px;
    }
`+/*css*/`
    .progress-bar{
        box-sizing: content-box;
        border: 6px solid #0008; border-radius: 8px; padding: 2px 0px;
        width: 100%; max-width: 260px; height: 12px;
        position: relative; margin: auto;
    }
    .progress-bar > .bar{
        background-color : #0f8; float: right; height:100%; left: 0; right: 0;
    }
    .progress-bar > .flags{
        display: flex; flex-direction: row-reverse; position: absolute; height:100%; left: 0; right: 0;
    }
    .progress-bar > .flags > .flag{
        flex : 1; font-size : 16px; line-height: 1;
    }
`+/*css*/`
    @keyframes spin { 
        100% { 
          transform: rotateZ(360deg);
        }
    }
`

export default {
    name : "gui",
    template,
    data: ()=>({
        progress : 0,
        consumables : [
            { icon : '⬆️', cost : 100, amount : 4, color : '#dfa' },
            { icon : '⚡', cost : 100, amount : 4, color : '#a4f' },
            { icon : '🔥', cost : 100, amount : 4, color : '#f81' },
            { icon : '❄️', cost : 100, amount : 4, color : '#18f' },
        ],
    }),
    props : {
        game_interface : {
            type : Object,
            default : {}
        }
    },
    computed : {
        cflags : function() {
            return Math.round( this.game_iface.flags * this.game_iface.progress / 100);
        },
    },
    methods:{
        seed_pick(i){
            this.game_iface.sun_power += this.plants[i];
            this.$emit('game',{
                type : 'seed',
                index : i,
            });
        },
        drag(e, id){
            if(e.type[e.type.length-1] === 'd') return this.game_interface.back_data.misc.drop = true;

            this.game_interface.game_data.misc.drag = true;
                        
            e.dataTransfer.setData("text", id);
        },
        scrl : ({ target : { parentElement : { children : [, child,] } } }, m)=>child.scrollBy({ top: m*(40 + child.offsetHeight * .7), behavior: 'smooth'})
    },
    mounted(){
        this.$emit('css', css + c1_css + c2_css + c3_css);
        //const intv = setInterval(() => (++this.progress >= 100) && clearInterval(intv), 100);
        console.log(this.game_interface);
    },
    components:{
        plantCard,
        usableItem,
        powerMeter,
        progressBar : {
            name : 'progress-bar',
            functional : true,
            render : (h, {props : { value = '0%', flags : length = '1'} })=>{ 
                console.log('render!');
                const cflags = Math.floor( length * value * .01);

                return h('div', { class : 'progress-bar' },[
                h('div', { class : 'bar', style : { width : value + '%' } }, [
                    h('span', { style : { margin : '-10px', fontSize : '24px', lineHeight: '.5' } }, '🎱')
                ]),
                h('div', { class : 'flags' }, 
                    Array.from({ length }).map((_, i) => h('div', { class : 'flag', style : { lineHeight : i < cflags ? 0 : 1 } } , '🚩'))
                )
            ])}
        }
    }
};