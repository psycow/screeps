var roleMiner = {
    name: 'miner',
    parts: [
        [WORK, WORK, MOVE],
        [WORK, WORK, WORK, MOVE, MOVE],
        [WORK, WORK, WORK, WORK, MOVE, MOVE],
        ],
    action: function (creep) {
        var source = Game.getObjectById(creep.memory.source);
        if(!source)
            return;


        for(var n in creep.memory.helpers) {
            var id = creep.memory.helpers[n];
            //if(id && Game.creeps[id] == undefined) {
            //    delete creep.memory.helpers[id];
            //    console.log('clean dead helpers '+id+' for '+ creep.name)
            //}
            //console.log(creep.name, n, id, Game.creeps[id])
        }


        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        };
    },


    on_init: function(creep) {
        creep.memory.is_near_source = false;
        this.set_source(creep);
    },

    set_source: function(creep) {
        console.log('find source');

        for(var src_id in Memory.sources)
        {
            var miner = Memory.sources[src_id].miner;
            if(miner && Game.creeps[miner] == undefined)
                delete Memory.sources[src_id];
        }

        var sources = creep.room.find(FIND_SOURCES, {
            filter: function(source)
            {
                return (Memory.sources[source.id] == undefined);

                if(Memory.sources[source.id] == undefined ||
                   Memory.sources[source.id].miner == undefined ||
                   Memory.sources[source.id].miner == creep.id)
                    return true;

                if(Game.getObjectById(Memory.sources[source.id].miner) == null)
                    return true;

                return false;
            }
        });

        if(sources.length == 0)
            return;

        var source = sources[0];
        console.log('found : ' + source);

        Memory.sources[source.id] = { id: source.id, miner: creep.id};
        creep.memory.source = source.id;

        var spawn = source.pos.findClosestByRange(FIND_MY_SPAWNS);
        var steps = spawn.pos.findPathTo(source).length * 2;
        var haulers_needed = Math.round((steps * 6) / 100);

        if(haulers_needed > 5)
            haulers_needed = 5;
        creep.memory.haulers_needed = haulers_needed;
        return source;
    },

    on_death: function(creep) {
        console.log('On Death :' + creep.name);
        var source_id = creep.memory.source;
        delete Memory.sources[source_id];
    }

};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleMiner, proto);
