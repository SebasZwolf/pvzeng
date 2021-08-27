export const css = /*css*/`
    .use-item{
        box-sizing: border-box;
        padding: 4px; border-radius : 50%;

        border: 4px solid gold;

        min-width: 56px;
        aspect-ratio: 1;

        box-shadow: 0 0 0 2px inset #000, 0px 1px 2px 3px inset #0008, 1px 2px 4px 6px inset #fff4, 0px -10px 10px 2px inset #fff4, 0 2px 2px 1px #0006;
        position: relative;
        letter-spacing : -2px;
    }
    .use-item > span{ position: absolute; }
    .use-item > .cost{
        bottom : -25%;
        left : 0; right : 0;
        background-color : #fee;
        box-shadow: 0 1px 2px 0px #0008;
    }
    .use-item > .amnt{
        top : -25%;
        left : 0; right : 0;

        font-weight: 900;
        font-size: 18px;
        color: #fff;
        text-shadow: 0 0 2px #000, 0 0 2px #000, 0 0 2px #000;
        font-family: monospace;
    }
    .use-item > .amnt:before{ content: 'x' }
    .use-item:before{
        content: ''; position: absolute;
        top: -6px; left: -6px; bottom: -6px; right: -6px;
        
        border: 2px solid #000; border-radius: 50%; border-color: #000 #000 var(---ring) var(---ring);
        animation: spin 10s linear infinite;
    }
    .use-item:not(:last-child){ margin-right: 8px;}
    .use-item:active{
        transform: translateY(1px);
        box-shadow: 0 0 0 2px inset #000, 0px 1px 2px 3px inset #0008, 1px 2px 4px 6px inset #fff4, 0px -10px 10px 2px inset #fff4, 0 1px 3px 1px #0008;
    }
`

export default{
    functional: true,
    render : (h, {props, listeners : lstr})=>{
        const {icon = '', cost = 0, amount = 0, color : backgroundColor = '#fff'} = props.item ?? {};

        return h('button', { class : 'use-item' , style : { backgroundColor, '---ring' : backgroundColor }, on : lstr },[
            icon,
            h('span', { class : 'cost' }, cost),
            h('span', { class : 'amnt' }, amount),
        ]);
    }
}