var actions = require('actions');

var roleBuilder = {

    name: 'builder',
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
    ],

    on_init: function(creep) {
        creep.memory.building = false;
    },

    /** @param {Creep} creep **/
    action: function(creep) {
        if(creep.memory.building == undefined)
            creep.memory.building = false;

        if(creep.memory.building && creep.carry.energy == 0)
        {
            creep.memory.building = false;
            creep.say('harvesting');
        }
        if(!creep.memory.building && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.building = true;
            creep.say('building');
        }

        if(!creep.memory.building)
            this.fetch_from_storage(creep);

        if(creep.memory.building)
        {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length)
            {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE)
                {
                    creep.moveTo(targets[0]);
                }
            }
            else
            {// repairng
                var other_job = require('role.healer');
                other_job.action(creep);
            }
        }
    },
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleBuilder, proto);
