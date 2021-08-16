export const game_data = {
    mouse:{
        //xx : 0, yy : 0,
        x : 0, y : 0,
        button : {...[false,false,false,false,false], pressed : [], released : []}
    },
    keyboard:{
        pressed : [],
        released : []
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
    mouse : { pressed : [], released : [] },
    keyboard : { pressed : [], released : [] },
    misc : {
        drop : false
    }
}

export const updateData = ()=>{
    const mb = game_data.mouse.button;
        
    mb.pressed  = back_data.mouse.pressed;
    mb.released = back_data.mouse.released;

    game_data.keyboard.pressed  = back_data.keyboard.pressed;
    game_data.keyboard.released = back_data.keyboard.released;

    back_data.keyboard.pressed  = [];
    back_data.keyboard.released = [];
    
    back_data.mouse.pressed     = [];
    back_data.mouse.released    = [];

    if(back_data.misc.drop) {
        back_data.misc.drop = false;

        game_data.misc.drag = false;
        game_data.misc.drop = true;
    }else
        if(!game_data.misc.drop) game_data.misc.drop = false;
    
}