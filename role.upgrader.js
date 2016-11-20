
var roleUpgrader = {
    name: 'upgrader',
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    ],
    /** @param {Creep} creep **/
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
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleUpgrader, proto);
