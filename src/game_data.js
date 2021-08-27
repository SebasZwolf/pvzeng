export const game_data = {
    mouse:{
        //xx : 0, yy : 0,
        x : 0, y : 0,
        button : {...[false,false,false,false,false], true : [], false : []}
    },
    keyboard:{
        true  : [],
        false : [],
    },
    misc : {
        drag : false,
        drop : false,
        ratio : 1
    }
}

/*Object.defineProperty(game_data.mouse, 'x',{
    set : function (v) { this.xx = v; if(isNaN(v) || v < 10) console.trace();},
    get : function () { return this.xx; }
})

Object.defineProperty(game_data.mouse, 'y',{
    set : function (v) { this.yy = v; if(isNaN(v) || v < 10) console.trace();},
    get : function () { return this.yy; }
})*/

export const back_data = {
    mouse : { true : [], false : [] },
    keyboard : { true : [], false : [] },
    misc : {
        drop : false
    }
}

export const updateData = ()=>{
    const mb = game_data.mouse.button;
        
    mb.true  = back_data.mouse.true;
    back_data.mouse.true  = [];

    mb.false = back_data.mouse.false;
    back_data.mouse.false = [];

    game_data.keyboard.true  = back_data.keyboard.true;
    back_data.keyboard.true  = [];
    
    game_data.keyboard.false = back_data.keyboard.false;
    back_data.keyboard.false = [];

    if(back_data.misc.drop) {
        back_data.misc.drop = game_data.misc.drag = false;
        game_data.misc.drop = true;
    }else
        if(!game_data.misc.drop) game_data.misc.drop = false;
}

export const manage_data = {
    mouse : {
        down : (button)=>{
            game_data.mouse.button[button] = true;
            back_data.mouse.pressed.push(button);
        },
        up : (button) =>{
            game_data.mouse.button[button] = false;
            back_data.mouse.released.push(button);
        }
    }
}