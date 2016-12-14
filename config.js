

var config = {
    colonies: {
        W48S61: {
            spawn_from: ['Spawn2', 'Spawn1'],
            sources: [
                {id: '57ef9d2186f108ae6e60d4c2', n:3},
                {id: '57ef9d2186f108ae6e60d4c4', n:2},
            ],
            population: [
                {role:'harvester',   max:2, memory: {source: '57ef9d2186f108ae6e60d4c2'}, debug:false},
                {role:'transporter', max:2, memory: {path: [{x:21, y:21, room:'W48S61'}, {x:14, y:11, room:'W48S61'}]}},
                {role:'upgrader',    max:4},
                {role:'harvester',   max:2, memory: {source: '57ef9d2186f108ae6e60d4c4'}, debug:false},
                {role:'transporter', max:4, memory: {path: [{x:21, y:21, room:'W48S61'}, {x:43, y:45, room:'W48S61'}]}, debug:false},
                {role:'builder',     max:4},
                {role:'carrier',     max:1},
              //{role:'healer',      max:0, memory: {}},
            ],
            wall_max: 50000,
        },

        W48S62: {
            spawn_from: ['Spawn2'],
            sources: [
                {id: '57ef9d2186f108ae6e60d4c6', n:3},
                {id: '57ef9d2186f108ae6e60d4c8', n:3}
            ],
            population: [
                {role:'harvester',   max:2, memory: {source: '57ef9d2186f108ae6e60d4c6'}, debug:false},
                {role:'transporter', max:2, memory: {path: [{x:23, y:22, room:'W48S62'}, {x:36, y:24, room:'W48S62'}]}},
                {role:'harvester',   max:2, memory: {source: '57ef9d2186f108ae6e60d4c8'}, debug:false},
                {role:'transporter', max:2, memory: {path: [{x:23, y:22, room:'W48S62'}, {x:27, y:36, room:'W48S62'}]}},
                {role:'upgrader',    max:4},
                {role:'warrior',     max:1, memory: {targetRoom: 'W48S62'}, debug:false},
                {role:'builder',     max:1, memory: {can_harvest:false, source: '57ef9d2186f108ae6e60d4c6'}},
              ],
              wall_max: 50000,
        },

        /*W49S61: {
            spawn_from: ['Spawn1'],
            sources: [
                {id: '57ef9d1e86f108ae6e60d482', n:3}
            ],
            population: [
                {role:'warrior',     max:3, memory: {targetRoom:'W49S61'}},
                {role:'harvester',   max:3, memory: {source: '57ef9d1e86f108ae6e60d482'}, debug:false},
                {role:'transporter', max:2, memory: {path: [{x:21, y:21, room:'W48S61'}, {x:44, y:19, room:'W49S61'}], is_multiroom:true}, debug:false},
                {role:'builder',     max:2, memory: {can_harvest:true, source: '57ef9d1e86f108ae6e60d482'}},
                {role:'claimer',     max:1, memory: {reserve:true}},
                {role:'healer',      max:2, memory: {}},

            ]
        },*/

        W47S62: {
            spawn_from: ['Spawn2'],
            sources: [
                {id: '57ef9d2486f108ae6e60d509', n:5},
                {id: '57ef9d2486f108ae6e60d508', n:1},
            ],
            population: [
                {role:'warrior',     max:1, memory: {targetRoom:'W47S62'}},
                {role:'harvester',   max:3, memory: {source: '57ef9d2486f108ae6e60d509'}, debug:false},
                {role:'transporter', max:4, memory: {path: [{x:23, y:19, room:'W48S62'}, {x:18, y:41, room:'W47S62'}], is_multiroom:true}, debug:false},
                {role:'builder',     max:1, memory: {can_harvest:true, source: '57ef9d2486f108ae6e60d509'}},
                {role:'builder',     max:1, memory: {can_harvest:true, source: '57ef9d2486f108ae6e60d508'}},
                {role:'claimer',     max:1, memory: {reserve:true, roomName:'W47S62'}, debug:false},
                {role:'healer',      max:1, memory: {can_harvest:true, source: '57ef9d2486f108ae6e60d508'}},

            ]
        },

        /*W49S62: {
            spawn_from: ['Spawn2', 'Spawn1'],
            sources: [
                {id: '57ef9d1e86f108ae6e60d485', n:5}
            ],
            storages : [
                '58408fdb64a0f9992e7b73a8',
                '584124a169e7ade25f2affc1',
                '584203bd3c0df854561715fd',
                //'583f847d4662177c61159c06',   // Storage
                //'583c97728a5e40310ef62e26', //source de droite
                //'583c39f511b44efe153e9fa7'  //source du bas
            ],
            population: [
                {role:'warrior',     max:3, memory: {targetRoom:'W49S62'}},
                {role:'harvester',   max:3, memory: {source: '57ef9d1e86f108ae6e60d485'}, debug:false},
                {role:'transporter', max:2, memory: {path: [{x:23, y:19, room:'W48S62'}, {x:29, y:16, room:'W49S62'}], is_multiroom:true}, debug:false},
                {role:'builder',     max:2, memory: {can_harvest:true, source: '57ef9d1e86f108ae6e60d485'}},
                {role:'claimer',     max:1, memory: {reserve:true}},
                {role:'healer',      max:2, memory: {}},

            ]
        }*/


    }
};

Memory.config = config;
module.exports = config;

/*var config = {
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
};*/
