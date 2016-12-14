var claimer = {
    name: 'claimer',
    parts: [
        [CLAIM, MOVE, MOVE, MOVE, MOVE],
    ],

    action: function(creep){
        if(!this.move_to_room(creep, creep.memory.roomName))
            creep.memory.expiresAt += 1
        else
        {
            var rc = creep.room.controller;
            if(!rc.my) {
                if(creep.attackController(rc) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(rc);
                }
            }
            if(rc) {
                if(creep.memory.reserve) {
                    if(creep.reserveController(rc) == ERR_NOT_IN_RANGE) {
                        creep.memory.expiresAt += 1
                        creep.moveTo(rc);
                    }
                }
                else {
                    if(creep.claimController(rc) == ERR_NOT_IN_RANGE) {
                        creep.memory.expiresAt += 1
                        creep.moveTo(rc);
                    }
                }
            }
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(claimer, proto);
