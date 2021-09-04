export const game_data = {
    mouse:{
        x : 0, y : 0,
        button : {...[false,false,false,false,false], true : [], false : [] }
    },
    keyboard:{ true  : [], false : [] },
    misc : {
        string : "",
        drag : false,
        ratio : 1
    }
}

export const back_data = {
    mouse : { true :    [], false : [] },
    keyboard : { true : [], false : [] },
    misc : {
        drag : false
    }
}

export const stepUpdate = _=>{
    const mb = game_data.mouse.button;
    mb.true  = back_data.mouse.true;  mb.true .forEach( button => mb[button] = true ); back_data.mouse.true  = [];
    mb.false = back_data.mouse.false; mb.false.forEach( button => mb[button] = false); back_data.mouse.false = [];
    
    const kb = game_data.keyboard;
    kb.true  = back_data.keyboard.true;  kb.true.forEach( key => {
        game_data.keyboard[key ] = true;
        if(key.length === 1) game_data.misc.string = game_data.misc.string + key;
    } );
    game_data.misc.string = game_data.misc.string.substring( game_data.misc.string.length - 10, 10);
    
    back_data.keyboard.true  = [];
    kb.false = back_data.keyboard.false; kb.false.forEach( key => game_data.keyboard[key ] = false); back_data.keyboard.false = [];

    if(game_data.misc.drag !== back_data.misc.drag) game_data.misc.drag = back_data.misc.drag;
}

export const set_input = ({capture = false})=>({
    mouse : ({button, type})=>{
        back_data.mouse[type[type.length - 1] === 'n'].push(button);

        return !capture;
    },
    //move : ({ clientX, clientY, layerX, layerY, pageX, pageY })=>console.log({ client: {clientX, clientY}, layer: {layerX, layerY}, page: {pageX, pageY} }),
    move : ({ offsetX : x, offsetY : y, type })=>{
        game_data.mouse.x = Math.round((x) * game_data.misc.ratio);
        game_data.mouse.y = Math.round((y) * game_data.misc.ratio);

        //return type[type.length - 1] === 'e';
    },
    keyboard : ({key, type})=>{
        const action = type[type.length - 1] === 'n'; key = key.toLowerCase();
        if(action && (game_data.keyboard[key] ?? false)) return !capture;

        back_data.keyboard[action].push(key);
    
        return !capture;
    },
    resize : (base) =>_=>game_data.misc.ratio = Math.max(base.firstElementChild.width / base.firstElementChild.offsetWidth, base.firstElementChild.height / base.firstElementChild.offsetHeight),
});

/**
 * 
 * @param {*} data 
 */
export const config = ({
    mouse,
    keyboard,
    window,
    capture
})=>{
    const input = set_input(capture)

    mouse.onmousemove   = mouse.ondragover  = input.move;
    mouse.onmousedown   = mouse.onmouseup   = input.mouse;

    keyboard.onkeydown  = keyboard.onkeyup  = input.keyboard;
    keyboard.oncontextmenu = _=>false;
    
    window.addEventListener("load", input.resize(keyboard), { once: true });
    window.onresize  = input.resize(keyboard);
    
    return keyboard;
}



const game_logic = {
    input : {
        keyboard : Object.freeze({
            check    : Object.assign(code=>game_data.keyboard[code ] ?? false,{
                pressed  : code=>game_data.keyboard[true ].includes(code),
                released : code=>game_data.keyboard[false].includes(code),
            }),
        }),
        mouse : Object.freeze({
            check    : Object.assign(code=>game_data.mouse.button[code ] ?? false,{
                pressed  : code=>game_data.mouse.button[true ].includes(code),
                released : code=>game_data.mouse.button[false].includes(code),
            }),
            get x(){ return game_data.mouse.x},
            get y(){ return game_data.mouse.y},
        }),
    },
}
