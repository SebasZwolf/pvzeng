import { game_data, back_data, set_input, stepUpdate } from '../game_data.js';
import { Scene } from "./scene.js";

const check = (c, w) => c >= 0 && c < w;

export function Level({ cname : code_name, image : imgURL, play_area }){
    const handle = Promise.custom();

    fetch(imgURL).then(raw=>raw.blob()).then(blob=>{
        let img = new Image();
        img.src = URL.createObjectURL(blob);
        this.img = img;
        
        img.onload = ()=>handle.resolve(this);
    }).catch(handle.reject);
    
    this.cname      = code_name;
    this.play_area  = play_area;

    this.play_area.size = {
        x : play_area.cols * play_area.cell_size.x,
        y : play_area.rows * play_area.cell_size.y,
    };

    this.ready = handle.prom;

    this.ready.then(_=>delete this.ready);
}

const log = Object.assign((_log)=>log.log.push(_log),{
    log : []
});

log('a');

export const Interface = function({
    
}){
    if(this === globalThis) return;

    Object.assign(this, {
        money : { sun : 0, coins : 0,}
    });
}

export class BattleScene extends Scene{
    constructor(tag, { component, DEBUG, connector, ...data }){
        console.log('BattleScene\'s been born!', data);

        super(tag, {
            DEBUG,
            component : null,

            play : (ctx, router)=>{
                const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.level.img.width), Math.ceil(ctx.canvas.height / this.level.img.height));
                const _r = 1 / ratio;

                this.level.fit_data = {
                    ratio,
                    dx : Math.floor((ctx.canvas.width  * _r - this.level.img.width ) * .5),
                    dy : Math.floor((ctx.canvas.height * _r - this.level.img.height) * .5)
                }
                const
                    dw = this.level.fit_data.ratio * 100 / ctx.canvas.width,
                    dh = this.level.fit_data.ratio * 100 / ctx.canvas.height;
                
                const level = { 
                    pos : {
                        x : ((this.level.play_area.origin.x + this.level.fit_data.dx) * dw).toFixed(2) + '%',
                        y : ((this.level.play_area.origin.y + this.level.fit_data.dy) * dh).toFixed(2) + '%'
                    },
                    siz : {
                        x : (this.level.play_area.size.x * dw).toFixed(2) + '%',
                        y : (this.level.play_area.size.y * dh).toFixed(2) + '%',
                    },
                    dim : { x : this.level.play_area.cols, y : this.level.play_area.rows }
                };
                
                this.component = { functional : true, render : (h, {listeners : on})=>h( component, { props : { gdata : { level } }, on }, []) };

                ctx.imageSmoothingEnabled   = false;
                ctx.font                    = '17px Monospace';
                ctx.textBaseline            = 'bottom';
                ctx.fillStyle               = '#000';
            },

            step : ({ ctx, brakes }) =>{
                //InputStepUpdate
                stepUpdate();

                const all = [...this.entities.fixed, ...this.entities.freed, ...this.entities.projc];

                //STEP
                this.entities.control.step?.(this.entities.control, this, game_data);

                all.forEach(e => e.step( e, {
                    brakes
                }));

                //PHYSICS
                //RENDER
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.save();
                {
                    const bg = this.level;

                    ctx.scale(bg.fit_data.ratio, bg.fit_data.ratio);

                    ctx.drawImage(bg.img, bg.fit_data.dx, bg.fit_data.dy);
                    
                    ctx.translate(bg.play_area.origin.x + bg.fit_data.dx + bg.play_area.cell_size.x/2, bg.play_area.origin.y + bg.fit_data.dy + bg.play_area.cell_size.y);
                    
                    all.sort((a,b)=>a.y-b.y).forEach(e=>e.draw( ctx, {
                        cell : this.level.play_area.cell_size,
                    }));
                    
                    ctx.restore();
                    
                    this.entities.control.draw?.();

                    if(this.DEBUG){
                        Object.entries(game_data).forEach( ([k,v], i)=>  ctx.fillText(k +': ' + JSON.stringify(v), 0, ctx.canvas.height - 16*i) );
                    }
                }
            },
            
            stop : () => {
                delete this.entities.fixed;
                delete this.entities.freed;
                delete this.entities.projc;
                delete this.entities.control;
            }
        });

        this.entities = Object.assign({ fixed : [], freed : [], projc : [], control : {} }, data.entities);

        this.load(data.level.ready, level=>this.level=level);
    }   
} 