var carrier = {
    name: 'carrier',
    parts: [
        [CARRY, MOVE, MOVE],
        [CARRY, CARRY, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
        //[CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],

    action: function (creep) {
        if(creep.memory.carrying && creep.carry.energy == 0)
            creep.memory.carrying = false;
        if(!creep.memory.carrying && creep.carry.energy == creep.carryCapacity)
            creep.memory.carrying = true;

        if(creep.memory.carrying)
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
                            &&  structure.energy < structure.energyCapacity);
                }});
            }
            //console.log(creep, targets.length, targets);
            if(targets.length)
            {
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
        }
        if(!creep.memory.carrying)
        {
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: function(s) {
                    return (s.structureType == STRUCTURE_CONTAINER
                        ||  s.structureType == STRUCTURE_STORAGE)
                        && s.store[RESOURCE_ENERGY] > 0;
                }
            });
            if(target)
            {
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
    },

};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(carrier, proto);
