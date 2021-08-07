import 'https://unpkg.com/vuex@3.6.2/dist/vuex.js'


export default{
    name: 'comp-a',   
    data: ()=>({
            dato : 100
        }),
    computed:{
        ...Vuex.mapState(['count'])
    },
    template:/*html*/`<h1>hola comp-a {{dato}} {{count}}!</h1>`,
}