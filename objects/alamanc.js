const canv = document.createElement('canvas');
canv.width = 6;
canv.height = 9;
const ctx = canv.getContext('2d');

const img = ctx.createImageData(6, 9);

console.log(img.data);

//for (const i in img.data)
img.data.forEach(i =>{
        i = 128;
    });

ctx.putImageData(img,0,0);

const fimg = await createImageBitmap(img);

export const almanac = ({game_data})=>({
    plants : {
        peashoter : {
            step : function(scene, brakes){
            },
            type : 'r',
            anims : {
                iddle : {
                    img : fimg
                },
                shoot : {

                }
            }
        }
    }
});
