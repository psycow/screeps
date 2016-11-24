var warrior = {
    name: 'warrior',
    parts: [
        [TOUGH, MOVE, ATTACK, ATTACK],
        [TOUGH, MOVE, MOVE, ATTACK, ATTACK],
        [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK]
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
            if (targets.length) {
                creep.moveTo(targets[0]);
                creep.attack(targets[0]);
            }
            else {
                this.rest(creep, 'War');
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(warrior, proto);
