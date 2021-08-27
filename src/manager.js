
export class Manager {
    constructor(ctx, scene, router, almanac) {
        //this.play(scene);

        this.current_scene  = scene;

        this.ignite = ()=>{
            console.log('[manager] i\'ve been %cignited%c!', 'color: #dd6', null);
            
            if(this.current_scene) this.current_scene.play(ctx, router).then(sc =>this.scene_end(sc));

            delete this.ignite;
        };
    }

    current_scene;

    play(scene){
        this.current_scene  = scene ?? this.current_scene;

        this.current_scene?.play(ctx, router).then(this.scene_end);
    }

    scene_end(sc){
        console.log(`[manager]: scene ${sc.tag} has stoped playing!`);
        this.onscene_end?.();
    }
    
    ignite;
}
