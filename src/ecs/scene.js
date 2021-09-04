import 'https://unpkg.com/js-quadtree@3.3.6/dist/index.js'

export class Scene{
    #onstep;
    #onstop;
    #onplay;

    component;
    impediment;

    constructor(tag, { play, stop, step, DEBUG, ...data}){
        this.tag = tag ?? 'def_scene';

        this.#onplay = play;
        this.#onstep = step;
        this.#onstop = stop;

        
        this.load = Object.assign((promise, callback)=>this.load.callbacks[this.load.promises.push(promise) - 1] = callback,{
            promises : [], callbacks : [], wait : async ()=>{
                (await Promise.all(this.load.promises)).forEach((p,i)=>this.load.callbacks[i]?.(p));
                return delete(this.load);
            }
        });

        this.connect = (ctx, router) => new Promise(async resolve =>{
            
            await this.load.wait();
            
            this.#onplay?.(ctx, router);
            router.play(this.component);

            let stopped = false;

            const clock_data = {
                brakes : ()=>stopped = true,
                ctx
            }
            
            let id = 0;
            const main = ()=>{
                id = window.requestAnimationFrame(main);

                this.#onstep?.(clock_data);

                if(stopped){  
                    window.cancelAnimationFrame(id);
                    console.log(`[scene][${this.tag}]: i've ended!`);
                    this.#onstop?.();

                    resolve(this);
                }
            }

            console.log(`[scene][${this.tag}]: i've started!`);
            main();
        });
    }

    play;
}

