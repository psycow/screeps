var taxi = {
    name: 'taxi',
    parts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    ],

    on_init: function(creep) {
        creep.memory.hauling = false;
    },
    action: function(creep)
    {
        if(creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false;
        }
        if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.hauling = true;
        }

        if(creep.memory.hauling)
        {
            var cntr = creep.room.find(FIND_STRUCTURES, {filter:function(s){return s.structureType==STRUCTURE_CONTROLLER}})[0];
            //console.log(cntr, cntr.pos) ;
            var targets = cntr.pos.findInRange(FIND_STRUCTURES, 10, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER
                           && _.sum(structure.store) < structure.storeCapacity);
                }});
            if(targets.length)
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
            }

        }
        else
        { // not hauling
            var targets = Game.spawns['Spawn1'].pos.findInRange(FIND_STRUCTURES, 10, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER
                           && _.sum(structure.store) > 0);
                }});
            //console.log(creep, targets.length, targets);
            if(targets.length) {
                var target = creep.pos.findClosestByRange(targets);
                //console.log('taxi', targets.length, target);
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
            else
            {
                var scavenger = require('role.scavenger');
                scavenger.action(creep);
            }
        }
    },

};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(taxi, proto);
