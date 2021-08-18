import { Sprite } from "./ecs/sprite.js";
import { Scene } from "./ecs/scene.js";

export class Manager {
    constructor(ctx, scene, router) {
        this.current_scene  = scene ?? new Scene('def');

        ctx.imageSmoothingEnabled = false;

        this.ignite = ()=>{
            console.log('[manager] i\'ve been %cignited%c!', 'color: #dd6', null);
            
            this.current_scene.play(ctx, router).then(sc =>this.scene_end(sc));

            delete this.ignite;
        };
    }

    current_scene;

    scene_end(sc){
        console.log(`[manager]: scene ${sc.tag} has stoped playing!`);
        this.onscene_end && this.onscene_end();
    }
    
    ignite;
}
