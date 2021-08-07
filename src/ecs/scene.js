import 'https://unpkg.com/js-quadtree@3.3.6/dist/index.js'

const lerp = (start, end, amt)=>Math.round((1-amt)*start+amt*end);
const apro = (start, end, amt)=>start > end ? Math.max(0, start - amt) : Math.min(0, start + amt);


const process_background = (bdata)=>new Promise((resolve)=>{
    fetch(bdata.image).then(raw=>raw.blob()).then(blob=>{
        let img = document.createElement("img");
        img.src = URL.createObjectURL(blob);

        img.onload = ()=>resolve({
            ...bdata,
            img,
        });
    }).catch(e=>console.error(e));
});

export class Scene{
    #onstep;
    #onstop;
    #onplay;

    constructor(tag, data = {}){
        this.tag = tag ?? 'def_scene';

        const a = {
            get a(){
                return 10;
            }
        }

        this.#onstep = data.step;
        this.#onstop = data.stop;
        this.#onplay = data.play;

        this.play = ({ctx}) => new Promise(resolve =>{
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
        super(tag, {
            ...data,
            step : ({ctx, brakes})=>{
                const all = [...this.entities.fixed, ...this.entities.freed, ...this.entities.projc];
                const mov = [...this.entities.freed, ...this.entities.projc];
                    
                this.quadtree.clear();
                mov.forEach(e=>this.quadtree.insert(e));

                //STEP
                const d_step = {
                    brakes
                }
                
                all.forEach(e => e.step( this, d_step));

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
                    ctx.clearRect(0,0,ctx.canvas.width, ctx.canvas.height);
                    if(this.background) {
                        ctx.save();
                        const ratio =  Math.max(Math.ceil(ctx.canvas.width / this.background.img.width),Math.ceil(ctx.canvas.height / this.background.img.height));
                        
                        const dx = Math.floor((ctx.canvas.width / ratio -  this.background.img.width) / 2),
                            dy = Math.floor((ctx.canvas.height / ratio - this.background.img.height) / 2);
                        
                        ctx.scale(ratio, ratio);
                        ctx.drawImage(this.background.img, dx, dy);
                        ctx.restore();
                    }
                    all.sort((a,b)=>a.y - b.y).forEach(e => e.draw(ctx));
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
            projc : []
        };

        process_background(data.background).then(
            b=>this.background=b
        );
    }   
} 