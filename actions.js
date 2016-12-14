module.exports = {
    harvest: function(creep) {
        if(creep.carry.energy < creep.carryCapacity)
        {

            var energies = creep.pos.findInRange(FIND_DROPPED_ENERGY, 10);
            if(energies.length)
            {
                //console.log(creep, 'scavenging', energies);
                var energy = creep.pos.findClosestByRange(energies);
                if(creep.pickup(energy) == ERR_NOT_IN_RANGE)
                    creep.moveTo(energy);
                return true;
            }

            if(creep.memory.source)
                var source = Game.getObjectById(creep.memory.source);
            else
                var source = creep.pos.findClosestByRange(FIND_SOURCES);

            var err = creep.memory.errcode = creep.harvest(source);
            if(err == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
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
