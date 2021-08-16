const canv = document.createElement('canvas');
canv.width = 18;
canv.height = 9;

const ctx = canv.getContext('2d');
ctx.imageSmoothingEnabled = false;

ctx.lineWidth = 1; ctx.strokeStyle = '#084';

ctx.fillStyle = '#0f8';
ctx.fillRect(0,0,6, ctx.canvas.height);
ctx.strokeRect(0.5,0.5,5, ctx.canvas.height - 1);

ctx.fillStyle = '#f80';
ctx.fillRect(6,0,6, ctx.canvas.height);
ctx.strokeRect(6.5,0.5,5, ctx.canvas.height - 1);

ctx.fillStyle = '#80f';
ctx.fillRect(12,0,6, ctx.canvas.height);
ctx.strokeRect(12.5,0.5,5, ctx.canvas.height - 1);

const [iddle, shoot, ...rest] = await Promise.all([
    createImageBitmap(ctx.getImageData( 0,0,6,ctx.canvas.height)),
    createImageBitmap(ctx.getImageData( 6,0,6,ctx.canvas.height)),
    createImageBitmap(ctx.getImageData(12,0,6,ctx.canvas.height))
]);

export const almanac = ({game_data})=>({
    plants : {
        peashoter : {
            type : 'r',
            create : (self, scene) =>{

            },
            step : (self, scene) =>{
                self.tt = self.tt ?? 0;
                self.tt ++;

                if(self.tt % 200 == 0) { self.sprite = shoot; setTimeout(()=>self.sprite = iddle, 300)}
            },
            anims : {
                iddle : {
                    img : iddle,
                    dx : 6,
                },
                shoot : {
                    img : shoot,
                    dx : 6
                }
            }
        }
    }
});
