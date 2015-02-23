'use strict';
var async = require('async');
var data={};
var cpCache=[];

function createData(items) {
    Object.keys(items).forEach(function(item) {
        if (typeof(items[item])=='object') {
            data[item]={};
            items[item].forEach(function(item2) {
                data[item][item2]={};
                if (typeof(data[item2])==='undefined') {data[item2]={};}
            });
        } else {
            data[items[item]]={};
        }
   });
}
function deleteTask(ditem) {
    if (typeof(data[ditem]!=='undefined')) {delete data[ditem];}
    Object.keys(data).forEach(function(item) {
        if (typeof(data[item][ditem]!=='undefined')) {
            delete data[item][ditem];
        }
    });
}

function nextTask(grunt,q) {
    Object.keys(data).forEach(function(item) {
        if (typeof(data[item])!='number') {
        if (Object.keys(data[item]).length===0) {
            data[item]=1;
            grunt.verbose.writeln('start '+item);
            q.push(item,function(err) {
                grunt.verbose.writeln('done '+item);
                deleteTask(item);
                nextTask(grunt,q);
            });
        }}
    });
}

module.exports = function (grunt) {
    grunt.registerMultiTask('concurrentdep', 'Run grunt tasks concurrently', function () {
        var spawnOptions;
        var options=this.options({
            limit:4
        });
        if (options.logConcurrentOutput) {
            spawnOptions = { stdio: 'inherit' };
        }
        createData(this.data);
        var done = this.async();
        var q = async.queue(function (task, callback) {
            var cp=grunt.util.spawn({
                grunt: true,
                args: [task].concat(grunt.option.flags()),
                opts: spawnOptions
            }, function (err, result, code) {
                if (err || code > 0) {
                    grunt.warn(result.stderr || result.stdout);
                }
                grunt.log.writeln('\n'+result.stdout);
                callback();
            });
            cpCache.push(cp);
        }, options.limit);
        q.drain=function() {done();};
        nextTask(grunt,q);
    });
};
process.on('exit', function () {
    console.log('exit');
    cpCache.forEach(function (el) {
        el.kill();
    });
});
