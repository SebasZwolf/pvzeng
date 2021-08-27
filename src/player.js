import { game_data , back_data, updateData} from "./game_data.js";

export default function ({router, ctx, base, almanac}) {
    this.ready = Promise.resolve(this);

    this.router = router;
    this.ctx    = ctx;

    ((base, capture = false)=>{
        const canv = base.firstElementChild;

        const updateRatio = _=>game_data.misc.ratio = Math.max(canv.width / canv.offsetWidth, canv.height / canv.offsetHeight);
        base.tabIndex  = 0;
        base.style.outline = 'none';

        window.addEventListener("load", updateRatio, { once: true });
        window.onresize = updateRatio;

        base.onmousemove    = base.ondragover = ({ offsetX : x, offsetY : y, type })=>{
            game_data.mouse.x = Math.round(x * game_data.misc.ratio);
            game_data.mouse.y = Math.round(y * game_data.misc.ratio);

            return type[type.length - 1] === 'e';
        }

        canv.onmousedown    = canv.onmouseup    = ({button, type})=>{
            const action = type[type.length - 1] === 'n';

            game_data.mouse.button[button] = action;
            back_data.mouse[action].push(button);

            return !capture;
        };

        base.onkeydown      = base.onkeyup      = ({key, type})=>{
            const action = type[type.length - 1] === 'n';
            
            if(action && (game_data.keyboard[key] ?? false)) return !capture;
            
            game_data.keyboard[key] = action;
            back_data.keyboard[action].push(key);

            return !capture;
        }

        base.oncontextmenu = _ => false;

        return base;
    })(base, false).focus();

    this.play   = function(scene = null){
        this.scene = scene ?? this.scene;

        this.scene.play(this.ctx, this.router).then(console.log);
    }
}