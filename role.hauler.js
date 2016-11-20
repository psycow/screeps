var roleHauler = {
    name: 'hauler',
    parts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE]
    ],

    on_init: function(creep) {
        creep.memory.miner = false;
        this.assign_miner(creep);
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
                        return (structure.structureType == STRUCTURE_CONTAINER
                           && _.sum(structure.store) < structure.storeCapacity);
                }});
            }

            if(!targets.length)
            {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER
                            &&  structure.energy < structure.energyCapacity);
                }});
            }

            if(targets.length)
                var target = creep.pos.findClosestByRange(targets);
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
            }
        }
        if(!creep.memory.hauling)
        {
            var miner = Game.getObjectById(creep.memory.miner);
            if (miner == null) {
                if(!this.assign_miner(creep))
                    this.rest(creep);
            }

            //console.log(creep+' Go to Miner '+miner);
            if (creep.carry.energy < creep.carryCapacity) {
                if(creep.pos.isNearTo(miner)) {
                    var energy = creep.pos.findInRange(FIND_DROPPED_ENERGY, 1)[0];
                    creep.pickup(energy);
                } else {
                    creep.moveTo(miner);
                }
            }
        }
    },

    assign_miner: function(creep) {
        var haulers = _.filter(Game.creeps, (c)=>c.memory.role=='hauler');
        var miners = _.filter(Game.creeps, (c)=>c.memory.role=='miner');
        //console.log(haulers);
        //console.log(miners);

        _.forEach(miners, function(miner) {
            var assigned = _.sum(_.map(haulers, (c)=>(c.memory.miner == miner.id) ));
            //console.log(miner, assigned, miner.memory.haulers_needed);
            if(assigned < miner.memory.haulers_needed)
            {
                creep.memory.miner = miner.id;
                //console.log('Assign miner "'+ miner.name +'" to hauler "'+ creep.name + '"');
                //console.log(creep.memory.miner);
                //console.log(miner.id);
                return false; // exit foreach
            }
        });
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(roleHauler, proto);
