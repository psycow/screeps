var spawner = require('spawner');
var manager = require('manager');
var tower = require('stucture.tower');


var controller = {

    init: function() {
        if(Memory.initialized != undefined)
            return;

        console.log('Initialization!');
        Memory.initialized = true;
        Memory.sources = {};
        Memory.population = {};
    },

    loop: function ()
    {
        //each tick
        manager.execute();
        for(var id in Game.structures){
            if(Game.structures[id].structureType == STRUCTURE_TOWER){
                tower.run(Game.structures[id])
            }
        }
        //console.log(Game.cpu.getUsed(), Game.cpu.tickLimit);

        if(Game.time % 10 == 0)
        {
            manager.update();
        }

        if(Game.time % 1000 == 0)
        {
            manager.update_cache();
        }
    }
};

controller.init();
module.exports = controller;
