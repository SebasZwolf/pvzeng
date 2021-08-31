export const css=/*css*/`
.game-board {
    position : absolute;
    display: grid;
}
.game-board.active > .cell { 
    pointer-events : initial;
    position: relative;
}

.game-board.active > .cell.active{
    opacity : 1;
}

.game-board.active > .cell.active::before,
.game-board.active > .cell.active::after{
    content : '';
    position: absolute;

    top : 50%;
    transform : translateY(-50%);
    border : solid;

}

.game-board.active > .cell.active::before{
    left : -75%;
    border-width: 8px 0px 8px 14px;
    border-color: #fff0 #fff0 #fff0 #fffa;
}

.game-board.active > .cell.active::after{
    right : -75%;
    border-width: 8px 14px 8px 0px;
    border-color: #fff0 #fffa #fff0 #fff0;
}

.game-board > .cell {
    border: 2px dashed #fffa;
    background-color : #fff8;
    opacity : 0;

    box-sizing: border-box;
}
`
const reset = ()=>{};

export default{
    functional : true,
    render : (h, { props : { pbg : { pos , siz, dim }, active }, listeners : lst } )=>h('div', { 
        class : {
            'game-board' :  true,
            'active' :      active
        },
        style : { 
            top : pos.y, left : pos.x, width : siz.x, height : siz.y,
            'grid-template-columns' : `repeat( ${dim.x}, auto)`,
        },
        on : { dragover : e=>e.preventDefault() }
    }, Array.from({ length : dim.x * dim.y }).map((_,i)=>h('div', {
            class : 'cell',
            on : {
                drop  : ({target})=>{
                    target.className = 'cell';
                    lst?.plant({ cell : i});
                },
                dragenter : ({target})=>{ target.className = 'cell active' },
                dragleave : ({target})=>{ target.className = 'cell' }
            }
        }, '' )))
}