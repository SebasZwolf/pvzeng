import { Scene } from "./scene.js";
import { game_data, updateData, back_data } from '../game_data.js';

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
}

export class BattleScene extends Scene{
    constructor(tag, data){ console.log('BattleScene\'s been born!');
        super(tag, {
            DEBUG : data.DEBUG,
            component : {
                functional : true,
                render : (h,c)=>h(data.component, { props : { game_interface : { game_data, back_data } }, on : c.listeners }, [])
            },
            play : (ctx)=>{
                const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.level.img.width), Math.ceil(ctx.canvas.height / this.level.img.height));
                const _r = 1 / ratio;

                this.level.fit_data = {
                    ratio,
                    dx : Math.floor((ctx.canvas.width  * _r - this.level.img.width)  * .5),
                    dy : Math.floor((ctx.canvas.height * _r - this.level.img.height) * .5)
                }

                ctx.imageSmoothingEnabled = false;
            },
            step : ({ctx, brakes})=>{
                updateData();

                const all = [...this.entities.fixed, ...this.entities.freed, ...this.entities.projc];

                //STEP
                this.entities.control.step && this.entities.control.step();
                all.forEach(e => e.step( e, {
                    stop : brakes
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
                        ctx.font = '32px Calibri'; ctx.textBaseline = 'bottom'; ctx.fillStyle = '#000';
                        ctx.fillText(JSON.stringify(game_data.keyboard),    0, ctx.canvas.height - 36);
                        ctx.fillText(JSON.stringify(game_data.mouse),       0, ctx.canvas.height);

                        ctx.fillStyle = '#f004'
                        ctx.fillRect(
                            (this.level.play_area.origin.x  + this.level.fit_data.dx)*this.level.fit_data.ratio,
                            (this.level.play_area.origin.y  + this.level.fit_data.dy)*this.level.fit_data.ratio,
                            (this.level.play_area.size.x)   * this.level.fit_data.ratio,
                            (this.level.play_area.size.y)   * this.level.fit_data.ratio
                        );
                    }
                }
            },
            stop : () => {
                delete this.entities.fixed;
                delete this.entities.freed;
            }
        });

        const { fixed = [], freed = [], projc = [], control = {} } = data.entities;
        this.entities = { fixed, freed, projc, control };
        this.level = data.level;

        this.impediment.load(this.level.ready, null);
        //this.impediment.loader(process_background(data.level), solve=>this.level = solve);
    }   
} 