import { set_input as inputG } from "./game_data.js";

export default function ({router, ctx, base}) {
    this.ready = Promise.resolve(this);

    this.router = router;
    this.ctx    = ctx;
   
    ((base, input)=>{
        const canv = base.firstElementChild;
                
        window.addEventListener("load", input.resize(base), { once: true });
        window.onresize  = input.resize(base);
        
        base.tabIndex    = 0;
        canv.onmousemove = base.ondragover = input.move;
        base.onkeydown   = base.onkeyup    = input.keyboard;
        base.oncontextmenu                 = _=>false;

        canv.onmousedown = canv.onmouseup  = input.mouse;

        return base;
    })(base, inputG({ capture : true, base })).focus();

    this.play   = function(scene){
        this.scene = scene;
        this.scene.connect(this.ctx, this.router ).then(console.log);
    }
}