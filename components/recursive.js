const template = /*html*/`
    
    <div v-if="(nodes) && (typeof nodes === 'object') && (level < 3)" style="display:flex; flex-direction:column">
        <div style="display: flex; flex-direction:row; gap: 4px">
            <span>[{{value}}]</span>
            <div style="display: flex; flex-direction: column">
                <recursive v-for="(item, index) in decompose(nodes)" :key="index" :nodes="item[1]" :value="item[0]" :level="level + 1"></recursive>
            </div>
        </div>
    </div>
    <div v-else>{{value}}:{{nodes}}</div>
`;

export default {
    name : 'recursive',
    template : template,
    props:{
        level : Number,
        nodes : Array,
        value : String
    },
    methods:{
        decompose(_d){
            return Object.entries(_d);//.map(_i => `${_i[0]}: ${_i[1]}`);
        }
    }
}