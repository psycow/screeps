var _ = require('lodash');

var proto = {

    on_init:  function(creep) {},
    on_death: function(creep) {},
    action: function(creep) {},

    run: function(creep) {
        //console.log('Execute ' + this.name + '.run | '+creep.name)
        if(creep.memory.initialized == undefined) {
            //console.log('Execute ' + this.name + '.on_init | '+creep.name)
            this.on_init(creep);
            creep.memory.initialized = true;
        }

        //console.log('Execute ' + this.name + '.action | '+creep.name)
        this.action(creep);

        if(creep.ticksToLive == 1)
            this.on_death(creep);
    },


    fetch_from_storage: function(creep, quantity, resource_id) {
        if(quantity == undefined)
            quantity = 50;
        if(resource_id == undefined)
            resource_id = Game.RESOURCE_ENERGY;

        var targets = _.filter(creep.room.find(FIND_STRUCTURES), function(s) {
                            return ((s.structureType == STRUCTURE_CONTAINER
                                  || s.structureType == STRUCTURE_STORAGE)
                                    && s.store[RESOURCE_ENERGY] > 0)});
        /*if(!targets.length)
        {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (
                        (structure.structureType == STRUCTURE_EXTENSION
                       && structure.energy == structure.energyCapacity)
                    );
            }});
        }*/

        if(targets.length) {
            //console.log(_.pluck(targets, 'structureType'));
            var target = creep.pos.findClosestByRange(targets)
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            };
        }
        else
        {
            this.rest(creep, 'RestArea2');
        }
    },

    body_cost: function(body) {
        return _.sum(_.map(body, _.partial(_.get, BODYPART_COST)));
    },

    best_body: function() {
        var max_cost = Memory.max_spawn_cost;
        var best = [];
        for(var i in this.parts) {
            var body = this.parts[i];
            if(this.body_cost(body) > max_cost)
                return best;
            best = body;
        }
        return best;
    },

    rest: function(creep, flagName, distance)
    {
        var restTarget;
        if(!distance)
            distance = 0;
        if(flagName)
            restTarget = Game.flags[flagName];
        else
            restTarget = creep.room.find(FIND_MY_SPAWNS)[0];

        if(!restTarget)
            return;

        if (creep.getActiveBodyparts(HEAL)) {
            distance = distance + 1;
        }
        else if (creep.getActiveBodyparts(RANGED_ATTACK)) {
            distance = distance + 3;
        }
        if (creep.pos.findPathTo(restTarget).length > distance) {
            creep.moveTo(restTarget);
        }
    },
};

module.exports = proto;
