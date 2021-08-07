export const dicc = {
    plant : {
        type : {
            melee : 0,
            range : 1,
            asist : 2
        }
    }
};

export const almanac = ({game_data})=>({
    plants : {
        peashoter : {
            step : function(scene, brakes){
            },
            type : dicc.plant.type.range,
            anims : {
                iddle : {

                },
                shoot : {

                }
            }
        }
    }
});
