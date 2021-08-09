import {game_data, back_data} from '../src/game_data.js'

const src = 'https://www.pngkey.com/png/full/283-2831746_insta-icon-instagram.png'
const flag = 'https://cdn.iconscout.com/icon/free/png-512/flag-575-433737.png';

const detectMob = ()=>[/Android/i,/webOS/i,/iPhone/i,/iPad/i,/iPod/i,/BlackBerry/i,/Windows Phone/i].some((toMatchItem) => navigator.userAgent.match(toMatchItem));

const template = /*html*/`
<div class="gui-window" @drop="drop" @dragover="over">
    <div class="top-deck">
        <div class="ind">
            <img src="${src}" style="width: 24px; vertical-align: bottom; transform: scale(1.5,1.5)"/>
            <span class="label">{{money}}</span>
        </div>

        <div style="width: 100%; pointer-events: none; display: flex;">
            <div class="level-progress">
                <div :style="{ width: progress + '%' }"><img src="${src}"/></div>
                <div>
                    <div v-for="(flag, index) in flags" :key="index" :class="{ flagup : index < cflags}"></div>
                </div>
            </div>
        </div>

        <div class="ind">
            <img src="${src}" style="width: 24px; vertical-align: bottom; transform: scale(1.5,1.5)"/>
            <span class="label">{{money}}</span>
            <img src="${src}" style="width: 24px; vertical-align: bottom; transform: scale(1.5,1.5)"/>
        </div>
        <button>
            <span>&#10148;</span>
        </button>
        <button>
            <span>l l</span>
        </button>
    </div>
    <div class="plant-deck">
        <div class="plant-card" draggable="true" @dragstart="drag($event, index)" v-for="(item, index) in plants" :key="index" @click="seed_pick(index)">
            <div class="content">
                <img src="${src}" draggable="false" style="height:107%; position: relative; top: -7%; display: inline-block;"/>
                <div class="edge"></div>
            </div>
            <span class="label">{{item}}</span>
        </div>
    </div>
</div>`;

