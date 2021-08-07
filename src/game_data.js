export const game_data = {
    mouse:{
        x :1, y: 1, button : {...[false,false,false,false,false], pressed : [], released : []}
    },
    keyboard:{
        pressed : [],
        released : []
    },
    misc : {}
}

export const back_data = {
    mouse : { pressed : [], released : [] },
    keyboard : { pressed : [], released : [] },
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
}