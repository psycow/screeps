var claimer = {
    name: 'claimer',
    parts: [
        [CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    ],

    move_to_room: function(creep, room) {
        if(creep.room.name == room)
            return true;

        var exits = Game.map.findExit(creep.room, creep.memory.targetRoom)
        var exit = creep.pos.findClosestByRange(exits)
        creep.moveTo(exit);
    },

    action: function(creep){
        if(!this.move_to_room(creep, creep.memory.targetRoom))
            creep.memory.expiresAt += 1
        else
        {
            if(creep.room.controller) {
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.memory.expiresAt += 1
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(claimer, proto);
