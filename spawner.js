/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    count: function(role)
    {
        return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
    },

    run: function() {
        var priority = ['harvester', 'harvester', 'builder'];
        var colony = {
            'harvester': 2,
            'upgrader' : 1,
            'builder'  : 0
        }

        for(var i in priority) {
            var role = priority[i];
            //console.log('Check ' + role + ' : ' + this.count(role) + '/' + colony[role]);
            if(this.count(role) < colony[role]) {
                this[role]();
                return;
            }
        }
    },

    harvester: function()
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'harvester'});
        console.log('Spawning new harvester: ' + newName);
    },
    builder: function()
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'builder'});
        console.log('Spawning new builder: ' + newName);
    },
    upgrader: function()
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,CARRY,MOVE], undefined, {role: 'upgrader'});
        console.log('Spawning new upgrader: ' + newName);
    },
    miner: function()
    {
        var newName = Game.spawns['Spawn1'].createCreep([WORK,WORK,MOVE], undefined, {role: 'miner'});
        console.log('Spawning new upgrader: ' + newName);
    }


};
