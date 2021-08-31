import 'https://unpkg.com/js-quadtree@3.3.6/dist/index.js'

export class Scene{
    #onstep;
    #onstop;
    #onplay;

    component;
    impediment;

    constructor(tag, data = {}){
        this.tag = tag ?? 'def_scene';

        ({ play : this.#onplay, stop : this.#onstop, step : this.#onstep, DEBUG : this.DEBUG} = data);

        this.impediment = {
            loading : [], waiting : [],
            load : (promise, patient)=>{
                this.impediment.waiting[this.impediment.loading.push(promise) - 1] = patient;
                return this;
            },
            loaded : async () =>{
                (await Promise.all(this.impediment.loading)).forEach((item, index) => this.impediment.waiting[index] && this.impediment.waiting[index](item));
                delete this.impediment;
            }
        };
                
        this.connect = (ctx, router) => new Promise(async resolve =>{
            router.play(data.component);

            //WAIT FOR READY
            await this.impediment.loaded();

            this.#onplay?.(ctx, router);

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

