var harvester = {
    name: 'harvester',
    priority: 100,
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, WORK, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE],
    ],

    action: function (creep)
    {
        if(creep.memory.source == undefined)
            this.set_source(creep);

        var source = Game.getObjectById(creep.memory.source);
        if(!creep.memory.harvesting && creep.carry.energy == 0)
            creep.memory.harvesting = true;
        if((creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) || (source.energy == 0))
            creep.memory.harvesting = false;

        if(creep.memory.harvesting)
        {
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }

        if(!creep.memory.harvesting)
        {
            var targets = creep.pos.findInRange(FIND_STRUCTURES, 5, {
                filter: function(s) {
                    return s.structureType == STRUCTURE_CONTAINER
                        && s.store[RESOURCE_ENERGY] < s.storeCapacity;
                }
            });
            if(targets.length)
            {
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            else
                creep.drop(RESOURCE_ENERGY);
        }
    },

    set_source: function(creep)
    {
        var room = Game.getObjectById(creep.memory.roomName) || creep.room;

        var sources = room.find(FIND_SOURCES);
        var miners = _.filter(Game.creeps, (c)=>c.memory.role == 'harvester');
        sources = _.sortBy(sources, function(src) {
            return _.sum(_.map(miners, (c)=>(c.memory.source == src.id) ));
        });

        if(!sources.length)
            return;

        var source = sources[0];
        creep.memory.source = source.id;
        console.log('found : ' + source);
        return source;
    },
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(harvester, proto);
