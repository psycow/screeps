var extend = require('extend');
var proto = require('role.prototype');
var names = require('names');
var config = require('config');

module.exports = {

    population: {
        1: {miner:1, hauler:1, upgrader:1},
        2: {miner:4, hauler:2, upgrader:3, builder:2, healer:1, guard:1, waller:1},
        3: {miner:4, hauler:3, upgrader:4, builder:4, healer:1, guard:4, waller:2, taxi:0},
        4: {miner:4, hauler:3, upgrader:2, builder:2, healer:0, guard:2, waller:0, taxi:4},
    },

    update: function() {
        this.clean_memory();

        //counts max spawn cost
        Memory.max_spawn_cost = _.sum(_.map(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES), 'energy'));
        this.grow_population();
        this.defence();
    },

    defence: function() {
        var targets = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
        if(targets.length) {
            if(this.count('guard') < targets.length)
                this.spawn('guard');
        }
    },

    grow_population: function() {
        var level = Game.spawns['Spawn1'].room.controller.level;
        var pop = this.population[level];
        for(var role in pop)
        {
            var num = this.count(role);
            Memory.population[role] = num;
            if(role == 'hauler') {
                pop[role] = _.sum(_.map(_.filter(Game.creeps, (creep) => creep.memory.role == 'miner'),
                                                        (creep) => creep.memory.haulers_needed));
            }
            if(num < pop[role]) {
                console.log('Manger.spawn : '+role + ' ' + num + '/' + pop[role]);
                this.spawn(role);
            }
        }
        return pop;
    },

    count: function(role) {
        return _.filter(Game.creeps, (creep) => creep.memory.role == role).length;
    },

    clean_memory: function(role) {
        for(var name in Memory.creeps)
        {
            if(!Game.creeps[name]) {
                console.log('Clearing non-existing creep memory:', name, Memory.creeps[name].role);
                delete Memory.creeps[name];

            }
        }
    },

    execute: function(name)
    {
        var creep = Game.creeps[name];
        var role = creep.memory.role;
        var job = this.get(role);
        if(!job) {
            console.log('Unknown role : '+ role +' for creep '+ creep.name);
            return;
        }
        try {
            job.run(creep);
        } catch(e) {
            console.log('problem with '+role+ ' : '+name);
            console.log('  ' +e);
        }
    },

    get: function(role) {
        try {
            var obj = require("role." + role);
            return extend(obj, proto);
        } catch(e) {
            console.log(e);
            return false;
        }
    },

    spawn: function(role, memory) {
        var obj = this.get(role);
        if(!obj)
            return false;
        if(memory == undefined)
            memory = {};
        memory.role = role;
        var body = obj.best_body();
        var name = '[' + role + '] ' + names.get();
        var name = Game.spawns['Spawn1'].createCreep(body, name, memory);
        if(name < 0) {
            console.log('unable to spawn', name);
            return false;
        } else {
            console.log('Spawning new ' + role + ' "' + name + '" : ' + body);
        }
        return Game.creeps[name];
    }
};
