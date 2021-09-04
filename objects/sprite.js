export const image_index = function*(length){
    let i = 0;

    while(true){
        if(++i > length) i = 0;
        yield i;
    };
}

export const SpriteSheet = function({
    image,
    base
}){
    const handle = Promise.custom();
    
    createImageBitmap(base, image.dx, image.dy, image.w * image.n, image.h).then(bitmap=>{
        this.img = bitmap;
        handle.resolve(this);
    });

    this.image = { w : image.w, h : image.h, n : image.n, x : image.x, y : image.y };
    this.ready = handle.prom;
};

Object.assign(SpriteSheet.prototype,{
    draw : function(ctx, index, x, y){
        if(!this.img) return console.log(this);
    
        ctx.drawImage( this.img, ( index % this.image.n ) * this.image.w, 0, this.image.w, this.image.h, x - this.image.x, y - this.image.y, this.image.w, this.image.h );
    }
});

export const SpriteSheetSheet = function({
    base,
    sheets = []
}){
    const img = new Image();
    img.src = base;
    let i = true;

    img.onload = e=>Promise.all(sheets.reduce((p, c)=>{ 
            this[c.name] = new SpriteSheet({ base : img, image : c.image });
            p.push(this[c.name].ready);
            return p;
        }, [])).then(handle.resolve);
        
    this.current = null;
    const handle = Promise.custom();

    this.ready = handle.prom;
    this.ready.then(self=>delete self.ready);

};