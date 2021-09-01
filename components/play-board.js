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

}
.game-board.active { border: 2px solid #f004; box-sizing: content-box; margin: -2px; }
.game-board.active > .cell { pointer-events : initial; }
.game-board.active > .cell.active{ 
    opacity : 1; 
    box-shadow: 0 0px 8px 0 #000a;
}

.game-board.active > .cell.active::before,
.game-board.active > .cell.active::after{
    content : '';
    position: absolute;
    pointer-events: none;

    top : 0; left : 0; right : 0; bottom : 0;
    background-color: #fff6;

}

.game-board.active > .cell.active::before{
    transform : scale( var(---vx), 1); 
    box-shadow: 0 2px 4px 0 #0004;
}
.game-board.active > .cell.active::after{
    transform : scale(1 , var(---vy));
    box-shadow: 0 0px 4px 0 #0004;
}
`

const dcell = 'cell', acell = 'cell active';

export default{
    functional : true,
    render : (h, { props : { pbg : { pos, siz, dim }, active }, listeners : lst } )=>h('div', { 
        class : {
            'game-board' :  true,
            'active' :      active
        },
        style : { 
            top : pos.y, left : pos.x, width : siz.x, height : siz.y,
            'grid-template-columns' : `repeat( ${dim.x}, auto)`,
            '---vx' : dim.x * 2,
            '---vy' : dim.y * 2,
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