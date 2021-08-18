import 'https://unpkg.com/js-quadtree@3.3.6/dist/index.js'
import { game_data, updateData } from '../game_data.js';

const lerp = (start, end, amt)=>Math.round((1-amt)*start+amt*end);
const apro = (start, end, amt)=>start > end ? Math.max(0, start - amt) : Math.min(0, start + amt);

const process_background = (bdata)=>new Promise((resolve)=>{
    fetch(bdata.image).then(raw=>raw.blob()).then(blob=>{
        let img = new Image();
        img.src = URL.createObjectURL(blob);

        bdata.play_area.size = {
            x : bdata.play_area.cols *  bdata.play_area.cell_size.x,
            y : bdata.play_area.rows *  bdata.play_area.cell_size.y,
        }

        img.onload = ()=>resolve({
            ...bdata,
            img
        });

    }).catch(e=>console.error(e));
});

const check = (c, w) => c >= 0 && c < w;

export class Scene{
    #onstep;
    #onstop;
    #onplay;

    component;

    constructor(tag, data = {}){
        this.tag = tag ?? 'def_scene';

        this.impediment = {
            loading : [],
            waiting : [],
            loader : (promise, patient)=>{
                this.impediment.waiting[this.impediment.loading.push(promise) - 1] = patient;
            },
            loaded : async () =>{
                (await Promise.all(this.impediment.loading)).forEach((item, index) => this.impediment.waiting[index] && this.impediment.waiting[index](item));
                delete this.impediment;
            }
        }

        this.#onplay = data.play;
        this.#onstep = data.step;
        this.#onstop = data.stop;      
        
        Object.defineProperty(this, 'DEBUG',{
            value : data.DEBUG,
            writable : false
        });
        
        this.play = (ctx, router) => new Promise(async resolve =>{

            this.impediment.loader(new Promise(solve=>{
                router.$once('update', solve); router.current = data.component;
            }), solution=>this.component = solution);

            await this.impediment.loaded();

            //this.gui_interface.$on('game', console.log);
            console.log(this.gui_interface);

            this.#onplay && this.#onplay(ctx, router);

            let stopped = false;
            
            const clock_data = {
                brakes : ()=>stopped = true,
                ctx
            }
            
            let id = 0;
            const main = ()=>{
                id = window.requestAnimationFrame(main);
                this.#onstep && this.#onstep(clock_data);

                if(stopped){  
                    window.cancelAnimationFrame(id);
                    console.log(`[scene][${this.tag}]: i've ended!`);
                    this.#onstop && this.#onstop();

                    resolve(this);
                }
            }

            console.log(`[scene][${this.tag}]: i've started!`);
            main();
        });
    }

    play;
}

export class BattleScene extends Scene{
    constructor(tag, data){
        console.log('BattleScene\'s been born!');

        super(tag, {
            DEBUG : data.DEBUG,
            component : data.component,
            play : (ctx)=>{
                const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.level.img.width),Math.ceil(ctx.canvas.height / this.level.img.height));
                this.level.fit_data = {
                    ratio,
                    dx : Math.floor((ctx.canvas.width / ratio - this.level.img.width) / 2),
                    dy : Math.floor((ctx.canvas.height / ratio - this.level.img.height) / 2)
                }
            },
            step : async ({ctx, brakes})=>{
                updateData();

                const all = [...this.entities.fixed, ...this.entities.freed, ...this.entities.projc];
                const mov = [...this.entities.freed, ...this.entities.projc];
                    
                //STEP
                const scn = {
                    stop : brakes
                }
                
                this.entities.control.step && this.entities.control.step();
                all.forEach(e => e.step( e, scn));

                //PHYSICS
                mov.forEach(e=>{
                    if(!( e.vx || e.vx)) return;

                    e.x += Math.round(e.vx);
                    e.y += Math.round(e.vy);

                    e.vx = apro(e.vx, 0, Math.max(Math.abs(e.vx) / 5, 2));
                    e.vy = apro(e.vy, 0, Math.max(Math.abs(e.vy) / 5, 2));
                })
                
                const sort = new Promise((succ)=>succ(mov.sort((a,b)=>a.y - b.y)));

                //RENDER
                ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                ctx.save();
                {
                    const bg = this.level;
                    const fit = bg.fit_data;

                    ctx.scale(fit.ratio, fit.ratio);
                    ctx.drawImage(bg.img, fit.dx, fit.dy);

                    if(game_data.misc.drag && 
                        check(game_data.mouse.x - (bg.play_area.origin.x + fit.dx) * fit.ratio, bg.play_area.size.x * fit.ratio) &&
                        check(game_data.mouse.y - (bg.play_area.origin.y + fit.dy) * fit.ratio, bg.play_area.size.y * fit.ratio)
                        ){
                            
                        const xx = Math.floor((game_data.mouse.x - fit.dx * fit.ratio) / (fit.ratio * bg.play_area.cell_size.x)) * bg.play_area.cell_size.x + fit.dx;
                        const yy = Math.floor((game_data.mouse.y - fit.dy * fit.ratio) / (fit.ratio * bg.play_area.cell_size.y)) * bg.play_area.cell_size.y + fit.dy;
                        
                        ctx.fillStyle = '#fec7';
                        ctx.fillRect(xx, bg.play_area.origin.y + fit.dy, bg.play_area.cell_size.x, bg.play_area.size.y);
                        ctx.fillRect(bg.play_area.origin.x + fit.dx, yy,bg.play_area.size.x, bg.play_area.cell_size.y);
                    }

                    this.entities.fixed.sort((a,b)=>a.y-b.y);

                    this.entities.fixed.forEach(e =>ctx.drawImage(e.sprite,
                        (e.x +.5) * bg.play_area.cell_size.x + bg.play_area.origin.x + fit.dx - e.sprite.width * .5,
                        (e.y + 1) * bg.play_area.cell_size.y + bg.play_area.origin.y + fit.dy - e.sprite.height)
                    );

                    ctx.restore();

                    if(this.entities.control.draw) this.control.entities.draw();

                    if(this.DEBUG){
                        ctx.strokeStyle = '#f00'
                        ctx.lineWidth = 2;
                        ctx.strokeRect(
                            (this.level.play_area.origin.x + this.level.fit_data.dx)*this.level.fit_data.ratio,
                            (this.level.play_area.origin.y + this.level.fit_data.dy)*this.level.fit_data.ratio,
                            (this.level.play_area.size.x) *  this.level.fit_data.ratio,
                            (this.level.play_area.size.y) *  this.level.fit_data.ratio
                        );
                    }
                }
            },
            stop : () => {
                delete this.entities.fixed;
                delete this.entities.freed;
            }
        });

        this.entities = {
            fixed :     data.entities.fixed ?? [],
            freed :     data.entities.freed ?? [],
            projc :     data.entities.projc ?? [],
            control :   data.entities.control ?? {},
        };

        this.impediment.loader(process_background(data.level),solve=>this.level = solve);
    }   
} 