!Array.prototype.choose && Object.defineProperty(Array.prototype, 'choose', {
    value: function() { return this[Math.floor(Math.random()*this.length)]; }
});