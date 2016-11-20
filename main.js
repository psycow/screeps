var spawner = require('spawner');
var manager = require('manager');
var tower = require('structure.tower');

var controller = {

    init: function() {
        if(Memory.initialized != undefined)
            return;

        console.log('Initialization!');
        Memory.initialized = true;
        Memory.sources = {};
        Memory.spawn_queue = [];
        Memory.population = {};
        Memory.prev_update = 0;
    },

    update: function() {
        var time = Game.time;
        if(Game.time < Memory.prev_update + 10)
        {
            //console.log('update ' + time);
            manager.update();
        }
        Memory.prev_update = time;
    },

    loop: function () {
        this.update();
        for(var creep in Game.creeps) {
            manager.execute(creep);
        }
        for(var id in Game.structures){
            if(Game.structures[id].structureType == STRUCTURE_TOWER){
                tower.run(Game.structures[id])
            }
        }
    }
};

controller.init();
module.exports = controller;
