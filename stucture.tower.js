var config = require('config');

var tower = {
    run: function(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            console.log('FIRE')
            tower.attack(closestHostile);
        } else {
            var wall_max = config.colonies[tower.pos.roomName].wall_max || 5000;
            var repairTargets = tower.pos.findInRange(FIND_STRUCTURES, 30, {
                filter: function(structure){
                    if(structure.structureType == STRUCTURE_WALL || structure.structureType == STRUCTURE_RAMPART) {
                        return (structure.hits < wall_max)
                    } else {
                        return (structure.hits < structure.hitsMax)
                    }
                }
            });
            if(repairTargets.length) {
                repairTargets.sort(function(a, b) {
                    return a.hits - b.hits
                });
                tower.repair(repairTargets[0]);
            }
        }
    }
}

module.exports = tower;