const css = /*css*/`
.level-progress{
    border: 6px solid #0008;
    padding: 2px 0px;
    border-radius: 8px;
    box-sizing: content-box;

    margin: auto;
    width: 50%;
    max-width: 260px;

    position: relative;
    height: 12px;
}

.level-progress > div:last-child{
    position: absolute;
    top: 0; left : 0; bottom: 0; right: 0;
    display: flex;
    flex-direction: row-reverse;
}

.level-progress > div > div{
    flex: 1;
    line-height: 1;
    font-size: 28px;
    
    font-weight: 800;
    letter-spacing: -1em;
}

.flagup{
    transform: translate(0,-50%);
}

.level-progress > div > div::before{content: '⚑'; color: #f26; }
.level-progress > div > div::after {content: '⚐'; color: #000; }
.level-progress > div > .flagup::before{color: lime; vertical-align: sup}

.level-progress > div:first-child{
    height: 100%;
    margin-left: auto;

    background-image: linear-gradient(#2f2, #cfc 40%, #2f2 80%, #1a4 90%);
}

.level-progress > div > img{
    height: 100%;
    transform: scale(2.5,2.5) translate(-50%,0);
    filter: drop-shadow(0px 1px 1px #000a);
}

.top-deck{
    display: flex;
    height: 48px;
    margin-bottom: 1rem;

    ---btnc : #7b9;
    gap: 4px;
}

.top-deck > button{
    position: relative;

    box-sizing: border-box;

    display: block;
    border : solid 2px #113;

    padding : 3px;
    margin: auto;

    border-radius : 8px;
    background-image: linear-gradient(to bottom right, #fff -10%, var(---btnc) 20%, var(---btnc) 42%, #245 52%);
}

.top-deck > button:active:after{
    content:'';
    position: absolute;
    top: 0; right: 0; left: 0; bottom: 0;
    
    background-color: transparent;
    box-shadow: 0 0 8px 8px inset #0428;
    border-radius: 4px;
}

.top-deck > button > span{
    white-space: nowrap;

    display: block;
    padding: 8px;
    min-width: 16px;

    font-size: 20px;
    line-height: 1;
    font-weight: 800;
    color : #fd1;
    
    text-shadow:
        +1px +0px +0px #942,
        +0px +1px +0px #942,
        -1px +0px +0px #942,
        +0px -1px +0px #942,
        +1px +2px +3px #000;

    background-color : var(---btnc);
    box-shadow: 0px 0px 3px 0px inset #0004;

    border: 1px solid var(---btnc);
    border-top: 1px solid #9db;
    border-left: 1px solid #9db;

    border-radius : 4px;
}

.top-deck > .ind{
    color: #fff;

    display: block;
    margin: auto 8px auto 8px;

    background-color: #0006;
    border-radius: 8px;

    filter: drop-shadow(0px 0px 1px #000f);

    white-space:nowrap;
}

.ind > *{
    display: inline-block;
}

.ind > img{
    filter: drop-shadow(0px 1px 0px #000a);
}

.ind > .label{
    line-height: 1;
    font-size: 22px;
    width: 60px;
    padding-right: 12px;
    text-align: right;
}

.top-deck > *{
    pointer-events: initial;
}

.plant-deck{
    background-color: transparent;

    flex : 1;
    width: 120px;

    display: flex;
    flex-direction : column;
    gap: 6px;
}

.plant-card {
    ---bc : #eed;

    width: 100%;
    aspect-ratio: 20/10;

    background-color: var(---bc);

    border: solid #000 1px;
    border-radius : 4px;

    box-shadow: 2px 2px 2px 0px #000a;

    padding: 4px;
    pointer-events: initial;
    cursor: pointer;

    position: relative;
    overflow : hidden;

    transition: transform .3s ease-out;
}

.plant-card > .content{
    position : relative;

    width : 100%;
    height : 100%;

    background-image: 
        linear-gradient(
            0deg,
            #134a,
            #8db 85%
        );
    
    border: dashed #000 1px;
}

.plant-card > .content > .edge{
    position: absolute;
    bottom : -1px;
    right : -1px;

    width : 20px;
    height : 30px;
    
    transform : skew(-45deg, 0) scale(2,1) translate(33%,0);
    background-color: var(---bc);
    
    border-left: dashed #000 1px;
}

.plant-card > .label {
    display : block;
    position: absolute;
    bottom: 0;
    right: 0;

    margin-right: 4px;
    font-size: 22px;

    color: #fff;
    text-shadow: 0px 0px 1px #000, 0px 0px 2px #000, 0px 1px 1px #000; //1px 1px 0px #000, -1px 1px 0px #000, 1px -1px 0px #000, -1px -1px 0px #000;

}

.plant-card:hover{
    ---bc : #ca3;
    transform : translate(4px, 0px);
}

.plant-card:active{
    ---bc : #982;
}

.plant-card > div > span{
    font-size: calc(max(min(2.2vw - 10px, 15px), 9px));
}
`

const flags =  Math.ceil(Math.random()*10) + 1;

export default{
    name : "gui",
    template,
    data: ()=>({
        game_data, //IMPORTANT
        plants : [
            100,200,200,75
        ],
        flags,
        cflags : Math.round(flags / 2),
        progress : 10,
        money : 0,
    }),
    methods:{
        flagactive(i){
            return (i >= this.cflags )
        },
        seed_pick(i){
            this.money += this.plants[i];
        },
        drag(e, id){
            this.$el.style.pointerEvents = 'initial';
            e.dataTransfer.setData("text", id);
            const img = e.target.firstChild.firstChild.src;

            const node = document.createElement('img');
            node.src = img;
            node.style.width = '48px';
            node.style.position = 'absolute';
            node.style.top = '-1000%';
            node.style.left = '-1000%';

            document.body.appendChild(node);

            setTimeout(()=>document.body.removeChild(node));

            e.dataTransfer.setDragImage(node,24,36);

            game_data.misc.drag = true;
        },
        drop(e){
            e.preventDefault();
            e.target.style.pointerEvents = null;
            const data = e.dataTransfer.getData("text");
            
            back_data.misc.drop = true;
        },
        over: (e)=>{
            e.preventDefault();

            game_data.mouse.x = Math.ceil(e.offsetX * game_data.misc.ratio);
            game_data.mouse.y = Math.ceil(e.offsetY * game_data.misc.ratio);
        }

    },
    mounted(){
        console.log(this.cflags, this.flags);
        this.$emit('css', css);
        const intv = setInterval(()=>this.progress = (this.progress + 1) % 100, 1000);
    },
    computed:{
    },
    components:{
    },
}