var actions = require('actions');

var roleBuilder = {
    name: 'builder',
    priority: 20,
    parts: [
        [WORK, CARRY, MOVE],
        [WORK, CARRY, CARRY, MOVE, MOVE],
        [WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        //[WORK, WORK,  WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],

    on_init: function(creep) {
        creep.memory.building = false;
    },

    /** @param {Creep} creep **/
    action: function(creep)
    {
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
        {
            if(creep.memory.can_harvest)
                return actions.harvest(creep);
            this.fetch_from_storage(creep);
        }

        if(creep.memory.building)
        {
            if(creep.memory.cons_site)
                var site = Game.getObjectById(creep.memory.cons_site);

            //console.log(creep, site);
            if(!creep.memory.cons_site || !site) {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                if(targets.length) {
                    var site = creep.pos.findClosestByRange(targets);
                    creep.memory.cons_site = site.id;
                    creep.say('New site :' + site.id);
                }
                else
                {// repairng
                    var other_job = require('role.healer');
                    other_job.action(creep);
                }
            }
            if(creep.build(site) == ERR_NOT_IN_RANGE)
                creep.moveTo(site);
        }
    },
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleBuilder, proto);
