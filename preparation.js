!Array.prototype.choose && Object.defineProperty(Array.prototype, 'choose', {
    value: function() { return this[Math.floor(Math.random()*this.length)]; }
});

Promise.custom = function(){
    const ret = {};
    ret.prom = new Promise((resolve, reject)=>({resolve : ret.resolve, reject : ret.reject} = {resolve, reject}));
    return ret;
}
    
Math.lerp = (start, end, amt)=>Math.round((1-amt)*start+amt*end);
Math.apro = (start, end, amt)=>start > end ? Math.max(0, start - amt) : Math.min(0, start + amt);