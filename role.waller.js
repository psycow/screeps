var actions = require('actions');

var roleWallBuilder = {

    name: 'waller',
    WALL_MAX: 1000,
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    ],

    on_init: function(creep) {
        creep.memory.walling = false;
    },

    /** @param {Creep} creep **/
    action: function(creep) {
        if(creep.memory.walling && creep.carry.energy == 0)
        {
            creep.memory.walling = false;
            creep.say('harvesting');
        }
        if(!creep.memory.walling && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.walling = true;
            creep.say('walling');
        }

        if(!creep.memory.walling)
            this.fetch_from_storage(creep);

        if(creep.memory.walling)
        {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: function(structure){
                    return (structure.structureType == STRUCTURE_WALL
                        ||  structure.structureType == STRUCTURE_RAMPART)
                        && (structure.hits < 3000);
                }
            });
            //console.log('waller', this.WALL_MAX, targets);
            if(targets.length) {
                target = creep.pos.findClosestByRange(targets)
                if(creep.repair(target) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
            else
            {// repairng
                var other_job = require('role.healer');
                other_job.action(creep);
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleWallBuilder, proto);
