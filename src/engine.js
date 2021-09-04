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
        const {scene, window : gameWindow, el, store : storeData = null, alamanc } = d;

        this.#proms = { promises : [] };
              
        (( window, _el ) => {
            if(_el == null) {throw `could not find ${el} element!`;};
            _el.classList.add("game-window");
            
            const [_canv, _icss, _dcss] = [
                Object.assign(document.createElement("canvas"), { width : window.canvas.w, height :  window.canvas.h }),
                Object.assign(document.createElement("link"),   { type : "text/css", rel  : "stylesheet", href : "./src/init.css", }),
                Object.assign(document.createElement("link"),   { type : "text/css", rel  : "stylesheet", href : window.css, })
            ].map(e =>{ e.setAttribute('v-once', true); return e; });
            
            _canv.setAttribute('ref', 'canvas');
            
            const _guic  = document.createElement("gui-router");
            _guic.setAttribute('v-on:router', 'router');
            _guic.setAttribute('ref', 'gui-router');
            
            [_canv, _icss, _dcss, /*_ccss,*/ _guic].forEach(_i => _el.appendChild(_i));
            return _el;
        })( gameWindow, document.querySelector(el) );

        const vuexEnable = ( ( globalThis.Vuex ?? null ) && storeData );
        vuexEnable && Vue.use(Vuex);

        this.App = new Vue({
            el: el,
            data : ()=>({}),
            methods:{
                router : e=>console.log('[router]:', e)
            },
            components :{
                guiRouter
            },
            store: vuexEnable ? new Vuex.Store(storeData) : null,
        });

        this.Player = new ScenePlayer({
            router :    this.App.$refs['gui-router'],
            canvas :    this.App.$refs['canvas'],
            base   :    this.App.$el,
            alamanc,
            scene,
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