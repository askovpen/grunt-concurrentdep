# grunt-concurrentdep 

[![Build Status](https://travis-ci.org/askovpen/grunt-concurrentdep.svg?branch=master)](https://travis-ci.org/askovpen/grunt-concurrentdep)
[![Dependency Status](https://david-dm.org/askovpen/grunt-concurrentdep.svg)](https://david-dm.org/askovpen/grunt-concurrentdep)
[![devDependency Status](https://david-dm.org/askovpen/grunt-concurrentdep/dev-status.svg)](https://david-dm.org/askovpen/grunt-concurrentdep#info=devDependencies)

[![NPM](https://nodei.co/npm/grunt-concurrentdep.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/grunt-concurrentdep/)

> Run grunt tasks concurrently by depends

Running slow tasks like Coffee and Sass concurrently can potentially improve your build time significantly. This task is also useful if you need to run [multiple blocking tasks](#logconcurrentoutput) like `nodemon` and `watch` at once.


## Install

```sh
$ npm install --save-dev grunt-concurrentdep
```


## Usage

```js
require('jit-grunt')(grunt); // npm install --save-dev jit-grunt

grunt.initConfig({
    concurrentdep: {
        app: {
            concat: ['csslint','jshint'],
            cssmin: ['concat'],
            csslint: ['preprocess'],
            jshint: ['preprocess'],
            uglify: ['concat'],
            phplint: []
        }
    }
});

grunt.registerTask( "default",['concurrentdep']);
```


```
                        ┌ csslint ┐        ┌ uglify ┐
run:       ┌ preprocess ┤         ├ concat ┤        ├┐
     start ┤            └ jshint ─┘        └ cssmin ┘├ done
           └ phplint ────────────────────────────────┘
```
## Options

### limit

Type: `number`  
Default: 4

Limit how many tasks that are run concurrently.

### showDuration

Type: `boolean`  
Default: `true`

You can optionally show taskduration

### logConcurrentOutput

Type: `boolean`  
Default: `false`

You can optionally log the output of your concurrent tasks by specifying the `logConcurrentOutput` option. Here is an example config which runs [grunt-nodemon](https://github.com/ChrisWren/grunt-nodemon) to launch and monitor a node server and [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch) to watch for asset changes all in one terminal tab:

```js
grunt.initConfig({
    concurrentdep: {
        options: {
            logConcurrentOutput: true
        },
        app: {
            ...
        }
    }
});

grunt.loadNpmTasks('grunt-concurrentdep');
grunt.registerTask('default', ['concurrentdep:app']);
```

*The output will be messy when combining certain tasks. This option is best used with tasks that don't exit like `watch` and `nodemon` to monitor the output of long-running concurrent tasks.*


Based on grunt-concurrent
