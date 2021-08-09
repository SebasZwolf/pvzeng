import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.esm.browser.min.js'
import {game_data, back_data} from './game_data.js'

import {Manager} from './manager.js'

const _aux_data = {
    canvas:     {w : 480, h : 360},
    el:         '#game',
    stores :    null,
    css :       null,
    store :     null,
    guiComponent : ()=>import(/* webpackPrefetch: true */ '/components/gui.js'),
};

const prepDom = _d => {
    const _el = document.querySelector(_d.el);

    if(_el == null) {throw `could not find ${_d.el} element!`;};
    _el.classList.add("game-window");

    const _canv     = document.createElement("canvas");
    _canv.width     = _d.canvas.w;
    _canv.height    = _d.canvas.h;
    _canv.tabIndex  = 0;
    
    /*_canv.draggable = true;
    _canv.ondrag = (e)=>console.log(e);
    _canv.ondragstart = (e)=>console.log(e);
    _canv.ondragover = (e)=>e.preventDefault();*/

    const _gui  = document.createElement("gui");
    _gui.setAttribute('v-on:css', 'css');

    const _icss  = document.createElement("link");
    _icss.href   = "./src/init.css";
    _icss.type   = "text/css";
    _icss.rel    = "stylesheet";

    const _ccss = document.createElement("link");
    _ccss.href  = _d.css;
    _ccss.type   = "text/css";
    _ccss.rel    = "stylesheet";

    const _ccsss = document.createElement("component");
    _ccsss.setAttribute('is', 'style');
    _ccsss.type   = "text/css";
    _ccsss.textContent = "{{ccss}}";
    
    [_canv, _icss, _ccss, _ccsss, _gui].forEach(_i => _el.appendChild(_i));

    _d.gui  = _el;

    return _d;
};

const defineInputs = (canv)=>{
    setTimeout(()=>{
        game_data.misc.ratio = Math.max(canv.width / canv.offsetWidth, canv.height / canv.offsetHeight);
        canv.focus();
    }, 5);

    window.onresize = (e)=>game_data.misc.ratio = Math.max(canv.width / canv.offsetWidth, canv.height / canv.offsetHeight);

    canv.onmousemove = (e)=>{
        game_data.mouse.x = Math.ceil(e.offsetX * game_data.misc.ratio);
        game_data.mouse.y = Math.ceil(e.offsetY * game_data.misc.ratio);
    }
    canv.onmousedown    = ({button})=>{
        canv.focus();
        game_data.mouse.button[button] = true;
        back_data.mouse.pressed.push(button);
        return false;
    }
    canv.onmouseup      = ({button})=>{
        canv.focus();
        game_data.mouse.button[button] = false;
        back_data.mouse.released.push(button);
        return false;
    }

    canv.onkeydown   = ({key : code})=>{        
        if(game_data.keyboard[code] ?? false) return;

        game_data.keyboard[code] = true;
        back_data.keyboard.pressed.push(code);
        //return false;
    }
    
    canv.onkeyup     = ({key : code})=>{
        game_data.keyboard[code] = false;
        back_data.keyboard.released.push(code);
        //return false;
    }

    /*canv.ondrop     = (e) =>console.log('drop: ', e);
    canv.ondragover = (e)=>e.preventDefault();*/

    canv.oncontextmenu = (e)=>false;
}

export class Engine{
    constructor(_d){
        const addProm = (name)=>this.#proms.promises.push(new Promise((succ) => this.#proms[name] = succ));
        const endProm = (k, a)=>{this.#proms[k](a); this[k] = a};
        
        this.#proms = {
            promises : []
        };

        addProm('App');

        const _r = {
            ..._aux_data,
            ..._d
        };
        
        prepDom(_r);

        if(_r.store){
            Vue.use(Vuex);
            _r.store = new Vuex.Store(_r.store);
            
            console.log('%cVuex has been activated with enabled!', 'color: #6d6')
        }else
            delete _r.store
        
        let App = new Vue({
            el: _r.gui,
            data : ()=>({
                ccss : ''
            }),
            components:{
                gui : _r.guiComponent
            },
            mounted(){
                endProm('App', this);
            },
            methods:{
                css(tag){
                    this.ccss += tag;
                }
            },
            store: _r.store
        });

        const node = document.createElement('div');
        const canv = App.$el.firstChild;

        defineInputs(canv);
    
        this.Manager    = new Manager(canv.getContext('2d'), _r.scene);
        this.ready      = new Promise(s=>Promise.all(this.#proms.promises).then(()=>s(this.Manager.ignite)));
    }

    #proms;
}