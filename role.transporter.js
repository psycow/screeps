var transporter = {
    name: 'hauler',
    priority: 90,
    parts: [
        [CARRY, MOVE],
        [CARRY, CARRY, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE],
        [CARRY, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
    ],

    on_init: function(creep) {},
    action: function(creep)
    {
        if(creep.memory.hauling && creep.carry.energy == 0) {
            creep.memory.hauling = false;
            creep.say('searching');
        }
        if(!creep.memory.hauling && creep.carry.energy == creep.carryCapacity) {
            creep.memory.hauling = true;
            creep.say('hauling');
        }
        var path = creep.memory.path;
        var home_pos = new RoomPosition(path[0].x, path[0].y, path[0].room);
        var mine_pos = new RoomPosition(path[1].x, path[1].y, path[1].room);

        //console.log(creep, home_pos, mine_pos);
        if(creep.memory.hauling)
        {
            if(creep.room.name != home_pos.roomName)
                return this.move_to_room(creep, home_pos.roomName);

            var targets = home_pos.findInRange(FIND_STRUCTURES, 6, {
                filter: (structure) => {
                    return (((structure.structureType == STRUCTURE_SPAWN
                           || structure.structureType == STRUCTURE_EXTENSION)
                            &&
                            (structure.energy < structure.energyCapacity)
                        ))}
            });
            if(!targets.length) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER && (structure.energy < 200)
                    )}});
            }

            if(!targets.length){
                var targets = _.filter(
                    _.map(Memory.storages[home_pos.roomName], Game.getObjectById),
                    (s) => (_.sum(s.store) < (s.storeCapacity - creep.carry.energy))
                );
                //console.log(creep, 'hauling', targets);
            }
            if(!targets.length) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_TOWER && (structure.energy < structure.energyCapacity)
                    )}});
            }
            if(targets.length) {
                var target = creep.pos.findClosestByRange(targets)
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target, {ignoreCreeps:false, reusePath:3});
            }
        }

        if(!creep.memory.hauling)
        {
            if(creep.room.name != mine_pos.roomName)
                return this.move_to_room(creep, mine_pos.roomName);

            if(creep.pos.getRangeTo(mine_pos) > 10)
                return creep.moveTo(mine_pos);

            var targets = mine_pos.findInRange(FIND_STRUCTURES, 2, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER
                        &&  structure.store[RESOURCE_ENERGY] > creep.carryCapacity)}
            });

            if(!targets.length) {
                var targets = mine_pos.findInRange(FIND_DROPPED_ENERGY, 5);
                if(targets.length)
                {
                    //console.log(creep, 'scavenging', energies);
                    var energy = creep.pos.findClosestByRange(targets);
                    if(creep.pickup(energy) == ERR_NOT_IN_RANGE)
                        creep.moveTo(energy);
                    return true;
                }
            }

            //console.log(creep, targets);
            if(targets.length)
            {
                var target = creep.pos.findClosestByRange(targets);
                var remains = (creep.carryCapacity - _.sum(creep.carry));
                //console.log(creep, target, remains);
                if(creep.withdraw(target, RESOURCE_ENERGY, remains) == ERR_NOT_IN_RANGE)
                    creep.moveTo(target);
            }
            else
            {
                creep.moveTo(mine_pos.x, mine_pos.y);
            }
        }
    },
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(transporter, proto);
