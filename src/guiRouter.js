const current = { render : function(h, d) { return h('h1','def')}, functional: true }

const comp = {
    data : ()=>({
        current,
        css : null,
    }),
    methods : {
        play    : function (component){
            if (component === null) {
                console.trace();
                return;
            }
            this.current = component;
            this.$emit('router', 'view changed!', console.log);
        },
    },
    render : function(h){
        return h('div', { class : 'router-window' },[
            h('component', { is : 'style' }, this.css),
            h(this.current, { on : { css : css=>{ if(0 == css?.length ?? 0) return; this.css = css; this.$emit('router', `css updated to ${css.length} characters!`); } }, class : 'game-window' }, ''),
        ]);
    }
}

export default comp;

