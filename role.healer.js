var roleHealer = {
    name: 'healer',
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    ],
    on_init: function(creep) {
        creep.memory.healing = false;
    },

    action: function(creep) {
        if(creep.memory.healing && creep.carry.energy == 0) {
            creep.memory.healing = false;
            creep.say('harvesting');
        }
        if(!creep.memory.healing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.healing = true;
            creep.say('Healing');
        }

        if(!creep.memory.healing)
        {
            var proto = require('role.prototype');
            proto.fetch_from_storage(creep);
        }

        if(creep.memory.healing) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(structure) {
                    return (structure.hits < structure.hitsMax)
                        && (structure.structureType != STRUCTURE_WALL)
                        && (structure.structureType != STRUCTURE_RAMPART);
                }
            });
            if(targets.length) {
                var target = creep.pos.findClosestByRange(targets)
                if(creep.repair(target) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
            else
            {// repairng
                var other_job = require('role.upgrader');
                other_job.action(creep);
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleHealer, proto);
