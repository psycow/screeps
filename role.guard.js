var guard = {
    name: 'guard',
    parts: [
        [TOUGH, MOVE, ATTACK, ATTACK],
        [TOUGH, MOVE, MOVE, ATTACK, ATTACK],
        [TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK]
    ],

    action: function(creep)
    {
        var targets = creep.room.find(FIND_HOSTILE_CREEPS);
        if (targets.length) {
            creep.moveTo(targets[0]);
            creep.attack(targets[0]);
        }
        else {
            this.rest(creep, 'ArmyRest');
        }
    }
};

var extend = require('extend');
var proto = require('role.prototype');
module.exports = extend(guard, proto);
