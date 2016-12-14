var extend = require('extend');
var proto = require('role.prototype');
var names = require('names');
var config = require('config');


module.exports = {
    update: function() {
        this.clean_memory();
        //Memory.max_spawn_cost = _.sum(_.map(Game.spawns['Spawn1'].room.find(FIND_STRUCTURES), 'energy'));

        for(var roomName in config.colonies)
        {
            var setup = config.colonies[roomName];
            var timer = setup.timer || 1;
            if(Game.time > timer) {
                //console.log(roomName);
                this.defence(roomName);
                this.update_population(roomName, setup.population, setup.spawn_from);
            }
        }
    },

    update_cache: function()
    {
        //update cache
        Memory.storages = Memory.storages || {};

        for(var roomName in config.colonies)
        {
            var room = Game.rooms[roomName];
            if(!room)
                return;
            var setup = config.colonies[roomName];
            if(setup.storages) {
                Memory.storages[roomName] = setup.storages;
            } else {
                var targets = _.filter(room.find(FIND_STRUCTURES), function(s) {
                                    return ((s.structureType == STRUCTURE_CONTAINER
                                          || s.structureType == STRUCTURE_STORAGE)
                                            && s.pos.findInRange(FIND_SOURCES, 2).length == 0)});
                Memory.storages[roomName] = _.pluck(targets, 'id');
            }
        }
    },

    defence: function(roomName) {
        var room = Game.rooms[roomName];
        if(!room)
            return;

        var targets = room.find(FIND_HOSTILE_CREEPS);
        if(targets.length) {
            if(this.count('guard') < targets.length)
                this.spawn('guard');
        }
    },

    update_population: function(roomName, population, spawn_from)
    {
        for(var n in population)
        {
            var record = population[n];
            var role = record.role;
            var max = record.max;
            var mem = record.memory || {roomName:roomName};
            var num = this.count(role, mem);
            Memory.population[role] = num;

            if(record.debug)
                console.log('Pop:', n, role, num, max);
            if(num < max) {
                //console.log('Manger.spawn : '+role + ' ' + num + '/' + max);
                mem.roomName = roomName;
                return this.spawn(role, mem, spawn_from);
            }
        }
    },

    count: function(role, match, roomName) {
        var elements = _.filter(Game.creeps, (creep) => (creep.memory.role == role));
        if(match)
            elements = _.filter(elements, (creep)=>(_.isMatch(creep.memory, match)));
        if(roomName)
            elements = _.filter(elements, (creep) => (creep.room.name == roomName));
        return elements.length;
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
        var creeps = _.sortBy(Game.creeps, (c)=>(c.memory.priority || 0)) ;
        for(var n in creeps)
        {
            var creep = creeps[n];
            if(creep.spawning)
                continue;
            var role = creep.memory.role;
            var job = this.get(role);
            if(!job) {
                console.log('Unknown role : '+ role +' for creep '+ creep.name);
                return;
            }
            try {
                job.run(creep);
            } catch(e) {
                console.log('problem with '+role+ ' : '+creep.name);
                console.log('  ' +e);
            }
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

    spawn: function(role, memory, spawn_from) {
        var obj = this.get(role);
        if(!obj)
            return false;
        if(memory == undefined)
            memory = {};
        if(spawn_from == undefined)
            spawn_from = ['Spawn1'];

        for(var n in spawn_from)
        {
            var spawn = Game.spawns[spawn_from[n]];
            if(!spawn)
                return;
            Memory.max_spawn_cost = _.sum(_.map(spawn.room.find(FIND_STRUCTURES), 'energy'));

            if(!spawn.spawning)
            {
                memory.role = role;
                memory.priority = obj.priority || 0;
                var body = obj.best_body();
                if(!body)
                    return false;

                //var name = '[' + role + '] ' + names.get();
                var name = role + (Game.time + '').substr(-4);
                var err = spawn.createCreep(body, name, memory);
                if(err < 0) {
                    console.log('unable to spawn: ', name, err);
                    console.log('   ', body, name, memory);
                    return false;
                } else {
                    console.log(spawn_from[n], 'new ' + role + ' "' + name + '" : ' + body);
                }
                return Game.creeps[name];
            }
        }
        return false;
    }
};
