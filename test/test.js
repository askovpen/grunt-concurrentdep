'use strict';
var assert = require('assert');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;

describe('concurrentdep', function () {
  it('runs grunt tasks successfully', function () {
    assert(fs.existsSync(path.join(__dirname, 'tmp/1')));
    assert(fs.existsSync(path.join(__dirname, 'tmp/2')));
    assert(fs.existsSync(path.join(__dirname, 'tmp/3')));
  });

  it('forwards CLI args to grunt sub-processes', function (done) {
    var expected = '--arg1=test,--arg2';

    exec('grunt concurrentdep:testargs ' + expected, function () {
      assert.equal(fs.readFileSync(path.join(__dirname, 'tmp/args1'), 'utf8'), expected);
      assert.equal(fs.readFileSync(path.join(__dirname, 'tmp/args2'), 'utf8'), expected);
      done();
    });
  });

  describe('`logConcurrentOutput` option', function () {
    var logOutput = '';

    before(function (done) {
      var cp = spawn('grunt', ['concurrentdep:log']);
      var lines = 0;

      cp.stdout.setEncoding('utf8');
      cp.stdout.on('data', function (data) {
        logOutput += data;
      });
      cp.on('close', function () {
        done();
      });
    });

    it('outputs concurrentdep logging', function () {
      var expected = 'Running "concurrentdep:log" (concurrentdep) task';
      assert(logOutput.indexOf(expected) !== -1);
    });
  });
});
