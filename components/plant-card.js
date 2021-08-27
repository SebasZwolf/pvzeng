export const css = /*css*/`
    .plant-card{
        aspect-ratio : 1.85;
        cursor: pointer; pointer-events: initial;
        display: block;
        ---bc : #eed;
        background-color : var(---bc);
        transition: transform .3s ease-out;
        margin: 2px 4px 4px 0; padding : 4px;
        box-shadow: 0px 2px 2px 0px #0006;
        font-size : 1em;
    }
    .plant-card:hover{ transform : translate(4px, 0px); }
    .plant-card:active{ ---bc : #982; }
    .plant-card > .frame {
        position: relative; width: 100%; height: 100%;/* border: 1px solid #f80;*/
        background-color: #0f8;
        background-image: linear-gradient(0turn, #0206 -8px, #0000 16px), linear-gradient(315deg, #0206 12px, #0000 36px);
    }
    .plant-card > .frame > div:first-child{
        position: absolute;
        left:0; right: 0; bottom: 0;
        aspect-ratio: 1.6;
        overflow: hidden; pointer-events : none;
    }
    .plant-card > .frame > .edge {
        position: absolute; right: 0; bottom: 0;
        line-height: 0; letter-spacing: -1em;
        
        border: 16px solid transparent;
        border-bottom-color: var(---bc);
        border-right-color:  var(---bc);
    }
    .plant-card > .frame > span:last-child{
        position: absolute; right: 0; bottom: 0;
        display: block; text-align: right;
    }
    .plant-card > .frame > div > img{
        height: 100%; position: relative;
    }
`;

export default {
    name : 'plant-card',
    functional : true,
    props : {
        plant : {
            type: Object,
            default: { img : null, cost : 0 }
        }
    },
    render : (h, { props : { plant }, listeners : on } )=> 
        h('div', { class : 'plant-card', attrs : { draggable : true }, on }, [
            h('div', { class : 'frame' }, [
                h('div', {}, [
                    h('img', { attrs : { src: plant.img } }, []),
                ]),
                h('div', { class : 'edge' }, '/S'),
                h('span', {}, plant.cost.toFixed(2)),
            ]),
        ])
    
}