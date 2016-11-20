module.exports = {
    harvest: function(creep) {
        if(creep.carry.energy < creep.carryCapacity)
        {
            var nearest = creep.pos.findClosestByPath(FIND_SOURCES);
            if(creep.harvest(nearest) == ERR_NOT_IN_RANGE) {
                creep.moveTo(nearest);
            }
            return true;
        }
        return false;
    },

    store: function(creep)
    {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => i.structureType == STRUCTURE_CONTAINER &&
                           i.store[RESOURCE_ENERGY] < CONTAINER_CAPACITY
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }

        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER)
                     && structure.energy < structure.energyCapacity;
            }
        });
        if(targets.length > 0) {
            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    },

    withdraw: function(creep) {
        var targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_STORAGE ||
                        structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_SPAWN)
                    &&  structure.energy > creep.carryCapacity;
            }
        });
        if(targets.length > 0) {
            if(creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0]);
            }
        }
    },
};
