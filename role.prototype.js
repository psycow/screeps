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

        if(!creep.memory.is_multiroom && creep.room.name != creep.memory.roomName)
            return this.move_to_room(creep);

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


        var energies = creep.pos.findInRange(FIND_DROPPED_ENERGY, 5);
        if(energies.length)
        {
            //console.log(creep, 'scavenging', energies);
            var energy = creep.pos.findClosestByRange(energies);
            if(creep.pickup(energy) == ERR_NOT_IN_RANGE)
                creep.moveTo(energy);
        }
        else
        {
            var targets = _.filter(
                    _.map(Memory.storages[creep.memory.roomName], Game.getObjectById),
                    (s) => s.store[RESOURCE_ENERGY] > 0 > 0
            );
            /*var targets = _.filter(creep.room.find(FIND_STRUCTURES), function(s) {
                                return ((s.structureType == STRUCTURE_CONTAINER
                                      || s.structureType == STRUCTURE_STORAGE)
                                        && s.store[RESOURCE_ENERGY] > 0
                                        && s.pos.findInRange(FIND_SOURCES, 2).length == 0
            )});*/
            //console.log(creep, 'destoring', targets);
            if(targets.length) {
                //console.log(_.pluck(targets, 'structureType'));
                var target = creep.pos.findClosestByRange(targets)
                if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                };
            }
            else
            {
                var flags = creep.room.find(FIND_FLAGS, {filter: function(f){return _.startsWith(f.name, 'Rest')}});
                //console.log('Rest', flags);
                if(flags.length)
                    this.rest(creep, creep.pos.findClosestByRange(flags).name);
            }
        }
    },

    body_cost: function(body) {
        return _.sum(_.map(body, _.partial(_.get, BODYPART_COST)));
    },

    best_body: function() {
        var max_cost = Memory.max_spawn_cost;
        var best = false;
        for(var i in this.parts) {
            var body = this.parts[i];
            if(this.body_cost(body) > max_cost)
                return best;
            best = body;
        }
        return best;
    },

    move_to_room: function(creep, roomName)
    {
        if(roomName == undefined)
            roomName = creep.memory.roomName;
        if(creep.room.name == roomName)
            return true;
        //console.log('move_to_room', creep, roomName);
        var exits = Game.map.findExit(creep.room, roomName)
        var exit = creep.pos.findClosestByPath(exits)
        creep.moveTo(exit);
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

    kill_all: function()
    {
        _.forEach(
            _.filter(Game.creeps, (creep) => creep.memory.role == this.name),
            (creep) => creep.suicide()
        );
    }
};

module.exports = proto;
