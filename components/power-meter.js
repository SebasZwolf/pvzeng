export const css = /*css*/`
    .power-meter{
        display: flex; flex-direction : row;
        align-items: center;

        background-color: #fee;
        padding: 8px;
        box-shadow: 0 1px 2px 0px #0008;
        border-bottom : 1px solid #866;
    }

    .power-meter > .btn{
        margin-right: 8px; font-size : 18px;
        aspect-ratio : 1; background-color : #c8d; border : 2px solid #224; 
        padding: 6px; border-radius: 50%;
        box-shadow: 1px 1px 4px 0px inset #0008, 0px 0px 2px 0px inset #fff, 0px 1px 1px 0px #0008;
    }
    .power-meter > .btn.active{
        transform: translateY(1px);
        box-shadow: 0px 0px 1px 1px #0008;
    }

    .power-meter > div:last-child{
        min-height : 32px;
        box-shadow: 0 0 0 1px inset #000;
        display: flex;
    }

    .power-meter .power-box{
        background-color : #fee;
        border-radius : 8px; padding : 8px; min-width: 16px;
        display: flex; flex-direction: row; align-items: center;
    }
    
    .power-meter .power-box > div {
        min-width : 12px; border-radius: 50%; aspect-ratio : 1;
        background-color : #246;
        border : 2px solid #000;
    }
    .power-meter .power-box > div.on{
        background-color : #2af;
        box-shadow : 0 -1px 8px 0px inset #0f4, 0 1px 8px 1px #0f4 ;
        border : solid #1a2; border-width: 0px 1px 2px 1px;
        transform : scale(1.2,1.2);
    }
    .power-meter .power-box > div:not(:last-child){ margin-right : 8px; }
`;

export default {
    functional : true,
    props : {
        value : Number,
        maxvalue : Number,
    },
    render : (h, { props : { maxvalue, value }, listeners}) =>
        h('div', { class : 'power-meter'}, [
            h('button', { class : 'btn', on : { click : listeners?.click }}, '🍆'),
            h('div', { class : ''},[
                h('div', { class : 'power-box' },
                    Array.from({ length : maxvalue }).map((_, i) =>h('div', { class : i < value ? 'on' : '' }))),
            ]),
        ]),
       
};