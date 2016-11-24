var config = {
    colonies: {
        W62N37: {
            spawn_from: 'Spawn1',
            home: {id:'583093e92873dc776208691a', x:6, y:33},
            sources: [
                {id: '57ef9cd886f108ae6e60ce6c', x:6,  y:28, n:4},
                {id: '57ef9cd886f108ae6e60ce6d', x:24, y:42, n:4},
            ],
            paths: [
                {from:{x:6, y:33}, to:{x:6,  y:28}, n:1}, //Source <-> Home
                {from:{x:6, y:33}, to:{x:6,  y:42}, n:3},
                {from:{x:6, y:33}, to:{x:38, y: 5}, n:3},  //Controller <-> Home
                //{from:{x:6, y:33}, to:{room:'W63N37', x:23, y:40}, n:3},
            ],
            controller: {id: '57ef9cd886f108ae6e60ce6b', x:38,  y:5, n:5},
            population: {
                harvester: 4, carrier: 5, mover:2, upgrader: 2, builder: 2, guard: 2
            },
        },

        W62N36: {
            spawn_from: 'Spawn1',
        }
    }
};

Memory.config = config;
module.exports = config;
