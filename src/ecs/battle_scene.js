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

export class BattleScene extends Scene{
    constructor(tag, {component, DEBUG, connector, ...data}){
        console.log('BattleScene\'s been born!', data);

        const gdata = {
            game_data,
            back_data,
            user_data : connector instanceof Function ? connector() : connector,
            level : null,
        }

        super(tag, {
            DEBUG,
            component : { functional : true, render : (h, {listeners : on})=>h( component, { props : { gdata }, on }, []) },
            
            play : (ctx, router)=>{
                const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.level.img.width), Math.ceil(ctx.canvas.height / this.level.img.height));
                const _r = 1 / ratio;

                this.level.fit_data = {
                    ratio,
                    dx : Math.floor((ctx.canvas.width  * _r - this.level.img.width ) * .5),
                    dy : Math.floor((ctx.canvas.height * _r - this.level.img.height) * .5)
                }

                gdata.level = { 
                    pos : {
                        x : (this.level.fit_data.ratio * 100 * (this.level.play_area.origin.x + this.level.fit_data.dx) / ctx.canvas.width).toFixed(2) + '%',
                        y : (this.level.fit_data.ratio * 100 * (this.level.play_area.origin.y + this.level.fit_data.dy) / ctx.canvas.height).toFixed(2) + '%'
                    },
                    siz : {
                        x : (this.level.fit_data.ratio * 100 * this.level.play_area.size.x / ctx.canvas.width).toFixed(2) + '%',
                        y : (this.level.fit_data.ratio * 100 * this.level.play_area.size.y / ctx.canvas.height).toFixed(2) + '%',
                    },
                    dim : {
                        x : this.level.play_area.cols,
                        y : this.level.play_area.rows,
                    }
                };

                ctx.imageSmoothingEnabled = false;
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
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx.save();
                {
                    const bg = this.level;

                    ctx.scale(bg.fit_data.ratio, bg.fit_data.ratio);
                    ctx.drawImage(bg.img, bg.fit_data.dx, bg.fit_data.dy);

                    if(game_data.misc.drag && 
                        check(game_data.mouse.x - (bg.play_area.origin.x + bg.fit_data.dx) * bg.fit_data.ratio, bg.play_area.size.x * bg.fit_data.ratio) &&
                        check(game_data.mouse.y - (bg.play_area.origin.y + bg.fit_data.dy) * bg.fit_data.ratio, bg.play_area.size.y * bg.fit_data.ratio)
                        ){
                            
                        const xx = Math.floor((game_data.mouse.x - bg.fit_data.dx * bg.fit_data.ratio) / (bg.fit_data.ratio * bg.play_area.cell_size.x)) * bg.play_area.cell_size.x + bg.fit_data.dx;
                        const yy = Math.floor((game_data.mouse.y - bg.fit_data.dy * bg.fit_data.ratio) / (bg.fit_data.ratio * bg.play_area.cell_size.y)) * bg.play_area.cell_size.y + bg.fit_data.dy;
                        
                        ctx.fillStyle = '#fec7';
                        ctx.fillRect(xx, bg.play_area.origin.y + bg.fit_data.dy, bg.play_area.cell_size.x, bg.play_area.size.y);
                        ctx.fillRect(bg.play_area.origin.x + bg.fit_data.dx, yy, bg.play_area.size.x, bg.play_area.cell_size.y);
                    }

                    all.sort((a,b)=>a.y-b.y);

                    this.entities.fixed.forEach(e =>{
                        ctx.drawImage(e.sprite, (e.x +.5) * bg.play_area.cell_size.x + bg.play_area.origin.x + bg.fit_data.dx - e.sprite.width * .5, (e.y + 1) * bg.play_area.cell_size.y + bg.play_area.origin.y + bg.fit_data.dy - e.sprite.height)
                    });

                    ctx.restore();

                    this.entities.control.draw?.();

                    if(this.DEBUG){
                        ctx.font = '17px Monospace'; ctx.textBaseline = 'bottom'; ctx.fillStyle = '#000';
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

        const { fixed = [], freed = [], projc = [], control = {} } = data.entities;
        this.entities = { fixed, freed, projc, control };
        this.level = data.level;

        this.impediment.load(this.level.ready, null);
    }   
} 