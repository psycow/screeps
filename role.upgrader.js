var actions = require('actions');

var upgrader = {
    name: 'upgrader',
    priority: 50,
    parts: [
        [WORK, CARRY,  MOVE],
        [WORK, CARRY, CARRY,  MOVE,  MOVE],
        [WORK, CARRY, CARRY, CARRY,  MOVE,  MOVE,  MOVE],
        [WORK,  WORK, CARRY, CARRY, CARRY,  MOVE,  MOVE,  MOVE],
        [WORK,  WORK,  WORK, CARRY, CARRY, CARRY,  MOVE,  MOVE,  MOVE,  MOVE,  MOVE],
        [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY]
    ],
    /** @param {Creep} creep
    action: function(creep)
    {
        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else
        {
            var proto = require('role.prototype');
            proto.fetch_from_storage(creep);
        }
    },**/

    action: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else
        {
            //actions.harvest(creep);
            this.fetch_from_storage(creep);
            /*
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.carryCapacity);
                }
            });

            if(!targets.length){
                actions.harvest(creep);
                //roleHarvester.run(creep)
            }

            if(targets.length)
            {
                var target = creep.pos.findClosestByRange(targets);
                if(creep.withdraw(target, RESOURCE_ENERGY, (creep.carryCapacity - _.sum(creep.carry))) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            */
        }
}
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(upgrader, proto);
