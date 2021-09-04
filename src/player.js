import { config } from "./game_data.js";

export default function ({router, canvas, base}) {
    this.ready = Promise.resolve(this);

    this.router = router;
    this.ctx    = canvas.getContext('2d', { alpha : false});
   
    config({
        capture  : false,
        mouse    : base.firstElementChild,
        keyboard : base,
        window   : window,
    }).focus();

    this.play   = function(scene){
        this.scene = scene;
        this.scene.connect(this.ctx, this.router ).then(console.log);
    }
}