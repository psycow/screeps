var warrior = {
    name: 'warrior',
    parts: [
        [TOUGH, MOVE, ATTACK, ATTACK],
        [TOUGH, MOVE, MOVE, ATTACK, ATTACK],
        [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK]
    ],

    move_to_room: function(creep, room)
    {
        if(creep.room.name == room)
            return true;

        var exits = Game.map.findExit(creep.room, creep.memory.targetRoom)
        var exit = creep.pos.findClosestByRange(exits)
        creep.moveTo(exit);
    },

    action: function(creep)
    {
        if(!this.move_to_room(creep, creep.memory.targetRoom))
            creep.memory.expiresAt += 1
        else
        {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS);
            if (!targets.length) {
                targets = creep.room.find(FIND_HOSTILE_SPAWNS);
            }

            if (targets.length) {
                var target = creep.pos.findClosestByRange(targets);
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }

            if (!targets.length) {
                var flags = creep.room.find(FIND_FLAGS, {filter: function(f){return _.startsWith(f.name, 'Rest')}});
                //console.log(flags);
                if(flags.length)
                    this.rest(creep, creep.pos.findClosestByRange(flags).name);
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(warrior, proto);
