const DefGui = {
    name : 'def-gui',
    render : function(h, d) { return h('h1','def')},
    functional: true
}
 
const guiPlugin = {
    install : (Vue, options)=>{
        Vue.component('GuiRouter', {
            data : ()=>({
                current : DefGui
            }),
            computed:{
            },
            updated : function(e){
                this.$emit('update', this.$children[0]);
            },
            render : function(h){ return h(this.current,{
                on : {
                    css : c=>this.$emit('css', c)
                }
            })}
        });
    }
};


export default guiPlugin;
