const current = { render : function(h, d) { return h('h1','def')}, functional: true }

const comp = {
    data : ()=>({
        current,
        loaded : null,
    }),
    updated : function(){
        this.loaded?.(this.$children[0]) && (this.loaded = null);
    },
    methods : {
        play    : function (component){
            this.current = component;
            return new Promise( s => this.loaded = s);
        },
    },
    render : function(h){ return h(this.current,{ on : { css : c=>this.$emit('css', c) }}, [])}
}

export default comp;

