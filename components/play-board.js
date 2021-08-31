export const css=/*css*/`
.game-board {
    position : absolute;
    display: grid;
    overflow: hidden;
    box-sizing : border-box;
}
.game-board > .cell {
    opacity : 0;
    
    box-sizing: border-box;
    position: relative;

    box-shadow: 0 0px 8px 0 #000a;
}
.game-board.active { border: 2px solid #f004; }
.game-board.active > .cell { pointer-events : initial; }
.game-board.active > .cell.active{ opacity : 1; }

.game-board.active > .cell.active::before,
.game-board.active > .cell.active::after{
    content : '';
    position: absolute;
    pointer-events: none;

    ---vx : 1; ---vy : 1;

    top : 0; left : 0; right : 0; bottom : 0;
    transform : scale(var(---vx), var(---vy));
    background-color: #fff6;

}

.game-board.active > .cell.active::before{ ---vx : 20; 
    box-shadow: 0 2px 4px 0 #0004;
}
.game-board.active > .cell.active::after{  ---vy : 20; 
    box-shadow: 0 0px 4px 0 #0004;
}
`

const dcell = 'cell', acell = 'cell active';

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
            class : dcell,
            on : {
                drop  : ({target})=>{
                    target.className = dcell; lst?.plant({ cell : i});
                },
                dragenter : ({target})=>{ target.className = acell },
                dragleave : ({target})=>{ target.className = dcell }
            }
        }, '' )))
}