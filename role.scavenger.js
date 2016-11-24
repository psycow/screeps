var scavenger = {
    name: 'scavenger',
    parts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE, MOVE],
    ],

    on_init: function(creep)
    {
        creep.memory.scavenging = false;
    },

    action: function(creep)
    {
        if(creep.memory.scavenging && creep.carry.energy == 0) {
            creep.memory.scavenging = false;
        }
        if(!creep.memory.scavenging && creep.carry.energy == creep.carryCapacity) {
            creep.memory.scavenging = true;
        }

        if(creep.memory.scavenging)
        {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_SPAWN
                          || structure.structureType == STRUCTURE_EXTENSION)
                          && structure.energy < structure.energyCapacity);
            }});

            if(!targets.length)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER
                            &&  structure.energy < 250);
                }});
            }

            if(!targets.length)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER
                           && _.sum(structure.store) < structure.storeCapacity);
                }});
            }

            if(!targets.length)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER
                            &&  structure.energy < structure.energyCapacity);
                }});
            }

            if(targets.length)
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
            }
            else
            {
                this.rest(creep, 'RestArea');
            }
        }
        if(!creep.memory.scavenging)
        {
            if (creep.carry.energy < creep.carryCapacity) {
                var energy = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                //console.log(creep, 'scavenging', energy);
                if(energy)
                {
                    creep.moveTo(energy);
                    creep.pickup(energy);
                }
            }
        }
    },
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(scavenger, proto);
