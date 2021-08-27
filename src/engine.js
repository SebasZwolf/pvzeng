import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.min.js'

import guiRouter from './guiRouter.js'
import ScenePlayer from './player.js';

/*const _aux_data = {
    canvas:     {w : 480, h : 360},
    el:         '#game',
    stores :    null,
    css :       null,
    store :     null,
};*/

export class Engine{
    constructor(d){
        const {scene, window, el, store : storeData = null, alamanc} = d;

        this.#proms = { promises : [] };
              
        (( window, el ) => {
            const _el = document.querySelector(el);
            if(_el == null) {throw `could not find ${el} element!`;};

            _el.classList.add("game-window");
            
            const [_canv, _icss, _dcss] = [
                Object.assign(document.createElement("canvas"), { width : window.canvas.w, height :  window.canvas.h }),
                Object.assign(document.createElement("link"),{ href : "./src/init.css", type : "text/css", rel  : "stylesheet"}),
                Object.assign(document.createElement("link"),{ href : window.css, type : "text/css", rel  : "stylesheet"})
            ].map(e =>{ e.setAttribute('v-once', true); return e; });
            
            _canv.setAttribute('ref', 'canvas');
                        
            const _ccss = Object.assign(document.createElement("component"), { type : 'text/css', textContent : '{{ccss}}' });
            _ccss.setAttribute('is', 'style');
            
            const _guic  = document.createElement("gui-router");
            _guic.setAttribute('v-on:css', 'css');
            _guic.setAttribute('ref', 'gui-router');
            
            [_canv, _icss, _dcss, _ccss, _guic].forEach(_i => _el.appendChild(_i));
            return _el;
        })( window, el );

        const vuexEnable = ( ( globalThis.Vuex ?? null ) && storeData );
        vuexEnable && Vue.use(Vuex);

        this.App = new Vue({
            el: el,
            data : ()=>({
                ccss : ''
            }),
            methods:{
                css(tag){
                    this.ccss = tag;
                }
            },
            components :{
                guiRouter
            },
            store: vuexEnable ? new Vuex.Store(storeData) : null,
        });

        this.Player = new ScenePlayer({
            router :    this.App.$refs['gui-router'],
            ctx :       this.App.$refs['canvas'].getContext('2d'),
            base :      this.App.$el,
            scene,
            alamanc
        });

        this.#proms.promises.push(this.Player.ready);

        const handle = Promise.custom();
        this.ready = handle.prom;

        Promise.all(this.#proms.promises).then(_=>handle.resolve(()=>{
            this.Player.play(scene);
            delete this.ready;
        }))
    }

    #proms;
}