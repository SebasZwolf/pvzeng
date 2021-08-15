import 'https://unpkg.com/js-quadtree@3.3.6/dist/index.js'
import { game_data } from '../game_data.js';

const lerp = (start, end, amt)=>Math.round((1-amt)*start+amt*end);
const apro = (start, end, amt)=>start > end ? Math.max(0, start - amt) : Math.min(0, start + amt);


const process_background = (bdata)=>new Promise((resolve)=>{
    fetch(bdata.image).then(raw=>raw.blob()).then(blob=>{
        let img = document.createElement("img");
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

export class Scene{
    #onstep;
    #onstop;
    #onplay;
    loading = null;

    constructor(tag, data = {}){
        this.tag = tag ?? 'def_scene';

        this.#onstep = data.step;
        this.#onstop = data.stop;
        this.#onplay = data.play;

        this.DEBUG = data.DEBUG;
        
        this.play = ({ctx}) => new Promise(async resolve =>{
            this.loading && await this.loading;
            this.#onplay && this.#onplay(ctx);

            let id = 0;
            let stopped = false;

            const brakes = ()=>stopped = true;
    
            const clock_data = {
                brakes,
                ctx
            }


            const main = ()=>{
                id = window.requestAnimationFrame(main);
                                
                this.tick  && this.tick();
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

    tick;
}

export class BattleScene extends Scene{
    constructor(tag, data){
        console.log('BattleScene\'s been born!');
        super(tag, {
            ...data,
            play : (ctx)=>{
                const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.level.img.width),Math.ceil(ctx.canvas.height / this.level.img.height));
                this.level.fit_data = {
                    ratio,
                    dx : Math.floor((ctx.canvas.width / ratio - this.level.img.width) / 2),
                    dy : Math.floor((ctx.canvas.height / ratio - this.level.img.height) / 2)
                }
            },
            step : async ({ctx, brakes})=>{
                const all = [...this.entities.fixed, ...this.entities.freed, ...this.entities.projc];
                const mov = [...this.entities.freed, ...this.entities.projc];
                    
                this.quadtree.clear();
                mov.forEach(e=>this.quadtree.insert(e));

                //STEP
                const d_step = {
                    brakes
                }
                
                all.forEach(e => e.step( this, d_step));
                if(this.entities.control.step) this.entities.control.step();

                //PHYSICS
                mov.forEach(e=>{
                    if(!( e.vx || e.vx)) return;

                    e.x += Math.round(e.vx);
                    e.y += Math.round(e.vy);

                    e.vx = apro(e.vx, 0, Math.max(Math.abs(e.vx) / 5, 2));
                    e.vy = apro(e.vy, 0, Math.max(Math.abs(e.vy) / 5, 2));
                })

                //RENDER
                {
                    const sort = new Promise((succ)=>succ(all.sort((a,b)=>a.y - b.y)));

                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    {
                        const bg = this.level;
                        const fit = bg.fit_data;

                        ctx.save();
                        
                        ctx.scale(fit.ratio, fit.ratio);
                        ctx.drawImage(bg.img, fit.dx, fit.dy);

                        const check = (c, w) => c >= 0 && c < w;
                        
                        if(game_data.misc.drag && 
                            check(game_data.mouse.x - (bg.play_area.origin.x + fit.dx) * fit.ratio, bg.play_area.size.x * fit.ratio) &&
                            check(game_data.mouse.y - (bg.play_area.origin.y + fit.dy) * fit.ratio, bg.play_area.size.y * fit.ratio)
                            ){
                                
                            const xx = Math.floor((game_data.mouse.x - fit.dx * fit.ratio) / (fit.ratio * bg.play_area.cell_size.x)) * bg.play_area.cell_size.x + fit.dx;
                            const yy = Math.floor((game_data.mouse.y - fit.dy * fit.ratio) / (fit.ratio * bg.play_area.cell_size.y)) * bg.play_area.cell_size.y + fit.dy;
                            
                            ctx.fillStyle = 'rgba(255,250,200,.5)'
                            
                            ctx.fillRect(
                                xx,
                                bg.play_area.origin.y + fit.dy,
                                bg.play_area.cell_size.x,
                                bg.play_area.size.y
                            );

                            ctx.fillRect(
                                bg.play_area.origin.x + fit.dx,
                                yy,
                                bg.play_area.size.x,
                                bg.play_area.cell_size.y
                            );
                        }

                        ctx.restore();
                    }

                    (await sort).forEach(e => e.draw(ctx));
                    if(this.entities.control.draw) this.control.entities.draw();

                    if(this.DEBUG){
                        const bg = this.level;

                        ctx.save();
                        ctx.scale(bg.fit_data.ratio, bg.fit_data.ratio);

                        
                        ctx.fillStyle = '#f44a'
                        ctx.fillRect(
                            (game_data.mouse.x - bg.fit_data.dx * bg.fit_data.ratio)/bg.fit_data.ratio - 1 + bg.fit_data.dx,
                            (game_data.mouse.y - bg.fit_data.dy * bg.fit_data.ratio)/bg.fit_data.ratio - 1 + bg.fit_data.dy,
                            2,2
                        )
                        
                        ctx.fillStyle = '#000'
                        ctx.strokeRect(
                            bg.play_area.origin.x + bg.fit_data.dx,
                            bg.play_area.origin.y + bg.fit_data.dy,
                            bg.play_area.size.x,
                            bg.play_area.size.y
                        );
                        
                        ctx.restore();
                    }
                }
            },
            stop : () => {
                delete this.entities.fixed;
                delete this.entities.freed;
            }
        });

        this.quadtree = new QT.QuadTree(new QT.Box(0, 0, 1600, 900),{
            capacity : 4,
            arePointsEqual: (point1, point2) => point1.x === point2.x && point1.y === point2.y
        });

        this.entities = {
            fixed : [...data.entities.fixed],
            freed : [...data.entities.freed],
            projc : [...data.entities.projc],
            control : {...data.entities.control}
        };

        (this.loading = Promise.all([
            process_background(data.level)
        ])).then(solve=>{
            [this.level] = solve;
        });
    }   
} 