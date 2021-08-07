import {game_data} from '../src/game_data.js'

const src = 'https://www.pngkey.com/png/full/283-2831746_insta-icon-instagram.png'

const template = /*html*/`
<div class="gui-window" @drop="drop" @dragover="over">
    <div class="top-deck">
        <div class="ind">
            <img src="${src}" style="width: 24px; vertical-align: bottom; transform: scale(1.5,1.5)"/>
            <span class="label">{{money}}</span>
        </div>
        <div style="width: 100%; pointer-events: none;"></div>
        <button>pause</button>
        <button>exit</button>
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
    <!--recursive :nodes="game_data" :level="0" :value="''"></recursive-->
</div>`;

const css = /*css*/`
.top-deck{
    display: flex;
    height: 48px;
    padding-left: 1rem;
    margin-bottom: 1rem;
}

.top-deck > .ind{
    color: #fff;

    display: block;
    margin: auto;
    height: min-content;

    background-color: #0006;
    border-radius: 8px;

    padding-right: 16px;

    
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
export default{
    name : "gui",
    template,
    data: ()=>({
        game_data, //IMPORTANT
        plants : [
            100,200,200,75
        ],
        money : 0,
    }),
    methods:{
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

            setTimeout(()=>{
                document.body.removeChild(node);
            });

            e.dataTransfer.setDragImage(node,24,36);
        },
        drop(e){
            e.preventDefault();
            //this.$el.style.pointerEvents = null;
            e.target.style = '';
            const data = e.dataTransfer.getData("text");
            console.log(e);
        },
        over(e){
            e.preventDefault();
            //console.log(e);
        }
    },
    mounted(){
        this.$emit('css', css);
    },
    computed:{
    },
    components:{
        //recursive : ()=>import(/* webpackPrefetch: true */ '/components/recursive.js')
    },
}